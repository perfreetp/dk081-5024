import { Link } from 'react-router-dom';
import { Users, Flame, ShoppingBag } from 'lucide-react';
import type { Circle } from '@/types';
import { formatNumber } from '@/utils/format';

interface CircleCardProps {
  circle: Circle;
  compact?: boolean;
}

export function CircleCard({ circle, compact = false }: CircleCardProps) {
  if (compact) {
    return (
      <Link to={`/circle/${circle.gameId}`} className="glass-card-hover p-3 flex items-center gap-3 block">
        <img
          src={circle.cover}
          alt={circle.name}
          className="w-14 h-14 rounded-xl object-cover shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm text-white truncate">{circle.name}</h4>
          <div className="flex items-center gap-2 mt-1 text-xs text-white/50">
            <Users size={12} />
            <span>{formatNumber(circle.memberCount)} 成员</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/circle/${circle.gameId}`} className="glass-card-hover overflow-hidden group block">
      <div className="relative h-32 overflow-hidden">
        <img
          src={circle.cover}
          alt={circle.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="font-bold text-lg text-white">{circle.name}</h3>
        </div>
      </div>

      <div className="p-4">
        <p className="text-sm text-white/60 line-clamp-2 mb-4">{circle.description}</p>
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1 text-white/50">
            <Users size={14} className="text-neon-cyan" />
            {formatNumber(circle.memberCount)} 成员
          </span>
          <span className="flex items-center gap-1 text-white/50">
            <Flame size={14} className="text-neon-orange" />
            {circle.hotPosts} 热帖
          </span>
          <span className="flex items-center gap-1 text-white/50">
            <ShoppingBag size={14} className="text-neon-pink" />
            {circle.todayDeals} 今日成交
          </span>
        </div>
      </div>
    </Link>
  );
}
