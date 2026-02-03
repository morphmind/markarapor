import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
  },
  header: {
    marginBottom: 20,
    borderBottom: "1 solid #e5e7eb",
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: "#6b7280",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 10,
    paddingBottom: 5,
    borderBottom: "1 solid #e5e7eb",
  },
  text: {
    fontSize: 10,
    color: "#4b5563",
    lineHeight: 1.5,
    marginBottom: 10,
  },
  listItem: {
    fontSize: 10,
    color: "#4b5563",
    marginBottom: 5,
    paddingLeft: 10,
  },
  bullet: {
    width: 5,
    marginRight: 5,
  },
  metricsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  metricBox: {
    width: "48%",
    marginRight: "2%",
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f9fafb",
    borderRadius: 4,
  },
  metricLabel: {
    fontSize: 8,
    color: "#6b7280",
    marginBottom: 3,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
  },
  table: {
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1 solid #e5e7eb",
    paddingVertical: 8,
  },
  tableHeader: {
    backgroundColor: "#f3f4f6",
    fontWeight: "bold",
  },
  tableCell: {
    flex: 1,
    fontSize: 9,
    color: "#374151",
    paddingHorizontal: 5,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#9ca3af",
    borderTop: "1 solid #e5e7eb",
    paddingTop: 10,
  },
});

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

interface PDFReportData {
  title?: string;
  dateRange?: { startDate: string; endDate: string };
  brandName?: string;
  sections: ReportSection[];
}

// Components
const MetricsSection: React.FC<{ data: Record<string, any> }> = ({ data }) => {
  const entries = Object.entries(data).filter(
    ([key]) => !["source", "dateRange", "customerId", "propertyId", "siteUrl"].includes(key)
  );

  return (
    <View style={styles.metricsContainer}>
      {entries.slice(0, 6).map(([key, value], idx) => (
        <View key={idx} style={styles.metricBox}>
          <Text style={styles.metricLabel}>{formatMetricName(key)}</Text>
          <Text style={styles.metricValue}>{formatMetricValue(key, value)}</Text>
        </View>
      ))}
    </View>
  );
};

const TableSection: React.FC<{ columns: string[]; rows: any[][] }> = ({
  columns,
  rows,
}) => (
  <View style={styles.table}>
    <View style={[styles.tableRow, styles.tableHeader]}>
      {columns.map((col, idx) => (
        <Text key={idx} style={styles.tableCell}>
          {col}
        </Text>
      ))}
    </View>
    {rows.map((row, rowIdx) => (
      <View key={rowIdx} style={styles.tableRow}>
        {row.map((cell, cellIdx) => (
          <Text key={cellIdx} style={styles.tableCell}>
            {String(cell)}
          </Text>
        ))}
      </View>
    ))}
  </View>
);

// Main PDF Document
const PDFReport: React.FC<{ data: PDFReportData }> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {data.title || "Dijital Pazarlama Raporu"}
        </Text>
        <Text style={styles.subtitle}>
          {data.brandName ? `${data.brandName} • ` : ""}
          {data.dateRange
            ? `${data.dateRange.startDate} - ${data.dateRange.endDate}`
            : new Date().toLocaleDateString("tr-TR")}
        </Text>
      </View>

      {/* Sections */}
      {data.sections.map((section, idx) => (
        <View key={idx} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>

          {section.type === "text" && section.content && (
            <Text style={styles.text}>{section.content}</Text>
          )}

          {section.type === "list" && section.items && (
            <View>
              {section.items.map((item, itemIdx) => (
                <View key={itemIdx} style={{ flexDirection: "row" }}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.listItem}>{item}</Text>
                </View>
              ))}
            </View>
          )}

          {section.type === "metrics" && section.data && (
            <MetricsSection data={section.data} />
          )}

          {section.type === "table" && section.columns && section.rows && (
            <TableSection columns={section.columns} rows={section.rows} />
          )}
        </View>
      ))}

      {/* Footer */}
      <Text style={styles.footer}>
        MarkaRapor ile oluşturuldu • {new Date().toLocaleDateString("tr-TR")}
      </Text>
    </Page>
  </Document>
);

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

  if (key.includes("duration") || key.includes("Duration")) {
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  return value.toLocaleString("tr-TR");
}

/**
 * Generate PDF buffer from report data
 */
export async function generatePDF(data: PDFReportData): Promise<Buffer> {
  const buffer = await renderToBuffer(<PDFReport data={data} />);
  return Buffer.from(buffer);
}

/**
 * Export types
 */
export type { PDFReportData, ReportSection };
