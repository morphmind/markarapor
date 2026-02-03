# MarkaRapor - Kapsamlı Proje Planı

## Proje Özeti

**Proje Adı:** MarkaRapor
**Versiyon:** 1.0
**Tarih:** 27 Ocak 2026
**Hazırlayan:** AI Asistan

MarkaRapor, dijital pazarlama profesyonelleri için geliştirilmiş, yapay zeka destekli otomatik raporlama ve optimizasyon platformudur. Markifact'tan ilham alınarak, daha basit kullanım, daha güçlü AI modelleri ve Türkçe öncelikli tasarımla geliştirilecektir.

---

## 1. TEKNİK MİMARİ

### 1.1 Teknoloji Stack'i

#### Frontend
- **Framework:** Next.js 14+ (App Router)
- **UI Library:** React 18+
- **Styling:** Tailwind CSS + shadcn/ui
- **State Management:** Zustand
- **Form Handling:** React Hook Form + Zod
- **Data Fetching:** TanStack Query (React Query)
- **Charts:** Recharts + Chart.js
- **Drag & Drop:** @dnd-kit/core
- **Workflow Editor:** React Flow
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Date Handling:** date-fns
- **i18n:** next-intl

#### Backend
- **Runtime:** Node.js 20+
- **Framework:** Next.js API Routes + tRPC
- **ORM:** Prisma
- **Database:** PostgreSQL 15+
- **Cache:** Redis
- **Queue:** BullMQ
- **File Storage:** AWS S3 / Cloudflare R2
- **Auth:** NextAuth.js v5

#### AI Servisleri
- **Claude:** Anthropic API (claude-opus-4-5-20251101)
- **GPT:** OpenAI API (gpt-5.2)
- **Gemini:** Google AI API (gemini-3)

#### DevOps & Hosting
- **Hosting:** Vercel (Frontend) + Railway/Render (Backend Jobs)
- **Database:** Supabase / Neon
- **Monitoring:** Sentry
- **Analytics:** PostHog
- **CI/CD:** GitHub Actions

---

### 1.2 Proje Klasör Yapısı

```
markarapor/
├── apps/
│   └── web/                          # Next.js Ana Uygulama
│       ├── app/
│       │   ├── [locale]/             # i18n routing
│       │   │   ├── (auth)/
│       │   │   │   ├── login/
│       │   │   │   ├── register/
│       │   │   │   └── forgot-password/
│       │   │   ├── (dashboard)/
│       │   │   │   ├── layout.tsx
│       │   │   │   ├── page.tsx      # Dashboard Ana Sayfa
│       │   │   │   ├── workflows/
│       │   │   │   │   ├── page.tsx  # Workflow Listesi
│       │   │   │   │   ├── [id]/
│       │   │   │   │   │   ├── page.tsx      # Workflow Detay
│       │   │   │   │   │   └── editor/
│       │   │   │   │   │       └── page.tsx  # Workflow Editor
│       │   │   │   │   └── templates/
│       │   │   │   │       └── page.tsx
│       │   │   │   ├── reports/
│       │   │   │   │   ├── page.tsx
│       │   │   │   │   └── [id]/
│       │   │   │   │       └── page.tsx
│       │   │   │   ├── connections/
│       │   │   │   │   └── page.tsx
│       │   │   │   ├── brands/
│       │   │   │   │   ├── page.tsx
│       │   │   │   │   └── [id]/
│       │   │   │   │       └── page.tsx
│       │   │   │   ├── ai-agent/
│       │   │   │   │   └── page.tsx
│       │   │   │   ├── settings/
│       │   │   │   │   └── page.tsx
│       │   │   │   └── billing/
│       │   │   │       └── page.tsx
│       │   │   └── layout.tsx
│       │   └── api/
│       │       ├── trpc/
│       │       ├── auth/
│       │       ├── webhooks/
│       │       └── oauth/
│       ├── components/
│       │   ├── ui/                   # shadcn/ui components
│       │   ├── workflow/
│       │   │   ├── WorkflowEditor.tsx
│       │   │   ├── NodePalette.tsx
│       │   │   ├── nodes/
│       │   │   │   ├── TriggerNode.tsx
│       │   │   │   ├── GoogleAdsNode.tsx
│       │   │   │   ├── GoogleAnalyticsNode.tsx
│       │   │   │   ├── SearchConsoleNode.tsx
│       │   │   │   ├── AINode.tsx
│       │   │   │   ├── ChartNode.tsx
│       │   │   │   ├── SlidesNode.tsx
│       │   │   │   ├── SheetsNode.tsx
│       │   │   │   └── ExportNode.tsx
│       │   │   └── edges/
│       │   ├── reports/
│       │   │   ├── ReportViewer.tsx
│       │   │   ├── ReportBuilder.tsx
│       │   │   └── charts/
│       │   ├── brands/
│       │   ├── connections/
│       │   └── common/
│       ├── lib/
│       │   ├── api/
│       │   ├── utils/
│       │   ├── hooks/
│       │   └── validators/
│       ├── styles/
│       └── public/
├── packages/
│   ├── database/                     # Prisma Schema & Migrations
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   └── src/
│   ├── ai/                           # AI Service Layer
│   │   ├── src/
│   │   │   ├── providers/
│   │   │   │   ├── claude.ts
│   │   │   │   ├── openai.ts
│   │   │   │   └── gemini.ts
│   │   │   ├── prompts/
│   │   │   └── index.ts
│   │   └── package.json
│   ├── integrations/                 # Platform Entegrasyonları
│   │   ├── src/
│   │   │   ├── google-ads/
│   │   │   ├── google-analytics/
│   │   │   ├── search-console/
│   │   │   ├── google-slides/
│   │   │   ├── google-sheets/
│   │   │   └── google-drive/
│   │   └── package.json
│   ├── workflow-engine/              # Workflow Execution Engine
│   │   ├── src/
│   │   │   ├── executor.ts
│   │   │   ├── scheduler.ts
│   │   │   ├── nodes/
│   │   │   └── utils/
│   │   └── package.json
│   ├── export/                       # Export Service
│   │   ├── src/
│   │   │   ├── pdf.ts
│   │   │   ├── docx.ts
│   │   │   ├── xlsx.ts
│   │   │   └── templates/
│   │   └── package.json
│   └── shared/                       # Shared Types & Utils
│       ├── src/
│       │   ├── types/
│       │   └── utils/
│       └── package.json
├── workers/                          # Background Jobs
│   ├── workflow-runner/
│   └── report-generator/
├── docs/                             # Documentation
├── scripts/                          # Utility Scripts
├── .env.example
├── docker-compose.yml
├── turbo.json
└── package.json
```

---

## 2. VERİTABANI ŞEMASI

### 2.1 Prisma Schema

```prisma
// packages/database/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==================== KULLANICI & AUTH ====================

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  image         String?
  passwordHash  String?
  emailVerified DateTime?
  language      String    @default("tr")
  timezone      String    @default("Europe/Istanbul")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // İlişkiler
  accounts      Account[]
  sessions      Session[]
  workspaces    WorkspaceMember[]
  workflows     Workflow[]
  reports       Report[]
  apiKeys       ApiKey[]
  activities    ActivityLog[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// ==================== WORKSPACE & TEAM ====================

model Workspace {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  logo        String?
  plan        Plan     @default(FREE)
  credits     Int      @default(100)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // İlişkiler
  members     WorkspaceMember[]
  brands      Brand[]
  workflows   Workflow[]
  connections Connection[]
  reports     Report[]
  templates   WorkflowTemplate[]
  billing     Billing?
}

model WorkspaceMember {
  id          String   @id @default(cuid())
  workspaceId String
  userId      String
  role        Role     @default(MEMBER)
  joinedAt    DateTime @default(now())

  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([workspaceId, userId])
}

enum Plan {
  FREE
  PRO
  TEAM
  ENTERPRISE
}

enum Role {
  OWNER
  ADMIN
  MEMBER
  VIEWER
}

// ==================== MARKA YÖNETİMİ ====================

model Brand {
  id          String   @id @default(cuid())
  workspaceId String
  name        String
  logo        String?
  website     String?
  industry    String?
  description String?
  color       String?  @default("#3B82F6")
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // İlişkiler
  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  connections BrandConnection[]
  workflows   Workflow[]
  reports     Report[]
  activities  BrandActivity[]

  @@unique([workspaceId, name])
}

model BrandConnection {
  id           String   @id @default(cuid())
  brandId      String
  connectionId String
  accountId    String?  // Platform'daki hesap ID (örn: Google Ads Account ID)
  accountName  String?
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())

  brand      Brand      @relation(fields: [brandId], references: [id], onDelete: Cascade)
  connection Connection @relation(fields: [connectionId], references: [id], onDelete: Cascade)

  @@unique([brandId, connectionId, accountId])
}

model BrandActivity {
  id          String   @id @default(cuid())
  brandId     String
  date        DateTime
  category    String   // "seo", "ads", "content", "social", "other"
  title       String
  description String?  @db.Text
  impact      String?  // "high", "medium", "low"
  createdAt   DateTime @default(now())

  brand Brand @relation(fields: [brandId], references: [id], onDelete: Cascade)

  @@index([brandId, date])
}

// ==================== BAĞLANTILAR (OAuth) ====================

model Connection {
  id           String   @id @default(cuid())
  workspaceId  String
  platform     Platform
  name         String
  accessToken  String   @db.Text
  refreshToken String?  @db.Text
  tokenExpiry  DateTime?
  scope        String?
  metadata     Json?    // Platform'a özel veriler
  isActive     Boolean  @default(true)
  lastSyncAt   DateTime?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  workspace      Workspace         @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  brandConnections BrandConnection[]

  @@unique([workspaceId, platform, name])
}

enum Platform {
  GOOGLE_ADS
  GOOGLE_ANALYTICS
  GOOGLE_SEARCH_CONSOLE
  GOOGLE_SHEETS
  GOOGLE_SLIDES
  GOOGLE_DRIVE
  GOOGLE_BUSINESS_PROFILE
  META_ADS
  TIKTOK_ADS
  LINKEDIN_ADS
  MICROSOFT_ADS
  SLACK
  NOTION
}

// ==================== WORKFLOW SİSTEMİ ====================

model Workflow {
  id            String   @id @default(cuid())
  workspaceId   String
  brandId       String?
  userId        String
  name          String
  description   String?
  nodes         Json     // Workflow node'ları
  edges         Json     // Node bağlantıları
  variables     Json?    // Workflow değişkenleri
  schedule      Json?    // Zamanlama ayarları
  isActive      Boolean  @default(true)
  isTemplate    Boolean  @default(false)
  templateId    String?  // Şablondan oluşturulduysa
  lastRunAt     DateTime?
  nextRunAt     DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // İlişkiler
  workspace     Workspace          @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  brand         Brand?             @relation(fields: [brandId], references: [id], onDelete: SetNull)
  user          User               @relation(fields: [userId], references: [id])
  template      WorkflowTemplate?  @relation(fields: [templateId], references: [id])
  runs          WorkflowRun[]
  reports       Report[]

  @@index([workspaceId, brandId])
}

model WorkflowTemplate {
  id          String   @id @default(cuid())
  workspaceId String?  // null = global template
  name        String
  nameEn      String?
  description String?
  descriptionEn String?
  category    String   // "reporting", "seo", "ads", "analytics", "optimization"
  subcategory String?
  nodes       Json
  edges       Json
  variables   Json?
  thumbnail   String?
  isPublic    Boolean  @default(false)
  isPremium   Boolean  @default(false)
  usageCount  Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  workspace   Workspace? @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  workflows   Workflow[]

  @@index([category, isPublic])
}

model WorkflowRun {
  id          String      @id @default(cuid())
  workflowId  String
  status      RunStatus   @default(PENDING)
  trigger     TriggerType
  startedAt   DateTime?
  completedAt DateTime?
  duration    Int?        // milliseconds
  logs        Json?       // Execution logs
  outputs     Json?       // Final outputs
  error       String?
  creditsUsed Int         @default(0)
  createdAt   DateTime    @default(now())

  workflow    Workflow    @relation(fields: [workflowId], references: [id], onDelete: Cascade)
  nodeRuns    NodeRun[]

  @@index([workflowId, createdAt])
}

model NodeRun {
  id          String    @id @default(cuid())
  runId       String
  nodeId      String
  nodeType    String
  status      RunStatus @default(PENDING)
  inputs      Json?
  outputs     Json?
  error       String?
  startedAt   DateTime?
  completedAt DateTime?
  duration    Int?

  run         WorkflowRun @relation(fields: [runId], references: [id], onDelete: Cascade)

  @@index([runId, nodeId])
}

enum RunStatus {
  PENDING
  RUNNING
  COMPLETED
  FAILED
  CANCELLED
}

enum TriggerType {
  MANUAL
  SCHEDULED
  WEBHOOK
  API
}

// ==================== RAPORLAR ====================

model Report {
  id          String     @id @default(cuid())
  workspaceId String
  brandId     String?
  workflowId  String?
  userId      String
  name        String
  type        ReportType
  period      Json       // { start: Date, end: Date, type: "weekly" | "monthly" | "custom" }
  data        Json       // Rapor verileri
  insights    Json?      // AI insights
  activities  Json?      // Dönem içi aktiviteler
  status      ReportStatus @default(DRAFT)
  publishedAt DateTime?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  workspace   Workspace  @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  brand       Brand?     @relation(fields: [brandId], references: [id], onDelete: SetNull)
  workflow    Workflow?  @relation(fields: [workflowId], references: [id], onDelete: SetNull)
  user        User       @relation(fields: [userId], references: [id])
  exports     ReportExport[]
  shares      ReportShare[]
}

model ReportExport {
  id        String       @id @default(cuid())
  reportId  String
  format    ExportFormat
  fileUrl   String
  fileSize  Int
  createdAt DateTime     @default(now())

  report    Report       @relation(fields: [reportId], references: [id], onDelete: Cascade)
}

model ReportShare {
  id        String   @id @default(cuid())
  reportId  String
  email     String?
  link      String   @unique
  password  String?
  expiresAt DateTime?
  viewCount Int      @default(0)
  createdAt DateTime @default(now())

  report    Report   @relation(fields: [reportId], references: [id], onDelete: Cascade)
}

enum ReportType {
  PERFORMANCE
  SEO
  ADS
  ANALYTICS
  COMBINED
  AUDIT
  CUSTOM
}

enum ReportStatus {
  DRAFT
  GENERATING
  READY
  PUBLISHED
  ARCHIVED
}

enum ExportFormat {
  PDF
  DOCX
  XLSX
  PPTX
  GOOGLE_SLIDES
  GOOGLE_SHEETS
  HTML
  JSON
}

// ==================== FATURALAMA ====================

model Billing {
  id              String   @id @default(cuid())
  workspaceId     String   @unique
  stripeCustomerId String?
  subscriptionId  String?
  plan            Plan     @default(FREE)
  billingEmail    String?
  billingCycle    String?  // "monthly" | "yearly"
  currentPeriodStart DateTime?
  currentPeriodEnd   DateTime?
  cancelAtPeriodEnd  Boolean @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  workspace       Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  invoices        Invoice[]
  creditHistory   CreditHistory[]
}

model Invoice {
  id          String   @id @default(cuid())
  billingId   String
  stripeInvoiceId String?
  amount      Int
  currency    String   @default("TRY")
  status      String
  paidAt      DateTime?
  createdAt   DateTime @default(now())

  billing     Billing  @relation(fields: [billingId], references: [id], onDelete: Cascade)
}

model CreditHistory {
  id          String   @id @default(cuid())
  billingId   String
  amount      Int      // + veya -
  balance     Int      // işlem sonrası bakiye
  type        String   // "purchase", "usage", "bonus", "refund"
  description String?
  metadata    Json?
  createdAt   DateTime @default(now())

  billing     Billing  @relation(fields: [billingId], references: [id], onDelete: Cascade)

  @@index([billingId, createdAt])
}

// ==================== API & LOGGING ====================

model ApiKey {
  id          String   @id @default(cuid())
  userId      String
  name        String
  key         String   @unique
  lastUsedAt  DateTime?
  expiresAt   DateTime?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())

  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model ActivityLog {
  id          String   @id @default(cuid())
  userId      String?
  workspaceId String?
  action      String
  entity      String   // "workflow", "report", "connection", etc.
  entityId    String?
  metadata    Json?
  ipAddress   String?
  userAgent   String?
  createdAt   DateTime @default(now())

  user        User?    @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([workspaceId, createdAt])
  @@index([userId, createdAt])
}
```

---

## 3. API TASARIMI (tRPC)

### 3.1 tRPC Router Yapısı

```typescript
// apps/web/server/routers/_app.ts

import { router } from '../trpc';
import { authRouter } from './auth';
import { userRouter } from './user';
import { workspaceRouter } from './workspace';
import { brandRouter } from './brand';
import { connectionRouter } from './connection';
import { workflowRouter } from './workflow';
import { reportRouter } from './report';
import { aiRouter } from './ai';
import { exportRouter } from './export';
import { billingRouter } from './billing';
import { templateRouter } from './template';

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  workspace: workspaceRouter,
  brand: brandRouter,
  connection: connectionRouter,
  workflow: workflowRouter,
  report: reportRouter,
  ai: aiRouter,
  export: exportRouter,
  billing: billingRouter,
  template: templateRouter,
});

export type AppRouter = typeof appRouter;
```

### 3.2 Workflow Router Detayları

```typescript
// apps/web/server/routers/workflow.ts

import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';

export const workflowRouter = router({
  // Workflow CRUD
  list: protectedProcedure
    .input(z.object({
      workspaceId: z.string(),
      brandId: z.string().optional(),
      page: z.number().default(1),
      limit: z.number().default(20),
    }))
    .query(async ({ ctx, input }) => {
      // Workflow listesi
    }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      // Tek workflow getir
    }),

  create: protectedProcedure
    .input(z.object({
      workspaceId: z.string(),
      brandId: z.string().optional(),
      name: z.string(),
      description: z.string().optional(),
      templateId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Yeni workflow oluştur
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().optional(),
      description: z.string().optional(),
      nodes: z.any().optional(),
      edges: z.any().optional(),
      variables: z.any().optional(),
      schedule: z.any().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Workflow güncelle
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Workflow sil
    }),

  duplicate: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Workflow kopyala
    }),

  // Çalıştırma
  run: protectedProcedure
    .input(z.object({
      id: z.string(),
      variables: z.record(z.any()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Workflow çalıştır
    }),

  stop: protectedProcedure
    .input(z.object({ runId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Çalışan workflow'u durdur
    }),

  // Run geçmişi
  runs: protectedProcedure
    .input(z.object({
      workflowId: z.string(),
      page: z.number().default(1),
      limit: z.number().default(20),
    }))
    .query(async ({ ctx, input }) => {
      // Çalıştırma geçmişi
    }),

  runDetails: protectedProcedure
    .input(z.object({ runId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Çalıştırma detayları
    }),

  // Zamanlama
  setSchedule: protectedProcedure
    .input(z.object({
      id: z.string(),
      schedule: z.object({
        enabled: z.boolean(),
        frequency: z.enum(['hourly', 'daily', 'weekly', 'monthly']),
        time: z.string().optional(),
        dayOfWeek: z.number().optional(),
        dayOfMonth: z.number().optional(),
        timezone: z.string().default('Europe/Istanbul'),
      }),
    }))
    .mutation(async ({ ctx, input }) => {
      // Zamanlama ayarla
    }),

  // Node işlemleri
  testNode: protectedProcedure
    .input(z.object({
      workflowId: z.string(),
      nodeId: z.string(),
      inputs: z.record(z.any()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Tek node test et
    }),
});
```

### 3.3 Report Router Detayları

