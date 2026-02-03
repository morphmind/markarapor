"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Key,
  User,
  Bell,
  Shield,
  CreditCard,
  CheckCircle2,
  XCircle,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { trpc } from "~/lib/trpc";

export default function SettingsPage() {
  const [anthropicKey, setAnthropicKey] = useState("");
  const [openaiKey, setOpenaiKey] = useState("");
  const [googleAdsToken, setGoogleAdsToken] = useState("");
  const [showAnthropicKey, setShowAnthropicKey] = useState(false);
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [showGoogleAdsToken, setShowGoogleAdsToken] = useState(false);

  const { data: workspaces } = trpc.workspace.list.useQuery();
  const workspaceId = workspaces?.[0]?.id;

  const { data: settings, refetch: refetchSettings } = trpc.settings.get.useQuery(
    { workspaceId: workspaceId! },
    { enabled: !!workspaceId }
  );

  const updateApiKeys = trpc.settings.updateApiKeys.useMutation({
    onSuccess: () => {
      // Clear input fields after save
      setAnthropicKey("");
      setOpenaiKey("");
      setGoogleAdsToken("");
      refetchSettings();
    },
  });

  const updateFeatures = trpc.settings.updateFeatures.useMutation({
    onSuccess: () => {
      refetchSettings();
    },
  });

  const handleSaveApiKeys = () => {
    if (!workspaceId) return;

    const updates: {
      workspaceId: string;
      anthropicApiKey?: string;
      openaiApiKey?: string;
      googleAdsDevToken?: string;
    } = { workspaceId };

    if (anthropicKey.trim()) {
      updates.anthropicApiKey = anthropicKey.trim();
    }
    if (openaiKey.trim()) {
      updates.openaiApiKey = openaiKey.trim();
    }
    if (googleAdsToken.trim()) {
      updates.googleAdsDevToken = googleAdsToken.trim();
    }

    if (Object.keys(updates).length > 1) {
      updateApiKeys.mutate(updates);
    }
  };

  const handleToggleFeature = (
    feature: "aiInsightsEnabled" | "autoReportsEnabled" | "emailNotificationsEnabled"
  ) => {
    if (!workspaceId || !settings) return;

    updateFeatures.mutate({
      workspaceId,
      [feature]: !settings.features[feature],
    });
  };

  const ApiKeyStatus: React.FC<{ configured: boolean; masked?: string | null }> = ({
    configured,
    masked,
  }) => (
    <div className="flex items-center gap-2 text-sm">
      {configured ? (
        <>
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <span className="text-green-600 dark:text-green-400">
            Yapılandırıldı {masked && `(${masked})`}
          </span>
        </>
      ) : (
        <>
          <XCircle className="h-4 w-4 text-gray-400" />
          <span className="text-muted-foreground">Yapılandırılmadı</span>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ayarlar</h1>
        <p className="text-muted-foreground">
          Hesap ve uygulama ayarlarınızı yönetin
        </p>
      </div>

      <div className="grid gap-6">
        {/* API Keys */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Key className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>API Anahtarları</CardTitle>
                <CardDescription>
                  AI ve veri çekme için gerekli API anahtarları. Anahtarlar şifreli olarak saklanır.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Anthropic API Key */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="anthropic-key">Anthropic API Key (Claude)</Label>
                <ApiKeyStatus
                  configured={settings?.apiKeys.anthropicConfigured || false}
                  masked={settings?.apiKeys.anthropicMasked}
                />
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="anthropic-key"
                    type={showAnthropicKey ? "text" : "password"}
                    placeholder={
                      settings?.apiKeys.anthropicConfigured
                        ? "Yeni anahtar girmek için yazın..."
                        : "sk-ant-..."
                    }
                    value={anthropicKey}
                    onChange={(e) => setAnthropicKey(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowAnthropicKey(!showAnthropicKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showAnthropicKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                AI Asistan ve rapor içgörüleri için gerekli.{" "}
                <a
                  href="https://console.anthropic.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Anthropic Console'dan alın →
                </a>
              </p>
            </div>

            {/* OpenAI API Key */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="openai-key">OpenAI API Key (Opsiyonel)</Label>
                <ApiKeyStatus
                  configured={settings?.apiKeys.openaiConfigured || false}
                  masked={settings?.apiKeys.openaiMasked}
                />
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="openai-key"
                    type={showOpenaiKey ? "text" : "password"}
                    placeholder="sk-..."
                    value={openaiKey}
                    onChange={(e) => setOpenaiKey(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showOpenaiKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Alternatif AI modeli olarak kullanılabilir.
              </p>
            </div>

            {/* Google Ads Developer Token */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="google-ads-token">Google Ads Developer Token</Label>
                <ApiKeyStatus
                  configured={settings?.apiKeys.googleAdsDevTokenConfigured || false}
                  masked={settings?.apiKeys.googleAdsDevTokenMasked}
                />
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="google-ads-token"
                    type={showGoogleAdsToken ? "text" : "password"}
                    placeholder="Developer token..."
                    value={googleAdsToken}
                    onChange={(e) => setGoogleAdsToken(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowGoogleAdsToken(!showGoogleAdsToken)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showGoogleAdsToken ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Google Ads API verilerini çekmek için gerekli.{" "}
                <a
                  href="https://developers.google.com/google-ads/api/docs/first-call/dev-token"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Nasıl alınır →
                </a>
              </p>
            </div>

            <Button
              onClick={handleSaveApiKeys}
              disabled={
                updateApiKeys.isPending ||
                (!anthropicKey.trim() && !openaiKey.trim() && !googleAdsToken.trim())
              }
            >
              {updateApiKeys.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                "API Anahtarlarını Kaydet"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Feature Toggles */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Özellikler</CardTitle>
                <CardDescription>Workspace özelliklerini yönetin</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">AI İçgörüleri</p>
                  <p className="text-sm text-muted-foreground">
                    Raporlarda AI destekli analiz ve öneriler
                  </p>
                </div>
                <Button
                  variant={settings?.features.aiInsightsEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleToggleFeature("aiInsightsEnabled")}
                  disabled={updateFeatures.isPending}
                >
                  {settings?.features.aiInsightsEnabled ? "Açık" : "Kapalı"}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Otomatik Raporlar</p>
                  <p className="text-sm text-muted-foreground">
                    Zamanlanmış workflow'ları otomatik çalıştır
                  </p>
                </div>
                <Button
                  variant={settings?.features.autoReportsEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleToggleFeature("autoReportsEnabled")}
                  disabled={updateFeatures.isPending}
                >
                  {settings?.features.autoReportsEnabled ? "Açık" : "Kapalı"}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">E-posta Bildirimleri</p>
                  <p className="text-sm text-muted-foreground">
                    Workflow tamamlandığında e-posta al
                  </p>
                </div>
                <Button
                  variant={settings?.features.emailNotificationsEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleToggleFeature("emailNotificationsEnabled")}
                  disabled={updateFeatures.isPending}
                >
                  {settings?.features.emailNotificationsEnabled ? "Açık" : "Kapalı"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Abonelik</CardTitle>
                <CardDescription>Plan ve fatura bilgileri</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
              <div>
                <p className="font-semibold">Free Plan</p>
                <p className="text-sm text-muted-foreground">50 kredi / ay</p>
              </div>
              <Button>Yükselt</Button>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Güvenlik</CardTitle>
                <CardDescription>Hesap güvenlik ayarları</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Oturum Yönetimi</p>
                  <p className="text-sm text-muted-foreground">
                    Aktif oturumlarınızı görün
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Görüntüle
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-red-600">Hesabı Sil</p>
                  <p className="text-sm text-muted-foreground">
                    Tüm verileriniz kalıcı olarak silinir
                  </p>
                </div>
                <Button variant="destructive" size="sm">
                  Sil
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
