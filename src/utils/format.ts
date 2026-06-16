import type { CreditLevel } from '@/types';

export const creditLevelConfig: Record<CreditLevel, { min: number; max: number; name: string; color: string; bgColor: string }> = {
  bronze: { min: 0, max: 599, name: '青铜', color: 'text-amber-600', bgColor: 'bg-amber-500/20' },
  silver: { min: 600, max: 719, name: '白银', color: 'text-gray-300', bgColor: 'bg-gray-400/20' },
  gold: { min: 720, max: 839, name: '黄金', color: 'text-yellow-400', bgColor: 'bg-yellow-400/20' },
  platinum: { min: 840, max: 919, name: '铂金', color: 'text-cyan-400', bgColor: 'bg-cyan-400/20' },
  diamond: { min: 920, max: 999, name: '钻石', color: 'text-purple-400', bgColor: 'bg-purple-400/20' },
};

export function getCreditLevel(score: number): CreditLevel {
  if (score >= 920) return 'diamond';
  if (score >= 840) return 'platinum';
  if (score >= 720) return 'gold';
  if (score >= 600) return 'silver';
  return 'bronze';
}

export function getCreditProgress(score: number): number {
  const level = getCreditLevel(score);
  const config = creditLevelConfig[level];
  const range = config.max - config.min;
  const progress = score - config.min;
  return Math.min(100, Math.max(0, (progress / range) * 100));
}

export function formatPrice(price: number): string {
  return `¥${price.toLocaleString()}`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins}分钟前`;
  if (diffHours < 24) return `${diffHours}小时前`;
  if (diffDays < 7) return `${diffDays}天前`;
  return date.toLocaleDateString('zh-CN');
}

export function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
}

export function formatNumber(num: number): string {
  if (num >= 10000) return `${(num / 10000).toFixed(1)}w`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
}

export function truncateText(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen) + '...';
}
