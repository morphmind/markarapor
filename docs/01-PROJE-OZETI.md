# MarkaRapor - Proje Özeti

## Ne Yapıyor?

MarkaRapor, dijital pazarlama ajansları ve profesyonelleri için **otomatik raporlama platformu**dur.

### Basitçe Anlatmak Gerekirse:

1. **Veri Toplama**: Google Ads, Analytics, Search Console gibi platformlardan veri çeker
2. **AI Analizi**: Claude, GPT veya Gemini ile verileri analiz eder
3. **Rapor Oluşturma**: Profesyonel PDF, DOCX, Google Slides raporları üretir
4. **Otomasyon**: Her hafta/ay otomatik olarak raporları hazırlar ve gönderir

---

## Ana Özellikler

### 1. Workflow Sistemi (Drag & Drop)
```
[Tetikleyici] → [Veri Çek] → [AI Analiz] → [Grafik] → [Slides/PDF]
```
- Node'ları sürükle-bırak ile bağla
- Zamanla otomatik çalışsın

### 2. AI Destekli Analiz
- **Claude Opus 4.5** (Ana model)
- GPT 5.2
- Gemini 3
- Türkçe optimize edilmiş promptlar

### 3. Platform Entegrasyonları
- Google Ads
- Google Analytics 4
- Google Search Console
- Google Slides & Sheets
- Google Drive

### 4. Export Seçenekleri
- PDF (Profesyonel kalite)
- DOCX (Word)
- XLSX (Excel)
- Google Slides
- Google Sheets

### 5. Marka Yönetimi
- Her marka için ayrı dashboard
- Marka renkleri ve logoları
- Dönem içi aktivite takibi

---

## Kimler İçin?

| Kullanıcı | Kullanım |
|-----------|----------|
| **Ajanslar** | Müşterilerine haftalık/aylık rapor |
| **Freelancerlar** | Kendi müşterilerine raporlama |
| **Şirket İçi Ekipler** | Yönetime performans raporu |

---

## Markifact'tan Farkı

| Konu | Markifact | MarkaRapor |
|------|-----------|------------|
| Dil | İngilizce | Türkçe öncelikli |
| Fiyat | Dolar (pahalı) | TL (uygun) |
| AI | GPT-4 | Claude + GPT + Gemini |
| UI | Karmaşık | Basit, mobil uyumlu |
| Destek | İngilizce | Türkçe |

---

## Teknoloji Stack

```
Frontend: Next.js 14 + React + Tailwind + shadcn/ui
Backend:  tRPC + Prisma + PostgreSQL + Redis
AI:       Claude Opus 4.5 + GPT 5.2 + Gemini 3
Queue:    BullMQ (arka plan işleri)
Host:     Vercel + Supabase/Neon
```

---

## Proje Yapısı

```
markarapor/
├── apps/
│   └── web/                 # Ana uygulama
├── packages/
│   ├── database/           # Prisma şema
│   ├── ai/                 # AI servisleri
│   ├── integrations/       # Google API'ler
│   ├── workflow-engine/    # Workflow motoru
│   └── export/             # PDF, DOCX üretimi
└── workers/                # Arka plan işleri
```

---

## Gelişim Süreci

| Faz | Süre | İçerik |
|-----|------|--------|
| 1 | 2 hafta | Temel altyapı, auth, CRUD |
| 2 | 2 hafta | Google entegrasyonları |
| 3 | 3 hafta | Workflow engine |
| 4 | 2 hafta | AI entegrasyonu |
| 5 | 2 hafta | Raporlama ve export |
| 6 | 2 hafta | Polish ve launch |

**Toplam: ~13 hafta**
