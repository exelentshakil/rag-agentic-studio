import { NextResponse } from 'next/server';

export async function GET() {
  const hasOpenAi = !!process.env.OPENAI_API_KEY;
  const hasGemini = !!process.env.GEMINI_API_KEY;
  const hasSupabase = !!process.env.SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;

  return NextResponse.json({
    status: 'healthy',
    system: 'Agentic RAG Studio • High-Fidelity Enterprise RAG Platform',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    providers: {
      openai: {
        active: hasOpenAi,
        model: 'gpt-4o-mini',
        role: 'primary-classification',
      },
      gemini: {
        active: hasGemini,
        model: 'gemini-2.0-flash',
        role: 'failover-classification',
      },
      deterministic: {
        active: true,
        model: 'rule-engine-v1',
        role: 'zero-dependency-fallback',
      },
      supabase: {
        active: hasSupabase,
        role: 'persistent-data-store',
      },
    },
    capabilities: [
      'hybrid-vector-bm25-search',
      'cross-encoder-cohere-reranking',
      'parallel-multi-agent-execution',
      'automatic-failover-circuit-breaker',
      'llm-firewall-owasp-nist',
      'real-time-citation-generation',
    ],
  });
}
