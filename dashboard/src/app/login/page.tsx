'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Cloud,
  Shield,
  Zap,
  ArrowRight,
  UserCheck,
  Building2,
  Lock,
  Mail,
  CheckCircle2,
  TrendingUp,
  Sparkles
} from 'lucide-react'
import { useAuth, DEMO_PERSONAS } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const { login, loginAsPersona, isLoading } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError('Please enter a valid email address.')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      await login(email, password)
      router.push('/')
    } catch {
      setError('Failed to sign in. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleQuickPersonaSelect = (personaId: string) => {
    loginAsPersona(personaId)
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-primary-500 selection:text-white">
      {/* Dynamic Background Gradient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[30%] w-[400px] h-[400px] rounded-full bg-emerald-600/10 blur-[100px] pointer-events-none" />

      {/* Header Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-4xl text-center z-10 px-4">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="p-3 bg-gradient-to-tr from-primary-600 to-indigo-500 rounded-2xl shadow-xl shadow-primary-500/20 group-hover:scale-105 transition-transform duration-200">
            <Cloud className="h-7 w-7 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Cloud Cost Intelligence
            </h1>
            <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              AI-Powered Multi-Cloud FinOps Platform
            </p>
          </div>
        </Link>
        <p className="mt-4 text-sm text-slate-400">
          Sign in to orchestrate AWS, Azure & GCP cost optimization and real-time AI reasoning.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-5xl z-10 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Quick Demo Persona Logins (Left 7 Cols) */}
          <div className="lg:col-span-7 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  Instant Demo Persona Login
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Select an enterprise role below to test role-tailored dashboards and permissions instantly:
                </p>
              </div>
              <span className="px-2.5 py-1 text-[11px] font-semibold bg-primary-500/10 text-primary-400 border border-primary-500/20 rounded-full">
                1-Click Access
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DEMO_PERSONAS.map((persona) => (
                <button
                  key={persona.id}
                  type="button"
                  onClick={() => handleQuickPersonaSelect(persona.id)}
                  className="text-left p-4 rounded-2xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition-all duration-200 group relative flex flex-col justify-between hover:shadow-lg hover:shadow-primary-500/5 cursor-pointer"
                >
                  <div>
                    <div className="flex items-start gap-3 mb-3">
                      <img
                        src={persona.avatar}
                        alt={persona.name}
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-700 group-hover:ring-primary-500 transition-colors"
                      />
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-white group-hover:text-primary-400 transition-colors truncate">
                          {persona.name}
                        </h4>
                        <span className={`inline-block px-2 py-0.5 mt-0.5 text-[10px] font-medium rounded-md border ${persona.badgeColor}`}>
                          {persona.roleTitle}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                      {persona.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 group-hover:text-primary-400 transition-colors">
                    <span>{persona.department}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </div>

            {/* Live Role Capabilities Banner */}
            <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-primary-950/40 to-indigo-950/40 border border-primary-500/20 flex items-center gap-3">
              <div className="p-2 bg-primary-500/20 rounded-xl text-primary-400 shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <span className="font-semibold text-slate-200">Role-Based Access Control (RBAC):</span>{' '}
                <span className="text-slate-400">
                  CFOs view macro forecasts, FinOps Leads manage commitment discounts, and Architects optimize workloads.
                </span>
              </div>
            </div>
          </div>

          {/* Standard Credentials Sign-In (Right 5 Cols) */}
          <div className="lg:col-span-5 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Custom Sign In</h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter your work credentials to access your enterprise workspace:
              </p>

              {error && (
                <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleCustomLogin} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Work Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      required
                      className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-slate-300">
                      Password
                    </label>
                    <a href="#" className="text-[11px] text-primary-400 hover:text-primary-300 transition-colors">
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-800 text-primary-600 focus:ring-primary-500 h-3.5 w-3.5"
                    />
                    Remember me for 30 days
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-2 py-3 px-4 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 shadow-lg shadow-primary-600/20 active:scale-[0.99] transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In to Workspace
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-400">
              Need a new enterprise account?{' '}
              <Link href="/signup" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">
                Register team →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
