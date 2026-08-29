#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { AWSCostService } from './services/aws-cost-service.js';
import { MockAWSDataService } from './services/mock-aws-data-service.js';

/**
 * AWS Cost Explorer & Savings MCP Server
 * Exposes tools for querying AWS Cost Explorer, Compute Optimizer, and Anomaly Detection
 */

function zodObjectToJsonSchema(schema: z.ZodObject<any>): { type: 'object'; properties: Record<string, unknown>; required: string[] } {
  const shape = schema.shape;
  const properties: Record<string, unknown> = {};
  const required: string[] = [];

  for (const [key, value] of Object.entries<any>(shape)) {
    let def = value;
    let isOptional = false;
    let defaultValue: unknown;

    if (def instanceof z.ZodDefault) {
      defaultValue = def._def.defaultValue();
      def = def._def.innerType;
    }
    if (def instanceof z.ZodOptional) {
      isOptional = true;
      def = def._def.innerType;
    }

    const prop: Record<string, unknown> = {};
    if (def instanceof z.ZodString) prop.type = 'string';
    else if (def instanceof z.ZodNumber) prop.type = 'number';
    else if (def instanceof z.ZodEnum) {
      prop.type = 'string';
      prop.enum = def._def.values;
    } else {
      prop.type = 'string';
    }

    const description = def._def?.description || value._def?.description;
    if (description) prop.description = description;
    if (defaultValue !== undefined) prop.default = defaultValue;

    properties[key] = prop;
    if (!isOptional && defaultValue === undefined) required.push(key);
  }

  return { type: 'object', properties, required };
}

const server = new Server({
  name: 'aws-cost-mcp-server',
  version: '1.0.0',
});

const mockDataService = new MockAWSDataService();
const awsCostService = new AWSCostService(mockDataService);

// Tool Schemas
const GetAWSCostSchema = z.object({
  startDate: z.string().describe('Start date in YYYY-MM-DD format'),
  endDate: z.string().describe('End date in YYYY-MM-DD format'),
  department: z.string().optional().describe('Optional department filter'),
  service: z.string().optional().describe('Optional AWS service name filter (e.g. Amazon EC2)'),
  region: z.string().optional().describe('Optional AWS region filter (e.g. us-east-1)'),
});

const GetAWSSavingsSchema = z.object({
  department: z.string().optional().describe('Optional department filter'),
});

const GetAWSAnomaliesSchema = z.object({
  days: z.number().default(30).describe('Number of days to analyze'),
});

const tools: Tool[] = [
  {
    name: 'get_aws_cost_and_usage',
    description: 'Query AWS Cost Explorer for multi-service spending data, region distribution, and usage',
    inputSchema: zodObjectToJsonSchema(GetAWSCostSchema),
  },
  {
    name: 'get_aws_savings_recommendations',
    description: 'Retrieve Compute Savings Plans, Reserved Instance, and Rightsizing recommendations',
    inputSchema: zodObjectToJsonSchema(GetAWSSavingsSchema),
  },
  {
    name: 'get_aws_cost_anomalies',
    description: 'Detect unexpected spend spikes and root cause analysis across AWS services',
    inputSchema: zodObjectToJsonSchema(GetAWSAnomaliesSchema),
  },
];

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'get_aws_cost_and_usage': {
        const parsed = GetAWSCostSchema.parse(args);
        const data = await awsCostService.getCostAndUsage(parsed);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      }

      case 'get_aws_savings_recommendations': {
        const parsed = GetAWSSavingsSchema.parse(args);
        const data = await awsCostService.getSavingsRecommendations(parsed.department);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      }

      case 'get_aws_cost_anomalies': {
        const parsed = GetAWSAnomaliesSchema.parse(args);
        const data = await awsCostService.getCostAnomalies(parsed.days);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown AWS tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('AWS Cost MCP Server running on stdio');
}

main().catch((error) => {
  console.error('AWS MCP Server error:', error);
  process.exit(1);
});
