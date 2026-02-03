"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Link2,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Trash2,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { trpc } from "~/lib/trpc";

// Connection provider definitions (matching Prisma schema)
const connectionProviders = {
  GOOGLE_ADS: {
    name: "Google Ads",
    description: "Reklam kampanyası performansı ve dönüşüm verileri",
    icon: "📊",
    color: "bg-blue-100 dark:bg-blue-900/30",
    scopes: ["https://www.googleapis.com/auth/adwords"],
  },
  GOOGLE_ANALYTICS: {
    name: "Google Analytics",
    description: "Web sitesi trafiği ve kullanıcı davranışları",
    icon: "📈",
    color: "bg-orange-100 dark:bg-orange-900/30",
    scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
  },
  GOOGLE_SEARCH_CONSOLE: {
    name: "Search Console",
    description: "Organik arama performansı ve SEO verileri",
    icon: "🔍",
    color: "bg-green-100 dark:bg-green-900/30",
    scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
  },
  GOOGLE_SLIDES: {
    name: "Google Slides",
    description: "Sunum oluşturma ve düzenleme",
    icon: "📑",
    color: "bg-yellow-100 dark:bg-yellow-900/30",
    scopes: ["https://www.googleapis.com/auth/presentations"],
  },
  GOOGLE_SHEETS: {
    name: "Google Sheets",
    description: "Tablo oluşturma ve veri yönetimi",
    icon: "📋",
    color: "bg-emerald-100 dark:bg-emerald-900/30",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  },
  GOOGLE_DRIVE: {
    name: "Google Drive",
    description: "Dosya depolama ve paylaşım",
    icon: "📁",
    color: "bg-indigo-100 dark:bg-indigo-900/30",
    scopes: ["https://www.googleapis.com/auth/drive.file"],
  },
} as const;

type ConnectionProviderKey = keyof typeof connectionProviders;