```typescript
// apps/web/server/routers/report.ts

import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';

export const reportRouter = router({
  // Rapor CRUD
  list: protectedProcedure
    .input(z.object({
      workspaceId: z.string(),
      brandId: z.string().optional(),
      type: z.enum(['PERFORMANCE', 'SEO', 'ADS', 'ANALYTICS', 'COMBINED', 'AUDIT', 'CUSTOM']).optional(),
      status: z.enum(['DRAFT', 'GENERATING', 'READY', 'PUBLISHED', 'ARCHIVED']).optional(),
      page: z.number().default(1),
      limit: z.number().default(20),
    }))
    .query(async ({ ctx, input }) => {
      // Rapor listesi
    }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      // Tek rapor getir
    }),

  create: protectedProcedure
    .input(z.object({
      workspaceId: z.string(),
      brandId: z.string(),
      name: z.string(),
      type: z.enum(['PERFORMANCE', 'SEO', 'ADS', 'ANALYTICS', 'COMBINED', 'AUDIT', 'CUSTOM']),
      period: z.object({
        start: z.string(),
        end: z.string(),
        type: z.enum(['weekly', 'monthly', 'custom']),
      }),
    }))
    .mutation(async ({ ctx, input }) => {
      // Yeni rapor oluştur
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().optional(),
      data: z.any().optional(),
      insights: z.any().optional(),
      activities: z.any().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Rapor güncelle
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Rapor sil
    }),

  // AI Insights
  generateInsights: protectedProcedure
    .input(z.object({
      id: z.string(),
      aiModel: z.enum(['claude', 'gpt', 'gemini']).default('claude'),
      language: z.string().default('tr'),
    }))
    .mutation(async ({ ctx, input }) => {
      // AI insights oluştur
    }),

  // Export
  export: protectedProcedure
    .input(z.object({
      id: z.string(),
      format: z.enum(['PDF', 'DOCX', 'XLSX', 'PPTX', 'GOOGLE_SLIDES', 'GOOGLE_SHEETS', 'HTML', 'JSON']),
      options: z.object({
        includeCharts: z.boolean().default(true),
        includeInsights: z.boolean().default(true),
        includeActivities: z.boolean().default(true),
        templateId: z.string().optional(),
      }).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Rapor export et
    }),

  // Paylaşım
  share: protectedProcedure
    .input(z.object({
      id: z.string(),
      email: z.string().email().optional(),
      password: z.string().optional(),
      expiresIn: z.number().optional(), // hours
    }))
    .mutation(async ({ ctx, input }) => {
      // Paylaşım linki oluştur
    }),

  // Publish
  publish: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Raporu yayınla
    }),
});
```

### 3.4 AI Router Detayları

```typescript
// apps/web/server/routers/ai.ts

import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';

export const aiRouter = router({
  // Sohbet
  chat: protectedProcedure
    .input(z.object({
      workspaceId: z.string(),
      message: z.string(),
      context: z.object({
        brandId: z.string().optional(),
        reportId: z.string().optional(),
        workflowId: z.string().optional(),
      }).optional(),
      model: z.enum(['claude', 'gpt', 'gemini']).default('claude'),
      conversationId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // AI sohbet
    }),

  // Veri Analizi
  analyzeData: protectedProcedure
    .input(z.object({
      data: z.any(),
      prompt: z.string().optional(),
      model: z.enum(['claude', 'gpt', 'gemini']).default('claude'),
      language: z.string().default('tr'),
    }))
    .mutation(async ({ ctx, input }) => {
      // Veri analizi
    }),

  // Insight Oluşturma
  generateInsight: protectedProcedure
    .input(z.object({
      data: z.any(),
      type: z.enum(['summary', 'recommendation', 'comparison', 'trend', 'anomaly']),
      model: z.enum(['claude', 'gpt', 'gemini']).default('claude'),
      language: z.string().default('tr'),
    }))
    .mutation(async ({ ctx, input }) => {
      // Insight oluştur
    }),

  // Yapılandırılmış Veri Oluşturma
  generateStructuredData: protectedProcedure
    .input(z.object({
      prompt: z.string(),
      schema: z.any(), // JSON Schema
      model: z.enum(['claude', 'gpt', 'gemini']).default('claude'),
    }))
    .mutation(async ({ ctx, input }) => {
      // Yapılandırılmış veri oluştur
    }),

  // Rapor Metni Oluşturma
  generateReportText: protectedProcedure
    .input(z.object({
      data: z.any(),
      template: z.string().optional(),
      sections: z.array(z.string()),
      model: z.enum(['claude', 'gpt', 'gemini']).default('claude'),
      language: z.string().default('tr'),
      tone: z.enum(['formal', 'casual', 'technical']).default('formal'),
    }))
    .mutation(async ({ ctx, input }) => {
      // Rapor metni oluştur
    }),

  // Task Çalıştırma (AI Agent)
  executeTask: protectedProcedure
    .input(z.object({
      workspaceId: z.string(),
      task: z.string(),
      context: z.object({
        brandId: z.string().optional(),
        availableConnections: z.array(z.string()).optional(),
      }).optional(),
      model: z.enum(['claude', 'gpt', 'gemini']).default('claude'),
    }))
    .mutation(async ({ ctx, input }) => {
      // AI agent task çalıştır
    }),
});
```

---

## 4. WORKFLOW ENGINE

### 4.1 Node Tipleri

```typescript
// packages/workflow-engine/src/types/nodes.ts

export type NodeType =
  // Tetikleyiciler
  | 'trigger-manual'
  | 'trigger-schedule'
  | 'trigger-webhook'

  // Google Ads
  | 'google-ads-account'
  | 'google-ads-campaigns'
  | 'google-ads-ad-groups'
  | 'google-ads-keywords'
  | 'google-ads-search-terms'
  | 'google-ads-performance'

  // Google Analytics
  | 'ga4-property'
  | 'ga4-report'
  | 'ga4-realtime'
  | 'ga4-audiences'

  // Search Console
  | 'gsc-property'
  | 'gsc-performance'
  | 'gsc-sitemaps'
  | 'gsc-url-inspection'

  // Google Slides
  | 'slides-get'
  | 'slides-create'
  | 'slides-update'
  | 'slides-add-slide'
  | 'slides-update-text'
  | 'slides-add-image'
  | 'slides-add-chart'

  // Google Sheets
  | 'sheets-get'
  | 'sheets-create'
  | 'sheets-read'
  | 'sheets-write'
  | 'sheets-append'
  | 'sheets-clear'

  // AI
  | 'ai-ask'
  | 'ai-analyze'
  | 'ai-generate-structured'
  | 'ai-generate-image'
  | 'ai-agent'

  // Veri İşleme
  | 'data-transform'
  | 'data-filter'
  | 'data-aggregate'
  | 'data-merge'
  | 'data-split'

  // Görselleştirme
  | 'chart-line'
  | 'chart-bar'
  | 'chart-pie'
  | 'chart-area'
  | 'chart-table'

  // Export
  | 'export-pdf'
  | 'export-docx'
  | 'export-xlsx'

  // Kontrol Akışı
  | 'condition'
  | 'loop'
  | 'delay'
  | 'parallel'

  // İletişim
  | 'email-send'
  | 'slack-message'
  | 'webhook-call'

  // Utility
  | 'variable-set'
  | 'variable-get'
  | 'code-javascript'
  | 'note';

// Node Konfigürasyonu
export interface NodeConfig {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: {
    label: string;
    config: Record<string, any>;
    inputs?: string[];
    outputs?: string[];
  };
}
```

### 4.2 Workflow Executor

```typescript
// packages/workflow-engine/src/executor.ts

import { PrismaClient } from '@prisma/client';
import { Redis } from 'ioredis';
import { Queue } from 'bullmq';

export class WorkflowExecutor {
  private prisma: PrismaClient;
  private redis: Redis;
  private queue: Queue;
  private nodeHandlers: Map<string, NodeHandler>;

  constructor() {
    this.prisma = new PrismaClient();
    this.redis = new Redis(process.env.REDIS_URL);
    this.queue = new Queue('workflow-execution', {
      connection: this.redis,
    });
    this.nodeHandlers = new Map();
    this.registerNodeHandlers();
  }

  private registerNodeHandlers() {
    // Google Ads Handlers
    this.nodeHandlers.set('google-ads-performance', new GoogleAdsPerformanceHandler());
    this.nodeHandlers.set('google-ads-campaigns', new GoogleAdsCampaignsHandler());

    // Google Analytics Handlers
    this.nodeHandlers.set('ga4-report', new GA4ReportHandler());

    // Search Console Handlers
    this.nodeHandlers.set('gsc-performance', new GSCPerformanceHandler());

    // AI Handlers
    this.nodeHandlers.set('ai-ask', new AIAskHandler());
    this.nodeHandlers.set('ai-analyze', new AIAnalyzeHandler());

    // Chart Handlers
    this.nodeHandlers.set('chart-line', new ChartLineHandler());
    this.nodeHandlers.set('chart-bar', new ChartBarHandler());

    // Slides Handlers
    this.nodeHandlers.set('slides-update', new SlidesUpdateHandler());
    this.nodeHandlers.set('slides-add-slide', new SlidesAddSlideHandler());

    // Export Handlers
    this.nodeHandlers.set('export-pdf', new ExportPDFHandler());
    this.nodeHandlers.set('export-docx', new ExportDOCXHandler());

    // ... diğer handler'lar
  }

  async executeWorkflow(
    workflowId: string,
    trigger: 'MANUAL' | 'SCHEDULED' | 'WEBHOOK' | 'API',
    variables?: Record<string, any>
  ) {
    // Workflow'u getir
    const workflow = await this.prisma.workflow.findUnique({
      where: { id: workflowId },
      include: {
        workspace: true,
        brand: {
          include: {
            connections: {
              include: { connection: true },
            },
          },
        },
      },
    });

    if (!workflow) throw new Error('Workflow not found');

    // Run kaydı oluştur
    const run = await this.prisma.workflowRun.create({
      data: {
        workflowId,
        trigger,
        status: 'RUNNING',
        startedAt: new Date(),
      },
    });

    try {
      // Execution context
      const context: ExecutionContext = {
        runId: run.id,
        workflowId,
        workspaceId: workflow.workspaceId,
        brand: workflow.brand,
        connections: this.buildConnectionMap(workflow.brand?.connections || []),
        variables: { ...workflow.variables, ...variables },
        outputs: {},
      };

      // Topolojik sıralama ile node'ları çalıştır
      const nodes = workflow.nodes as NodeConfig[];
      const edges = workflow.edges as EdgeConfig[];
      const sortedNodes = this.topologicalSort(nodes, edges);

      for (const node of sortedNodes) {
        await this.executeNode(node, context);
      }

      // Tamamlandı
      await this.prisma.workflowRun.update({
        where: { id: run.id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          duration: Date.now() - run.startedAt!.getTime(),
          outputs: context.outputs,
        },
      });

      return { runId: run.id, status: 'COMPLETED', outputs: context.outputs };
    } catch (error) {
      await this.prisma.workflowRun.update({
        where: { id: run.id },
        data: {
          status: 'FAILED',
          completedAt: new Date(),
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });

      throw error;
    }
  }

  private async executeNode(node: NodeConfig, context: ExecutionContext) {
    const handler = this.nodeHandlers.get(node.type);
    if (!handler) throw new Error(`Unknown node type: ${node.type}`);

    const nodeRun = await this.prisma.nodeRun.create({
      data: {
        runId: context.runId,
        nodeId: node.id,
        nodeType: node.type,
        status: 'RUNNING',
        startedAt: new Date(),
        inputs: this.resolveInputs(node, context),
      },
    });

    try {
      const result = await handler.execute(node, context);

      context.outputs[node.id] = result;

      await this.prisma.nodeRun.update({
        where: { id: nodeRun.id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          duration: Date.now() - nodeRun.startedAt!.getTime(),
          outputs: result,
        },
      });

      return result;
    } catch (error) {
      await this.prisma.nodeRun.update({
        where: { id: nodeRun.id },
        data: {
          status: 'FAILED',
          completedAt: new Date(),
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });

      throw error;
    }
  }

  private topologicalSort(nodes: NodeConfig[], edges: EdgeConfig[]): NodeConfig[] {
    // Kahn's algorithm ile topolojik sıralama
    const inDegree = new Map<string, number>();
    const adjList = new Map<string, string[]>();

    nodes.forEach(node => {
      inDegree.set(node.id, 0);
      adjList.set(node.id, []);
    });

    edges.forEach(edge => {
      inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
      adjList.get(edge.source)?.push(edge.target);
    });

    const queue: string[] = [];
    inDegree.forEach((degree, nodeId) => {
      if (degree === 0) queue.push(nodeId);
    });

    const sorted: NodeConfig[] = [];
    const nodeMap = new Map(nodes.map(n => [n.id, n]));

    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      sorted.push(nodeMap.get(nodeId)!);

      adjList.get(nodeId)?.forEach(neighbor => {
        const newDegree = (inDegree.get(neighbor) || 0) - 1;
        inDegree.set(neighbor, newDegree);
        if (newDegree === 0) queue.push(neighbor);
      });
    }

    return sorted;
  }

  private resolveInputs(node: NodeConfig, context: ExecutionContext): Record<string, any> {
    // Node input'larını önceki output'lardan ve değişkenlerden çöz
    const inputs: Record<string, any> = {};

    // Variable substitution: {{variable_name}} veya {{nodeId.output}}
    const config = JSON.stringify(node.data.config);
    const resolved = config.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
      const parts = path.split('.');
      if (parts.length === 1) {
        return context.variables[parts[0]] ?? match;
      } else {
        const [nodeId, ...rest] = parts;
        const nodeOutput = context.outputs[nodeId];
        return rest.reduce((obj, key) => obj?.[key], nodeOutput) ?? match;
      }
    });

    return JSON.parse(resolved);
  }
}
```

---

## 5. ENTEGRASYON SERVİSLERİ

### 5.1 Google Ads Entegrasyonu

```typescript
// packages/integrations/src/google-ads/client.ts

import { GoogleAdsApi } from 'google-ads-api';

export class GoogleAdsClient {
  private client: GoogleAdsApi;

  constructor(refreshToken: string) {
    this.client = new GoogleAdsApi({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
    });
  }

  async getAccounts(refreshToken: string) {
    const customer = this.client.Customer({
      customer_id: 'MANAGER_ACCOUNT_ID',
      refresh_token: refreshToken,
    });

    const accounts = await customer.query(`
      SELECT
        customer_client.client_customer,
        customer_client.level,
        customer_client.manager,
        customer_client.descriptive_name,
        customer_client.currency_code,
        customer_client.time_zone
      FROM customer_client
      WHERE customer_client.level <= 1
    `);

    return accounts;
  }

  async getCampaignPerformance(
    customerId: string,
    refreshToken: string,
    dateRange: { start: string; end: string }
  ) {
    const customer = this.client.Customer({
      customer_id: customerId,
      refresh_token: refreshToken,
    });

    const campaigns = await customer.query(`
      SELECT
        campaign.id,
        campaign.name,
        campaign.status,
        campaign.advertising_channel_type,
        campaign.bidding_strategy_type,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions,
        metrics.conversions_value,
        metrics.ctr,
        metrics.average_cpc,
        metrics.cost_per_conversion
      FROM campaign
      WHERE segments.date BETWEEN '${dateRange.start}' AND '${dateRange.end}'
        AND campaign.status != 'REMOVED'
      ORDER BY metrics.cost_micros DESC
    `);

    return campaigns.map(c => ({
      id: c.campaign?.id,
      name: c.campaign?.name,
      status: c.campaign?.status,
      channelType: c.campaign?.advertising_channel_type,
      biddingStrategy: c.campaign?.bidding_strategy_type,
      impressions: Number(c.metrics?.impressions || 0),
      clicks: Number(c.metrics?.clicks || 0),
      cost: Number(c.metrics?.cost_micros || 0) / 1_000_000,
      conversions: Number(c.metrics?.conversions || 0),
      conversionValue: Number(c.metrics?.conversions_value || 0),
      ctr: Number(c.metrics?.ctr || 0),
      avgCpc: Number(c.metrics?.average_cpc || 0) / 1_000_000,
      costPerConversion: Number(c.metrics?.cost_per_conversion || 0) / 1_000_000,
    }));
  }

  async getKeywordPerformance(
    customerId: string,
    refreshToken: string,
    dateRange: { start: string; end: string }
  ) {
    const customer = this.client.Customer({
      customer_id: customerId,
      refresh_token: refreshToken,
    });

    const keywords = await customer.query(`
      SELECT
        ad_group_criterion.keyword.text,
        ad_group_criterion.keyword.match_type,
        ad_group_criterion.status,
        ad_group_criterion.quality_info.quality_score,
        campaign.name,
        ad_group.name,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions,
        metrics.ctr,
        metrics.average_cpc
      FROM keyword_view
      WHERE segments.date BETWEEN '${dateRange.start}' AND '${dateRange.end}'
        AND ad_group_criterion.status != 'REMOVED'
      ORDER BY metrics.impressions DESC
      LIMIT 100
    `);

    return keywords;
  }

  async getSearchTerms(
    customerId: string,
    refreshToken: string,
    dateRange: { start: string; end: string }
  ) {
    const customer = this.client.Customer({
      customer_id: customerId,
      refresh_token: refreshToken,
    });

    const searchTerms = await customer.query(`
      SELECT
        search_term_view.search_term,
        search_term_view.status,
        campaign.name,
        ad_group.name,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions,
        metrics.ctr
      FROM search_term_view
      WHERE segments.date BETWEEN '${dateRange.start}' AND '${dateRange.end}'
      ORDER BY metrics.impressions DESC
      LIMIT 100
    `);

    return searchTerms;
  }
}
```

### 5.2 Google Analytics 4 Entegrasyonu

```typescript
// packages/integrations/src/google-analytics/client.ts

import { BetaAnalyticsDataClient } from '@google-analytics/data';

export class GoogleAnalyticsClient {
  private client: BetaAnalyticsDataClient;

  constructor(credentials: any) {
    this.client = new BetaAnalyticsDataClient({
      credentials,
    });
  }

  async getProperties(accessToken: string) {
    // Admin API ile property listesi
    const response = await fetch(
      'https://analyticsadmin.googleapis.com/v1beta/accountSummaries',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.json();
  }

  async runReport(
    propertyId: string,
    config: {
      dateRanges: { startDate: string; endDate: string }[];
      dimensions?: string[];
      metrics: string[];
      orderBys?: { dimension?: string; metric?: string; desc?: boolean }[];
      limit?: number;
    }
  ) {
    const [response] = await this.client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: config.dateRanges.map(dr => ({
        startDate: dr.startDate,
        endDate: dr.endDate,
      })),
      dimensions: config.dimensions?.map(d => ({ name: d })),
      metrics: config.metrics.map(m => ({ name: m })),
      orderBys: config.orderBys?.map(ob => ({
        dimension: ob.dimension ? { dimensionName: ob.dimension } : undefined,
        metric: ob.metric ? { metricName: ob.metric } : undefined,
        desc: ob.desc,
      })),
      limit: config.limit,
    });

    return this.formatReportResponse(response);
  }

  async getOverviewReport(
    propertyId: string,
    dateRange: { start: string; end: string }
  ) {
    return this.runReport(propertyId, {
      dateRanges: [{ startDate: dateRange.start, endDate: dateRange.end }],
      metrics: [
        'sessions',
        'totalUsers',
        'newUsers',
        'activeUsers',
        'screenPageViews',
        'averageSessionDuration',
        'bounceRate',
        'engagementRate',
        'conversions',
        'totalRevenue',
      ],
    });
  }

  async getTrafficSourcesReport(
    propertyId: string,
    dateRange: { start: string; end: string }
  ) {
    return this.runReport(propertyId, {
      dateRanges: [{ startDate: dateRange.start, endDate: dateRange.end }],
      dimensions: ['sessionSource', 'sessionMedium'],
      metrics: [
        'sessions',
        'totalUsers',
        'conversions',
        'totalRevenue',
      ],
      orderBys: [{ metric: 'sessions', desc: true }],
      limit: 20,
    });
  }

  async getTopPagesReport(
    propertyId: string,
    dateRange: { start: string; end: string }
  ) {
    return this.runReport(propertyId, {
      dateRanges: [{ startDate: dateRange.start, endDate: dateRange.end }],
      dimensions: ['pagePath', 'pageTitle'],
      metrics: [
        'screenPageViews',
        'averageSessionDuration',
        'bounceRate',
        'conversions',
      ],
      orderBys: [{ metric: 'screenPageViews', desc: true }],
      limit: 20,
    });
  }

  async getDeviceReport(
    propertyId: string,
    dateRange: { start: string; end: string }
  ) {
    return this.runReport(propertyId, {
      dateRanges: [{ startDate: dateRange.start, endDate: dateRange.end }],
      dimensions: ['deviceCategory'],
      metrics: [
        'sessions',
        'totalUsers',
        'conversions',
        'engagementRate',
      ],
    });
  }

  async getGeographyReport(
    propertyId: string,
    dateRange: { start: string; end: string }
  ) {
    return this.runReport(propertyId, {
      dateRanges: [{ startDate: dateRange.start, endDate: dateRange.end }],
      dimensions: ['country', 'city'],
      metrics: [
        'sessions',
        'totalUsers',
        'conversions',
      ],
      orderBys: [{ metric: 'sessions', desc: true }],
      limit: 20,
    });
  }

  private formatReportResponse(response: any) {
    const headers = [
      ...(response.dimensionHeaders?.map((h: any) => h.name) || []),
      ...(response.metricHeaders?.map((h: any) => h.name) || []),
    ];

    const rows = response.rows?.map((row: any) => {
      const values = [
        ...(row.dimensionValues?.map((v: any) => v.value) || []),
        ...(row.metricValues?.map((v: any) => v.value) || []),
      ];
      return Object.fromEntries(headers.map((h, i) => [h, values[i]]));
    }) || [];

    return { headers, rows, totals: response.totals };
  }
}
```

