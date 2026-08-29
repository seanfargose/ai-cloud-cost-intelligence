'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Cloud,
  Shield,
  Building2,
  Lock,
  Mail,
  User,
  ArrowRight,
  CheckCircle2,
  Layers,
  Sparkles
} from 'lucide-react'
import { useAuth, UserRole } from '@/lib/auth'

export default function SignupPage() {
  const router = useRouter()
  const { signup, isLoading } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [organization, setOrganization] = useState('')
  const [role, setRole] = useState<UserRole>('finops_lead')
  const [selectedClouds, setSelectedClouds] = useState<string[]>(['aws', 'azure', 'gcp'])
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const toggleCloud = (cloud: string) => {
    setSelectedClouds((prev) =>
      prev.includes(cloud) ? prev.filter((c) => c !== cloud) : [...prev, cloud]
    )
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email) {
      setError('Please fill in your name and email address.')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      await signup({
        name,
        email,
        organization: organization || 'Enterprise Team',
        role
      })
      router.push('/')
    } catch {
      setError('Failed to create account. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-primary-500 selection:text-white">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/15 blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 px-4">
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
              New Enterprise Account
            </p>
          </div>
        </Link>
        <p className="mt-3 text-sm text-slate-400">
          Create an account to monitor and optimize multi-cloud spend across AWS, Azure, and GCP.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl z-10 px-4">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    required
                    className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Work Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@company.com"
                    required
                    className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Company / Organization
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="Global Tech Inc."
                    className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Password
                </label>
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
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Select Your Role (RBAC)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'finops_lead', title: 'FinOps Lead', color: 'emerald' },
                  { id: 'cfo', title: 'CFO / Exec', color: 'purple' },
                  { id: 'cloud_architect', title: 'Cloud Architect', color: 'blue' },
                  { id: 'engineering_lead', title: 'VP Engineering', color: 'amber' }
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id as UserRole)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all text-center cursor-pointer ${
                      role === r.id
                        ? 'bg-primary-600/20 border-primary-500 text-white shadow-sm shadow-primary-500/20'
                        : 'bg-slate-800/40 border-slate-700/70 text-slate-400 hover:text-slate-200 hover:border-slate-600'
                    }`}
                  >
                    {r.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Cloud Providers in Use */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Active Cloud Environments
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'aws', label: 'AWS (Amazon Web Services)' },
                  { id: 'azure', label: 'Microsoft Azure' },
                  { id: 'gcp', label: 'Google Cloud Platform (GCP)' }
                ].map((cloud) => (
                  <button
                    key={cloud.id}
                    type="button"
                    onClick={() => toggleCloud(cloud.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
                      selectedClouds.includes(cloud.id)
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                        : 'bg-slate-800/40 border-slate-700/70 text-slate-400'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-3.5 h-3.5 ${
                        selectedClouds.includes(cloud.id) ? 'text-emerald-400' : 'text-slate-600'
                      }`}
                    />
                    {cloud.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-4 py-3 px-4 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 shadow-lg shadow-primary-600/20 active:scale-[0.99] transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Workspace...
                </>
              ) : (
                <>
                  Complete Enterprise Registration
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800/80 text-center text-xs text-slate-400">
            Already registered?{' '}
            <Link href="/login" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">
              Sign In to existing workspace →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
