import Anthropic from "@anthropic-ai/sdk";

export interface ClaudeConfig {
  apiKey: string;
  model?: string;
}

export interface ReportInsightRequest {
  reportType: "performance" | "seo" | "campaign" | "executive";
  data: Record<string, any>;
  language?: "tr" | "en";
  tone?: "professional" | "casual" | "executive";
}

export interface ReportInsight {
  summary: string;
  keyFindings: string[];
  recommendations: string[];
  trends: string[];
}

const DEFAULT_MODEL = "claude-3-5-sonnet-20241022";

/**
 * Claude AI client for report insights and analysis
 */
export class ClaudeClient {
  private client: Anthropic;
  private model: string;

  constructor(config: ClaudeConfig) {
    this.client = new Anthropic({
      apiKey: config.apiKey,
    });
    this.model = config.model || DEFAULT_MODEL;
  }

  /**
   * Generate insights from marketing data
   */
  async generateInsights(request: ReportInsightRequest): Promise<ReportInsight> {
    const language = request.language || "tr";
    const tone = request.tone || "professional";

    const systemPrompt = this.getSystemPrompt(request.reportType, language, tone);
    const userPrompt = this.buildDataPrompt(request.data, language);

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    return this.parseInsightResponse(content.text);
  }

  /**
   * Generate executive summary from multiple data sources
   */
  async generateExecutiveSummary(
    data: {
      adsData?: Record<string, any>;
      analyticsData?: Record<string, any>;
      searchConsoleData?: Record<string, any>;
    },
    language: "tr" | "en" = "tr"
  ): Promise<string> {
    const languageInstructions =
      language === "tr"
        ? "Yanıtını Türkçe olarak ver."
        : "Provide your response in English.";

    const systemPrompt = `Sen dijital pazarlama uzmanı bir AI asistanısın.
Verilen verileri analiz edip kısa, öz ve eyleme geçirilebilir bir yönetici özeti hazırla.
${languageInstructions}

Özet şunları içermeli:
1. Genel performans değerlendirmesi (2-3 cümle)
2. Öne çıkan başarılar (bullet points)
3. İyileştirme gerektiren alanlar (bullet points)
4. Sonraki dönem için öneriler (bullet points)

Teknik jargondan kaçın, iş sonuçlarına odaklan.`;

    const dataStr = JSON.stringify(data, null, 2);

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 2048,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Aşağıdaki pazarlama verilerini analiz et ve yönetici özeti hazırla:\n\n${dataStr}`,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    return content.text;
  }

  /**
   * Analyze campaign performance and suggest optimizations
   */
  async analyzeCampaigns(
    campaignData: Array<{
      name: string;
      impressions: number;
      clicks: number;
      cost: number;
      conversions: number;
    }>,
    language: "tr" | "en" = "tr"
  ): Promise<{
    analysis: string;
    topPerformers: string[];
    underperformers: string[];
    optimizations: string[];
  }> {
    const languageInstructions =
      language === "tr"
        ? "Yanıtını Türkçe olarak ver."
        : "Provide your response in English.";

    const systemPrompt = `Sen Google Ads kampanya optimizasyonu uzmanısın.
Kampanya verilerini analiz et ve somut öneriler sun.
${languageInstructions}

Yanıtını şu JSON formatında ver:
{
  "analysis": "Genel değerlendirme paragrafı",
  "topPerformers": ["En iyi performans gösteren kampanya isimleri"],
  "underperformers": ["Düşük performanslı kampanya isimleri"],
  "optimizations": ["Spesifik optimizasyon önerileri"]
}`;

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 2048,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Kampanya verileri:\n${JSON.stringify(campaignData, null, 2)}`,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    try {
      return JSON.parse(content.text);
    } catch {
      // If JSON parsing fails, return structured response from text
      return {
        analysis: content.text,
        topPerformers: [],
        underperformers: [],
        optimizations: [],
      };
    }
  }

