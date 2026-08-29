import { MockGCPDataService, GCPCostRecord, GCPRecommenderInsight } from './mock-gcp-data-service.js';

export interface GCPCostParams {
  startDate: string;
  endDate: string;
  department?: string;
  service?: string;
  location?: string;
}

export class GCPCostService {
  constructor(private mockDataService: MockGCPDataService) {}

  public async getBillingData(params: GCPCostParams): Promise<{
    records: GCPCostRecord[];
    summary: {
      totalCost: number;
      recordCount: number;
      dateRange: { start: string; end: string };
      byService: Record<string, number>;
      byLocation: Record<string, number>;
      byDepartment: Record<string, number>;
    };
    source: string;
  }> {
    let records = this.mockDataService.generateCostRecords(params.startDate, params.endDate, params.department);

    if (params.service) {
      records = records.filter(r => r.service.toLowerCase().includes(params.service!.toLowerCase()));
    }
    if (params.location) {
      records = records.filter(r => r.location.toLowerCase() === params.location!.toLowerCase());
    }

    const byService: Record<string, number> = {};
    const byLocation: Record<string, number> = {};
    const byDepartment: Record<string, number> = {};
    let totalCost = 0;

    for (const r of records) {
      totalCost += r.cost;
      byService[r.service] = (byService[r.service] || 0) + r.cost;
      byLocation[r.location] = (byLocation[r.location] || 0) + r.cost;
      byDepartment[r.department] = (byDepartment[r.department] || 0) + r.cost;
    }

    return {
      records,
      summary: {
        totalCost: Math.round(totalCost * 100) / 100,
        recordCount: records.length,
        dateRange: { start: params.startDate, end: params.endDate },
        byService,
        byLocation,
        byDepartment
      },
      source: 'gcp-cloud-billing'
    };
  }

  public async getRecommenderInsights(department?: string): Promise<{
    insights: GCPRecommenderInsight[];
    totalPotentialMonthlySavings: number;
  }> {
    const insights = this.mockDataService.getRecommenderInsights(department);
    const totalPotentialMonthlySavings = insights.reduce((sum, i) => sum + i.potentialMonthlySavings, 0);

    return {
      insights,
      totalPotentialMonthlySavings
    };
  }
}
