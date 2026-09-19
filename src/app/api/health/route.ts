import { NextResponse } from 'next/server';

export async function GET() {
  const hasOpenAi = !!process.env.OPENAI_API_KEY;
  const hasGemini = !!process.env.GEMINI_API_KEY;
  const hasSupabase = !!process.env.SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;

  return NextResponse.json({
    status: 'healthy',
    system: 'GearSignal AI • Modular Social-Listening MVP',
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
      'centralized-keyword-management',
      'multi-platform-reddit-forums-rss',
      'sub-second-ai-opportunity-scoring',
      'slack-block-kit-alert-dispatch',
      'sha256-hash-deduplication',
      'inline-llm-firewall-owasp-nist',
    ],
  });
}
