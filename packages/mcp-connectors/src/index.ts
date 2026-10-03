#!/usr/bin/env node
import * as readline from 'readline';
import { UniflowMcpServer, JsonRpcRequest } from './server';

export * from './server';

async function runStdio() {
  const server = new UniflowMcpServer();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  rl.on('line', async (line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    try {
      const request: JsonRpcRequest = JSON.parse(trimmed);
      const response = await server.handleRequest(request);
      if (response) {
        process.stdout.write(JSON.stringify(response) + '\n');
      }
    } catch (err: any) {
      const errResponse = {
        jsonrpc: '2.0',
        id: null,
        error: {
          code: -32700,
          message: 'Parse error: ' + err.message,
        },
      };
      process.stdout.write(JSON.stringify(errResponse) + '\n');
    }
  });

  process.stderr.write('UniFlow Connector MCP Server is running on stdio...\n');
}

if (require.main === module) {
  runStdio();
}