export default function ConnectionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<ConnectionProviderKey | null>(null);
  const [connectionName, setConnectionName] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Handle OAuth callback messages
  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");

    if (success === "connected") {
      setMessage({ type: "success", text: "Bağlantı başarıyla oluşturuldu!" });
      // Clear URL params
      router.replace("/connections");
    } else if (error) {
      const errorMessages: Record<string, string> = {
        unauthorized: "Oturum açmanız gerekiyor.",
        invalid_request: "Geçersiz istek.",
        invalid_state: "Bağlantı oturumu süresi doldu. Lütfen tekrar deneyin.",
        no_access_token: "Google'dan erişim izni alınamadı.",
        callback_failed: "Bağlantı oluşturulamadı. Lütfen tekrar deneyin.",
        access_denied: "Google erişimi reddedildi.",
      };
      setMessage({
        type: "error",
        text: errorMessages[error] || `Hata: ${error}`,
      });
      router.replace("/connections");
    }
  }, [searchParams, router]);

  // Auto-hide message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const { data: workspaces } = trpc.workspace.list.useQuery();
  const workspaceId = workspaces?.[0]?.id;

  const { data: brands } = trpc.brand.list.useQuery(
    { workspaceId: workspaceId! },
    { enabled: !!workspaceId }
  );

  const { data: connections, refetch: refetchConnections } = trpc.connection.list.useQuery(
    { workspaceId: workspaceId! },
    { enabled: !!workspaceId }
  );

  const createConnection = trpc.connection.create.useMutation({
    onSuccess: () => {
      setIsDialogOpen(false);
      setConnectionName("");
      setSelectedBrandId("");
      setSelectedProvider(null);
      refetchConnections();
    },
  });

  const deleteConnection = trpc.connection.delete.useMutation({
    onSuccess: () => {
      refetchConnections();
    },
  });

  const testConnection = trpc.connection.test.useMutation({
    onSuccess: () => {
      refetchConnections();
    },
  });

  const [isConnecting, setIsConnecting] = useState(false);

  const handleCreateConnection = async () => {
    if (!selectedProvider || !connectionName.trim() || !selectedBrandId || !workspaceId) return;

    setIsConnecting(true);

    try {
      // Call API to get OAuth URL
      const response = await fetch("/api/google/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          brandId: selectedBrandId,
          provider: selectedProvider,
          name: connectionName.trim(),
        }),
      });

      const data = await response.json();

      if (data.authUrl) {
        // Redirect to Google OAuth
        window.location.href = data.authUrl;
      } else {
        console.error("Failed to get auth URL:", data.error);
        alert("Bağlantı başlatılamadı. Lütfen tekrar deneyin.");
      }
    } catch (error) {
      console.error("Connection error:", error);
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDeleteConnection = (id: string) => {
    if (confirm("Bu bağlantıyı silmek istediğinize emin misiniz?")) {
      deleteConnection.mutate({ id });
    }
  };

  const handleTestConnection = (id: string) => {
    testConnection.mutate({ id });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "ERROR":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "EXPIRED":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "REVOKED":
        return <XCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Aktif";
      case "ERROR":
        return "Hata";
      case "EXPIRED":
        return "Süresi doldu";
      case "REVOKED":
        return "İptal edildi";
      default:
        return status;
    }
  };

  // Group connections by provider
  const connectionsByProvider = connections?.reduce(
    (acc, conn) => {
      const provider = conn.provider as ConnectionProviderKey;
      if (!acc[provider]) acc[provider] = [];
      acc[provider].push(conn);
      return acc;
    },
    {} as Record<ConnectionProviderKey, typeof connections>
  );

  return (
    <div className="space-y-6">
      {/* Success/Error Messages */}
      {message && (
        <div
          className={`rounded-lg p-4 ${
            message.type === "success"
              ? "bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800"
              : "bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <XCircle className="h-5 w-5" />
            )}
            <span>{message.text}</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bağlantılar</h1>
          <p className="text-muted-foreground">
            Veri kaynaklarınızı bağlayarak rapor oluşturmaya başlayın
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Bağlantı
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Yeni Bağlantı Ekle</DialogTitle>
              <DialogDescription>
                Veri kaynağı türünü ve bağlı markayı seçin
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Connection Provider Selection */}
              <div className="space-y-2">
                <Label>Bağlantı Türü</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.entries(connectionProviders) as [ConnectionProviderKey, typeof connectionProviders[ConnectionProviderKey]][]).map(
                    ([key, providerInfo]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          setSelectedProvider(key);
                          setConnectionName(providerInfo.name);
                        }}
                        className={`flex items-center gap-2 p-3 rounded-lg border text-left transition-colors ${
                          selectedProvider === key
                            ? "border-primary bg-primary/5"
                            : "border-border hover:bg-muted"
                        }`}
                      >
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${providerInfo.color} text-lg`}>
                          {providerInfo.icon}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{providerInfo.name}</p>
                        </div>
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Brand Selection */}
              <div className="space-y-2">
                <Label htmlFor="brand">Marka</Label>
                <select
                  id="brand"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={selectedBrandId}
                  onChange={(e) => setSelectedBrandId(e.target.value)}
                >
                  <option value="">Marka seçin...</option>
                  {brands?.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Connection Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Bağlantı Adı</Label>
                <Input
                  id="name"
                  placeholder="Örn: Ana Google Ads Hesabı"
                  value={connectionName}
                  onChange={(e) => setConnectionName(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                İptal
              </Button>
              <Button
                onClick={handleCreateConnection}
                disabled={
                  !selectedProvider ||
                  !connectionName.trim() ||
                  !selectedBrandId ||
                  isConnecting
                }
              >
                {isConnecting ? "Yönlendiriliyor..." : "Google ile Bağlan"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Google Account Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <svg className="h-6 w-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </div>
            <div>
              <CardTitle>Google Hesabı</CardTitle>
              <CardDescription>
                Giriş yaptığınız Google hesabıyla bağlantı kuruldu
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <CheckCircle2 className="h-4 w-4" />
            <span>Bağlı - OAuth ile giriş yapıldı</span>
          </div>
        </CardContent>
      </Card>

      {/* Existing Connections */}
      {connections && connections.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Mevcut Bağlantılar</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {connections.map((connection) => {
              const providerInfo = connectionProviders[connection.provider as ConnectionProviderKey];
              const brandNames = connection.brands?.map((b: { name: string }) => b.name).join(", ") || "-";
              return (
                <Card key={connection.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-lg ${providerInfo?.color || "bg-muted"} text-lg`}
                        >
                          {providerInfo?.icon || "🔗"}
                        </div>
                        <div>
                          <CardTitle className="text-base">{connection.name}</CardTitle>
                          <CardDescription className="text-xs">
                            {providerInfo?.name || connection.provider}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Marka:</span>
                        <span className="font-medium">{brandNames}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Durum:</span>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(connection.status)}
                          {getStatusText(connection.status)}
                        </span>
                      </div>
                      {connection.lastTestedAt && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Son Test:</span>
                          <span className="text-xs">
                            {new Date(connection.lastTestedAt).toLocaleString("tr-TR")}
                          </span>
                        </div>
                      )}
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTestConnection(connection.id)}
                          disabled={testConnection.isPending}
                        >
                          <RefreshCw className={`h-3 w-3 mr-1 ${testConnection.isPending ? "animate-spin" : ""}`} />
                          Test
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteConnection(connection.id)}
                          disabled={deleteConnection.isPending}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Sil
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Link2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Henüz bağlantı yok</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
              Workflow'larınızın veri çekebilmesi için Google Ads, Analytics veya Search Console
              bağlantısı ekleyin
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              İlk Bağlantıyı Ekle
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Available Connection Providers */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Kullanılabilir Bağlantı Türleri</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(Object.entries(connectionProviders) as [ConnectionProviderKey, typeof connectionProviders[ConnectionProviderKey]][]).map(
            ([key, providerInfo]) => {
              const existingCount = connectionsByProvider?.[key]?.length || 0;
              return (
                <Card key={key} className="relative overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${providerInfo.color} text-2xl`}
                      >
                        {providerInfo.icon}
                      </div>
                      <div>
                        <CardTitle className="text-base">{providerInfo.name}</CardTitle>
                        <CardDescription className="text-xs">{providerInfo.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {existingCount > 0
                          ? `${existingCount} bağlantı aktif`
                          : "Bağlantı yok"}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedProvider(key);
                          setConnectionName(providerInfo.name);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Ekle
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            }
          )}
        </div>
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Link2 className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Google API Erişimi:</strong> Google Ads, Analytics ve Search Console
                verilerine erişmek için ilgili API'lerin Google Cloud Console'da etkinleştirilmesi
                ve gerekli izinlerin verilmesi gerekir.
              </p>
              <a
                href="https://console.cloud.google.com/apis/library"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Google Cloud Console'u Aç
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