### 5.3 Google Search Console Entegrasyonu

```typescript
// packages/integrations/src/search-console/client.ts

import { google } from 'googleapis';

export class SearchConsoleClient {
  private searchconsole: any;

  constructor(auth: any) {
    this.searchconsole = google.searchconsole({ version: 'v1', auth });
  }

  async getSites(accessToken: string) {
    const response = await fetch(
      'https://www.googleapis.com/webmasters/v3/sites',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.json();
  }

  async getSearchAnalytics(
    siteUrl: string,
    config: {
      startDate: string;
      endDate: string;
      dimensions: ('query' | 'page' | 'country' | 'device' | 'date')[];
      rowLimit?: number;
      startRow?: number;
      searchType?: 'web' | 'image' | 'video' | 'news';
    }
  ) {
    const response = await this.searchconsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: config.startDate,
        endDate: config.endDate,
        dimensions: config.dimensions,
        rowLimit: config.rowLimit || 1000,
        startRow: config.startRow || 0,
        searchType: config.searchType || 'web',
      },
    });

    return response.data.rows?.map((row: any) => ({
      keys: row.keys,
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: row.ctr,
      position: row.position,
    })) || [];
  }

  async getTopQueries(
    siteUrl: string,
    dateRange: { start: string; end: string },
    limit: number = 50
  ) {
    return this.getSearchAnalytics(siteUrl, {
      startDate: dateRange.start,
      endDate: dateRange.end,
      dimensions: ['query'],
      rowLimit: limit,
    });
  }

  async getTopPages(
    siteUrl: string,
    dateRange: { start: string; end: string },
    limit: number = 50
  ) {
    return this.getSearchAnalytics(siteUrl, {
      startDate: dateRange.start,
      endDate: dateRange.end,
      dimensions: ['page'],
      rowLimit: limit,
    });
  }

  async getPerformanceByDate(
    siteUrl: string,
    dateRange: { start: string; end: string }
  ) {
    return this.getSearchAnalytics(siteUrl, {
      startDate: dateRange.start,
      endDate: dateRange.end,
      dimensions: ['date'],
    });
  }

  async getPerformanceByDevice(
    siteUrl: string,
    dateRange: { start: string; end: string }
  ) {
    return this.getSearchAnalytics(siteUrl, {
      startDate: dateRange.start,
      endDate: dateRange.end,
      dimensions: ['device'],
    });
  }

  async getPerformanceByCountry(
    siteUrl: string,
    dateRange: { start: string; end: string }
  ) {
    return this.getSearchAnalytics(siteUrl, {
      startDate: dateRange.start,
      endDate: dateRange.end,
      dimensions: ['country'],
    });
  }

  async getSitemaps(siteUrl: string) {
    const response = await this.searchconsole.sitemaps.list({ siteUrl });
    return response.data.sitemap || [];
  }

  async inspectUrl(siteUrl: string, inspectionUrl: string) {
    const response = await this.searchconsole.urlInspection.index.inspect({
      requestBody: {
        inspectionUrl,
        siteUrl,
      },
    });
    return response.data;
  }
}
```

### 5.4 Google Slides Entegrasyonu

```typescript
// packages/integrations/src/google-slides/client.ts

import { google } from 'googleapis';

export class GoogleSlidesClient {
  private slides: any;
  private drive: any;

  constructor(auth: any) {
    this.slides = google.slides({ version: 'v1', auth });
    this.drive = google.drive({ version: 'v3', auth });
  }

  async getPresentation(presentationId: string) {
    const response = await this.slides.presentations.get({
      presentationId,
    });
    return response.data;
  }

  async createPresentation(title: string) {
    const response = await this.slides.presentations.create({
      requestBody: { title },
    });
    return response.data;
  }

  async copyTemplate(templateId: string, newTitle: string, folderId?: string) {
    const response = await this.drive.files.copy({
      fileId: templateId,
      requestBody: {
        name: newTitle,
        parents: folderId ? [folderId] : undefined,
      },
    });
    return response.data.id;
  }

  async batchUpdate(presentationId: string, requests: any[]) {
    const response = await this.slides.presentations.batchUpdate({
      presentationId,
      requestBody: { requests },
    });
    return response.data;
  }

  async replaceAllText(
    presentationId: string,
    replacements: { searchText: string; replaceText: string }[]
  ) {
    const requests = replacements.map(r => ({
      replaceAllText: {
        containsText: { text: r.searchText, matchCase: true },
        replaceText: r.replaceText,
      },
    }));
    return this.batchUpdate(presentationId, requests);
  }

  async addSlide(
    presentationId: string,
    layout: string,
    insertionIndex?: number
  ) {
    const requests = [
      {
        createSlide: {
          insertionIndex,
          slideLayoutReference: {
            predefinedLayout: layout,
          },
        },
      },
    ];
    return this.batchUpdate(presentationId, requests);
  }

  async insertImage(
    presentationId: string,
    slideId: string,
    imageUrl: string,
    size: { width: number; height: number },
    position: { x: number; y: number }
  ) {
    const requests = [
      {
        createImage: {
          url: imageUrl,
          elementProperties: {
            pageObjectId: slideId,
            size: {
              width: { magnitude: size.width, unit: 'EMU' },
              height: { magnitude: size.height, unit: 'EMU' },
            },
            transform: {
              scaleX: 1,
              scaleY: 1,
              translateX: position.x,
              translateY: position.y,
              unit: 'EMU',
            },
          },
        },
      },
    ];
    return this.batchUpdate(presentationId, requests);
  }

  async insertChart(
    presentationId: string,
    slideId: string,
    spreadsheetId: string,
    chartId: number,
    position: { x: number; y: number },
    size: { width: number; height: number }
  ) {
    const requests = [
      {
        createSheetsChart: {
          spreadsheetId,
          chartId,
          linkingMode: 'LINKED',
          elementProperties: {
            pageObjectId: slideId,
            size: {
              width: { magnitude: size.width, unit: 'EMU' },
              height: { magnitude: size.height, unit: 'EMU' },
            },
            transform: {
              scaleX: 1,
              scaleY: 1,
              translateX: position.x,
              translateY: position.y,
              unit: 'EMU',
            },
          },
        },
      },
    ];
    return this.batchUpdate(presentationId, requests);
  }

  async insertTable(
    presentationId: string,
    slideId: string,
    rows: number,
    columns: number,
    position: { x: number; y: number },
    size: { width: number; height: number }
  ) {
    const requests = [
      {
        createTable: {
          objectId: `table_${Date.now()}`,
          elementProperties: {
            pageObjectId: slideId,
            size: {
              width: { magnitude: size.width, unit: 'EMU' },
              height: { magnitude: size.height, unit: 'EMU' },
            },
            transform: {
              scaleX: 1,
              scaleY: 1,
              translateX: position.x,
              translateY: position.y,
              unit: 'EMU',
            },
          },
          rows,
          columns,
        },
      },
    ];
    return this.batchUpdate(presentationId, requests);
  }

  async updateTableCell(
    presentationId: string,
    tableId: string,
    rowIndex: number,
    columnIndex: number,
    text: string
  ) {
    const requests = [
      {
        insertText: {
          objectId: tableId,
          cellLocation: {
            rowIndex,
            columnIndex,
          },
          text,
        },
      },
    ];
    return this.batchUpdate(presentationId, requests);
  }

  async exportAsPDF(presentationId: string): Promise<Buffer> {
    const response = await this.drive.files.export(
      {
        fileId: presentationId,
        mimeType: 'application/pdf',
      },
      { responseType: 'arraybuffer' }
    );
    return Buffer.from(response.data);
  }

  async exportAsPPTX(presentationId: string): Promise<Buffer> {
    const response = await this.drive.files.export(
      {
        fileId: presentationId,
        mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      },
      { responseType: 'arraybuffer' }
    );
    return Buffer.from(response.data);
  }
}
```

### 5.5 Google Sheets Entegrasyonu

```typescript
// packages/integrations/src/google-sheets/client.ts

import { google } from 'googleapis';

export class GoogleSheetsClient {
  private sheets: any;
  private drive: any;

  constructor(auth: any) {
    this.sheets = google.sheets({ version: 'v4', auth });
    this.drive = google.drive({ version: 'v3', auth });
  }

  async getSpreadsheet(spreadsheetId: string) {
    const response = await this.sheets.spreadsheets.get({
      spreadsheetId,
      includeGridData: false,
    });
    return response.data;
  }

  async createSpreadsheet(title: string, sheets?: string[]) {
    const response = await this.sheets.spreadsheets.create({
      requestBody: {
        properties: { title },
        sheets: sheets?.map(sheetTitle => ({
          properties: { title: sheetTitle },
        })),
      },
    });
    return response.data;
  }

  async copyTemplate(templateId: string, newTitle: string, folderId?: string) {
    const response = await this.drive.files.copy({
      fileId: templateId,
      requestBody: {
        name: newTitle,
        parents: folderId ? [folderId] : undefined,
      },
    });
    return response.data.id;
  }

  async getValues(
    spreadsheetId: string,
    range: string
  ): Promise<any[][]> {
    const response = await this.sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    return response.data.values || [];
  }

  async setValues(
    spreadsheetId: string,
    range: string,
    values: any[][],
    valueInputOption: 'RAW' | 'USER_ENTERED' = 'USER_ENTERED'
  ) {
    const response = await this.sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption,
      requestBody: { values },
    });
    return response.data;
  }

  async appendValues(
    spreadsheetId: string,
    range: string,
    values: any[][],
    valueInputOption: 'RAW' | 'USER_ENTERED' = 'USER_ENTERED'
  ) {
    const response = await this.sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption,
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values },
    });
    return response.data;
  }

  async clearValues(spreadsheetId: string, range: string) {
    const response = await this.sheets.spreadsheets.values.clear({
      spreadsheetId,
      range,
    });
    return response.data;
  }

  async batchUpdate(spreadsheetId: string, requests: any[]) {
    const response = await this.sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests },
    });
    return response.data;
  }

  async addSheet(spreadsheetId: string, title: string) {
    const requests = [
      {
        addSheet: {
          properties: { title },
        },
      },
    ];
    return this.batchUpdate(spreadsheetId, requests);
  }

  async deleteSheet(spreadsheetId: string, sheetId: number) {
    const requests = [
      {
        deleteSheet: { sheetId },
      },
    ];
    return this.batchUpdate(spreadsheetId, requests);
  }

  async createChart(
    spreadsheetId: string,
    sheetId: number,
    chartType: 'LINE' | 'BAR' | 'PIE' | 'AREA' | 'COLUMN',
    dataRange: string,
    position: { row: number; col: number },
    size: { width: number; height: number },
    title?: string
  ) {
    const requests = [
      {
        addChart: {
          chart: {
            spec: {
              title,
              basicChart: {
                chartType,
                legendPosition: 'BOTTOM_LEGEND',
                domains: [
                  {
                    domain: {
                      sourceRange: {
                        sources: [{ sheetId, ...this.parseRange(dataRange) }],
                      },
                    },
                  },
                ],
                series: [
                  {
                    series: {
                      sourceRange: {
                        sources: [{ sheetId, ...this.parseRange(dataRange) }],
                      },
                    },
                  },
                ],
              },
            },
            position: {
              overlayPosition: {
                anchorCell: {
                  sheetId,
                  rowIndex: position.row,
                  columnIndex: position.col,
                },
                widthPixels: size.width,
                heightPixels: size.height,
              },
            },
          },
        },
      },
    ];
    return this.batchUpdate(spreadsheetId, requests);
  }

  async formatCells(
    spreadsheetId: string,
    sheetId: number,
    range: { startRowIndex: number; endRowIndex: number; startColumnIndex: number; endColumnIndex: number },
    format: {
      backgroundColor?: { red: number; green: number; blue: number };
      textFormat?: {
        bold?: boolean;
        fontSize?: number;
        foregroundColor?: { red: number; green: number; blue: number };
      };
      horizontalAlignment?: 'LEFT' | 'CENTER' | 'RIGHT';
      numberFormat?: { type: string; pattern?: string };
    }
  ) {
    const requests = [
      {
        repeatCell: {
          range: { sheetId, ...range },
          cell: {
            userEnteredFormat: format,
          },
          fields: 'userEnteredFormat',
        },
      },
    ];
    return this.batchUpdate(spreadsheetId, requests);
  }

  async exportAsXLSX(spreadsheetId: string): Promise<Buffer> {
    const response = await this.drive.files.export(
      {
        fileId: spreadsheetId,
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
      { responseType: 'arraybuffer' }
    );
    return Buffer.from(response.data);
  }

  async exportAsPDF(spreadsheetId: string): Promise<Buffer> {
    const response = await this.drive.files.export(
      {
        fileId: spreadsheetId,
        mimeType: 'application/pdf',
      },
      { responseType: 'arraybuffer' }
    );
    return Buffer.from(response.data);
  }

  private parseRange(range: string) {
    // A1:B10 formatını parse et
    const match = range.match(/([A-Z]+)(\d+):([A-Z]+)(\d+)/);
    if (!match) return {};

    const colToIndex = (col: string) =>
      col.split('').reduce((acc, c) => acc * 26 + c.charCodeAt(0) - 64, 0) - 1;

    return {
      startColumnIndex: colToIndex(match[1]),
      startRowIndex: parseInt(match[2]) - 1,
      endColumnIndex: colToIndex(match[3]) + 1,
      endRowIndex: parseInt(match[4]),
    };
  }
}
```

---

## 6. EXPORT SERVİSİ

### 6.1 PDF Export

```typescript
// packages/export/src/pdf.ts

import PDFDocument from 'pdfkit';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';

export class PDFExporter {
  private chartRenderer: ChartJSNodeCanvas;

  constructor() {
    this.chartRenderer = new ChartJSNodeCanvas({
      width: 800,
      height: 400,
      backgroundColour: 'white',
    });
  }

  async generateReport(report: ReportData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
        info: {
          Title: report.name,
          Author: 'MarkaRapor',
          CreationDate: new Date(),
        },
      });

      const chunks: Buffer[] = [];
      doc.on('data', chunks.push.bind(chunks));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      this.renderReport(doc, report);
      doc.end();
    });
  }

  private async renderReport(doc: PDFKit.PDFDocument, report: ReportData) {
    // Kapak Sayfası
    this.renderCoverPage(doc, report);
    doc.addPage();

    // İçindekiler
    this.renderTableOfContents(doc, report);
    doc.addPage();

    // Yönetici Özeti
    this.renderExecutiveSummary(doc, report);
    doc.addPage();

    // Performans Metrikleri
    await this.renderPerformanceMetrics(doc, report);
    doc.addPage();

    // Detaylı Analizler
    for (const section of report.sections) {
      await this.renderSection(doc, section);
      doc.addPage();
    }

    // AI Insights
    if (report.insights) {
      this.renderInsights(doc, report.insights);
      doc.addPage();
    }

    // Aktiviteler
    if (report.activities?.length) {
      this.renderActivities(doc, report.activities);
    }

    // Footer
    this.addFooters(doc);
  }

  private renderCoverPage(doc: PDFKit.PDFDocument, report: ReportData) {
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    // Logo
    if (report.brand?.logo) {
      doc.image(report.brand.logo, pageWidth / 2 - 50, 100, { width: 100 });
    }

    // Başlık
    doc.fontSize(32)
       .font('Helvetica-Bold')
       .text(report.name, 50, 250, { align: 'center', width: pageWidth - 100 });

    // Alt başlık
    doc.fontSize(18)
       .font('Helvetica')
       .text(report.brand?.name || '', 50, 300, { align: 'center', width: pageWidth - 100 });

    // Dönem
    doc.fontSize(14)
       .text(`${report.period.start} - ${report.period.end}`, 50, 340, { align: 'center', width: pageWidth - 100 });

    // Tarih
    doc.fontSize(12)
       .fillColor('#666666')
       .text(`Oluşturulma: ${new Date().toLocaleDateString('tr-TR')}`, 50, pageHeight - 100, {
         align: 'center',
         width: pageWidth - 100,
       });
  }

  private renderTableOfContents(doc: PDFKit.PDFDocument, report: ReportData) {
    doc.fontSize(24)
       .font('Helvetica-Bold')
       .fillColor('#000000')
       .text('İçindekiler', 50, 50);

    let y = 100;
    const items = [
      { title: 'Yönetici Özeti', page: 3 },
      { title: 'Performans Metrikleri', page: 4 },
      ...report.sections.map((s, i) => ({ title: s.title, page: 5 + i })),
    ];

    if (report.insights) {
      items.push({ title: 'AI Insights', page: items.length + 3 });
    }
    if (report.activities?.length) {
      items.push({ title: 'Aktiviteler', page: items.length + 3 });
    }

    items.forEach((item, index) => {
      doc.fontSize(12)
         .font('Helvetica')
         .text(`${index + 1}. ${item.title}`, 70, y)
         .text(`${item.page}`, 500, y, { align: 'right' });
      y += 25;
    });
  }

  private renderExecutiveSummary(doc: PDFKit.PDFDocument, report: ReportData) {
    doc.fontSize(24)
       .font('Helvetica-Bold')
       .text('Yönetici Özeti', 50, 50);

    doc.fontSize(12)
       .font('Helvetica')
       .text(report.executiveSummary || '', 50, 100, {
         width: 495,
         align: 'justify',
         lineGap: 5,
       });
  }

  private async renderPerformanceMetrics(doc: PDFKit.PDFDocument, report: ReportData) {
    doc.fontSize(24)
       .font('Helvetica-Bold')
       .text('Performans Metrikleri', 50, 50);

    let y = 100;
    const metrics = report.metrics || [];
    const colWidth = 150;

    // Metrik kartları
    for (let i = 0; i < metrics.length; i += 3) {
      for (let j = 0; j < 3 && i + j < metrics.length; j++) {
        const metric = metrics[i + j];
        const x = 50 + j * (colWidth + 20);

        // Kart çerçevesi
        doc.rect(x, y, colWidth, 80)
           .stroke('#E5E7EB');

        // Metrik değeri
        doc.fontSize(24)
           .font('Helvetica-Bold')
           .fillColor('#000000')
           .text(metric.value, x + 10, y + 15, { width: colWidth - 20 });

        // Metrik adı
        doc.fontSize(10)
           .font('Helvetica')
           .fillColor('#666666')
           .text(metric.label, x + 10, y + 45, { width: colWidth - 20 });

        // Değişim
        const changeColor = metric.change >= 0 ? '#10B981' : '#EF4444';
        const changeSymbol = metric.change >= 0 ? '▲' : '▼';
        doc.fontSize(10)
           .fillColor(changeColor)
           .text(`${changeSymbol} ${Math.abs(metric.change)}%`, x + 10, y + 60);
      }
      y += 100;
    }

    // Chart
    if (report.chartData) {
      const chartImage = await this.chartRenderer.renderToBuffer(report.chartData);
      doc.image(chartImage, 50, y, { width: 495 });
    }
  }

  private async renderSection(doc: PDFKit.PDFDocument, section: ReportSection) {
    doc.fontSize(20)
       .font('Helvetica-Bold')
       .fillColor('#000000')
       .text(section.title, 50, 50);

    let y = 90;

    // Açıklama
    if (section.description) {
      doc.fontSize(12)
         .font('Helvetica')
         .text(section.description, 50, y, { width: 495 });
      y += doc.heightOfString(section.description, { width: 495 }) + 20;
    }

    // Tablo
    if (section.table) {
      y = await this.renderTable(doc, section.table, y);
    }

    // Chart
    if (section.chart) {
      const chartImage = await this.chartRenderer.renderToBuffer(section.chart);
      doc.image(chartImage, 50, y, { width: 400 });
    }
  }

  private async renderTable(
    doc: PDFKit.PDFDocument,
    table: { headers: string[]; rows: any[][] },
    startY: number
  ): Promise<number> {
    const colWidth = 495 / table.headers.length;
    let y = startY;

    // Headers
    doc.rect(50, y, 495, 25).fill('#F3F4F6');
    table.headers.forEach((header, i) => {
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .fillColor('#000000')
         .text(header, 55 + i * colWidth, y + 7, { width: colWidth - 10 });
    });
    y += 25;

    // Rows
    table.rows.forEach((row, rowIndex) => {
      if (rowIndex % 2 === 0) {
        doc.rect(50, y, 495, 20).fill('#FAFAFA');
      }
      row.forEach((cell, i) => {
        doc.fontSize(9)
           .font('Helvetica')
           .fillColor('#333333')
           .text(String(cell), 55 + i * colWidth, y + 5, { width: colWidth - 10 });
      });
      y += 20;
    });

    return y + 20;
  }

  private renderInsights(doc: PDFKit.PDFDocument, insights: string[]) {
    doc.fontSize(24)
       .font('Helvetica-Bold')
       .fillColor('#000000')
       .text('AI Insights', 50, 50);

    let y = 100;
    insights.forEach((insight, index) => {
      doc.rect(50, y, 495, 5).fill('#3B82F6');
      doc.fontSize(12)
         .font('Helvetica')
         .fillColor('#000000')
         .text(insight, 60, y + 15, { width: 475 });
      y += doc.heightOfString(insight, { width: 475 }) + 40;
    });
  }

  private renderActivities(doc: PDFKit.PDFDocument, activities: Activity[]) {
    doc.fontSize(24)
       .font('Helvetica-Bold')
       .fillColor('#000000')
       .text('Dönem İçi Aktiviteler', 50, 50);

    let y = 100;
    activities.forEach(activity => {
      // Tarih badge
      doc.rect(50, y, 80, 20)
         .fill('#EEF2FF');
      doc.fontSize(9)
         .font('Helvetica')
         .fillColor('#4F46E5')
         .text(activity.date, 55, y + 5);

      // Başlık
      doc.fontSize(12)
         .font('Helvetica-Bold')
         .fillColor('#000000')
         .text(activity.title, 140, y);

      // Açıklama
      if (activity.description) {
        doc.fontSize(10)
           .font('Helvetica')
           .fillColor('#666666')
           .text(activity.description, 140, y + 15, { width: 400 });
      }

      y += 50;
    });
  }

  private addFooters(doc: PDFKit.PDFDocument) {
    const pages = doc.bufferedPageRange();
    for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);
      doc.fontSize(9)
         .font('Helvetica')
         .fillColor('#999999')
         .text(
           `Sayfa ${i + 1} / ${pages.count}`,
           50,
           doc.page.height - 30,
           { align: 'center', width: doc.page.width - 100 }
         );
      doc.text(
        'MarkaRapor ile oluşturuldu',
        50,
        doc.page.height - 30,
        { align: 'right', width: doc.page.width - 100 }
      );
    }
  }
}
```

