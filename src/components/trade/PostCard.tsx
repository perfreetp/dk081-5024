import { Link } from 'react-router-dom';
import { Eye, Shield, MapPin, Clock } from 'lucide-react';
import type { Post } from '@/types';
import { UserAvatar } from '@/components/user/UserAvatar';
import { CreditBadge } from '@/components/user/CreditBadge';
import { formatPrice, formatDate, formatNumber, truncateText } from '@/utils/format';

interface PostCardProps {
  post: Post;
  variant?: 'default' | 'compact';
}

export function PostCard({ post, variant = 'default' }: PostCardProps) {
  if (variant === 'compact') {
    return (
      <Link to={`/trade/${post.id}`} className="glass-card-hover p-3 flex gap-3 block">
        <img
          src={post.screenshots[0]}
          alt={post.title}
          className="w-20 h-20 rounded-xl object-cover shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm text-white line-clamp-1">{post.title}</h3>
          <p className="text-xs text-white/50 mt-1">{post.rank} · {post.server}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-neon-purple font-bold text-lg">¥{post.price}</span>
            <CreditBadge level={post.user.creditLevel} size="sm" />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/trade/${post.id}`} className="glass-card-hover overflow-hidden group block">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={post.screenshots[0]}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent" />
        
        <div className="absolute top-3 left-3 flex gap-2">
          {post.useGuarantee && (
            <span className="tag-neon bg-neon-cyan/20 text-neon-cyan backdrop-blur-sm">
              <Shield size={12} className="mr-1" />
              担保
            </span>
          )}
          <span className="tag-neon bg-dark-800/80 text-white/80 backdrop-blur-sm">
            {post.game.name}
          </span>
        </div>

        <div className="absolute top-3 right-3 tag-neon bg-dark-800/80 text-white/80 backdrop-blur-sm">
          <Eye size={12} className="mr-1" />
          {formatNumber(post.viewCount)}
        </div>

        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-end justify-between">
            <span className="tag-neon bg-neon-purple/80 text-white backdrop-blur-sm font-bold">
              {post.rank}
            </span>
            <span className="text-2xl font-bold text-white drop-shadow-lg">
              <span className="text-neon-cyan text-lg">¥</span>
              {formatPrice(post.price).slice(1)}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-white line-clamp-1 group-hover:text-neon-purple transition-colors">
          {post.title}
        </h3>
        <p className="text-sm text-white/50 mt-1.5 line-clamp-2">
          {truncateText(post.description, 60)}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {post.assets.slice(0, 3).map((asset, idx) => (
            <span key={idx} className="tag-neon bg-white/5 text-white/60 text-[10px]">
              {asset}
            </span>
          ))}
          {post.assets.length > 3 && (
            <span className="tag-neon bg-white/5 text-white/40 text-[10px]">
              +{post.assets.length - 3}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
          <UserAvatar user={post.user} size="sm" showInfo />
          <div className="flex items-center gap-3 text-xs text-white/40">
            <span className="flex items-center gap-1">
              <MapPin size={12} />
              {post.user.city}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {formatDate(post.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
