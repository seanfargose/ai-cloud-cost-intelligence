'use client'

import { useState } from 'react'
import {
  Bell,
  Search,
  Settings,
  User,
  AlertTriangle,
  Sun,
  Moon,
  Cloud,
} from 'lucide-react'

interface DashboardHeaderProps {
  selectedTimeframe: string
  onTimeframeChange: (timeframe: string) => void
  selectedProvider?: string
  onProviderChange?: (provider: string) => void
}

export function DashboardHeader({
  selectedTimeframe,
  onTimeframeChange,
  selectedProvider = 'all',
  onProviderChange,
}: DashboardHeaderProps) {
  const [notificationCount] = useState(7)
  const [darkMode, setDarkMode] = useState(false)

  const timeframes = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
  ]

  const providers = [
    { value: 'all', label: '🌐 All Clouds (Multi-Cloud)' },
    { value: 'azure', label: '🔷 Microsoft Azure' },
    { value: 'aws', label: '🟧 Amazon Web Services' },
    { value: 'gcp', label: '🔴 Google Cloud Platform' },
  ]

  const toggleTheme = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      {/* MAIN HEADER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* LEFT SIDE - BRAND */}
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <div className="w-12 h-12 bg-gradient-to-tr from-primary-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
              <Cloud className="w-7 h-7 text-white" />
            </div>

            {/* Title */}
            <div>
              <p className="text-xs font-semibold tracking-widest text-primary-600 dark:text-primary-400 uppercase">
                Multi-Cloud Intelligence
              </p>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Cloud Cost Intelligence Platform
              </h1>
            </div>
          </div>

          {/* RIGHT SIDE - CONTROLS */}
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* DASHBOARD NAVIGATION & MULTI-CLOUD SELECTOR */}
      <div className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between py-3 gap-3">
            {/* LEFT - CLOUD PROVIDER SELECTOR */}
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:inline">
                Cloud:
              </span>
              <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-full sm:w-auto border border-gray-200 dark:border-gray-700">
                {providers.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => onProviderChange?.(p.value)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      selectedProvider === p.value
                        ? 'bg-white dark:bg-gray-900 text-primary-600 dark:text-primary-400 shadow-sm border border-gray-200 dark:border-gray-700'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* CENTER - TIMEFRAME */}
            <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
              <label
                htmlFor="timeframe"
                className="text-xs font-bold text-gray-500 uppercase tracking-wider"
              >
                Period:
              </label>

              <select
                id="timeframe"
                value={selectedTimeframe}
                onChange={(e) => onTimeframeChange(e.target.value)}
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {timeframes.map((tf) => (
                  <option key={tf.value} value={tf.value}>
                    {tf.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK STATUS BAR */}
      <div className="bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2 text-xs">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse" />
                <span className="text-gray-600 dark:text-gray-400">
                  AWS • Azure • GCP Live Sync
                </span>
              </div>

              <div className="hidden sm:flex items-center space-x-2">
                <AlertTriangle className="w-3.5 h-3.5 text-warning-500" />
                <span className="text-gray-600 dark:text-gray-400">
                  Multi-Cloud Anomaly Detection Active
                </span>
              </div>
            </div>

            <div className="text-gray-500 dark:text-gray-400">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}