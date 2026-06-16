import { Star, Clock, FileText } from 'lucide-react';
import type { Mediator } from '@/types';
import { formatNumber } from '@/utils/format';

interface MediatorCardProps {
  mediator: Mediator;
  selected?: boolean;
  onClick?: () => void;
  onViewRecords?: () => void;
}

export function MediatorCard({ mediator, selected = false, onClick, onViewRecords }: MediatorCardProps) {
  return (
    <div
      onClick={onClick}
      className={`glass-card p-4 cursor-pointer transition-all duration-300 ${
        selected
          ? 'border-neon-purple/50 shadow-neon'
          : 'hover:border-white/15'
      } ${!mediator.isOnline ? 'opacity-60' : ''}`}
    >
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <img
            src={mediator.avatar}
            alt={mediator.nickname}
            className="w-14 h-14 rounded-xl object-cover ring-2 ring-neon-purple/30"
          />
          {mediator.isOnline && (
            <span className="status-dot absolute -bottom-0.5 -right-0.5">
              <span />
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-semibold text-white truncate">{mediator.nickname}</span>
              {selected && (
                <span className="tag-neon bg-neon-purple/20 text-neon-purple text-[10px] shrink-0">已选择</span>
              )}
            </div>
            {onViewRecords && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewRecords();
                }}
                className="flex items-center gap-1 px-2 py-1 text-[10px] rounded-lg bg-white/5 hover:bg-neon-cyan/15 text-white/60 hover:text-neon-cyan transition-colors shrink-0"
              >
                <FileText size={12} />
                记录
              </button>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-white/60">
            <span className="flex items-center gap-1">
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              {mediator.rating}
            </span>
            <span>累计 {formatNumber(mediator.totalOrders)} 单</span>
            <span className="text-green-400">调解率 {mediator.disputeResolutionRate}%</span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-white/50">
            <Clock size={12} className="text-neon-cyan" />
            <span>{mediator.responseTime}响应</span>
            <span className="text-white/30">|</span>
            <span>今日 {mediator.todayOrders} 单</span>
            <span className="text-white/30">|</span>
            <span>近7日 {mediator.completedOrders7Days} 单</span>
          </div>
        </div>
      </div>
      {mediator.isOnline && (
        <p className="mt-3 text-xs text-white/50 line-clamp-2">{mediator.introduction}</p>
      )}
    </div>
  );
}
