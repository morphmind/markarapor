"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ArrowLeft, Save, Trash2, PlayCircle, Link2 } from "lucide-react";
import Link from "next/link";
import { trpc } from "~/lib/trpc";

export default function BrandDetailPage() {
  const router = useRouter();
  const params = useParams();
  const brandId = params.id as string;

  const { data: brand, isLoading } = trpc.brand.get.useQuery({ id: brandId });

  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const updateBrand = trpc.brand.update.useMutation({
    onSuccess: () => {
      setIsEditing(false);
    },
  });

  const deleteBrand = trpc.brand.delete.useMutation({
    onSuccess: () => {
      router.push("/brands");
    },
  });

  // Initialize form when brand loads
  if (brand && !isEditing && name === "") {
    setName(brand.name);
    setWebsite(brand.website || "");
    setIndustry(brand.industry || "");
  }

  const handleSave = () => {
    updateBrand.mutate({
      id: brandId,
      name: name.trim(),
      website: website.trim() || null,
      industry: industry.trim() || null,
    });
  };

  const handleDelete = () => {
    if (confirm("Bu markayı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) {
      deleteBrand.mutate({ id: brandId });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center">
        <p className="text-muted-foreground mb-4">Marka bulunamadı</p>
        <Button asChild>
          <Link href="/brands">Markalara Dön</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/brands">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{brand.name}</h1>
            <p className="text-muted-foreground">Marka detayları</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/workflows/new?brandId=${brandId}`}>
              <PlayCircle className="mr-2 h-4 w-4" />
              Workflow Ekle
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Brand Info */}
        <Card>
          <CardHeader>
            <CardTitle>Marka Bilgileri</CardTitle>
            <CardDescription>Temel marka bilgilerini düzenleyin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Marka Adı</Label>
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
              <Label htmlFor="website">Web Sitesi</Label>
              <Input
                id="website"
                type="url"
                value={website}
                onChange={(e) => {
                  setWebsite(e.target.value);
                  setIsEditing(true);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Sektör</Label>
              <Input
                id="industry"
                value={industry}
                onChange={(e) => {
                  setIndustry(e.target.value);
                  setIsEditing(true);
                }}
              />
            </div>
            {isEditing && (
              <Button onClick={handleSave} disabled={updateBrand.isPending}>
                <Save className="mr-2 h-4 w-4" />
                {updateBrand.isPending ? "Kaydediliyor..." : "Kaydet"}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Connections */}
        <Card>
          <CardHeader>
            <CardTitle>Bağlantılar</CardTitle>
            <CardDescription>Bu markaya bağlı veri kaynakları</CardDescription>
          </CardHeader>
          <CardContent>
            {brand.connections && brand.connections.length > 0 ? (
              <div className="space-y-2">
                {/* TODO: List connections */}
                <p className="text-sm text-muted-foreground">Bağlantılar yükleniyor...</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <Link2 className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-4">
                  Henüz bağlantı yok
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/connections">Bağlantı Ekle</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Workflows */}
        <Card>
          <CardHeader>
            <CardTitle>Son Workflow'lar</CardTitle>
            <CardDescription>Bu markaya ait workflow'lar</CardDescription>
          </CardHeader>
          <CardContent>
            {brand.workflows && brand.workflows.length > 0 ? (
              <div className="space-y-2">
                {brand.workflows.map((workflow) => (
                  <Link
                    key={workflow.id}
                    href={`/workflows/${workflow.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted transition-colors"
                  >
                    <div>
                      <p className="font-medium">{workflow.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {workflow.isActive ? "Aktif" : "Pasif"}
                      </p>
                    </div>
                    <PlayCircle className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <PlayCircle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-4">
                  Henüz workflow yok
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/workflows/new?brandId=${brandId}`}>
                    Workflow Oluştur
                  </Link>
                </Button>
              </div>
            )}
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
              disabled={deleteBrand.isPending}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {deleteBrand.isPending ? "Siliniyor..." : "Markayı Sil"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
