# MarkaRapor - Genişletilmiş Proje Planı

## Eklenen Yeni Bölümler

Bu dokümanda orijinal plana eklenen:
- ❌ Eksik olan kritik bölümler
- 🆕 Kısa vadeli yeni özellikler
- 🔮 Uzun vadeli özellikler (seçilen 2 madde)

---

## 1. TEST STRATEJİSİ ❌

### 1.1 Test Piramidi

```
        ┌─────────┐
        │   E2E   │  ← Az ama kritik akışlar
       ─┴─────────┴─
      ┌─────────────┐
      │ Integration │  ← API ve servis testleri
     ─┴─────────────┴─
    ┌─────────────────┐
    │      Unit       │  ← Çok sayıda, hızlı
    └─────────────────┘
```

### 1.2 Test Araçları

| Katman | Araç | Amaç |
|--------|------|------|
| Unit | Vitest | Component ve utility testleri |
| Integration | Vitest + MSW | API endpoint testleri |
| E2E | Playwright | Kritik kullanıcı akışları |
| Visual | Chromatic | UI regression |

### 1.3 Test Klasör Yapısı

```
__tests__/
├── unit/
│   ├── components/
│   │   ├── workflow/
│   │   │   └── NodePalette.test.tsx
│   │   └── reports/
│   │       └── ReportViewer.test.tsx
│   ├── lib/
│   │   ├── utils.test.ts
│   │   └── validators.test.ts
│   └── hooks/
│       └── useWorkflow.test.ts
│
├── integration/
│   ├── api/
│   │   ├── workflow.test.ts
│   │   ├── report.test.ts
│   │   └── ai.test.ts
│   ├── services/
│   │   ├── google-ads.test.ts
│   │   ├── analytics.test.ts
│   │   └── search-console.test.ts
│   └── workflow-engine/
│       ├── executor.test.ts
│       └── scheduler.test.ts
│
├── e2e/
│   ├── auth.spec.ts
│   ├── onboarding.spec.ts
│   ├── workflow-create.spec.ts
│   ├── workflow-run.spec.ts
│   ├── report-generate.spec.ts
│   └── export.spec.ts
│
└── mocks/
    ├── google-ads.ts
    ├── analytics.ts
    ├── ai-responses.ts
    └── handlers.ts
```

### 1.4 Test Coverage Hedefleri

| Katman | Hedef | Açıklama |
|--------|-------|----------|
| Unit | %80+ | Tüm utility ve hook'lar |
| Integration | %70+ | Tüm API endpoint'leri |
| E2E | Kritik akışlar | 10 ana senaryo |

### 1.5 Mock Stratejisi

```typescript
// __tests__/mocks/google-ads.ts
export const mockGoogleAdsPerformance = {
  campaigns: [
    {
      id: '123',
      name: 'Test Campaign',
      impressions: 10000,
      clicks: 500,
      cost: 250.00,
      conversions: 25,
      ctr: 0.05,
    },
  ],
  dateRange: {
    start: '2026-01-01',
    end: '2026-01-07',
  },
};

// __tests__/mocks/ai-responses.ts
export const mockClaudeAnalysis = {
  summary: 'Bu hafta kampanya performansı...',
  insights: [
    'CTR %5 ile sektör ortalamasının üzerinde',
    'CPC geçen haftaya göre %12 düştü',
  ],
  recommendations: [
    'Bütçeyi A kampanyasına kaydırın',
  ],
};
```

---

## 2. ERROR HANDLING SİSTEMİ ❌

### 2.1 Hata Kategorileri

```typescript
export enum ErrorCategory {
  // Auth hataları
  AUTH_EXPIRED = 'AUTH_EXPIRED',
  AUTH_INVALID = 'AUTH_INVALID',
  AUTH_SCOPE_MISSING = 'AUTH_SCOPE_MISSING',

  // API hataları
  API_RATE_LIMIT = 'API_RATE_LIMIT',
  API_TIMEOUT = 'API_TIMEOUT',
  API_UNAVAILABLE = 'API_UNAVAILABLE',

  // Workflow hataları
  WORKFLOW_NODE_FAILED = 'WORKFLOW_NODE_FAILED',
  WORKFLOW_TIMEOUT = 'WORKFLOW_TIMEOUT',

  // AI hataları
  AI_RATE_LIMIT = 'AI_RATE_LIMIT',
  AI_CONTEXT_TOO_LONG = 'AI_CONTEXT_TOO_LONG',
}
```

### 2.2 Retry Mekanizması

