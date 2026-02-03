import type {
  WorkflowDefinition,
  WorkflowContext,
  WorkflowNode,
  WorkflowEdge,
  NodeExecutionResult,
  WorkflowRunResult,
} from "../types";

import { executeDataSourceNode } from "../nodes/data-source";
import { executeAIAnalysisNode } from "../nodes/ai-analysis";
import { executeTransformNode } from "../nodes/transform";
import { executeExportNode } from "../nodes/export";

type NodeExecutor = (
  node: WorkflowNode,
  context: WorkflowContext,
  inputs: Record<string, any>
) => Promise<any>;

const nodeExecutors: Record<string, NodeExecutor> = {
  "data-source": executeDataSourceNode,
  "ai-analysis": executeAIAnalysisNode,
  transform: executeTransformNode,
  export: executeExportNode,
};

/**
 * Topologically sort nodes based on edges
 */
function topologicalSort(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[]
): WorkflowNode[] {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const inDegree = new Map<string, number>();
  const adjacency = new Map<string, string[]>();

  // Initialize
  for (const node of nodes) {
    inDegree.set(node.id, 0);
    adjacency.set(node.id, []);
  }

  // Build adjacency list and count in-degrees
  for (const edge of edges) {
    const targets = adjacency.get(edge.source) || [];
    targets.push(edge.target);
    adjacency.set(edge.source, targets);
    inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
  }

  // Kahn's algorithm
  const queue: string[] = [];
  const sorted: WorkflowNode[] = [];

  // Start with nodes that have no dependencies
  for (const [nodeId, degree] of inDegree) {
    if (degree === 0) {
      queue.push(nodeId);
    }
  }

  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    const node = nodeMap.get(nodeId);
    if (node) {
      sorted.push(node);
    }

    for (const targetId of adjacency.get(nodeId) || []) {
      const newDegree = (inDegree.get(targetId) || 0) - 1;
      inDegree.set(targetId, newDegree);
      if (newDegree === 0) {
        queue.push(targetId);
      }
    }
  }

  return sorted;
}

/**
 * Get input nodes for a given node
 */
function getInputNodes(nodeId: string, edges: WorkflowEdge[]): string[] {
  return edges.filter((e) => e.target === nodeId).map((e) => e.source);
}

/**
 * Calculate credits used based on node types
 */
function calculateCredits(results: NodeExecutionResult[]): number {
  let credits = 0;

  for (const result of results) {
    if (result.status === "success") {
      // Base credit per successful node
      credits += 1;

      // AI nodes cost more
      if (result.nodeId.includes("ai")) {
        credits += 4; // Total 5 credits for AI
      }

      // Export nodes cost more
      if (result.nodeId.includes("export")) {
        credits += 2; // Total 3 credits for export
      }
    }
  }

  return credits;
}

/**
 * Main workflow executor
 */
export class WorkflowExecutor {
  private definition: WorkflowDefinition;
  private context: WorkflowContext;
  private nodeOutputs: Map<string, any>;
  private results: NodeExecutionResult[];

  constructor(definition: WorkflowDefinition, context: WorkflowContext) {
    this.definition = definition;
    this.context = context;
    this.nodeOutputs = new Map();
    this.results = [];
  }

  /**
   * Execute the entire workflow
   */
  async execute(): Promise<WorkflowRunResult> {
    const startTime = Date.now();

    try {
      // Sort nodes topologically
      const sortedNodes = topologicalSort(
        this.definition.nodes,
        this.definition.edges
      );

      // Execute nodes in order
      for (const node of sortedNodes) {
        const result = await this.executeNode(node);
        this.results.push(result);

        // Stop on error if not a skippable node
        if (result.status === "error" && node.type !== "notification") {
          break;
        }
      }

      // Determine final status
      const hasErrors = this.results.some((r) => r.status === "error");
      const allSkipped = this.results.every((r) => r.status === "skipped");

      let status: WorkflowRunResult["status"];
      if (allSkipped) {
        status = "failed";
      } else if (hasErrors) {
        status = "partial";
      } else {
        status = "completed";
      }

      // Get final output (from last export node or last successful node)
      const exportResults = this.results.filter(
        (r) => r.nodeId.includes("export") && r.status === "success"
      );
      const finalOutput =
        exportResults.length > 0
          ? exportResults[exportResults.length - 1].output
          : this.results.filter((r) => r.status === "success").pop()?.output;

      return {
        runId: this.context.runId,
        workflowId: this.context.workflowId,
        status,
        nodeResults: this.results,
        finalOutput,
        totalExecutionTime: Date.now() - startTime,
        creditsUsed: calculateCredits(this.results),
        startedAt: new Date(startTime),
        completedAt: new Date(),
      };
    } catch (error) {
      return {
        runId: this.context.runId,
        workflowId: this.context.workflowId,
        status: "failed",
        nodeResults: this.results,
        totalExecutionTime: Date.now() - startTime,
        creditsUsed: calculateCredits(this.results),
        startedAt: new Date(startTime),
        completedAt: new Date(),
      };
    }
  }

  /**
   * Execute a single node
   */
  private async executeNode(node: WorkflowNode): Promise<NodeExecutionResult> {
    const startTime = Date.now();

    try {
      // Get inputs from connected nodes
      const inputNodeIds = getInputNodes(node.id, this.definition.edges);
      const inputs: Record<string, any> = {};

      for (const inputId of inputNodeIds) {
        const output = this.nodeOutputs.get(inputId);
        if (output !== undefined) {
          inputs[inputId] = output;
        }
      }

      // Check if we have required inputs
      if (
        node.type !== "trigger" &&
        node.type !== "data-source" &&
        inputNodeIds.length > 0 &&
        Object.keys(inputs).length === 0
      ) {
        return {
          nodeId: node.id,
          status: "skipped",
          error: "No inputs available",
          executionTime: Date.now() - startTime,
        };
      }

      // Get executor for node type
      const executor = nodeExecutors[node.type];
      if (!executor) {
        // Skip unknown node types (like trigger which is just a marker)
        if (node.type === "trigger") {
          return {
            nodeId: node.id,
            status: "success",
            output: {},
            executionTime: Date.now() - startTime,
          };
        }

        return {
          nodeId: node.id,
          status: "error",
          error: `Unknown node type: ${node.type}`,
          executionTime: Date.now() - startTime,
        };
      }

      // Execute the node
      const output = await executor(node, this.context, inputs);

      // Store output for downstream nodes
      this.nodeOutputs.set(node.id, output);

      return {
        nodeId: node.id,
        status: "success",
        output,
        executionTime: Date.now() - startTime,
      };
    } catch (error) {
      return {
        nodeId: node.id,
        status: "error",
        error: error instanceof Error ? error.message : String(error),
        executionTime: Date.now() - startTime,
      };
    }
  }
}
