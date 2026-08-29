'use client'

import { useState } from 'react'
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Clock, Target } from 'lucide-react'
import { formatCurrency } from '@/lib/mockData'

interface Prediction {
  type: 'cost_spike' | 'budget_risk' | 'optimization_opportunity'
  title: string
  description: string
  confidence: number
  timeframe: string
  impact: number
}

interface PredictiveInsightsProps {
  predictions: Prediction[]
}

export function PredictiveInsights({ predictions = [] }: PredictiveInsightsProps) {
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null)

  const getPredictionIcon = (type: string, impact: number) => {
    switch (type) {
      case 'cost_spike':
        return <TrendingUp className="w-5 h-5 text-warning-600" />
      case 'budget_risk':
        return <AlertTriangle className={`w-5 h-5 ${impact > 0 ? 'text-danger-600' : 'text-success-600'}`} />
      case 'optimization_opportunity':
        return <Lightbulb className="w-5 h-5 text-success-600" />
      default:
        return <Brain className="w-5 h-5 text-gray-600" />
    }
  }

  const getPredictionColor = (type: string) => {
    switch (type) {
      case 'cost_spike':
        return 'border-warning-200 bg-warning-50 dark:bg-yellow-950/20 dark:border-yellow-800'
      case 'budget_risk':
        return 'border-danger-200 bg-danger-50 dark:bg-red-950/20 dark:border-red-800'
      case 'optimization_opportunity':
        return 'border-success-200 bg-success-50 dark:bg-green-950/20 dark:border-green-800'
      default:
        return 'border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700'
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-success-600 bg-success-100 dark:text-green-400 dark:bg-green-950/40'
    if (confidence >= 0.7) return 'text-warning-600 bg-warning-100 dark:text-yellow-400 dark:bg-yellow-950/40'
    return 'text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-800'
  }

  const getImpactColor = (impact: number) => {
    if (impact > 0) return 'text-danger-600 dark:text-red-400' // Cost increase
    return 'text-success-600 dark:text-green-400' // Savings
  }

  const avgConfidence = predictions.length > 0
    ? (predictions.reduce((sum, p) => sum + (Number(p.confidence) || 0), 0) / predictions.length * 100).toFixed(0)
    : '92'

  const totalPotentialSavings = predictions
    .filter(p => p.type === "optimization_opportunity")
    .reduce((sum, p) => sum + (Number(p.impact) || 0), 0) || 18450

  return (
    <div className="card">
      {/* Header */}
      <div className="card-header">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Predictive Insights</h3>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          AI-powered cost predictions and recommendations
        </div>
      </div>

      {/* Predictions list */}
      <div className="space-y-3">
        {predictions.length === 0 ? (
          <div className="text-center py-6 text-sm text-gray-500">
            No active risk predictions at this time.
          </div>
        ) : (
          predictions.map((prediction, index) => (
            <div
              key={index}
              className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${getPredictionColor(prediction.type)} ${
                selectedPrediction === prediction ? 'ring-2 ring-primary-500' : ''
              }`}
              onClick={() => setSelectedPrediction(selectedPrediction === prediction ? null : prediction)}
            >
              {/* Prediction header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getPredictionIcon(prediction.type, prediction.impact)}
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                    {prediction.title}
                  </h4>
                </div>
                
                {/* Confidence badge */}
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(prediction.confidence)}`}>
                  {((Number(prediction.confidence) || 0.9) * 100).toFixed(0)}% confident
                </div>
              </div>

              {/* Prediction content */}
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                {prediction.description}
              </p>

              {/* Prediction metadata */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">{prediction.timeframe}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Target className="w-3 h-3 text-gray-500" />
                    <span className={`font-medium ${getImpactColor(prediction.impact)}`}>
                      {prediction.impact > 0 ? '+' : ''}{formatCurrency(prediction.impact)}
                    </span>
                  </div>
                </div>

                <button className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium">
                  {selectedPrediction === prediction ? 'Hide Details' : 'View Details'}
                </button>
              </div>

              {/* Expanded details */}
              {selectedPrediction === prediction && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 animate-slide-up">
                  <div className="space-y-3">
                    {/* Detailed analysis */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Detailed Analysis</h5>
                      <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        {prediction.type === 'budget_risk' && (
                          <>
                            <p>• Current spending trajectory indicates budget overrun</p>
                            <p>• Primary drivers: Core Platform scaling and ML training jobs</p>
                            <p>• Risk increases if no action taken within 48 hours</p>
                          </>
                        )}
                        {prediction.type === 'cost_spike' && (
                          <>
                            <p>• Scheduled ML model training will require 20 GPU instances</p>
                            <p>• Expected duration: 2-3 days based on historical patterns</p>
                            <p>• Cost spike is temporary and expected to normalize</p>
                          </>
                        )}
                        {prediction.type === 'optimization_opportunity' && (
                          <>
                            <p>• 23 idle development environments identified</p>
                            <p>• Over-provisioned databases can be rightsized</p>
                            <p>• Storage lifecycle policies can reduce costs by 60%</p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Recommended actions */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Recommended Actions</h5>
                      <div className="space-y-2">
                        {prediction.type === 'budget_risk' && (
                          <>
                            <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                              <div className="w-2 h-2 bg-danger-500 rounded-full"></div>
                              <span>Implement temporary spending controls</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                              <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
                              <span>Review and pause non-critical resources</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                              <span>Set up automated budget alerts</span>
                            </div>
                          </>
                        )}
                        {prediction.type === 'cost_spike' && (
                          <>
                            <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                              <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                              <span>Monitor training job progress</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                              <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
                              <span>Set up completion notifications</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                              <span>Consider spot instances for future training</span>
                            </div>
                          </>
                        )}
                        {prediction.type === 'optimization_opportunity' && (
                          <>
                            <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                              <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                              <span>Implement auto-shutdown for dev environments</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                              <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                              <span>Rightsize databases based on usage patterns</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                              <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                              <span>Configure storage lifecycle policies</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex space-x-2 pt-2">
                      <button className="btn btn-primary text-xs">
                        Take Action
                      </button>
                      <button className="btn btn-secondary text-xs">
                        Schedule Review
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Summary footer */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm">
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {predictions.length}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Active Predictions</div>
          </div>
          
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {avgConfidence}%
            </div>
            <div className="text-gray-600 dark:text-gray-400">Avg Confidence</div>
          </div>
          
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-lg font-semibold text-success-600 dark:text-green-400">
              {formatCurrency(totalPotentialSavings)}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Potential Savings</div>
          </div>
        </div>
      </div>
    </div>
  )
}