import { X, Clock, ShieldCheck, AlertTriangle, CheckCircle2, Star, TrendingUp } from 'lucide-react';
import type { Mediator, MediatorOrderRecord } from '@/types';
import { formatPrice, formatDate } from '@/utils/format';

interface MediatorRecordsModalProps {
  mediator: Mediator;
  records: MediatorOrderRecord[];
  onClose: () => void;
}

export function MediatorRecordsModal({ mediator, records, onClose }: MediatorRecordsModalProps) {
  const completed = records.filter((r) => r.status === 'completed').length;
  const disputed = records.filter((r) => r.status === 'disputed').length;
  const processing = records.filter((r) => r.status === 'processing').length;
  const avgResponse =
    records.length > 0 ? Math.round(records.reduce((a, b) => a + b.responseMinutes, 0) / records.length) : 0;
  const avgDuration =
    records.length > 0 ? Math.round(records.reduce((a, b) => a + b.durationMinutes, 0) / records.length) : 0;

  const statusConfig = {
    completed: { label: '已完成', color: 'bg-green-500/20 text-green-400', icon: CheckCircle2 },
    disputed: { label: '纠纷', color: 'bg-red-500/20 text-red-400', icon: AlertTriangle },
    processing: { label: '处理中', color: 'bg-neon-cyan/20 text-neon-cyan', icon: Clock },
  };

  const resultConfig = {
    buyer_win: { label: '买家胜诉', color: 'text-neon-cyan' },
    seller_win: { label: '卖家胜诉', color: 'text-neon-orange' },
    compromise: { label: '双方和解', color: 'text-neon-purple' },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/80 backdrop-blur-sm">
      <div className="glass-card w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={mediator.avatar}
                alt={mediator.nickname}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-neon-purple/40"
              />
              {mediator.isOnline && (
                <span className="status-dot absolute -bottom-0.5 -right-0.5">
                  <span />
                </span>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{mediator.nickname}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="flex items-center gap-1 text-sm text-yellow-400">
                  <Star size={14} className="fill-yellow-400" />
                  {mediator.rating}
                </span>
                <span className="text-xs text-white/40">|</span>
                <span className="text-sm text-white/60">累计 {mediator.totalOrders} 单</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 border-b border-white/5">
          <p className="text-sm text-white/70 mb-4">{mediator.introduction}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <CheckCircle2 size={14} className="text-green-400" />
                <span className="text-xs text-green-400">已完成</span>
              </div>
              <div className="text-xl font-bold text-white">{completed}</div>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <AlertTriangle size={14} className="text-red-400" />
                <span className="text-xs text-red-400">纠纷</span>
              </div>
              <div className="text-xl font-bold text-white">{disputed}</div>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-neon-cyan/10 to-neon-cyan/5 border border-neon-cyan/20 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock size={14} className="text-neon-cyan" />
                <span className="text-xs text-neon-cyan">响应时间</span>
              </div>
              <div className="text-xl font-bold text-white">
                {avgResponse || mediator.avgResponseMinutes}分
              </div>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-neon-purple/10 to-neon-purple/5 border border-neon-purple/20 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp size={14} className="text-neon-purple" />
                <span className="text-xs text-neon-purple">近7日</span>
              </div>
              <div className="text-xl font-bold text-white">{mediator.completedOrders7Days}</div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-white/5 flex items-center justify-between">
              <span className="text-sm text-white/60">纠纷调解率</span>
              <span className="text-lg font-bold text-green-400">{mediator.disputeResolutionRate}%</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 flex items-center justify-between">
              <span className="text-sm text-white/60">平均处理时长</span>
              <span className="text-lg font-bold text-white">
                {avgDuration >= 60 ? `${Math.floor(avgDuration / 60)}小时${avgDuration % 60}分` : `${avgDuration}分钟`}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-white flex items-center gap-2">
              <ShieldCheck size={18} className="text-neon-cyan" />
              最近担保记录
            </h4>
            <span className="text-xs text-white/40">共 {records.length} 条</span>
          </div>

          <div className="space-y-3">
            {records.length === 0 ? (
              <div className="text-center py-10 text-white/40">
                <ShieldCheck size={36} className="mx-auto mb-2 opacity-30" />
                <p>暂无担保记录</p>
              </div>
            ) : (
              records.map((record) => {
                const StatusIcon = statusConfig[record.status].icon;
                return (
                  <div
                    key={record.id}
                    className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <p className="font-medium text-white text-sm flex-1 truncate">{record.postTitle}</p>
                      <span className={`tag-neon ${statusConfig[record.status].color} flex items-center gap-1 shrink-0`}>
                        <StatusIcon size={12} />
                        {statusConfig[record.status].label}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/50">
                      <span>
                        金额：<span className="text-neon-purple font-medium">{formatPrice(record.amount)}</span>
                      </span>
                      <span>买家：{record.buyer}</span>
                      <span>卖家：{record.seller}</span>
                      <span>{formatDate(record.createdAt)}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-2 pt-2 border-t border-white/5 text-xs">
                      <span className="flex items-center gap-1 text-white/40">
                        <Clock size={12} />
                        响应 {record.responseMinutes} 分钟
                      </span>
                      <span className="flex items-center gap-1 text-white/40">
                        处理时长 {record.durationMinutes >= 60 ? `${Math.floor(record.durationMinutes / 60)}h${record.durationMinutes % 60}m` : `${record.durationMinutes}m`}
                      </span>
                      {record.result && (
                        <span className={`flex items-center gap-1 ${resultConfig[record.result].color}`}>
                          <ShieldCheck size={12} />
                          {resultConfig[record.result].label}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
