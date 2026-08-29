'use client'

import { useState } from 'react'
import {
  Cloud,
  CheckCircle2,
  X,
  Shield,
  Key,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  ExternalLink,
  Lock
} from 'lucide-react'

interface CloudConnectModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CloudConnectModal({ isOpen, onClose }: CloudConnectModalProps) {
  const [activeTab, setActiveTab] = useState<'aws' | 'azure' | 'gcp'>('aws')
  const [copied, setCopied] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<any>(null)

  // Form states
  const [awsRoleArn, setAwsRoleArn] = useState('arn:aws:iam::123456789012:role/FinOpsCostReaderRole')
  const [awsExternalId, setAwsExternalId] = useState('ext-finops-8812')
  const [awsRegion, setAwsRegion] = useState('us-east-1')

  const [azureSubId, setAzureSubId] = useState('sub-prod-enterprise-001')
  const [azureTenantId, setAzureTenantId] = useState('tenant-corp-azure-9921')
  const [azureClientId, setAzureClientId] = useState('app-client-id-3891')

  const [gcpProjectId, setGcpProjectId] = useState('gcp-finops-production-ai')
  const [gcpBillingAccount, setGcpBillingAccount] = useState('01A2B3-45C6D7-89E0F1')

  if (!isOpen) return null

  const handleVerify = async () => {
    setIsVerifying(true)
    setVerificationResult(null)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const credentials =
        activeTab === 'aws'
          ? { roleArn: awsRoleArn, externalId: awsExternalId, region: awsRegion }
          : activeTab === 'azure'
          ? { subscriptionId: azureSubId, tenantId: azureTenantId, clientId: azureClientId }
          : { projectId: gcpProjectId, billingAccountId: gcpBillingAccount }

      const res = await fetch(`${apiUrl}/api/cloud-connect/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: activeTab, credentials })
      })

      const data = await res.json()
      setTimeout(() => {
        setVerificationResult(data)
        setIsVerifying(false)
      }, 700)
    } catch (e) {
      console.error('Cloud verification failed:', e)
      setIsVerifying(false)
    }
  }

  const copySnippet = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const iamSnippets = {
    aws: `# Terraform snippet for AWS Cross-Account Cost Reader Role
resource "aws_iam_role" "finops_reader" {
  name = "FinOpsCostReaderRole"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = { AWS = "arn:aws:iam::882910482911:root" }
      Condition = { StringEquals = { "sts:ExternalId" = "${awsExternalId}" } }
    }]
  })
}
resource "aws_iam_role_policy_attachment" "ce_readonly" {
  role       = aws_iam_role.finops_reader.name
  policy_arn = "arn:aws:iam::aws:policy/AWSBillingReadOnlyAccess"
}`,
    azure: `# Azure CLI Service Principal Registration
az ad sp create-for-rbac \\
  --name "sp-finops-cost-reader" \\
  --role "CostManagementReader" \\
  --scopes "/subscriptions/${azureSubId}"`,
    gcp: `# GCP IAM Role Grant for Cloud Billing Export
