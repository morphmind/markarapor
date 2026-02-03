# MarkaRapor - Teknik Mimari

## Teknoloji Stack

### Frontend
| Teknoloji | Amaç |
|-----------|------|
| Next.js 14 | Framework (App Router) |
| React 18 | UI Library |
| Tailwind CSS | Styling |
| shadcn/ui | Component Library |
| Zustand | State Management |
| React Hook Form + Zod | Form & Validation |
| TanStack Query | Data Fetching |
| Recharts | Grafikler |
| React Flow | Workflow Editor |
| Framer Motion | Animasyonlar |

### Backend
| Teknoloji | Amaç |
|-----------|------|
| Node.js 20 | Runtime |
| tRPC | Type-safe API |
| Prisma | ORM |
| PostgreSQL | Database |
| Redis | Cache & Queue |
| BullMQ | Background Jobs |
| NextAuth.js v5 | Authentication |

### AI
| Sağlayıcı | Model |
|-----------|-------|
| Anthropic | Claude Opus 4.5 |
| OpenAI | GPT 5.2 |
| Google | Gemini 3 |

### DevOps
| Servis | Amaç |
|--------|------|
| Vercel | Frontend hosting |
| Supabase/Neon | Database |
| Railway/Render | Background workers |
| Sentry | Error tracking |
| PostHog | Analytics |

---

## Proje Yapısı

```
markarapor/
├── apps/
│   └── web/                          # Next.js Ana Uygulama
│       ├── app/
│       │   ├── [locale]/             # i18n (tr, en)
│       │   │   ├── (auth)/           # Login, Register
│       │   │   ├── (dashboard)/      # Ana sayfa, workflow, reports
│       │   │   └── layout.tsx
│       │   └── api/
│       │       ├── trpc/             # tRPC endpoint
│       │       ├── auth/             # NextAuth
│       │       └── webhooks/         # Stripe, Google webhooks
│       ├── components/
│       │   ├── ui/                   # shadcn/ui
│       │   ├── workflow/             # Editor, Nodes
│       │   ├── reports/              # Report viewer
│       │   └── common/               # Shared components
│       └── lib/
│           ├── api/                  # API utilities
│           ├── utils/                # Helper functions
│           └── hooks/                # Custom hooks
│
├── packages/
│   ├── database/                     # Prisma
│   │   └── prisma/
│   │       ├── schema.prisma         # Database schema
│   │       └── migrations/
│   │
│   ├── ai/                           # AI Servisleri
│   │   └── src/
│   │       ├── providers/            # claude.ts, openai.ts, gemini.ts
│   │       └── prompts/              # Türkçe promptlar
│   │
│   ├── integrations/                 # Platform Entegrasyonları
│   │   └── src/
│   │       ├── google-ads/
│   │       ├── google-analytics/
│   │       ├── search-console/
│   │       ├── google-slides/
│   │       └── google-sheets/
│   │
│   ├── workflow-engine/              # Workflow Motoru
│   │   └── src/
│   │       ├── executor.ts           # Workflow çalıştırıcı
│   │       ├── scheduler.ts          # Zamanlayıcı
│   │       └── nodes/                # Node handler'ları
│   │
│   └── export/                       # Export Servisi
│       └── src/
│           ├── pdf.ts
│           ├── docx.ts
│           └── xlsx.ts
│
└── workers/                          # Background Jobs
    ├── workflow-runner/
    └── report-generator/
```

---

## Database Schema (Özet)

### Ana Tablolar

```
User           → Kullanıcı bilgileri, auth
Workspace      → Çalışma alanı (plan, kredi)
Brand          → Marka (logo, renk, connections)
Connection     → OAuth bağlantıları (Google hesapları)
Workflow       → Workflow tanımları (nodes, edges)
WorkflowRun    → Çalıştırma geçmişi
Report         → Oluşturulan raporlar
Billing        → Abonelik, faturalama
```

### İlişkiler

```
User ──< WorkspaceMember >── Workspace
Workspace ──< Brand
Workspace ──< Connection
Brand ──< Workflow
Workflow ──< WorkflowRun
Workflow ──< Report
```

---

## API Yapısı (tRPC)

```typescript
appRouter
├── auth         → Login, register, forgot password
├── user         → Profile, settings
├── workspace    → CRUD, members
├── brand        → CRUD, connections, activities
├── connection   → OAuth, test, refresh
├── workflow     → CRUD, run, schedule
├── report       → CRUD, export, share
├── ai           → Chat, analyze, generate
├── billing      → Subscription, credits
└── template     → List, use
```

---

## Workflow Engine Akışı

```
1. Tetikleme (Manual / Scheduled / Webhook)
        ↓
2. Workflow yükleme (nodes, edges)
        ↓
3. Topolojik sıralama (dependency order)
        ↓
4. Her node için:
   - Input'ları çöz (önceki node'lardan)
   - Handler'ı çalıştır
   - Output'u kaydet
        ↓
5. Son çıktıyı oluştur
        ↓
6. Loglama ve bildirim
```

### Node Tipleri

| Kategori | Node'lar |
|----------|----------|
| Trigger | manual, schedule, webhook |
| Google Ads | campaigns, keywords, performance |
| GA4 | report, realtime, audiences |
| GSC | performance, sitemaps, url-inspection |
| AI | ask, analyze, generate-structured |
| Chart | line, bar, pie, table |
| Export | pdf, docx, slides |
| Control | condition, loop, delay |

---

## Güvenlik

### Auth
- NextAuth.js v5 ile session management
- OAuth 2.0 (Google)
- JWT token'lar şifreli

### API
- Rate limiting (IP bazlı)
- Input validation (Zod)
- CSRF protection

### Token Storage
- AES-256 şifreleme
- Refresh token rotation

### Headers
- CORS policy
- Security headers (CSP, HSTS)
