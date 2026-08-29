'use client'

import { useState, useEffect } from 'react'
import {
  AlertTriangle,
  X,
  Zap,
  TrendingUp,
  ShieldAlert,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { formatCurrency } from '@/lib/mockData'
import { WebSocketAlert } from '@/lib/useWebSocket'

interface LiveAlertToastProps {
  alerts: WebSocketAlert[]
  onDismiss: (id: string) => void
  onSimulate?: () => void
  isWsConnected?: boolean
}

export function LiveAlertToast({
  alerts,
  onDismiss,
  onSimulate,
  isWsConnected = true,
}: LiveAlertToastProps) {
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [isSimulating, setIsSimulating] = useState(false)

  const activeAlert = alerts[0]

  const triggerSimulate = async () => {
    setIsSimulating(true)
    try {
      if (onSimulate) {
        await onSimulate()
      } else {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
        await fetch(`${apiUrl}/api/simulate-anomaly`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        })
      }
    } catch (e) {
      console.error('Simulation error:', e)
    } finally {
      setTimeout(() => setIsSimulating(false), 800)
    }
  }

  const getProviderBadge = (provider?: string) => {
    switch (provider) {
      case 'aws':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            AWS us-east-1
          </span>
        )
      case 'gcp':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
            GCP us-central1
          </span>
        )
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
            Azure eastus
          </span>
        )
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end space-y-3 max-w-md w-full px-4 sm:px-0">
      {/* Interactive Simulation / WebSocket Status Pill */}
      <div className="flex items-center space-x-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-800 shadow-sm text-xs">
        <div className="flex items-center space-x-1.5">
          <span className={`w-2 h-2 rounded-full ${isWsConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
          <span className="text-gray-600 dark:text-gray-400 text-[11px] font-medium">
            {isWsConnected ? 'WebSocket Live Feed' : 'Connecting...'}
          </span>
        </div>

        <span className="text-gray-300 dark:text-gray-700">|</span>

        <button
          onClick={triggerSimulate}
          disabled={isSimulating}
          className="flex items-center space-x-1 text-primary-600 dark:text-primary-400 font-bold hover:underline text-[11px] disabled:opacity-50"
        >
          <Zap className={`w-3 h-3 ${isSimulating ? 'animate-spin' : ''}`} />
          <span>{isSimulating ? 'Triggering...' : 'Simulate Live Anomaly'}</span>
        </button>
      </div>

      {/* Floating Active Toast Alert */}
      {activeAlert && (
        <div className="w-full bg-white dark:bg-gray-900 border-2 border-red-500/80 dark:border-red-500/80 shadow-2xl rounded-2xl p-4 animate-slide-up transition-all overflow-hidden relative">
          {/* Animated Red Pulse Header */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 animate-pulse" />

          <div className="flex items-start justify-between gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 rounded-xl flex-shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5 animate-bounce" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 flex-wrap gap-y-1 mb-1">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-600 text-white uppercase tracking-wider">
                  REAL-TIME ANOMALY
                </span>
                {getProviderBadge(activeAlert.provider)}
                <span className="text-[10px] text-gray-500 dark:text-gray-400">
                  {activeAlert.timeAgo || 'Just now'}
                </span>
              </div>

              <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-snug">
                {activeAlert.title}
              </h4>

              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                {activeAlert.description}
              </p>

              <div className="mt-2.5 pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 block">Est. Cost Impact:</span>
                  <span className="text-sm font-extrabold text-red-600 dark:text-red-400">
                    +{formatCurrency(activeAlert.impact)}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">
                    Dept: <strong>{activeAlert.department || 'Engineering'}</strong>
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onDismiss(activeAlert.id)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Dismiss alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
