'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import {
  Activity,
  Radio,
  Sliders,
  Sparkles,
  MessageSquare,
  Database,
  Calculator,
  Download,
  Terminal,
  Shield,
  Sun,
  Moon,
  Zap,
  ChevronDown,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenChaosModal: () => void;
  onOpenGovernanceDrawer: () => void;
  onOpenLogsDrawer: () => void;
  onOpenCommandMenu: () => void;
}

export function Header({
  activeSection,
  onNavigate,
  onOpenChaosModal,
  onOpenGovernanceDrawer,
  onOpenLogsDrawer,
  onOpenCommandMenu,
}: HeaderProps) {
  const { theme, setTheme } = useTheme();

  // Primary high-signal navigation anchors with sleek typography labels
  const primaryNavItems = [
    { id: 'briefing', label: 'Briefing', icon: Zap },
    { id: 'metrics', label: 'Telemetry', icon: Activity },
    { id: 'rag-engine', label: 'RAG Engine', icon: Search },
    { id: 'agentic-workflows', label: 'Agent Workflows', icon: Sliders },
  ];

  // Secondary navigation anchors in sleek "More" dropdown
  const secondaryNavItems = [
    { id: 'roi', label: 'ROI Costing', icon: Calculator, desc: 'Calculate operational and RAG API costs' },
    { id: 'blueprints', label: 'Blueprints', icon: Download, desc: 'Zero lock-in production architectures' },
  ];

  // Check if current active section is inside secondary items
  const isSecondaryActive = secondaryNavItems.some((item) => item.id === activeSection);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur-md shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Cluster: Brand Anchor + Hairline Divider + Integrated Primary Nav */}
        <div className="flex items-center gap-3 xl:gap-4 shrink-0 min-w-0">
          {/* Brand Logo Lockup (Clean, zero overflowing badges/subtitles) */}
          <button
            onClick={() => onNavigate('briefing')}
            className="group flex items-center gap-2.5 text-left transition-opacity hover:opacity-90 shrink-0"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-xs font-bold shrink-0">
              <Sparkles className="h-4 w-4 animate-pulse" />
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-sm font-bold tracking-tight text-[var(--color-text-primary)]">
                Agentic RAG
              </span>
              <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-mono">
                Studio
              </span>
            </div>
          </button>

          {/* Hairline Structural Divider */}
          <div className="hidden lg:block h-4 w-px bg-[var(--color-border)] mx-1 shrink-0" />

          {/* Primary Navigation - Clean Typography Linear/Stripe Unboxed Tabs */}
          <nav className="hidden lg:flex items-center gap-1 shrink-0">
            {primaryNavItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-2.5 h-8 inline-flex items-center text-[13px] font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[var(--color-panel-subtle)] text-[var(--color-text-primary)] font-semibold shadow-2xs border border-[var(--color-border)]'
                      : 'border border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-panel-subtle)]/70'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            {/* Sleek "More" Dropdown Menu for Secondary Sections */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`inline-flex items-center gap-1 px-2.5 h-8 text-[13px] font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    isSecondaryActive
                      ? 'bg-[var(--color-panel-subtle)] text-[var(--color-text-primary)] font-semibold shadow-2xs border border-[var(--color-border)]'
                      : 'border border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-panel-subtle)]/70'
                  }`}
                >
                  <span>More</span>
                  <ChevronDown className="h-3 w-3 opacity-60 ml-0.5 shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                onCloseAutoFocus={(e) => e.preventDefault()}
                className="w-56 bg-[var(--color-surface)] border border-[var(--color-border)] p-1.5 shadow-lg"
              >
                {secondaryNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <DropdownMenuItem
                      key={item.id}
                      onSelect={() => {
                        // Defer navigation slightly so Radix unmount does not abort window smooth scroll
                        setTimeout(() => onNavigate(item.id), 20);
                      }}
                      className={`flex items-start gap-2.5 p-2 rounded-md cursor-pointer text-xs ${
                        isActive ? 'bg-[var(--color-panel-subtle)] font-semibold text-emerald-600 dark:text-emerald-400' : 'text-[var(--color-text-primary)]'
                      }`}
                    >
                      <Icon className="h-4 w-4 mt-0.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <div>
                        <div className="font-medium leading-none">{item.label}</div>
                        <div className="text-xs text-[var(--color-text-muted)] mt-1 font-normal">{item.desc}</div>
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        {/* Right Cluster: Quick Search + Diagnostics + CTA + Theme with Mandatory Spacing Buffer */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 ml-4 lg:ml-6">
          {/* Quick Search ⌘K Button - Single-Line Guaranteed */}
          <button
            onClick={onOpenCommandMenu}
            className="hidden sm:inline-flex h-8 items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-panel-subtle)] px-2.5 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-slate-400 transition-colors shadow-2xs whitespace-nowrap shrink-0"
            title="Quick Navigation Palette (⌘K)"
          >
            <Search className="h-3.5 w-3.5 text-[var(--color-text-muted)] shrink-0" />
            <span className="font-medium whitespace-nowrap">Quick</span>
            <kbd className="rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-1.5 py-0.5 text-[10px] font-mono font-semibold text-[var(--color-text-muted)] shrink-0">
              ⌘K
            </kbd>
          </button>

          {/* Consolidated Diagnostics & Governance Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="hidden xl:inline-flex h-8 items-center gap-1.5 text-xs font-medium border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-panel-subtle)] px-2.5 whitespace-nowrap shadow-2xs shrink-0"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-[var(--color-text-muted)] shrink-0" />
                <span className="whitespace-nowrap">Diagnostics</span>
                <ChevronDown className="h-3 w-3 opacity-60 ml-0.5 shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60 bg-[var(--color-surface)] border border-[var(--color-border)] p-1.5 shadow-lg">
              <DropdownMenuItem
                onClick={onOpenChaosModal}
                className="flex items-start gap-2.5 p-2 rounded-md cursor-pointer text-xs"
              >
                <Zap className="h-4 w-4 mt-0.5 text-amber-500 shrink-0" />
                <div>
                  <div className="font-bold text-[var(--color-text-primary)]">Chaos & Resilience Test</div>
                  <div className="text-xs text-[var(--color-text-muted)] mt-0.5">Test API outages, 429 backoff & failover</div>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={onOpenGovernanceDrawer}
                className="flex items-start gap-2.5 p-2 rounded-md cursor-pointer text-xs"
              >
                <Shield className="h-4 w-4 mt-0.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <div className="font-bold text-[var(--color-text-primary)]">NIST AI RMF Posture</div>
                  <div className="text-xs text-[var(--color-text-muted)] mt-0.5">Securiti certified OWASP LLM guardrails</div>
                </div>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={onOpenLogsDrawer}
                className="flex items-start gap-2.5 p-2 rounded-md cursor-pointer text-xs"
              >
                <Terminal className="h-4 w-4 mt-0.5 text-indigo-500 shrink-0" />
                <div>
                  <div className="font-bold text-[var(--color-text-primary)]">Live Pipeline Event Logs</div>
                  <div className="text-xs text-[var(--color-text-muted)] mt-0.5">Real-time HTTP & AI inference traces</div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* High-Contrast Action CTA */}
          <Button
            size="sm"
            onClick={onOpenChaosModal}
            className="h-8 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs whitespace-nowrap shrink-0 px-3"
          >
            <Zap className="h-3.5 w-3.5 mr-1 text-emerald-200 shrink-0" />
            <span className="whitespace-nowrap">Chaos Test</span>
          </Button>

          {/* Theme Toggle Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="h-8 w-8 p-0 border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-panel-subtle)] shadow-2xs shrink-0"
            aria-label="Toggle theme"
          >
            <Sun className="h-3.5 w-3.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-3.5 w-3.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </div>
      </div>

      {/* Mobile Horizontal Scrollable Pill Navigation */}
      <div className="lg:hidden border-t border-[var(--color-border)] bg-[var(--color-panel-subtle)] py-1.5 px-4 overflow-x-auto no-scrollbar flex items-center gap-1.5">
        {[...primaryNavItems, ...secondaryNavItems].map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)]'
              }`}
            >
              <Icon className="h-3 w-3 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
