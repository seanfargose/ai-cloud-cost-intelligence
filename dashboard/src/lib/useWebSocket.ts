'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

export interface WebSocketAlert {
  id: string
  type: 'critical' | 'warning' | 'info'
  provider?: 'aws' | 'azure' | 'gcp'
  title: string
  description: string
  impact: number
  department?: string
  timeAgo?: string
  timestamp?: string
}

interface UseWebSocketOptions {
  url?: string
  onAlert?: (alert: WebSocketAlert) => void
  onCostUpdate?: (data: any) => void
  enabled?: boolean
}

export function useWebSocket({
  url = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000',
  onAlert,
  onCostUpdate,
  enabled = true,
}: UseWebSocketOptions = {}) {
  const [isConnected, setIsConnected] = useState(false)
  const [recentAlerts, setRecentAlerts] = useState<WebSocketAlert[]>([])
  const [lastMessageTime, setLastMessageTime] = useState<Date | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttemptsRef = useRef(0)

  const connect = useCallback(() => {
    if (!enabled || typeof window === 'undefined') return

    // Derive correct WS protocol (ws:// or wss://) based on page protocol
    let wsUrl = url
    if (!wsUrl.startsWith('ws://') && !wsUrl.startsWith('wss://')) {
      const isHttps = window.location.protocol === 'https:'
      const host = window.location.hostname
      wsUrl = `${isHttps ? 'wss' : 'ws'}://${host}:8000`
    }

    try {
      console.log(`🔌 Connecting to Multi-Cloud WebSocket: ${wsUrl}`)
      const ws = new WebSocket(wsUrl)
      wsRef.current = ws

      ws.onopen = () => {
        console.log('✅ Multi-Cloud WebSocket connected')
        setIsConnected(true)
        reconnectAttemptsRef.current = 0

        // Subscribe to anomaly alerts and cost updates
        ws.send(JSON.stringify({
          type: 'subscribe',
          data: { type: 'anomaly_alerts' }
        }))

        ws.send(JSON.stringify({
          type: 'subscribe',
          data: { type: 'cost_updates' }
        }))
      }

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data)
          setLastMessageTime(new Date())

          if (payload.type === 'anomaly_alert' || payload.type === 'live_alert' || payload.type === 'anomalies_detected') {
            const alertData: WebSocketAlert = payload.data?.alert || payload.data || payload
            if (alertData.title) {
              setRecentAlerts((prev) => [alertData, ...prev.slice(0, 19)])
              onAlert?.(alertData)
            }
          }

          if (payload.type === 'cost_data_updated' || payload.type === 'telemetry_update') {
            onCostUpdate?.(payload.data)
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err)
        }
      }

      ws.onclose = (event) => {
        console.log(`🔌 WebSocket connection closed (code: ${event.code})`)
        setIsConnected(false)
        wsRef.current = null

        // Auto-reconnect with exponential backoff (capped at 10s)
        const delay = Math.min(1000 * Math.pow(1.5, reconnectAttemptsRef.current), 10000)
        reconnectAttemptsRef.current += 1

        reconnectTimeoutRef.current = setTimeout(() => {
          connect()
        }, delay)
      }

      ws.onerror = (error) => {
        console.warn('WebSocket connection error:', error)
      }
    } catch (err) {
      console.warn('WebSocket initialization exception:', err)
    }
  }, [url, enabled, onAlert, onCostUpdate])

  useEffect(() => {
    connect()

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [connect])

  const sendQuery = useCallback((query: string, context?: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'query',
        data: { query, context }
      }))
      return true
    }
    return false
  }, [])

  return {
    isConnected,
    recentAlerts,
    lastMessageTime,
    sendQuery,
  }
}
