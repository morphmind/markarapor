# MarkaRapor - Özellikler Detayı

## 1. Dashboard

### Ana Sayfa
- Hoş geldin mesajı
- Özet metrikler (toplam workflow, marka, rapor, kredi)
- Son çalışan workflow'lar
- Yaklaşan zamanlamalar
- Hızlı erişim butonları

### Metrik Kartları
```
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│ Toplam  │ │ Aktif   │ │ Bu Ay   │ │ Kredi   │
│Workflow │ │ Marka   │ │ Rapor   │ │ Bakiye  │
│   12    │ │    5    │ │   24    │ │  850    │
└─────────┘ └─────────┘ └─────────┘ └─────────┘
```

---

## 2. Workflow Sistemi

### Workflow Editor
- **Sol Panel**: Node paleti (sürükle-bırak)
- **Orta**: Canvas (React Flow)
- **Sağ Panel**: Seçili node ayarları

### Node Kategorileri

#### Tetikleyiciler
| Node | Açıklama |
|------|----------|
| Manual | Elle çalıştır |
| Schedule | Haftalık/aylık zamanlama |
| Webhook | Dışarıdan tetikle |

#### Google Ads
| Node | Çekilen Veri |
|------|--------------|
| Performance | Impressions, clicks, cost, conversions |
| Campaigns | Kampanya listesi ve metrikleri |
| Keywords | Anahtar kelime performansı |
| Search Terms | Arama terimleri |

#### Google Analytics 4
| Node | Çekilen Veri |
|------|--------------|
| Report | Özelleştirilebilir rapor |
| Traffic Sources | Kaynak/medium dağılımı |
| Top Pages | En çok ziyaret edilen sayfalar |
| Device | Cihaz dağılımı |

#### Search Console
| Node | Çekilen Veri |
|------|--------------|
| Performance | Click, impression, CTR, position |
| Top Queries | En iyi anahtar kelimeler |
| Top Pages | En iyi sayfalar |
| Sitemaps | Sitemap durumu |

#### AI
| Node | İşlev |
|------|-------|
| Ask | Serbest soru sor |
| Analyze | Veri analizi yap |
| Generate Structured | JSON formatında çıktı |

#### Görselleştirme
| Node | Grafik Tipi |
|------|-------------|
| Line Chart | Trend grafiği |
| Bar Chart | Karşılaştırma |
| Pie Chart | Dağılım |
| Table | Tablo formatı |

#### Export
| Node | Format |
|------|--------|
| PDF | Profesyonel PDF |
| DOCX | Word belgesi |
| XLSX | Excel tablosu |
| Slides | Google Slides güncelleme |
| Sheets | Google Sheets yazma |

### Workflow Çalıştırma
1. Elle çalıştır (butona tıkla)
2. Zamanlanmış (cron job)
3. API ile tetikle (webhook)

### Run Geçmişi
- Başlangıç/bitiş zamanı
- Durum (başarılı/hatalı)
- Node bazlı loglar
- Hata detayları

---

## 3. Marka Yönetimi

### Marka Kartı
```
┌─────────────────────────────────┐
│ [Logo]                          │
│ ABC Şirketi                     │
│ www.abc.com                     │
│ Sektör: E-ticaret               │
│ ──────────────────────────────  │
│ Bağlantılar: 3 aktif            │
│ Workflow: 5                     │
│ Son Rapor: 2 gün önce           │
└─────────────────────────────────┘
```

### Marka Detay Sayfası
- Genel bilgiler (logo, renk, açıklama)
- Bağlı hesaplar (Google Ads, GA4, GSC)
- İlişkili workflow'lar
- Oluşturulan raporlar
- Dönem içi aktiviteler

### Aktivite Takibi
Her marka için yapılan işleri kaydet:

| Kategori | Örnek Aktiviteler |
|----------|-------------------|
| SEO | Teknik SEO düzeltmeleri, içerik optimizasyonu |
| Ads | Yeni kampanya, bütçe değişikliği |
| Content | Blog yazısı, landing page |
| Social | Sosyal medya kampanyası |
| Other | Diğer işler |

