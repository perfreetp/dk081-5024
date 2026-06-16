import type { CreditLevel } from '@/types';
import { creditLevelConfig } from '@/utils/format';

interface CreditBadgeProps {
  level: CreditLevel;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
  showScore?: boolean;
}

export function CreditBadge({ level, score, size = 'md', showScore = false }: CreditBadgeProps) {
  const config = creditLevelConfig[level];
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span className={`tag-neon ${config.bgColor} ${config.color} ${sizeClasses[size]} font-semibold`}>
      {config.name}
      {showScore && score !== undefined && <span className="ml-1 opacity-80">{score}</span>}
    </span>
  );
}
