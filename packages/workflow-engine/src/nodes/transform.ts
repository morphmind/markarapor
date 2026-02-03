import type { WorkflowNode, WorkflowContext, TransformConfig } from "../types";

/**
 * Execute a transform node
 */
export async function executeTransformNode(
  node: WorkflowNode,
  _context: WorkflowContext,
  inputs: Record<string, any>
): Promise<any> {
  const config = node.config as TransformConfig;

  switch (config.operation) {
    case "merge":
      return executeMerge(inputs, config.params);

    case "filter":
      return executeFilter(inputs, config.params);

    case "aggregate":
      return executeAggregate(inputs, config.params);

    case "calculate":
      return executeCalculate(inputs, config.params);

    default:
      throw new Error(`Unknown transform operation: ${config.operation}`);
  }
}

/**
 * Merge multiple data sources into one
 */
function executeMerge(
  inputs: Record<string, any>,
  _params: Record<string, any>
): any {
  const merged: Record<string, any> = {
    mergedAt: new Date().toISOString(),
    sources: [],
  };

  for (const [key, value] of Object.entries(inputs)) {
    if (value && typeof value === "object") {
      // Track source
      if (value.source) {
        merged.sources.push(value.source);
      }

      // Merge data
      if (value.source === "google-ads") {
        merged.adsData = value;
      } else if (value.source === "google-analytics") {
        merged.analyticsData = value;
      } else if (value.source === "search-console") {
        merged.searchConsoleData = value;
      } else {
        // Generic merge
        merged[key] = value;
      }
    }
  }

  return merged;
}

/**
 * Filter data based on conditions
 */
function executeFilter(
  inputs: Record<string, any>,
  params: Record<string, any>
): any {
  const { field, operator, value } = params;

  const inputData = Object.values(inputs)[0];
  if (!inputData) return null;

  // If filtering an array
  if (Array.isArray(inputData)) {
    return inputData.filter((item) => {
      const fieldValue = item[field];
      switch (operator) {
        case "equals":
          return fieldValue === value;
        case "notEquals":
          return fieldValue !== value;
        case "gt":
          return fieldValue > value;
        case "gte":
          return fieldValue >= value;
        case "lt":
          return fieldValue < value;
        case "lte":
          return fieldValue <= value;
        case "contains":
          return String(fieldValue).includes(value);
        default:
          return true;
      }
    });
  }

  // If filtering object fields
  if (typeof inputData === "object") {
    const result: Record<string, any> = {};
    for (const [key, val] of Object.entries(inputData)) {
      if (Array.isArray(val)) {
        result[key] = val.filter((item: any) => {
          if (typeof item !== "object") return true;
          const fieldValue = item[field];
          switch (operator) {
            case "equals":
              return fieldValue === value;
            case "gt":
              return fieldValue > value;
            case "gte":
              return fieldValue >= value;
            case "lt":
              return fieldValue < value;
            case "lte":
              return fieldValue <= value;
            default:
              return true;
          }
        });
      } else {
        result[key] = val;
      }
    }
    return result;
  }

  return inputData;
}

/**
 * Aggregate data with sum, avg, count, etc.
 */
function executeAggregate(
  inputs: Record<string, any>,
  params: Record<string, any>
): any {
  const { groupBy, aggregations } = params;

  const inputData = Object.values(inputs)[0];
  if (!inputData || !Array.isArray(inputData)) {
    return inputData;
  }

  if (!groupBy) {
    // Aggregate entire array
    const result: Record<string, number> = {};

    for (const agg of aggregations || []) {
      const { field, operation, alias } = agg;
      const values = inputData.map((item) => Number(item[field]) || 0);

      switch (operation) {
        case "sum":
          result[alias || field] = values.reduce((a, b) => a + b, 0);
          break;
        case "avg":
          result[alias || field] =
            values.length > 0
              ? values.reduce((a, b) => a + b, 0) / values.length
              : 0;
          break;
        case "min":
          result[alias || field] = Math.min(...values);
          break;
        case "max":
          result[alias || field] = Math.max(...values);
          break;
        case "count":
          result[alias || field] = values.length;
          break;
      }
    }

    return result;
  }

  // Group by field
  const groups = new Map<string, any[]>();

  for (const item of inputData) {
    const key = String(item[groupBy]);
    const group = groups.get(key) || [];
    group.push(item);
    groups.set(key, group);
  }

  const result: any[] = [];

  for (const [key, items] of groups) {
    const row: Record<string, any> = { [groupBy]: key };

    for (const agg of aggregations || []) {
      const { field, operation, alias } = agg;
      const values = items.map((item) => Number(item[field]) || 0);

      switch (operation) {
        case "sum":
          row[alias || field] = values.reduce((a, b) => a + b, 0);
          break;
        case "avg":
          row[alias || field] =
            values.length > 0
              ? values.reduce((a, b) => a + b, 0) / values.length
              : 0;
          break;
        case "count":
          row[alias || field] = values.length;
          break;
      }
    }

    result.push(row);
  }

  return result;
}

/**
 * Safe calculation operations without eval
 */
type CalculationOperation = "add" | "subtract" | "multiply" | "divide" | "percentage";

interface CalculationDef {
  operation: CalculationOperation;
  fields: string[];
  alias: string;
}

/**
 * Calculate derived fields using predefined safe operations
 */
function executeCalculate(
  inputs: Record<string, any>,
  params: Record<string, any>
): any {
  const { calculations } = params as { calculations: CalculationDef[] };
  const inputData = Object.values(inputs)[0];

  if (!inputData || typeof inputData !== "object") {
    return inputData;
  }

  const result = { ...inputData };

  for (const calc of calculations || []) {
    const { operation, fields, alias } = calc;

    // Get field values
    const values = fields.map((f) => {
      const val = result[f] ?? inputData[f];
      return typeof val === "number" ? val : parseFloat(val) || 0;
    });

    // Apply safe operation
    switch (operation) {
      case "add":
        result[alias] = values.reduce((a, b) => a + b, 0);
        break;
      case "subtract":
        result[alias] = values.length > 0 ? values.slice(1).reduce((a, b) => a - b, values[0]) : 0;
        break;
      case "multiply":
        result[alias] = values.reduce((a, b) => a * b, 1);
        break;
      case "divide":
        result[alias] = values.length >= 2 && values[1] !== 0 ? values[0] / values[1] : 0;
        break;
      case "percentage":
        result[alias] = values.length >= 2 && values[1] !== 0 ? (values[0] / values[1]) * 100 : 0;
        break;
      default:
        result[alias] = null;
    }
  }

  return result;
}
