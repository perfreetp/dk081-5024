import { GraduationCap, MapPin, CheckCircle2 } from 'lucide-react';
import { CreditBadge } from './CreditBadge';
import type { User } from '@/types';

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadges?: boolean;
  showInfo?: boolean;
}

export function UserAvatar({ user, size = 'md', showBadges = false, showInfo = false }: UserAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const ringSize = {
    sm: 'ring-1',
    md: 'ring-2',
    lg: 'ring-2',
    xl: 'ring-4',
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative shrink-0">
        <img
          src={user.avatar}
          alt={user.nickname}
          className={`${sizeClasses[size]} ${ringSize[size]} rounded-xl object-cover ring-neon-purple/40`}
        />
        {user.isStudentVerified && size !== 'sm' && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-lg bg-neon-cyan flex items-center justify-center">
            <GraduationCap size={12} className="text-white" />
          </div>
        )}
      </div>
      {showInfo && (
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-white truncate">{user.nickname}</span>
            {user.isVerified && <CheckCircle2 size={14} className="text-neon-cyan shrink-0" />}
          </div>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-white/50">
            {showBadges && <CreditBadge level={user.creditLevel} size="sm" />}
            <span className="flex items-center gap-1">
              <MapPin size={10} />
              {user.school || user.city}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
