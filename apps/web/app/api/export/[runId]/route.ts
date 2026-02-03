import { NextRequest, NextResponse } from "next/server";
import { auth } from "~/lib/auth";
import { prisma } from "@markarapor/database";
import { generatePDF } from "@markarapor/export";

// Force dynamic to avoid static generation issues
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ runId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { runId } = await params;
    const format = request.nextUrl.searchParams.get("format") || "pdf";

    // Get run with workflow and brand info
    const run = await prisma.workflowRun.findUnique({
      where: { id: runId },
      include: {
        workflow: {
          include: {
            brand: {
              include: { workspace: true },
            },
          },
        },
      },
    });

    if (!run) {
      return NextResponse.json({ error: "Run not found" }, { status: 404 });
    }

    // Check access
    const member = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId: run.workflow.brand.workspaceId,
        userId: session.user.id,
      },
    });

    if (!member) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (run.status !== "COMPLETED") {
      return NextResponse.json(
        { error: "Run not completed" },
        { status: 400 }
      );
    }

    // Parse node results
    const nodeResults = (run.nodeResults as Record<string, unknown>) || {};

    // Build report data
    const sections = buildReportSections(nodeResults);

    // Generate PDF
    if (format === "pdf") {
      const startDate = run.startedAt
        ? new Date(run.startedAt).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];
      const endDate = run.completedAt
        ? new Date(run.completedAt).toISOString().split("T")[0]
        : startDate;

      const pdfBuffer = await generatePDF({
        title: run.workflow.name,
        brandName: run.workflow.brand.name,
        dateRange: { startDate, endDate },
        sections,
      });

      const safeName = run.workflow.name.replace(/[^a-z0-9]/gi, "_");

      return new NextResponse(new Uint8Array(pdfBuffer), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${safeName}_${run.id.slice(0, 8)}.pdf"`,
          "Cache-Control": "no-store",
        },
      });
    }

    // For DOCX (placeholder)
    return NextResponse.json(
      { error: "Format not supported yet" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Export failed", details: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    );
  }
}

/**
 * Build report sections from workflow node results
 */
