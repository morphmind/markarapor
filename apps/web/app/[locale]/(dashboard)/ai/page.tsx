"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Sparkles, Send, MessageSquare, Lightbulb, TrendingUp } from "lucide-react";
import { useState } from "react";

const suggestedPrompts = [
  {
    icon: TrendingUp,
    title: "Performans Analizi",
    prompt: "Son ayın Google Ads performansını analiz et ve iyileştirme önerileri sun",
  },
  {
    icon: Lightbulb,
    title: "İçerik Önerileri",
    prompt: "SEO performansına göre blog içerik önerileri oluştur",
  },
  {
    icon: MessageSquare,
    title: "Rapor Özeti",
    prompt: "Bu ayki tüm kampanyaların özetini yönetici brifingi formatında hazırla",
  },
];

export default function AIPage() {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement AI chat
    console.log("Send message:", message);
    setMessage("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Asistan</h1>
          <p className="text-muted-foreground">
            Pazarlama verilerinizi analiz edin ve içgörüler alın
          </p>
        </div>
      </div>

      {/* Chat Interface */}
      <Card className="min-h-[500px] flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">MarkaRapor AI</CardTitle>
              <CardDescription>
                Pazarlama asistanınız - Claude tarafından desteklenmektedir
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-6">
          {/* Empty Chat State */}
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <Sparkles className="h-12 w-12 text-primary/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Merhaba! Size nasıl yardımcı olabilirim?</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Pazarlama verilerinizi analiz edebilir, raporlar hakkında sorular sorabilir
              veya strateji önerileri isteyebilirsiniz.
            </p>

            {/* Suggested Prompts */}
            <div className="grid gap-3 w-full max-w-xl">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setMessage(prompt.prompt)}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors text-left"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <prompt.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{prompt.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {prompt.prompt}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Bir soru sorun veya analiz isteyin..."
                className="flex-1"
              />
              <Button type="submit" disabled={!message.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* API Key Info */}
      <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-amber-800 dark:text-amber-300">
                AI Asistan'ı kullanmak için Ayarlar sayfasından Anthropic API anahtarınızı
                eklemeniz gerekmektedir.
              </p>
              <Button variant="link" className="p-0 h-auto mt-2 text-amber-700 dark:text-amber-400" asChild>
                <a href="/settings">Ayarlara Git →</a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
