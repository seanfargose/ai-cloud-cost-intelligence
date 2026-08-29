'use client'

import { useState } from 'react'
import {
  Bell,
  Search,
  Settings,
  User as UserIcon,
  AlertTriangle,
  Sun,
  Moon,
  Cloud,
  FileText,
  Download,
  Key,
  LogOut,
  Sparkles,
  ChevronDown,
  ShieldCheck,
  Building2,
  LogIn
} from 'lucide-react'
import Link from 'next/link'
import { FinOpsReportModal } from '@/components/FinOpsReportModal'
import { CloudConnectModal } from '@/components/CloudConnectModal'
import { useAuth, DEMO_PERSONAS, UserRole } from '@/lib/auth'

interface DashboardHeaderProps {
  selectedTimeframe: string
  onTimeframeChange: (timeframe: string) => void
  selectedProvider?: string
  onProviderChange?: (provider: string) => void
  totalSpend?: number
  wasteIdentified?: number
  potentialSavings?: number
}

export function DashboardHeader({
  selectedTimeframe,
  onTimeframeChange,
  selectedProvider = 'all',
  onProviderChange,
  totalSpend = 546041,
  wasteIdentified = 82400,
  potentialSavings = 988800,
}: DashboardHeaderProps) {
  const [notificationCount] = useState(7)
  const [darkMode, setDarkMode] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false)

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

  const { user, loginAsPersona, logout } = useAuth()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  return (
    <>
      <FinOpsReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        provider={selectedProvider}
        totalSpend={totalSpend}
        wasteIdentified={wasteIdentified}
        potentialSavings={potentialSavings}
      />

      <CloudConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
      />

      <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
        {/* MAIN HEADER */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* LEFT SIDE - BRAND */}
            <div className="flex items-center space-x-4">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="w-11 h-11 bg-gradient-to-tr from-primary-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <Cloud className="w-6 h-6 text-white" />
                </div>

                <div>
                  <p className="text-xs font-semibold tracking-widest text-primary-600 dark:text-primary-400 uppercase">
                    Multi-Cloud Intelligence
                  </p>
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                    Cloud Cost Intelligence
                  </h1>
                </div>
              </Link>
            </div>

            {/* RIGHT SIDE - CONTROLS & USER PROFILE */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={() => setIsConnectModalOpen(true)}
                className="hidden md:flex items-center space-x-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl text-xs font-bold transition-all border border-gray-300 dark:border-gray-700 shadow-sm"
              >
                <Key className="w-3.5 h-3.5 text-amber-500" />
                <span>Connect IAM</span>
              </button>

              <button
                onClick={() => setIsReportModalOpen(true)}
                className="hidden sm:flex items-center space-x-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all hover:scale-105 active:scale-95"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-200" />
                <span>FinOps Report</span>
              </button>

              <button
                onClick={toggleTheme}
                aria-label="Toggle dark mode"
                className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              >
                {darkMode ? (
                  <Sun className="w-4 h-4 text-yellow-400" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>

              {/* USER PROFILE & PERSONA DROPDOWN */}
              <div className="relative">
                {user ? (
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-left group cursor-pointer"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-500/30"
                    />
                    <div className="hidden lg:block text-left">
                      <div className="text-xs font-semibold text-gray-900 dark:text-white leading-tight flex items-center gap-1.5">
                        <span>{user.name}</span>
                        <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-transform" />
                      </div>
                      <span className={`inline-block px-1.5 py-0.2 text-[9px] font-medium rounded border ${user.badgeColor}`}>
                        {user.roleTitle}
                      </span>
                    </div>
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center space-x-1.5 px-3.5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </Link>
                )}

                {/* USER DROPDOWN MENU */}
                {isUserMenuOpen && user && (
                  <div
                    className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden py-2"
                    onMouseLeave={() => setIsUserMenuOpen(false)}
                  >
                    {/* Active User Summary */}
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-500/40"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                            {user.name}
                          </p>
                          <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                          <span className={`inline-block px-1.5 py-0.5 mt-1 text-[10px] font-semibold rounded border ${user.badgeColor}`}>
                            {user.roleTitle}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Switch Persona / Role */}
                    <div className="px-3 py-2">
                      <div className="flex items-center justify-between px-2 py-1">
                        <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                          Quick Persona Switcher
                        </span>
                        <Sparkles className="w-3 h-3 text-amber-500" />
                      </div>

                      <div className="mt-1 space-y-1">
                        {DEMO_PERSONAS.map((persona) => (
                          <button
                            key={persona.id}
                            type="button"
                            onClick={() => {
                              loginAsPersona(persona.id)
                              setIsUserMenuOpen(false)
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                              user.id === persona.id
                                ? 'bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 font-semibold'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <img
                                src={persona.avatar}
                                alt={persona.name}
                                className="w-5 h-5 rounded-full object-cover"
                              />
                              <span className="truncate">{persona.name}</span>
                            </div>
                            <span className="text-[10px] text-gray-400">{persona.roleTitle.split(' ')[0]}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Menu Actions */}
                    <div className="border-t border-gray-100 dark:border-gray-800 pt-1 mt-1 px-1">
                      <Link
                        href="/login"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="w-full px-3 py-2 text-left text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg flex items-center gap-2"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-gray-400" />
                        <span>Sign In / Switch Account</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          logout()
                          setIsUserMenuOpen(false)
                        }}
                        className="w-full px-3 py-2 text-left text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
    </>
  )
}