import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import {
  ChevronLeft,
  Shield,
  MapPin,
  Eye,
  Clock,
  Star,
  MessageCircle,
  CheckCircle2,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight,
  Heart,
  Share2,
  AlertTriangle,
  Info,
  GraduationCap,
  Zap,
} from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { UserAvatar } from '@/components/user/UserAvatar';
import { CreditBadge } from '@/components/user/CreditBadge';
import { MediatorCard } from '@/components/trade/MediatorCard';
import { PriceRange } from '@/components/trade/PriceRange';
import { QASection } from '@/components/trade/QASection';
import { ReviewCard } from '@/components/user/ReviewCard';
import { PostCard } from '@/components/trade/PostCard';
import { useAppStore } from '@/store';
import { formatPrice, formatDate, formatNumber, truncateText } from '@/utils/format';

export default function Trade() {
  const { postId = 'p1' } = useParams();
  const posts = useAppStore((s) => s.posts);
  const mediators = useAppStore((s) => s.mediators);
  const priceRefs = useAppStore((s) => s.priceReferences);
  const reviews = useAppStore((s) => s.reviews);

  const post = posts.find((p) => p.id === postId) || posts[0];
  const gamePriceRefs = priceRefs.filter((r) => r.gameId === post?.gameId);
  const onlineMediators = mediators.filter((m) => m.isOnline);
  const offlineMediators = mediators.filter((m) => !m.isOnline);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedMediator, setSelectedMediator] = useState<string | null>(mediators[0]?.id || null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);

  if (!post) return null;

  const similarPosts = posts.filter((p) => p.gameId === post.gameId && p.id !== post.id).slice(0, 3);

  return (
    <Container>
      <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-5 transition-colors">
        <ChevronLeft size={18} />
        返回发现
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card overflow-hidden">
            <div className="relative">
              <div className="aspect-video bg-dark-800">
                <img
                  src={post.screenshots[activeImageIndex]}
                  alt={post.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <button
                onClick={() => setActiveImageIndex((prev) => (prev - 1 + post.screenshots.length) % post.screenshots.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-dark-900/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-dark-900 transition-colors"
              >
                <ChevronLeftIcon size={20} />
              </button>
              <button
                onClick={() => setActiveImageIndex((prev) => (prev + 1) % post.screenshots.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-dark-900/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-dark-900 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
              <div className="absolute top-4 left-4 flex gap-2">
                {post.useGuarantee && (
                  <span className="tag-neon bg-neon-cyan/90 text-white backdrop-blur-sm">
                    <Shield size={12} className="mr-1" />
                    担保交易
                  </span>
                )}
                <span className="tag-neon bg-dark-900/80 text-white backdrop-blur-sm">
                  {post.game.name}
                </span>
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => setIsFavorited(!isFavorited)}
                  className={`w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center transition-all ${
                    isFavorited ? 'bg-neon-pink/90 text-white' : 'bg-dark-900/80 text-white hover:bg-dark-900'
                  }`}
                >
                  <Heart size={18} className={isFavorited ? 'fill-white' : ''} />
                </button>
                <button className="w-10 h-10 rounded-full bg-dark-900/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-dark-900 transition-colors">
                  <Share2 size={18} />
                </button>
              </div>
            </div>
            <div className="p-4 flex gap-2 overflow-x-auto">
              {post.screenshots.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all ${
                    idx === activeImageIndex
                      ? 'ring-2 ring-neon-purple'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="tag-neon bg-neon-purple/20 text-neon-purple font-semibold">
                    {post.rank}
                  </span>
                  {post.tags.map((tag, idx) => (
                    <span key={idx} className="tag-neon bg-white/5 text-white/70">
                      {tag}
                    </span>
                  ))}
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">{post.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-white/50">
                  <span className="flex items-center gap-1">
                    <Eye size={14} />
                    {formatNumber(post.viewCount)} 浏览
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {formatDate(post.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {post.server}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-3xl font-bold text-gradient">{formatPrice(post.price)}</div>
                {gamePriceRefs[0] && (
                  <p className="text-xs text-white/50 mt-1">
                    参考价 {formatPrice(gamePriceRefs[0].minPrice)} - {formatPrice(gamePriceRefs[0].maxPrice)}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-white mb-3">账号描述</h3>
              <p className="text-white/70 leading-relaxed">{post.description}</p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-3">核心资产</h3>
              <div className="flex flex-wrap gap-2">
                {post.assets.map((asset, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-neon-purple/10 to-neon-cyan/10 border border-neon-purple/20 text-sm text-white/80"
                  >
                    {asset}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <QASection postId={post.id} />

          <div>
            <div className="flex items-center gap-2 mb-5">
              <Star size={20} className="text-yellow-400" />
              <h2 className="text-lg font-bold text-white">卖家评价晒单</h2>
            </div>
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">卖家信息</h3>
              {post.user.isStudentVerified && (
                <span className="tag-neon bg-neon-cyan/20 text-neon-cyan text-xs">
                  <GraduationCap size={12} className="mr-1" />
                  学生认证
                </span>
              )}
            </div>
            <UserAvatar user={post.user} size="lg" showInfo showBadges />

            <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-white/5">
              <div className="text-center">
                <div className="text-xl font-bold text-white">{post.user.tradeCount}</div>
                <div className="text-xs text-white/50">交易数</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gradient">{post.user.creditScore}</div>
                <div className="text-xs text-white/50">信用分</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-400">98%</div>
                <div className="text-xs text-white/50">好评率</div>
              </div>
            </div>

            {post.user.school && (
              <div className="mt-4 p-3 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-neon-cyan" />
                  <span className="text-sm text-white/80">
                    同校认证：<span className="text-neon-cyan font-medium">{post.user.school}</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-neon-cyan" />
                <h3 className="font-semibold text-white">价格参考</h3>
              </div>
              <Info size={16} className="text-white/40" />
            </div>
            <PriceRange references={gamePriceRefs.slice(0, 2)} currentPrice={post.price} />

            {post.price < (gamePriceRefs[0]?.avgPrice || 0) && (
              <div className="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                <div className="flex items-start gap-2">
                  <Zap size={16} className="text-green-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-green-400">
                    价格低于市场价约 {Math.round(((gamePriceRefs[0].avgPrice - post.price) / gamePriceRefs[0].avgPrice) * 100)}%，性价比不错！
                  </p>
                </div>
              </div>
            )}
            {post.price > (gamePriceRefs[0]?.avgPrice || 0) && (
              <div className="mt-4 p-3 rounded-xl bg-neon-orange/10 border border-neon-orange/20">
                <div className="flex items-start gap-2">
                  <AlertTriangle size={16} className="text-neon-orange shrink-0 mt-0.5" />
                  <p className="text-sm text-neon-orange">
                    价格略高于市场价，建议和卖家议价或咨询中介评估。
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-neon-purple" />
                <h3 className="font-semibold text-white">选择担保中介</h3>
              </div>
              <span className="text-xs text-white/40">在线 {onlineMediators.length} 人</span>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {onlineMediators.map((mediator) => (
                <MediatorCard
                  key={mediator.id}
                  mediator={mediator}
                  selected={selectedMediator === mediator.id}
                  onClick={() => setSelectedMediator(mediator.id)}
                />
              ))}
              {offlineMediators.map((mediator) => (
                <MediatorCard
                  key={mediator.id}
                  mediator={mediator}
                  selected={selectedMediator === mediator.id}
                  onClick={() => setSelectedMediator(mediator.id)}
                />
              ))}
            </div>
          </div>

          <div className="glass-card p-6 sticky top-24">
            <div className="flex items-end justify-between mb-5">
              <div>
                <p className="text-sm text-white/50 mb-1">交易总价</p>
                <div className="text-3xl font-bold text-gradient">{formatPrice(post.price)}</div>
              </div>
              {selectedMediator && (
                <div className="text-right text-xs text-white/50">
                  中介费：{formatPrice(Math.round(post.price * 0.03))}
                  <br />
                  <span className="text-white/30">（约3%）</span>
                </div>
              )}
            </div>

            <div className="space-y-2 mb-5 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-green-400" />
                <span>资金由平台托管，确认收货后放款</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-green-400" />
                <span>中介协助验证账号信息</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-green-400" />
                <span>交易纠纷全程介入处理</span>
              </div>
            </div>

            <button
              onClick={() => setShowOrderModal(true)}
              disabled={!selectedMediator}
              className="btn-gradient w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Shield size={18} />
              发起担保交易
            </button>
            <button className="btn-outline w-full mt-3 flex items-center justify-center gap-2">
              <MessageCircle size={18} />
              联系卖家
            </button>
          </div>
        </div>
      </div>

      {similarPosts.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center gap-2 mb-5">
            <Eye size={20} className="text-neon-pink" />
            <h2 className="text-lg font-bold text-white">猜你喜欢</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {similarPosts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </div>
      )}

      {showOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/80 backdrop-blur-sm">
          <div className="glass-card p-8 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-2">确认担保交易</h3>
            <p className="text-sm text-white/60 mb-6">请仔细核对以下信息</p>

            <div className="space-y-4 mb-6">
              <div className="flex gap-3 p-4 rounded-xl bg-white/5">
                <img src={post.screenshots[0]} alt="" className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{truncateText(post.title, 30)}</p>
                  <p className="text-sm text-white/50 mt-1">{post.rank} · {post.server}</p>
                </div>
                <div className="text-lg font-bold text-gradient self-center">{formatPrice(post.price)}</div>
              </div>

              <div className="p-4 rounded-xl bg-white/5">
                <p className="text-xs text-white/50 mb-2">担保中介</p>
                <p className="text-white font-medium">
                  {mediators.find((m) => m.id === selectedMediator)?.nickname}
                </p>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <span className="text-white/60">应付金额</span>
                <span className="text-2xl font-bold text-gradient">
                  {formatPrice(post.price + Math.round(post.price * 0.03))}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowOrderModal(false)}
                className="btn-outline flex-1"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setShowOrderModal(false);
                  alert('下单成功！请等待中介联系您进行账号交接。');
                }}
                className="btn-gradient flex-1"
              >
                确认支付
              </button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}
