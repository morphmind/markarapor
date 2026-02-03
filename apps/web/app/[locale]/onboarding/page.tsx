"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Sparkles, ArrowRight } from "lucide-react";
import { trpc } from "~/lib/trpc";

export default function OnboardingPage() {
  const router = useRouter();
  const [workspaceName, setWorkspaceName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const createWorkspace = trpc.workspace.create.useMutation({
    onSuccess: () => {
      router.push("/dashboard");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceName.trim()) return;

    setIsLoading(true);
    createWorkspace.mutate({
      name: workspaceName,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">MarkaRapor'a Hoş Geldiniz!</CardTitle>
          <CardDescription>
            Başlamak için bir çalışma alanı oluşturun. Çalışma alanları markalarınızı
            ve raporlarınızı organize etmenize yardımcı olur.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workspace-name">Çalışma Alanı Adı</Label>
              <Input
                id="workspace-name"
                placeholder="Örn: Ajansım, Şirketim"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Bu ismi daha sonra değiştirebilirsiniz.
              </p>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={!workspaceName.trim() || isLoading}
            >
              {isLoading ? (
                "Oluşturuluyor..."
              ) : (
                <>
                  Devam Et
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
