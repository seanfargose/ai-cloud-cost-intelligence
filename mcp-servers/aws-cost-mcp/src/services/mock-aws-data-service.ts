export interface AWSCostRecord {
  date: string;
  cost: number;
  service: string;
  accountId: string;
  region: string;
  department: string;
  usageType: string;
  usageQuantity: number;
}

export interface AWSSavingsRecommendation {
  id: string;
  service: string;
  type: 'savings_plan' | 'reserved_instance' | 'rightsizing' | 'idle_cleanup';
  description: string;
  currentMonthlyCost: number;
  estimatedMonthlySavings: number;
  effort: 'low' | 'medium' | 'high';
  risk: 'low' | 'medium';
  action: string;
}

export class MockAWSDataService {
  private departments = ['Engineering', 'Data Science', 'Platform', 'Security', 'Operations', 'Marketing'];
  private regions = ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1'];
  private services = [
    { name: 'Amazon EC2', multiplier: 1.8, usageType: 'BoxUsage:c6i.2xlarge' },
    { name: 'Amazon EKS', multiplier: 1.3, usageType: 'Compute:NodeGroup' },
    { name: 'Amazon RDS (PostgreSQL)', multiplier: 1.5, usageType: 'InstanceUsage:db.r6g.xlarge' },
    { name: 'Amazon S3', multiplier: 0.9, usageType: 'Storage:StandardByteHrs' },
    { name: 'AWS Lambda', multiplier: 0.4, usageType: 'Invocations:Arm64' },
    { name: 'Amazon DynamoDB', multiplier: 0.8, usageType: 'ReadCapacityUnit-Hrs' },
    { name: 'AWS NAT Gateway', multiplier: 0.7, usageType: 'NatGateway-Bytes' },
    { name: 'Amazon CloudFront', multiplier: 0.6, usageType: 'DataTransfer-Out-Bytes' }
  ];

  public generateCostRecords(startDate: string, endDate: string, departmentFilter?: string): AWSCostRecord[] {
    const records: AWSCostRecord[] = [];
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
        const region = this.regions[(j + i) % this.regions.length];
        const deptMultiplier = [1.7, 1.4, 1.2, 0.8, 1.1, 0.9][j];
        const baseCost = 1400 + i * 15;
        const noise = (Math.sin(i * 12.5 + j) * 80);
        const cost = Math.round((baseCost + noise) * deptMultiplier * svc.multiplier * 100) / 100;

        records.push({
          date: dateStr,
          cost,
          service: svc.name,
          accountId: 'aws-acc-119824859012',
          region,
          department: dept,
          usageType: svc.usageType,
          usageQuantity: Math.round(cost * 1.8)
        });
      }
    }
    return records;
  }

  public getSavingsRecommendations(department?: string): AWSSavingsRecommendation[] {
    const recs: AWSSavingsRecommendation[] = [
      {
        id: 'aws-sp-01',
        service: 'Amazon EC2 & EKS',
        type: 'savings_plan',
        description: 'Purchase 3-Year Compute Savings Plans for baseline Kubernetes worker nodes.',
        currentMonthlyCost: 48500,
        estimatedMonthlySavings: 16975,
        effort: 'low',
        risk: 'low',
        action: 'Commit to $38.50/hr Compute Savings Plan to cover 78% of steady-state EC2/Fargate/Lambda usage.'
      },
      {
        id: 'aws-rs-02',
        service: 'Amazon RDS',
        type: 'rightsizing',
        description: 'Rightsize over-provisioned db.r6g.2xlarge PostgreSQL instances in staging.',
        currentMonthlyCost: 12400,
        estimatedMonthlySavings: 4960,
        effort: 'medium',
        risk: 'low',
        action: 'Downgrade memory allocation to db.r6g.xlarge based on 18% avg RAM utilization.'
      },
      {
        id: 'aws-s3-03',
        service: 'Amazon S3',
        type: 'idle_cleanup',
        description: 'Transition historical log buckets from S3 Standard to S3 Glacier Flexible Retrieval.',
        currentMonthlyCost: 8900,
        estimatedMonthlySavings: 5340,
        effort: 'low',
        risk: 'low',
        action: 'Configure S3 Lifecycle Rule to transition objects older than 30 days.'
      },
      {
        id: 'aws-nat-04',
        service: 'AWS NAT Gateway',
        type: 'rightsizing',
        description: 'Replace cross-AZ NAT Gateway routing with VPC Endpoints for S3 and DynamoDB.',
        currentMonthlyCost: 6200,
        estimatedMonthlySavings: 3800,
        effort: 'medium',
        risk: 'low',
        action: 'Create Gateway VPC Endpoints in all private subnets.'
      }
    ];

    return department ? recs.filter(r => r.service.toLowerCase().includes(department.toLowerCase())) : recs;
  }

  public getAnomalies(days: number = 30) {
    return [
      {
        id: 'anom-aws-01',
        service: 'Amazon EC2',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        expectedCost: 1850,
        actualCost: 3940,
        deviation: '+113%',
        rootCause: 'Unscheduled on-demand p4d.24xlarge GPU instance launch for model benchmarking.',
        severity: 'critical'
      },
      {
        id: 'anom-aws-02',
        service: 'Amazon CloudFront',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        expectedCost: 650,
        actualCost: 1420,
        deviation: '+118%',
        rootCause: 'Data egress surge during global asset caching synchronization.',
        severity: 'high'
      }
    ];
  }
}