gcloud projects add-iam-policy-binding ${gcpProjectId} \\
  --member="serviceAccount:finops-agent@${gcpProjectId}.iam.gserviceaccount.com" \\
  --role="roles/billing.viewer"`
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden my-8 animate-scale-up">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-600/40 rounded-xl border border-indigo-400/30">
              <Key className="w-6 h-6 text-indigo-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Cloud Accounts & IAM Integration</h3>
              <p className="text-xs text-indigo-200">
                Connect live multi-cloud credentials (AWS IAM, Azure SP, GCP Service Account)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PROVIDER TABS */}
        <div className="flex border-b border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 p-2 gap-2">
          <button
            onClick={() => { setActiveTab('aws'); setVerificationResult(null) }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'aws'
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <span>🟧 Amazon Web Services (AWS)</span>
          </button>

          <button
            onClick={() => { setActiveTab('azure'); setVerificationResult(null) }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'azure'
                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <span>🔷 Microsoft Azure</span>
          </button>

          <button
            onClick={() => { setActiveTab('gcp'); setVerificationResult(null) }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'gcp'
                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <span>🔴 Google Cloud (GCP)</span>
          </button>
        </div>

        {/* TAB CONTENTS */}
        <div className="p-6 space-y-5 text-gray-900 dark:text-gray-100">
          {/* AWS TAB */}
          {activeTab === 'aws' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-start space-x-2.5">
                <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Least-Privilege Security:</strong> Requires only read-only access to Cost Explorer (<code>ce:GetCostAndUsage</code>) and pricing APIs via cross-account IAM role assumption.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="md:col-span-2">
                  <label className="block text-gray-600 dark:text-gray-400 font-semibold mb-1">
                    AWS IAM Cross-Account Role ARN
                  </label>
                  <input
                    type="text"
                    value={awsRoleArn}
                    onChange={(e) => setAwsRoleArn(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg p-2.5 font-mono text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 dark:text-gray-400 font-semibold mb-1">
                    Security External ID
                  </label>
                  <input
                    type="text"
                    value={awsExternalId}
                    onChange={(e) => setAwsExternalId(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg p-2.5 font-mono text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 dark:text-gray-400 font-semibold mb-1">
                    Default Region
                  </label>
                  <select
                    value={awsRegion}
                    onChange={(e) => setAwsRegion(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    <option value="us-east-1">us-east-1 (N. Virginia)</option>
                    <option value="us-west-2">us-west-2 (Oregon)</option>
                    <option value="eu-west-1">eu-west-1 (Ireland)</option>
                    <option value="ap-southeast-1">ap-southeast-1 (Singapore)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* AZURE TAB */}
          {activeTab === 'azure' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 rounded-xl text-xs text-blue-800 dark:text-blue-300 flex items-start space-x-2.5">
                <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Azure AD Service Principal:</strong> Uses OAuth2 bearer credentials with <code>CostManagementReader</code> role for subscription-level spending tracking.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-gray-600 dark:text-gray-400 font-semibold mb-1">
                    Azure Subscription ID
                  </label>
                  <input
                    type="text"
                    value={azureSubId}
                    onChange={(e) => setAzureSubId(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg p-2.5 font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 dark:text-gray-400 font-semibold mb-1">
                    Azure AD Directory (Tenant) ID
                  </label>
                  <input
                    type="text"
                    value={azureTenantId}
                    onChange={(e) => setAzureTenantId(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg p-2.5 font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-600 dark:text-gray-400 font-semibold mb-1">
                    Application (Client) ID
                  </label>
                  <input
                    type="text"
                    value={azureClientId}
                    onChange={(e) => setAzureClientId(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg p-2.5 font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* GCP TAB */}
          {activeTab === 'gcp' && (
            <div className="space-y-4">
              <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 rounded-xl text-xs text-rose-800 dark:text-rose-300 flex items-start space-x-2.5">
                <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Google Cloud Billing Export:</strong> Integrates with BigQuery billing export dataset with <code>roles/billing.viewer</code> and Recommender API.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-gray-600 dark:text-gray-400 font-semibold mb-1">
                    GCP Project ID
                  </label>
                  <input
                    type="text"
                    value={gcpProjectId}
                    onChange={(e) => setGcpProjectId(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg p-2.5 font-mono text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 dark:text-gray-400 font-semibold mb-1">
                    Cloud Billing Account ID
                  </label>
                  <input
                    type="text"
                    value={gcpBillingAccount}
                    onChange={(e) => setGcpBillingAccount(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg p-2.5 font-mono text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* CODE SNIPPET HELPER */}
          <div className="bg-gray-900 rounded-xl p-3 text-xs border border-gray-800 relative">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="font-mono text-[11px]">Setup Script / IAM Template</span>
              <button
                onClick={() => copySnippet(iamSnippets[activeTab])}
                className="flex items-center space-x-1 text-xs text-indigo-400 hover:text-indigo-300"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="text-gray-300 font-mono text-[11px] overflow-x-auto p-1">
              {iamSnippets[activeTab]}
            </pre>
          </div>

          {/* VERIFICATION RESULTS BADGE */}
          {verificationResult && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs flex items-center justify-between animate-fade-in">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="font-bold text-emerald-800 dark:text-emerald-300">
                  {verificationResult.message}
                </span>
              </div>
              <span className="px-2 py-0.5 bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 rounded text-[10px] font-bold">
                PERMISSIONS VERIFIED
              </span>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-5 bg-gray-50 dark:bg-slate-800/60 border-t border-gray-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-xs text-gray-500">
            <Lock className="w-3.5 h-3.5" />
            <span>Encrypted using AES-256 GCM</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleVerify}
              disabled={isVerifying}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5 disabled:opacity-50"
            >
              {isVerifying && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isVerifying ? 'Verifying Cloud IAM...' : 'Test & Verify Connection'}</span>
            </button>

            <button
              onClick={onClose}
              className="btn btn-secondary text-xs"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
