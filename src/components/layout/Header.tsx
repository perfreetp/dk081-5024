import { Link, useLocation } from 'react-router-dom';
import { Search, Compass, Users, Plus, User, Bell } from 'lucide-react';
import { useAppStore } from '@/store';

export function Header() {
  const location = useLocation();
  const currentUser = useAppStore((s) => s.currentUser);

  const navItems = [
    { path: '/', label: '发现', icon: Compass },
    { path: '/circle/g1', label: '圈子', icon: Users },
    { path: '/post', label: '发帖', icon: Plus },
    { path: '/profile', label: '我的', icon: User },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-dark-900/70 border-b border-white/5">
      <div className="container py-4">
        <div className="flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-neon flex items-center justify-center shadow-neon">
              <span className="font-display font-bold text-lg text-white">号</span>
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-gradient">号友圈</h1>
              <p className="text-[10px] text-white/50 -mt-0.5">同校可信交易</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path.split('/').slice(0, 2).join('/')));
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-neon text-white shadow-neon'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4 flex-1 lg:flex-none justify-end">
            <div className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-dark-800/60 border border-white/10 w-full max-w-xs">
              <Search size={18} className="text-white/40" />
              <input
                type="text"
                placeholder="搜索游戏、账号、圈子..."
                className="bg-transparent outline-none text-sm text-white placeholder-white/40 w-full"
              />
            </div>

            <button className="relative p-2.5 rounded-xl bg-dark-800/60 border border-white/10 hover:border-neon-purple/30 transition-colors">
              <Bell size={20} className="text-white/70" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-neon-pink animate-pulse" />
            </button>

            <Link to="/profile" className="flex items-center gap-3 shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.nickname}
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-neon-purple/50"
              />
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-white">{currentUser.nickname}</p>
                <p className="text-xs text-neon-cyan">{currentUser.school}</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
