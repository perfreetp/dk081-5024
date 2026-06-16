import { Star } from 'lucide-react';
import type { Review } from '@/types';
import { UserAvatar } from '@/components/user/UserAvatar';
import { formatDate } from '@/utils/format';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-start justify-between mb-3">
        <UserAvatar user={review.user} size="sm" showInfo />
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}
            />
          ))}
        </div>
      </div>

      <div className="tag-neon bg-neon-purple/10 text-neon-purple text-xs mb-3 w-fit">
        交易：{review.postTitle}
      </div>

      <p className="text-sm text-white/80 leading-relaxed">{review.content}</p>

      {review.images.length > 0 && (
        <div className="flex gap-2 mt-4">
          {review.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`晒单图片${idx + 1}`}
              className="w-20 h-20 rounded-lg object-cover cursor-pointer hover:ring-2 hover:ring-neon-purple/50 transition-all"
            />
          ))}
        </div>
      )}

      <div className="text-xs text-white/40 mt-3">{formatDate(review.createdAt)}</div>
    </div>
  );
}
