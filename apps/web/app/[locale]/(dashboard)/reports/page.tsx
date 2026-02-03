"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { FileText, Download, Eye, Calendar, Filter } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Raporlar</h1>
          <p className="text-muted-foreground">
            Oluşturulan raporları görüntüleyin ve indirin
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtrele
          </Button>
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Tarih Aralığı
          </Button>
        </div>
      </div>

      {/* Empty State */}
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Henüz rapor yok</h3>
          <p className="text-muted-foreground text-center mb-4 max-w-md">
            Workflow çalıştırarak otomatik raporlar oluşturun.
            Raporlarınız burada listelenecek.
          </p>
          <Button asChild>
            <a href="/workflows">Workflow'lara Git</a>
          </Button>
        </CardContent>
      </Card>

      {/* Report Types Info */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <span className="text-2xl">📊</span>
              Google Slides
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Profesyonel sunum formatında raporlar. Müşteri toplantıları için ideal.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <span className="text-2xl">📋</span>
              Google Sheets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Detaylı veri tabloları. Analiz ve pivot tablolar için uygun.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <span className="text-2xl">📄</span>
              PDF Export
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Paylaşıma hazır PDF formatı. E-posta ile göndermek için ideal.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