### 6.2 DOCX Export

```typescript
// packages/export/src/docx.ts

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  ImageRun,
  PageBreak,
  Header,
  Footer,
  PageNumber,
  NumberFormat,
  BorderStyle,
} from 'docx';

export class DOCXExporter {
  async generateReport(report: ReportData): Promise<Buffer> {
    const doc = new Document({
      creator: 'MarkaRapor',
      title: report.name,
      description: `${report.brand?.name} Raporu`,
      styles: this.getStyles(),
      sections: [
        // Kapak Sayfası
        {
          properties: {},
          children: this.createCoverPage(report),
        },
        // Ana İçerik
        {
          properties: {},
          headers: {
            default: this.createHeader(report),
          },
          footers: {
            default: this.createFooter(),
          },
          children: [
            ...this.createExecutiveSummary(report),
            ...this.createPerformanceMetrics(report),
            ...this.createSections(report),
            ...this.createInsights(report),
            ...this.createActivities(report),
          ],
        },
      ],
    });

    return Packer.toBuffer(doc);
  }

  private getStyles() {
    return {
      default: {
        heading1: {
          run: {
            size: 48,
            bold: true,
            color: '000000',
          },
          paragraph: {
            spacing: { after: 300 },
          },
        },
        heading2: {
          run: {
            size: 36,
            bold: true,
            color: '333333',
          },
          paragraph: {
            spacing: { before: 400, after: 200 },
          },
        },
        heading3: {
          run: {
            size: 28,
            bold: true,
            color: '444444',
          },
          paragraph: {
            spacing: { before: 300, after: 150 },
          },
        },
      },
      paragraphStyles: [
        {
          id: 'normal',
          name: 'Normal',
          run: {
            size: 24,
            color: '333333',
          },
          paragraph: {
            spacing: { line: 360, after: 200 },
          },
        },
        {
          id: 'insight',
          name: 'Insight',
          run: {
            size: 24,
            color: '1E40AF',
          },
          paragraph: {
            spacing: { line: 360, after: 200 },
            indent: { left: 720 },
          },
        },
      ],
    };
  }

  private createCoverPage(report: ReportData): Paragraph[] {
    const elements: Paragraph[] = [];

    // Boşluk
    elements.push(new Paragraph({ spacing: { before: 3000 } }));

    // Logo
    if (report.brand?.logoBuffer) {
      elements.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new ImageRun({
              data: report.brand.logoBuffer,
              transformation: { width: 150, height: 150 },
            }),
          ],
        })
      );
    }

    // Başlık
    elements.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 1000 },
        children: [
          new TextRun({
            text: report.name,
            bold: true,
            size: 72,
          }),
        ],
      })
    );

    // Marka adı
    elements.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 400 },
        children: [
          new TextRun({
            text: report.brand?.name || '',
            size: 36,
            color: '666666',
          }),
        ],
      })
    );

    // Dönem
    elements.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200 },
        children: [
          new TextRun({
            text: `${report.period.start} - ${report.period.end}`,
            size: 28,
            color: '888888',
          }),
        ],
      })
    );

    // Sayfa sonu
    elements.push(
      new Paragraph({
        children: [new PageBreak()],
      })
    );

    return elements;
  }

  private createHeader(report: ReportData): Header {
    return new Header({
      children: [
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [
            new TextRun({
              text: report.brand?.name || '',
              size: 18,
              color: '999999',
            }),
          ],
        }),
      ],
    });
  }

  private createFooter(): Footer {
    return new Footer({
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: 'Sayfa ',
              size: 18,
              color: '999999',
            }),
            new TextRun({
              children: [PageNumber.CURRENT],
              size: 18,
              color: '999999',
            }),
            new TextRun({
              text: ' / ',
              size: 18,
              color: '999999',
            }),
            new TextRun({
              children: [PageNumber.TOTAL_PAGES],
              size: 18,
              color: '999999',
            }),
          ],
        }),
      ],
    });
  }

  private createExecutiveSummary(report: ReportData): Paragraph[] {
    return [
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: 'Yönetici Özeti' })],
      }),
      new Paragraph({
        style: 'normal',
        children: [new TextRun({ text: report.executiveSummary || '' })],
      }),
      new Paragraph({ children: [new PageBreak()] }),
    ];
  }

  private createPerformanceMetrics(report: ReportData): (Paragraph | Table)[] {
    const elements: (Paragraph | Table)[] = [];

    elements.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: 'Performans Metrikleri' })],
      })
    );

    if (report.metrics?.length) {
      // Metrik tablosu
      const rows = [];

      // Header row
      rows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: 'Metrik', bold: true })] })],
              shading: { fill: 'F3F4F6' },
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: 'Değer', bold: true })] })],
              shading: { fill: 'F3F4F6' },
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: 'Değişim', bold: true })] })],
              shading: { fill: 'F3F4F6' },
            }),
          ],
        })
      );

      // Data rows
      report.metrics.forEach(metric => {
        rows.push(
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: metric.label })] })],
              }),
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: metric.value, bold: true })] })],
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `${metric.change >= 0 ? '+' : ''}${metric.change}%`,
                        color: metric.change >= 0 ? '10B981' : 'EF4444',
                      }),
                    ],
                  }),
                ],
              }),
            ],
          })
        );
      });

      elements.push(
        new Table({
          rows,
          width: { size: 100, type: WidthType.PERCENTAGE },
        })
      );
    }

    elements.push(new Paragraph({ children: [new PageBreak()] }));

    return elements;
  }

  private createSections(report: ReportData): (Paragraph | Table)[] {
    const elements: (Paragraph | Table)[] = [];

    report.sections?.forEach(section => {
      elements.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: section.title })],
        })
      );

      if (section.description) {
        elements.push(
          new Paragraph({
            style: 'normal',
            children: [new TextRun({ text: section.description })],
          })
        );
      }

      if (section.table) {
        const rows = [];

        // Header
        rows.push(
          new TableRow({
            children: section.table.headers.map(h =>
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: h, bold: true })] })],
                shading: { fill: 'F3F4F6' },
              })
            ),
          })
        );

        // Data
        section.table.rows.forEach(row => {
          rows.push(
            new TableRow({
              children: row.map(cell =>
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: String(cell) })] })],
                })
              ),
            })
          );
        });

        elements.push(
          new Table({
            rows,
            width: { size: 100, type: WidthType.PERCENTAGE },
          })
        );
      }

      elements.push(new Paragraph({ spacing: { after: 400 } }));
    });

    return elements;
  }

  private createInsights(report: ReportData): Paragraph[] {
    if (!report.insights?.length) return [];

    const elements: Paragraph[] = [];

    elements.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: 'AI Insights' })],
      })
    );

    report.insights.forEach((insight, index) => {
      elements.push(
        new Paragraph({
          style: 'insight',
          bullet: { level: 0 },
          children: [new TextRun({ text: insight })],
        })
      );
    });

    elements.push(new Paragraph({ children: [new PageBreak()] }));

    return elements;
  }

  private createActivities(report: ReportData): Paragraph[] {
    if (!report.activities?.length) return [];

    const elements: Paragraph[] = [];

    elements.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: 'Dönem İçi Aktiviteler' })],
      })
    );

    report.activities.forEach(activity => {
      elements.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_3,
          children: [
            new TextRun({ text: `${activity.date} - `, color: '666666' }),
            new TextRun({ text: activity.title }),
          ],
        })
      );

      if (activity.description) {
        elements.push(
          new Paragraph({
            style: 'normal',
            children: [new TextRun({ text: activity.description })],
          })
        );
      }
    });

    return elements;
  }
}
```

---

## 7. AI SERVİSİ

### 7.1 AI Provider Abstraction

```typescript
// packages/ai/src/providers/base.ts

export interface AIProvider {
  name: string;
  chat(messages: Message[], options?: ChatOptions): Promise<string>;
  analyzeData(data: any, prompt: string): Promise<string>;
  generateStructuredData<T>(prompt: string, schema: any): Promise<T>;
  streamChat(messages: Message[], options?: ChatOptions): AsyncGenerator<string>;
}

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatOptions {
  temperature?: number;
  maxTokens?: number;
  language?: string;
}
```

### 7.2 Claude Provider

```typescript
// packages/ai/src/providers/claude.ts

import Anthropic from '@anthropic-ai/sdk';
import { AIProvider, Message, ChatOptions } from './base';

export class ClaudeProvider implements AIProvider {
  name = 'claude';
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  async chat(messages: Message[], options?: ChatOptions): Promise<string> {
    const systemMessage = messages.find(m => m.role === 'system')?.content || '';
    const chatMessages = messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

    const response = await this.client.messages.create({
      model: 'claude-opus-4-5-20251101',
      max_tokens: options?.maxTokens || 4096,
      system: systemMessage,
      messages: chatMessages,
    });

    return response.content[0].type === 'text' ? response.content[0].text : '';
  }

  async analyzeData(data: any, prompt: string): Promise<string> {
    const systemPrompt = `Sen bir veri analisti asistanısın. Verilen verileri analiz edip anlaşılır özetler ve öneriler sunuyorsun.

