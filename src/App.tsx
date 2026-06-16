import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import Discover from '@/pages/Discover';
import Circle from '@/pages/Circle';
import Trade from '@/pages/Trade';
import PostCreate from '@/pages/PostCreate';
import Profile from '@/pages/Profile';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pb-24 lg:pb-8">
          <Routes>
            <Route path="/" element={<Discover />} />
            <Route path="/circle/:gameId" element={<Circle />} />
            <Route path="/trade/:postId" element={<Trade />} />
            <Route path="/post" element={<PostCreate />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}
