import { create } from 'zustand';
import type { User, Post, Circle, Mediator, QAComment, TradeOrder, Review, PitfallCase, PriceReference, CreditRecord, Game } from '@/types';
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
  activePost: Post | null;
  activeCircle: Circle | null;

  setActivePost: (post: Post | null) => void;
  setActiveCircle: (circle: Circle | null) => void;
  addQAComment: (comment: Omit<QAComment, 'id' | 'createdAt'>) => void;
  createPost: (post: Omit<Post, 'id' | 'createdAt' | 'user' | 'game' | 'viewCount' | 'status'>) => void;
  getPostQA: (postId: string) => QAComment[];
  getUserOrders: (userId: string) => TradeOrder[];
  getUserReviews: (userId: string) => Review[];
  getGamePosts: (gameId: string) => Post[];
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
  activePost: null,
  activeCircle: null,

  setActivePost: (post) => set({ activePost: post }),
  setActiveCircle: (circle) => set({ activeCircle: circle }),

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
}));
