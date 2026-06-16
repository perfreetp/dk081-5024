import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { PriceReference } from '@/types';
import { formatPrice } from '@/utils/format';

interface PriceRangeProps {
  references: PriceReference[];
  currentPrice?: number;
}

export function PriceRange({ references, currentPrice }: PriceRangeProps) {
  const trendIcon = {
    up: <TrendingUp size={14} className="text-green-400" />,
    down: <TrendingDown size={14} className="text-red-400" />,
    stable: <Minus size={14} className="text-white/50" />,
  };

  return (
    <div className="space-y-3">
      {references.map((ref, idx) => {
        const range = ref.maxPrice - ref.minPrice;
        const avgPercent = ((ref.avgPrice - ref.minPrice) / range) * 100;
        const currentPercent = currentPrice ? ((currentPrice - ref.minPrice) / range) * 100 : null;

        return (
          <div key={idx} className="glass-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-sm font-medium text-white">{ref.gameName}</span>
                <span className="text-xs text-white/50 ml-2">{ref.rank}</span>
              </div>
              <span className="flex items-center gap-1 text-xs text-white/60">
                {trendIcon[ref.trend]}
                <span>
                  {ref.trend === 'up' ? '上涨' : ref.trend === 'down' ? '下跌' : '平稳'}
                </span>
              </span>
            </div>

            <div className="relative">
              <div className="h-2 rounded-full bg-dark-700 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink rounded-full"
                  style={{ width: '100%', opacity: 0.3 }}
                />
                <div
                  className="absolute top-0 h-full bg-gradient-neon rounded-full"
                  style={{ left: 0, width: `${avgPercent}%` }}
                />
              </div>

              <div
                className="absolute -top-1 w-4 h-4 rounded-full bg-neon-cyan border-2 border-dark-900 shadow-neon-cyan transform -translate-x-1/2"
                style={{ left: `${avgPercent}%` }}
                title={`平均价 ${formatPrice(ref.avgPrice)}`}
              />

              {currentPercent !== null && currentPercent >= 0 && currentPercent <= 100 && (
                <div
                  className="absolute -top-2 w-6 h-6 rounded-full bg-neon-pink border-2 border-dark-900 shadow-neon-pink transform -translate-x-1/2 animate-pulse"
                  style={{ left: `${currentPercent}%` }}
                  title={`当前价 ${formatPrice(currentPrice)}`}
                />
              )}
            </div>

            <div className="flex justify-between mt-2 text-xs">
              <span className="text-white/50">最低 {formatPrice(ref.minPrice)}</span>
              <span className="text-neon-cyan font-semibold">均价 {formatPrice(ref.avgPrice)}</span>
              <span className="text-white/50">最高 {formatPrice(ref.maxPrice)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