Kurallar:
- Türkçe yanıt ver
- Profesyonel ve net bir dil kullan
- Sayısal verileri karşılaştırmalı olarak değerlendir
- Trendleri ve anomalileri tespit et
- Aksiyon alınabilir öneriler sun`;

    return this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Veri:\n${JSON.stringify(data, null, 2)}\n\nİstek: ${prompt}` },
    ]);
  }

  async generateStructuredData<T>(prompt: string, schema: any): Promise<T> {
    const response = await this.client.messages.create({
      model: 'claude-opus-4-5-20251101',
      max_tokens: 4096,
      system: `Sen bir yapılandırılmış veri üreticisin. Verilen şemaya uygun JSON çıktısı üret.
Sadece JSON döndür, başka açıklama ekleme.`,
      messages: [
        {
          role: 'user',
          content: `Şema:\n${JSON.stringify(schema, null, 2)}\n\nİstek: ${prompt}`,
        },
      ],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '{}';
    return JSON.parse(text);
  }

  async *streamChat(messages: Message[], options?: ChatOptions): AsyncGenerator<string> {
    const systemMessage = messages.find(m => m.role === 'system')?.content || '';
    const chatMessages = messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

    const stream = await this.client.messages.stream({
      model: 'claude-opus-4-5-20251101',
      max_tokens: options?.maxTokens || 4096,
      system: systemMessage,
      messages: chatMessages,
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        yield event.delta.text;
      }
    }
  }
}
```

### 7.3 OpenAI Provider (GPT 5.2)

```typescript
// packages/ai/src/providers/openai.ts

import OpenAI from 'openai';
import { AIProvider, Message, ChatOptions } from './base';

export class OpenAIProvider implements AIProvider {
  name = 'gpt';
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async chat(messages: Message[], options?: ChatOptions): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: 'gpt-5.2',
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
      temperature: options?.temperature || 0.7,
      max_tokens: options?.maxTokens || 4096,
    });

    return response.choices[0]?.message?.content || '';
  }

  async analyzeData(data: any, prompt: string): Promise<string> {
    const systemPrompt = `Sen bir veri analisti asistanısın. Verilen verileri analiz edip anlaşılır özetler ve öneriler sunuyorsun.

Kurallar:
- Türkçe yanıt ver
- Profesyonel ve net bir dil kullan
- Sayısal verileri karşılaştırmalı olarak değerlendir
- Trendleri ve anomalileri tespit et
- Aksiyon alınabilir öneriler sun`;

    return this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Veri:\n${JSON.stringify(data, null, 2)}\n\nİstek: ${prompt}` },
    ]);
  }

  async generateStructuredData<T>(prompt: string, schema: any): Promise<T> {
    const response = await this.client.chat.completions.create({
      model: 'gpt-5.2',
      messages: [
        {
          role: 'system',
          content: 'Sen bir yapılandırılmış veri üreticisin. Verilen şemaya uygun JSON çıktısı üret. Sadece JSON döndür.',
        },
        {
          role: 'user',
          content: `Şema:\n${JSON.stringify(schema, null, 2)}\n\nİstek: ${prompt}`,
        },
      ],
      response_format: { type: 'json_object' },
    });

    return JSON.parse(response.choices[0]?.message?.content || '{}');
  }

  async *streamChat(messages: Message[], options?: ChatOptions): AsyncGenerator<string> {
    const stream = await this.client.chat.completions.create({
      model: 'gpt-5.2',
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
      temperature: options?.temperature || 0.7,
      max_tokens: options?.maxTokens || 4096,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) yield content;
    }
  }
}
```

### 7.4 AI Prompts

```typescript
// packages/ai/src/prompts/report-analysis.ts

export const REPORT_ANALYSIS_PROMPTS = {
  executiveSummary: `
Aşağıdaki pazarlama verilerini analiz et ve yönetici özeti oluştur.

Özet şunları içermeli:
1. Dönemin genel performans değerlendirmesi
2. En önemli başarılar ve gelişim alanları
3. Dikkat çeken trendler
4. Kritik metrikler ve karşılaştırmalar

Format:
- 3-4 paragraf
- Profesyonel ve net dil
- Rakamlarla desteklenmiş ifadeler
`,

  insights: `
Verilen verileri analiz et ve şu başlıklarda içgörüler oluştur:

1. PERFORMANS ANALİZİ
- Dönem performansının özeti
- Önceki dönemle karşılaştırma
- Hedeflere ulaşım durumu

2. TREND ANALİZİ
- Yükselen trendler
- Düşen trendler
- Mevsimsel etkiler

3. ANOMALİ TESPİTİ
- Beklenmedik değişimler
- Olağandışı pattern'ler
- İncelenmesi gereken alanlar

4. ÖNERİLER
- Kısa vadeli aksiyon önerileri
- Orta vadeli strateji önerileri
- Uzun vadeli gelişim fırsatları

Her insight için:
- Net ve anlaşılır başlık
- Detaylı açıklama
- Destekleyici veriler
- Önerilen aksiyon
`,

  campaignAnalysis: `
Google Ads kampanya verilerini analiz et:

1. KAMPANYA PERFORMANSI
- En iyi performans gösteren kampanyalar
- İyileştirilmesi gereken kampanyalar
- Bütçe verimliliği değerlendirmesi

2. METRIC ANALİZİ
- CTR analizi ve öneriler
- CPC optimizasyon fırsatları
- Dönüşüm oranı değerlendirmesi
- ROAS analizi

3. AKSİYON ÖNERİLERİ
- Bütçe dağılımı önerileri
- Hedefleme iyileştirmeleri
- Reklam metni önerileri
`,

  seoAnalysis: `
SEO verilerini analiz et:

1. ORGANIC PERFORMANS
- Görünürlük değerlendirmesi
- Trafik analizi
- Sıralama değişimleri

2. ANAHTAR KELİME ANALİZİ
- Top performing keywords
- Fırsat kelimeleri
- Kaybedilen pozisyonlar

3. TEKNİK SEO
- Crawl hataları
- Sayfa hızı sorunları
- Mobile uyumluluk

4. İÇERİK ÖNERİLERİ
- Optimize edilmesi gereken sayfalar
- Yeni içerik fırsatları
- Internal linking önerileri
`,

  analyticsAnalysis: `
Google Analytics verilerini analiz et:

1. TRAFİK ANALİZİ
- Kaynak/medium dağılımı
- Kullanıcı davranışları
- Engagement metrikleri

2. DÖNÜŞÜM ANALİZİ
- Conversion funnel analizi
- Drop-off noktaları
- Mikro dönüşümler

3. SEGMENT ANALİZİ
- Cihaz performansı
- Coğrafi dağılım
- Yeni vs dönen kullanıcılar

4. İYİLEŞTİRME ÖNERİLERİ
- UX iyileştirmeleri
- Landing page optimizasyonları
- Hedefleme önerileri
`,
};
```

---

## 8. UI/UX TASARIM SPESİFİKASYONLARI

### 8.1 Tasarım Sistemi

```typescript
// apps/web/styles/design-system.ts

export const designSystem = {
  // Renkler
  colors: {
    primary: {
      50: '#EEF2FF',
      100: '#E0E7FF',
      200: '#C7D2FE',
      300: '#A5B4FC',
      400: '#818CF8',
      500: '#6366F1', // Ana renk
      600: '#4F46E5',
      700: '#4338CA',
      800: '#3730A3',
      900: '#312E81',
    },
    secondary: {
      50: '#F0FDF4',
      100: '#DCFCE7',
      200: '#BBF7D0',
      300: '#86EFAC',
      400: '#4ADE80',
      500: '#22C55E',
      600: '#16A34A',
      700: '#15803D',
      800: '#166534',
      900: '#14532D',
    },
    neutral: {
      50: '#FAFAFA',
      100: '#F4F4F5',
      200: '#E4E4E7',
      300: '#D4D4D8',
      400: '#A1A1AA',
      500: '#71717A',
      600: '#52525B',
      700: '#3F3F46',
      800: '#27272A',
      900: '#18181B',
    },
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },

  // Tipografi
  typography: {
    fontFamily: {
      sans: 'Inter, system-ui, sans-serif',
      mono: 'JetBrains Mono, monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  // Spacing
  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    DEFAULT: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },

  // Breakpoints (Mobile First)
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};
```

### 8.2 Component Specifications

#### Dashboard Layout

```tsx
// apps/web/components/layout/DashboardLayout.tsx

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b z-50">
        <div className="flex items-center justify-between h-full px-4">
          <button className="p-2">
            <MenuIcon className="w-6 h-6" />
          </button>
          <Logo className="h-8" />
          <UserMenu />
        </div>
      </header>

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-white border-r">
        <div className="h-16 flex items-center px-6 border-b">
          <Logo className="h-8" />
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <NavItems />
        </nav>
        <div className="p-4 border-t">
          <WorkspaceSelector />
        </div>
      </aside>

      {/* Mobile Sidebar - Drawer */}
      <MobileSidebar />

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="max-w-7xl mx-auto p-4 lg:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t z-50">
        <div className="flex items-center justify-around h-full">
          <BottomNavItem icon={HomeIcon} label="Ana Sayfa" href="/" />
          <BottomNavItem icon={WorkflowIcon} label="Workflow" href="/workflows" />
          <BottomNavItem icon={ReportIcon} label="Raporlar" href="/reports" />
          <BottomNavItem icon={AIIcon} label="AI" href="/ai-agent" />
          <BottomNavItem icon={SettingsIcon} label="Ayarlar" href="/settings" />
        </div>
      </nav>
    </div>
  );
}
```

#### Workflow Editor

```tsx
// apps/web/components/workflow/WorkflowEditor.tsx

import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';

export default function WorkflowEditor({ workflow }: { workflow: Workflow }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(workflow.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(workflow.edges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Node Palette - Sol Panel */}
      <div className="w-64 bg-white border-r overflow-y-auto">
        <NodePalette />
      </div>

      {/* Canvas - Orta */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          snapToGrid
          snapGrid={[15, 15]}
        >
          <Background variant="dots" gap={15} size={1} />
          <Controls />
          <MiniMap />
        </ReactFlow>

        {/* Toolbar */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-lg border p-2 flex gap-2">
          <Button variant="ghost" size="sm" onClick={onUndo}>
            <UndoIcon className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onRedo}>
            <RedoIcon className="w-4 h-4" />
          </Button>
          <div className="w-px bg-neutral-200" />
          <Button variant="ghost" size="sm" onClick={onZoomIn}>
            <ZoomInIcon className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onZoomOut}>
            <ZoomOutIcon className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onFitView}>
            <FitViewIcon className="w-4 h-4" />
          </Button>
          <div className="w-px bg-neutral-200" />
          <Button variant="primary" size="sm" onClick={onRun}>
            <PlayIcon className="w-4 h-4 mr-1" />
            Çalıştır
          </Button>
        </div>
      </div>

      {/* Node Config - Sağ Panel */}
      {selectedNode && (
        <div className="w-80 bg-white border-l overflow-y-auto">
          <NodeConfigPanel
            node={selectedNode}
            onChange={onNodeConfigChange}
            onDelete={onNodeDelete}
          />
        </div>
      )}
    </div>
  );
}
```

### 8.3 Sayfa Yapıları

#### Dashboard Ana Sayfa

```
┌─────────────────────────────────────────────────────────────┐
│ Hoş geldin, [Kullanıcı Adı]                                 │
│ Son güncelleme: [tarih saat]                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐            │
│ │ Toplam  │ │ Aktif   │ │ Bu Ay   │ │ Kredi   │            │
│ │Workflow │ │ Marka   │ │ Rapor   │ │ Bakiye  │            │
│ │   12    │ │    5    │ │   24    │ │  850    │            │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘            │
│                                                             │
│ ┌───────────────────────────────────────────────────────┐  │
│ │ Son Çalışan Workflow'lar                              │  │
│ │ ┌─────────────────────────────────────────────────┐   │  │
│ │ │ ◉ Haftalık SEO Raporu    [Marka A]   ✓ Başarılı │   │  │
│ │ │ ◉ Google Ads Analizi     [Marka B]   ✓ Başarılı │   │  │
│ │ │ ◉ Aylık Performans       [Marka C]   ⚠ Hata     │   │  │
│ │ └─────────────────────────────────────────────────┘   │  │
│ └───────────────────────────────────────────────────────┘  │
│                                                             │
│ ┌─────────────────────┐ ┌─────────────────────────────┐    │
│ │ Yaklaşan Zamanlamalar│ │ Hızlı Erişim              │    │
│ │                     │ │                             │    │
│ │ 📅 Yarın 09:00      │ │ [+ Yeni Workflow]           │    │
│ │    Haftalık Rapor   │ │ [+ Yeni Rapor]              │    │
│ │                     │ │ [🤖 AI Agent]               │    │
│ │ 📅 3 gün sonra      │ │ [⚙️ Bağlantılar]            │    │
│ │    Aylık Özet       │ │                             │    │
│ └─────────────────────┘ └─────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

#### Workflow Listesi

```
┌─────────────────────────────────────────────────────────────┐
│ Workflow'lar                            [+ Yeni Workflow]   │
├─────────────────────────────────────────────────────────────┤
│ 🔍 [Ara...]          [Marka ▼] [Kategori ▼] [Durum ▼]      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ 📊 Haftalık Google Ads Raporu                          ││
│ │ Marka: ABC Şirketi                                      ││
│ │ ⏰ Her Pazartesi 09:00 | Son: 2 gün önce ✓             ││
│ │                                    [▶️] [✏️] [⋮]         ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ 📈 Aylık SEO Performans Raporu                         ││
│ │ Marka: XYZ Ltd                                          ││
│ │ ⏰ Her ayın 1'i 10:00 | Son: 1 hafta önce ✓            ││
│ │                                    [▶️] [✏️] [⋮]         ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ 🎯 Çapraz Kanal PPC Analizi                            ││
│ │ Marka: DEF Corp                                         ││
│ │ ⚠️ Hata | Son: 3 saat önce ✗                           ││
│ │                                    [▶️] [✏️] [⋮]         ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 9. TEMPLATE SİSTEMİ

### 9.1 Varsayılan Template'ler

```typescript
// packages/database/seed/templates.ts

export const defaultTemplates = [
  // GOOGLE ADS TEMPLATE'LERİ
  {
    name: 'Google Ads Haftalık Performans Raporu',
    nameEn: 'Google Ads Weekly Performance Report',
    category: 'ads',
    subcategory: 'google-ads',
    description: 'Google Ads kampanyalarınızın haftalık performansını analiz eden ve AI destekli öneriler sunan rapor.',
    nodes: [
      {
        id: 'trigger',
        type: 'trigger-schedule',
        position: { x: 100, y: 100 },
        data: {
          label: 'Haftalık Tetikleyici',
          config: {
            frequency: 'weekly',
            dayOfWeek: 1, // Pazartesi
            time: '09:00',
          },
        },
      },
      {
        id: 'google-ads-data',
        type: 'google-ads-performance',
        position: { x: 100, y: 250 },
        data: {
          label: 'Google Ads Verisi',
          config: {
            dateRange: 'last_7_days',
            metrics: ['impressions', 'clicks', 'cost', 'conversions', 'ctr', 'cpc'],
            dimensions: ['campaign', 'date'],
          },
        },
      },
      {
        id: 'ai-analysis',
        type: 'ai-analyze',
        position: { x: 100, y: 400 },
        data: {
          label: 'AI Analizi',
          config: {
            model: 'claude',
            prompt: 'Bu hafta Google Ads performansını analiz et ve önerilerde bulun.',
            language: 'tr',
          },
        },
      },
      {
        id: 'chart-performance',
        type: 'chart-line',
        position: { x: 300, y: 400 },
        data: {
          label: 'Performans Grafiği',
          config: {
            title: 'Haftalık Performans Trendi',
            xAxis: 'date',
            yAxis: ['impressions', 'clicks', 'conversions'],
          },
        },
      },
      {
        id: 'slides-update',
        type: 'slides-update',
        position: { x: 200, y: 550 },
        data: {
          label: 'Slides Güncelle',
          config: {
            templateId: '{{GOOGLE_SLIDES_TEMPLATE_ID}}',
            replacements: {
              '{{PERIOD}}': '{{dateRange}}',
              '{{IMPRESSIONS}}': '{{google-ads-data.impressions}}',
              '{{CLICKS}}': '{{google-ads-data.clicks}}',
              '{{CTR}}': '{{google-ads-data.ctr}}',
              '{{CONVERSIONS}}': '{{google-ads-data.conversions}}',
              '{{AI_INSIGHTS}}': '{{ai-analysis.output}}',
            },
          },
        },
      },
    ],
    edges: [
      { id: 'e1', source: 'trigger', target: 'google-ads-data' },
      { id: 'e2', source: 'google-ads-data', target: 'ai-analysis' },
      { id: 'e3', source: 'google-ads-data', target: 'chart-performance' },
      { id: 'e4', source: 'ai-analysis', target: 'slides-update' },
      { id: 'e5', source: 'chart-performance', target: 'slides-update' },
    ],
  },

  // SEO TEMPLATE'LERİ
  {
    name: 'Aylık SEO Performans Raporu',
    nameEn: 'Monthly SEO Performance Report',
    category: 'seo',
    subcategory: 'search-console',
    description: 'Google Search Console verilerini analiz eden ve SEO önerileri sunan aylık rapor.',
    nodes: [
      {
        id: 'trigger',
        type: 'trigger-schedule',
        position: { x: 100, y: 100 },
        data: {
          label: 'Aylık Tetikleyici',
          config: {
            frequency: 'monthly',
            dayOfMonth: 1,
            time: '10:00',
          },
        },
      },
      {
        id: 'gsc-queries',
        type: 'gsc-performance',
        position: { x: 100, y: 250 },
        data: {
          label: 'Arama Sorguları',
          config: {
            dateRange: 'last_28_days',
            dimensions: ['query'],
            rowLimit: 50,
          },
        },
      },
      {
        id: 'gsc-pages',
        type: 'gsc-performance',
        position: { x: 300, y: 250 },
        data: {
          label: 'Sayfa Performansı',
          config: {
            dateRange: 'last_28_days',
            dimensions: ['page'],
            rowLimit: 50,
          },
        },
      },
      {
        id: 'ai-seo-analysis',
        type: 'ai-analyze',
        position: { x: 200, y: 400 },
        data: {
          label: 'SEO AI Analizi',
          config: {
            model: 'claude',
            prompt: 'SEO performansını analiz et, fırsat anahtar kelimeleri ve optimizasyon önerileri sun.',
            language: 'tr',
          },
        },
      },
      {
        id: 'chart-rankings',
        type: 'chart-bar',
        position: { x: 400, y: 400 },
        data: {
          label: 'Sıralama Dağılımı',
          config: {
            title: 'Pozisyon Dağılımı',
            xAxis: 'position_bucket',
            yAxis: 'count',
          },
        },
      },
      {
        id: 'export-pdf',
        type: 'export-pdf',
        position: { x: 200, y: 550 },
        data: {
          label: 'PDF Export',
          config: {
            template: 'seo-report',
            filename: 'SEO_Raporu_{{month}}_{{year}}.pdf',
          },
        },
      },
    ],
    edges: [
      { id: 'e1', source: 'trigger', target: 'gsc-queries' },
      { id: 'e2', source: 'trigger', target: 'gsc-pages' },
      { id: 'e3', source: 'gsc-queries', target: 'ai-seo-analysis' },
      { id: 'e4', source: 'gsc-pages', target: 'ai-seo-analysis' },
      { id: 'e5', source: 'gsc-queries', target: 'chart-rankings' },
      { id: 'e6', source: 'ai-seo-analysis', target: 'export-pdf' },
      { id: 'e7', source: 'chart-rankings', target: 'export-pdf' },
    ],
  },

  // ANALYTICS TEMPLATE'LERİ
  {
    name: 'Google Analytics Aylık Özet Raporu',
    nameEn: 'Google Analytics Monthly Summary Report',
    category: 'analytics',
    subcategory: 'ga4',
    description: 'GA4 verilerinizi analiz eden ve kullanıcı davranışlarını özetleyen aylık rapor.',
    nodes: [
      // ... (benzer yapıda GA4 node'ları)
    ],
    edges: [],
  },

  // CROSS-CHANNEL TEMPLATE'LERİ
  {
    name: 'Çapraz Kanal Performans Raporu',
    nameEn: 'Cross-Channel Performance Report',
    category: 'reporting',
    subcategory: 'combined',
    description: 'Google Ads, Analytics ve Search Console verilerini birleştiren kapsamlı rapor.',
    nodes: [
      // ... (tüm platformlardan veri çeken node'lar)
    ],
    edges: [],
  },

  // AUDIT TEMPLATE'LERİ
  {
    name: 'Google Ads Hesap Denetimi',
    nameEn: 'Google Ads Account Audit',
    category: 'optimization',
    subcategory: 'audit',
    description: 'Google Ads hesabınızı kapsamlı şekilde denetleyen ve iyileştirme önerileri sunan template.',
    nodes: [
      // ... (audit için gerekli node'lar)
    ],
    edges: [],
  },
];
```

---

## 10. FARKLILAŞTIRICI ÖZELLİKLER

### 10.1 Markifact'tan Farklı Olacak Özellikler

| Özellik | Markifact | MarkaRapor |
|---------|-----------|------------|
| **Dil Desteği** | İngilizce | Türkçe öncelikli, çoklu dil |
| **AI Modelleri** | GPT-4 | Claude Opus 4.5, GPT 5.2, Gemini 3 |
| **UI/UX** | Karmaşık | Basit, mobil öncelikli |
| **Marka Yönetimi** | Yok | Tam entegre marka sistemi |
| **Aktivite Takibi** | Yok | Dönem içi aktivite kaydı |
| **Export Kalitesi** | Temel | Profesyonel şablonlar |
| **Fiyatlandırma** | Dolar bazlı | TL bazlı, uygun fiyat |
| **Müşteri Desteği** | İngilizce | Türkçe destek |

### 10.2 Yeni Eklenen Özellikler

#### 1. Marka Yönetim Sistemi
- Her marka için ayrı dashboard
- Marka bazlı bağlantı yönetimi
- Marka renkleri ve logoları
- Marka bazlı raporlama

#### 2. Aktivite Takip Sistemi
- Dönem içi yapılan işlerin kaydı
- Kategorize edilmiş aktiviteler (SEO, Ads, Content, vs.)
- AI'ın raporlara otomatik dahil etmesi
- Etki değerlendirmesi (yüksek/orta/düşük)

#### 3. Gelişmiş AI Özellikleri
- Çoklu model seçeneği
- Türkçe optimize edilmiş promptlar
- Aksiyon odaklı öneriler
- Karşılaştırmalı analiz

#### 4. Profesyonel Export Sistemi
- Kurumsal kalitede PDF
- Tam formatlı DOCX
- Google Slides entegrasyonu
- Özelleştirilebilir şablonlar
- Marka kimliği entegrasyonu

#### 5. Mobil Öncelikli Tasarım
- PWA desteği
- Offline çalışma
- Push notifications
- Touch-optimized UI

#### 6. Türkçe Lokalizasyon
- Tam Türkçe arayüz
- Türkçe AI yanıtları
- Türkçe dokümantasyon
- Türkçe destek

---

## 11. GÜVENLİK VE PERFORMANS

### 11.1 Güvenlik Önlemleri

```typescript
// apps/web/lib/security.ts

// Rate Limiting
export const rateLimits = {
  api: {
    window: 60 * 1000, // 1 dakika
    max: 100,
  },
  auth: {
    window: 15 * 60 * 1000, // 15 dakika
    max: 5,
  },
  aiRequests: {
    window: 60 * 1000,
    max: 20,
  },
};

// Input Validation
export const validationSchemas = {
  email: z.string().email(),
  password: z.string().min(8).max(100),
  workflowName: z.string().min(1).max(100),
  reportName: z.string().min(1).max(200),
};

// Token Encryption
export const encryptToken = (token: string): string => {
  const cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY!);
  return cipher.update(token, 'utf8', 'hex') + cipher.final('hex');
};

// OAuth State Validation
export const generateOAuthState = (): string => {
  return crypto.randomBytes(32).toString('hex');
};
```

### 11.2 Performans Optimizasyonları

```typescript
// Caching Strategy
export const cacheConfig = {
  // API Response Cache
  apiCache: {
    staleTime: 5 * 60 * 1000, // 5 dakika
    cacheTime: 30 * 60 * 1000, // 30 dakika
  },

  // Platform Data Cache
  platformData: {
    googleAds: 15 * 60 * 1000, // 15 dakika
    analytics: 15 * 60 * 1000,
    searchConsole: 60 * 60 * 1000, // 1 saat
  },

  // Static Assets
  staticAssets: {
    maxAge: 31536000, // 1 yıl
    immutable: true,
  },
};

// Database Query Optimization
export const queryOptimizations = {
  // Pagination
  defaultPageSize: 20,
  maxPageSize: 100,

  // Select Fields
  workflowListFields: ['id', 'name', 'brandId', 'isActive', 'lastRunAt', 'nextRunAt'],
  reportListFields: ['id', 'name', 'brandId', 'type', 'status', 'createdAt'],

  // Indexes
  indexes: [
    'workflow_workspace_brand_idx',
    'report_workspace_created_idx',
    'workflow_run_workflow_created_idx',
  ],
};
```

---

## 12. UYGULAMA ADIMLARI

### Faz 1: Temel Altyapı (2 Hafta)

#### Hafta 1
- [ ] Proje yapısı oluşturma (monorepo setup)
- [ ] Database schema tasarımı ve migration
- [ ] Authentication sistemi (NextAuth.js)
- [ ] Temel API routes (tRPC setup)
- [ ] UI component library setup (shadcn/ui)

#### Hafta 2
- [ ] Dashboard layout ve navigation
- [ ] Kullanıcı yönetimi sayfaları
- [ ] Workspace yönetimi
- [ ] Temel CRUD operasyonları
- [ ] i18n altyapısı (Türkçe/İngilizce)

### Faz 2: Entegrasyonlar (2 Hafta)

#### Hafta 3
- [ ] Google OAuth setup
- [ ] Google Ads API entegrasyonu
- [ ] Google Analytics 4 API entegrasyonu
- [ ] Google Search Console API entegrasyonu
- [ ] Connection yönetim sayfası

#### Hafta 4
- [ ] Google Slides API entegrasyonu
- [ ] Google Sheets API entegrasyonu
- [ ] Google Drive API entegrasyonu
- [ ] Token refresh mekanizması
- [ ] Connection test ve hata yönetimi

### Faz 3: Workflow Engine (3 Hafta)

#### Hafta 5
- [ ] React Flow entegrasyonu
- [ ] Workflow Editor UI
- [ ] Node palette ve node tipleri
- [ ] Edge connection logic
- [ ] Workflow kaydetme/yükleme

#### Hafta 6
- [ ] Workflow Executor implementasyonu
- [ ] Node handler'ları (Google Ads, GA4, GSC)
- [ ] Veri işleme node'ları
- [ ] Chart oluşturma node'ları
- [ ] Workflow run logging

#### Hafta 7
- [ ] Scheduler implementasyonu (BullMQ)
- [ ] Trigger node'ları
- [ ] Workflow history ve logs UI
- [ ] Error handling ve retry mekanizması
- [ ] Workflow templates

### Faz 4: AI Entegrasyonu (2 Hafta)

#### Hafta 8
- [ ] Claude API entegrasyonu
- [ ] OpenAI API entegrasyonu
- [ ] Gemini API entegrasyonu
- [ ] AI node implementasyonları
- [ ] Prompt engineering (Türkçe)

#### Hafta 9
- [ ] AI Agent chat interface
- [ ] Streaming responses
- [ ] Context management
- [ ] AI-powered insights
- [ ] Structured data generation

### Faz 5: Raporlama ve Export (2 Hafta)

#### Hafta 10
- [ ] Report builder UI
- [ ] PDF export (pdfkit)
- [ ] DOCX export (docx-js)
- [ ] XLSX export (exceljs)
- [ ] Report templates

#### Hafta 11
- [ ] Google Slides export
- [ ] Google Sheets export
- [ ] Report sharing
- [ ] Report scheduling
- [ ] Marka ve aktivite entegrasyonu

### Faz 6: Polish ve Launch (2 Hafta)

#### Hafta 12
- [ ] Mobile responsive optimization
- [ ] PWA setup
- [ ] Performance optimization
- [ ] Error tracking (Sentry)
- [ ] Analytics (PostHog)

#### Hafta 13
- [ ] Beta testing
- [ ] Bug fixes
- [ ] Documentation
- [ ] Landing page
- [ ] Production deployment

---

## 13. ENV DEĞİŞKENLERİ

```env
# .env.example

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/markarapor

# Redis
REDIS_URL=redis://localhost:6379

# Auth
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Google Ads
GOOGLE_ADS_DEVELOPER_TOKEN=your-developer-token

# AI APIs
ANTHROPIC_API_KEY=your-anthropic-api-key
OPENAI_API_KEY=your-openai-api-key
GOOGLE_AI_API_KEY=your-google-ai-api-key

# Storage (S3/R2)
S3_BUCKET=markarapor-files
S3_REGION=eu-central-1
S3_ACCESS_KEY_ID=your-access-key
S3_SECRET_ACCESS_KEY=your-secret-key

# Encryption
ENCRYPTION_KEY=your-32-byte-encryption-key

# Stripe (Billing)
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Monitoring
SENTRY_DSN=https://xxx@sentry.io/xxx
POSTHOG_API_KEY=phc_xxx
```

---

## 14. NPM PAKETLER

```json
// package.json (root)
{
  "name": "markarapor",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "start": "turbo run start",
    "lint": "turbo run lint",
    "db:generate": "turbo run db:generate",
    "db:push": "turbo run db:push",
    "db:seed": "turbo run db:seed"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.3.0"
  }
}
```

```json
// apps/web/package.json
{
  "name": "@markarapor/web",
  "dependencies": {
    // Framework
    "next": "^14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",

    // Auth
    "next-auth": "^5.0.0-beta.4",
    "@auth/prisma-adapter": "^1.0.0",

    // API
    "@trpc/client": "^11.0.0",
    "@trpc/next": "^11.0.0",
    "@trpc/react-query": "^11.0.0",
    "@trpc/server": "^11.0.0",
    "@tanstack/react-query": "^5.17.0",

    // UI
    "tailwindcss": "^3.4.0",
    "@radix-ui/react-*": "latest",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "lucide-react": "^0.312.0",
    "framer-motion": "^11.0.0",

    // Forms
    "react-hook-form": "^7.49.0",
    "@hookform/resolvers": "^3.3.0",
    "zod": "^3.22.0",

    // Workflow
    "reactflow": "^11.10.0",
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/sortable": "^8.0.0",

    // Charts
    "recharts": "^2.10.0",
    "chart.js": "^4.4.0",
    "react-chartjs-2": "^5.2.0",

    // State
    "zustand": "^4.5.0",

    // i18n
    "next-intl": "^3.4.0",

    // Date
    "date-fns": "^3.2.0",

    // Utils
    "lodash": "^4.17.21",
    "nanoid": "^5.0.0"
  }
}
```

```json
// packages/database/package.json
{
  "name": "@markarapor/database",
  "dependencies": {
    "@prisma/client": "^5.8.0",
    "prisma": "^5.8.0"
  }
}
```

```json
// packages/integrations/package.json
{
  "name": "@markarapor/integrations",
  "dependencies": {
    "google-ads-api": "^14.0.0",
    "@google-analytics/data": "^4.2.0",
    "googleapis": "^130.0.0"
  }
}
```

```json
// packages/ai/package.json
{
  "name": "@markarapor/ai",
  "dependencies": {
    "@anthropic-ai/sdk": "^0.14.0",
    "openai": "^4.25.0",
    "@google/generative-ai": "^0.2.0"
  }
}
```

```json
// packages/export/package.json
{
  "name": "@markarapor/export",
  "dependencies": {
    "pdfkit": "^0.14.0",
    "docx": "^8.5.0",
    "exceljs": "^4.4.0",
    "chartjs-node-canvas": "^4.1.0"
  }
}
```

```json
// packages/workflow-engine/package.json
{
  "name": "@markarapor/workflow-engine",
  "dependencies": {
    "bullmq": "^5.1.0",
    "ioredis": "^5.3.0",
    "cron-parser": "^4.9.0"
  }
}
```

---

## 16. ADMİN PANELİ

### 16.1 Admin Panel Yapısı

```
/admin
├── /dashboard              # Ana dashboard - tüm metrikler
├── /users                  # Kullanıcı yönetimi
│   ├── /[id]              # Kullanıcı detay
│   └── /[id]/edit         # Kullanıcı düzenleme
├── /workspaces            # Workspace yönetimi
│   └── /[id]              # Workspace detay
├── /subscriptions         # Abonelik yönetimi
│   ├── /plans             # Plan tanımları
│   └── /transactions      # Ödeme geçmişi
├── /analytics             # Platform istatistikleri
│   ├── /usage             # Kullanım metrikleri
│   ├── /revenue           # Gelir analizi
│   └── /growth            # Büyüme metrikleri
├── /workflows             # Tüm workflow'lar
├── /reports               # Tüm raporlar
├── /templates             # Template yönetimi
├── /ai-usage              # AI kullanım istatistikleri
├── /support               # Destek talepleri
├── /notifications         # Bildirim yönetimi
├── /settings              # Platform ayarları
│   ├── /general           # Genel ayarlar
│   ├── /billing           # Ödeme ayarları
│   ├── /email             # E-posta şablonları
│   ├── /integrations      # API ayarları
│   └── /maintenance       # Bakım modu
└── /logs                  # Sistem logları
```

### 16.2 Admin Dashboard Özellikleri

Admin paneli şu metrikleri gösterecek:
- Toplam kullanıcı sayısı ve büyüme oranı
- Aktif abonelik sayısı (plan bazında dağılım)
- Aylık/yıllık gelir ve büyüme
- Workflow çalıştırma sayısı
- AI kredi kullanımı
- Hata oranları
- Sistem sağlığı durumu

### 16.3 Kullanıcı Yönetimi Özellikleri

- Kullanıcı listesi (filtreleme, arama, sıralama)
- Kullanıcı detay görüntüleme
- Plan değiştirme
- Kredi ekleme/çıkarma
- Hesap askıya alma/aktifleştirme
- Kullanıcı olarak giriş yapma (impersonation)
- Şifre sıfırlama
- E-posta doğrulama gönderme
- Aktivite logları görüntüleme
- Export (CSV, Excel)

### 16.4 Admin Yetkilendirme Sistemi

```typescript
enum AdminRole {
  SUPER_ADMIN    // Tam yetki - her şeyi yapabilir
  ADMIN          // Genel yönetim - kullanıcı/abonelik yönetimi
  BILLING_ADMIN  // Sadece faturalama işlemleri
  SUPPORT        // Destek - kullanıcı görüntüleme, ticket yanıtlama
  VIEWER         // Sadece görüntüleme
}

// Granular permissions
const permissions = {
  users: ['view', 'edit', 'delete', 'impersonate'],
  subscriptions: ['view', 'edit', 'cancel', 'refund'],
  analytics: ['view', 'export'],
  settings: ['view', 'edit'],
  support: ['view', 'respond', 'close'],
};
```

---

## 17. ABONELİK VE FATURALAMA SİSTEMİ

### 17.1 Plan Tanımları

| Plan | Aylık | Yıllık | Özellikler |
|------|-------|--------|------------|
| **Ücretsiz** | ₺0 | ₺0 | 1 workspace, 3 workflow, 50 run/ay, 100 AI kredi |
| **Pro** | ₺299 | ₺2,990 | 3 workspace, 25 workflow, 500 run/ay, 1000 AI kredi |
| **Team** | ₺799 | ₺7,990 | 10 workspace, 100 workflow, 2000 run/ay, 5000 AI kredi, 10 üye |
| **Enterprise** | Özel | Özel | Sınırsız her şey, SLA, dedicated support |

### 17.2 Limit Sistemi

Her plan için şu limitler kontrol edilecek:
- Workspace sayısı
- Marka sayısı
- Workflow sayısı
- Aylık workflow çalıştırma
- Aylık rapor oluşturma
- Bağlantı sayısı
- Takım üyesi sayısı
- Depolama alanı (MB)
- AI kredi
- Veri saklama süresi (gün)

### 17.3 Stripe Entegrasyonu

- Checkout Session ile ödeme
- Customer Portal ile fatura yönetimi
- Webhook'lar ile otomatik güncelleme
- Kupon ve promosyon kodu desteği
- Türk Lirası ile ödeme
- Fatura kesme (e-fatura entegrasyonu opsiyonel)

### 17.4 Kredi Sistemi

AI işlemleri için kredi sistemi:
- Her AI çağrısı belirli kredi harcar
- Aylık kreditler yenilenir
- Ek kredi paketi satın alınabilir
- Kredi kullanım logları

---

## 18. İSTATİSTİK VE ANALİTİK SİSTEMİ

### 18.1 Platform Metrikleri

**Kullanıcı Metrikleri:**
- Toplam kayıtlı kullanıcı
- Günlük/haftalık/aylık aktif kullanıcı (DAU/WAU/MAU)
- Yeni kayıt sayısı
- Churn oranı
- Retention oranı
- Cohort analizi

**Gelir Metrikleri:**
- MRR (Monthly Recurring Revenue)
- ARR (Annual Recurring Revenue)
- ARPU (Average Revenue Per User)
- LTV (Customer Lifetime Value)
- Churn revenue
- Plan dağılımı

**Kullanım Metrikleri:**
- Workflow çalıştırma sayısı
- Rapor oluşturma sayısı
- AI kullanımı (model bazında)
- Özellik kullanım oranları
- Export sayıları (format bazında)

**Sistem Metrikleri:**
- API response time
- Error rate
- Uptime
- Queue işlem süreleri

### 18.2 Dashboard Grafikleri

- Kullanıcı büyüme çizgi grafiği
- Gelir trend grafiği
- Plan dağılımı pasta grafiği
- Özellik kullanım bar grafiği
- Coğrafi dağılım haritası
- Cohort tablosu

---

## 19. LANDING PAGE VE MARKETING SAYFALARI

### 19.1 Ana Sayfa Bölümleri

1. **Hero Section**
   - Başlık ve alt başlık
   - CTA butonları
   - Dashboard screenshot/video
   - Sosyal kanıt (kullanıcı sayısı, rating)

2. **Problem/Çözüm Section**
   - Mevcut sorunlar listesi
   - MarkaRapor çözümleri

3. **Özellikler Section**
   - 6-9 ana özellik kartı
   - İkon, başlık, açıklama

4. **AI Section**
   - AI model logoları
   - Örnek analiz çıktısı
   - Özellik listesi

5. **Workflow Builder Section**
   - Büyük screenshot
   - Animasyon/video

6. **Entegrasyonlar Section**
   - Platform logoları grid

7. **Fiyatlandırma Section**
   - Plan kartları
   - Özellik karşılaştırma tablosu

8. **Testimonials Section**
   - Müşteri yorumları carousel

9. **CTA Section**
   - Son çağrı
   - Kayıt butonu

10. **Footer**
    - Linkler
    - Sosyal medya
    - İletişim

### 19.2 Alt Sayfalar

- `/features` - Tüm özellikler detaylı
- `/pricing` - Fiyatlandırma ve SSS
- `/templates` - Template galerisi
- `/integrations` - Entegrasyon detayları
- `/use-cases/agencies` - Ajanslar için
- `/use-cases/freelancers` - Freelancerlar için
- `/blog` - SEO içerikleri
- `/about` - Hakkımızda
- `/contact` - İletişim formu
- `/privacy` - Gizlilik politikası
- `/terms` - Kullanım koşulları

### 19.3 SEO Gereksinimleri

**Teknik SEO:**
- Server-side rendering (Next.js)
- Semantic HTML5
- Structured data (JSON-LD)
- XML sitemap
- Robots.txt
- Canonical URLs
- Hreflang (TR/EN)
- Open Graph meta tags
- Twitter cards
- Core Web Vitals optimizasyonu

**İçerik SEO:**
- Anahtar kelime optimizasyonu
- Meta title/description her sayfa için
- H1-H6 hiyerarşisi
- Alt text görseller için
- Internal linking
- Blog içerikleri

**Hedef Anahtar Kelimeler:**
- dijital pazarlama raporu
- google ads raporu
- seo raporu
- analytics raporu
- pazarlama otomasyonu
- otomatik rapor oluşturma
- ajans raporlama yazılımı

---

## 20. BACKEND DETAYLARI

### 20.1 Middleware Zinciri

```
Request
  ↓
1. Rate Limiting (IP bazlı)
  ↓
2. Auth Check (JWT/Session)
  ↓
3. Admin Route Protection
  ↓
4. Maintenance Mode Check
  ↓
5. Locale Detection
  ↓
6. Security Headers
  ↓
7. Request Logging
  ↓
Route Handler
```

### 20.2 Background Jobs

| Job | Açıklama | Schedule |
|-----|----------|----------|
| `workflow-execution` | Workflow çalıştırma | On-demand |
| `workflow-scheduler` | Zamanlanmış workflow kontrolü | Her dakika |
| `report-generation` | Rapor oluşturma | On-demand |
| `email-sending` | E-posta gönderme | On-demand |
| `daily-metrics` | Günlük metrik hesaplama | Her gün 00:00 |
| `credit-reset` | Aylık kredi sıfırlama | Her ayın 1'i |
| `cleanup-sessions` | Süresi dolmuş oturumları sil | Her gün 03:00 |
| `cleanup-logs` | Eski logları sil | Her gün 03:00 |
| `subscription-check` | Abonelik bildirimleri | Her gün 06:00 |
| `token-refresh` | OAuth token yenileme | Her 30 dakika |

### 20.3 API Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/*` (genel) | 100 req | 1 dakika |
| `/api/auth/*` | 5 req | 15 dakika |
| `/api/ai/*` | 20 req | 1 dakika |
| `/api/export/*` | 10 req | 1 dakika |
| `/api/webhook/*` | 1000 req | 1 dakika |

### 20.4 Error Handling

- Merkezi error handler
- Pino logger ile structured logging
- Sentry entegrasyonu
- Database error logging
- User-friendly error mesajları
- Stack trace'ler sadece development'ta

### 20.5 Caching Stratejisi

| Veri | TTL | Storage |
|------|-----|---------|
| API responses | 5 dk | Redis |
| Google Ads data | 15 dk | Redis |
| Analytics data | 15 dk | Redis |
| Search Console data | 1 saat | Redis |
| User sessions | 24 saat | Redis |
| Static assets | 1 yıl | CDN |

---

## 21. GÜVENLİK

### 21.1 Authentication

- NextAuth.js v5 ile OAuth
- JWT token'lar
- Refresh token rotation
- Session management
- 2FA desteği (opsiyonel)

### 21.2 Authorization

- Role-based access control (RBAC)
- Workspace-level permissions
- Resource ownership check
- Admin permission levels

### 21.3 Data Protection

- Token encryption (AES-256)
- Password hashing (bcrypt)
- HTTPS zorunlu
- Sensitive data masking in logs
- GDPR compliance

### 21.4 API Security

- Rate limiting
- Input validation (Zod)
- SQL injection protection (Prisma)
- XSS protection
- CSRF protection
- Security headers

---

## 22. GÜNCELLENMİŞ UYGULAMA ADIMLARI

### Faz 0: Proje Setup (3 Gün)
- [ ] Monorepo kurulumu (Turborepo)
- [ ] TypeScript konfigürasyonu
- [ ] ESLint, Prettier setup
- [ ] Husky pre-commit hooks
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Development environment

### Faz 1: Temel Altyapı (2 Hafta)
- [ ] Database schema (Prisma)
- [ ] Authentication (NextAuth.js)
- [ ] tRPC setup
- [ ] UI component library (shadcn/ui)
- [ ] i18n altyapısı (TR/EN)
- [ ] Dashboard layout
- [ ] User CRUD
- [ ] Workspace CRUD

### Faz 2: Admin Panel (1 Hafta)
- [ ] Admin authentication & authorization
- [ ] Admin dashboard
- [ ] User management
- [ ] Workspace management
- [ ] System settings
- [ ] Activity logs
- [ ] Support ticket sistemi

### Faz 3: Billing & Subscription (1 Hafta)
- [ ] Stripe entegrasyonu
- [ ] Plan management
- [ ] Checkout flow
- [ ] Customer portal
- [ ] Usage limits implementation
- [ ] Credit system
- [ ] Webhook handlers

### Faz 4: Entegrasyonlar (2 Hafta)
- [ ] Google OAuth setup
- [ ] Google Ads API client
- [ ] Google Analytics 4 API client
- [ ] Google Search Console API client
- [ ] Google Slides/Sheets/Drive API
- [ ] Connection management UI
- [ ] Token refresh mechanism
- [ ] Error handling

### Faz 5: Workflow Engine (3 Hafta)
- [ ] React Flow editor
- [ ] Node palette
- [ ] All node types implementation
- [ ] Workflow executor
- [ ] Topolojik sıralama
- [ ] Scheduler (BullMQ)
- [ ] Run history & logs
- [ ] Error handling & retry

### Faz 6: AI Entegrasyonu (2 Hafta)
- [ ] Claude API integration
- [ ] OpenAI API integration
- [ ] Gemini API integration
- [ ] AI nodes implementation
- [ ] Agent chat interface
- [ ] Streaming responses
- [ ] Türkçe prompt optimization
- [ ] Credit tracking

### Faz 7: Raporlama & Export (2 Hafta)
- [ ] Report builder UI
- [ ] PDF export (pdfkit)
- [ ] DOCX export (docx-js)
- [ ] XLSX export (exceljs)
- [ ] Google Slides export
- [ ] Google Sheets export
- [ ] Report sharing
- [ ] Marka ve aktivite entegrasyonu

### Faz 8: Template Sistemi (1 Hafta)
- [ ] Template CRUD
- [ ] Varsayılan template'ler
- [ ] Template marketplace UI
- [ ] Template kategorileri
- [ ] Template preview

### Faz 9: Analytics & Monitoring (1 Hafta)
- [ ] Platform analytics dashboard
- [ ] Usage tracking implementation
- [ ] Revenue analytics
- [ ] Cohort analysis
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] Daily metrics job

