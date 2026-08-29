import { spawn, ChildProcess } from 'child_process';
import { EventEmitter } from 'events';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '../../../');

export interface MCPServer {
  name: string;
  command: string;
  args: string[];
  env?: Record<string, string>;
  process?: ChildProcess;
  status: 'stopped' | 'starting' | 'running' | 'error';
  lastError?: string;
  startedAt?: Date;
}

export interface MCPToolCall {
  server: string;
  tool: string;
  arguments: Record<string, any>;
  timeout?: number;
}

export interface MCPToolResponse {
  success: boolean;
  data?: any;
  error?: string;
  executionTime: number;
}

export interface UnifiedMultiCloudRecord {
  id: string;
  provider: 'azure' | 'aws' | 'gcp';
  accountId: string;
  region: string;
  service: string;
  department: string;
  cost: number;
  currency: string;
  date: string;
  usageQuantity: number;
}

export class MCPIntegrationService extends EventEmitter {
  private servers = new Map<string, MCPServer>();
  private isInitialized = false;

  constructor() {
    super();
    this.initializeDefaultServers();
  }

  private initializeDefaultServers() {
    // Azure Cost MCP Server
    this.servers.set('azure-cost', {
      name: 'azure-cost',
      command: 'npm',
      args: ['run', 'start', '--workspace=mcp-servers/azure-cost-mcp'],
      env: { ...process.env, NODE_ENV: 'production' },
      status: 'stopped'
    });

    // AWS Cost Explorer MCP Server
    this.servers.set('aws-cost', {
      name: 'aws-cost',
      command: 'npm',
      args: ['run', 'start', '--workspace=mcp-servers/aws-cost-mcp'],
      env: { ...process.env, NODE_ENV: 'production' },
      status: 'stopped'
    });

    // GCP Cloud Billing MCP Server
    this.servers.set('gcp-cost', {
      name: 'gcp-cost',
      command: 'npm',
      args: ['run', 'start', '--workspace=mcp-servers/gcp-cost-mcp'],
      env: { ...process.env, NODE_ENV: 'production' },
      status: 'stopped'
    });

    console.log('✅ Multi-Cloud MCP servers configured: Azure, AWS, GCP');
  }

  async initialize(): Promise<void> {
    try {
      for (const [name] of this.servers) {
        await this.startServer(name);
      }
      this.isInitialized = true;
      console.log('✅ MCP Integration Service initialized across all cloud providers');
    } catch (error) {
      console.error('❌ MCP Integration Service initialization failed:', error);
      throw error;
    }
  }

