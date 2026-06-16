export type CreditLevel = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export interface User {
  id: string;
  nickname: string;
  avatar: string;
  school: string;
  city: string;
  creditScore: number;
  creditLevel: CreditLevel;
  isVerified: boolean;
  isStudentVerified: boolean;
  tradeCount: number;
}

export interface Game {
  id: string;
  name: string;
  cover: string;
  category: string;
  playerCount: number;
}

export interface Circle {
  id: string;
  gameId: string;
  name: string;
  cover: string;
  memberCount: number;
  description: string;
  hotPosts: number;
  todayDeals: number;
}

export type PostStatus = 'active' | 'trading' | 'sold' | 'closed';

export interface Post {
  id: string;
  userId: string;
  gameId: string;
  circleId: string;
  title: string;
  description: string;
  price: number;
  rank: string;
  server: string;
  level: number;
  assets: string[];
  screenshots: string[];
  useGuarantee: boolean;
  acceptOffer: boolean;
  tags: string[];
  status: PostStatus;
  viewCount: number;
  createdAt: string;
  user: User;
  game: Game;
}

export interface Mediator {
  id: string;
  userId: string;
  nickname: string;
  avatar: string;
  rating: number;
  totalOrders: number;
  todayOrders: number;
  isOnline: boolean;
  responseTime: string;
  introduction: string;
  avgResponseMinutes: number;
  disputeResolutionRate: number;
  completedOrders7Days: number;
}

export interface MediatorOrderRecord {
  id: string;
  mediatorId: string;
  postTitle: string;
  amount: number;
  status: 'completed' | 'disputed' | 'processing';
  result?: 'buyer_win' | 'seller_win' | 'compromise';
  buyer: string;
  seller: string;
  responseMinutes: number;
  durationMinutes: number;
  createdAt: string;
}

export type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';

export interface Offer {
  id: string;
  postId: string;
  buyerId: string;
  sellerId: string;
  price: number;
  message: string;
  status: OfferStatus;
  createdAt: string;
  respondedAt?: string;
  buyer: User;
  seller: User;
}

export type OrderStageType =
  | 'order_created'
  | 'mediator_assigned'
  | 'seller_preparing'
  | 'account_verified'
  | 'buyer_confirmed'
  | 'fund_released'
  | 'completed'
  | 'disputed';

export interface OrderStage {
  type: OrderStageType;
  title: string;
  description: string;
  role: 'buyer' | 'seller' | 'mediator' | 'system';
  completedAt?: string;
  note?: string;
}

export type OrderStatus = 'pending' | 'paid' | 'delivering' | 'completed' | 'disputed' | 'cancelled';

export interface TradeOrder {
  id: string;
  postId: string;
  buyerId: string;
  sellerId: string;
  mediatorId: string;
  amount: number;
  status: OrderStatus;
  createdAt: string;
  postTitle: string;
  postCover: string;
  stages: OrderStage[];
  currentStage: OrderStageType;
}

export interface QAComment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  replyTo?: string;
  createdAt: string;
  isSeller: boolean;
  user: User;
}

export interface Review {
  id: string;
  tradeId: string;
  userId: string;
  rating: number;
  content: string;
  images: string[];
  createdAt: string;
  user: User;
  postTitle: string;
}

export type PitfallType = 'exposure' | 'experience' | 'guide';

export interface PitfallCase {
  id: string;
  title: string;
  content: string;
  type: PitfallType;
  images: string[];
  createdAt: string;
  likes: number;
  comments: number;
  user: User;
}

export interface PriceReference {
  gameId: string;
  gameName: string;
  rank: string;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  trend: 'up' | 'down' | 'stable';
  sampleCount: number;
}

export interface CreditRecord {
  id: string;
  userId: string;
  type: 'plus' | 'minus';
  change: number;
  description: string;
  createdAt: string;
}
