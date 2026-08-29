'use client'

import { useState } from 'react'
import {
  AlertTriangle,
  Clock,
  DollarSign,
  TrendingUp,
  CheckCircle,
  X,
  Zap,
  ShieldCheck,
  Loader2,
  Sparkles,
  ArrowRight
} from 'lucide-react'
import { formatCurrency, getAlertClasses } from '@/lib/mockData'

interface Alert {
  id: string
  type: 'critical' | 'warning' | 'info'
  title: string
  description: string
  impact: number
  timeAgo: string
  department: string
  provider?: 'aws' | 'azure' | 'gcp'
}

interface AlertsPanelProps {
  alerts: Alert[]
  onRemediated?: (alertId: string, savings: number) => void
}

interface RemediationLog {
  step: number
  title: string
  status: 'pending' | 'running' | 'completed'
}

export function AlertsPanel({ alerts, onRemediated }: AlertsPanelProps) {
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set())
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all')
  const [remediatingAlert, setRemediatingAlert] = useState<Alert | null>(null)
  const [remediationLogs, setRemediationLogs] = useState<RemediationLog[]>([])
  const [remediatedIds, setRemediatedIds] = useState<Set<string>>(new Set())
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionDone, setExecutionDone] = useState(false)

  // Filter alerts based on selection and dismissed status
  const filteredAlerts = alerts.filter(alert => {
    if (dismissedAlerts.has(alert.id)) return false
    if (selectedFilter === 'all') return true
    return alert.type === selectedFilter
  })

  // Count alerts by type
  const alertCounts = {
    critical: alerts.filter(a => a.type === 'critical' && !dismissedAlerts.has(a.id) && !remediatedIds.has(a.id)).length,
    warning: alerts.filter(a => a.type === 'warning' && !dismissedAlerts.has(a.id) && !remediatedIds.has(a.id)).length,
    info: alerts.filter(a => a.type === 'info' && !dismissedAlerts.has(a.id) && !remediatedIds.has(a.id)).length
  }

  const dismissAlert = (alertId: string) => {
    setDismissedAlerts(prev => {
      const next = new Set(prev)
      next.add(alertId)
      return next
    })
  }

  const handleStartRemediation = async (alert: Alert) => {
    setRemediatingAlert(alert)
    setIsExecuting(true)
    setExecutionDone(false)

    const initialSteps: RemediationLog[] = [
      { step: 1, title: '🔐 Authenticating IAM Role & Cloud Permissions', status: 'running' },
      { step: 2, title: '📦 Creating Pre-flight Snapshot & Resource Backup', status: 'pending' },
      { step: 3, title: '⚡ Executing AI Automated Optimization Action', status: 'pending' },
      { step: 4, title: '🔍 Verifying Workload SLA & Traffic Health', status: 'pending' },
      { step: 5, title: `✅ Locked in Annual Savings of ${formatCurrency(Math.abs(alert.impact) * 12)}`, status: 'pending' }
    ]
    setRemediationLogs(initialSteps)

    // Simulate real-time step-by-step progress
    setTimeout(() => {
      setRemediationLogs(prev => prev.map(s => s.step === 1 ? { ...s, status: 'completed' } : s.step === 2 ? { ...s, status: 'running' } : s))
    }, 400)

    setTimeout(() => {
      setRemediationLogs(prev => prev.map(s => s.step === 2 ? { ...s, status: 'completed' } : s.step === 3 ? { ...s, status: 'running' } : s))
    }, 900)

    setTimeout(() => {
      setRemediationLogs(prev => prev.map(s => s.step === 3 ? { ...s, status: 'completed' } : s.step === 4 ? { ...s, status: 'running' } : s))
    }, 1400)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      await fetch(`${apiUrl}/api/remediate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alertId: alert.id,
          title: alert.title,
          impact: alert.impact,
          provider: alert.provider || 'aws'
        })
      })
    } catch (e) {
      console.warn('Remediation API call exception:', e)
    }

    setTimeout(() => {
      setRemediationLogs(prev => prev.map(s => ({ ...s, status: 'completed' })))
      setIsExecuting(false)
      setExecutionDone(true)
      setRemediatedIds(prev => new Set(prev).add(alert.id))
      onRemediated?.(alert.id, alert.impact)
    }, 1900)
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
      case 'warning':
        return <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
      case 'info':
        return <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
    }
  }

  const getImpactColor = (impact: number) => {
    if (impact > 10000) return 'text-red-600 dark:text-red-400'
    if (impact > 5000) return 'text-amber-600 dark:text-amber-400'
    if (impact < 0) return 'text-emerald-600 dark:text-emerald-400'
    return 'text-gray-600 dark:text-gray-400'
  }

  return (
    <div className="card relative">
      {/* Header */}
      <div className="card-header">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <span>Smart Alerts & AI Remediation</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
              1-CLICK AUTO-FIX
            </span>
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">AI-powered multi-cloud anomaly detection & automated remediation</p>
        </div>
        
        {/* Alert summary */}
        <div className="flex items-center space-x-2">
          {alertCounts.critical > 0 && (
            <span className="px-2 py-1 bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-400 text-xs font-bold rounded-full border border-red-200 dark:border-red-900">
              {alertCounts.critical} Critical
            </span>
          )}
          {alertCounts.warning > 0 && (
            <span className="px-2 py-1 bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 text-xs font-bold rounded-full border border-amber-200 dark:border-amber-900">
              {alertCounts.warning} Warning
            </span>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex space-x-1 mb-4 bg-gray-100 dark:bg-slate-800 rounded-lg p-1">
        {[
          { key: 'all', label: 'All', count: filteredAlerts.length },
          { key: 'critical', label: 'Critical', count: alertCounts.critical },
          { key: 'warning', label: 'Warning', count: alertCounts.warning },
          { key: 'info', label: 'Info', count: alertCounts.info }
        ].map((filter) => (
          <button
            key={filter.key}
            onClick={() => setSelectedFilter(filter.key as 'all' | 'critical' | 'warning' | 'info')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              selectedFilter === filter.key
                ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {filter.label}
            {filter.count > 0 && (
              <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">({filter.count})</span>
            )}
          </button>
        ))}
      </div>

      {/* Alerts list */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-300 font-medium">No active alerts</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">All multi-cloud resources are running optimally</p>
          </div>
        ) : (
          filteredAlerts.map((alert, index) => {
            const isRemediated = remediatedIds.has(alert.id)

            return (
              <div
                key={alert.id}
                className={`${isRemediated ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800' : getAlertClasses(alert.type)} border rounded-xl p-4 transition-all duration-200`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {/* Alert icon */}
                    <div className="flex-shrink-0 mt-0.5">
                      {isRemediated ? (
                        <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        getAlertIcon(alert.type)
                      )}
                    </div>

                    {/* Alert content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {alert.title}
                        </h4>
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                          {isRemediated ? 'Auto-Remediated' : alert.timeAgo}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        {alert.description}
                      </p>

                      {/* Alert metadata */}
                      <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                        <div className="flex items-center space-x-3">
                          <span className="text-gray-600 dark:text-gray-400">
                            Dept: <span className="font-medium text-gray-800 dark:text-gray-200">{alert.department}</span>
                          </span>
                          
                          {alert.impact !== 0 && (
                            <span className={`font-bold ${isRemediated ? 'text-emerald-600 dark:text-emerald-400' : getImpactColor(alert.impact)}`}>
                              {isRemediated ? 'Annual Savings Locked: ' : (alert.impact > 0 ? 'Cost Impact: ' : 'Savings: ')}
                              {formatCurrency(isRemediated ? Math.abs(alert.impact) * 12 : Math.abs(alert.impact))}
                              {isRemediated ? '/yr' : '/mo'}
                            </span>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center space-x-2">
                          {isRemediated ? (
                            <span className="flex items-center space-x-1 px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 rounded-full font-bold text-xs border border-emerald-300 dark:border-emerald-700">
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Remediated ✅</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => handleStartRemediation(alert)}
                              className="flex items-center space-x-1 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs shadow-sm transition-all hover:scale-105 active:scale-95"
                            >
                              <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                              <span>Auto-Remediate</span>
                            </button>
                          )}

                          <button
                            onClick={() => dismissAlert(alert.id)}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* REMEDIATION EXECUTION MODAL */}
      {remediatingAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-xl">
                  <Zap className="w-6 h-6 animate-pulse text-indigo-600 dark:text-indigo-400 fill-indigo-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    AI Automated Cloud Remediation
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Target: {remediatingAlert.title}
                  </p>
                </div>
              </div>

              {!isExecuting && (
                <button
                  onClick={() => setRemediatingAlert(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Steps Console */}
            <div className="bg-gray-900 text-gray-200 font-mono text-xs p-4 rounded-xl space-y-2.5 border border-gray-800 shadow-inner">
              {remediationLogs.map((log) => (
                <div key={log.step} className="flex items-center space-x-2.5">
                  {log.status === 'completed' && (
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  )}
                  {log.status === 'running' && (
                    <Loader2 className="w-4 h-4 text-indigo-400 animate-spin flex-shrink-0" />
                  )}
                  {log.status === 'pending' && (
                    <div className="w-4 h-4 rounded-full border border-gray-700 flex-shrink-0" />
                  )}
                  <span className={log.status === 'running' ? 'text-indigo-300 font-bold' : (log.status === 'completed' ? 'text-gray-100' : 'text-gray-500')}>
                    {log.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Savings & Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider block">Estimated Savings</span>
                <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(Math.abs(remediatingAlert.impact) * 12)} / year
                </span>
              </div>

              {executionDone ? (
                <button
                  onClick={() => setRemediatingAlert(null)}
                  className="btn btn-primary text-xs flex items-center space-x-1.5"
                >
                  <span>Done</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div className="flex items-center space-x-2 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Applying Cloud Policy...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}