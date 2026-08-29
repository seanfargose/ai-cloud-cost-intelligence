import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AIAnalysisService } from '../src/services/ai-analysis.js';

/**
 * AI Analysis Service tests
 * Tests the service wrapper around the AI Analysis Engine with mocked Claude calls
 */

// Mock the ai-analysis-engine module
vi.mock('ai-analysis-engine', () => {
  return {
    AIAnalysisEngine: vi.fn().mockImplementation(() => ({
      analyze: vi.fn().mockResolvedValue({
        success: true,
        data: {
          totalSpend: 125000,
          topSpenders: [
            { department: 'Engineering', cost: 45000 },
            { department: 'Data Science', cost: 32000 },
          ],
          trends: { direction: 'increasing', rate: 0.05 },
        },
        insights: [
          'Engineering department accounts for 36% of total spend',
          'Cost increased 5% month-over-month',
          'Data Science spending is trending upward',
        ],
        confidence: 0.87,
        metadata: {
          processingTime: 1200,
          tokensUsed: 450,
          analysisType: 'cost_analysis',
        },
      }),
      processInteractiveQuery: vi.fn().mockResolvedValue({
        success: true,
        data: {
          answer: 'The main cost driver is the Engineering department.',
          metrics: { totalSpend: 125000 },
        },
        insights: ['Engineering is the highest spender'],
        confidence: 0.82,
        metadata: {
          processingTime: 800,
          analysisType: 'interactive_query',
        },
      }),
      generateRealtimeInsights: vi.fn().mockResolvedValue({
        success: true,
        data: {
          alerts: [],
          recommendations: ['Consider Reserved Instances for stable workloads'],
        },
        insights: ['Spending is within normal range'],
        confidence: 0.9,
        metadata: {
          processingTime: 600,
          analysisType: 'cost_analysis',
        },
      }),
    })),
  };
});

describe('AIAnalysisService', () => {
  let service: AIAnalysisService;

  beforeEach(() => {
    service = new AIAnalysisService('test-api-key');
  });

  it('should initialize without errors', () => {
    expect(service).toBeDefined();
  });

  it('should process interactive queries', async () => {
    const mockCostData = [
      { date: '2024-01-01', department: 'Engineering', cost: 1500, serviceName: 'VMs' },
      { date: '2024-01-01', department: 'Data Science', cost: 1200, serviceName: 'Storage' },
    ];

    const result = await service.processInteractiveQuery(
      'What are the main cost drivers?',
      mockCostData,
      {},
      'test-user',
      'test-org'
    );

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.insights).toBeInstanceOf(Array);
    expect(result.confidence).toBeGreaterThan(0);
  });

  it('should generate realtime insights', async () => {
    const mockCostData = [
      { date: '2024-01-01', department: 'Engineering', cost: 1500, serviceName: 'VMs' },
    ];

    const result = await service.generateRealtimeInsights(
      mockCostData,
      undefined,
      'test-user',
      'test-org'
    );

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.insights).toBeInstanceOf(Array);
  });

  it('should track analysis history', async () => {
    const mockCostData = [
      { date: '2024-01-01', department: 'Engineering', cost: 1500, serviceName: 'VMs' },
    ];

    await service.processInteractiveQuery(
      'Test query',
      mockCostData,
      {},
      'test-user',
      'test-org'
    );

    const history = service.getAnalysisHistory();
    expect(history).toBeInstanceOf(Array);
  });

  it('should report as healthy', () => {
    expect(service.isHealthy()).toBe(true);
  });
});
