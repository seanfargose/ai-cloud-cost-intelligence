export interface GCPCostRecord {
  date: string;
  cost: number;
  service: string;
  projectId: string;
  location: string;
  department: string;
  skuDescription: string;
  usageQuantity: number;
}

export interface GCPRecommenderInsight {
  id: string;
  service: string;
  category: 'COST' | 'SECURITY' | 'PERFORMANCE';
  description: string;
  currentMonthlyCost: number;
  potentialMonthlySavings: number;
  recommendationState: 'ACTIVE' | 'CLAIMED' | 'DISMISSED';
  targetResource: string;
  actionSummary: string;
}

export class MockGCPDataService {
  private departments = ['Engineering', 'Data Analytics', 'AI Research', 'Platform', 'Operations', 'Finance'];
  private locations = ['us-central1', 'us-east4', 'europe-west1', 'asia-east1'];
  private services = [
    { name: 'Google Compute Engine', multiplier: 1.7, sku: 'N2 Custom Extended Memory Instance' },
    { name: 'Google Kubernetes Engine (GKE)', multiplier: 1.4, sku: 'Autopilot Cluster Management' },
    { name: 'BigQuery', multiplier: 1.3, sku: 'Analysis Slots (Enterprise Edition)' },
    { name: 'Cloud Storage', multiplier: 0.8, sku: 'Standard Storage (Multi-region)' },
    { name: 'Cloud SQL (PostgreSQL)', multiplier: 1.1, sku: 'Enterprise Plus db-custom-8-32768' },
    { name: 'Vertex AI', multiplier: 1.6, sku: 'Custom Training - NVIDIA A100' },
    { name: 'Cloud Run', multiplier: 0.5, sku: 'CPU and Memory Allocation' },
    { name: 'Cloud Interconnect', multiplier: 0.7, sku: 'Dedicated 10Gbps Cross-Connect' }
  ];

  public generateCostRecords(startDate: string, endDate: string, departmentFilter?: string): GCPCostRecord[] {
    const records: GCPCostRecord[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

    for (let i = 0; i <= days; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().slice(0, 10);

      for (let j = 0; j < this.departments.length; j++) {
        const dept = this.departments[j];
        if (departmentFilter && dept.toLowerCase() !== departmentFilter.toLowerCase()) continue;

        const svc = this.services[(i * 3 + j) % this.services.length];
        const location = this.locations[(j + i) % this.locations.length];
        const deptMultiplier = [1.6, 1.5, 1.8, 1.1, 0.9, 0.7][j];
        const baseCost = 1350 + i * 14;
        const noise = (Math.sin(i * 11.2 + j) * 70);
        const cost = Math.round((baseCost + noise) * deptMultiplier * svc.multiplier * 100) / 100;

        records.push({
          date: dateStr,
          cost,
          service: svc.name,
          projectId: 'gcp-prod-analytics-40981',
          location,
          department: dept,
          skuDescription: svc.sku,
          usageQuantity: Math.round(cost * 1.5)
        });
      }
    }
    return records;
  }

  public getRecommenderInsights(department?: string): GCPRecommenderInsight[] {
    const insights: GCPRecommenderInsight[] = [
      {
        id: 'gcp-rec-01',
        service: 'Google Compute Engine',
        category: 'COST',
        description: 'Purchase 3-Year Flexible Committed Use Discounts (CUD) for continuous vCPU/RAM usage.',
        currentMonthlyCost: 42000,
        potentialMonthlySavings: 15540,
        recommendationState: 'ACTIVE',
        targetResource: 'projects/gcp-prod-analytics-40981/regions/us-central1',
        actionSummary: 'Commit to $28.00/hr spend threshold to receive 37% discount across all Compute Engine workloads.'
      },
      {
        id: 'gcp-rec-02',
        service: 'BigQuery',
        category: 'COST',
        description: 'Convert high-frequency on-demand analytical queries to BigQuery Edition Slot Reservations.',
        currentMonthlyCost: 19800,
        potentialMonthlySavings: 7920,
        recommendationState: 'ACTIVE',
        targetResource: 'projects/gcp-prod-analytics-40981/reservations/analytics-prod',
        actionSummary: 'Reserve 100 baseline slots with autoscaling enabled up to 300 slots.'
      },
      {
        id: 'gcp-rec-03',
        service: 'Cloud Storage',
        category: 'COST',
        description: 'Apply Object Lifecycle Management to raw data buckets in Standard multi-region.',
        currentMonthlyCost: 7400,
        potentialMonthlySavings: 4440,
        recommendationState: 'ACTIVE',
        targetResource: 'gs://gcp-analytics-raw-telemetry-bucket',
        actionSummary: 'Transition objects older than 90 days to Coldline, and 365 days to Archive storage.'
      },
      {
        id: 'gcp-rec-04',
        service: 'Vertex AI',
        category: 'COST',
        description: 'Stop idle custom workbench notebooks running outside scheduled experimentation hours.',
        currentMonthlyCost: 9600,
        potentialMonthlySavings: 5760,
        recommendationState: 'ACTIVE',
        targetResource: 'projects/gcp-prod-analytics-40981/locations/us-central1/notebooks/ml-experiment-01',
        actionSummary: 'Configure 60-minute inactivity auto-shutdown on all Workbench notebook instances.'
      }
    ];

    return department ? insights.filter(r => r.service.toLowerCase().includes(department.toLowerCase())) : insights;
  }
}