```typescript
export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;        // ms
  maxDelay: number;         // ms
  backoffMultiplier: number;
  retryableErrors: ErrorCategory[];
}

export const defaultRetryConfig: RetryConfig = {
  maxAttempts: 3,
  baseDelay: 1000,
  maxDelay: 30000,
  backoffMultiplier: 2,
  retryableErrors: [
    ErrorCategory.API_RATE_LIMIT,
    ErrorCategory.API_TIMEOUT,
    ErrorCategory.AI_RATE_LIMIT,
  ],
};
```

### 2.3 Workflow Error Recovery

```typescript
export interface NodeErrorConfig {
  nodeId: string;
  onError: 'RETRY' | 'SKIP' | 'ABORT' | 'FALLBACK';
  maxRetries?: number;
  fallbackValue?: any;
  notifyOnError?: boolean;
}
```

### 2.4 User-Friendly Error Messages

```typescript
export const errorMessages = {
  tr: {
    AUTH_EXPIRED: 'Google hesap bağlantınızın süresi doldu. Lütfen yeniden bağlayın.',
    API_RATE_LIMIT: 'Çok fazla istek gönderildi. Lütfen birkaç dakika bekleyin.',
    API_TIMEOUT: 'Sunucu yanıt vermedi. Lütfen tekrar deneyin.',
    WORKFLOW_NODE_FAILED: 'Workflow adımı başarısız oldu: {nodeName}',
    AI_RATE_LIMIT: 'AI servis limiti aşıldı. Lütfen daha sonra tekrar deneyin.',
  },
};
```

---

## 3. MONITORING & ALERTING ❌

### 3.1 Metrik Kategorileri

| Kategori | Metrikler |
|----------|-----------|
| System | CPU, Memory, Disk |
| API | Request count, Duration, Error rate |
| Workflow | Execution count, Duration, Success rate |
| Business | Active users, Reports generated, AI credits |

### 3.2 Alert Kuralları

| Alert | Condition | Severity | Channel |
|-------|-----------|----------|---------|
| High Error Rate | > 5% (5m) | Critical | Slack, PagerDuty |
| Queue Backup | > 100 jobs | Critical | Slack |
| High Latency | P95 > 2s | Warning | Slack |
| Low Disk | > 80% | Warning | Slack |

### 3.3 Monitoring Stack

```
Grafana (Dashboard)
    ↓
Prometheus (Metrics) + Loki (Logs) + Sentry (Errors)
    ↓
Application (OpenTelemetry)
```

### 3.4 Health Check

```typescript
// /api/health endpoint
{
  status: 'healthy' | 'unhealthy',
  checks: {
    database: { healthy: true, latency: 5 },
    redis: { healthy: true, latency: 2 },
    externalAPIs: { healthy: true }
  }
}
```

---

## 4. BACKUP & RECOVERY ❌

### 4.1 Backup Stratejisi

| Veri | Yöntem | Sıklık | Saklama |
|------|--------|--------|---------|
| Database | pg_dump | Günlük | 30 gün |
| Database | WAL | Sürekli | 7 gün |
| Files | S3 sync | Saatlik | 90 gün |
| Redis | RDB | 6 saat | 7 gün |

### 4.2 Recovery Hedefleri

- **RTO** (Recovery Time): 4 saat
- **RPO** (Recovery Point): 1 saat

### 4.3 Disaster Recovery

1. Database corruption → En son backup'tan restore
2. Infrastructure failure → Terraform ile yeniden oluştur
3. Data loss → Point-in-time recovery

---

## 5. API RATE LIMITING ❌

### 5.1 Google API Limitleri

| API | Limit |
|-----|-------|
| Google Ads | 100/s, 15K/gün |
| Analytics | 1800/dk, 50K/gün |
| Search Console | 5/s |
| Slides/Sheets | 300 read/dk, 60 write/dk |

### 5.2 Rate Limiter

```typescript
// Her API için ayrı rate limiter
const rateLimiters = {
  googleAds: new RateLimiter({ tokensPerInterval: 100, interval: 'second' }),
  analytics: new RateLimiter({ tokensPerInterval: 30, interval: 'second' }),
  searchConsole: new RateLimiter({ tokensPerInterval: 5, interval: 'second' }),
};

// Kullanım
await rateLimiters.googleAds.acquire();
const data = await googleAdsClient.getCampaigns();
```

### 5.3 Quota Management

- Workspace bazlı günlük limit
- Uyarı threshold'ları (%80, %90)
- Otomatik throttling

---

## 6. API DOCUMENTATION ❌

