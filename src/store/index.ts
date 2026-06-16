import { create } from 'zustand';
import type {
  User,
  Post,
  Circle,
  Mediator,
  QAComment,
  TradeOrder,
  Review,
  PitfallCase,
  PriceReference,
  CreditRecord,
  Game,
  MediatorOrderRecord,
  Offer,
  OrderStage,
  OrderStageType,
} from '@/types';
import {
  mockUsers,
  mockGames,
  mockCircles,
  mockPosts,
  mockMediators,
  mockPitfalls,
  mockPriceReferences,
  mockReviews,
  mockQAComments,
  mockCreditRecords,
  mockTradeOrders,
  mockMediatorRecords,
  mockOffers,
} from '@/data/mockData';

const generateOrderStages = (startTime: string, amount: number, mediatorName: string): { stages: OrderStage[]; currentStage: OrderStageType } => {
  const stages: OrderStage[] = [
    { type: 'order_created', title: '下单成功', description: '买家已支付订单，等待中介介入', role: 'buyer', completedAt: startTime },
    { type: 'mediator_assigned', title: '中介已介入', description: `${mediatorName}已接单，正在联系卖家`, role: 'mediator' },
    { type: 'seller_preparing', title: '卖家交接中', description: '卖家正在准备账号资料并提交给中介', role: 'seller' },
    { type: 'account_verified', title: '账号验证完成', description: '中介已验证账号信息，与描述一致', role: 'mediator' },
    { type: 'buyer_confirmed', title: '买家确认收货', description: '买家确认账号无误，同意放款', role: 'buyer' },
    { type: 'fund_released', title: '已放款给卖家', description: '平台已将款项打给卖家', role: 'system' },
    { type: 'completed', title: '交易完成', description: '交易已结束，欢迎对本次服务进行评价', role: 'system' },
  ];
  return { stages, currentStage: 'order_created' };
};

interface AppState {
  currentUser: User;
  users: User[];
  games: Game[];
  posts: Post[];
  circles: Circle[];
  mediators: Mediator[];
  pitfalls: PitfallCase[];
  priceReferences: PriceReference[];
  reviews: Review[];
  qaComments: QAComment[];
  creditRecords: CreditRecord[];
  orders: TradeOrder[];
  mediatorRecords: MediatorOrderRecord[];
  offers: Offer[];
  activePost: Post | null;
  activeCircle: Circle | null;
  pendingCircleGameId: string | null;

  setActivePost: (post: Post | null) => void;
  setActiveCircle: (circle: Circle | null) => void;
  setPendingCircleGameId: (gameId: string | null) => void;
  addQAComment: (comment: Omit<QAComment, 'id' | 'createdAt'>) => void;
  createPost: (post: Omit<Post, 'id' | 'createdAt' | 'user' | 'game' | 'viewCount' | 'status'>) => void;
  updatePostStatus: (postId: string, status: Post['status']) => void;
  closePost: (postId: string) => void;
  createTradeOrder: (data: {
    postId: string;
    buyerId: string;
    sellerId: string;
    mediatorId: string;
    amount: number;
    postTitle: string;
    postCover: string;
    offerId?: string;
  }) => TradeOrder;
  createTradeOrderFromOffer: (offerId: string, mediatorId: string) => TradeOrder;
  advanceOrderStage: (orderId: string, note?: string) => void;
  getOrderById: (orderId: string) => TradeOrder | undefined;
  getOfferById: (offerId: string) => Offer | undefined;
  getPostUserOffer: (postId: string, userId: string) => Offer | undefined;
  createOffer: (data: {
    postId: string;
    buyerId: string;
    sellerId: string;
    price: number;
    message: string;
  }) => Offer;
  acceptOffer: (offerId: string) => void;
  rejectOffer: (offerId: string) => void;
  cancelOffer: (offerId: string) => void;
  getPostOffers: (postId: string) => Offer[];
  getUserOffers: (userId: string, role: 'buyer' | 'seller') => Offer[];
  getPostQA: (postId: string) => QAComment[];
  getUserOrders: (userId: string) => TradeOrder[];
  getUserReviews: (userId: string) => Review[];
  getGamePosts: (gameId: string) => Post[];
  getMediatorRecords: (mediatorId: string) => MediatorOrderRecord[];
  getPriceReference: (gameId: string, rank: string) => PriceReference | null;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: mockUsers[0],
  users: mockUsers,
  games: mockGames,
  posts: mockPosts,
  circles: mockCircles,
  mediators: mockMediators,
  pitfalls: mockPitfalls,
  priceReferences: mockPriceReferences,
  reviews: mockReviews,
  qaComments: mockQAComments,
  creditRecords: mockCreditRecords,
  orders: mockTradeOrders,
  mediatorRecords: mockMediatorRecords,
  offers: mockOffers,
  activePost: null,
  activeCircle: null,
  pendingCircleGameId: null,

