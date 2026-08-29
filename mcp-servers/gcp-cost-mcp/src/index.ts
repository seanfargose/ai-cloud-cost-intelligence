#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { GCPCostService } from './services/gcp-cost-service.js';
import { MockGCPDataService } from './services/mock-gcp-data-service.js';

/**
 * GCP Cloud Billing & Recommender MCP Server
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
  name: 'gcp-cost-mcp-server',
  version: '1.0.0',
});

const mockDataService = new MockGCPDataService();
const gcpCostService = new GCPCostService(mockDataService);

const GetGCPBillingSchema = z.object({
  startDate: z.string().describe('Start date in YYYY-MM-DD format'),
  endDate: z.string().describe('End date in YYYY-MM-DD format'),
  department: z.string().optional().describe('Optional department filter'),
  service: z.string().optional().describe('Optional GCP service filter (e.g. BigQuery)'),
  location: z.string().optional().describe('Optional GCP location/region filter (e.g. us-central1)'),
});

const GetGCPRecommenderSchema = z.object({
  department: z.string().optional().describe('Optional department filter'),
});

const tools: Tool[] = [
  {
    name: 'get_gcp_billing_data',
    description: 'Query GCP Cloud Billing & BigQuery export for multi-service spend and location distribution',
    inputSchema: zodObjectToJsonSchema(GetGCPBillingSchema),
  },
  {
    name: 'get_gcp_recommender_insights',
    description: 'Retrieve GCP Recommender API insights (Committed Use Discounts, BigQuery slot reservations, lifecycle rules)',
    inputSchema: zodObjectToJsonSchema(GetGCPRecommenderSchema),
  },
];

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'get_gcp_billing_data': {
        const parsed = GetGCPBillingSchema.parse(args);
        const data = await gcpCostService.getBillingData(parsed);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      }

      case 'get_gcp_recommender_insights': {
        const parsed = GetGCPRecommenderSchema.parse(args);
        const data = await gcpCostService.getRecommenderInsights(parsed.department);
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
        throw new Error(`Unknown GCP tool: ${name}`);
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
  console.error('GCP Cost MCP Server running on stdio');
}

main().catch((error) => {
  console.error('GCP MCP Server error:', error);
  process.exit(1);
});