Aktiviteler raporlara otomatik dahil edilir.

---

## 4. Bağlantı Yönetimi

### OAuth Akışı
1. "Bağlantı Ekle" → Google OAuth
2. İzinleri onayla
3. Hesapları seç (Ads account, GA property, GSC site)
4. Marka ile eşleştir

### Desteklenen Platformlar
- Google Ads
- Google Analytics 4
- Google Search Console
- Google Slides
- Google Sheets
- Google Drive

### Bağlantı Durumları
- ✅ Aktif (token geçerli)
- ⚠️ Yenileme gerekli (token expired)
- ❌ Bağlantı kopuk (erişim iptal)

---

## 5. AI Özellikleri

### AI Agent (Chat)
Doğal dilde komut ver:
- "Bu hafta Google Ads performansı nasıl?"
- "SEO için hangi anahtar kelimelere odaklanmalıyım?"
- "Geçen aya göre dönüşüm oranı nasıl değişti?"

### Veri Analizi
AI'ın yaptığı analizler:
- Performans özeti
- Trend tespiti
- Anomali bulma
- Aksiyon önerileri

### Rapor Metin Üretimi
- Yönetici özeti
- Bölüm açıklamaları
- Insight'lar
- Öneriler

### Model Seçenekleri
| Model | En İyi Kullanım |
|-------|-----------------|
| Claude Opus 4.5 | Detaylı analiz, Türkçe |
| GPT 5.2 | Hızlı yanıt, çeşitlilik |
| Gemini 3 | Google verisi ile uyum |

---

## 6. Raporlama

### Rapor Tipleri
| Tip | İçerik |
|-----|--------|
| Performance | Genel performans özeti |
| SEO | Search Console verileri |
| Ads | Google Ads metrikleri |
| Analytics | GA4 kullanıcı verileri |
| Combined | Tüm kaynaklar birlikte |
| Audit | Derinlemesine denetim |

### Rapor Bölümleri
1. Kapak sayfası (marka logosu, dönem)
2. İçindekiler
3. Yönetici özeti
4. Performans metrikleri (kartlar + grafikler)
5. Detaylı analizler (tablolar)
6. AI Insights
7. Dönem içi aktiviteler
8. Öneriler

### Export Formatları

#### PDF
- A4 boyut
- Profesyonel tasarım
- Grafikler ve tablolar
- Header/footer
- Sayfa numaraları

#### DOCX
- Düzenlenebilir Word
- Stil şablonları
- Tablolar
- Başlık hiyerarşisi

#### Google Slides
- Template kopyalama
- Otomatik metin değiştirme
- Grafik ekleme
- Marka renkleri

#### Google Sheets
- Veri tabloları
- Grafikler
- Formül desteği

### Paylaşım
- Link ile paylaş
- Şifre korumalı
- Süreli erişim
- E-posta gönderimi

---

## 7. Admin Paneli

### Dashboard
- Toplam kullanıcı sayısı
- Aktif abonelikler
- Aylık gelir (MRR)
- Hata oranları
- Sistem sağlığı

### Kullanıcı Yönetimi
- Kullanıcı listesi
- Plan değiştirme
- Kredi ekleme
- Hesap askıya alma
- Impersonation (kullanıcı olarak giriş)

### Abonelik Yönetimi
- Plan tanımları
- Fiyatlandırma
- Kuponlar
- Fatura geçmişi

---

## 8. Faturalama

### Planlar
| Plan | Aylık | Özellikler |
|------|-------|------------|
| Free | ₺0 | 1 workspace, 3 workflow, 50 run/ay |
| Pro | ₺299 | 3 workspace, 25 workflow, 500 run/ay |
| Team | ₺799 | 10 workspace, 100 workflow, 2000 run/ay |
| Enterprise | Özel | Sınırsız |

### Kredi Sistemi
- AI işlemleri kredi harcar
- Aylık kredi yenilenir
- Ek paket satın alınabilir

### Ödeme
- Stripe entegrasyonu
- TL ile ödeme
- Otomatik yenileme
- Fatura kesimi
