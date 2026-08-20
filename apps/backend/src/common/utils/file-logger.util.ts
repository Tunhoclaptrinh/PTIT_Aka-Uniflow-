import * as fs from 'fs';
import * as path from 'path';

/**
 * Enterprise File Logger Utility
 * Ghi log phân vùng theo từng subrepo:
 * - logs/backend/error.log
 * - logs/backend/combined.log
 * - logs/web/client-error.log
 */
export class FileLogger {
  private static findLogsRootDir(): string {
    // Tìm thư mục logs/ ở gốc workspace
    const candidates = [
      path.resolve(process.cwd(), 'logs'),
      path.resolve(process.cwd(), '../../logs'),
      path.resolve(__dirname, '../../../../logs'),
      path.resolve(__dirname, '../../../../../logs'),
    ];

    for (const dir of candidates) {
      try {
        const parent = path.dirname(dir);
        if (fs.existsSync(parent) && (fs.existsSync(path.join(parent, 'package.json')) || fs.existsSync(path.join(parent, 'apps')))) {
          return dir;
        }
      } catch {
        // continue
      }
    }

    return path.resolve(process.cwd(), 'logs');
  }

  private static getLogDir(subrepo: 'backend' | 'web' | 'ai-engine'): string {
    const rootLogs = this.findLogsRootDir();
    const targetDir = path.join(rootLogs, subrepo);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    return targetDir;
  }

  /**
   * Ghi log lỗi vào file error.log
   */
  static logError(
    subrepo: 'backend' | 'web' | 'ai-engine',
    message: string,
    stack?: string,
    meta?: Record<string, any>
  ) {
    try {
      const dir = this.getLogDir(subrepo);
      const filename = subrepo === 'web' ? 'client-error.log' : 'error.log';
      const filePath = path.join(dir, filename);

      const timestamp = new Date().toISOString();
      const logEntry = {
        timestamp,
        level: 'ERROR',
        subrepo,
        message,
        stack: stack || null,
        meta: meta || {},
      };

      const line = JSON.stringify(logEntry) + '\n';
      fs.appendFileSync(filePath, line, 'utf-8');

      // Ghi thêm vào combined.log nếu là backend
      if (subrepo === 'backend') {
        const combinedPath = path.join(dir, 'combined.log');
        fs.appendFileSync(combinedPath, line, 'utf-8');
      }
    } catch (err: any) {
      console.error('[FileLogger] Không thể ghi log vào file:', err.message);
    }
  }

  /**
   * Ghi log thông tin vào combined.log
   */
  static logInfo(subrepo: 'backend' | 'web' | 'ai-engine', message: string, meta?: Record<string, any>) {
    try {
      const dir = this.getLogDir(subrepo);
      const combinedPath = path.join(dir, 'combined.log');

      const timestamp = new Date().toISOString();
      const logEntry = {
        timestamp,
        level: 'INFO',
        subrepo,
        message,
        meta: meta || {},
      };

      const line = JSON.stringify(logEntry) + '\n';
      fs.appendFileSync(combinedPath, line, 'utf-8');
    } catch {
      // ignore
    }
  }
}
