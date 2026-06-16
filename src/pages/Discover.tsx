import { useState } from 'react';
import { Flame, AlertTriangle, TrendingUp, Users, Filter, ChevronRight, Sparkles, Gamepad2 } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { PostCard } from '@/components/trade/PostCard';
import { CircleCard } from '@/components/circle/CircleCard';
import { PriceRange } from '@/components/trade/PriceRange';
import { UserAvatar } from '@/components/user/UserAvatar';
import { useAppStore } from '@/store';
import { formatNumber, formatDate } from '@/utils/format';
import { Link } from 'react-router-dom';

export default function Discover() {
  const posts = useAppStore((s) => s.posts);
  const circles = useAppStore((s) => s.circles);
  const pitfalls = useAppStore((s) => s.pitfalls);
  const priceRefs = useAppStore((s) => s.priceReferences);
  const games = useAppStore((s) => s.games);
  const currentUser = useAppStore((s) => s.currentUser);

  const [activeGame, setActiveGame] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'hot' | 'new' | 'sameSchool'>('hot');

  const filteredPosts = posts.filter((p) => {
    if (activeGame !== 'all' && p.gameId !== activeGame) return false;
    if (activeTab === 'sameSchool' && p.user.school !== currentUser.school) return false;
    return true;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (activeTab === 'new') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return b.viewCount - a.viewCount;
  });

  const sameSchoolPosts = posts.filter((p) => p.user.school === currentUser.school);
  const exposurePitfalls = pitfalls.filter((p) => p.type === 'exposure');
  const guidePitfalls = pitfalls.filter((p) => p.type === 'guide' || p.type === 'experience');

  const pitfallTypeColor = {
    exposure: 'bg-red-500/20 text-red-400 border-red-500/30',
    experience: 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30',
    guide: 'bg-neon-purple/20 text-neon-purple border-neon-purple/30',
  };

  const pitfallTypeLabel = {
    exposure: '曝光',
    experience: '经验',
    guide: '指南',
  };

  return (
    <Container>
      <div className="relative rounded-3xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/30 via-dark-900/50 to-neon-cyan/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent" />
        <img
          src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=gaming%20esports%20arena%20neon%20lights%20purple%20cyan%20futuristic%20atmosphere&image_size=landscape_16_9"
          alt="Banner"
          className="w-full h-64 lg:h-80 object-cover"
        />
        <div className="absolute inset-0 flex items-center">
          <div className="container">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4">
                <Sparkles size={14} className="text-neon-cyan" />
                <span className="text-sm text-white/80">同校同学都在玩的交易社区</span>
              </div>
              <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
                放心买号，
                <span className="text-gradient">找同校更靠谱</span>
              </h1>
              <p className="text-white/70 text-base lg:text-lg mb-6">
                担保交易 · 同校认证 · 圈内口碑 · 避坑指南
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/post" className="btn-gradient">
                  我要卖号
                </Link>
                <Link to={`/circle/${circles[0]?.gameId || 'g1'}`} className="btn-outline">
                  进入圈子
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Gamepad2 size={20} className="text-neon-purple" />
              <h2 className="text-xl font-bold text-white">热门游戏</h2>
            </div>
            <div className="flex flex-wrap gap-2 mb-5">
              <button
                onClick={() => setActiveGame('all')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeGame === 'all'
                    ? 'bg-gradient-neon text-white shadow-neon'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                全部
              </button>
              {games.map((game) => (
                <button
                  key={game.id}
                  onClick={() => setActiveGame(game.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeGame === game.id
                      ? 'bg-gradient-neon text-white shadow-neon'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {game.name}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between mb-5">
              <div className="flex gap-2">
                {[
                  { key: 'hot', label: '最热', icon: Flame },
                  { key: 'new', label: '最新', icon: Sparkles },
                  { key: 'sameSchool', label: '同校', icon: Users },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as typeof activeTab)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        activeTab === tab.key
                          ? 'bg-white/10 text-white'
                          : 'text-white/50 hover:text-white/80'
                      }`}
                    >
                      <Icon size={14} />
                      {tab.label}
                      {tab.key === 'sameSchool' && sameSchoolPosts.length > 0 && (
                        <span className="tag-neon bg-neon-cyan/20 text-neon-cyan text-[10px] ml-1">
                          {sameSchoolPosts.length}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-white/60 hover:bg-white/5 hover:text-white transition-all">
                <Filter size={14} />
                筛选
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {sortedPosts.slice(0, 6).map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {sortedPosts.length === 0 && (
              <div className="glass-card p-10 text-center text-white/50">
                暂无符合条件的交易帖
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <AlertTriangle size={20} className="text-neon-orange" />
                <h2 className="text-xl font-bold text-white">避坑案例广场</h2>
                <span className="tag-neon bg-red-500/20 text-red-400 text-xs">
                  {exposurePitfalls.length} 条曝光
                </span>
              </div>
              <button className="flex items-center gap-1 text-sm text-white/50 hover:text-white transition-colors">
                查看更多 <ChevronRight size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pitfalls.slice(0, 4).map((pitfall) => (
                <div
                  key={pitfall.id}
                  className={`glass-card p-5 cursor-pointer transition-all hover:-translate-y-1 hover:border-white/20 border ${
                    pitfall.type === 'exposure' ? 'border-red-500/20 hover:border-red-500/40' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {pitfall.images[0] && (
                      <img
                        src={pitfall.images[0]}
                        alt=""
                        className="w-20 h-20 rounded-xl object-cover shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`tag-neon border ${pitfallTypeColor[pitfall.type]}`}
                        >
                          {pitfallTypeLabel[pitfall.type]}
                        </span>
                        <span className="text-xs text-white/40">{formatDate(pitfall.createdAt)}</span>
                      </div>
                      <h3 className="font-semibold text-white line-clamp-2 mb-2 hover:text-neon-purple transition-colors">
                        {pitfall.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <UserAvatar user={pitfall.user} size="sm" showInfo />
                        <div className="flex items-center gap-3 text-xs text-white/40">
                          <span>👍 {pitfall.likes}</span>
                          <span>💬 {pitfall.comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {guidePitfalls.length > 0 && (
              <div className="mt-5 glass-card p-5 bg-gradient-to-r from-neon-purple/5 to-neon-cyan/5">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={16} className="text-neon-cyan" />
                  <span className="text-sm font-semibold text-white">新手必看防骗指南</span>
                </div>
                <div className="space-y-2">
                  {guidePitfalls.slice(0, 2).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <span className="w-6 h-6 rounded-lg bg-neon-purple/20 flex items-center justify-center text-xs font-bold text-neon-purple">
                        {pitfalls.indexOf(item) + 1}
                      </span>
                      <span className="text-sm text-white/80 flex-1 truncate">{item.title}</span>
                      <ChevronRight size={14} className="text-white/40" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <TrendingUp size={20} className="text-neon-cyan" />
                <h2 className="text-lg font-bold text-white">行情参考</h2>
              </div>
              <span className="text-xs text-white/40">近7日均价</span>
            </div>
            <PriceRange references={priceRefs.slice(0, 4)} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Users size={20} className="text-neon-pink" />
                <h2 className="text-lg font-bold text-white">同校热门圈子</h2>
              </div>
              <Link to={`/circle/${circles[0]?.gameId || 'g1'}`} className="text-xs text-neon-purple hover:underline">
                查看全部
              </Link>
            </div>
            <div className="space-y-3">
              {circles.slice(0, 3).map((circle) => (
                <CircleCard key={circle.id} circle={circle} compact />
              ))}
            </div>
          </div>

          <div className="glass-card p-5 bg-gradient-to-br from-neon-purple/10 to-neon-cyan/10">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={18} className="text-neon-cyan" />
              <span className="font-semibold text-white">提升信用等级</span>
            </div>
            <p className="text-sm text-white/60 mb-4">
              完成学生认证和实名认证，获得更高信用等级，交易更放心！
            </p>
            <div className="flex flex-wrap gap-2">
              <button className="tag-neon bg-neon-cyan/20 text-neon-cyan text-xs px-3 py-1.5">
                🎓 学生认证 +50分
              </button>
              <button className="tag-neon bg-neon-purple/20 text-neon-purple text-xs px-3 py-1.5">
                ✅ 实名认证 +30分
              </button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
