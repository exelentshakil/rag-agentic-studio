"use client";

import React, { useState } from "react";
import { 
  Workflow, 
  Webhook, 
  Bot, 
  BarChart3, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Cpu, 
  Database, 
  ShieldCheck, 
  Layers, 
  Code2, 
  RefreshCw, 
  Send, 
  Fingerprint, 
  Key, 
  Server, 
  Sparkles,
  ArrowRight,
  Sliders,
  Terminal,
  FileJson,
  Zap
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer 
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

// --- Types & Data ---

interface WorkflowStep {
  id: string;
  name: string;
  type: "trigger" | "validator" | "agent_parallel" | "compiler_gate" | "retry_handler" | "commit";
  status: "idle" | "running" | "completed" | "failed";
  durationMs: number;
  output: Record<string, unknown>;
  description: string;
}

const INITIAL_STEPS: WorkflowStep[] = [
  {
    id: "step-1",
    name: "01. Webhook Intake & HMAC",
    type: "trigger",
    status: "completed",
    durationMs: 14,
    description: "Verifies HMAC-SHA256 signature and unpacks CloudEvent payload.",
    output: {
      event: "erp.order_placed",
      tenantId: "8f41c9b2-3e21-4820-a0f1-92b4512e99d1",
      signatureValid: true,
      timestamp: "2026-09-15T14:32:01.402Z",
    },
  },
  {
    id: "step-2",
    name: "02. Zod AST Schema Check",
    type: "validator",
    status: "completed",
    durationMs: 22,
    description: "Validates JSON schema, tenant isolation parameters, and double-entry invariants.",
    output: {
      schemaValid: true,
      isolationKey: "TENANT_ACCOUNTING_SCOPE",
      lineItemsCount: 4,
      netBalance: 12450.0,
    },
  },
  {
    id: "step-3",
    name: "03. 3-Agent Parallel Consensus",
    type: "agent_parallel",
    status: "completed",
    durationMs: 148,
    description: "Concurrency Hunter, Boundary Auditor, and Ledger Guardian evaluate diff in parallel.",
    output: {
      concurrencyVerdict: "PASS",
      boundaryVerdict: "PASS",
      ledgerVerdict: "PASS",
      consensusScore: "100%",
      tokenConsumption: 1420,
    },
  },
  {
    id: "step-4",
    name: "04. Deterministic Roslyn Gate",
    type: "compiler_gate",
    status: "completed",
    durationMs: 46,
    description: "C# analyzer ERP-ARCH-001 verifies ILedgerCommandService and LedgerTransactionScope.",
    output: {
      analyzer: "ERP-ARCH-001",
      directLedgerMutations: 0,
      scopeWrapped: true,
      status: "COMPILATION_PASSED",
    },
  },
  {
    id: "step-5",
    name: "05. Exponential Retry Guard",
    type: "retry_handler",
    status: "completed",
    durationMs: 12,
    description: "Durable state checkpoint with automatic backoff (max 3 retries, jittered).",
    output: {
      attemptNumber: 1,
      maxRetries: 3,
      backoffInterval: "0ms (first-pass success)",
      circuitState: "CLOSED_HEALTHY",
    },
  },
  {
    id: "step-6",
    name: "06. Ledger Commit & Outbox",
    type: "commit",
    status: "completed",
    durationMs: 38,
    description: "Atomic transactional write with outbox event broadcast to TeamCity & EventStore.",
    output: {
      journalEntryId: "JE-2026-90412",
      postedAt: "2026-09-15T14:32:01.682Z",
      status: "COMMITTED_GAAP_BALANCED",
    },
  },
];

// Recharts Datasets
const DRIFT_TREND_DATA = [
  { month: "Jan", evaluated: 142, driftsBlocked: 48, cleanMerges: 94 },
  { month: "Feb", evaluated: 188, driftsBlocked: 62, cleanMerges: 126 },
  { month: "Mar", evaluated: 235, driftsBlocked: 81, cleanMerges: 154 },
  { month: "Apr", evaluated: 294, driftsBlocked: 98, cleanMerges: 196 },
  { month: "May", evaluated: 360, driftsBlocked: 114, cleanMerges: 246 },
  { month: "Jun", evaluated: 430, driftsBlocked: 138, cleanMerges: 292 },
];

const driftChartConfig: ChartConfig = {
  evaluated: {
    label: "Total PRs Evaluated",
    color: "#6366f1",
  },
  driftsBlocked: {
    label: "Architectural Drifts Blocked",
    color: "#f43f5e",
  },
  cleanMerges: {
    label: "Compliant Merges Approved",
    color: "#10b981",
  },
};

const LATENCY_BREAKDOWN_DATA = [
  { agent: "Concurrency Hunter", latencyMs: 124, tokens: 920, costUsd: 0.0009 },
  { agent: "Domain Boundary", latencyMs: 148, tokens: 1140, costUsd: 0.0011 },
  { agent: "Ledger Guardian", latencyMs: 162, tokens: 1280, costUsd: 0.0013 },
  { agent: "Roslyn Compiler Gate", latencyMs: 46, tokens: 0, costUsd: 0.0000 },
];

const latencyChartConfig: ChartConfig = {
  latencyMs: {
    label: "Latency (ms)",
    color: "#3b82f6",
  },
};

const VELOCITY_DATA = [
  { module: "Accounting GL", manualHrs: 48, aiMins: 3.2 },
  { module: "Inventory Sync", manualHrs: 36, aiMins: 2.8 },
  { module: "SQL Migrations", manualHrs: 52, aiMins: 4.1 },
  { module: "Desktop WPF Sync", manualHrs: 42, aiMins: 3.5 },
];

const velocityChartConfig: ChartConfig = {
  manualHrs: {
    label: "Manual PR Review (Hours)",
    color: "#94a3b8",
  },
  aiMins: {
    label: "AI Governance Gate (Minutes)",
    color: "#10b981",
  },
};

export function AgenticWorkflowsView() {
  const [activeWorkflowTab, setActiveWorkflowTab] = useState<string>("workflows");
  
  // Tab 1: Workflows State
  const [steps, setSteps] = useState<WorkflowStep[]>(INITIAL_STEPS);
  const [selectedStepId, setSelectedStepId] = useState<string>("step-3");
  const [isRunningWorkflow, setIsRunningWorkflow] = useState<boolean>(false);
  const [showInngestCode, setShowInngestCode] = useState<boolean>(false);
  const [selectedEventTrigger, setSelectedEventTrigger] = useState<string>("erp.order_placed");

  // Tab 2: APIs State
  const [selectedApiEndpoint, setSelectedApiEndpoint] = useState<string>("/api/v1/sync/journal-entry");
  const [tenantHeader, setTenantHeader] = useState<string>("8f41c9b2-3e21-4820-a0f1-92b4512e99d1");
  const [idempotencyKey, setIdempotencyKey] = useState<string>("idemp_20260915_904128");
  const [apiRequestBody, setApiRequestBody] = useState<string>(
    JSON.stringify(
      {
        orderId: "ORD-94012",
        tenantId: "8f41c9b2-3e21-4820-a0f1-92b4512e99d1",
        accountDebit: "1010-CASH",
        accountCredit: "4010-SALES-REVENUE",
        amount: 12450.0,
        currency: "USD",
        scope: "LedgerTransactionScope",
      },
      null,
      2
    )
  );
  const [apiResponse, setApiResponse] = useState<{
    status: number;
    statusText: string;
    latencyMs: number;
    headers: Record<string, string>;
    body: Record<string, unknown>;
  } | null>({
    status: 200,
    statusText: "OK",
    latencyMs: 38,
    headers: {
      "content-type": "application/json",
      "x-squiderp-trace-id": "trace_90a4f21b",
      "x-idempotency-status": "KEY_SAVED",
      "x-tenant-partition": "PARTITION_US_EAST_01",
    },
    body: {
      success: true,
      journalEntryId: "JE-2026-90412",
      postedAt: "2026-09-15T14:32:01.682Z",
      reconciliationStatus: "BALANCED",
      rulesEnforced: ["ERP-ARCH-001", "GAAP-DOUBLE-ENTRY-004"],
    },
  });
  const [isSendingApi, setIsSendingApi] = useState<boolean>(false);

  // Tab 3: Agents Consensus State
  const [consensusRunCount, setConsensusRunCount] = useState<number>(42);
  const [isAuditingAgents, setIsAuditingAgents] = useState<boolean>(false);
  const [agentAuditScenario, setAgentAuditScenario] = useState<"clean" | "drift">("drift");

  // Workflow Simulation Runner
  const runWorkflowSimulation = () => {
    setIsRunningWorkflow(true);
    // Reset steps to idle
    setSteps((prev) =>
      prev.map((s, idx) => ({
        ...s,
        status: idx === 0 ? "running" : "idle",
      }))
    );

    // Sequence steps
    const timers = [
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((s, idx) => ({
            ...s,
            status: idx === 0 ? "completed" : idx === 1 ? "running" : "idle",
          }))
        );
      }, 300),
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((s, idx) => ({
            ...s,
            status: idx <= 1 ? "completed" : idx === 2 ? "running" : "idle",
          }))
        );
      }, 700),
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((s, idx) => ({
            ...s,
            status: idx <= 2 ? "completed" : idx === 3 ? "running" : "idle",
          }))
        );
      }, 1200),
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((s, idx) => ({
            ...s,
            status: idx <= 3 ? "completed" : idx === 4 ? "running" : "idle",
          }))
        );
      }, 1600),
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((s, idx) => ({
            ...s,
            status: idx <= 4 ? "completed" : idx === 5 ? "running" : "idle",
          }))
        );
      }, 1900),
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((s) => ({
            ...s,
            status: "completed",
          }))
        );
        setIsRunningWorkflow(false);
      }, 2300),
    ];

    return () => timers.forEach(clearTimeout);
  };

  // API Request Simulation
  const handleSendApiRequest = () => {
    setIsSendingApi(true);
    setTimeout(() => {
      let isBreach = false;
      try {
        const parsed = JSON.parse(apiRequestBody);
        if (!parsed.tenantId || !parsed.scope) {
          isBreach = true;
        }
      } catch {
        isBreach = true;
      }

      if (isBreach) {
        setApiResponse({
          status: 422,
          statusText: "Unprocessable Entity (Architectural Violation)",
          latencyMs: 18,
          headers: {
            "content-type": "application/json",
            "x-squiderp-trace-id": "trace_err_48b192",
            "x-rule-violated": "ERP-ARCH-001",
          },
          body: {
            success: false,
            error: "ARCHITECTURAL_DRIFT_INTERCEPTED",
            message: "Missing mandatory TenantId or LedgerTransactionScope header boundary.",
            ruleId: "ERP-ARCH-001",
            action: "REQUEST_QUARANTINED",
          },
        });
      } else {
        setApiResponse({
          status: 200,
          statusText: "OK",
          latencyMs: 36,
          headers: {
            "content-type": "application/json",
            "x-squiderp-trace-id": `trace_${Math.random().toString(36).substring(2, 9)}`,
            "x-idempotency-status": "PROCESSED_IDEMPOTENT",
            "x-tenant-partition": "PARTITION_US_EAST_01",
          },
          body: {
            success: true,
            journalEntryId: `JE-2026-${Math.floor(10000 + Math.random() * 90000)}`,
            postedAt: new Date().toISOString(),
            reconciliationStatus: "BALANCED",
            rulesEnforced: ["ERP-ARCH-001", "GAAP-DOUBLE-ENTRY-004"],
          },
        });
      }
      setIsSendingApi(false);
    }, 450);
  };

  const selectedStep = steps.find((s) => s.id === selectedStepId) || steps[0];

  return (
    <div className="w-full space-y-5">
      {/* Top Banner & Specialist Credential Bar */}
      <Card className="border-indigo-200 bg-gradient-to-r from-indigo-50/70 via-white to-indigo-50/40 dark:border-indigo-900/50 dark:from-indigo-950/30 dark:via-slate-900 dark:to-slate-900 shadow-sm">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
                  <Workflow className="h-4 w-4" />
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  Enterprise AI Automation, Workflows & APIs Integration Suite
                </h2>
                <Badge variant="brand" className="text-xs font-mono">
                  Specialist Showcase
                </Badge>
                <Badge variant="outline" className="text-xs font-mono bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800">
                  Inngest · Webhooks · Subagents · Recharts
                </Badge>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
                Demonstrating high-reliability durable event state machines, live ERP REST/Webhook API test harnesses, 3-agent adversarial consensus scoring, and production telemetry charts.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="px-3 py-2 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-2xs text-center">
                <span className="text-xs font-mono text-slate-400 block">Durable Uptime</span>
                <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">99.98%</span>
              </div>
              <div className="px-3 py-2 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-2xs text-center">
                <span className="text-xs font-mono text-slate-400 block">Avg Webhook Latency</span>
                <span className="text-sm font-bold font-mono text-indigo-600 dark:text-indigo-400">38ms</span>
              </div>
              <div className="px-3 py-2 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-2xs text-center">
                <span className="text-xs font-mono text-slate-400 block">Consensus Gate</span>
                <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">3-Agent 100%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Suite Tabs */}
      <Tabs value={activeWorkflowTab} onValueChange={setActiveWorkflowTab} className="w-full space-y-4">
        <TabsList className="grid grid-cols-2 lg:grid-cols-4 w-full h-auto p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
          <TabsTrigger value="workflows" className="py-2 text-xs font-semibold flex items-center gap-1.5">
            <Workflow className="h-3.5 w-3.5" />
            01. Durable Workflows
          </TabsTrigger>
          <TabsTrigger value="apis" className="py-2 text-xs font-semibold flex items-center gap-1.5">
            <Webhook className="h-3.5 w-3.5" />
            02. ERP APIs & Webhooks
          </TabsTrigger>
          <TabsTrigger value="agents" className="py-2 text-xs font-semibold flex items-center gap-1.5">
            <Bot className="h-3.5 w-3.5" />
            03. Multi-Agent Consensus
          </TabsTrigger>
          <TabsTrigger value="analytics" className="py-2 text-xs font-semibold flex items-center gap-1.5">
            <BarChart3 className="h-3.5 w-3.5" />
            04. Telemetry Charts
          </TabsTrigger>
        </TabsList>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: DURABLE WORKFLOWS (Inngest / Temporal State Machine) */}
        {/* ------------------------------------------------------------- */}
        <TabsContent value="workflows" className="space-y-4 mt-0">
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Workflow className="h-4 w-4 text-indigo-600" />
                    Durable Event-Driven Execution DAG (Inngest / Temporal Pattern)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Each step executes idempotently with automatic retries, AST schema verification, and distributed transaction compensation.
                  </CardDescription>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowInngestCode(!showInngestCode)}
                    className="text-xs h-8"
                  >
                    <Code2 className="h-3.5 w-3.5 mr-1 text-indigo-500" />
                    {showInngestCode ? "Hide Function Code" : "View Inngest Code"}
                  </Button>
                  <Button
                    variant="brand"
                    size="sm"
                    disabled={isRunningWorkflow}
                    onClick={runWorkflowSimulation}
                    className="text-xs h-8"
                  >
                    {isRunningWorkflow ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                        Running DAG...
                      </>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5 mr-1.5" />
                        Trigger Workflow Run
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-5 space-y-4">
              {/* Optional Inngest Function Code Viewer */}
              {showInngestCode && (
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-100 p-4 font-mono text-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
                    <span className="flex items-center gap-1.5 font-semibold text-indigo-400">
                      <Terminal className="h-3.5 w-3.5" />
                      inngest/functions/erpGovernancePipeline.ts
                    </span>
                    <Badge variant="outline" className="text-xs font-mono border-slate-700 text-slate-300">
                      Durable Step Functions
                    </Badge>
                  </div>
                  <pre className="overflow-x-auto text-xs leading-relaxed text-emerald-400">
{`export const erpGovernancePipeline = inngest.createFunction(
  { id: "erp-governance-pipeline", retries: 3 },
  { event: "erp.order_placed" },
  async ({ event, step }) => {
    // Step 1: Verify HMAC & Tenant Header
    const auth = await step.run("verify-hmac-signature", async () => {
      return verifyHmacSignature(event.data.signature, event.data.rawBody);
    });

    // Step 2: Validate Zod Schema & GAAP Boundaries
    const validated = await step.run("validate-ast-schema", async () => {
      return OrderEventSchema.parse(event.data.payload);
    });

    // Step 3: Run 3-Agent Adversarial Consensus in Parallel
    const consensus = await step.parallel([
      () => step.run("audit-concurrency", () => runConcurrencyHunter(validated)),
      () => step.run("audit-boundaries", () => runBoundaryAuditor(validated)),
      () => step.run("audit-ledger-gaap", () => runLedgerGuardian(validated)),
    ]);

    // Step 4: Deterministic Roslyn Analyzer Gate
    await step.run("roslyn-compiler-check", async () => {
      const roslynResult = await runRoslynAnalyzer("ERP-ARCH-001", validated.diff);
      if (roslynResult.violations.length > 0) throw new NonRetriableError("Roslyn Gate Failed");
    });

    // Step 5: Atomic Ledger Commit
    return await step.run("commit-ledger-scope", async () => {
      return postJournalEntryAtomic(validated.tenantId, validated.amount);
    });
  }
);`}
                  </pre>
                </div>
              )}

              {/* Visual 6-Step DAG Pipeline */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-2.5">
                {steps.map((step, idx) => {
                  const isSelected = selectedStepId === step.id;
                  const isCompleted = step.status === "completed";
                  const isRunning = step.status === "running";

                  return (
                    <button
                      key={step.id}
                      onClick={() => setSelectedStepId(step.id)}
                      className={`text-left p-3 rounded-xl border transition-all flex flex-col justify-between ${
                        isSelected
                          ? "border-indigo-500 bg-white ring-2 ring-indigo-500/20 dark:bg-slate-800 shadow-sm"
                          : "border-slate-200 bg-slate-50/60 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/60"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-mono font-bold text-slate-400">
                            STEP 0{idx + 1}
                          </span>
                          {isCompleted && (
                            <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              {step.durationMs}ms
                            </span>
                          )}
                          {isRunning && (
                            <span className="inline-flex items-center gap-1 text-xs font-mono text-indigo-600 dark:text-indigo-400 font-semibold animate-pulse">
                              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                              Running
                            </span>
                          )}
                          {step.status === "idle" && (
                            <span className="text-xs font-mono text-slate-400">Ready</span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                          {step.name}
                        </h4>
                      </div>

                      <div className="pt-2 mt-2 border-t border-slate-200/70 dark:border-slate-800 text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center justify-between">
                        <span className="capitalize">{step.type.replace("_", " ")}</span>
                        <ArrowRight className="h-3 w-3 text-slate-400" />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Step Inspector Panel */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                    <h3 className="text-xs font-bold font-mono text-slate-900 dark:text-white uppercase tracking-wider">
                      Step Telemetry Inspector: {selectedStep.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs font-mono">
                      Type: {selectedStep.type}
                    </Badge>
                    <Badge variant="brand" className="text-xs font-mono">
                      Duration: {selectedStep.durationMs}ms
                    </Badge>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {selectedStep.description}
                </p>

                {/* State Payload JSON */}
                <div className="rounded-lg bg-slate-950 p-3 font-mono text-xs text-emerald-400 overflow-x-auto border border-slate-800">
                  <pre>{JSON.stringify(selectedStep.output, null, 2)}</pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: ERP APIS & WEBHOOKS CONSOLE */}
        {/* ------------------------------------------------------------- */}
        <TabsContent value="apis" className="space-y-4 mt-0">
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Webhook className="h-4 w-4 text-emerald-600" />
                    Enterprise ERP REST & Webhook Integration Console
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Test live synchronization contracts, tenant isolation headers, idempotency replay, and Zod schema validations.
                  </CardDescription>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs font-mono">
                    SquidERP API v1.4
                  </Badge>
                  <Badge variant="brand" className="text-xs font-mono">
                    Double-Entry GAAP Guaranteed
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-5 space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Request Configuration Panel */}
                <div className="space-y-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Request Configuration
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setApiRequestBody(
                            JSON.stringify(
                              {
                                orderId: "ORD-94012",
                                tenantId: "8f41c9b2-3e21-4820-a0f1-92b4512e99d1",
                                accountDebit: "1010-CASH",
                                accountCredit: "4010-SALES-REVENUE",
                                amount: 12450.0,
                                currency: "USD",
                                scope: "LedgerTransactionScope",
                              },
                              null,
                              2
                            )
                          );
                        }}
                        className="text-xs px-2 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 font-mono"
                      >
                        Valid Payload
                      </button>
                      <button
                        onClick={() => {
                          setApiRequestBody(
                            JSON.stringify(
                              {
                                orderId: "ORD-94012",
                                // ❌ Missing tenantId and scope to trigger drift interception!
                                amount: 12450.0,
                                rawLedgerDirectInsert: true,
                              },
                              null,
                              2
                            )
                          );
                        }}
                        className="text-xs px-2 py-1 rounded bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 hover:bg-rose-100 font-mono"
                      >
                        Drift Payload
                      </button>
                    </div>
                  </div>

                  {/* Endpoint Select */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      HTTP Endpoint
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white font-mono text-xs font-bold">
                        POST
                      </span>
                      <input
                        type="text"
                        value={selectedApiEndpoint}
                        onChange={(e) => setSelectedApiEndpoint(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Headers */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <Fingerprint className="h-3 w-3 text-indigo-500" />
                        X-Tenant-ID
                      </label>
                      <input
                        type="text"
                        value={tenantHeader}
                        onChange={(e) => setTenantHeader(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white truncate"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <Key className="h-3 w-3 text-indigo-500" />
                        X-Idempotency-Key
                      </label>
                      <input
                        type="text"
                        value={idempotencyKey}
                        onChange={(e) => setIdempotencyKey(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white truncate"
                      />
                    </div>
                  </div>

                  {/* Body Editor */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      JSON Payload Body
                    </label>
                    <textarea
                      rows={6}
                      value={apiRequestBody}
                      onChange={(e) => setApiRequestBody(e.target.value)}
                      className="w-full p-2.5 text-xs font-mono bg-slate-950 text-emerald-400 border border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
                    />
                  </div>

                  <Button
                    variant="brand"
                    size="sm"
                    disabled={isSendingApi}
                    onClick={handleSendApiRequest}
                    className="w-full text-xs h-9 font-semibold"
                  >
                    {isSendingApi ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                        Executing ERP Synchronization...
                      </>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5 mr-1.5" />
                        Send Request & Verify Contracts
                      </>
                    )}
                  </Button>
                </div>

                {/* Response Panel */}
                <div className="space-y-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-bold font-mono text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        HTTP Response & Telemetry
                      </span>
                      {apiResponse && (
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                              apiResponse.status === 200
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800"
                                : "bg-rose-50 text-rose-700 border border-rose-300 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800"
                            }`}
                          >
                            {apiResponse.status} {apiResponse.statusText}
                          </span>
                          <span className="text-xs font-mono text-slate-400">
                            {apiResponse.latencyMs}ms
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Response Headers */}
                    {apiResponse && (
                      <div className="space-y-1">
                        <span className="text-xs font-mono text-slate-400 block">
                          Response Headers:
                        </span>
                        <div className="rounded-lg bg-slate-100 dark:bg-slate-800/80 p-2 text-xs font-mono text-slate-700 dark:text-slate-300 space-y-1">
                          {Object.entries(apiResponse.headers).map(([k, v]) => (
                            <div key={k} className="flex items-center justify-between">
                              <span className="text-slate-500 dark:text-slate-400">{k}:</span>
                              <span className="font-semibold text-indigo-600 dark:text-indigo-400">{v}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Response Body */}
                    {apiResponse && (
                      <div className="space-y-1">
                        <span className="text-xs font-mono text-slate-400 block">
                          Response Body (JSON):
                        </span>
                        <div className="rounded-lg bg-slate-950 p-3 font-mono text-xs text-emerald-400 border border-slate-800 max-h-52 overflow-y-auto">
                          <pre>{JSON.stringify(apiResponse.body, null, 2)}</pre>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
                    <span>Double-Entry GAAP Validator: Active</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      Zero In-Flight Drifts
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: AI AGENTS & ADVERSARIAL CONSENSUS */}
        {/* ------------------------------------------------------------- */}
        <TabsContent value="agents" className="space-y-4 mt-0">
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Bot className="h-4 w-4 text-indigo-600" />
                    Adversarial Multi-Agent Consensus Telemetry
                  </CardTitle>
                  <CardDescription className="text-xs">
                    3 specialized subagents conduct independent audits before code ever touches TeamCity or the pull request queue.
                  </CardDescription>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs font-mono">
                    Consensus Gate: 80% Min
                  </Badge>
                  <Button
                    variant="brand"
                    size="sm"
                    disabled={isAuditingAgents}
                    onClick={() => {
                      setIsAuditingAgents(true);
                      setTimeout(() => {
                        setConsensusRunCount((prev) => prev + 1);
                        setIsAuditingAgents(false);
                      }, 600);
                    }}
                    className="text-xs h-8"
                  >
                    {isAuditingAgents ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                        Voting in Parallel...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                        Run Consensus Evaluation (#{consensusRunCount})
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-5 space-y-4">
              {/* Scenario Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Test Scenario:
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {agentAuditScenario === "drift"
                      ? "Rogue Direct Ledger Write (C# .NET) - Violates Accounting Scope"
                      : "Compliant CQRS MediatR Command Handler - 100% Boundary Compliant"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setAgentAuditScenario("drift")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      agentAuditScenario === "drift"
                        ? "bg-rose-600 text-white shadow-sm"
                        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    Drift Code (Reject)
                  </button>
                  <button
                    onClick={() => setAgentAuditScenario("clean")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      agentAuditScenario === "clean"
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    Compliant Code (Pass)
                  </button>
                </div>
              </div>

              {/* 3 Subagents Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Agent 1: Concurrency Hunter */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                        α
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          Concurrency Hunter
                        </h4>
                        <span className="text-xs font-mono text-slate-400">Subagent Alpha</span>
                      </div>
                    </div>
                    <Badge
                      variant={agentAuditScenario === "clean" ? "success" : "warning"}
                      className="text-xs font-mono"
                    >
                      {agentAuditScenario === "clean" ? "PASS (99.2%)" : "WARN (74.0%)"}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Audits async/await dispatchers, thread-pool exhaustion, and sync-over-async (.Result) deadlock patterns in desktop WPF & .NET services.
                  </p>

                  <div className="space-y-1 text-xs font-mono bg-slate-50 dark:bg-slate-850 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                    <div className="flex justify-between text-slate-500">
                      <span>Model Provider:</span>
                      <span className="text-slate-800 dark:text-slate-200 font-semibold">OpenAI gpt-4o-mini</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Inference Latency:</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-semibold">124ms</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Tokens Burned:</span>
                      <span className="text-slate-800 dark:text-slate-200">920 tokens ($0.0009)</span>
                    </div>
                  </div>
                </div>

                {/* Agent 2: Domain Boundary Auditor */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                        β
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          Domain Boundary Auditor
                        </h4>
                        <span className="text-xs font-mono text-slate-400">Subagent Beta</span>
                      </div>
                    </div>
                    <Badge
                      variant={agentAuditScenario === "clean" ? "success" : "destructive"}
                      className="text-xs font-mono"
                    >
                      {agentAuditScenario === "clean" ? "PASS (98.6%)" : "FAIL_DRIFT"}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Guarantees Clean Architecture compliance. Prevents coding agents from inventing parallel repositories or leaking DTOs outside bounded contexts.
                  </p>

                  <div className="space-y-1 text-xs font-mono bg-slate-50 dark:bg-slate-850 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                    <div className="flex justify-between text-slate-500">
                      <span>Model Provider:</span>
                      <span className="text-slate-800 dark:text-slate-200 font-semibold">Gemini 2.0 Flash</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Inference Latency:</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-semibold">148ms</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Tokens Burned:</span>
                      <span className="text-slate-800 dark:text-slate-200">1,140 tokens ($0.0011)</span>
                    </div>
                  </div>
                </div>

                {/* Agent 3: Ledger Guardian */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                        γ
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          Ledger Guardian
                        </h4>
                        <span className="text-xs font-mono text-slate-400">Subagent Gamma</span>
                      </div>
                    </div>
                    <Badge
                      variant={agentAuditScenario === "clean" ? "success" : "destructive"}
                      className="text-xs font-mono"
                    >
                      {agentAuditScenario === "clean" ? "PASS (100%)" : "FAIL_GAAP"}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Sovereign validator for accounting invariants. Throws immediate rejection if GeneralLedger is touched outside approved LedgerTransactionScope.
                  </p>

                  <div className="space-y-1 text-xs font-mono bg-slate-50 dark:bg-slate-850 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                    <div className="flex justify-between text-slate-500">
                      <span>Model Provider:</span>
                      <span className="text-slate-800 dark:text-slate-200 font-semibold">OpenAI gpt-4o-mini</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Inference Latency:</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-semibold">162ms</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Tokens Burned:</span>
                      <span className="text-slate-800 dark:text-slate-200">1,280 tokens ($0.0013)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Consensus Verdict Box */}
              <Alert
                variant={agentAuditScenario === "clean" ? "success" : "destructive"}
                className="mt-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <AlertTitle className="text-xs font-bold">
                      {agentAuditScenario === "clean"
                        ? "Consensus Reached: 3/3 Pass (100% Unanimous Approval)"
                        : "Consensus Blocked: 2 Rejections (Ledger Guardian & Boundary Auditor)"}
                    </AlertTitle>
                    <AlertDescription className="text-xs mt-1">
                      {agentAuditScenario === "clean"
                        ? "The pull request satisfies all domain boundaries, CQRS separation, and GAAP ledger scope. Marked safe for TeamCity release build."
                        : "Direct mutation of GeneralLedger entity detected. Roslyn Analyzer ERP-ARCH-001 enforces compilation break before human notification."}
                    </AlertDescription>
                  </div>
                  <Badge
                    variant={agentAuditScenario === "clean" ? "success" : "destructive"}
                    className="text-xs font-mono shrink-0 whitespace-nowrap"
                  >
                    {agentAuditScenario === "clean" ? "AUTOMATIC MERGE READY" : "QUARANTINED & BLOCKED"}
                  </Badge>
                </div>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ------------------------------------------------------------- */}
        {/* TAB 4: PERFORMANCE ANALYTICS & CHARTS (Shadcn Recharts) */}
        {/* ------------------------------------------------------------- */}
        <TabsContent value="analytics" className="space-y-4 mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Chart 1: Drift Interception Trend (Area Chart) */}
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <BarChart3 className="h-4 w-4 text-indigo-600" />
                    Architectural Drift Interception Trend
                  </span>
                  <Badge variant="outline" className="text-xs font-mono">
                    Last 6 Months
                  </Badge>
                </CardTitle>
                <CardDescription className="text-xs">
                  Monthly AI PRs evaluated vs rogue architectural drifts blocked vs compliant merges.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <ChartContainer config={driftChartConfig} className="h-64 w-full">
                  <AreaChart data={DRIFT_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorEvaluated" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorDrifts" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorClean" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                    <Area
                      type="monotone"
                      dataKey="evaluated"
                      stroke="#6366f1"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorEvaluated)"
                      name="Total Evaluated"
                    />
                    <Area
                      type="monotone"
                      dataKey="driftsBlocked"
                      stroke="#f43f5e"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorDrifts)"
                      name="Drifts Blocked"
                    />
                    <Area
                      type="monotone"
                      dataKey="cleanMerges"
                      stroke="#10b981"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorClean)"
                      name="Clean Merges"
                    />
                  </AreaChart>
                </ChartContainer>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800 font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                    92.4% Interception Rate
                  </span>
                  <span>430 PRs in June</span>
                </div>
              </CardContent>
            </Card>

            {/* Chart 2: Subagent Latency Breakdown (Bar Chart) */}
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Zap className="h-4 w-4 text-emerald-600" />
                    Subagent Latency & Token Telemetry
                  </span>
                  <Badge variant="brand" className="text-xs font-mono">
                    Sub-15k Bounded
                  </Badge>
                </CardTitle>
                <CardDescription className="text-xs">
                  Execution latency (ms) per subagent. Lightweight Context Packs keep latency &lt; 200ms.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <ChartContainer config={latencyChartConfig} className="h-64 w-full">
                  <BarChart data={LATENCY_BREAKDOWN_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="agent" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                    <YAxis tickLine={false} axisLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="latencyMs"
                      fill="#6366f1"
                      radius={[6, 6, 0, 0]}
                      name="Latency (ms)"
                    />
                  </BarChart>
                </ChartContainer>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800 font-mono">
                  <span>Fastest: Roslyn Gate (46ms)</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    Avg Cost: &lt; $0.0015/PR
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Velocity Benchmark Table */}
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm lg:col-span-2">
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-indigo-600" />
                      Engineering Velocity & Review Cycle Turnaround
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Benchmark comparing manual architectural review vs automated agentic governance gates.
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-xs font-mono text-emerald-600 dark:text-emerald-400 border-emerald-300">
                    15x Faster Time-to-Merge
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs font-semibold">SquidERP Domain Module</TableHead>
                      <TableHead className="text-xs font-semibold">Traditional Review</TableHead>
                      <TableHead className="text-xs font-semibold">AI Governance Gate</TableHead>
                      <TableHead className="text-xs font-semibold">Drift Prevention Rate</TableHead>
                      <TableHead className="text-xs font-semibold text-right">Velocity Gain</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {VELOCITY_DATA.map((row) => (
                      <TableRow key={row.module}>
                        <TableCell className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                          {row.module}
                        </TableCell>
                        <TableCell className="text-xs font-mono text-slate-500">
                          {row.manualHrs} Hours
                        </TableCell>
                        <TableCell className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                          {row.aiMins} Minutes
                        </TableCell>
                        <TableCell className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                          99.4% (Zero Regressions)
                        </TableCell>
                        <TableCell className="text-xs font-mono font-bold text-right text-emerald-600 dark:text-emerald-400">
                          +{Math.round((row.manualHrs * 60) / row.aiMins)}x
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
