import { useState } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  Shield,
  CreditCard,
  Package,
  Heart,
  AlertTriangle,
  Star,
  Clock,
  Settings,
  ChevronRight,
  Trophy,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { CreditBadge } from '@/components/user/CreditBadge';
import { ReviewCard } from '@/components/user/ReviewCard';
import { PostCard } from '@/components/trade/PostCard';
import { useAppStore } from '@/store';
import { creditLevelConfig, getCreditProgress, formatPrice, formatDate } from '@/utils/format';

export default function Profile() {
  const currentUser = useAppStore((s) => s.currentUser);
  const users = useAppStore((s) => s.users);
  const posts = useAppStore((s) => s.posts);
  const creditRecords = useAppStore((s) => s.creditRecords);
  const reviews = useAppStore((s) => s.getUserReviews(currentUser.id));
  const orders = useAppStore((s) => s.getUserOrders(currentUser.id));

  const [activeTab, setActiveTab] = useState<'published' | 'bought' | 'sold' | 'favorites' | 'reviews' | 'exposure'>('published');

  const userPosts = posts.filter((p) => p.userId === currentUser.id);
  const boughtOrders = orders.filter((o) => o.buyerId === currentUser.id);
  const soldOrders = orders.filter((o) => o.sellerId === currentUser.id);

  const creditProgress = getCreditProgress(currentUser.creditScore);
  const levelConfig = creditLevelConfig[currentUser.creditLevel];

  const orderStatusConfig = {
    pending: { label: '待付款', color: 'bg-neon-orange/20 text-neon-orange' },
    paid: { label: '待发货', color: 'bg-neon-cyan/20 text-neon-cyan' },
    delivering: { label: '交接中', color: 'bg-neon-purple/20 text-neon-purple' },
    completed: { label: '已完成', color: 'bg-green-500/20 text-green-400' },
    disputed: { label: '纠纷中', color: 'bg-red-500/20 text-red-400' },
    cancelled: { label: '已取消', color: 'bg-white/10 text-white/50' },
  };

  const tabs = [
    { key: 'published', label: '我发布的', icon: Package, count: userPosts.length },
    { key: 'bought', label: '我买到的', icon: CreditCard, count: boughtOrders.length },
    { key: 'sold', label: '我卖出的', icon: TrendingUp, count: soldOrders.length },
    { key: 'favorites', label: '收藏夹', icon: Heart, count: 3 },
    { key: 'reviews', label: '晒号反馈', icon: Star, count: reviews.length },
    { key: 'exposure', label: '违规曝光', icon: AlertTriangle, count: 0 },
  ];

  return (
    <Container>
      <div className="relative rounded-3xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/40 via-dark-900/60 to-neon-cyan/30" />
        <img
          src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=gaming%20setup%20purple%20neon%20lights%20rgb%20keyboard%20aesthetic%20background&image_size=landscape_16_9"
          alt="Profile Cover"
          className="w-full h-48 lg:h-64 object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark-900 to-transparent h-24" />
      </div>

      <div className="relative -mt-20 lg:-mt-24 mb-8">
        <div className="container">
          <div className="flex flex-col lg:flex-row lg:items-end gap-6">
            <div className="relative shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.nickname}
                className="w-32 h-32 lg:w-40 lg:h-40 rounded-3xl object-cover ring-4 ring-dark-900 shadow-neon"
              />
              <div className={`absolute -bottom-2 -right-2 px-3 py-1.5 rounded-xl ${levelConfig.bgColor} ${levelConfig.color} font-bold text-sm`}>
                {levelConfig.name}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl lg:text-3xl font-bold text-white">{currentUser.nickname}</h1>
                {currentUser.isVerified && (
                  <span className="tag-neon bg-neon-cyan/20 text-neon-cyan">
                    <CheckCircle2 size={12} className="mr-1" />
                    实名认证
                  </span>
                )}
                {currentUser.isStudentVerified && (
                  <span className="tag-neon bg-neon-purple/20 text-neon-purple">
                    <GraduationCap size={12} className="mr-1" />
                    学生认证
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-white/60 mb-4">
                <span className="flex items-center gap-1.5">
                  <GraduationCap size={16} className="text-neon-purple" />
                  {currentUser.school}
                </span>
                <span className="flex items-center gap-1.5">
                  <Shield size={16} className="text-neon-cyan" />
                  累计交易 {currentUser.tradeCount} 笔
                </span>
                <span className="flex items-center gap-1.5">
                  <Star size={16} className="text-yellow-400 fill-yellow-400" />
                  好评率 98%
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="btn-gradient">
                  编辑资料
                </button>
                <button className="btn-outline flex items-center gap-2">
                  <Settings size={18} />
                  设置
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Trophy size={20} className="text-neon-purple" />
                <h2 className="text-lg font-semibold text-white">信用等级成长</h2>
              </div>
              <CreditBadge level={currentUser.creditLevel} score={currentUser.creditScore} showScore />
            </div>

            <div className="flex items-center gap-6 mb-5">
              <div className="relative w-24 h-24 shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${creditProgress * 2.64} 264`}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-gradient">{currentUser.creditScore}</span>
                  <span className="text-[10px] text-white/50">信用分</span>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/60">{levelConfig.name} 进度</span>
                  <span className="text-sm text-white/80">
                    {currentUser.creditScore} / {levelConfig.max}
                  </span>
                </div>
                <div className="h-3 rounded-full bg-dark-700 overflow-hidden">
                  <div
                    className="h-full bg-gradient-neon rounded-full transition-all duration-500"
                    style={{ width: `${creditProgress}%` }}
                  />
                </div>
                <p className="text-xs text-white/50 mt-2">
                  再获得 <span className="text-neon-cyan">{levelConfig.max - currentUser.creditScore}</span> 分即可升级到下一等级
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-white/80 mb-3">最近信用变动</p>
              {creditRecords.slice(0, 5).map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${record.type === 'plus' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                      {record.type === 'plus' ? (
                        <TrendingUp size={14} className="text-green-400" />
                      ) : (
                        <AlertTriangle size={14} className="text-red-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-white/80">{record.description}</p>
                      <p className="text-xs text-white/40">{formatDate(record.createdAt)}</p>
                    </div>
                  </div>
                  <span className={`font-bold ${record.type === 'plus' ? 'text-green-400' : 'text-red-400'}`}>
                    {record.type === 'plus' ? '+' : ''}{record.change}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as typeof activeTab)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                      activeTab === tab.key
                        ? 'bg-gradient-neon text-white shadow-neon'
                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon size={16} />
                    {tab.label}
                    {tab.count > 0 && (
                      <span className={`tag-neon text-[10px] ${activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-white/10 text-white/60'}`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {activeTab === 'published' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {userPosts.length > 0 ? (
                  userPosts.map((post) => <PostCard key={post.id} post={post} />)
                ) : (
                  <div className="col-span-full glass-card p-10 text-center text-white/50">
                    <Package size={40} className="mx-auto mb-3 opacity-30" />
                    <p>还没发布过交易帖</p>
                  </div>
                )}
              </div>
            )}

            {(activeTab === 'bought' || activeTab === 'sold') && (
              <div className="space-y-3">
                {(activeTab === 'bought' ? boughtOrders : soldOrders).length > 0 ? (
                  (activeTab === 'bought' ? boughtOrders : soldOrders).map((order) => (
                    <div key={order.id} className="glass-card p-4 flex items-center gap-4">
                      <img
                        src={order.postCover}
                        alt=""
                        className="w-20 h-20 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">{order.postTitle}</p>
                        <p className="text-sm text-white/50 mt-1 flex items-center gap-2">
                          <Clock size={12} />
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-lg font-bold text-gradient">{formatPrice(order.amount)}</p>
                        <span className={`tag-neon ${orderStatusConfig[order.status].color} text-xs mt-1`}>
                          {orderStatusConfig[order.status].label}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="glass-card p-10 text-center text-white/50">
                    <CreditCard size={40} className="mx-auto mb-3 opacity-30" />
                    <p>暂无{activeTab === 'bought' ? '购买' : '出售'}记录</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {posts.slice(0, 3).map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((review) => <ReviewCard key={review.id} review={review} />)
                ) : (
                  <div className="glass-card p-10 text-center text-white/50">
                    <Star size={40} className="mx-auto mb-3 opacity-30" />
                    <p>还没有晒号反馈</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'exposure' && (
              <div className="glass-card p-10 text-center text-white/50">
                <Shield size={40} className="mx-auto mb-3 opacity-30" />
                <p className="mb-2">暂无违规记录</p>
                <p className="text-xs">保持良好信誉，交易更放心</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 bg-gradient-to-br from-neon-purple/10 to-neon-cyan/10">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={20} className="text-neon-cyan" />
              <h3 className="font-semibold text-white">信用成长任务</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: '完善个人资料', reward: 10, done: true },
                { label: '绑定手机号', reward: 20, done: true },
                { label: '完成学生认证', reward: 50, done: currentUser.isStudentVerified },
                { label: '完成首次担保交易', reward: 30, done: currentUser.tradeCount > 0 },
                { label: '获得5条好评', reward: 50, done: false },
              ].map((task, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${task.done ? 'bg-green-500' : 'bg-white/10'}`}>
                      {task.done && <CheckCircle2 size={14} className="text-white" />}
                    </div>
                    <span className={`text-sm ${task.done ? 'text-white/60 line-through' : 'text-white/80'}`}>
                      {task.label}
                    </span>
                  </div>
                  <span className={`text-xs font-semibold ${task.done ? 'text-green-400' : 'text-neon-purple'}`}>
                    +{task.reward}分
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-semibold text-white mb-4">信用等级说明</h3>
            <div className="space-y-3">
              {Object.entries(creditLevelConfig).map(([key, config]) => (
                <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${config.bgColor} flex items-center justify-center`}>
                      <Trophy size={14} className={config.color} />
                    </div>
                    <div>
                      <span className={`font-medium ${config.color}`}>{config.name}</span>
                      <p className="text-xs text-white/40">{config.min} - {config.max} 分</p>
                    </div>
                  </div>
                  {currentUser.creditLevel === key && (
                    <span className="tag-neon bg-neon-purple/20 text-neon-purple text-[10px]">当前</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">功能快捷入口</h3>
            </div>
            <div className="space-y-2">
              {[
                { label: '担保交易记录', icon: Shield },
                { label: '收货地址管理', icon: CreditCard },
                { label: '意见反馈', icon: Star },
                { label: '帮助中心', icon: Zap },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <span className="flex items-center gap-3 text-white/80">
                      <Icon size={16} className="text-neon-purple" />
                      {item.label}
                    </span>
                    <ChevronRight size={16} className="text-white/30" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-semibold text-white mb-4">通讯录好友</h3>
            <div className="flex flex-wrap gap-3">
              {users.slice(1, 7).map((user) => (
                <div key={user.id} className="group relative">
                  <img
                    src={user.avatar}
                    alt={user.nickname}
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-white/10 group-hover:ring-neon-purple/50 transition-all cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
