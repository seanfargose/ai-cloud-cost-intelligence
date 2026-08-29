import { MockAWSDataService, AWSCostRecord, AWSSavingsRecommendation } from './mock-aws-data-service.js';

export interface AWSCostParams {
  startDate: string;
  endDate: string;
  department?: string;
  service?: string;
  region?: string;
}

export class AWSCostService {
  constructor(private mockDataService: MockAWSDataService) {}

  public async getCostAndUsage(params: AWSCostParams): Promise<{
    records: AWSCostRecord[];
    summary: {
      totalCost: number;
      recordCount: number;
      dateRange: { start: string; end: string };
      byService: Record<string, number>;
      byRegion: Record<string, number>;
      byDepartment: Record<string, number>;
    };
    source: string;
  }> {
    let records = this.mockDataService.generateCostRecords(params.startDate, params.endDate, params.department);

    if (params.service) {
      records = records.filter(r => r.service.toLowerCase().includes(params.service!.toLowerCase()));
    }
    if (params.region) {
      records = records.filter(r => r.region.toLowerCase() === params.region!.toLowerCase());
    }

    const byService: Record<string, number> = {};
    const byRegion: Record<string, number> = {};
    const byDepartment: Record<string, number> = {};
    let totalCost = 0;

    for (const r of records) {
      totalCost += r.cost;
      byService[r.service] = (byService[r.service] || 0) + r.cost;
      byRegion[r.region] = (byRegion[r.region] || 0) + r.cost;
      byDepartment[r.department] = (byDepartment[r.department] || 0) + r.cost;
    }

    return {
      records,
      summary: {
        totalCost: Math.round(totalCost * 100) / 100,
        recordCount: records.length,
        dateRange: { start: params.startDate, end: params.endDate },
        byService,
        byRegion,
        byDepartment
      },
      source: 'aws-cost-explorer'
    };
  }

  public async getSavingsRecommendations(department?: string): Promise<{
    recommendations: AWSSavingsRecommendation[];
    totalEstimatedMonthlySavings: number;
  }> {
    const recommendations = this.mockDataService.getSavingsRecommendations(department);
    const totalEstimatedMonthlySavings = recommendations.reduce((sum, r) => sum + r.estimatedMonthlySavings, 0);

    return {
      recommendations,
      totalEstimatedMonthlySavings
    };
  }

  public async getCostAnomalies(days: number = 30) {
    const anomalies = this.mockDataService.getAnomalies(days);
    return {
      anomalies,
      count: anomalies.length,
      totalImpact: anomalies.reduce((sum, a) => sum + (a.actualCost - a.expectedCost), 0)
    };
  }
}
