/**
 * Types for rslint IPC protocol
 */
export interface Position {
  line: number;
  column: number;
}

export interface Range {
  start: Position;
  end: Position;
}

export interface Diagnostic {
  ruleName: string;
  message: string;
  messageId: string;
  filePath: string;
  range: Range;
  severity?: string;
  suggestions: any[];
}

export interface LintResponse {
  diagnostics: Diagnostic[];
  errorCount: number;
  fileCount: number;
  ruleCount: number;
  duration: string;
}

export interface LintOptions {
  files?: string[];
  config?: string; // Path to rslint.json config file
  workingDirectory?: string;
  ruleOptions?: Record<string, string>;
  fileContents?: Record<string, string>; // Map of file paths to their contents for VFS
}

export interface RSlintOptions {
  rslintPath?: string;
  workingDirectory?: string;
}

export interface PendingMessage {
  resolve: (data: any) => void;
  reject: (error: Error) => void;
}