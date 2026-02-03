"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ArrowLeft, ArrowRight, Check, FileText, BarChart3, Search, Sparkles, Globe } from "lucide-react";
import Link from "next/link";
import { trpc } from "~/lib/trpc";
import { cn } from "~/lib/utils";

// Workflow Templates
const templates = [
  {
    id: "monthly-performance",
    name: "Aylık Performans Raporu",
    description: "Google Ads + Analytics verilerini birleştiren kapsamlı aylık rapor",
    icon: BarChart3,
    category: "Performans",
    isPremium: false,
  },
  {
    id: "seo-monthly-report",
    name: "Aylık SEO Raporu (Kapsamlı)",
    description: "Analytics + Search Console birleşik SEO raporu - Organik trafik, sorgular, cihaz/ülke analizi",
    icon: Globe,
    category: "SEO",
    isPremium: false,
  },
  {
    id: "seo-report",
    name: "SEO Performans Raporu",
    description: "Search Console verileriyle organik arama performansı analizi",
    icon: Search,
    category: "SEO",
    isPremium: false,
  },
  {
    id: "ads-campaign",
    name: "Kampanya Analizi",
    description: "Google Ads kampanya bazlı detaylı performans raporu",
    icon: FileText,
    category: "Reklamlar",
    isPremium: false,
  },
  {
    id: "executive-summary",
    name: "Yönetici Özeti",
    description: "AI destekli kısa ve öz yönetici brifingi",
    icon: Sparkles,
    category: "AI",
    isPremium: true,
  },
];

export default function NewWorkflowPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedBrandId = searchParams.get("brandId");

  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState(preselectedBrandId || "");

  const { data: workspaces } = trpc.workspace.list.useQuery();
  const workspaceId = workspaces?.[0]?.id;

  const { data: brands } = trpc.brand.list.useQuery(
    { workspaceId: workspaceId! },
    { enabled: !!workspaceId }
  );

  const createWorkflow = trpc.workflow.create.useMutation({
    onSuccess: () => {
      router.push("/workflows");
    },
  });

  const handleNext = () => {
    if (step === 1 && selectedTemplate) {
      const template = templates.find((t) => t.id === selectedTemplate);
      if (template) {
        setName(template.name);
        setDescription(template.description);
      }
      setStep(2);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !selectedBrandId) return;

    createWorkflow.mutate({
      brandId: selectedBrandId,
      name: name.trim(),
      description: description.trim() || undefined,
      templateId: selectedTemplate || undefined,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/workflows">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Yeni Workflow</h1>
          <p className="text-muted-foreground">
            Otomatik rapor akışı oluşturun
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-4">
        <div className={cn(
          "flex items-center gap-2 rounded-full px-4 py-2",
          step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted"
        )}>
          <span className="text-sm font-medium">1. Şablon Seç</span>
        </div>
        <div className="h-px flex-1 bg-border" />
        <div className={cn(
          "flex items-center gap-2 rounded-full px-4 py-2",
          step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted"
        )}>
          <span className="text-sm font-medium">2. Detaylar</span>
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Şablon Seçin</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md",
                    selectedTemplate === template.id && "ring-2 ring-primary"
                  )}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <template.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{template.name}</CardTitle>
                          <span className="text-xs text-muted-foreground">
                            {template.category}
                          </span>
                        </div>
                      </div>
                      {selectedTemplate === template.id && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                          <Check className="h-4 w-4 text-primary-foreground" />
                        </div>
                      )}
                      {template.isPremium && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                          Pro
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {template.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleNext} disabled={!selectedTemplate}>
              Devam Et
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Workflow Detayları</CardTitle>
            <CardDescription>
              Workflow'un adını ve bağlı markayı belirleyin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="brand">Marka *</Label>
                <select
                  id="brand"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={selectedBrandId}
                  onChange={(e) => setSelectedBrandId(e.target.value)}
                  required
                >
                  <option value="">Marka seçin...</option>
                  {brands?.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
                {(!brands || brands.length === 0) && (
                  <p className="text-xs text-muted-foreground">
                    Henüz marka yok.{" "}
                    <Link href="/brands/new" className="text-primary hover:underline">
                      Marka ekleyin
                    </Link>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Workflow Adı *</Label>
                <Input
                  id="name"
                  placeholder="Örn: Ocak 2024 Aylık Rapor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Açıklama</Label>
                <Input
                  id="description"
                  placeholder="Bu workflow ne yapar?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Geri
                </Button>
                <Button
                  type="submit"
                  disabled={!name.trim() || !selectedBrandId || createWorkflow.isPending}
                >
                  {createWorkflow.isPending ? "Oluşturuluyor..." : "Workflow Oluştur"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