### 6.1 OpenAPI Spec

```yaml
openapi: 3.1.0
info:
  title: MarkaRapor API
  version: 1.0.0

paths:
  /workflows:
    get:
      summary: List workflows
    post:
      summary: Create workflow

  /workflows/{id}/run:
    post:
      summary: Run workflow

  /reports:
    get:
      summary: List reports

  /reports/{id}/export:
    post:
      summary: Export report
```

### 6.2 SDK (TypeScript)

```typescript
const client = new MarkaRaporClient('mk_api_xxx');

// Workflows
const workflows = await client.workflows.list('workspace_id');
const run = await client.workflows.run('workflow_id');

// Reports
const reports = await client.reports.list('workspace_id');
const pdf = await client.reports.export('report_id', 'PDF');
```

---

## 7. SLACK/EMAIL BİLDİRİMLER 🆕

### 7.1 Bildirim Tipleri

| Olay | Slack | Email | In-App |
|------|-------|-------|--------|
| Workflow başarılı | ✅ | ❌ | ✅ |
| Workflow hatalı | ✅ | ✅ | ✅ |
| Rapor hazır | ✅ | ✅ | ✅ |
| Kredi azaldı | ❌ | ✅ | ✅ |
| Bağlantı koptu | ✅ | ✅ | ✅ |

### 7.2 Slack Mesaj Örneği

```
✅ Workflow: Haftalık SEO Raporu
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Marka: ABC Şirketi
Süre: 2dk 34sn
Durum: Başarılı

[Detayları Gör]
```

### 7.3 Email Şablonları

- Rapor hazır bildirimi
- Workflow hata bildirimi
- Bağlantı süresi doldu
- Haftalık özet digest

### 7.4 Notification Settings UI

Kullanıcılar hangi bildirimleri alacaklarını seçebilir:
- Email tercihleri
- Slack webhook URL
- In-app bildirim ayarları

---

## 8. RAPOR ŞABLON EDİTÖRÜ 🆕

### 8.1 Şablon Özellikleri

| Özellik | Açıklama |
|---------|----------|
| Sayfa boyutu | A4, Letter, Custom |
| Yönelim | Dikey, Yatay |
| Logo konumu | Sol üst, Orta, Sağ üst |
| Renkler | Primary, Secondary |
| Font | Seçilebilir font ailesi |

### 8.2 Bölüm Yönetimi

Drag & drop ile sıralama:
- ☐ Kapak sayfası
- ☐ İçindekiler
- ☑ Yönetici özeti
- ☑ Metrik kartları
- ☑ Grafikler
- ☑ Tablolar
- ☐ AI Insights
- ☐ Aktiviteler

### 8.3 Editor UI

```
┌─────────────────────────────────────────────────┐
│ [Bölümler]    [Önizleme]           [Ayarlar]   │
├─────────────────────────────────────────────────┤
│ ☐ Kapak      ┌─────────────┐      Sayfa: A4   │
│ ☑ Özet       │  Preview    │      Yönelim: ▼  │
│ ☑ Metrikler  │  Area       │      Renk: 🎨    │
│ ☑ Grafikler  │             │      Font: ▼     │
│ [+ Ekle]     └─────────────┘                   │
├─────────────────────────────────────────────────┤
│ [Önizleme]                    [Kaydet] [İptal] │
└─────────────────────────────────────────────────┘
```

---

## 9. KARŞILAŞTIRMALI RAPORLAR 🆕

### 9.1 Karşılaştırma Tipleri

| Tip | Örnek |
|-----|-------|
| Dönem vs Dönem | Bu hafta vs geçen hafta |
| Yıl bazlı | Ocak 2026 vs Ocak 2025 |
| Marka vs Marka | Marka A vs Marka B |
| Kampanya | Kampanya 1 vs Kampanya 2 |

### 9.2 Karşılaştırma Tablosu

```
┌─────────────┬──────────┬──────────┬──────────┐
│ Metrik      │ Önceki   │ Şimdi    │ Değişim  │
├─────────────┼──────────┼──────────┼──────────┤
│ Impressions │ 10,000   │ 12,500   │ ▲ +25%   │
│ Clicks      │ 500      │ 625      │ ▲ +25%   │
│ CTR         │ 5.0%     │ 5.0%     │ → 0%     │
│ Conversions │ 25       │ 35       │ ▲ +40%   │
│ Cost        │ ₺250     │ ₺300     │ ▲ +20%   │
│ CPA         │ ₺10      │ ₺8.57    │ ▼ -14%   │
└─────────────┴──────────┴──────────┴──────────┘
```