### Faz 10: Landing Page & Marketing (1 Hafta)
- [ ] Landing page design & implementation
- [ ] Features page
- [ ] Pricing page
- [ ] Use cases pages
- [ ] About & Contact pages
- [ ] Legal pages
- [ ] SEO optimization
- [ ] Structured data
- [ ] Sitemap & robots.txt

### Faz 11: Mobile & PWA (1 Hafta)
- [ ] Mobile responsive optimization
- [ ] Touch-friendly UI
- [ ] PWA manifest
- [ ] Service worker
- [ ] Offline support
- [ ] Push notifications

### Faz 12: Testing & QA (1 Hafta)
- [ ] Unit tests (Vitest)
- [ ] Integration tests
- [ ] E2E tests (Playwright)
- [ ] Load testing
- [ ] Security audit
- [ ] Accessibility audit

### Faz 13: Launch Preparation (1 Hafta)
- [ ] Production environment setup
- [ ] SSL certificates
- [ ] CDN configuration
- [ ] Backup strategy
- [ ] Monitoring alerts
- [ ] Documentation
- [ ] Beta testing
- [ ] Bug fixes
- [ ] Performance optimization

---

## 23. SONUÇ

Bu proje planı, MarkaRapor platformunun **tüm detaylarını** kapsamaktadır:

