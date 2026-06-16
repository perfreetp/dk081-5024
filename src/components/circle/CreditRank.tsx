import { Trophy, Medal } from 'lucide-react';
import type { User } from '@/types';
import { CreditBadge } from '@/components/user/CreditBadge';
import { formatNumber } from '@/utils/format';

interface CreditRankProps {
  users: User[];
}

export function CreditRank({ users }: CreditRankProps) {
  const sortedUsers = [...users].sort((a, b) => b.creditScore - a.creditScore).slice(0, 5);

  const rankColors = [
    'from-yellow-400 to-yellow-600',
    'from-gray-300 to-gray-500',
    'from-amber-600 to-amber-800',
  ];

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-5">
        <Trophy size={20} className="text-yellow-400" />
        <h3 className="text-lg font-semibold text-white">圈内信用排行</h3>
      </div>

      <div className="space-y-3">
        {sortedUsers.map((user, idx) => (
          <div
            key={user.id}
            className={`flex items-center gap-4 p-3 rounded-xl transition-all hover:bg-white/5 ${
              idx < 3 ? 'bg-gradient-to-r from-white/5 to-transparent' : ''
            }`}
          >
            <div className="w-8 h-8 flex items-center justify-center shrink-0">
              {idx < 3 ? (
                <div
                  className={`w-8 h-8 rounded-lg bg-gradient-to-br ${rankColors[idx]} flex items-center justify-center shadow-lg`}
                >
                  <Medal size={16} className="text-white" />
                </div>
              ) : (
                <span className="text-lg font-bold text-white/30">#{idx + 1}</span>
              )}
            </div>

            <img
              src={user.avatar}
              alt={user.nickname}
              className={`w-10 h-10 rounded-xl object-cover ${
                idx < 3 ? 'ring-2 ring-yellow-400/50' : ''
              }`}
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-white truncate">{user.nickname}</span>
                {user.isStudentVerified && (
                  <span className="text-[10px] tag-neon bg-neon-cyan/20 text-neon-cyan">
                    学生认证
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <CreditBadge level={user.creditLevel} size="sm" />
                <span className="text-xs text-white/40">{user.school}</span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-lg font-bold text-gradient">{user.creditScore}</div>
              <div className="text-[10px] text-white/40">{formatNumber(user.tradeCount)} 笔交易</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
