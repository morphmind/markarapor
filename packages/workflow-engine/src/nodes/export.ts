import type { WorkflowNode, WorkflowContext, ExportConfig } from "../types";

/**
 * Execute an export node
 * Note: Actual PDF/DOCX generation will be handled by @markarapor/export package
 * This node prepares the data structure for export
 */
export async function executeExportNode(
  node: WorkflowNode,
  context: WorkflowContext,
  inputs: Record<string, any>
): Promise<any> {
  const config = node.config as ExportConfig;

  // Combine all inputs
  const combinedData = Object.values(inputs).reduce((acc, input) => {
    if (typeof input === "object" && input !== null) {
      return { ...acc, ...input };
    }
    return acc;
  }, {});

  // Prepare export metadata
  const exportData = {
    format: config.format,
    template: config.template,
    destination: config.destination || "download",
    generatedAt: new Date().toISOString(),
    workflowId: context.workflowId,
    runId: context.runId,
    brandId: context.brandId,
    dateRange: context.dateRange,
    data: combinedData,
  };

  switch (config.format) {
    case "pdf":
      return preparePDFExport(exportData);

    case "docx":
      return prepareDOCXExport(exportData);

    case "slides":
      return prepareSlidesExport(exportData);

    case "sheets":
      return prepareSheetsExport(exportData);

    default:
      throw new Error(`Unknown export format: ${config.format}`);
  }
}

/**
 * Prepare data structure for PDF export
 */
function preparePDFExport(exportData: any): any {
  return {
    ...exportData,
    exportType: "pdf",
    structure: {
      sections: buildReportSections(exportData.data),
      styling: {
        primaryColor: "#2563eb",
        fontFamily: "Inter",
        fontSize: 12,
      },
    },
  };
}

/**
 * Prepare data structure for DOCX export
 */
function prepareDOCXExport(exportData: any): any {
  return {
    ...exportData,
    exportType: "docx",
    structure: {
      sections: buildReportSections(exportData.data),
      tableOfContents: true,
      pageNumbers: true,
    },
  };
}

/**
 * Prepare data structure for Google Slides export
 */
function prepareSlidesExport(exportData: any): any {
  const slides = buildSlides(exportData.data);

  return {
    ...exportData,
    exportType: "slides",
    structure: {
      slides,
      theme: "modern",
      aspectRatio: "16:9",
    },
  };
}

/**
 * Prepare data structure for Google Sheets export
 */
function prepareSheetsExport(exportData: any): any {
  const sheets = buildSheets(exportData.data);

  return {
    ...exportData,
    exportType: "sheets",
    structure: {
      sheets,
      formatting: {
        headerRow: true,
        freezeFirstRow: true,
        autoFilter: true,
      },
    },
  };
}

/**
 * Build report sections from combined data
 */
function buildReportSections(data: any): any[] {
  const sections: any[] = [];

  // Executive Summary section
  if (data.summary || data.content) {
    sections.push({
      type: "text",
      title: "Yönetici Özeti",
      content: data.summary || data.content,
    });
  }

  // Key Findings section
  if (data.keyFindings && data.keyFindings.length > 0) {
    sections.push({
      type: "list",
      title: "Önemli Bulgular",
      items: data.keyFindings,
    });
  }

  // Ads Data section
  if (data.adsData) {
    sections.push({
      type: "metrics",
      title: "Google Ads Performansı",
      data: data.adsData.metrics || data.adsData,
    });

    if (data.adsData.campaigns) {
      sections.push({
        type: "table",
        title: "Kampanya Performansı",
        columns: ["Kampanya", "Gösterim", "Tıklama", "Maliyet", "Dönüşüm"],
        rows: data.adsData.campaigns.map((c: any) => [
          c.name,
          c.impressions,
          c.clicks,
          `₺${c.cost.toFixed(2)}`,
          c.conversions,
        ]),
      });
    }
  }

  // Analytics Data section
  if (data.analyticsData) {
    sections.push({
      type: "metrics",
      title: "Web Sitesi Trafiği",
      data: data.analyticsData.overview || data.analyticsData,
    });
  }

  // Search Console Data section
  if (data.searchConsoleData) {
    sections.push({
      type: "metrics",
      title: "SEO Performansı",
      data: data.searchConsoleData.overview || data.searchConsoleData,
    });

    if (data.searchConsoleData.topQueries) {
      sections.push({
        type: "table",
        title: "En İyi Arama Sorguları",
        columns: ["Sorgu", "Tıklama", "Gösterim", "CTR", "Pozisyon"],
        rows: data.searchConsoleData.topQueries.slice(0, 10).map((q: any) => [
          q.keys?.[0] || q.query,
          q.clicks,
          q.impressions,
          `${q.ctr.toFixed(2)}%`,
          q.position.toFixed(1),
        ]),
      });
    }
  }

  // Recommendations section
  if (data.recommendations && data.recommendations.length > 0) {
    sections.push({
      type: "list",
      title: "Öneriler",
      items: data.recommendations,
    });
  }

  // Trends section
  if (data.trends && data.trends.length > 0) {
    sections.push({
      type: "list",
      title: "Trendler",
      items: data.trends,
    });
  }

  return sections;
}