### Teknik Detaylar
1. **Teknik Mimari**: Next.js 14, tRPC, Prisma, PostgreSQL, Redis, BullMQ
2. **Veritabanı Şeması**: 25+ tablo ile kapsamlı veri modeli (User, Workspace, Brand, Workflow, Report, Billing, Admin, Support, Analytics)
3. **API Tasarımı**: tRPC ile tip-güvenli 10+ router
4. **Workflow Engine**: Node-based visual builder, 30+ node tipi
5. **Entegrasyonlar**: Google Ads, Analytics 4, Search Console, Slides, Sheets, Drive
6. **AI Servisi**: Claude Opus 4.5, GPT 5.2, Gemini 3 (streaming + credit tracking)
7. **Export Sistemi**: PDF, DOCX, XLSX, PPTX, Google Slides/Sheets (profesyonel şablonlar)

### İş Gereksinimleri
8. **Admin Panel**: Tam yönetim, kullanıcı/abonelik/analitik/destek
9. **Billing Sistemi**: Stripe, TL ödeme, plan limitleri, kredi sistemi
10. **Analytics**: Platform metrikleri, cohort, churn, revenue tracking
11. **Marketing**: Landing page, SEO optimizasyonu, alt sayfalar

### Operasyonel
12. **Güvenlik**: OAuth, RBAC, encryption, rate limiting
13. **Background Jobs**: 10+ job tipi, cron scheduling
14. **Monitoring**: Sentry, logging, alerting

### Toplam Süre: 18-20 Hafta

### Öncelik Sırası:
1. Temel altyapı ve auth
2. Admin panel ve billing
3. Google entegrasyonları
4. Workflow engine
5. AI entegrasyonu
6. Raporlama ve export
7. Analytics ve monitoring
8. Landing page ve SEO
9. Mobile ve PWA
10. Test ve launch

---

---

## 24. SİSTEM ÇALIŞMA PRENSİBİ

### 24.1 Genel Akış Şeması

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        MARKARAPOR ÇALIŞMA PRENSİBİ                          │
└─────────────────────────────────────────────────────────────────────────────┘

1. BAĞLANTI KURMA
   ┌──────────┐     OAuth 2.0      ┌─────────────────┐
   │ Kullanıcı│ ──────────────────▶│ Google/Platform │
   └──────────┘                    │ API'leri        │
        │                          └─────────────────┘
        │ Token kaydet                     │
        ▼                                  │
   ┌──────────┐                           │
   │ Database │◀──────────────────────────┘
   └──────────┘

2. WORKFLOW OLUŞTURMA
   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
   │   Trigger    │───▶│  Data Fetch  │───▶│  Transform   │
   │ (Manuel/Cron)│    │ (APIs)       │    │  (Process)   │
   └──────────────┘    └──────────────┘    └──────────────┘
                                                  │
   ┌──────────────┐    ┌──────────────┐          │
   │    Export    │◀───│  AI Analyze  │◀─────────┘
   │ (PDF/Slides) │    │ (Claude/GPT) │
   └──────────────┘    └──────────────┘

3. RAPOR OLUŞTURMA AKIŞI
   ┌─────────────────────────────────────────────────────────────┐
   │                                                             │
   │  ┌─────┐   ┌──────────┐   ┌─────────┐   ┌──────────────┐   │
   │  │Start│──▶│ Veri Al  │──▶│ Grafikler│──▶│ AI Yorumlar │   │
   │  └─────┘   │ (GA/GSC/ │   │ Oluştur  │   │ Ekle        │   │
   │            │  Ads)    │   └─────────┘   └──────────────┘   │
   │            └──────────┘        │               │           │
   │                                ▼               ▼           │
   │                          ┌─────────────────────────┐       │
   │                          │    Template Doldur      │       │
   │                          │  (Slides/Sheets/PDF)    │       │
   │                          └─────────────────────────┘       │
   │                                      │                     │
   │                                      ▼                     │
   │                          ┌─────────────────────────┐       │
   │                          │   Kaydet & Bildirim     │       │
   │                          └─────────────────────────┘       │
   │                                                             │
   └─────────────────────────────────────────────────────────────┘
```

### 24.2 Veri Akışı Detayı

```
┌──────────────────────────────────────────────────────────────────┐
│                         VERİ AKIŞI                               │
└──────────────────────────────────────────────────────────────────┘

ADIM 1: VERİ TOPLAMA
┌─────────────────┐
│ Google Ads API  │──┐
├─────────────────┤  │     ┌─────────────────┐
│ GA4 API         │──┼────▶│  Data Aggregator │
├─────────────────┤  │     │  (Node.js)       │
│ Search Console  │──┘     └────────┬────────┘
└─────────────────┘                 │
                                    ▼
ADIM 2: VERİ İŞLEME         ┌─────────────────┐
                            │  Data Processor  │
                            │  - Temizleme     │
                            │  - Hesaplama     │
                            │  - Karşılaştırma │
                            └────────┬────────┘
                                     │
                                     ▼
ADIM 3: AI ANALİZİ          ┌─────────────────┐
                            │    AI Engine     │
                            │  ┌───────────┐   │
                            │  │  Claude   │   │
                            │  ├───────────┤   │
                            │  │   GPT     │   │
                            │  ├───────────┤   │
                            │  │  Gemini   │   │
                            │  └───────────┘   │
                            └────────┬────────┘
                                     │
                                     ▼
ADIM 4: ÇIKTI OLUŞTURMA    ┌─────────────────┐
                            │  Output Engine   │
                            │  ┌───────────┐   │
                            │  │  Charts   │   │
                            │  ├───────────┤   │
                            │  │  Tables   │   │
                            │  ├───────────┤   │
                            │  │ Templates │   │
                            │  └───────────┘   │
                            └────────┬────────┘
                                     │
                                     ▼
ADIM 5: EXPORT              ┌─────────────────┐
                            │ Export Handler   │
                            │  - PDF           │
                            │  - DOCX          │
                            │  - Google Slides │
                            │  - Google Sheets │
                            └─────────────────┘
```

### 24.3 Workflow Engine Çalışma Prensibi

```
┌──────────────────────────────────────────────────────────────────┐
│                    WORKFLOW ENGINE                               │
└──────────────────────────────────────────────────────────────────┘

1. WORKFLOW YAPILANDIRMA
   ┌────────────────────────────────────────────────────────┐
   │                    Workflow JSON                       │
   │  {                                                     │
   │    "nodes": [                                          │
   │      { "id": "1", "type": "trigger-schedule" },        │
   │      { "id": "2", "type": "google-ads-performance" },  │
   │      { "id": "3", "type": "ai-analyze" },              │
   │      { "id": "4", "type": "slides-update" }            │
   │    ],                                                  │
   │    "edges": [                                          │
   │      { "source": "1", "target": "2" },                 │
   │      { "source": "2", "target": "3" },                 │
   │      { "source": "3", "target": "4" }                  │
   │    ]                                                   │
   │  }                                                     │
   └────────────────────────────────────────────────────────┘

2. ÇALIŞTIRMA SÜRECİ
   ┌─────────────┐
   │  Scheduler  │  Her dakika kontrol
   └──────┬──────┘
          │ nextRunAt <= now?
          ▼
   ┌─────────────┐
   │   BullMQ    │  Job Queue'ya ekle
   │   Queue     │
   └──────┬──────┘
          │
          ▼
   ┌─────────────┐
   │   Worker    │  Job'u al ve çalıştır
   └──────┬──────┘
          │
          ▼
   ┌─────────────┐
   │  Executor   │  Node'ları sırayla çalıştır
   └──────┬──────┘
          │
          ├──▶ Node 1: Trigger (skip - already triggered)
          │
          ├──▶ Node 2: Google Ads API çağır
          │         └──▶ Output: { campaigns: [...], metrics: {...} }
          │
          ├──▶ Node 3: AI Analyze
          │         └──▶ Input: Node 2 output
          │         └──▶ Output: { insights: [...], summary: "..." }
          │
          └──▶ Node 4: Slides Update
                    └──▶ Input: Node 2 + Node 3 outputs
                    └──▶ Output: { slideUrl: "..." }

3. HATA YÖNETİMİ
   ┌─────────────────────────────────────────┐
   │  Node başarısız olursa:                 │
   │  ├─ 3 kez retry (exponential backoff)   │
   │  ├─ Hata logla                          │
   │  ├─ Workflow'u FAILED olarak işaretle   │
   │  └─ Kullanıcıya bildirim gönder         │
   └─────────────────────────────────────────┘
```

### 24.4 Rapor Oluşturma Süreci

```
┌──────────────────────────────────────────────────────────────────┐
│                 RAPOR OLUŞTURMA SÜRECİ                           │
└──────────────────────────────────────────────────────────────────┘

KULLANICI AKIŞI:
================

1. Marka Seçimi
   └──▶ Marka: "ABC Şirketi"

2. Rapor Tipi Seçimi
   └──▶ Tip: "Aylık SEO Performans Raporu"

3. Dönem Seçimi
   └──▶ Dönem: "Ocak 2026"

4. Veri Kaynakları Seçimi
   ├──▶ Google Search Console ✓
   ├──▶ Google Analytics 4 ✓
   └──▶ Google Ads ✗

5. AI Model Seçimi
   └──▶ Model: "Claude Opus 4.5"

6. "Rapor Oluştur" Butonu
   │
   ▼

ARKA PLAN İŞLEMLERİ:
====================

┌─────────────────────────────────────────────────────────────┐
│ 1. VERİ ÇEKME (Paralel)                                     │
│    ┌─────────────┐  ┌─────────────┐                        │
│    │ GSC API     │  │ GA4 API     │                        │
│    │ - Queries   │  │ - Sessions  │                        │
│    │ - Pages     │  │ - Users     │                        │
│    │ - Position  │  │ - Events    │                        │
│    └──────┬──────┘  └──────┬──────┘                        │
│           │                │                                │
│           └───────┬────────┘                                │
│                   ▼                                         │
│ 2. VERİ HARMANLAMA                                          │
│    ┌─────────────────────────────────────┐                 │
│    │ Combined Data:                      │                 │
│    │ - impressions: 4.5M                 │                 │
│    │ - clicks: 23.6K                     │                 │
│    │ - sessions: 31.1K                   │                 │
│    │ - top_queries: [...]                │                 │
│    │ - top_pages: [...]                  │                 │
│    └─────────────────┬───────────────────┘                 │
│                      ▼                                      │
│ 3. KARŞILAŞTIRMA HESAPLAMA                                  │
│    ┌─────────────────────────────────────┐                 │
│    │ Önceki dönem vs Mevcut dönem:       │                 │
│    │ - impressions_change: +13.70%       │                 │
│    │ - clicks_change: -5.37%             │                 │
│    │ - sessions_change: -9.95%           │                 │
│    └─────────────────┬───────────────────┘                 │
│                      ▼                                      │
│ 4. GRAFİK OLUŞTURMA                                         │
│    ┌─────────────────────────────────────┐                 │
│    │ Charts:                             │                 │
│    │ - monthly_traffic_bar               │                 │
│    │ - daily_sessions_line               │                 │
│    │ - device_distribution_pie           │                 │
│    │ - country_performance_bar           │                 │
│    └─────────────────┬───────────────────┘                 │
│                      ▼                                      │
│ 5. AI ANALİZİ                                               │
│    ┌─────────────────────────────────────┐                 │
│    │ Claude Opus 4.5:                    │                 │
│    │                                     │                 │
│    │ Prompt: "Aşağıdaki SEO verilerini   │                 │
│    │ analiz et ve Türkçe olarak:         │                 │
│    │ 1. Performans özeti                 │                 │
│    │ 2. Öne çıkan trendler               │                 │
│    │ 3. Aksiyon önerileri                │                 │
│    │ oluştur."                           │                 │
│    │                                     │                 │
│    │ Output:                             │                 │
│    │ - executive_summary: "..."          │                 │
│    │ - insights: [...]                   │                 │
│    │ - recommendations: [...]            │                 │
│    └─────────────────┬───────────────────┘                 │
│                      ▼                                      │
│ 6. TEMPLATE DOLDURMA                                        │
│    ┌─────────────────────────────────────┐                 │
│    │ Google Slides Template:             │                 │
│    │ - {{BRAND_NAME}} → "ABC Şirketi"    │                 │
│    │ - {{PERIOD}} → "Ocak 2026"          │                 │
│    │ - {{IMPRESSIONS}} → "4.5M"          │                 │
│    │ - {{CLICKS}} → "23.6K"              │                 │
│    │ - {{AI_SUMMARY}} → "..."            │                 │
│    │ - [CHART_1] → monthly_traffic_bar   │                 │
│    │ - [TABLE_1] → top_queries_table     │                 │
│    └─────────────────┬───────────────────┘                 │
│                      ▼                                      │
│ 7. FİNAL ÇIKTI                                              │
│    ┌─────────────────────────────────────┐                 │
│    │ Output Options:                     │                 │
│    │ ☑ Google Slides (link)              │                 │
│    │ ☑ PDF (download)                    │                 │
│    │ ☐ DOCX (download)                   │                 │
│    │ ☐ Email gönder                      │                 │
│    └─────────────────────────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 25. RAPOR TASARIMLARI

### 25.1 Google Slides Template Yapısı (SEO Raporu - 22 Slayt)

```
┌──────────────────────────────────────────────────────────────────┐
│           MONTHLY SEO REPORT - GOOGLE SLIDES TEMPLATE            │
└──────────────────────────────────────────────────────────────────┘

SLAYT 1: KAPAK
┌─────────────────────────────────────────────┐
│                                             │
│    ┌─────────────┐                          │
│    │ Monthly     │                          │
│    │ Report      │                          │
│    └─────────────┘                          │
│                                             │
│    SEO Report                               │
│                                             │
│    {{ACCOUNT_NAME}}                         │
│                                             │
│    {{MONTH}} {{YEAR}}                       │
│                                             │
│    ┌───────────┐ ┌───────────┐              │
│    │Confidential│ │Copyright ©│             │
│    └───────────┘ └───────────┘              │
│                                   [LOGO]    │
└─────────────────────────────────────────────┘

SLAYT 2: İÇİNDEKİLER
┌─────────────────────────────────────────────┐
│                                             │
│    Monthly                                  │
│    SEO Report                               │
│                                             │
│    Executive Monthly Performance            │
│      • SEO Performance Overview             │
│      • Monthly Organic Traffic Evolution    │
│      • Daily Organic Sessions Analysis      │
│                                             │
│    Discoverability Analysis                 │
│      • Monthly Clicks vs Position           │
│      • GSC Monthly Analysis: Device         │
│      • GSC Monthly Analysis: Countries      │
│      • GSC Monthly Analysis: Top Keywords   │
│                                             │
│    Site Centric Organic Analysis            │
│      • Organic Sessions Share               │
│      • Organic Traffic Quality              │
│      • Organic Traffic Search Engines       │
│      • Organic Traffic Landing Pages        │
│                                             │
└─────────────────────────────────────────────┘

SLAYT 3: BÖLÜM BAŞLIĞI (Executive Summary)
┌─────────────────────────────────────────────┐
│  ████████████████████████████████████████   │
│  █                                      █   │
│  █     Executive Summary                █   │
│  █                                      █   │
│  █     Executive Summary Organic        █   │
│  █     Analysis                         █   │
│  █                                      █   │
│  █  ┌───────────┐ ┌───────────┐         █   │
│  █  │Confidential│ │Copyright ©│        █   │
│  █  └───────────┘ └───────────┘         █   │
│  █                                      █   │
│  ████████████████████████████████████████   │
└─────────────────────────────────────────────┘
(Koyu mavi arka plan, beyaz yazı)

SLAYT 4: SEO PERFORMANCE OVERVIEW
┌─────────────────────────────────────────────┐
│  SEO Performance Overview                   │
│  ─────────────────────────────────────────  │
│                                             │
│  VISIBILITY (GSC)           TRAFFIC (GA4)   │
│  ┌─────────┐ ┌─────────┐   ┌─────────┐     │
│  │Impressns│ │ Clicks  │   │Sessions │     │
│  │  4.5M   │ │  23.6K  │   │  31.1K  │     │
│  │ ▲13.70% │ │ ▼-5.37% │   │ ▼-9.95% │     │
│  └─────────┘ └─────────┘   └─────────┘     │
│  ┌─────────┐ ┌─────────┐   ┌─────────┐     │
│  │  CTR    │ │Position │   │Engaged  │     │
│  │ 0.50%   │ │  23.55  │   │  15.2K  │     │
│  │ ▼-16.67%│ │ ▼-11.80%│   │ ▼-13.06%│     │
│  └─────────┘ └─────────┘   └─────────┘     │
│                                             │
│  ┌─ 01 Visibility (GSC) ─────────────────┐  │
│  │ • Impressions rose by 13.70%...       │  │
│  │ • Clicks fell by 5.37% and CTR...     │  │
│  │ • Average position improved...        │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ┌─ 02 Traffic GA4 ──────────────────────┐  │
│  │ • Sessions decreased by 9.95%...      │  │
│  │ • Average session duration...         │  │
│  │ • Slight improvement observed...      │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘

SLAYT 5: MONTHLY ORGANIC TRAFFIC EVOLUTION
┌─────────────────────────────────────────────┐
│  Monthly Organic Traffic Evolution          │
│  ─────────────────────────────────────────  │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │     BAR CHART                       │    │
│  │  60000 ┤                            │    │
│  │        │  ▓▓▓                       │    │
│  │  40000 ┤  ▓▓▓ ▓▓▓ ▓▓▓              │    │
│  │        │  ▓▓▓ ▓▓▓ ▓▓▓ ▓▓▓ ▓▓▓      │    │
│  │  20000 ┤  ▓▓▓ ▓▓▓ ▓▓▓ ▓▓▓ ▓▓▓ ▓▓▓  │    │
│  │        │  ▓▓▓ ▓▓▓ ▓▓▓ ▓▓▓ ▓▓▓ ▓▓▓  │    │
│  │      0 └──Jan─Feb─Mar─Apr─May─Jun── │    │
│  └─────────────────────────────────────┘    │
│                                             │
│            ▼ 12.79%                         │
│            Traffic Decreased                │
│                                             │
│  1. Recent months (April to June)...        │
│  2. The rate of decline appears to...       │
└─────────────────────────────────────────────┘

SLAYT 6: DAILY ORGANIC SESSIONS ANALYSIS
┌─────────────────────────────────────────────┐
│  ████████████████████████████████████████   │
│  █  Daily Organic Sessions Analysis     █   │
│  █                                      █   │
│  █  ┌────────────────────────────────┐  █   │
│  █  │     LINE CHART                 │  █   │
│  █  │ 1500 ┤     ╭─╮    ╭─╮          │  █   │
│  █  │ 1000 ┤ ╭───╯ ╰────╯ ╰───╮      │  █   │
│  █  │  500 ┤─╯                 ╰──    │  █   │
│  █  │    0 └─────────────────────    │  █   │
│  █  └────────────────────────────────┘  █   │
│  █                                      █   │
│  ████████████████████████████████████████   │
│                                             │
│  Insights                                   │
│  - Weekday sessions are consistently...     │
│  - There are clear session peaks on...      │
└─────────────────────────────────────────────┘

SLAYT 9: GSC MONTHLY ANALYSIS: DEVICE
┌─────────────────────────────────────────────┐
│  GSC Monthly Analysis: Device               │
│  ─────────────────────────────────────────  │
│                                             │
│  ┌────────────────────────────────────┐     │
│  │ Device  │ Clicks │ Impr. │CTR│Pos. │     │
│  ├─────────┼────────┼───────┼───┼─────┤     │
│  │ DESKTOP │ 12,121 │ 3.2M  │0.4│24.12│     │
│  │ MOBILE  │ 11,400 │ 1.1M  │1.0│22.11│     │
│  │ TABLET  │   121  │  11K  │1.1│10.41│     │
│  └────────────────────────────────────┘     │
│                                             │
│  ┌──────────────┐  • Desktop drives the     │
│  │   PIE CHART  │    highest impressions... │
│  │  ┌────────┐  │  • Mobile generates...    │
│  │  │DESKTOP │  │  • Although Tablet...     │
│  │  │ 51.3%  │  │                           │
│  │  └────────┘  │                           │
│  └──────────────┘                           │
└─────────────────────────────────────────────┘

SLAYT 11: TOP QUERIES OVERALL
┌─────────────────────────────────────────────┐
│  Top Queries Overall                        │
│  ─────────────────────────────────────────  │
│                                             │
│  ┌────────────────────────────────────┐     │
│  │Query  │Clicks│Impr. │CTR   │Pos.  │     │
│  ├───────┼──────┼──────┼──────┼──────┤     │
│  │query1 │ 322  │22.8K │1.40% │ 4.3  │     │
│  │query2 │ 134  │ 163  │82.20%│ 1.0  │     │
│  │query3 │ 128  │ 932  │13.70%│ 3.0  │     │
│  │query4 │ 110  │ 296  │37.20%│ 1.89 │     │
│  │query5 │  99  │ 128  │77.30%│ 1.0  │     │
│  │...    │ ...  │ ...  │ ...  │ ...  │     │
│  └────────────────────────────────────┘     │
│                                             │
│  ┌─ 01 Top Keyword Insights ─────────────┐  │
│  │ • Brand-related queries ("my brand"   │  │
│  │   and "swipe insight") show high CTR  │  │
│  │   of over 77%...                      │  │
│  │ • The query "best ai" has the highest │  │
│  │   number of clicks at 322...          │  │
│  │ • "how to post different size         │  │
│  │   photos on instagram"...             │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

### 25.2 Google Sheets Template Yapısı

```
┌──────────────────────────────────────────────────────────────────┐
│              GOOGLE SHEETS TEMPLATE YAPISI                       │
└──────────────────────────────────────────────────────────────────┘

