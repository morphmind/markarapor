"use client";

import { trpc } from "~/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Plus, Users, ExternalLink, PlayCircle } from "lucide-react";
import Link from "next/link";

export default function BrandsPage() {
  // First get workspaces to get the workspaceId
  const { data: workspaces } = trpc.workspace.list.useQuery();
  const workspaceId = workspaces?.[0]?.id;

  const { data: brands, isLoading } = trpc.brand.list.useQuery(
    { workspaceId: workspaceId! },
    { enabled: !!workspaceId }
  );

  if (isLoading || !workspaces) {
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
          <h1 className="text-3xl font-bold tracking-tight">Markalar</h1>
          <p className="text-muted-foreground">
            Raporlama yapacağınız markaları yönetin
          </p>
        </div>
        <Button asChild>
          <Link href="/brands/new">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Marka
          </Link>
        </Button>
      </div>

      {(!brands || brands.length === 0) ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Henüz marka yok</h3>
            <p className="text-muted-foreground text-center mb-4">
              İlk markanızı ekleyerek raporlamaya başlayın.
            </p>
            <Button asChild>
              <Link href="/brands/new">
                <Plus className="mr-2 h-4 w-4" />
                Marka Ekle
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <Card key={brand.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={brand.logo || undefined} alt={brand.name} />
                    <AvatarFallback>
                      {brand.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{brand.name}</CardTitle>
                    {brand.industry && (
                      <CardDescription>{brand.industry}</CardDescription>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {brand.website && (
                    <a
                      href={brand.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                    >
                      <ExternalLink className="h-4 w-4" />
                      {new URL(brand.website).hostname}
                    </a>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <PlayCircle className="h-4 w-4" />
                      <span>{brand._count.workflows} workflow</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <span>{brand._count.connections} bağlantı</span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href={`/brands/${brand.id}`}>Düzenle</Link>
                    </Button>
                    <Button size="sm" className="flex-1" asChild>
                      <Link href={`/workflows/new?brandId=${brand.id}`}>
                        Workflow
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
