import { Star, Clock } from 'lucide-react';
import type { Mediator } from '@/types';
import { formatNumber } from '@/utils/format';

interface MediatorCardProps {
  mediator: Mediator;
  selected?: boolean;
  onClick?: () => void;
}

export function MediatorCard({ mediator, selected = false, onClick }: MediatorCardProps) {
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
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">{mediator.nickname}</span>
            {selected && (
              <span className="tag-neon bg-neon-purple/20 text-neon-purple text-[10px]">已选择</span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-white/60">
            <span className="flex items-center gap-1">
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              {mediator.rating}
            </span>
            <span>累计 {formatNumber(mediator.totalOrders)} 单</span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-white/50">
            <Clock size={12} className="text-neon-cyan" />
            <span>{mediator.responseTime}响应</span>
            <span className="text-white/30">|</span>
            <span>今日 {mediator.todayOrders} 单</span>
          </div>
        </div>
      </div>
      {mediator.isOnline && (
        <p className="mt-3 text-xs text-white/50 line-clamp-2">{mediator.introduction}</p>
      )}
    </div>
  );
}
