import { useParams, Link, useNavigate, useEffect } from 'react-router-dom';
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
  User,
  Package,
  Tag,
  Settings,
  XCircle,
  ArrowRight,
  Send,
  TrendingUp,
  TrendingDown,
  Inbox,
} from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { UserAvatar } from '@/components/user/UserAvatar';
import { CreditBadge } from '@/components/user/CreditBadge';
import { MediatorCard } from '@/components/trade/MediatorCard';
import { MediatorRecordsModal } from '@/components/trade/MediatorRecordsModal';
import { PriceRange } from '@/components/trade/PriceRange';
import { QASection } from '@/components/trade/QASection';
import { ReviewCard } from '@/components/user/ReviewCard';
import { PostCard } from '@/components/trade/PostCard';
import { useAppStore } from '@/store';
import { formatPrice, formatDate, formatNumber, truncateText } from '@/utils/format';
import type { Mediator } from '@/types';

export default function Trade() {
  const navigate = useNavigate();
  const { postId = 'p1' } = useParams();
  const posts = useAppStore((s) => s.posts);
  const mediators = useAppStore((s) => s.mediators);
  const priceRefs = useAppStore((s) => s.priceReferences);
  const reviews = useAppStore((s) => s.reviews);
  const currentUser = useAppStore((s) => s.currentUser);
  const createTradeOrder = useAppStore((s) => s.createTradeOrder);
  const createTradeOrderFromOffer = useAppStore((s) => s.createTradeOrderFromOffer);
  const getMediatorRecords = useAppStore((s) => s.getMediatorRecords);
  const getPriceReference = useAppStore((s) => s.getPriceReference);
  const createOffer = useAppStore((s) => s.createOffer);
  const getPostOffers = useAppStore((s) => s.getPostOffers);
  const getPostUserOffer = useAppStore((s) => s.getPostUserOffer);
  const closePost = useAppStore((s) => s.closePost);

  const post = posts.find((p) => p.id === postId) || posts[0];
  const gamePriceRefs = priceRefs.filter((r) => r.gameId === post?.gameId);
  const onlineMediators = mediators.filter((m) => m.isOnline);
  const offlineMediators = mediators.filter((m) => !m.isOnline);
  const isSeller = post?.userId === currentUser.id;
  const postOffers = getPostOffers(post?.id || '');
  const pendingOffers = postOffers.filter((o) => o.status === 'pending');
  const myOffer = !isSeller ? getPostUserOffer(post?.id || '', currentUser.id) : undefined;
  const acceptedOffer = myOffer?.status === 'accepted' ? myOffer : undefined;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedMediator, setSelectedMediator] = useState<string | null>(mediators[0]?.id || null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showMediatorRecords, setShowMediatorRecords] = useState<Mediator | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<{ orderId: string } | null>(null);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerPrice, setOfferPrice] = useState('');
  const [offerMessage, setOfferMessage] = useState('');
  const [useOfferPrice, setUseOfferPrice] = useState(!!acceptedOffer);

  if (!post) return null;

  const similarPosts = posts.filter((p) => p.gameId === post.gameId && p.id !== post.id).slice(0, 3);
  const selectedMediatorData = mediators.find((m) => m.id === selectedMediator);
  const priceRef = getPriceReference(post.gameId, post.rank);

  useEffect(() => {
    if (acceptedOffer) {
      setUseOfferPrice(true);
    }
  }, [acceptedOffer]);

  const handleConfirmPay = () => {
    if (!selectedMediator || !post) return;

    if (useOfferPrice && acceptedOffer) {
      const order = createTradeOrderFromOffer(acceptedOffer.id, selectedMediator);
      setShowOrderModal(false);
      setOrderSuccess({ orderId: order.id });
    } else {
      const order = createTradeOrder({
        postId: post.id,
        buyerId: currentUser.id,
        sellerId: post.user.id,
        mediatorId: selectedMediator,
        amount: post.price,
        postTitle: post.title,
        postCover: post.screenshots[0],
      });
      setShowOrderModal(false);
      setOrderSuccess({ orderId: order.id });
    }
  };

  const handleSubmitOffer = () => {
    if (!post || !offerPrice || Number(offerPrice) <= 0) return;

    createOffer({
      postId: post.id,
      buyerId: currentUser.id,
      sellerId: post.user.id,
      price: Number(offerPrice),
      message: offerMessage || '',
    });

    setShowOfferModal(false);
    setOfferPrice('');
    setOfferMessage('');
    alert('报价已发送，请等待卖家回复！');
  };

  const handleClosePost = () => {
    if (confirm('确定要下架这个帖子吗？下架后将不再展示。')) {
      closePost(post.id);
      alert('帖子已下架');
      navigate('/');
    }
  };

  const handleViewMediatorRecords = (mediator: Mediator) => {
    setShowMediatorRecords(mediator);
  };

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
              <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                {post.useGuarantee && (
                  <span className="tag-neon bg-neon-cyan/90 text-white backdrop-blur-sm">
                    <Shield size={12} className="mr-1" />
                    担保交易
                  </span>
                )}
                <span className="tag-neon bg-dark-900/80 text-white backdrop-blur-sm">
                  {post.game.name}
                </span>
                {post.status === 'trading' && (
                  <span className="tag-neon bg-neon-orange/90 text-white backdrop-blur-sm">
                    交易中
                  </span>
                )}
                {post.status === 'sold' && (
                  <span className="tag-neon bg-gray-500/90 text-white backdrop-blur-sm">
                    已售出
                  </span>
                )}
                {post.status === 'closed' && (
                  <span className="tag-neon bg-gray-500/90 text-white backdrop-blur-sm">
                    已下架
                  </span>
                )}
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
                {priceRef && (
                  <p className="text-xs text-white/50 mt-1">
                    参考价 {formatPrice(priceRef.minPrice)} - {formatPrice(priceRef.maxPrice)}
                  </p>
                )}
                {!priceRef && (
                  <p className="text-xs text-white/30 mt-1">暂无市场参考数据</p>
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
              <h3 className="font-semibold text-white">{isSeller ? '您是卖家' : '卖家信息'}</h3>
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
            {gamePriceRefs.length > 0 ? (
              <>
                <PriceRange references={gamePriceRefs.slice(0, 2)} currentPrice={post.price} />
                {priceRef && (
                  <div className="mt-2 text-xs text-white/40">
                    数据来源：近期 {priceRef.sampleCount} 笔成交记录
                  </div>
                )}
              </>
            ) : (
              <div className="py-6 text-center text-white/40">
                <TrendingUp size={28} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">暂无该游戏的价格参考数据</p>
                <p className="text-xs mt-1">建议多参考同类型账号谨慎定价</p>
              </div>
            )}

            {priceRef && post.price < priceRef.avgPrice && (
              <div className="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                <div className="flex items-start gap-2">
                  <Zap size={16} className="text-green-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-green-400">
                    价格低于市场价约 {Math.round(((priceRef.avgPrice - post.price) / priceRef.avgPrice) * 100)}%，性价比不错！
                  </p>
                </div>
              </div>
            )}
            {priceRef && post.price > priceRef.avgPrice && (
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

          {!isSeller && (
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
                    onViewRecords={() => handleViewMediatorRecords(mediator)}
                  />
                ))}
                {offlineMediators.map((mediator) => (
                  <MediatorCard
                    key={mediator.id}
                    mediator={mediator}
                    selected={selectedMediator === mediator.id}
                    onClick={() => setSelectedMediator(mediator.id)}
                    onViewRecords={() => handleViewMediatorRecords(mediator)}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="glass-card p-6 sticky top-24">
            {isSeller ? (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <Settings size={18} className="text-neon-purple" />
                  <h3 className="font-semibold text-white">卖家管理</h3>
                </div>

                <div className="space-y-3 mb-5">
                  <button
                    onClick={() => navigate('/profile')}
                    className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-between text-white transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Inbox size={18} className="text-neon-cyan" />
                      <span className="text-sm">查看报价</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {pendingOffers.length > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-neon-pink/20 text-neon-pink text-xs">
                          {pendingOffers.length} 条新
                        </span>
                      )}
                      <ArrowRight size={14} className="text-white/40" />
                    </div>
                  </button>

                  <button
                    onClick={handleClosePost}
                    disabled={post.status === 'closed' || post.status === 'trading' || post.status === 'sold'}
                    className="w-full p-3 rounded-xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <XCircle size={18} />
                    <span className="text-sm">
                      {post.status === 'closed'
                        ? '已下架'
                        : post.status === 'trading'
                        ? '交易中，无法下架'
                        : post.status === 'sold'
                        ? '已售出'
                        : '下架帖子'}
                    </span>
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-neon-purple/10 border border-neon-purple/20">
                  <p className="text-xs text-white/70">
                    💡 提示：有 {pendingOffers.length} 条待处理报价，合理议价可以加快成交哦
                  </p>
                </div>
              </>
            ) : (
              <>
                {acceptedOffer ? (
                  <div className="mb-4 p-4 rounded-xl bg-neon-orange/10 border border-neon-orange/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag size={16} className="text-neon-orange" />
                      <span className="text-sm font-medium text-neon-orange">卖家已同意您的报价</span>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xs text-white/50 line-through">原价 {formatPrice(post.price)}</p>
                        <p className="text-xl font-bold text-neon-orange">
                          议价 {formatPrice(acceptedOffer.price)}
                          <span className="text-xs text-white/50 ml-2">
                            省 {formatPrice(post.price - acceptedOffer.price)}
                          </span>
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setUseOfferPrice(!useOfferPrice)}
                      className={`mt-3 w-full p-2 rounded-lg text-xs font-medium transition-colors ${
                        useOfferPrice
                          ? 'bg-neon-orange/20 text-neon-orange border border-neon-orange/40'
                          : 'bg-white/5 text-white/60 border border-white/10'
                      }`}
                    >
                      {useOfferPrice ? '✓ 使用议价下单' : '点击切换为议价下单'}
                    </button>
                  </div>
                ) : myOffer ? (
                  <div className="mb-4 p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2">
                      <Tag size={16} className="text-white/50" />
                      <span className="text-sm text-white/70">
                        {myOffer.status === 'pending' && '您的报价等待卖家回复中...'}
                        {myOffer.status === 'rejected' && '卖家已拒绝您的报价'}
                        {myOffer.status === 'cancelled' && '您已取消报价'}
                      </span>
                    </div>
                    {myOffer.status === 'rejected' && (
                      <p className="text-xs text-white/40 mt-1">可以重新议价或按原价购买</p>
                    )}
                  </div>
                ) : null}

                <div className="flex items-end justify-between mb-5">
                  <div>
                    <p className="text-sm text-white/50 mb-1">
                      {useOfferPrice && acceptedOffer ? '议价成交价' : '交易总价'}
                    </p>
                    <div className="text-3xl font-bold text-gradient">
                      {formatPrice(useOfferPrice && acceptedOffer ? acceptedOffer.price : post.price)}
                    </div>
                  </div>
                  {selectedMediator && (
                    <div className="text-right text-xs text-white/50">
                      中介费：{formatPrice(Math.round((useOfferPrice && acceptedOffer ? acceptedOffer.price : post.price) * 0.03))}
                      <br />
                      <span className="text-white/30">（约3%）</span>
                    </div>
                  )}
                </div>

                {selectedMediatorData && (
                  <div className="mb-4 p-3 rounded-xl bg-neon-purple/10 border border-neon-purple/20">
                    <p className="text-xs text-white/50 mb-1">已选中中介</p>
                    <div className="flex items-center gap-2">
                      <img
                        src={selectedMediatorData.avatar}
                        alt=""
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{selectedMediatorData.nickname}</p>
                        <p className="text-xs text-white/50">
                          {selectedMediatorData.responseTime}响应 · 调解率 {selectedMediatorData.disputeResolutionRate}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}

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

                {acceptedOffer && !useOfferPrice ? (
                  <button
                    onClick={() => setUseOfferPrice(true)}
                    className="btn-gradient w-full flex items-center justify-center gap-2"
                  >
                    <Tag size={16} />
                    按议价 {formatPrice(acceptedOffer.price)} 下单
                  </button>
                ) : (
                  <button
                    onClick={() => setShowOrderModal(true)}
                    disabled={!selectedMediator || post.status === 'trading' || post.status === 'sold' || post.status === 'closed'}
                    className="btn-gradient w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Shield size={18} />
                    {post.status === 'trading'
                      ? '交易进行中'
                      : post.status === 'sold'
                      ? '已售出'
                      : post.status === 'closed'
                      ? '已下架'
                      : acceptedOffer
                      ? `按议价 ${formatPrice(acceptedOffer.price)} 下单`
                      : '发起担保交易'}
                  </button>
                )}

                {acceptedOffer && useOfferPrice && (
                  <button
                    onClick={() => setUseOfferPrice(false)}
                    className="btn-outline w-full mt-2 flex items-center justify-center gap-2 text-white/60 text-sm"
                  >
                    <span className="line-through">原价 {formatPrice(post.price)}</span>
                    切换为原价购买
                  </button>
                )}

                {acceptedOffer && !useOfferPrice && (
                  <button
                    onClick={() => setShowOrderModal(true)}
                    disabled={!selectedMediator || post.status === 'trading' || post.status === 'sold' || post.status === 'closed'}
                    className="btn-outline w-full mt-2 flex items-center justify-center gap-2 text-white/60 text-sm disabled:opacity-50"
                  >
                    <span className="line-through">原价 {formatPrice(post.price)}</span>
                    继续原价购买
                  </button>
                )}

                {!acceptedOffer && post.acceptOffer && !myOffer?.status?.includes('pending') && (
                  <button
                    onClick={() => setShowOfferModal(true)}
                    disabled={post.status !== 'active'}
                    className="btn-outline w-full mt-3 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Tag size={16} />
                    {myOffer ? '重新议价' : '我要议价'}
                  </button>
                )}

                <button className="btn-outline w-full mt-3 flex items-center justify-center gap-2">
                  <MessageCircle size={18} />
                  联系卖家
                </button>
              </>
            )}
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
            <p className="text-sm text-white/60 mb-6">
              {useOfferPrice && acceptedOffer ? '您正在按议价金额下单' : '请仔细核对以下信息'}
            </p>

            <div className="space-y-4 mb-6">
              <div className="flex gap-3 p-4 rounded-xl bg-white/5">
                <img src={post.screenshots[0]} alt="" className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{truncateText(post.title, 30)}</p>
                  <p className="text-sm text-white/50 mt-1">{post.rank} · {post.server}</p>
                </div>
                <div className="text-lg font-bold text-gradient self-center">
                  {formatPrice(useOfferPrice && acceptedOffer ? acceptedOffer.price : post.price)}
                  {useOfferPrice && acceptedOffer && (
                    <p className="text-xs text-neon-orange text-right">议价成交</p>
                  )}
                </div>
              </div>

              {useOfferPrice && acceptedOffer && (
                <div className="p-3 rounded-xl bg-neon-orange/10 border border-neon-orange/20">
                  <div className="flex items-center gap-2">
                    <Tag size={14} className="text-neon-orange" />
                    <p className="text-xs text-white/70">
                      卖家原价 <span className="line-through">{formatPrice(post.price)}</span>，
                      为您节省 <span className="text-neon-orange font-medium">{formatPrice(post.price - acceptedOffer.price)}</span>
                    </p>
                  </div>
                </div>
              )}

              <div className="p-4 rounded-xl bg-white/5">
                <p className="text-xs text-white/50 mb-2">担保中介</p>
                <div className="flex items-center gap-3">
                  <img
                    src={selectedMediatorData?.avatar}
                    alt=""
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div>
                    <p className="text-white font-medium">{selectedMediatorData?.nickname}</p>
                    <p className="text-xs text-white/50">
                      近7日 {selectedMediatorData?.completedOrders7Days} 单 · 调解率 {selectedMediatorData?.disputeResolutionRate}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white/5">
                  <p className="text-xs text-white/50 mb-1 flex items-center gap-1">
                    <User size={12} /> 买家
                  </p>
                  <p className="text-sm text-white truncate">{currentUser.nickname}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5">
                  <p className="text-xs text-white/50 mb-1 flex items-center gap-1">
                    <Package size={12} /> 卖家
                  </p>
                  <p className="text-sm text-white truncate">{post.user.nickname}</p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <span className="text-white/60">应付金额（含中介费）</span>
                <span className="text-2xl font-bold text-gradient">
                  {formatPrice((useOfferPrice && acceptedOffer ? acceptedOffer.price : post.price) + Math.round((useOfferPrice && acceptedOffer ? acceptedOffer.price : post.price) * 0.03))}
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
                onClick={handleConfirmPay}
                className="btn-gradient flex-1"
              >
                确认支付
              </button>
            </div>
          </div>
        </div>
      )}

      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/80 backdrop-blur-sm">
          <div className="glass-card p-8 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-2">发起议价</h3>
            <p className="text-sm text-white/60 mb-6">
              报价后卖家可选择同意或拒绝，同意后可直接按议价下单
            </p>

            <div className="space-y-4 mb-6">
              <div className="flex gap-3 p-4 rounded-xl bg-white/5">
                <img src={post.screenshots[0]} alt="" className="w-14 h-14 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm truncate">{truncateText(post.title, 30)}</p>
                  <p className="text-xs text-white/50 mt-1">
                    卖家报价：<span className="text-neon-purple font-medium">{formatPrice(post.price)}</span>
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-2">我的出价</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neon-purple font-bold">¥</span>
                  <input
                    type="number"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    placeholder="请输入您的出价"
                    className="input-field pl-9 text-lg"
                  />
                </div>
                {priceRef && (
                  <p className="text-xs text-white/40 mt-2">
                    市场参考价 {formatPrice(priceRef.minPrice)} - {formatPrice(priceRef.maxPrice)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-2">留言（可选）</label>
                <textarea
                  value={offerMessage}
                  onChange={(e) => setOfferMessage(e.target.value)}
                  placeholder="想说的话，比如：真心想要，同校可面交..."
                  rows={3}
                  maxLength={100}
                  className="input-field resize-none"
                />
                <p className="text-xs text-white/40 mt-1 text-right">{offerMessage.length}/100</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowOfferModal(false);
                  setOfferPrice('');
                  setOfferMessage('');
                }}
                className="btn-outline flex-1"
              >
                取消
              </button>
              <button
                onClick={handleSubmitOffer}
                disabled={!offerPrice || Number(offerPrice) <= 0}
                className="btn-gradient flex-1 disabled:opacity-50"
              >
                <Send size={16} className="mr-1" />
                发送报价
              </button>
            </div>
          </div>
        </div>
      )}

      {orderSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/80 backdrop-blur-sm">
          <div className="glass-card p-8 w-full max-w-md text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 size={48} className="text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">下单成功！</h3>
            <p className="text-sm text-white/60 mb-6">
              订单号：{orderSuccess.orderId}
              <br />
              中介将在几分钟内联系您进行账号交接，请保持消息畅通。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setOrderSuccess(null);
                  navigate('/profile');
                }}
                className="btn-outline flex-1"
              >
                查看订单
              </button>
              <button
                onClick={() => {
                  setOrderSuccess(null);
                  navigate('/');
                }}
                className="btn-gradient flex-1"
              >
                返回首页
              </button>
            </div>
          </div>
        </div>
      )}

      {showMediatorRecords && (
        <MediatorRecordsModal
          mediator={showMediatorRecords}
          records={getMediatorRecords(showMediatorRecords.id)}
          onClose={() => setShowMediatorRecords(null)}
        />
      )}
    </Container>
  );
}
