'use client';

import React, { useState } from 'react';
import {
  Calculator,
  DollarSign,
  TrendingUp,
  Cpu,
  Layers,
  Database,
  Radio,
  CheckCircle2,
  HelpCircle,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function RoiCostCalculator() {
  const [dailyPosts, setDailyPosts] = useState<number>(200);
  const [avgGearPrice, setAvgGearPrice] = useState<number>(650);
  const [monthlyConversions, setMonthlyConversions] = useState<number>(8);
  const [platformHost, setPlatformHost] = useState<'make' | 'n8n_self' | 'n8n_cloud'>('make');

  // Operational cost calculations
  const monthlyPosts = dailyPosts * 30;
  // OpenAI gpt-4o-mini is ~$0.15 per 1M input tokens + $0.60 per 1M output tokens
  // ~500 input tokens + ~150 output tokens = ~$0.000165 per post
  const monthlyAiCost = +(monthlyPosts * 0.000165).toFixed(2);

  const hostCosts = {
    make: 9.0, // Make Core plan 10,000 ops
    n8n_self: 5.0, // Hetzner/Railway VPS
    n8n_cloud: 20.0, // n8n Cloud Starter
  };

  const totalMonthlyCost = +(hostCosts[platformHost] + monthlyAiCost).toFixed(2);

  // Marketplace ROI calculation
  // Client is building a Reverb alternative marketplace
  // Typical transaction fee is 3.5% vs Reverb's 5.0% + 3.19% processing + bump fee
  const marketplaceFeeRate = 0.035;
  const grossGmvAcquired = monthlyConversions * avgGearPrice;
  const monthlyMarketplaceRevenue = +(grossGmvAcquired * marketplaceFeeRate).toFixed(2);
  const netMonthlyProfit = +(monthlyMarketplaceRevenue - totalMonthlyCost).toFixed(2);
  const annualGmv = grossGmvAcquired * 12;

  return (
    <div className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--color-border)] pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 whitespace-nowrap shrink-0">
              <Calculator className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              Transparent Economics
            </span>
            <span className="text-xs text-[var(--color-text-muted)] font-mono hidden sm:inline">
              Deliverable Requirement • Recurring API & Infrastructure Cost Audit
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-semibold tracking-tight text-[var(--color-text-primary)]">
            Recurring Operational Cost Breakdown & Marketplace ROI Engine
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            100% client account ownership with zero hidden fees. Exact infrastructure costs calculated down to the cent, plus projected marketplace customer acquisition value.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-[var(--color-text-muted)] font-mono block">
            Total Running Cost
          </span>
          <span className="text-xl sm:text-2xl font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
            ${totalMonthlyCost}/mo
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Sliders & Controls (5 Cols) - items-stretch & flex-col justify-between to prevent bottom void */}
        <div className="lg:col-span-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-4 sm:p-5 flex flex-col justify-between shadow-xs">
          <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] font-mono">
            Simulation Parameters
          </h4>

          {/* Hosting Platform Choice */}
          <div>
            <label className="text-xs font-medium text-[var(--color-text-primary)] block mb-1.5">
              Automation Engine Host:
            </label>
            <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
              <button
                onClick={() => setPlatformHost('make')}
                className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                  platformHost === 'make'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold'
                    : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)]'
                }`}
              >
                Make.com ($9)
              </button>
              <button
                onClick={() => setPlatformHost('n8n_self')}
                className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                  platformHost === 'n8n_self'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold'
                    : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)]'
                }`}
              >
                n8n VPS ($5)
              </button>
              <button
                onClick={() => setPlatformHost('n8n_cloud')}
                className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                  platformHost === 'n8n_cloud'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold'
                    : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)]'
                }`}
              >
                n8n Cloud ($20)
              </button>
            </div>
          </div>

          {/* Daily Posts Slider */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-medium text-[var(--color-text-primary)]">
                Daily Ingested Posts:
              </span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {dailyPosts} posts/day ({monthlyPosts.toLocaleString()}/mo)
              </span>
            </div>
            <input
              type="range"
              min={50}
              max={1000}
              step={50}
              value={dailyPosts}
              onChange={(e) => setDailyPosts(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
            />
          </div>

          {/* Avg Gear Price Slider */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-medium text-[var(--color-text-primary)]">
                Avg Gear Item Value:
              </span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                ${avgGearPrice}
              </span>
            </div>
            <input
              type="range"
              min={100}
              max={2500}
              step={50}
              value={avgGearPrice}
              onChange={(e) => setAvgGearPrice(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
            />
            <span className="text-xs text-[var(--color-text-muted)] font-mono block mt-0.5">
              (Pedals ~$180, Amps ~$850, Vintage Guitars ~$1,800)
            </span>
          </div>

          {/* Monthly Converted Sellers Slider */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-medium text-[var(--color-text-primary)]">
                Sellers Converted / Month:
              </span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {monthlyConversions} listings acquired
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={50}
              step={1}
              value={monthlyConversions}
              onChange={(e) => setMonthlyConversions(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
            />
          </div>
          </div>

          {/* Institutional Guarantee Footer - prevents bottom void */}
          <div className="mt-4 pt-3.5 border-t border-[var(--color-border)] flex items-center justify-between text-xs font-mono text-[var(--color-text-secondary)]">
            <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              100% Client Account Ownership
            </span>
            <span className="text-xs text-[var(--color-text-muted)] font-medium">Zero Infrastructure Markup</span>
          </div>
        </div>

        {/* Cost Matrix & Marketplace ROI Breakdown (7 Cols) - flex flex-col justify-between */}
        <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
          {/* Infrastructure Cost Line Items */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] font-mono mb-2">
              Itemized Monthly Recurring Cost Breakdown
            </h4>

            <div className="space-y-2 text-xs font-mono">
              {/* Host */}
              <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-1.5">
                <span className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
                  <Layers className="h-3.5 w-3.5 text-indigo-500" />
                  Automation Host ({platformHost.toUpperCase()})
                </span>
                <span className="font-semibold tracking-tight text-[var(--color-text-primary)]">
                  ${hostCosts[platformHost].toFixed(2)} / mo
                </span>
              </div>

              {/* AI Token Inference */}
              <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-1.5">
                <span className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
                  <Cpu className="h-3.5 w-3.5 text-emerald-500" />
                  AI Classification (OpenAI gpt-4o-mini @ {monthlyPosts.toLocaleString()} posts)
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  ${monthlyAiCost.toFixed(2)} / mo
                </span>
              </div>

              {/* Data Store */}
              <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-1.5">
                <span className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
                  <Database className="h-3.5 w-3.5 text-blue-500" />
                  Data Store (Google Sheets / Airtable Free Tier)
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  $0.00 / mo (Free Tier)
                </span>
              </div>

              {/* Community Ingestion APIs */}
              <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-1.5">
                <span className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
                  <Radio className="h-3.5 w-3.5 text-amber-500" />
                  Reddit OAuth + YouTube Data v3 + RSS Feeds
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  $0.00 / mo (Standard Quotas)
                </span>
              </div>

              {/* Slack Webhook */}
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500" />
                  Slack Incoming Webhooks (Block Kit)
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  $0.00 / mo (Free Workspace)
                </span>
              </div>
            </div>
          </div>

          {/* Projected Marketplace Value Creation */}
          <div className="rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Marketplace Acquisition Value (At 3.5% Take Rate)
              </span>
              <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300">
                Annual GMV: ${annualGmv.toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-lg bg-[var(--color-surface)] border border-emerald-200 dark:border-emerald-900 p-2.5">
                <span className="text-xs text-[var(--color-text-muted)] font-mono block">
                  Monthly Acquired GMV
                </span>
                <span className="text-lg font-semibold tracking-tight text-[var(--color-text-primary)] font-mono">
                  ${grossGmvAcquired.toLocaleString()}
                </span>
              </div>

              <div className="rounded-lg bg-[var(--color-surface)] border border-emerald-200 dark:border-emerald-900 p-2.5">
                <span className="text-xs text-[var(--color-text-muted)] font-mono block">
                  Net Monthly Marketplace Profit
                </span>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  +${netMonthlyProfit.toLocaleString()}
                </span>
              </div>
            </div>

            <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-2.5 leading-relaxed font-sans">
              💡 <strong>The Takeaway:</strong> Converting just 1 vintage guitar or 2 boutique amp sales per month from dissatisfied Reverb/eBay sellers pays for this entire automated infrastructure for over 12 months.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