function buildReportSections(
  nodeResults: Record<string, unknown>
): Array<{
  type: "text" | "list" | "metrics" | "table";
  title: string;
  content?: string;
  items?: string[];
  data?: Record<string, unknown>;
  columns?: string[];
  rows?: unknown[][];
}> {
  const sections: Array<{
    type: "text" | "list" | "metrics" | "table";
    title: string;
    content?: string;
    items?: string[];
    data?: Record<string, unknown>;
    columns?: string[];
    rows?: unknown[][];
  }> = [];

  for (const [, result] of Object.entries(nodeResults)) {
    const nodeResult = result as Record<string, unknown>;

    if (nodeResult.error) {
      continue;
    }

    const nodeType = (nodeResult as { type?: string }).type;

    // Data source metrics
    if (
      nodeType === "analytics" ||
      nodeType === "ads" ||
      nodeType === "search-console"
    ) {
      const rawData = (nodeResult as { data?: Record<string, unknown> }).data;
      if (!rawData) continue;

      const titleMap: Record<string, string> = {
        analytics: "Google Analytics Verileri",
        ads: "Google Ads Verileri",
        "search-console": "Search Console Verileri",
      };

      // Add overview metrics
      if (nodeType === "search-console") {
        const overview = (rawData as { overview?: Record<string, unknown> })
          .overview;
        if (overview) {
          sections.push({
            type: "metrics",
            title: "SEO Performans Genel Bakış",
            data: overview,
          });
        }

        // Add top queries as table
        const topQueries = (
          rawData as {
            topQueries?: Array<{
              keys?: string[];
              clicks: number;
              impressions: number;
              ctr: number;
              position: number;
            }>;
          }
        ).topQueries;
        if (topQueries && topQueries.length > 0) {
          sections.push({
            type: "table",
            title: "En İyi Arama Sorguları",
            columns: ["Sorgu", "Tıklama", "Gösterim", "TO%", "Pozisyon"],
            rows: topQueries.slice(0, 20).map((q) => [
              q.keys?.[0] || "",
              q.clicks,
              q.impressions,
              `${(q.ctr * 100).toFixed(1)}%`,
              q.position.toFixed(1),
            ]),
          });
        }

        // Add top pages as table
        const topPages = (
          rawData as {
            topPages?: Array<{
              keys?: string[];
              clicks: number;
              impressions: number;
              ctr: number;
              position: number;
            }>;
          }
        ).topPages;
        if (topPages && topPages.length > 0) {
          sections.push({
            type: "table",
            title: "En İyi Sayfalar",
            columns: ["Sayfa", "Tıklama", "Gösterim", "TO%", "Pozisyon"],
            rows: topPages.slice(0, 20).map((p) => [
              p.keys?.[0] || "",
              p.clicks,
              p.impressions,
              `${(p.ctr * 100).toFixed(1)}%`,
              p.position.toFixed(1),
            ]),
          });
        }

        // Device breakdown
        const deviceBreakdown = (
          rawData as {
            deviceBreakdown?: Array<{
              keys?: string[];
              clicks: number;
              impressions: number;
            }>;
          }
        ).deviceBreakdown;
        if (deviceBreakdown && deviceBreakdown.length > 0) {
          sections.push({
            type: "table",
            title: "Cihaz Analizi",
            columns: ["Cihaz", "Tıklama", "Gösterim"],
            rows: deviceBreakdown.map((d) => [
              d.keys?.[0] || "",
              d.clicks,
              d.impressions,
            ]),
          });
        }

        // Country breakdown
        const countryBreakdown = (
          rawData as {
            countryBreakdown?: Array<{
              keys?: string[];
              clicks: number;
              impressions: number;
            }>;
          }
        ).countryBreakdown;
        if (countryBreakdown && countryBreakdown.length > 0) {
          sections.push({
            type: "table",
            title: "Ülke Analizi",
            columns: ["Ülke", "Tıklama", "Gösterim"],
            rows: countryBreakdown.slice(0, 15).map((c) => [
              c.keys?.[0] || "",
              c.clicks,
              c.impressions,
            ]),
          });
        }
      } else {
        // Analytics or Ads - show as general metrics
        sections.push({
          type: "metrics",
          title: titleMap[nodeType] || "Veriler",
          data: rawData,
        });
      }
    }

    // AI analysis results
    if (nodeResult.summary) {
      sections.push({
        type: "text",
        title: "Yönetici Özeti",
        content: nodeResult.summary as string,
      });
    }

    if (nodeResult.keyFindings && Array.isArray(nodeResult.keyFindings)) {
      sections.push({
        type: "list",
        title: "Önemli Bulgular",
        items: nodeResult.keyFindings as string[],
      });
    }

    if (
      nodeResult.recommendations &&
      Array.isArray(nodeResult.recommendations)
    ) {
      sections.push({
        type: "list",
        title: "Öneriler",
        items: nodeResult.recommendations as string[],
      });
    }

    if (nodeResult.quickWins && Array.isArray(nodeResult.quickWins)) {
      sections.push({
        type: "list",
        title: "Hızlı Kazanımlar",
        items: nodeResult.quickWins as string[],
      });
    }

    if (
      nodeResult.longTermStrategies &&
      Array.isArray(nodeResult.longTermStrategies)
    ) {
      sections.push({
        type: "list",
        title: "Uzun Vadeli Stratejiler",
        items: nodeResult.longTermStrategies as string[],
      });
    }

    // Handle merged data (transform nodes)
    if (nodeResult.merged && Array.isArray(nodeResult.merged)) {
      // Skip - merged data is used by downstream AI nodes
    }
  }

  // If no sections, add a default message
  if (sections.length === 0) {
    sections.push({
      type: "text",
      title: "Rapor",
      content: "Bu çalıştırma için detaylı sonuç bulunamadı.",
    });
  }

  return sections;
}