  /**
   * Generate SEO recommendations from Search Console data
   */
  async generateSEORecommendations(
    data: {
      topQueries: Array<{ query: string; clicks: number; impressions: number; position: number }>;
      topPages: Array<{ page: string; clicks: number; impressions: number; position: number }>;
    },
    language: "tr" | "en" = "tr"
  ): Promise<{
    quickWins: string[];
    longTermStrategies: string[];
    contentIdeas: string[];
  }> {
    const languageInstructions =
      language === "tr"
        ? "Yanıtını Türkçe olarak ver."
        : "Provide your response in English.";

    const systemPrompt = `Sen SEO uzmanı bir AI asistanısın.
Search Console verilerini analiz et ve SEO stratejileri öner.
${languageInstructions}

Yanıtını şu JSON formatında ver:
{
  "quickWins": ["Hızlı iyileştirme önerileri - 1-2 hafta içinde uygulanabilir"],
  "longTermStrategies": ["Uzun vadeli SEO stratejileri"],
  "contentIdeas": ["Yeni içerik fikirleri - hangi konularda içerik üretilmeli"]
}`;

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 2048,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `SEO verileri:\n${JSON.stringify(data, null, 2)}`,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    try {
      return JSON.parse(content.text);
    } catch {
      return {
        quickWins: [],
        longTermStrategies: [],
        contentIdeas: [],
      };
    }
  }

  private getSystemPrompt(
    reportType: string,
    language: string,
    tone: string
  ): string {
    const languageInstructions =
      language === "tr"
        ? "Yanıtını Türkçe olarak ver."
        : "Provide your response in English.";

    const toneInstructions = {
      professional:
        "Profesyonel ve objektif bir ton kullan. Veriye dayalı konuş.",
      casual:
        "Samimi ama bilgilendirici bir ton kullan. Karmaşık terimleri açıkla.",
      executive:
        "Üst yönetim için uygun, kısa ve sonuç odaklı bir ton kullan.",
    }[tone];

    const reportInstructions = {
      performance:
        "Genel dijital pazarlama performansını analiz et. ROI, dönüşüm oranları ve büyüme trendlerine odaklan.",
      seo: "SEO performansını analiz et. Organik trafik, anahtar kelime sıralamaları ve içerik fırsatlarına odaklan.",
      campaign:
        "Reklam kampanyası performansını analiz et. Maliyet verimliliği, hedef kitle performansı ve optimizasyon fırsatlarına odaklan.",
      executive:
        "Tüm dijital pazarlama kanallarını kapsayan özet bir analiz hazırla. İş sonuçlarına ve stratejik kararlara odaklan.",
    }[reportType];

    return `Sen dijital pazarlama analisti bir AI asistanısın.
${reportInstructions}
${languageInstructions}
${toneInstructions}

Yanıtını şu JSON formatında ver:
{
  "summary": "Kısa özet paragrafı",
  "keyFindings": ["Önemli bulgu 1", "Önemli bulgu 2", ...],
  "recommendations": ["Öneri 1", "Öneri 2", ...],
  "trends": ["Trend 1", "Trend 2", ...]
}`;
  }

  private buildDataPrompt(data: Record<string, any>, language: string): string {
    const intro =
      language === "tr"
        ? "Aşağıdaki pazarlama verilerini analiz et:"
        : "Analyze the following marketing data:";

    return `${intro}\n\n${JSON.stringify(data, null, 2)}`;
  }

  private parseInsightResponse(text: string): ReportInsight {
    try {
      const parsed = JSON.parse(text);
      return {
        summary: parsed.summary || "",
        keyFindings: parsed.keyFindings || [],
        recommendations: parsed.recommendations || [],
        trends: parsed.trends || [],
      };
    } catch {
      // If JSON parsing fails, return the raw text as summary
      return {
        summary: text,
        keyFindings: [],
        recommendations: [],
        trends: [],
      };
    }
  }
}
