'use client';

import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  Code2,
  FileJson,
  ShieldCheck,
  Layers,
  Terminal,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const SAMPLE_N8N_BLUEPRINT = {
  name: 'RAG-Studio-Enterprise-Pipeline',
  nodes: [
    {
      id: 'node_1',
      name: 'Document Ingestion Source',
      type: 'n8n-nodes-base.googleDrive',
      parameters: {
        operation: 'read',
        folderId: '={{ $env.RAG_SOURCE_FOLDER_ID }}',
      },
    },
    {
      id: 'node_2',
      name: 'Semantic Text Chunker',
      type: 'n8n-nodes-base.code',
      parameters: {
        jsCode: '// Split document text into overlapping semantic blocks\nconst chunks = splitTextIntoChunks(input.text, 500, 50);\nreturn chunks;',
      },
    },
    {
      id: 'node_3',
      name: 'Dense Embedding Generator',
      type: 'n8n-nodes-base.openAi',
      parameters: {
        resource: 'embeddings',
        model: 'text-embedding-3-small',
      },
    },
    {
      id: 'node_4',
      name: 'Supabase Vector Upsert',
      type: 'n8n-nodes-base.supabase',
      parameters: {
        operation: 'upsert',
        tableName: 'document_chunks',
      },
    },
    {
      id: 'node_5',
      name: 'Cohere Cross-Encoder Rerank',
      type: 'n8n-nodes-base.httpRequest',
      parameters: {
        method: 'POST',
        url: 'https://api.cohere.com/v1/rerank',
      },
    },
    {
      id: 'node_6',
      name: 'Dual-Provider LLM Fallback',
      type: 'n8n-nodes-base.openAi',
      parameters: {
        model: 'gpt-4o-mini',
        fallbackModel: 'gemini-2.0-flash',
      },
    },
  ],
  connections: {
    'Document Ingestion Source': { main: [[{ node: 'Semantic Text Chunker', type: 'main', index: 0 }]] },
    'Semantic Text Chunker': { main: [[{ node: 'Dense Embedding Generator', type: 'main', index: 0 }]] },
    'Dense Embedding Generator': { main: [[{ node: 'Supabase Vector Upsert', type: 'main', index: 0 }]] },
    'Supabase Vector Upsert': { main: [[{ node: 'Cohere Cross-Encoder Rerank', type: 'main', index: 0 }]] },
    'Cohere Cross-Encoder Rerank': { main: [[{ node: 'Dual-Provider LLM Fallback', type: 'main', index: 0 }]] },
  },
};

const SAMPLE_MAKE_BLUEPRINT = {
  name: 'RAG-Studio-Make-Pipeline',
  flow: [
    { id: 1, module: 'google-drive:watchFiles', label: '1. Ingest Raw PDF/Docs' },
    { id: 2, module: 'pdf:extractText', label: '2. Extract Raw Metadata & Text Content' },
    { id: 3, module: 'openai:createEmbeddings', label: '3. Generate dense vectors (text-embedding-3)' },
    { id: 4, module: 'supabase:insertRecord', label: '4. Upsert with Metadata Filter Maps' },
    { id: 5, module: 'http:rerank', label: '5. Real-time Hybrid BM25 & Cohere Rerank' },
    { id: 6, module: 'openai:createChatCompletion', label: '6. Fallback LLM generation with Citations' },
  ],
};

export function BlueprintExporter() {
  const [selectedFormat, setSelectedFormat] = useState<'n8n' | 'make'>('n8n');
  const [copied, setCopied] = useState(false);

  const activeJson =
    selectedFormat === 'n8n'
      ? JSON.stringify(SAMPLE_N8N_BLUEPRINT, null, 2)
      : JSON.stringify(SAMPLE_MAKE_BLUEPRINT, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([activeJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rag-studio-${selectedFormat}-pipeline.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--color-border)] pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-800 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800 whitespace-nowrap shrink-0">
              <FileJson className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              Turnkey Deliverables
            </span>
            <span className="text-xs text-[var(--color-text-muted)] font-mono hidden sm:inline">
              Core Requirement 8 • 100% Client Account Ownership
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-[var(--color-text-primary)]">
            One-Click Workflow Blueprint Export (Make.com & n8n)
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            Export ready-to-import workflow files directly into your own private accounts. No developer lock-in; complete control of all API keys and automation logic.
          </p>
        </div>

        {/* Format Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-0.5 text-xs font-medium">
            <button
              onClick={() => setSelectedFormat('n8n')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                selectedFormat === 'n8n'
                  ? 'bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-xs font-bold'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              n8n Workflow
            </button>
            <button
              onClick={() => setSelectedFormat('make')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                selectedFormat === 'make'
                  ? 'bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-xs font-bold'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              Make.com Blueprint
            </button>
          </div>
        </div>
      </div>

      {/* Code Display & Download Controls */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] overflow-hidden">
        {/* Sub-bar */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-mono font-bold text-[var(--color-text-primary)]">
              {selectedFormat === 'n8n' ? 'rag-studio-n8n-pipeline.json' : 'rag-studio-make-blueprint.json'}
            </span>
            <span className="text-xs text-[var(--color-text-muted)] font-mono">
              (v1.2.0 • 6 Nodes)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopy}
              className="h-7 text-xs border-[var(--color-border)] whitespace-nowrap shrink-0"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 mr-1 text-emerald-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 mr-1" />
                  <span>Copy JSON</span>
                </>
              )}
            </Button>
            <Button
              size="sm"
              onClick={handleDownload}
              className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white whitespace-nowrap shrink-0"
            >
              <Download className="h-3 w-3 mr-1" />
              <span>Download .json</span>
            </Button>
          </div>
        </div>

        {/* Code Body */}
        <div className="p-4 max-h-64 overflow-y-auto font-mono text-xs text-[var(--color-text-secondary)] leading-relaxed">
          <pre>{activeJson}</pre>
        </div>
      </div>

      {/* 3-Step Import Instructions */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-text-primary)] mb-1">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-mono text-xs">
              1
            </span>
            <span>Import to Workspace</span>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Open your private {selectedFormat === 'n8n' ? 'n8n' : 'Make.com'} dashboard, click <strong>"Import Workflow"</strong>, and select this JSON file.
          </p>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-text-primary)] mb-1">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-mono text-xs">
              2
            </span>
            <span>Connect Credentials</span>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Plug in your private OpenAI/Gemini API key, your Supabase Database URL, and your Cohere API key.
          </p>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-text-primary)] mb-1">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-mono text-xs">
              3
            </span>
            <span>Activate Auto Sync</span>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Toggle the workflow to <strong>Active</strong>. The ingestion source will monitor your folders or document streams and sync index updates automatically.
          </p>
        </div>
      </div>
    </div>
  );
}