  async startServer(serverName: string): Promise<boolean> {
    const server = this.servers.get(serverName);
    if (!server) throw new Error(`Server ${serverName} not found`);
    if (server.status === 'running') return true;

    try {
      server.status = 'starting';
      console.log(`🚀 Starting MCP server: ${serverName}`);

      const childProcess = spawn(server.command, server.args, {
        env: server.env,
        stdio: ['pipe', 'pipe', 'pipe'],
        cwd: REPO_ROOT
      });

      server.process = childProcess;
      server.startedAt = new Date();

      childProcess.on('spawn', () => {
        server.status = 'running';
        console.log(`✅ MCP server ${serverName} started successfully`);
        this.emit('serverStarted', serverName);
      });

      childProcess.on('error', (error) => {
        server.status = 'error';
        server.lastError = error.message;
        console.error(`❌ MCP server ${serverName} error:`, error);
        this.emit('serverError', serverName, error);
      });

      childProcess.on('exit', (code, signal) => {
        server.status = 'stopped';
        console.log(`🛑 MCP server ${serverName} exited with code ${code}, signal ${signal}`);
        this.emit('serverStopped', serverName, code, signal);
      });

      childProcess.stdout?.on('data', (data) => {
        console.log(`[${serverName}] ${data.toString().trim()}`);
      });

      childProcess.stderr?.on('data', (data) => {
        console.error(`[${serverName}] ${data.toString().trim()}`);
      });

      await new Promise(resolve => setTimeout(resolve, 1500));
      return (server.status as string) === 'running';
    } catch (error) {
      server.status = 'error';
      server.lastError = error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ Failed to start MCP server ${serverName}:`, error);
      return false;
    }
  }

  async stopServer(serverName: string): Promise<boolean> {
    const server = this.servers.get(serverName);
    if (!server || !server.process) return true;

    try {
      console.log(`🛑 Stopping MCP server: ${serverName}`);
      server.process.kill('SIGTERM');
      await new Promise(resolve => setTimeout(resolve, 2000));
      if (server.status === 'running') server.process.kill('SIGKILL');
      server.status = 'stopped';
      server.process = undefined;
      return true;
    } catch (error) {
      console.error(`❌ Failed to stop MCP server ${serverName}:`, error);
      return false;
    }
  }

  async restartServer(serverName: string): Promise<boolean> {
    await this.stopServer(serverName);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return this.startServer(serverName);
  }

  async callTool(toolCall: MCPToolCall): Promise<MCPToolResponse> {
    const startTime = Date.now();
    const server = this.servers.get(toolCall.server);

    if (!server) {
      return {
        success: false,
        error: `Server ${toolCall.server} not found`,
        executionTime: Date.now() - startTime
      };
    }

    try {
      const result = await this.simulateToolCall(toolCall);
      return {
        success: true,
        data: result,
        executionTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime: Date.now() - startTime
      };
    }
  }

  // Provider convenience helpers
  async getCostData(params: {
    startDate: string;
    endDate: string;
    subscriptionId?: string;
    department?: string;
    resourceType?: string;
  }): Promise<MCPToolResponse> {
    return this.callTool({
      server: 'azure-cost',
      tool: 'get_cost_data',
      arguments: params
    });
  }

  async getCostAnomalies(params: {
    days?: number;
    threshold?: number;
  }): Promise<MCPToolResponse> {
    return this.callTool({
      server: 'azure-cost',
      tool: 'get_cost_anomalies',
      arguments: params
    });
  }

  async getOptimizationRecommendations(params: {
    department?: string;
    minSavings?: number;
  }): Promise<MCPToolResponse> {
    return this.callTool({
      server: 'azure-cost',
      tool: 'get_optimization_recommendations',
      arguments: params
    });
  }

  async getUsageTrends(params: {
    resourceType?: string;
    period?: 'daily' | 'weekly' | 'monthly';
    days?: number;
  }): Promise<MCPToolResponse> {
    return this.callTool({
      server: 'azure-cost',
      tool: 'get_usage_trends',
      arguments: params
    });
  }

  async getDepartmentBreakdown(params: {
    month?: string;
  }): Promise<MCPToolResponse> {
    return this.callTool({
      server: 'azure-cost',
      tool: 'get_department_breakdown',
      arguments: params
    });
  }

  async getResourceRightsizing(params: {
    utilizationThreshold?: number;
  }): Promise<MCPToolResponse> {
    return this.callTool({
      server: 'azure-cost',
      tool: 'get_resource_rightsizing',
      arguments: params
    });
  }

  // Multi-Cloud Aggregator
  async getMultiCloudCostData(params: {
    startDate: string;
    endDate: string;
    providers?: ('azure' | 'aws' | 'gcp')[];
    department?: string;
  }): Promise<{
    records: UnifiedMultiCloudRecord[];
    summary: {
      totalCost: number;
      byProvider: Record<string, number>;
      byDepartment: Record<string, number>;
      dateRange: { start: string; end: string };
    };
  }> {
    const requestedProviders = params.providers || ['azure', 'aws', 'gcp'];
    const allRecords: UnifiedMultiCloudRecord[] = [];

    if (requestedProviders.includes('azure')) {
      const azureResp = await this.callTool({
        server: 'azure-cost',
        tool: 'get_cost_data',
        arguments: { startDate: params.startDate, endDate: params.endDate, department: params.department }
      });
      if (azureResp.success && Array.isArray(azureResp.data?.data)) {
        azureResp.data.data.forEach((r: any) => {
          allRecords.push({
            id: r.id || `az-${r.date}-${Math.random().toString(36).substr(2, 6)}`,
            provider: 'azure',
            accountId: r.subscriptionId || 'sub-prod-0089124',
            region: r.metadata?.region || 'eastus',
            service: r.serviceName || 'Virtual Machines',
            department: r.department || 'Engineering',
            cost: Number(r.cost) || 0,
            currency: 'USD',
            date: r.date,
            usageQuantity: Math.round(Number(r.cost) * 1.6)
          });
        });
      }
    }

    if (requestedProviders.includes('aws')) {
      const awsResp = await this.callTool({
        server: 'aws-cost',
        tool: 'get_aws_cost_and_usage',
        arguments: { startDate: params.startDate, endDate: params.endDate, department: params.department }
      });
      if (awsResp.success && Array.isArray(awsResp.data?.records)) {
        awsResp.data.records.forEach((r: any) => {
          allRecords.push({
            id: `aws-${r.date}-${Math.random().toString(36).substr(2, 6)}`,
            provider: 'aws',
            accountId: r.accountId || 'aws-acc-119824859012',
            region: r.region || 'us-east-1',
            service: r.service || 'Amazon EC2',
            department: r.department || 'Engineering',
            cost: Number(r.cost) || 0,
            currency: 'USD',
            date: r.date,
            usageQuantity: r.usageQuantity || Math.round(Number(r.cost) * 1.8)
          });
        });
      }
    }

    if (requestedProviders.includes('gcp')) {
      const gcpResp = await this.callTool({
        server: 'gcp-cost',
        tool: 'get_gcp_billing_data',
        arguments: { startDate: params.startDate, endDate: params.endDate, department: params.department }
      });
      if (gcpResp.success && Array.isArray(gcpResp.data?.records)) {
        gcpResp.data.records.forEach((r: any) => {
          allRecords.push({
            id: `gcp-${r.date}-${Math.random().toString(36).substr(2, 6)}`,
            provider: 'gcp',
            accountId: r.projectId || 'gcp-prod-analytics-40981',
            region: r.location || 'us-central1',
            service: r.service || 'Google Compute Engine',
            department: r.department || 'Engineering',
            cost: Number(r.cost) || 0,
            currency: 'USD',
            date: r.date,
            usageQuantity: r.usageQuantity || Math.round(Number(r.cost) * 1.5)
          });
        });
      }
    }

    const byProvider: Record<string, number> = {};
    const byDepartment: Record<string, number> = {};
    let totalCost = 0;

    for (const r of allRecords) {
      totalCost += r.cost;
      byProvider[r.provider] = (byProvider[r.provider] || 0) + r.cost;
      byDepartment[r.department] = (byDepartment[r.department] || 0) + r.cost;
    }

    return {
      records: allRecords,
      summary: {
        totalCost: Math.round(totalCost * 100) / 100,
        byProvider,
        byDepartment,
        dateRange: { start: params.startDate, end: params.endDate }
      }
    };
  }

  // Health check
  isHealthy(): boolean {
    if (!this.isInitialized) return false;
    const runningServers = Array.from(this.servers.values()).filter(s => s.status === 'running');
    return runningServers.length > 0;
  }

  getServerStatus(serverName?: string): MCPServer | MCPServer[] {
    if (serverName) {
      const server = this.servers.get(serverName);
      if (!server) throw new Error(`Server ${serverName} not found`);
      return { ...server, process: undefined };
    }
    return Array.from(this.servers.values()).map(server => ({
      ...server,
      process: undefined
    }));
  }

  async cleanup(): Promise<void> {
    console.log('🧹 Cleaning up MCP servers...');
    const stopPromises = Array.from(this.servers.keys()).map(s => this.stopServer(s));
    await Promise.all(stopPromises);
    console.log('✅ MCP servers cleanup completed');
  }

  private async simulateToolCall(toolCall: MCPToolCall): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 50));

    if (toolCall.server === 'azure-cost') {
      return this.generateMockAzureData(toolCall.arguments);
    }
    if (toolCall.server === 'aws-cost') {
      return this.generateMockAWSData(toolCall.arguments);
    }
    if (toolCall.server === 'gcp-cost') {
      return this.generateMockGCPData(toolCall.arguments);
    }

    throw new Error(`Unknown server: ${toolCall.server}`);
  }

  private generateMockAzureData(params: any): any {
    const startDate = new Date(params.startDate || new Date(Date.now() - 30 * 86400000));
    const data = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      data.push({
        id: `az-${date.toISOString().slice(0, 10)}-${i}`,
        date: date.toISOString().slice(0, 10),
        cost: Math.round((2800 + Math.sin(i) * 300) * 100) / 100,
        currency: 'USD',
        resourceGroup: 'rg-engineering',
        serviceName: 'Virtual Machines',
        department: params.department || 'Engineering',
        subscriptionId: 'sub-prod-0089124',
        metadata: { region: 'eastus' }
      });
    }
    return { data };
  }

  private generateMockAWSData(params: any): any {
    const startDate = new Date(params.startDate || new Date(Date.now() - 30 * 86400000));
    const records = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      records.push({
        date: date.toISOString().slice(0, 10),
        cost: Math.round((3400 + Math.cos(i) * 400) * 100) / 100,
        service: 'Amazon EC2',
        accountId: 'aws-acc-119824859012',
        region: 'us-east-1',
        department: params.department || 'Engineering',
        usageQuantity: 1400
      });
    }
    return { records };
  }

  private generateMockGCPData(params: any): any {
    const startDate = new Date(params.startDate || new Date(Date.now() - 30 * 86400000));
    const records = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      records.push({
        date: date.toISOString().slice(0, 10),
        cost: Math.round((2100 + Math.sin(i * 1.5) * 250) * 100) / 100,
        service: 'Google Compute Engine',
        projectId: 'gcp-prod-analytics-40981',
        location: 'us-central1',
        department: params.department || 'Engineering',
        usageQuantity: 950
      });
    }
    return { records };
  }
}