/**
 * Build slides from combined data
 */
function buildSlides(data: any): any[] {
  const slides: any[] = [];

  // Title slide
  slides.push({
    type: "title",
    title: "Dijital Pazarlama Raporu",
    subtitle: `${data.dateRange?.startDate || ""} - ${data.dateRange?.endDate || ""}`,
  });

  // Executive Summary slide
  if (data.summary || data.content) {
    slides.push({
      type: "text",
      title: "Yönetici Özeti",
      content: data.summary || data.content,
    });
  }

  // Key Metrics slide
  if (data.adsData || data.analyticsData) {
    const metrics: any[] = [];

    if (data.adsData?.metrics) {
      metrics.push(
        { label: "Reklam Harcaması", value: `₺${data.adsData.metrics.cost?.toFixed(0) || 0}` },
        { label: "Dönüşümler", value: data.adsData.metrics.conversions || 0 },
        { label: "ROAS", value: data.adsData.metrics.conversionValue ?
          (data.adsData.metrics.conversionValue / data.adsData.metrics.cost).toFixed(2) : "N/A" }
      );
    }

    if (data.analyticsData?.overview?.rows?.[0]) {
      const row = data.analyticsData.overview.rows[0];
      const sessions = row.metrics?.find((m: any) => m.name === "sessions")?.value;
      const users = row.metrics?.find((m: any) => m.name === "totalUsers")?.value;
      if (sessions) metrics.push({ label: "Oturumlar", value: sessions });
      if (users) metrics.push({ label: "Kullanıcılar", value: users });
    }

    if (metrics.length > 0) {
      slides.push({
        type: "metrics",
        title: "Temel Metrikler",
        metrics,
      });
    }
  }

  // Campaign Performance slide
  if (data.adsData?.campaigns) {
    slides.push({
      type: "chart",
      title: "Kampanya Performansı",
      chartType: "bar",
      data: data.adsData.campaigns.map((c: any) => ({
        label: c.name,
        value: c.conversions,
      })),
    });
  }

  // SEO Performance slide
  if (data.searchConsoleData?.overview) {
    slides.push({
      type: "metrics",
      title: "SEO Performansı",
      metrics: [
        { label: "Organik Tıklamalar", value: data.searchConsoleData.overview.clicks },
        { label: "Gösterimler", value: data.searchConsoleData.overview.impressions },
        { label: "Ortalama CTR", value: `${data.searchConsoleData.overview.ctr?.toFixed(2)}%` },
        { label: "Ortalama Pozisyon", value: data.searchConsoleData.overview.position?.toFixed(1) },
      ],
    });
  }

  // Recommendations slide
  if (data.recommendations && data.recommendations.length > 0) {
    slides.push({
      type: "bullets",
      title: "Öneriler",
      items: data.recommendations.slice(0, 5),
    });
  }

  // Thank you slide
  slides.push({
    type: "closing",
    title: "Teşekkürler",
    subtitle: "MarkaRapor ile oluşturuldu",
  });

  return slides;
}

/**
 * Build sheets from combined data
 */
function buildSheets(data: any): any[] {
  const sheets: any[] = [];

  // Overview sheet
  sheets.push({
    name: "Özet",
    type: "summary",
    data: {
      dateRange: data.dateRange,
      summary: data.summary,
      keyFindings: data.keyFindings,
    },
  });

  // Ads Data sheet
  if (data.adsData?.campaigns) {
    sheets.push({
      name: "Google Ads",
      type: "table",
      headers: ["Kampanya", "Gösterim", "Tıklama", "Maliyet", "Dönüşüm", "CTR", "CPC"],
      rows: data.adsData.campaigns.map((c: any) => [
        c.name,
        c.impressions,
        c.clicks,
        c.cost,
        c.conversions,
        c.clicks > 0 ? ((c.clicks / c.impressions) * 100).toFixed(2) : 0,
        c.clicks > 0 ? (c.cost / c.clicks).toFixed(2) : 0,
      ]),
    });
  }

  // Search Console Data sheet
  if (data.searchConsoleData?.topQueries) {
    sheets.push({
      name: "Arama Sorguları",
      type: "table",
      headers: ["Sorgu", "Tıklama", "Gösterim", "CTR", "Pozisyon"],
      rows: data.searchConsoleData.topQueries.map((q: any) => [
        q.keys?.[0] || q.query,
        q.clicks,
        q.impressions,
        q.ctr,
        q.position,
      ]),
    });
  }

  return sheets;
}
