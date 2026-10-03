/**
 * UniFlow — Workflow Scheduler Service
 * Quản lý lịch thực thi tự động dựa trên cron expression trong node config.
 * Sử dụng @nestjs/schedule — không cần Bull/Redis cho cron cơ bản.
 */

import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Workflow, WorkflowDocument } from '../../database/schemas/workflow.schema';
import { WorkflowExecutionEngine } from './workflow-execution.engine';

interface ScheduledJob {
  workflowId: string;
  tenantId: string;
  cronExpr: string;
  timer: ReturnType<typeof setInterval> | null;
  nextRun: Date;
}

// Simple cron parser — hỗ trợ các format phổ biến:
// - "*/5 * * * *"  → mỗi 5 phút
// - "0 9 * * *"    → 9:00 sáng hàng ngày
// - "0 */2 * * *"  → mỗi 2 tiếng
function cronToMs(cronExpr: string): number | null {
  const parts = cronExpr.trim().split(/\s+/);
  if (parts.length !== 5) return null;

  const [minute, hour] = parts;

  // Chỉ hỗ trợ interval-based cron (*/n)
  if (minute.startsWith('*/')) {
    const n = parseInt(minute.slice(2), 10);
    if (!isNaN(n) && n > 0) return n * 60 * 1000;
  }
  if (hour.startsWith('*/')) {
    const n = parseInt(hour.slice(2), 10);
    if (!isNaN(n) && n > 0) return n * 60 * 60 * 1000;
  }

  // Hằng ngày lúc H:MM → tính ms đến lần chạy tiếp theo
  if (!minute.includes('*') && !hour.includes('*')) {
    const m = parseInt(minute, 10);
    const h = parseInt(hour, 10);
    if (!isNaN(m) && !isNaN(h)) {
      const now = new Date();
      const next = new Date(now);
      next.setHours(h, m, 0, 0);
      if (next <= now) next.setDate(next.getDate() + 1);
      return 24 * 60 * 60 * 1000; // repeat daily
    }
  }

  return null; // Cron phức tạp hơn → cần @nestjs/schedule
}

@Injectable()
export class WorkflowSchedulerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(WorkflowSchedulerService.name);
  private readonly jobs = new Map<string, ScheduledJob>();

  constructor(
    @InjectModel(Workflow.name) private readonly workflowModel: Model<WorkflowDocument>,
    private readonly executionEngine: WorkflowExecutionEngine,
  ) {}

  async onModuleInit() {
    this.logger.log('[Scheduler] Khởi tạo Workflow Scheduler...');
    await this.loadAndScheduleAll();
    // Reload lịch mỗi 10 phút để cập nhật workflow mới được tạo
    setInterval(() => this.loadAndScheduleAll(), 10 * 60 * 1000);
  }

  onModuleDestroy() {
    this.logger.log('[Scheduler] Dừng toàn bộ scheduled jobs...');
    for (const [id, job] of this.jobs.entries()) {
      if (job.timer) clearInterval(job.timer as any);
      this.jobs.delete(id);
    }
  }

  /** Reload tất cả workflow active có node cron */
  async loadAndScheduleAll() {
    try {
      const activeWorkflows = await this.workflowModel.find({ isActive: true }).lean().exec();
      const scheduledIds = new Set<string>();

      for (const wf of activeWorkflows) {
        const cronNode = (wf.nodes || []).find((n: any) =>
          n.data?.label?.toLowerCase().includes('cron') ||
          n.data?.label?.toLowerCase().includes('lập lịch') ||
          n.data?.label?.toLowerCase().includes('timer') ||
          n.data?.cronExpression
        );
        if (!cronNode) continue;

        const cronExpr: string = cronNode.data?.cronExpression || '*/30 * * * *'; // mặc định 30 phút
        const wfId = wf._id?.toString() || '';
        const tenantId = wf.tenantId?.toString() || '';

        scheduledIds.add(wfId);

        if (!this.jobs.has(wfId)) {
          this.scheduleWorkflow(wfId, tenantId, cronExpr);
        }
      }

      // Hủy các job không còn active
      for (const [id, job] of this.jobs.entries()) {
        if (!scheduledIds.has(id)) {
          if (job.timer) clearInterval(job.timer as any);
          this.jobs.delete(id);
          this.logger.log(`[Scheduler] Đã hủy lịch cho workflow ${id}`);
        }
      }
    } catch (err: any) {
      this.logger.error(`[Scheduler] Lỗi load workflows: ${err.message}`);
    }
  }

  /** Đặt lịch thực thi cho 1 workflow */
  scheduleWorkflow(workflowId: string, tenantId: string, cronExpr: string) {
    const intervalMs = cronToMs(cronExpr);
    if (!intervalMs) {
      this.logger.warn(`[Scheduler] Không parse được cron "${cronExpr}" cho workflow ${workflowId} — Bỏ qua.`);
      return;
    }

    const timer = setInterval(async () => {
      this.logger.log(`[Scheduler] ⏰ Kích hoạt Cron workflow "${workflowId}" (${cronExpr})`);
      try {
        const result = await this.executionEngine.execute(
          workflowId,
          {
            trigger: 'CRON',
            cronExpression: cronExpr,
            triggeredAt: new Date().toISOString(),
            orderId: `CRON_${Date.now()}`,
            platform: 'CRON_SCHEDULER',
          },
          tenantId,
        );
        this.logger.log(`[Scheduler] Cron workflow hoàn tất — ${result.totalNodes} bước, ${result.durationMs}ms`);
      } catch (err: any) {
        this.logger.error(`[Scheduler] Lỗi khi chạy cron workflow ${workflowId}: ${err.message}`);
      }
    }, intervalMs);

    this.jobs.set(workflowId, {
      workflowId,
      tenantId,
      cronExpr,
      timer,
      nextRun: new Date(Date.now() + intervalMs),
    });

    this.logger.log(`[Scheduler] ✅ Đã đặt lịch workflow ${workflowId} — "${cronExpr}" (mỗi ${intervalMs / 1000}s)`);
  }

  /** Hủy lịch 1 workflow cụ thể */
  unscheduleWorkflow(workflowId: string) {
    const job = this.jobs.get(workflowId);
    if (job?.timer) {
      clearInterval(job.timer as any);
      this.jobs.delete(workflowId);
      this.logger.log(`[Scheduler] Đã hủy lịch workflow ${workflowId}`);
    }
  }

  /** Danh sách tất cả jobs đang chạy */
  getScheduledJobs(): Array<{ workflowId: string; cronExpr: string; nextRun: Date }> {
    return Array.from(this.jobs.values()).map(j => ({
      workflowId: j.workflowId,
      cronExpr: j.cronExpr,
      nextRun: j.nextRun,
    }));
  }
}
