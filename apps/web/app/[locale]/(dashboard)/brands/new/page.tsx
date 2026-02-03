"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { trpc } from "~/lib/trpc";

export default function NewBrandPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");

  const { data: workspaces } = trpc.workspace.list.useQuery();
  const workspaceId = workspaces?.[0]?.id;

  const createBrand = trpc.brand.create.useMutation({
    onSuccess: () => {
      router.push("/brands");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !workspaceId) return;

    createBrand.mutate({
      workspaceId,
      name: name.trim(),
      website: website.trim() || undefined,
      industry: industry.trim() || undefined,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/brands">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Yeni Marka</h1>
          <p className="text-muted-foreground">
            Raporlama yapacağınız markayı ekleyin
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Marka Bilgileri</CardTitle>
          <CardDescription>
            Markanın temel bilgilerini girin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Marka Adı *</Label>
              <Input
                id="name"
                placeholder="Örn: Acme Şirketi"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Web Sitesi</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://example.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Sektör</Label>
              <Input
                id="industry"
                placeholder="Örn: E-ticaret, SaaS, Perakende"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={!name.trim() || !workspaceId || createBrand.isPending}
              >
                {createBrand.isPending ? (
                  "Oluşturuluyor..."
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Marka Oluştur
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/brands">İptal</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
