import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { Users, Flame, TrendingUp, MessageCircle, ShieldCheck, Crown, ChevronLeft, Gamepad2 } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { PostCard } from '@/components/trade/PostCard';
import { CreditRank } from '@/components/circle/CreditRank';
import { UserAvatar } from '@/components/user/UserAvatar';
import { useAppStore } from '@/store';
import { formatNumber, formatDate } from '@/utils/format';

export default function Circle() {
  const { gameId = 'g1' } = useParams();
  const games = useAppStore((s) => s.games);
  const circles = useAppStore((s) => s.circles);
  const users = useAppStore((s) => s.users);
  const allPosts = useAppStore((s) => s.posts);

  const [activeTab, setActiveTab] = useState<'deals' | 'members' | 'ranking'>('deals');

  const currentGame = games.find((g) => g.id === gameId) || games[0];
  const currentCircle = circles.find((c) => c.gameId === gameId) || circles[0];
  const circlePosts = allPosts.filter((p) => p.gameId === gameId);
  const circleMembers = users.slice(0, 12);

  return (
    <Container>
      <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-5 transition-colors">
        <ChevronLeft size={18} />
        返回发现
      </Link>

      <div className="relative rounded-3xl overflow-hidden mb-8">
        <img
          src={currentCircle?.cover || currentGame?.cover}
          alt={currentCircle?.name}
          className="w-full h-56 lg:h-72 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/60 to-dark-900/20" />
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div className="flex items-end gap-5">
              <div className="relative">
                <img
                  src={currentGame?.cover}
                  alt={currentGame?.name}
                  className="w-24 h-24 lg:w-28 lg:h-28 rounded-2xl object-cover ring-4 ring-dark-900 shadow-neon"
                />
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-neon flex items-center justify-center">
                  <Gamepad2 size={16} className="text-white" />
                </div>
              </div>
              <div>
                <h1 className="font-display text-3xl lg:text-4xl font-bold text-white mb-2">
                  {currentCircle?.name || `${currentGame?.name}圈子`}
                </h1>
                <p className="text-white/70 max-w-xl mb-3">{currentCircle?.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
                  <span className="flex items-center gap-1.5">
                    <Users size={16} className="text-neon-cyan" />
                    {formatNumber(currentCircle?.memberCount || 0)} 成员
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Flame size={16} className="text-neon-orange" />
                    {currentCircle?.hotPosts || 0} 热帖
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck size={16} className="text-green-400" />
                    已认证圈子
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="btn-outline">
                已加入
              </button>
              <button className="btn-gradient">
                发帖交易
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { key: 'deals', label: '圈内交易', icon: TrendingUp, count: circlePosts.length },
          { key: 'members', label: '圈成员', icon: Users, count: currentCircle?.memberCount },
          { key: 'ranking', label: '信用排行', icon: Crown },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? 'bg-gradient-neon text-white shadow-neon'
                  : 'glass-card text-white/60 hover:text-white'
              }`}
            >
              <Icon size={18} />
              {tab.label}
              {tab.count !== undefined && (
                <span className={`tag-neon text-[10px] ${activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-white/10 text-white/60'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {activeTab === 'deals' && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <TrendingUp size={20} className="text-neon-purple" />
                  <h2 className="text-lg font-bold text-white">圈内最新交易</h2>
                </div>
                <span className="text-sm text-white/40">共 {circlePosts.length} 条</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {circlePosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
              {circlePosts.length === 0 && (
                <div className="glass-card p-10 text-center text-white/50">
                  该圈子暂无交易帖
                </div>
              )}
            </div>
          )}

          {activeTab === 'members' && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Users size={20} className="text-neon-cyan" />
                  <h2 className="text-lg font-bold text-white">活跃成员</h2>
                </div>
                <div className="flex gap-2">
                  <button className="tag-neon bg-neon-purple/20 text-neon-purple text-xs px-3 py-1.5">
                    同校优先
                  </button>
                  <button className="tag-neon bg-white/5 text-white/60 text-xs px-3 py-1.5">
                    全部
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {circleMembers.map((member) => (
                  <div key={member.id} className="glass-card-hover p-4 flex items-center gap-4">
                    <UserAvatar user={member} size="lg" showInfo showBadges />
                    <div className="flex-1" />
                    <button className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-white/60 hover:bg-neon-purple/20 hover:text-neon-purple transition-all">
                      关注
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ranking' && <CreditRank users={users} />}
        </div>

        <div className="space-y-6">
          <CreditRank users={users} />

          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle size={18} className="text-neon-pink" />
              <h3 className="font-semibold text-white">圈内公告</h3>
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-neon-purple/10 border border-neon-purple/20">
                <p className="text-xs text-neon-purple font-medium mb-1">置顶公告</p>
                <p className="text-sm text-white/80">
                  本圈只允许担保交易，禁止私下交易，违者永久封禁！
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white/5">
                <p className="text-xs text-white/50 mb-1">{formatDate(new Date().toISOString())}</p>
                <p className="text-sm text-white/70">本周担保交易成功率 98.7%，大家继续保持！</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-5">
            <h3 className="font-semibold text-white mb-4">同校成员</h3>
            <div className="flex flex-wrap gap-3">
              {users.slice(0, 6).map((user) => (
                <div key={user.id} className="group relative">
                  <img
                    src={user.avatar}
                    alt={user.nickname}
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-neon-purple/30 group-hover:ring-neon-purple transition-all"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-lg bg-green-500 border-2 border-dark-900" />
                </div>
              ))}
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/40 text-sm">
                +{currentCircle?.memberCount ? currentCircle.memberCount - 6 : 0}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
