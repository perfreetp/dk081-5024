import { Link, useLocation } from 'react-router-dom';
import { Compass, Users, Plus, User } from 'lucide-react';

export function BottomNav() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '发现', icon: Compass },
    { path: '/circle/g1', label: '圈子', icon: Users },
    { path: '/post', label: '发帖', icon: Plus, highlight: true },
    { path: '/profile', label: '我的', icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-dark-900/90 border-t border-white/5 pb-safe">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path.split('/').slice(0, 2).join('/')));
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 ${
                item.highlight
                  ? ''
                  : isActive
                  ? 'text-neon-purple'
                  : 'text-white/50'
              }`}
            >
              {item.highlight ? (
                <div className="w-14 h-14 -mt-6 rounded-full bg-gradient-neon flex items-center justify-center shadow-neon">
                  <Icon size={24} className="text-white" />
                </div>
              ) : (
                <Icon size={22} />
              )}
              {!item.highlight && <span className="text-xs">{item.label}</span>}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
