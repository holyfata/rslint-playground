/**
 * Merge https://github.com/web-infra-dev/rslint/blob/main/packages/rslint/src/service.ts and https://github.com/web-infra-dev/rslint/blob/main/packages/rslint/src/index.ts to expose lint function.
 */

import { spawn, ChildProcess } from 'child_process';
import path from 'path';
import { PendingMessage, RSlintOptions, LintOptions, LintResponse } from '@/types';

/**
 * Wrapper for the rslint binary communication via IPC
 */
class RSLintService {
  private nextMessageId: number;
  private pendingMessages: Map<number, PendingMessage>;
  private rslintPath: string;
  private process: ChildProcess;
  private chunks: Buffer[];
  private chunkSize: number;
  private expectedSize: number | null;

  constructor(options: RSlintOptions = {}) {
    this.nextMessageId = 1;
    this.pendingMessages = new Map();
    this.rslintPath =
      options.rslintPath || path.join(import.meta.dirname, '../bin/rslint');

    this.process = spawn(this.rslintPath, ['--api'], {
      stdio: ['pipe', 'pipe', 'inherit'],
      cwd: options.workingDirectory || process.cwd(),
      env: {
        ...process.env,
      },
    });

    // Set up binary message reading
    this.process.stdout!.on('data', data => {
      this.handleChunk(data);
    });
    this.chunks = [];
    this.chunkSize = 0;
    this.expectedSize = null;
  }

  /**
   * Send a message to the rslint process
   */
  private async sendMessage(kind: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const id = this.nextMessageId++;
      const message = { id, kind, data };

      // Register promise callbacks
      this.pendingMessages.set(id, { resolve, reject });

      // Write message length as 4 bytes in little endian
      const json = JSON.stringify(message);
      const length = Buffer.alloc(4);
      length.writeUInt32LE(json.length, 0);

      // Send message
      this.process.stdin!.write(
        Buffer.concat([length, Buffer.from(json, 'utf8')]),
      );
    });
  }

  /**
   * Handle incoming binary data chunks
   */
  private handleChunk(chunk: Buffer): void {
    this.chunks.push(chunk);
    this.chunkSize += chunk.length;

    // Process complete messages
    while (true) {
      // Read message length if we don't have it yet
      if (this.expectedSize === null) {
        if (this.chunkSize < 4) return;

        // Combine chunks to read the message length
        const combined = Buffer.concat(this.chunks);
        this.expectedSize = combined.readUInt32LE(0);

        // Remove length bytes from buffer
        this.chunks = [combined.slice(4)];
        this.chunkSize -= 4;
      }

      // Check if we have the full message
      if (this.chunkSize < this.expectedSize) return;

      // Read the message content
      const combined = Buffer.concat(this.chunks);
      const message = combined.slice(0, this.expectedSize).toString('utf8');

      // Handle the message
      try {
        const parsed = JSON.parse(message);
        this.handleMessage(parsed);
      } catch (err) {
        console.error('Error parsing message:', err);
      }

      // Reset for next message
      this.chunks = [combined.slice(this.expectedSize)];
      this.chunkSize = this.chunks[0].length;
      this.expectedSize = null;
    }
  }

  /**
   * Handle a complete message from rslint
   */
  private handleMessage(message: {
    id: number;
    kind: string;
    data: any;
  }): void {
    const { id, kind, data } = message;
    const pending = this.pendingMessages.get(id);
    if (!pending) return;

    this.pendingMessages.delete(id);

    if (kind === 'error') {
      pending.reject(new Error(data.message));
    } else {
      pending.resolve(data);
    }
  }

  /**
   * Run the linter on specified files
   */
  async lint(options: LintOptions = {}): Promise<LintResponse> {
    const { files, config, workingDirectory, ruleOptions, fileContents } =
      options;
    // Send handshake
    await this.sendMessage('handshake', { version: '1.0.0' });

    // Send lint request
    return this.sendMessage('lint', {
      files,
      config,
      workingDirectory,
      ruleOptions,
      fileContents,
      format: 'jsonline',
    });
  }

  /**
   * Close the rslint process
   */
  async close(): Promise<void> {
    return new Promise(resolve => {
      this.sendMessage('exit', {}).finally(() => {
        this.process.stdin!.end();
        resolve();
      });
    });
  }
}

// For backward compatibility and convenience
export async function lint(options: LintOptions): Promise<LintResponse> {
  const service = new RSLintService({
    workingDirectory: options.workingDirectory,
  });
  const result = await service.lint(options);
  await service.close();
  return result;
}
