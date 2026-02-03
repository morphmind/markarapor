# MarkaRapor - Hızlı Başlangıç Rehberi

## Projeyi Başlatma

### 1. Gereksinimler
```bash
Node.js 20+
pnpm 8+
PostgreSQL 15+
Redis 7+
```

### 2. Repoyu Klonla
```bash
git clone https://github.com/your-org/markarapor.git
cd markarapor
```

### 3. Bağımlılıkları Yükle
```bash
pnpm install
```

### 4. Environment Dosyası
```bash
cp .env.example .env
# .env dosyasını düzenle
```

### 5. Database Setup
```bash
pnpm db:push      # Schema uygula
pnpm db:seed      # Seed data (opsiyonel)
```

### 6. Geliştirme Sunucusu
```bash
pnpm dev
# http://localhost:3000
```

---

## Temel .env Değişkenleri

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/markarapor

# Redis
REDIS_URL=redis://localhost:6379

# Auth
NEXTAUTH_SECRET=super-secret-key-min-32-chars
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (Google Cloud Console'dan al)
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxx

# AI (ihtiyaca göre)
ANTHROPIC_API_KEY=sk-ant-xxx
OPENAI_API_KEY=sk-xxx
```

---

## Google OAuth Setup

### 1. Google Cloud Console
1. https://console.cloud.google.com
2. Yeni proje oluştur veya mevcut seç
3. "APIs & Services" → "Credentials"

### 2. OAuth Consent Screen
1. User Type: External
2. App name: MarkaRapor
3. Scopes ekle:
   - `openid`
   - `email`
   - `profile`

### 3. OAuth Client ID
1. Application type: Web application
2. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google`

### 4. API'leri Etkinleştir
- Google Ads API
- Google Analytics Data API
- Search Console API
- Google Slides API
- Google Sheets API
- Google Drive API

---

## Proje Scripts

| Komut | Açıklama |
|-------|----------|
| `pnpm dev` | Geliştirme sunucusu |
| `pnpm build` | Production build |
| `pnpm start` | Production sunucusu |
| `pnpm lint` | Linting |
| `pnpm db:generate` | Prisma client generate |
| `pnpm db:push` | Schema değişikliklerini uygula |
| `pnpm db:studio` | Prisma Studio (DB GUI) |
| `pnpm db:seed` | Seed data yükle |

---

## Klasör Yapısı Özeti

```
markarapor/
├── apps/web/              # Ana Next.js app
│   ├── app/               # App Router sayfaları
│   ├── components/        # React bileşenleri
│   ├── lib/               # Utilities
│   └── server/            # tRPC routers
│
├── packages/
│   ├── database/          # Prisma
│   ├── ai/                # AI servisleri
│   ├── integrations/      # Google API'ler
│   ├── workflow-engine/   # Workflow motoru
│   └── export/            # PDF, DOCX
│
└── workers/               # Background jobs
```

---

## İlk Geliştirme Adımları

### Hafta 1: Temel Altyapı
1. ✅ Proje yapısı oluştur (bu rehber)
2. Database schema yaz (`packages/database/prisma/schema.prisma`)
3. NextAuth setup (`apps/web/app/api/auth/[...nextauth]/route.ts`)
4. tRPC base setup (`apps/web/server/trpc.ts`)
5. UI components (shadcn/ui install)

### Hafta 2: Core Features
1. Login/Register sayfaları
2. Dashboard layout
3. Workspace CRUD
4. Brand CRUD
5. i18n (Türkçe/İngilizce)

### Hafta 3-4: Entegrasyonlar
1. Google OAuth genişletme
2. Google Ads client
3. GA4 client
4. Search Console client
5. Connection yönetim UI

---

## Faydalı Linkler

### Dokümantasyon
- [Next.js Docs](https://nextjs.org/docs)
- [tRPC Docs](https://trpc.io/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [React Flow](https://reactflow.dev/docs)

### Google APIs
- [Google Ads API](https://developers.google.com/google-ads/api/docs/start)
- [GA4 Data API](https://developers.google.com/analytics/devguides/reporting/data/v1)
- [Search Console API](https://developers.google.com/webmaster-tools/v1/api_reference_index)

### AI APIs
- [Anthropic API](https://docs.anthropic.com/en/api)
- [OpenAI API](https://platform.openai.com/docs)
- [Google AI (Gemini)](https://ai.google.dev/docs)