SHEET TAB'LARI:
===============

1. Monthly Organic Traffic
   ┌─────────────────────────────────────────┐
   │  A          │  B        │              │
   ├─────────────┼───────────┼──────────────┤
   │ Year Month  │ Sessions  │              │
   │ 2025-01     │ 51753     │              │
   │ 2025-02     │ 48844     │              │
   │ 2025-03     │ 44353     │              │
   │ 2025-04     │ 40861     │              │
   │ 2025-05     │ 35618     │              │
   │ 2025-06     │ 31064     │              │
   ├─────────────┴───────────┴──────────────┤
   │         [BAR CHART]                    │
   │    ▓▓▓                                 │
   │    ▓▓▓ ▓▓▓                             │
   │    ▓▓▓ ▓▓▓ ▓▓▓ ▓▓▓ ▓▓▓ ▓▓▓            │
   └────────────────────────────────────────┘

2. Daily Organic Traffic
   ┌─────────────────────────────────────────┐
   │  A          │  B        │              │
   ├─────────────┼───────────┼──────────────┤
   │ Date        │ Sessions  │              │
   │ 2025-06-01  │ 423       │              │
   │ 2025-06-02  │ 1156      │              │
   │ 2025-06-03  │ 1289      │              │
   │ ...         │ ...       │              │
   ├─────────────┴───────────┴──────────────┤
   │         [LINE CHART]                   │
   │    ╭─╮    ╭─╮    ╭─╮                   │
   │ ───╯ ╰────╯ ╰────╯ ╰───               │
   └────────────────────────────────────────┘

3. GSC Device
   ┌─────────────────────────────────────────┐
   │  Device  │ Clicks │ Impr. │ CTR │ Pos. │
   ├──────────┼────────┼───────┼─────┼──────┤
   │ DESKTOP  │ 12121  │3287442│0.40%│24.12 │
   │ MOBILE   │ 11400  │1185361│1.00%│22.11 │
   │ TABLET   │  121   │ 11224 │1.10%│10.41 │
   ├──────────┴────────┴───────┴─────┴──────┤
   │         [PIE CHART]                    │
   └────────────────────────────────────────┘

4. GSC Market (Countries)
   ┌─────────────────────────────────────────┐
   │ Country │ Clicks │ Impr. │ CTR │ Pos.  │
   ├─────────┼────────┼───────┼─────┼───────┤
   │ USA     │ 8542   │1.2M   │0.71%│18.5   │
   │ UK      │ 3421   │456K   │0.75%│21.3   │
   │ Germany │ 2156   │312K   │0.69%│22.1   │
   │ ...     │ ...    │ ...   │ ... │ ...   │
   └─────────────────────────────────────────┘

5. GSC Ranking (Top Queries)
   ┌─────────────────────────────────────────┐
   │ Query   │ Clicks │ Impr. │ CTR │ Pos.  │
   ├─────────┼────────┼───────┼─────┼───────┤
   │ query1  │  322   │22.8K  │1.40%│ 4.3   │
   │ query2  │  134   │ 163   │82.2%│ 1.0   │
   │ ...     │  ...   │ ...   │ ... │ ...   │
   └─────────────────────────────────────────┘

6. Sessions Analysis
   ┌─────────────────────────────────────────┐
   │ Source/Medium │Sessions│Engaged│Bounce │
   ├───────────────┼────────┼───────┼───────┤
   │ google/organic│ 28542  │ 14271 │ 42%   │
   │ bing/organic  │  2156  │  1078 │ 45%   │
   │ direct/none   │  3421  │  1711 │ 38%   │
   │ ...           │  ...   │  ...  │ ...   │
   └─────────────────────────────────────────┘
```

### 25.3 PDF Rapor Tasarımı

```
┌──────────────────────────────────────────────────────────────────┐
│                    PDF RAPOR ŞABLONU                             │
└──────────────────────────────────────────────────────────────────┘

SAYFA 1: KAPAK
┌─────────────────────────────────────────────┐
│                                             │
│              [MARKA LOGOSU]                 │
│                                             │
│                                             │
│      ════════════════════════════           │
│                                             │
│           AYLIK SEO RAPORU                  │
│                                             │
│      ════════════════════════════           │
│                                             │
│           ABC ŞİRKETİ                       │
│                                             │
│           Ocak 2026                         │
│                                             │
│                                             │
│                                             │
│                                             │
│   ─────────────────────────────────────     │
│   Oluşturulma: 01.02.2026                   │
│   MarkaRapor ile hazırlanmıştır             │
└─────────────────────────────────────────────┘

SAYFA 2: İÇİNDEKİLER
┌─────────────────────────────────────────────┐
│                                             │
│   İÇİNDEKİLER                               │
│   ═══════════                               │
│                                             │
│   1. Yönetici Özeti ..................... 3 │
│   2. Performans Metrikleri .............. 4 │
│   3. Görünürlük Analizi ................. 5 │
│   4. Trafik Analizi ..................... 6 │
│   5. Anahtar Kelime Performansı ......... 7 │
│   6. Sayfa Performansı .................. 8 │
│   7. AI Insights ....................... 9  │
│   8. Dönem İçi Aktiviteler ............. 10 │
│   9. Sonuç ve Öneriler ................. 11 │
│                                             │
└─────────────────────────────────────────────┘

SAYFA 3: YÖNETİCİ ÖZETİ
┌─────────────────────────────────────────────┐
│                                             │
│   YÖNETİCİ ÖZETİ                            │
│   ══════════════                            │
│                                             │
│   {{AI_GENERATED_EXECUTIVE_SUMMARY}}        │
│                                             │
│   Bu dönemde organik görünürlük %13.7       │
│   oranında artış göstermiştir. Ancak        │
│   tıklama oranlarında %5.37'lik bir         │
│   düşüş gözlemlenmiştir. Bu durum,          │
│   meta açıklamalarının ve başlıkların       │
│   optimizasyonuna ihtiyaç duyulduğunu       │
│   göstermektedir.                           │
│                                             │
│   Öne çıkan gelişmeler:                     │
│   • Impressions: 4.5M (+13.70%)             │
│   • Clicks: 23.6K (-5.37%)                  │
│   • Ortalama Pozisyon: 23.55 (iyileşme)     │
│                                             │
│   Kritik öneriler:                          │
│   1. Meta tag optimizasyonu                 │
│   2. Mobile deneyim iyileştirmesi           │
│   3. İçerik güncellemeleri                  │
│                                             │
└─────────────────────────────────────────────┘

SAYFA 4: PERFORMANS METRİKLERİ
┌─────────────────────────────────────────────┐
│                                             │
│   PERFORMANS METRİKLERİ                     │
│   ═════════════════════                     │
│                                             │
│   ┌──────────────────────────────────────┐  │
│   │ Metrik      │  Değer  │ Değişim     │  │
│   ├─────────────┼─────────┼─────────────┤  │
│   │ Impressions │  4.5M   │ ▲ +13.70%   │  │
│   │ Clicks      │  23.6K  │ ▼ -5.37%    │  │
│   │ CTR         │  0.50%  │ ▼ -16.67%   │  │
│   │ Avg Position│  23.55  │ ▲ -11.80%   │  │
│   │ Sessions    │  31.1K  │ ▼ -9.95%    │  │
│   │ Engaged     │  15.2K  │ ▼ -13.06%   │  │
│   │ Avg Duration│  02:38  │ ▲ +2.62%    │  │
│   │ Events/Sess │  4.08   │ ▲ +0.49%    │  │
│   └──────────────────────────────────────┘  │
│                                             │
│   ┌──────────────────────────────────────┐  │
│   │         [TREND CHART]                │  │
│   │    Aylık Performans Trendi           │  │
│   │         ╭─╮                          │  │
│   │    ────╯  ╰────────                  │  │
│   └──────────────────────────────────────┘  │
│                                             │
└─────────────────────────────────────────────┘

SAYFA 7: AI INSIGHTS
┌─────────────────────────────────────────────┐
│                                             │
│   AI INSIGHTS                               │
│   ═══════════                               │
│                                             │
│   ┌────────────────────────────────────┐    │
│   │ █                                  │    │
│   │ █  PERFORMANS ANALİZİ              │    │
│   │ █                                  │    │
│   │ Görünürlük artışına rağmen         │    │
│   │ tıklama oranlarındaki düşüş,       │    │
│   │ SERP snippet'larının rekabetçi     │    │
│   │ olmadığını göstermektedir.         │    │
│   └────────────────────────────────────┘    │
│                                             │
│   ┌────────────────────────────────────┐    │
│   │ █                                  │    │
│   │ █  TREND ANALİZİ                   │    │
│   │ █                                  │    │
│   │ Son 3 ayda organik trafikte        │    │
│   │ sürekli bir düşüş trendi           │    │
│   │ gözlemlenmektedir. Bu durum        │    │
│   │ mevsimsel faktörlerden veya        │    │
│   │ algoritma güncellemelerinden       │    │
│   │ kaynaklanıyor olabilir.            │    │
│   └────────────────────────────────────┘    │
│                                             │
│   ┌────────────────────────────────────┐    │
│   │ █                                  │    │
│   │ █  ÖNERİLER                        │    │
│   │ █                                  │    │
│   │ 1. Title ve meta description       │    │
│   │    optimizasyonu yapın             │    │
│   │ 2. Core Web Vitals skorlarını      │    │
│   │    iyileştirin                     │    │
│   │ 3. En iyi performans gösteren      │    │
│   │    sayfaları güncelleyin           │    │
│   └────────────────────────────────────┘    │
│                                             │
└─────────────────────────────────────────────┘

SAYFA 8: DÖNEM İÇİ AKTİVİTELER
┌─────────────────────────────────────────────┐
│                                             │
│   DÖNEM İÇİ AKTİVİTELER                     │
│   ═════════════════════                     │
│                                             │
│   ┌──────────────────────────────────────┐  │
│   │ 05.01.2026                           │  │
│   │ ─────────                            │  │
│   │ Blog yazısı yayınlandı               │  │
│   │ "2026 SEO Trendleri" başlıklı        │  │
│   │ içerik yayına alındı.                │  │
│   │ Etki: ● Yüksek                       │  │
│   └──────────────────────────────────────┘  │
│                                             │
│   ┌──────────────────────────────────────┐  │
│   │ 12.01.2026                           │  │
│   │ ─────────                            │  │
│   │ Teknik SEO iyileştirmesi             │  │
│   │ Sayfa hızı optimizasyonu yapıldı.    │  │
│   │ LCP skoru 2.1s'den 1.8s'ye düştü.    │  │
│   │ Etki: ● Orta                         │  │
│   └──────────────────────────────────────┘  │
│                                             │
│   ┌──────────────────────────────────────┐  │
│   │ 20.01.2026                           │  │
│   │ ─────────                            │  │
│   │ Backlink kazanımı                    │  │
│   │ TechCrunch'tan dofollow backlink     │  │
│   │ alındı. DR 92 domain.                │  │
│   │ Etki: ● Yüksek                       │  │
│   └──────────────────────────────────────┘  │
│                                             │
└─────────────────────────────────────────────┘

FOOTER (Tüm sayfalarda):
┌─────────────────────────────────────────────┐
│   ABC Şirketi │ Ocak 2026 │ Sayfa X/Y      │
│                    MarkaRapor ile oluşturuldu│
└─────────────────────────────────────────────┘
```

### 25.4 Renk Paleti ve Tasarım Sistemi

```
┌──────────────────────────────────────────────────────────────────┐
│                    TASARIM SİSTEMİ                               │
└──────────────────────────────────────────────────────────────────┘

RENKLER:
========

Ana Marka Rengi (Primary)
┌─────────────────────────────────────────┐
│  #0066FF (Mavi)                         │
│  - Başlıklar                            │
│  - Aktif elementler                     │
│  - CTA butonları                        │
└─────────────────────────────────────────┘

İkincil Renkler
┌─────────────────────────────────────────┐
│  #10B981 (Yeşil)  - Pozitif değişim     │
│  #EF4444 (Kırmızı) - Negatif değişim    │
│  #F59E0B (Turuncu) - Uyarı              │
│  #6366F1 (İndigo) - Vurgu               │
└─────────────────────────────────────────┘

Nötr Renkler
┌─────────────────────────────────────────┐
│  #FFFFFF - Arka plan                    │
│  #F3F4F6 - Açık gri (tablo header)      │
│  #E5E7EB - Border                       │
│  #6B7280 - İkincil metin                │
│  #1F2937 - Ana metin                    │
│  #111827 - Başlık                       │
└─────────────────────────────────────────┘

TİPOGRAFİ:
==========

Başlıklar
┌─────────────────────────────────────────┐
│  Font: Inter (veya system-ui)           │
│  H1: 32px / Bold / #111827              │
│  H2: 24px / Bold / #111827              │
│  H3: 18px / Semibold / #1F2937          │
└─────────────────────────────────────────┘

Gövde Metni
┌─────────────────────────────────────────┐
│  Font: Inter (veya system-ui)           │
│  Body: 14px / Regular / #1F2937         │
│  Small: 12px / Regular / #6B7280        │
│  Caption: 10px / Regular / #9CA3AF      │
└─────────────────────────────────────────┘

GRAFİK STİLLERİ:
================

Bar Chart
┌─────────────────────────────────────────┐
│  Bar Color: #0066FF                     │
│  Grid: #E5E7EB                          │
│  Labels: #6B7280                        │
│  Border Radius: 4px                     │
└─────────────────────────────────────────┘

Line Chart
┌─────────────────────────────────────────┐
│  Line Color: #0066FF                    │
│  Line Width: 2px                        │
│  Point Radius: 4px                      │
│  Fill: rgba(0, 102, 255, 0.1)           │
└─────────────────────────────────────────┘

Pie Chart
┌─────────────────────────────────────────┐
│  Colors: [#0066FF, #6366F1, #10B981]    │
│  Border: 2px white                      │
│  Labels: Outside                        │
└─────────────────────────────────────────┘

TABLO STİLLERİ:
===============

┌────────────────────────────────────────────┐
│  Header                                    │
│  ├─ Background: #F3F4F6                    │
│  ├─ Font: 12px / Semibold / #374151        │
│  └─ Padding: 12px 16px                     │
│                                            │
│  Row                                       │
│  ├─ Background: #FFFFFF (odd: #FAFAFA)     │
│  ├─ Font: 14px / Regular / #1F2937         │
│  ├─ Padding: 12px 16px                     │
│  └─ Border: 1px solid #E5E7EB              │
│                                            │
│  Hover                                     │
│  └─ Background: #EFF6FF                    │
└────────────────────────────────────────────┘

KPI KARTLARI:
=============

┌─────────────────┐
│   {{VALUE}}     │  Font: 24px Bold
│   {{CHANGE}}    │  Font: 12px (Green/Red)
│   ─────────     │
│   {{LABEL}}     │  Font: 12px Gray
└─────────────────┘
```

---

## 26. GOOGLE ADS RAPOR TEMPLATELERİ

### 26.1 Google Ads Monthly Slides Yapısı

```
SLAYT YAPISI (15-20 Slayt):
===========================

1. Kapak Sayfası
2. İçindekiler
3. Executive Summary (Bölüm Başlığı)
4. Account Performance Overview
   - Impressions, Clicks, Cost, Conversions
   - CTR, CPC, Conv. Rate, CPA
   - AI Commentary
5. Monthly Spend Evolution (Bar Chart)
6. Daily Performance Trend (Line Chart)
7. Campaign Breakdown (Bölüm Başlığı)
8. Campaign Performance Table
   - Campaign Name, Status, Impressions, Clicks, Cost, Conversions
9. Campaign Cost Distribution (Pie Chart)
10. Top Performing Campaigns (Top 5)
11. Underperforming Campaigns (Bottom 5)
12. Keyword Analysis (Bölüm Başlığı)
13. Top Keywords by Clicks
14. Top Keywords by Conversions
15. Search Terms Analysis
16. Device & Location (Bölüm Başlığı)
17. Device Performance
18. Geographic Performance
19. AI Recommendations
20. Next Steps & Action Items
```

### 26.2 Cross-Channel PPC Report Yapısı

```
SLAYT YAPISI (25-30 Slayt):
===========================

1. Kapak - Cross-Channel Monthly PPC Report
2. İçindekiler
3. Executive Summary
4. Total PPC Performance Overview
   - Combined metrics from all channels
5. Channel Comparison (Bar Chart)
   - Google vs Meta vs TikTok
6. Monthly Spend by Channel (Stacked Bar)
7. Google Ads Section
   - Performance Overview
   - Campaign Breakdown
   - Top Keywords
8. Meta Ads Section
   - Performance Overview
   - Campaign Breakdown
   - Top Creatives
9. TikTok Ads Section (if applicable)
   - Performance Overview
   - Campaign Breakdown
10. Cross-Channel Insights
    - AI-generated comparison
11. Budget Allocation Recommendations
12. Next Period Strategy
```

---

## 27. SONUÇ (GÜNCELLENMİŞ)

**Bu plan Claude Code'a verildiğinde:**
- ✅ Tüm teknik detaylar mevcut
- ✅ Database şeması hazır
- ✅ API yapısı tanımlı
- ✅ UI/UX spesifikasyonları var
- ✅ Admin panel detayları var
- ✅ Billing sistemi planlandı
- ✅ SEO gereksinimleri belirlendi
- ✅ Background jobs tanımlı
- ✅ Güvenlik önlemleri listeli
- ✅ **Çalışma prensibi ve akış şemaları**
- ✅ **Google Slides template tasarımları**
- ✅ **Google Sheets template yapıları**
- ✅ **PDF rapor tasarımları**
- ✅ **Renk paleti ve tasarım sistemi**
- ✅ **Google Ads rapor şablonları**

**"Şu eksik" deme durumu olmayacaktır!**
