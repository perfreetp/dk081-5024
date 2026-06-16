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
} from '@/data/mockData';

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
  activePost: Post | null;
  activeCircle: Circle | null;
  pendingCircleGameId: string | null;

  setActivePost: (post: Post | null) => void;
  setActiveCircle: (circle: Circle | null) => void;
  setPendingCircleGameId: (gameId: string | null) => void;
  addQAComment: (comment: Omit<QAComment, 'id' | 'createdAt'>) => void;
  createPost: (post: Omit<Post, 'id' | 'createdAt' | 'user' | 'game' | 'viewCount' | 'status'>) => void;
  createTradeOrder: (data: {
    postId: string;
    buyerId: string;
    sellerId: string;
    mediatorId: string;
    amount: number;
    postTitle: string;
    postCover: string;
  }) => TradeOrder;
  updatePostStatus: (postId: string, status: Post['status']) => void;
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

  createTradeOrder: (data) => {
    const newOrder: TradeOrder = {
      id: `t${Date.now()}`,
      postId: data.postId,
      buyerId: data.buyerId,
      sellerId: data.sellerId,
      mediatorId: data.mediatorId,
      amount: data.amount,
      status: 'delivering',
      createdAt: new Date().toISOString(),
      postTitle: data.postTitle,
      postCover: data.postCover,
    };

    set((state) => ({
      orders: [newOrder, ...state.orders],
      posts: state.posts.map((p) =>
        p.id === data.postId ? { ...p, status: 'trading' as const } : p
      ),
    }));

    return newOrder;
  },

  updatePostStatus: (postId, status) =>
    set((state) => ({
      posts: state.posts.map((p) => (p.id === postId ? { ...p, status } : p)),
    })),

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
    const matched = refs.find((r) => rank && rank.includes(r.rank.replace(/[0-9+]/g, '').trim()));
    if (matched) return matched;
    let closest = refs[0];
    let minDist = Infinity;
    for (const ref of refs) {
      const dist = Math.abs(ref.avgPrice - refs.reduce((a, b) => a + b.avgPrice, 0) / refs.length);
      if (dist < minDist) {
        minDist = dist;
        closest = ref;
      }
    }
    return closest;
  },
}));
