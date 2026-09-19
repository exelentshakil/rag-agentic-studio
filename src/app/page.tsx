'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { ReviewerTour } from '@/components/ReviewerTour';
import { BentoGrid } from '@/components/BentoGrid';
import { RoiCostCalculator } from '@/components/RoiCostCalculator';
import { BlueprintExporter } from '@/components/BlueprintExporter';
import { ChaosSimulatorModal } from '@/components/ChaosSimulatorModal';
import { AiGovernanceDrawer } from '@/components/AiGovernanceDrawer';
import { ExecutionLogDrawer } from '@/components/ExecutionLogDrawer';
import { CommandMenu } from '@/components/CommandMenu';
import { Footer } from '@/components/Footer';
import { DocumentReferenceCockpit } from '@/components/DocumentReferenceCockpit';
import { AgenticWorkflowsView } from '@/components/AgenticWorkflowsView';
import { DeterministicReportModal } from '@/components/DeterministicReportModal';
import { CitationRef } from '@/lib/ai';

export default function HomePage() {
  const [activeSection, setActiveSection] = useState('briefing');
  const [chaosModalOpen, setChaosModalOpen] = useState(false);
  const [governanceDrawerOpen, setGovernanceDrawerOpen] = useState(false);
  const [logsDrawerOpen, setLogsDrawerOpen] = useState(false);
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);

  // RAG and Role states
  const [currentRole, setCurrentRole] = useState<'ADMIN' | 'COMPLIANCE_AUDITOR' | 'LEGAL_REVIEWER' | 'READ_ONLY_VIEWER'>('LEGAL_REVIEWER');
  const [rateLimitRemaining, setRateLimitRemaining] = useState<number>(58);
  const [reportModalData, setReportModalData] = useState<{
    isOpen: boolean;
    query: string;
    answer: string;
    citations: CitationRef[];
  }>({
    isOpen: false,
    query: '',
    answer: '',
    citations: [],
  });

  // Anti-flicker programmatic navigation lock
  const isNavigatingRef = useRef(false);
  const navTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleNavigate = (sectionId: string) => {
    // 1. Immediately pin target active state so the clicked menu item illuminates instantly
    setActiveSection(sectionId);

    // 2. Lock observer updates so intermediate sections during smooth scrolling cannot cause menu flickering
    isNavigatingRef.current = true;
    if (navTimeoutRef.current) {
      clearTimeout(navTimeoutRef.current);
    }

    if (sectionId === 'briefing') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        const headerOffset = 64; // Sticky header height allowance
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = Math.max(0, elementPosition + window.scrollY - headerOffset);
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }

    // 3. Release observer lock once smooth scroll completes
    const releaseLock = () => {
      isNavigatingRef.current = false;
      window.removeEventListener('scrollend', releaseLock);
    };

    if ('onscrollend' in window) {
      window.addEventListener('scrollend', releaseLock, { once: true });
    }

    // Fallback timer (1400ms covers full-page smooth-scroll curve)
    navTimeoutRef.current = setTimeout(releaseLock, 1400);
  };

  useEffect(() => {
    const sectionIds = ['briefing', 'metrics', 'rag-engine', 'agentic-workflows', 'roi', 'blueprints'];
    const observer = new IntersectionObserver(
      (entries) => {
        // Suppress scrollspy during programmatic menu click navigation to prevent intermediate tab flickering
        if (isNavigatingRef.current) return;

        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          // Sort by proximity to top of viewport
          visibleEntries.sort(
            (a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top)
          );
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      { rootMargin: '-15% 0px -60% 0px', threshold: 0.1 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
      if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
    };
  }, []);

  const handleConsumeToken = (): boolean => {
    if (rateLimitRemaining <= 0) return false;
    setRateLimitRemaining((prev) => Math.max(0, prev - 1));
    return true;
  };

  const handleLogEvent = (
    action: string,
    details: string,
    targetDoc: string,
    status: string
  ) => {
    console.log(`[LogEvent] ${action} over ${targetDoc}: ${details} (${status})`);
  };

  const handleOpenReportModal = (query: string, answer: string, citations: CitationRef[]) => {
    setReportModalData({
      isOpen: true,
      query,
      answer,
      citations,
    });
  };

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-text-primary)]">
      <Header
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenChaosModal={() => setChaosModalOpen(true)}
        onOpenGovernanceDrawer={() => setGovernanceDrawerOpen(true)}
        onOpenLogsDrawer={() => setLogsDrawerOpen(true)}
        onOpenCommandMenu={() => setCommandMenuOpen(true)}
      />

      <main className="w-full max-w-full min-w-0 overflow-x-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-8">
          <section id="briefing" className="scroll-mt-20">
            <ReviewerTour
              onNavigate={handleNavigate}
              onOpenChaosModal={() => setChaosModalOpen(true)}
            />
          </section>

          <section id="metrics" className="scroll-mt-20">
            <BentoGrid />
          </section>

          <section id="rag-engine" className="scroll-mt-20">
            <div className="border border-[var(--color-border)] rounded-2xl bg-[var(--color-surface)] p-5 sm:p-6 space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--color-border)] pb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-bold tracking-tight text-[var(--color-text-primary)]">
                    RAG Retrieval &amp; AI Search Engine
                  </h3>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                    Dual-provider (OpenAI gpt-4o-mini &amp; Gemini 2.0) search simulator with BM25 semantic hybrid reranking, PII scrubbing, and real-time citations.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                  <span className="text-xs text-[var(--color-text-muted)] font-mono font-medium">Session Role:</span>
                  <select
                    value={currentRole}
                    onChange={(e: any) => setCurrentRole(e.target.value)}
                    className="text-xs font-semibold rounded-md border border-[var(--color-border)] bg-[var(--color-panel-subtle)] px-2.5 py-1.5 text-[var(--color-text-primary)] focus:outline-hidden focus:border-slate-400 cursor-pointer shadow-2xs"
                  >
                    <option value="ADMIN">ADMIN (Full Access)</option>
                    <option value="COMPLIANCE_AUDITOR">COMPLIANCE_AUDITOR (Compliance)</option>
                    <option value="LEGAL_REVIEWER">LEGAL_REVIEWER (Restricted Legal)</option>
                    <option value="READ_ONLY_VIEWER">READ_ONLY_VIEWER (Gated / No Enterprise)</option>
                  </select>
                </div>
              </div>
              <DocumentReferenceCockpit
                currentRole={currentRole}
                onGenerateReport={handleOpenReportModal}
                onLogEvent={handleLogEvent}
                onConsumeToken={handleConsumeToken}
              />
            </div>
          </section>

          <section id="agentic-workflows" className="scroll-mt-20">
            <AgenticWorkflowsView />
          </section>

          <section id="roi" className="scroll-mt-20">
            <RoiCostCalculator />
          </section>

          <section id="blueprints" className="scroll-mt-20">
            <BlueprintExporter />
          </section>
        </div>
      </main>

      <Footer />

      <ChaosSimulatorModal
        open={chaosModalOpen}
        onOpenChange={setChaosModalOpen}
      />

      <AiGovernanceDrawer
        open={governanceDrawerOpen}
        onOpenChange={setGovernanceDrawerOpen}
      />

      <ExecutionLogDrawer
        open={logsDrawerOpen}
        onOpenChange={setLogsDrawerOpen}
      />

      <DeterministicReportModal
        isOpen={reportModalData.isOpen}
        onClose={() => setReportModalData((prev) => ({ ...prev, isOpen: false }))}
        query={reportModalData.query}
        answer={reportModalData.answer}
        citations={reportModalData.citations}
        currentRole={currentRole}
      />

      <CommandMenu
        open={commandMenuOpen}
        onOpenChange={setCommandMenuOpen}
        onOpenChaos={() => {
          setCommandMenuOpen(false);
          setChaosModalOpen(true);
        }}
        onOpenGovernance={() => {
          setCommandMenuOpen(false);
          setGovernanceDrawerOpen(true);
        }}
        onOpenLogs={() => {
          setCommandMenuOpen(false);
          setLogsDrawerOpen(true);
        }}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
