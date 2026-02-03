"use client";

import { useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  ArrowLeft,
  Save,
  Trash2,
  Play,
  Pause,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  FileText,
  Database,
  Brain,
  Shuffle,
  FileOutput,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { trpc } from "~/lib/trpc";

export default function WorkflowDetailPage() {
  const router = useRouter();
  const params = useParams();
  const workflowId = params.id as string;

  const { data: workflow, isLoading, refetch } = trpc.workflow.get.useQuery({ id: workflowId });

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const updateWorkflow = trpc.workflow.update.useMutation({
    onSuccess: () => {
      setIsEditing(false);
      refetch();
    },
  });

  const deleteWorkflow = trpc.workflow.delete.useMutation({
    onSuccess: () => {
      router.push("/workflows");
    },
  });

  const runWorkflow = trpc.workflow.run.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  // Initialize form when workflow loads
  if (workflow && !isEditing && name === "") {
    setName(workflow.name);
    setDescription(workflow.description || "");
  }

  const handleSave = () => {
    updateWorkflow.mutate({
      id: workflowId,
      name: name.trim(),
      description: description.trim() || undefined,
    });
  };

  const handleToggleActive = () => {
    updateWorkflow.mutate({
      id: workflowId,
      isActive: !workflow?.isActive,
    });
  };

  const handleDelete = () => {
    if (confirm("Bu workflow'u silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) {
      deleteWorkflow.mutate({ id: workflowId });
    }
  };

  const handleRun = () => {
    runWorkflow.mutate({ id: workflowId });
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center">
        <p className="text-muted-foreground mb-4">Workflow bulunamadı</p>
        <Button asChild>
          <Link href="/workflows">Workflow'lara Dön</Link>
        </Button>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "FAILED":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "RUNNING":
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      case "PENDING":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const workflowNodes = useMemo(
    () => (workflow.nodes as unknown as WorkflowNodeData[]) || [],
    [workflow.nodes]
  );
  const workflowEdges = useMemo(
    () => (workflow.edges as unknown as WorkflowEdgeData[]) || [],
    [workflow.edges]
  );

  const getStatusText = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "Tamamlandı";
      case "FAILED":
        return "Başarısız";
      case "RUNNING":
        return "Çalışıyor";
      case "PENDING":
        return "Bekliyor";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/workflows">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{workflow.name}</h1>
            <p className="text-muted-foreground">
              {workflow.brand?.name} • {workflow.isActive ? "Aktif" : "Pasif"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleToggleActive}
            disabled={updateWorkflow.isPending}
          >
            {workflow.isActive ? (
              <>
                <Pause className="mr-2 h-4 w-4" />
                Durdur
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Aktifleştir
              </>
            )}
          </Button>
          <Button onClick={handleRun} disabled={runWorkflow.isPending}>
            <Play className="mr-2 h-4 w-4" />
            {runWorkflow.isPending ? "Başlatılıyor..." : "Şimdi Çalıştır"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Workflow Info */}
        <Card>
          <CardHeader>
            <CardTitle>Workflow Bilgileri</CardTitle>
            <CardDescription>Temel workflow ayarlarını düzenleyin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Workflow Adı</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setIsEditing(true);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Açıklama</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setIsEditing(true);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Marka</Label>
              <p className="text-sm text-muted-foreground">
                {workflow.brand?.name}
              </p>
            </div>
            {isEditing && (
              <Button onClick={handleSave} disabled={updateWorkflow.isPending}>
                <Save className="mr-2 h-4 w-4" />
                {updateWorkflow.isPending ? "Kaydediliyor..." : "Kaydet"}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Run History */}
        <Card>
          <CardHeader>
            <CardTitle>Çalışma Geçmişi</CardTitle>
            <CardDescription>Son 10 çalışma</CardDescription>
          </CardHeader>
          <CardContent>
            {workflow.runs && workflow.runs.length > 0 ? (
              <div className="space-y-2">
                {workflow.runs.map((run) => (
                  <div
                    key={run.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(run.status)}
                      <div>
                        <p className="text-sm font-medium">
                          {getStatusText(run.status)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(run.startedAt).toLocaleString("tr-TR")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {run.creditsUsed > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {run.creditsUsed} kredi
                        </span>
                      )}
                      {run.status === "COMPLETED" && (
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <a
                            href={`/api/export/${run.id}?format=pdf`}
                            download
                          >
                            <Download className="h-3 w-3 mr-1" />
                            PDF
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Henüz çalışma yok
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Workflow Node Visualization */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Workflow Adımları</CardTitle>
            <CardDescription>
              Bu workflow&apos;un çalışma akışı
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WorkflowNodeGraph
              nodes={(workflow.nodes as unknown as WorkflowNodeData[]) || []}
              edges={(workflow.edges as unknown as WorkflowEdgeData[]) || []}
            />
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200 dark:border-red-900">
          <CardHeader>
            <CardTitle className="text-red-600">Tehlikeli Bölge</CardTitle>
            <CardDescription>
              Bu işlemler geri alınamaz
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteWorkflow.isPending}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {deleteWorkflow.isPending ? "Siliniyor..." : "Workflow'u Sil"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ---- Workflow Node Visualization ----

interface WorkflowNodeData {
  id: string;
  type: string;
  position?: { x: number; y: number };
  data?: {
    label?: string;
    config?: Record<string, unknown>;
  };
}

interface WorkflowEdgeData {
  id?: string;
  source: string;
  target: string;
}

const nodeTypeConfig: Record<
  string,
  { icon: React.ElementType; color: string; bg: string; border: string }
> = {
  "data-source": {
    icon: Database,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950",
    border: "border-blue-200 dark:border-blue-800",
  },
  "ai-analysis": {
    icon: Brain,
    color: "text-purple-600",
    bg: "bg-purple-50 dark:bg-purple-950",
    border: "border-purple-200 dark:border-purple-800",
  },
  transform: {
    icon: Shuffle,
    color: "text-orange-600",
    bg: "bg-orange-50 dark:bg-orange-950",
    border: "border-orange-200 dark:border-orange-800",
  },
  export: {
    icon: FileOutput,
    color: "text-green-600",
    bg: "bg-green-50 dark:bg-green-950",
    border: "border-green-200 dark:border-green-800",
  },
};

function getNodeTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    "data-source": "Veri Kaynağı",
    "ai-analysis": "AI Analizi",
    transform: "Dönüştürme",
    export: "Dışa Aktarma",
  };
  return labels[type] || type;
}

function WorkflowNodeGraph({
  nodes,
  edges,
}: {
  nodes: WorkflowNodeData[];
  edges: WorkflowEdgeData[];
}) {
  if (nodes.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-lg border-2 border-dashed">
        <div className="text-center">
          <FileText className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Bu workflow&apos;da henüz adım yok
          </p>
        </div>
      </div>
    );
  }

  // Build adjacency for ordering: group nodes by execution layer
  const inDegree = new Map<string, number>();
  const adj = new Map<string, string[]>();
  for (const n of nodes) {
    inDegree.set(n.id, 0);
    adj.set(n.id, []);
  }
  for (const e of edges) {
    adj.get(e.source)?.push(e.target);
    inDegree.set(e.target, (inDegree.get(e.target) || 0) + 1);
  }

  // Topological layers
  const layers: string[][] = [];
  const remaining = new Map(inDegree);
  while (remaining.size > 0) {
    const layer = [...remaining.entries()]
      .filter(([, deg]) => deg === 0)
      .map(([id]) => id);
    if (layer.length === 0) break;
    layers.push(layer);
    for (const id of layer) {
      remaining.delete(id);
      for (const next of adj.get(id) || []) {
        const cur = remaining.get(next);
        if (cur !== undefined) {
          remaining.set(next, cur - 1);
        }
      }
    }
  }

  // Build target set for showing arrows
  const edgeSet = new Set(edges.map((e) => `${e.source}->${e.target}`));

  return (
    <div className="overflow-x-auto">
      <div className="flex items-start gap-4 min-w-max py-4">
        {layers.map((layer, layerIdx) => (
          <div key={layerIdx} className="flex flex-col gap-3 items-center">
            {layer.map((nodeId) => {
              const node = nodes.find((n) => n.id === nodeId);
              if (!node) return null;
              const config =
                nodeTypeConfig[node.type] || nodeTypeConfig["data-source"];
              const Icon = config.icon;
              const source =
                (node.data?.config?.source as string) ||
                (node.data?.config?.analysisType as string) ||
                (node.data?.config?.operation as string) ||
                (node.data?.config?.format as string) ||
                "";

              return (
                <div
                  key={nodeId}
                  className={`rounded-lg border-2 ${config.border} ${config.bg} p-3 w-48 shadow-sm`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`h-4 w-4 ${config.color}`} />
                    <span className={`text-xs font-medium ${config.color}`}>
                      {getNodeTypeLabel(node.type)}
                    </span>
                  </div>
                  <p className="text-sm font-semibold truncate">
                    {node.data?.label || nodeId}
                  </p>
                  {source && (
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {source}
                    </p>
                  )}
                </div>
              );
            })}
            {/* Arrow to next layer */}
            {layerIdx < layers.length - 1 && (
              <div className="absolute" style={{ display: "none" }} />
            )}
          </div>
        ))}
      </div>
      {/* Flow arrows between layers */}
      {layers.length > 1 && (
        <div className="flex items-center gap-4 min-w-max -mt-2 mb-2 px-4">
          {layers.slice(0, -1).map((_, idx) => (
            <div
              key={idx}
              className="flex items-center"
              style={{ width: "12rem" }}
            >
              <div className="flex-1" />
              <ArrowRight className="h-5 w-5 text-muted-foreground mx-auto" />
              <div className="flex-1" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