### 9.3 Karşılaştırma Grafiği

Yan yana bar chart ile görsel karşılaştırma.

---

## 10. PREDICTIVE ANALYTICS 🔮

### 10.1 Tahmin Özellikleri

| Özellik | Açıklama |
|---------|----------|
| Traffic Forecast | Gelecek hafta trafik tahmini |
| Conversion Prediction | Dönüşüm oranı tahmini |
| Budget Optimizer | Optimal bütçe dağılımı önerisi |
| Anomaly Detection | Anormal değer tespiti |

### 10.2 Traffic Forecast

```
📈 Trafik Tahmini (7 gün)
━━━━━━━━━━━━━━━━━━━━━━━
[Çizgi grafik + confidence interval]

Tahmini toplam: 12,450 ziyaret
Güven aralığı: ±8%
```

### 10.3 Budget Optimizer

```
💰 Bütçe Önerileri
━━━━━━━━━━━━━━━━━
Campaign A: ₺500 → ₺750 (+50%)
Campaign B: ₺300 → ₺200 (-33%)
Campaign C: ₺200 → ₺250 (+25%)

Tahmini ROAS artışı: +18%
```

### 10.4 Anomaly Alerts

```
⚠️ Anomali Uyarısı
━━━━━━━━━━━━━━━━━
3 Ocak - Trafik %45 düştü
Muhtemel sebep: Resmi tatil

🔍 İncelemenizi öneririz
```

---

## 11. WHITE-LABEL SİSTEMİ 🔮

### 11.1 White-Label Özellikleri

| Özellik | Açıklama |
|---------|----------|
| Custom Domain | ajans.raporlar.com |
| Custom Logo | Ajans logosu |
| Custom Colors | Marka renkleri |
| Custom Email | noreply@ajans.com |
| Remove Branding | "MarkaRapor" yazısı yok |

### 11.2 Domain Setup

1. Domain ekle: `reports.ajans.com`
2. DNS kayıtları:
   - CNAME: `reports` → `custom.markarapor.com`
   - TXT: `_verify` → `verification-token`
3. SSL otomatik oluşturulur
4. Domain aktif!

### 11.3 Branding Settings

```
┌─────────────────────────────────────┐
│ White-Label Ayarları                │
├─────────────────────────────────────┤
│ Domain: reports.ajans.com ✓         │
│                                     │
│ Logo: [Upload]                      │
│ Favicon: [Upload]                   │
│                                     │
│ Primary Color: #3B82F6 🎨           │
│ Secondary Color: #10B981 🎨         │
│                                     │
│ App Name: Ajans Raporları           │
│ Support Email: destek@ajans.com     │
│                                     │
│ ☑ "MarkaRapor ile desteklenmektedir"│
│   yazısını gizle                    │
│                                     │
│ [Kaydet]                            │
└─────────────────────────────────────┘
```

---

## 12. GÜNCELLENMİŞ UYGULAMA TAKVİMİ

| Faz | Süre | İçerik |
|-----|------|--------|
| **1. Temel Altyapı** | 2 hafta | Proje yapısı, Auth, CRUD, **Test altyapısı**, **Error handling** |
| **2. Entegrasyonlar** | 2 hafta | Google APIs, **Rate limiting**, **Retry mekanizması** |
| **3. Workflow Engine** | 3 hafta | Editor, Scheduler, **Monitoring**, **Backup** |
| **4. AI Entegrasyonu** | 2 hafta | Claude/GPT, Agent, **Predictive (temel)** |
| **5. Raporlama** | 2 hafta | Export, **Şablon editörü**, **Karşılaştırmalı** |
| **6. Bildirimler & API** | 2 hafta | **Slack**, **Email**, **API docs** |
| **7. Polish & Launch** | 2 hafta | Optimization, **White-label (temel)**, Beta |

**Toplam: ~15 hafta**

---

## Özet: Eklenen Tüm Özellikler

### Kritik Eksikler (❌ → ✅)
1. ✅ Test stratejisi
2. ✅ Error handling sistemi
3. ✅ Monitoring & alerting
4. ✅ Backup & recovery
5. ✅ API rate limiting
6. ✅ API documentation

### Kısa Vadeli Özellikler (🆕)
7. ✅ Slack/Email bildirimler
8. ✅ Rapor şablon editörü
9. ✅ Karşılaştırmalı raporlar

### Uzun Vadeli Özellikler (🔮)
10. ✅ Predictive analytics
11. ✅ White-label sistemi
