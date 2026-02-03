import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  BorderStyle,
  WidthType,
  AlignmentType,
} from "docx";

// Types
interface ReportSection {
  type: "text" | "list" | "metrics" | "table";
  title: string;
  content?: string;
  items?: string[];
  data?: Record<string, any>;
  columns?: string[];
  rows?: any[][];
}

interface DOCXReportData {
  title?: string;
  dateRange?: { startDate: string; endDate: string };
  brandName?: string;
  sections: ReportSection[];
}

/**
 * Generate DOCX buffer from report data
 */
export async function generateDOCX(data: DOCXReportData): Promise<Buffer> {
  const children: any[] = [];

  // Title
  children.push(
    new Paragraph({
      text: data.title || "Dijital Pazarlama Raporu",
      heading: HeadingLevel.TITLE,
      spacing: { after: 200 },
    })
  );

  // Subtitle with date range and brand
  const subtitleParts: string[] = [];
  if (data.brandName) subtitleParts.push(data.brandName);
  if (data.dateRange) {
    subtitleParts.push(`${data.dateRange.startDate} - ${data.dateRange.endDate}`);
  }

  if (subtitleParts.length > 0) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: subtitleParts.join(" • "),
            color: "666666",
            size: 24,
          }),
        ],
        spacing: { after: 400 },
      })
    );
  }

  // Sections
  for (const section of data.sections) {
    // Section title
    children.push(
      new Paragraph({
        text: section.title,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
      })
    );

    // Section content based on type
    switch (section.type) {
      case "text":
        if (section.content) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: section.content,
                  size: 22,
                }),
              ],
              spacing: { after: 200 },
            })
          );
        }
        break;

      case "list":
        if (section.items) {
          for (const item of section.items) {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: `• ${item}`,
                    size: 22,
                  }),
                ],
                spacing: { after: 100 },
              })
            );
          }
        }
        break;

      case "metrics":
        if (section.data) {
          const metricsTable = createMetricsTable(section.data);
          children.push(metricsTable);
        }
        break;

      case "table":
        if (section.columns && section.rows) {
          const table = createTable(section.columns, section.rows);
          children.push(table);
        }
        break;
    }
  }

  // Footer
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `MarkaRapor ile oluşturuldu • ${new Date().toLocaleDateString("tr-TR")}`,
          color: "999999",
          size: 18,
        }),
      ],
      spacing: { before: 400 },
      alignment: AlignmentType.CENTER,
    })
  );

  // Create document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  // Generate buffer
  const buffer = await Packer.toBuffer(doc);
  return Buffer.from(buffer);
}

/**
 * Create a metrics table
 */
function createMetricsTable(data: Record<string, any>): Table {
  const entries = Object.entries(data).filter(
    ([key]) =>
      !["source", "dateRange", "customerId", "propertyId", "siteUrl"].includes(key) &&
      typeof data[key] !== "object"
  );

  const rows: TableRow[] = [];

  // Create rows with 2 metrics per row
  for (let i = 0; i < entries.length; i += 2) {
    const cells: TableCell[] = [];

    // First metric
    const [key1, value1] = entries[i];
    cells.push(
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: formatMetricName(key1), color: "666666", size: 18 }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: formatMetricValue(key1, value1),
                bold: true,
                size: 28,
              }),
            ],
          }),
        ],
        width: { size: 50, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" },
          bottom: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" },
          left: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" },
          right: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" },
        },
      })
    );

    // Second metric (if exists)
    if (i + 1 < entries.length) {
      const [key2, value2] = entries[i + 1];
      cells.push(
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: formatMetricName(key2), color: "666666", size: 18 }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: formatMetricValue(key2, value2),
                  bold: true,
                  size: 28,
                }),
              ],
            }),
          ],
          width: { size: 50, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" },
            left: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" },
            right: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" },
          },
        })
      );
    }

    rows.push(new TableRow({ children: cells }));
  }

  return new Table({
    rows,
    width: { size: 100, type: WidthType.PERCENTAGE },
  });
}

/**
 * Create a data table
 */
function createTable(columns: string[], rows: any[][]): Table {
  const tableRows: TableRow[] = [];

  // Header row
  tableRows.push(
    new TableRow({
      children: columns.map(
        (col) =>
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: col, bold: true, size: 20 })],
              }),
            ],
            shading: { fill: "F3F4F6" },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" },
              left: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" },
              right: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" },
            },
          })
      ),
    })
  );

  // Data rows
  for (const row of rows) {
    tableRows.push(
      new TableRow({
        children: row.map(
          (cell) =>
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: String(cell), size: 20 })],
                }),
              ],
              borders: {
                top: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" },
                bottom: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" },
                left: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" },
                right: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" },
              },
            })
        ),
      })
    );
  }

  return new Table({
    rows: tableRows,
    width: { size: 100, type: WidthType.PERCENTAGE },
  });
}

// Helper functions
function formatMetricName(key: string): string {
  const names: Record<string, string> = {
    impressions: "Gösterimler",
    clicks: "Tıklamalar",
    cost: "Maliyet",
    conversions: "Dönüşümler",
    conversionValue: "Dönüşüm Değeri",
    ctr: "Tıklama Oranı",
    averageCpc: "Ortalama TBM",
    costPerConversion: "Dönüşüm Başına Maliyet",
    sessions: "Oturumlar",
    totalUsers: "Kullanıcılar",
    newUsers: "Yeni Kullanıcılar",
    bounceRate: "Hemen Çıkma Oranı",
    averageSessionDuration: "Ort. Oturum Süresi",
    position: "Ortalama Pozisyon",
  };

  return (
    names[key] ||
    key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim()
  );
}

function formatMetricValue(key: string, value: any): string {
  if (typeof value !== "number") return String(value);

  if (key.includes("cost") || key.includes("Cost") || key === "cost") {
    return `₺${value.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}`;
  }

  if (key.includes("rate") || key.includes("Rate") || key === "ctr") {
    return `${value.toFixed(2)}%`;
  }

  if (key === "position") {
    return value.toFixed(1);
  }

  return value.toLocaleString("tr-TR");
}

export type { DOCXReportData, ReportSection };
