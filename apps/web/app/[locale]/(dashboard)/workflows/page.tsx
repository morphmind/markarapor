"use client";

import { trpc } from "~/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { PlayCircle, Plus, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function WorkflowsPage() {
  const { data: workflows, isLoading } = trpc.workflow.list.useQuery({});

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workflow'lar</h1>
          <p className="text-muted-foreground">
            Otomatik rapor akışlarınızı yönetin
          </p>
        </div>
        <Button asChild>
          <Link href="/workflows/new">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Workflow
          </Link>
        </Button>
      </div>

      {workflows?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <PlayCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Henüz workflow yok</h3>
            <p className="text-muted-foreground text-center mb-4">
              İlk workflow'unuzu oluşturarak otomatik raporlamaya başlayın.
            </p>
            <Button asChild>
              <Link href="/workflows/new">
                <Plus className="mr-2 h-4 w-4" />
                Workflow Oluştur
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {workflows?.map((workflow) => (
            <Card key={workflow.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{workflow.name}</CardTitle>
                  <WorkflowStatusBadge isActive={workflow.isActive} />
                </div>
                <CardDescription>
                  {workflow.brand?.name || "Marka atanmamış"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{workflow._count.runs} çalışma</span>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/workflows/${workflow.id}`}>Düzenle</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function WorkflowStatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
        isActive
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
      }`}
    >
      {isActive ? (
        <>
          <CheckCircle2 className="h-3 w-3" />
          Aktif
        </>
      ) : (
        <>
          <AlertCircle className="h-3 w-3" />
          Pasif
        </>
      )}
    </span>
  );
}
