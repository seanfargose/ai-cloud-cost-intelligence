'use client'

import { useState } from 'react'
import {
  Layers,
  ArrowRightLeft,
  Sparkles,
  TrendingDown,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ExternalLink
} from 'lucide-react'
import { formatCurrency } from '@/lib/mockData'

interface MultiCloudBreakdownProps {
  currentProvider: string
  totalSpend: number
}

interface ProviderSummary {
  name: string
  key: 'aws' | 'azure' | 'gcp'
  color: string
  accentColor: string
  textColor: string
  spend: number
  percentage: number
  topService: string
  topServiceCost: number
  commitmentCoverage: number
  instancesRunning: number
  potentialSavings: number
}

interface ArbitrageOpportunity {
  workload: string
  currentCloud: 'AWS' | 'Azure' | 'GCP'
  targetCloud: 'AWS' | 'Azure' | 'GCP'
  reason: string
  currentMonthlyCost: number
  projectedMonthlyCost: number
  monthlySavings: number
  savingsPercent: number
  migrationComplexity: 'Low' | 'Medium' | 'High'
}

export function MultiCloudBreakdown({
  currentProvider,
  totalSpend,
}: MultiCloudBreakdownProps) {
  const [activeTab, setActiveTab] = useState<'comparison' | 'arbitrage'>('comparison')
  const [selectedOpportunity, setSelectedOpportunity] = useState<ArbitrageOpportunity | null>(null)

  const providers: ProviderSummary[] = [
    {
      name: 'Amazon Web Services',
      key: 'aws',
      color: 'from-amber-500/20 to-orange-500/10 border-orange-200 dark:border-orange-900/60',
      accentColor: 'bg-amber-500',
      textColor: 'text-amber-600 dark:text-amber-400',
      spend: Math.round(totalSpend * 0.39),
      percentage: 39,
      topService: 'Amazon EC2 (c6i.2xlarge)',
      topServiceCost: Math.round(totalSpend * 0.18),
      commitmentCoverage: 74,
      instancesRunning: 142,
      potentialSavings: 16975,
    },
    {
      name: 'Microsoft Azure',
      key: 'azure',
      color: 'from-blue-500/20 to-cyan-500/10 border-blue-200 dark:border-blue-900/60',
      accentColor: 'bg-blue-500',
      textColor: 'text-blue-600 dark:text-blue-400',
      spend: Math.round(totalSpend * 0.35),
      percentage: 35,
      topService: 'Azure Virtual Machines & SQL',
      topServiceCost: Math.round(totalSpend * 0.15),
      commitmentCoverage: 68,
      instancesRunning: 118,
      potentialSavings: 8400,
    },
    {
      name: 'Google Cloud Platform',
      key: 'gcp',
      color: 'from-rose-500/20 to-red-500/10 border-rose-200 dark:border-rose-900/60',
      accentColor: 'bg-rose-500',
      textColor: 'text-rose-600 dark:text-rose-400',
      spend: Math.round(totalSpend * 0.26),
      percentage: 26,
      topService: 'Google Compute Engine & BigQuery',
      topServiceCost: Math.round(totalSpend * 0.12),
      commitmentCoverage: 52,
      instancesRunning: 86,
      potentialSavings: 15540,
    },
  ]

  const arbitrageOpportunities: ArbitrageOpportunity[] = [
    {
      workload: 'Batch AI Model Retraining Pipelines',
      currentCloud: 'AWS',
      targetCloud: 'GCP',
      reason: 'GCP Cloud TPU v5e & Vertex AI Spot Instances offer 42% lower cost per FLOPS compared to on-demand EC2 p4d instances.',
      currentMonthlyCost: 18400,
      projectedMonthlyCost: 10680,
      monthlySavings: 7720,
      savingsPercent: 42,
      migrationComplexity: 'Low',
    },
    {
      workload: 'Analytical Data Warehouse & BI Queries',
      currentCloud: 'Azure',
      targetCloud: 'GCP',
      reason: 'Migrating serverless analytics from Azure Synapse to BigQuery Edition Slots eliminates idle query compute overprovisioning.',
      currentMonthlyCost: 14200,
      projectedMonthlyCost: 8800,
      monthlySavings: 5400,
      savingsPercent: 38,
      migrationComplexity: 'Medium',
    },
    {
      workload: 'Enterprise Microservices & Core PostgreSQL',
      currentCloud: 'GCP',
      targetCloud: 'Azure',
      reason: 'Azure Flexible Server PostgreSQL + 3-Year Reserved Instances delivers higher memory/dollar ratio than Cloud SQL.',
      currentMonthlyCost: 9800,
      projectedMonthlyCost: 6650,
      monthlySavings: 3150,
      savingsPercent: 32,
      migrationComplexity: 'Medium',
    },
    {
      workload: 'Cold Log Archival & Compliance Storage',
      currentCloud: 'Azure',
      targetCloud: 'AWS',
      reason: 'S3 Glacier Flexible Retrieval with automatic lifecycle policies is 60% cheaper than Azure Hot Blob Storage.',
      currentMonthlyCost: 6500,
      projectedMonthlyCost: 2600,
      monthlySavings: 3900,
      savingsPercent: 60,
      migrationComplexity: 'Low',
    },
  ]

  const totalArbitrageSavings = arbitrageOpportunities.reduce((sum, o) => sum + o.monthlySavings, 0)

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="card-header flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 rounded-lg text-indigo-600 dark:text-indigo-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Multi-Cloud Intelligence & Cross-Cloud Arbitrage
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Blended telemetry and workload placement optimization across AWS, Azure, and GCP
            </p>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'comparison'
                ? 'bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            Provider Comparison
          </button>
          <button
            onClick={() => setActiveTab('arbitrage')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1 ${
              activeTab === 'arbitrage'
                ? 'bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI Arbitrage Calculator</span>
          </button>
        </div>
      </div>

      {activeTab === 'comparison' ? (
        /* PROVIDER COMPARISON TAB */
        <div className="space-y-6">
          {/* Provider Distribution Bar */}
          <div>
            <div className="flex items-center justify-between text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
              <span>Enterprise Cloud Spend Distribution</span>
              <span className="font-semibold text-gray-900 dark:text-white">Total: {formatCurrency(totalSpend)}</span>
            </div>
            <div className="h-3.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex p-0.5 gap-0.5">
              <div style={{ width: '39%' }} className="bg-amber-500 rounded-l-full" title="AWS: 39%" />
              <div style={{ width: '35%' }} className="bg-blue-500" title="Azure: 35%" />
              <div style={{ width: '26%' }} className="bg-rose-500 rounded-r-full" title="GCP: 26%" />
            </div>
            <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 mt-1.5 px-1">
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                <span>AWS (39%)</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                <span>Azure (35%)</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                <span>GCP (26%)</span>
              </span>
            </div>
          </div>

          {/* Three Provider Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {providers.map((p) => (
              <div
                key={p.key}
                className={`p-4 rounded-xl border bg-gradient-to-br ${p.color} transition-all hover:shadow-md`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className={`w-3 h-3 rounded-full ${p.accentColor}`} />
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">{p.name}</h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-gray-600 dark:text-gray-300">
                    {p.percentage}% share
                  </span>
                </div>

                <div className="text-xl font-extrabold text-gray-900 dark:text-white mb-3">
                  {formatCurrency(p.spend)}
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Top Service:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-200 truncate max-w-[150px]">{p.topService}</span>
                  </div>

                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Discount Coverage:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{p.commitmentCoverage}%</span>
                  </div>

                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Active Workloads:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-200">{p.instancesRunning} instances</span>
                  </div>

                  <div className="pt-2 border-t border-gray-200/60 dark:border-gray-700/60 flex justify-between items-center text-xs">
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium">Recoverable:</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">{formatCurrency(p.potentialSavings)}/mo</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ARBITRAGE CALCULATOR TAB */
        <div className="space-y-4">
          <div className="p-3.5 bg-indigo-50/70 dark:bg-indigo-950/30 rounded-xl border border-indigo-200 dark:border-indigo-900/60 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <div>
                <h5 className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                  Cross-Cloud Workload Placement Arbitrage
                </h5>
                <p className="text-[11px] text-indigo-700 dark:text-indigo-400">
                  Our AI analyzed resource pricing models across AWS, Azure, and GCP to identify high-margin placement opportunities.
                </p>
              </div>
            </div>
            <div className="text-right pl-4">
              <div className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                +{formatCurrency(totalArbitrageSavings)}/mo
              </div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wide">Total Arbitrage Yield</div>
            </div>
          </div>

          <div className="space-y-2.5">
            {arbitrageOpportunities.map((opp, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer"
                onClick={() => setSelectedOpportunity(selectedOpportunity === opp ? null : opp)}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-[11px] font-bold rounded text-gray-700 dark:text-gray-300">
                      {opp.currentCloud}
                    </span>
                    <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-950 text-[11px] font-bold rounded text-indigo-700 dark:text-indigo-300">
                      {opp.targetCloud}
                    </span>
                    <span className="font-semibold text-xs text-gray-900 dark:text-white ml-1">
                      {opp.workload}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      Save {formatCurrency(opp.monthlySavings)}/mo (-{opp.savingsPercent}%)
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      opp.migrationComplexity === 'Low'
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                        : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                    }`}>
                      {opp.migrationComplexity} Complexity
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  {opp.reason}
                </p>

                {selectedOpportunity === opp && (
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs animate-slide-up">
                    <div className="p-2.5 bg-gray-50 dark:bg-gray-800/60 rounded-lg">
                      <span className="text-gray-500 dark:text-gray-400 text-[10px]">Current ({opp.currentCloud})</span>
                      <p className="font-semibold text-gray-900 dark:text-white mt-0.5">{formatCurrency(opp.currentMonthlyCost)}/mo</p>
                    </div>
                    <div className="p-2.5 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-lg border border-emerald-200/50 dark:border-emerald-800/50">
                      <span className="text-emerald-700 dark:text-emerald-400 text-[10px]">Projected ({opp.targetCloud})</span>
                      <p className="font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">{formatCurrency(opp.projectedMonthlyCost)}/mo</p>
                    </div>
                    <div className="p-2.5 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-lg border border-indigo-200/50 dark:border-indigo-800/50">
                      <span className="text-indigo-700 dark:text-indigo-400 text-[10px]">Annual Impact</span>
                      <p className="font-semibold text-indigo-700 dark:text-indigo-400 mt-0.5">+{formatCurrency(opp.monthlySavings * 12)}/yr</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
