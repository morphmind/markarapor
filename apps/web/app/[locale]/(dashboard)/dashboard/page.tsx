import { auth } from "~/lib/auth";
import { getTranslations } from "next-intl/server";
import { prisma } from "@markarapor/database";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  BarChart3,
  FileText,
  PlayCircle,
  Sparkles,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  const t = await getTranslations("dashboard");

  // Get user's workspaces
  const userWorkspaces = await prisma.workspaceMember.findMany({
    where: { userId: session?.user?.id },
    select: { workspaceId: true, workspace: { select: { credits: true } } },
  });

  const workspaceIds = userWorkspaces.map((w) => w.workspaceId);
  const totalCredits = userWorkspaces.reduce((sum, w) => sum + (w.workspace.credits || 0), 0);

  // Get stats
  const [workflowCount, brandCount, recentRuns] = await Promise.all([
    prisma.workflow.count({
      where: { brand: { workspaceId: { in: workspaceIds } } },
    }),
    prisma.brand.count({
      where: { workspaceId: { in: workspaceIds } },
    }),
    prisma.workflowRun.findMany({
      where: { workflow: { brand: { workspaceId: { in: workspaceIds } } } },
      orderBy: { startedAt: "desc" },
      take: 5,
      include: {
        workflow: {
          select: { name: true, brand: { select: { name: true } } },
        },
      },
    }),
  ]);

  // Count completed runs this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const reportsThisMonth = await prisma.workflowRun.count({
    where: {
      workflow: { brand: { workspaceId: { in: workspaceIds } } },
      status: "COMPLETED",
      completedAt: { gte: startOfMonth },
    },
  });

  const stats = [
    {
      title: t("totalWorkflows"),
      value: String(workflowCount),
      icon: PlayCircle,
      change: workflowCount > 0 ? "Aktif" : "Başlayın",
    },
    {
      title: t("activeBrands"),
      value: String(brandCount),
      icon: Users,
      change: brandCount > 0 ? "Aktif" : "Ekleyin",
    },
    {
      title: t("reportsThisMonth"),
      value: String(reportsThisMonth),
      icon: FileText,
      change: "Bu ay",
    },
    {
      title: t("creditsRemaining"),
      value: String(totalCredits),
      icon: Sparkles,
      change: totalCredits > 20 ? "Yeterli" : "Düşük",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("welcome", { name: session?.user?.name?.split(" ")[0] || "User" })}
        </h1>
        <p className="text-muted-foreground">{t("overview")}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Workflows */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>{t("recentWorkflows")}</CardTitle>
            <CardDescription>Son çalışan workflow'larınız</CardDescription>
          </CardHeader>
          <CardContent>
            {recentRuns.length === 0 ? (
              <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <PlayCircle className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>Henüz çalıştırılmış workflow yok</p>
                  <p className="text-sm">İlk workflow'unuzu oluşturun!</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {recentRuns.map((run) => (
                  <Link
                    key={run.id}
                    href={`/workflows/${run.workflowId}`}
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        run.status === "COMPLETED"
                          ? "bg-green-100 text-green-600"
                          : run.status === "FAILED"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}>
                        {run.status === "COMPLETED" ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : run.status === "FAILED" ? (
                          <XCircle className="h-4 w-4" />
                        ) : (
                          <Clock className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{run.workflow.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {run.workflow.brand.name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {new Date(run.startedAt).toLocaleDateString("tr-TR")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {run.creditsUsed || 0} kredi
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>{t("quickActions")}</CardTitle>
            <CardDescription>Hızlı işlemler</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <QuickAction
              icon={<Users className="h-4 w-4" />}
              title="Marka Ekle"
              description="Yeni bir marka oluşturun"
              href="/brands/new"
            />
            <QuickAction
              icon={<PlayCircle className="h-4 w-4" />}
              title="Workflow Oluştur"
              description="Otomatik rapor akışı"
              href="/workflows/new"
            />
            <QuickAction
              icon={<BarChart3 className="h-4 w-4" />}
              title="Bağlantı Ekle"
              description="Google hesabı bağla"
              href="/connections"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function QuickAction({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-4 rounded-lg border p-3 transition-colors hover:bg-muted"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </a>
  );
}
