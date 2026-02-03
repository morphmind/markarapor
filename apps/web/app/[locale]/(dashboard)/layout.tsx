import { redirect } from "next/navigation";
import { auth } from "~/lib/auth";
import { prisma } from "@markarapor/database";
import { Sidebar } from "~/components/dashboard/sidebar";
import { Header } from "~/components/dashboard/header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    redirect("/login");
  }

  // Check if user has a workspace
  const workspaceMember = await prisma.workspaceMember.findFirst({
    where: { userId: session.user.id },
  });

  // If no workspace and not on onboarding page, redirect to onboarding
  if (!workspaceMember) {
    redirect("/onboarding");
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header user={session.user} />
        <main className="flex-1 overflow-auto bg-muted/30 p-6">{children}</main>
      </div>
    </div>
  );
}
