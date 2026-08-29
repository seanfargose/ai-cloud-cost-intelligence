'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type UserRole = 'cfo' | 'finops_lead' | 'cloud_architect' | 'engineering_lead'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  roleTitle: string
  organization: string
  department: string
  avatar: string
  badgeColor: string
}

export interface DemoPersona extends User {
  description: string
  focusArea: string
}

export const DEMO_PERSONAS: DemoPersona[] = [
  {
    id: 'persona-finops',
    name: 'Sarah Chen',
    email: 'sarah.chen@enterprise.io',
    role: 'finops_lead',
    roleTitle: 'Director of FinOps',
    organization: 'FinOps Global Corp',
    department: 'Finance & Strategy',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    description: 'Manages multi-cloud unit economics, commitment discounts, and rightsizing portfolios.',
    focusArea: 'Unit Economics, Savings Plans, Anomaly Triage'
  },
  {
    id: 'persona-cfo',
    name: 'Alex Morgan',
    email: 'alex.morgan@enterprise.io',
    role: 'cfo',
    roleTitle: 'Chief Financial Officer',
    organization: 'FinOps Global Corp',
    department: 'Executive Leadership',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    description: 'Executive oversight on cross-cloud IT spend, budget velocity, and monthly EBITDA impact.',
    focusArea: 'Macro Budgeting, Executive Forecasting, Board Reports'
  },
  {
    id: 'persona-architect',
    name: 'Marcus Vance',
    email: 'marcus.vance@enterprise.io',
    role: 'cloud_architect',
    roleTitle: 'Principal Cloud Architect',
    organization: 'FinOps Global Corp',
    department: 'Cloud Infrastructure',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    description: 'Oversees multi-cloud infrastructure scaling across AWS EKS, Azure AKS, and GCP GKE.',
    focusArea: 'Kubernetes Efficiency, Cross-Cloud Egress, Rightsizing'
  },
  {
    id: 'persona-eng',
    name: 'Elena Rostova',
    email: 'elena.rostova@enterprise.io',
    role: 'engineering_lead',
    roleTitle: 'VP of Engineering',
    organization: 'FinOps Global Corp',
    department: 'Engineering',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    description: 'Manages engineering team budgets, CI/CD pipeline compute quotas, and cluster workloads.',
    focusArea: 'Engineering Quotas, Microservice Spend, Dev/Stage Governance'
  }
]

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password?: string) => Promise<boolean>
  loginAsPersona: (personaId: string) => void
  signup: (userData: { name: string; email: string; organization: string; role: UserRole }) => Promise<boolean>
  logout: () => void
  switchRole: (role: UserRole) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AUTH_STORAGE_KEY = 'cost_intel_auth_user'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(AUTH_STORAGE_KEY)
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      } else {
        // Default to FinOps Lead demo persona so dashboard works instantly
        const defaultPersona = DEMO_PERSONAS[0]
        setUser(defaultPersona)
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(defaultPersona))
      }
    } catch {
      setUser(DEMO_PERSONAS[0])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Check if email matches a demo persona
      const matchedPersona = DEMO_PERSONAS.find((p) => p.email.toLowerCase() === email.toLowerCase())
      if (matchedPersona) {
        setUser(matchedPersona)
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(matchedPersona))
        return true
      }

      // Create a user profile based on the email
      const name = email.split('@')[0].replace(/[._]/g, ' ')
      const formattedName = name.charAt(0).toUpperCase() + name.slice(1)
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: formattedName,
        email,
        role: 'finops_lead',
        roleTitle: 'FinOps Practitioner',
        organization: 'Enterprise Cloud Team',
        department: 'FinOps',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        badgeColor: 'bg-primary-500/10 text-primary-600 dark:text-primary-400 border-primary-500/20'
      }

      setUser(newUser)
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser))
      return true
    } finally {
      setIsLoading(false)
    }
  }

  const loginAsPersona = (personaId: string) => {
    const persona = DEMO_PERSONAS.find((p) => p.id === personaId) || DEMO_PERSONAS[0]
    setUser(persona)
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(persona))
  }

  const signup = async (userData: {
    name: string
    email: string
    organization: string
    role: UserRole
  }): Promise<boolean> => {
    setIsLoading(true)
    try {
      const roleTitles: Record<UserRole, string> = {
        cfo: 'Chief Financial Officer',
        finops_lead: 'FinOps Lead',
        cloud_architect: 'Cloud Architect',
        engineering_lead: 'Engineering Lead'
      }

      const badgeColors: Record<UserRole, string> = {
        cfo: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
        finops_lead: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        cloud_architect: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        engineering_lead: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
      }

      const newUser: User = {
        id: `user-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        roleTitle: roleTitles[userData.role] || 'Cloud Cost Analyst',
        organization: userData.organization || 'Enterprise Org',
        department: userData.role === 'cfo' ? 'Finance' : userData.role === 'engineering_lead' ? 'Engineering' : 'Cloud Ops',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.email}`,
        badgeColor: badgeColors[userData.role] || 'bg-primary-500/10 text-primary-600 border-primary-500/20'
      }

      setUser(newUser)
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser))
      return true
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  const switchRole = (newRole: UserRole) => {
    if (!user) return

    const roleTitles: Record<UserRole, string> = {
      cfo: 'Chief Financial Officer',
      finops_lead: 'FinOps Lead',
      cloud_architect: 'Cloud Architect',
      engineering_lead: 'Engineering Lead'
    }

    const badgeColors: Record<UserRole, string> = {
      cfo: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      finops_lead: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      cloud_architect: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      engineering_lead: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
    }

    const updatedUser: User = {
      ...user,
      role: newRole,
      roleTitle: roleTitles[newRole],
      badgeColor: badgeColors[newRole]
    }

    setUser(updatedUser)
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginAsPersona,
        signup,
        logout,
        switchRole
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