  setActivePost: (post) => set({ activePost: post }),
  setActiveCircle: (circle) => set({ activeCircle: circle }),
  setPendingCircleGameId: (gameId) => set({ pendingCircleGameId: gameId }),

  addQAComment: (comment) =>
    set((state) => ({
      qaComments: [
        ...state.qaComments,
        {
          ...comment,
          id: `qa${Date.now()}`,
          createdAt: new Date().toISOString(),
        },
      ],
    })),

  createPost: (postData) =>
    set((state) => {
      const game = state.games.find((g) => g.id === postData.gameId) || state.games[0];
      const newPost: Post = {
        ...postData,
        id: `p${Date.now()}`,
        createdAt: new Date().toISOString(),
        user: state.currentUser,
        game,
        viewCount: 0,
        status: 'active',
      };
      return { posts: [newPost, ...state.posts] };
    }),

  updatePostStatus: (postId, status) =>
    set((state) => ({
      posts: state.posts.map((p) => (p.id === postId ? { ...p, status } : p)),
    })),

  closePost: (postId) =>
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId ? { ...p, status: 'closed' as const } : p
      ),
    })),

  createTradeOrder: (data) => {
    const now = new Date().toISOString();
    const mediator = get().mediators.find((m) => m.id === data.mediatorId);
    const { stages, currentStage } = generateOrderStages(
      now,
      data.amount,
      mediator?.nickname || '中介'
    );

    const newOrder: TradeOrder = {
      id: `t${Date.now()}`,
      postId: data.postId,
      buyerId: data.buyerId,
      sellerId: data.sellerId,
      mediatorId: data.mediatorId,
      amount: data.amount,
      status: 'delivering',
      createdAt: now,
      postTitle: data.postTitle,
      postCover: data.postCover,
      stages,
      currentStage,
      offerId: data.offerId,
    };

    set((state) => ({
      orders: [newOrder, ...state.orders],
      posts: state.posts.map((p) =>
        p.id === data.postId ? { ...p, status: 'trading' as const } : p
      ),
    }));

    return newOrder;
  },

  createTradeOrderFromOffer: (offerId, mediatorId) => {
    const offer = get().offers.find((o) => o.id === offerId);
    const post = get().posts.find((p) => p.id === offer?.postId);
    if (!offer || !post) throw new Error('Offer or post not found');

    return get().createTradeOrder({
      postId: post.id,
      buyerId: offer.buyerId,
      sellerId: offer.sellerId,
      mediatorId,
      amount: offer.price,
      postTitle: post.title,
      postCover: post.screenshots[0],
      offerId: offer.id,
    });
  },

  advanceOrderStage: (orderId, note) => {
    const now = new Date().toISOString();
    set((state) => {
      const order = state.orders.find((o) => o.id === orderId);
      if (!order) return state;

      const currentIdx = order.stages.findIndex((s) => s.type === order.currentStage);
      const nextIdx = currentIdx + 1;
      if (nextIdx >= order.stages.length) return state;

      const nextStage = order.stages[nextIdx];
      const newStages = order.stages.map((s, idx) => {
        if (idx === currentIdx) return { ...s, completedAt: now, note: note || s.note };
        return s;
      });
      const newCurrentStage = nextStage.type;
      const newStatus = nextIdx >= order.stages.length - 1 ? 'completed' as const : order.status;

      return {
        orders: state.orders.map((o) =>
          o.id === orderId
            ? { ...o, stages: newStages, currentStage: newCurrentStage, status: newStatus }
            : o
        ),
      };
    });
  },

  getOrderById: (orderId) => {
    return get().orders.find((o) => o.id === orderId);
  },

  getOfferById: (offerId) => {
    return get().offers.find((o) => o.id === offerId);
  },

  getPostUserOffer: (postId, userId) => {
    return get().offers.find((o) => o.postId === postId && o.buyerId === userId);
  },

  createOffer: (data) => {
    const newOffer: Offer = {
      id: `o${Date.now()}`,
      postId: data.postId,
      buyerId: data.buyerId,
      sellerId: data.sellerId,
      price: data.price,
      message: data.message,
      status: 'pending',
      createdAt: new Date().toISOString(),
      buyer: get().currentUser,
      seller: get().users.find((u) => u.id === data.sellerId) || get().currentUser,
    };

    set((state) => ({
      offers: [newOffer, ...state.offers],
    }));

    return newOffer;
  },

  acceptOffer: (offerId) =>
    set((state) => ({
      offers: state.offers.map((o) =>
        o.id === offerId ? { ...o, status: 'accepted' as const, respondedAt: new Date().toISOString() } : o
      ),
    })),

  rejectOffer: (offerId) =>
    set((state) => ({
      offers: state.offers.map((o) =>
        o.id === offerId ? { ...o, status: 'rejected' as const, respondedAt: new Date().toISOString() } : o
      ),
    })),

  cancelOffer: (offerId) =>
    set((state) => ({
      offers: state.offers.map((o) =>
        o.id === offerId ? { ...o, status: 'cancelled' as const } : o
      ),
    })),

  getPostOffers: (postId) => {
    const state = get();
    return state.offers.filter((o) => o.postId === postId);
  },

  getUserOffers: (userId, role) => {
    const state = get();
    if (role === 'buyer') return state.offers.filter((o) => o.buyerId === userId);
    return state.offers.filter((o) => o.sellerId === userId);
  },

  getPostQA: (postId) => {
    const state = get();
    return state.qaComments.filter((c) => c.postId === postId);
  },

  getUserOrders: (userId) => {
    const state = get();
    return state.orders.filter((o) => o.buyerId === userId || o.sellerId === userId);
  },

  getUserReviews: (userId) => {
    const state = get();
    return state.reviews.filter((r) => r.userId === userId);
  },

  getGamePosts: (gameId) => {
    const state = get();
    return state.posts.filter((p) => p.gameId === gameId);
  },

  getMediatorRecords: (mediatorId) => {
    const state = get();
    return state.mediatorRecords.filter((r) => r.mediatorId === mediatorId);
  },

  getPriceReference: (gameId, rank) => {
    const state = get();
    const refs = state.priceReferences.filter((r) => r.gameId === gameId);
    if (refs.length === 0) return null;

    const rankLower = rank.toLowerCase().trim();

    const matched = refs.find((r) => {
      const refRankLower = r.rank.toLowerCase().trim();
      if (rankLower === refRankLower) return true;
      if (rankLower.includes(refRankLower.replace(/[0-9+]/g, '').trim())) return true;
      const baseRank = rankLower.replace(/[0-9+星]/g, '').trim();
      const refBaseRank = refRankLower.replace(/[0-9+]/g, '').trim();
      if (baseRank && refBaseRank && baseRank === refBaseRank) return true;
      return false;
    });

    if (matched) return matched;
    if (refs.length > 0) return refs[Math.floor(refs.length / 2)];
    return null;
  },
}));
