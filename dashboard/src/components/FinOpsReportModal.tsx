'use client'

import { useState } from 'react'
import {
  FileText,
  Download,
  Printer,
  X,
  Cloud,
  CheckCircle2,
  TrendingDown,
  Building,
  Sparkles,
  ShieldAlert
} from 'lucide-react'
import { formatCurrency } from '@/lib/mockData'

interface FinOpsReportModalProps {
  isOpen: boolean
  onClose: () => void
  provider: string
  totalSpend: number
  wasteIdentified: number
  potentialSavings: number
}

export function FinOpsReportModal({
  isOpen,
  onClose,
  provider = 'all',
  totalSpend = 546041,
  wasteIdentified = 82400,
  potentialSavings = 988800
}: FinOpsReportModalProps) {
  const [isExportingCsv, setIsExportingCsv] = useState(false)
  const [activeTab, setActiveTab] = useState<'executive' | 'csv'>('executive')

  if (!isOpen) return null

  const handleDownloadCsv = () => {
    setIsExportingCsv(true)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    window.open(`${apiUrl}/api/reports/export-csv?provider=${provider}`, '_blank')
    setTimeout(() => setIsExportingCsv(false), 1000)
  }

  const handlePrint = () => {
    window.print()
  }

  const providerTitle = provider === 'all' ? 'Multi-Cloud (AWS + Azure + GCP)' : provider.toUpperCase()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 overflow-y-auto animate-fade-in print:p-0 print:bg-white">
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden my-8 print:border-none print:shadow-none print:max-w-none">
        {/* MODAL HEADER (Hidden on Print) */}
        <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white p-5 flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-600/40 rounded-xl border border-indigo-400/30">
              <FileText className="w-6 h-6 text-indigo-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Enterprise FinOps Cost & ROI Report</h3>
              <p className="text-xs text-indigo-200">
                Automated Multi-Cloud FinOps Intelligence • Scope: {providerTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadCsv}
              disabled={isExportingCsv}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExportingCsv ? 'Generating CSV...' : 'Download CSV'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE EXECUTIVE REPORT CONTENT */}
        <div className="p-8 space-y-6 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-900 print:p-0 print:bg-white print:text-black">
          {/* Executive Header */}
          <div className="border-b border-gray-200 dark:border-gray-800 pb-5 flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <Cloud className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xl font-extrabold tracking-tight">
                  CLOUD COST INTELLIGENCE PLATFORM
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Executive FinOps Multi-Cloud Spend & Optimization Assessment
              </p>
            </div>

            <div className="text-right text-xs text-gray-500">
              <p>Generated: <strong>{new Date().toLocaleDateString()}</strong></p>
              <p>Environment: <strong>Production Multi-Cloud</strong></p>
              <p>Report ID: <span className="font-mono">FINOPS-{Date.now().toString().slice(-6)}</span></p>
            </div>
          </div>

          {/* Key Metric Tiles */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-slate-800/60 rounded-xl border border-gray-200 dark:border-slate-700">
              <span className="text-xs text-gray-500 dark:text-gray-400 block font-medium">Total Monthly Cloud Spend</span>
              <span className="text-2xl font-black text-gray-900 dark:text-white mt-1 block">
                {formatCurrency(totalSpend)}
              </span>
              <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1 block">
                Scope: {providerTitle}
              </span>
            </div>

            <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-900/60">
              <span className="text-xs text-red-600 dark:text-red-400 block font-medium">Identified Cloud Waste</span>
              <span className="text-2xl font-black text-red-600 dark:text-red-400 mt-1 block">
                {formatCurrency(wasteIdentified)}
              </span>
              <span className="text-[11px] text-red-500 font-semibold mt-1 block">
                {((wasteIdentified / (totalSpend || 1)) * 100).toFixed(1)}% of total budget
              </span>
            </div>

            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-900/60">
              <span className="text-xs text-emerald-600 dark:text-emerald-400 block font-medium">Potential Annual ROI</span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
                {formatCurrency(wasteIdentified * 12)}
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 block">
                100% addressable via AI Auto-Remediation
              </span>
            </div>
          </div>

          {/* Multi-Cloud Spend Breakdown Table */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-3 flex items-center space-x-1.5">
              <span>Multi-Cloud Portfolio Distribution</span>
            </h4>
            <div className="border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-bold border-b border-gray-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3">Cloud Provider</th>
                    <th className="p-3">Monthly Spend</th>
                    <th className="p-3">Portfolio Share</th>
                    <th className="p-3">Identified Waste</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                  <tr>
                    <td className="p-3 font-bold text-amber-700 dark:text-amber-400">🟧 Amazon Web Services (AWS)</td>
                    <td className="p-3 font-mono">{formatCurrency(totalSpend * 0.39)}</td>
                    <td className="p-3">39.0%</td>
                    <td className="p-3 font-semibold text-red-600">{formatCurrency(wasteIdentified * 0.45)}</td>
                    <td className="p-3 text-emerald-600 font-bold">Active Synced</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-blue-700 dark:text-blue-400">🔷 Microsoft Azure</td>
                    <td className="p-3 font-mono">{formatCurrency(totalSpend * 0.35)}</td>
                    <td className="p-3">35.0%</td>
                    <td className="p-3 font-semibold text-red-600">{formatCurrency(wasteIdentified * 0.32)}</td>
                    <td className="p-3 text-emerald-600 font-bold">Active Synced</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-rose-700 dark:text-rose-400">🔴 Google Cloud Platform (GCP)</td>
                    <td className="p-3 font-mono">{formatCurrency(totalSpend * 0.26)}</td>
                    <td className="p-3">26.0%</td>
                    <td className="p-3 font-semibold text-red-600">{formatCurrency(wasteIdentified * 0.23)}</td>
                    <td className="p-3 text-emerald-600 font-bold">Active Synced</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Recommended Optimization Actions */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-3 flex items-center space-x-1.5">
              <span>Top AI FinOps Remediation Directives</span>
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-lg flex items-center justify-between border border-gray-200 dark:border-slate-800">
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Convert on-demand GPU clusters (AWS & GCP) to Spot + 1-Yr Savings Plan</span>
                </div>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">+$220,800/yr</span>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-lg flex items-center justify-between border border-gray-200 dark:border-slate-800">
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Prune unattached Azure Disks & AWS EBS volumes across development accounts</span>
                </div>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">+$88,800/yr</span>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-lg flex items-center justify-between border border-gray-200 dark:border-slate-800">
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Enable GCS Nearline / S3 Glacier automated object storage tiering</span>
                </div>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">+$70,800/yr</span>
              </div>
            </div>
          </div>

          {/* FinOps Sign-off Footer */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-[11px] text-gray-500">
            <span>Prepared by: AI-Powered Cloud Cost Intelligence Engine</span>
            <span>Compliance: FinOps Foundation Open Cost Standards</span>
          </div>
        </div>
      </div>
    </div>
  )
}
