import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Upload,
  X,
  Shield,
  GraduationCap,
  MapPin,
  ImagePlus,
  CheckCircle2,
  Info,
  Plus,
} from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { useAppStore } from '@/store';

export default function PostCreate() {
  const navigate = useNavigate();
  const games = useAppStore((s) => s.games);
  const circles = useAppStore((s) => s.circles);
  const createPost = useAppStore((s) => s.createPost);
  const currentUser = useAppStore((s) => s.currentUser);

  const [formData, setFormData] = useState({
    gameId: games[0]?.id || '',
    title: '',
    description: '',
    price: '',
    rank: '',
    server: '',
    level: 0,
    assets: [] as string[],
    screenshots: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=game%20account%20profile%20showcase%20neon%20purple%20cyan&image_size=landscape_16_9',
    ] as string[],
    useGuarantee: true,
    tags: [] as string[],
    showSchool: true,
    showCity: true,
    newAsset: '',
    newTag: '',
    acceptOffer: true,
  });

  const updateField = <K extends keyof typeof formData>(key: K, value: typeof formData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const addAsset = () => {
    if (formData.newAsset.trim()) {
      updateField('assets', [...formData.assets, formData.newAsset.trim()]);
      updateField('newAsset', '');
    }
  };

  const removeAsset = (idx: number) => {
    updateField(
      'assets',
      formData.assets.filter((_, i) => i !== idx)
    );
  };

  const addTag = () => {
    if (formData.newTag.trim() && formData.tags.length < 5) {
      updateField('tags', [...formData.tags, formData.newTag.trim()]);
      updateField('newTag', '');
    }
  };

  const removeTag = (idx: number) => {
    updateField(
      'tags',
      formData.tags.filter((_, i) => i !== idx)
    );
  };

  const removeScreenshot = (idx: number) => {
    if (formData.screenshots.length > 1) {
      updateField(
        'screenshots',
        formData.screenshots.filter((_, i) => i !== idx)
      );
    }
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.price || !formData.rank) {
      alert('请填写完整信息：标题、价格、段位');
      return;
    }

    const circle = circles.find((c) => c.gameId === formData.gameId);

    createPost({
      userId: currentUser.id,
      gameId: formData.gameId,
      circleId: circle?.id || circles[0]?.id || '',
      title: formData.title,
      description: formData.description || '卖家暂未填写描述',
      price: Number(formData.price),
      rank: formData.rank,
      server: formData.server || '未指定',
      level: Number(formData.level) || 0,
      assets: formData.assets,
      screenshots: formData.screenshots,
      useGuarantee: formData.useGuarantee,
      tags: formData.tags,
    });

    navigate('/');
  };

  const selectedGame = games.find((g) => g.id === formData.gameId);

  return (
    <Container>
      <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-5 transition-colors">
        <ChevronLeft size={18} />
        返回发现
      </Link>

      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-white mb-2">发布交易帖</h1>
          <p className="text-white/60">完善账号信息，让买家更放心，提高交易成功率</p>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">选择游戏与圈子</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {games.map((game) => (
                <button
                  key={game.id}
                  onClick={() => updateField('gameId', game.id)}
                  className={`relative p-3 rounded-xl overflow-hidden transition-all ${
                    formData.gameId === game.id
                      ? 'ring-2 ring-neon-purple shadow-neon'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <img
                    src={game.cover}
                    alt={game.name}
                    className="w-full aspect-video rounded-lg object-cover mb-2"
                  />
                  <p className="text-sm font-medium text-white truncate">{game.name}</p>
                  <p className="text-xs text-white/40">{game.category}</p>
                  {formData.gameId === game.id && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-neon-purple flex items-center justify-center">
                      <CheckCircle2 size={14} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">战绩截图</h2>
            <p className="text-sm text-white/50 mb-4">请上传清晰的账号截图，至少1张，最多9张</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
              {formData.screenshots.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  {formData.screenshots.length > 1 && (
                    <button
                      onClick={() => removeScreenshot(idx)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} className="text-white" />
                    </button>
                  )}
                </div>
              ))}
              {formData.screenshots.length < 9 && (
                <button className="aspect-square rounded-xl border-2 border-dashed border-white/20 hover:border-neon-purple/50 hover:bg-neon-purple/5 flex flex-col items-center justify-center text-white/40 hover:text-neon-purple transition-all">
                  <ImagePlus size={28} />
                  <span className="text-xs mt-1">添加截图</span>
                </button>
              )}
            </div>
            <div className="mt-4 p-4 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20">
              <div className="flex items-start gap-2">
                <Upload size={16} className="text-neon-cyan shrink-0 mt-0.5" />
                <p className="text-sm text-white/70">
                  建议上传：<span className="text-neon-cyan">段位截图、资产截图、背包截图、商城截图</span>，截图越完整交易成功率越高！
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">账号基本信息</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/70 mb-2">帖子标题 *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="如：王者荣耀 V10 全英雄账号 多荣耀典藏"
                  maxLength={50}
                  className="input-field"
                />
                <p className="text-xs text-white/40 mt-1 text-right">{formData.title.length}/50</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/70 mb-2">游戏段位/等级 *</label>
                  <input
                    type="text"
                    value={formData.rank}
                    onChange={(e) => updateField('rank', e.target.value)}
                    placeholder={`如：最强王者 50星`}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-2">游戏大区/服务器</label>
                  <input
                    type="text"
                    value={formData.server}
                    onChange={(e) => updateField('server', e.target.value)}
                    placeholder="如：QQ区-ios手Q1区"
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/70 mb-2">
                    出售价格 <span className="text-neon-pink">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neon-purple font-bold">¥</span>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => updateField('price', e.target.value)}
                      placeholder="填写心理价位"
                      className="input-field pl-9"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-2">账号等级</label>
                  <input
                    type="number"
                    value={formData.level}
                    onChange={(e) => updateField('level', Number(e.target.value))}
                    placeholder="如：30、60"
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-2">账号描述</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="详细描述账号情况，如英雄数量、皮肤数量、稀有道具、实名状态等..."
                  rows={5}
                  maxLength={500}
                  className="input-field resize-none"
                />
                <p className="text-xs text-white/40 mt-1 text-right">{formData.description.length}/500</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-2">核心资产亮点</h2>
            <p className="text-sm text-white/50 mb-4">列出账号最有价值的资产，最多10个</p>

            <div className="flex flex-wrap gap-2 mb-3">
              {formData.assets.map((asset, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 border border-neon-purple/30 text-sm text-white"
                >
                  {asset}
                  <button
                    onClick={() => removeAsset(idx)}
                    className="hover:text-neon-pink transition-colors"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={formData.newAsset}
                onChange={(e) => updateField('newAsset', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addAsset()}
                placeholder="如：全英雄、武则天、满命胡桃..."
                className="input-field flex-1"
              />
              <button
                onClick={addAsset}
                disabled={!formData.newAsset.trim() || formData.assets.length >= 10}
                className="px-4 py-2 rounded-xl bg-gradient-neon text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-neon transition-all"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">交易设置</h2>
            <div className="space-y-4">
              <div
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  formData.useGuarantee
                    ? 'bg-neon-cyan/10 border-neon-cyan/30'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
                onClick={() => updateField('useGuarantee', true)}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                      formData.useGuarantee ? 'border-neon-cyan bg-neon-cyan' : 'border-white/30'
                    }`}
                  >
                    {formData.useGuarantee && <CheckCircle2 size={14} className="text-dark-900" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Shield size={16} className="text-neon-cyan" />
                      <span className="font-medium text-white">启用担保交易（推荐）</span>
                      <span className="tag-neon bg-green-500/20 text-green-400 text-[10px]">推荐</span>
                    </div>
                    <p className="text-sm text-white/60">
                      资金由平台托管，买家确认收货后放款，交易更安全。需支付约3%中介费。
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  !formData.useGuarantee
                    ? 'bg-neon-orange/10 border-neon-orange/30'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
                onClick={() => updateField('useGuarantee', false)}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                      !formData.useGuarantee ? 'border-neon-orange bg-neon-orange' : 'border-white/30'
                    }`}
                  >
                    {!formData.useGuarantee && <CheckCircle2 size={14} className="text-dark-900" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-white">私下交易</span>
                      <span className="tag-neon bg-red-500/20 text-red-400 text-[10px]">风险高</span>
                    </div>
                    <p className="text-sm text-white/60">
                      买卖双方直接交易，平台不提供担保。请谨慎选择，谨防被骗！
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                <div>
                  <span className="text-white font-medium">接受议价</span>
                  <p className="text-xs text-white/50 mt-0.5">允许买家在问答区议价</p>
                </div>
                <button
                  onClick={() => updateField('acceptOffer', !formData.acceptOffer)}
                  className={`w-12 h-7 rounded-full transition-all ${
                    formData.acceptOffer ? 'bg-neon-purple' : 'bg-white/20'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      formData.acceptOffer ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-2">身份标识</h2>
            <p className="text-sm text-white/50 mb-4">展示认证标识可以提升买家信任度</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-neon-cyan/20 flex items-center justify-center">
                    <GraduationCap size={20} className="text-neon-cyan" />
                  </div>
                  <div>
                    <span className="text-white font-medium">显示同校身份</span>
                    <p className="text-xs text-white/50 mt-0.5">认证学校：{currentUser.school}</p>
                  </div>
                </div>
                <button
                  onClick={() => updateField('showSchool', !formData.showSchool)}
                  className={`w-12 h-7 rounded-full transition-all ${
                    formData.showSchool ? 'bg-neon-cyan' : 'bg-white/20'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      formData.showSchool ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-neon-purple/20 flex items-center justify-center">
                    <MapPin size={20} className="text-neon-purple" />
                  </div>
                  <div>
                    <span className="text-white font-medium">显示同城定位</span>
                    <p className="text-xs text-white/50 mt-0.5">所在城市：{currentUser.city}</p>
                  </div>
                </div>
                <button
                  onClick={() => updateField('showCity', !formData.showCity)}
                  className={`w-12 h-7 rounded-full transition-all ${
                    formData.showCity ? 'bg-neon-purple' : 'bg-white/20'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      formData.showCity ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-neon-purple/10 border border-neon-purple/20">
              <div className="flex items-start gap-2">
                <Info size={16} className="text-neon-purple shrink-0 mt-0.5" />
                <p className="text-sm text-white/70">
                  {selectedGame?.name} 圈子发布后，帖子将展示在发现页和
                  <span className="text-neon-purple font-medium"> {selectedGame?.name}圈子</span>
                  ，获得更多曝光！
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">快捷标签</h2>
            <p className="text-sm text-white/50 mb-4">添加标签让帖子更容易被搜索（最多5个）</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neon-orange/20 text-neon-orange text-sm"
                >
                  #{tag}
                  <button onClick={() => removeTag(idx)} className="hover:text-white transition-colors">
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.newTag}
                onChange={(e) => updateField('newTag', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTag()}
                placeholder="如：急出、退游、可小刀..."
                className="input-field flex-1"
              />
              <button
                onClick={addTag}
                disabled={!formData.newTag.trim() || formData.tags.length >= 5}
                className="px-4 py-2 rounded-xl bg-gradient-neon text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-neon transition-all"
              >
                添加
              </button>
            </div>
          </div>

          <div className="flex gap-4 pb-24 lg:pb-0">
            <Link to="/" className="btn-outline flex-1 text-center">
              取消
            </Link>
            <button onClick={handleSubmit} className="btn-gradient flex-1">
              发布交易帖
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
}
