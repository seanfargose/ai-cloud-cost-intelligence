'use client'

import { useState } from 'react'
import { Send, Sparkles, Clock, TrendingUp, DollarSign } from 'lucide-react'

/**
 * Interactive Query Component
 * 
 * This is like having a conversation with an AI cost expert:
 * 1. Ask questions in plain English about your costs
 * 2. Get intelligent answers with data and recommendations
 * 3. Follow-up questions and suggestions
 */

export function InteractiveQuery() {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversation, setConversation] = useState<Array<{
    type: 'user' | 'ai'
    message: string
    timestamp: Date
    suggestions?: string[]
  }>>([
    {
      type: 'ai',
      message: "Hi! I'm your AI cost intelligence assistant. Ask me anything about your cloud spending — like **'Which department is spending the most?'**, **'Why did costs increase last week?'**, or **'What are our biggest savings opportunities?'**",
      timestamp: new Date(),
      suggestions: [
        "Which department is spending the most this month?",
        "What are our biggest cost optimization opportunities?",
        "Why did our costs increase last week?",
        "Show me resources that are wasting money"
      ]
    }
  ])

  const getAIResponse = async (userQuery: string): Promise<{ message: string; suggestions: string[] }> => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    const response = await fetch(`${baseUrl}/api/ai/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: userQuery }),
    })

    const payload = await response.json().catch(() => null)
    if (!response.ok || !payload?.success) {
      throw new Error(payload?.message || payload?.error || `AI request failed (${response.status})`)
    }

    const analysis = payload.data?.analysis
    return {
      message: analysis?.summary || 'Analysis completed successfully.',
      suggestions: Array.isArray(analysis?.recommendations)
        ? analysis.recommendations.slice(0, 3)
        : [
            "How can we rightsize these resources?",
            "What is the projected savings over 1 year?",
            "Show cost breakdown by cloud service"
          ],
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    // Add user message
    const userMessage = {
      type: 'user' as const,
      message: query,
      timestamp: new Date()
    }
    
    setConversation(prev => [...prev, userMessage])
    const currentQuery = query
    setQuery('')
    setIsLoading(true)

    try {
      // Get real AI response
      const aiResponse = await getAIResponse(currentQuery)
      const aiMessage = {
        type: 'ai' as const,
        message: aiResponse.message,
        timestamp: new Date(),
        suggestions: aiResponse.suggestions
      }
      
      setConversation(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Failed to get AI response:', error)
      const aiMessage = {
        type: 'ai' as const,
        message: `I encountered an issue processing your request: ${error instanceof Error ? error.message : 'Please check your connection.'}`,
        timestamp: new Date(),
        suggestions: [
          'Which department is spending the most this month?',
          'What are our biggest cost optimization opportunities?',
          'Show me resources that are wasting money'
        ]
      }

      setConversation(prev => [...prev, aiMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
  }

  const formatMessage = (message: string) => {
    const escaped = message
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
    return escaped
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>')
  }

  return (
    <div className="card">
      {/* Header */}
      <div className="card-header">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Cost Assistant</h3>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Ask questions about your costs in plain English
        </div>
      </div>

      {/* Conversation */}
      <div className="space-y-4 mb-4 max-h-96 overflow-y-auto p-1">
        {conversation.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl shadow-sm ${
                message.type === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
              }`}
            >
              <div
                className="text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: formatMessage(message.message) }}
              />
              <div className={`text-xs mt-1 text-right ${
                message.type === 'user' ? 'text-primary-100' : 'text-gray-400'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              
              {/* AI suggestions */}
              {message.type === 'ai' && message.suggestions && (
                <div className="mt-3 space-y-1.5 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Suggested follow-ups:</div>
                  {message.suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="block w-full text-left text-xs p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                <span className="text-sm">AI is analyzing cloud cost metrics...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask anything about your costs... (e.g. 'Why did costs spike yesterday?')"
          className="flex-1 px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="btn btn-primary px-4 py-2.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Quick action buttons */}
      <div className="mt-4 flex flex-wrap gap-2">
        {[
          { icon: TrendingUp, text: "Cost Trends", query: "Show me cost trends for the last 30 days" },
          { icon: DollarSign, text: "Top Spenders", query: "Which department is spending the most this month?" },
          { icon: Clock, text: "Savings Opportunities", query: "What are our biggest cost optimization opportunities?" }
        ].map((action, index) => (
          <button
            key={index}
            onClick={() => handleSuggestionClick(action.query)}
            className="flex items-center space-x-2 px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
            disabled={isLoading}
          >
            <action.icon className="w-3.5 h-3.5 text-primary-600" />
            <span>{action.text}</span>
          </button>
        ))}
      </div>
    </div>
  )
}