import { atom } from 'jotai';

export interface User {
  id: string;
	username: string;
  email: string;
  role: string;
	avatarUrl?: string;
	coverUrl?: string;
}

export interface AuthorType {
  id: string;
  username: string;
	email: string;
}

export interface UserPost {
  id: string;
  userId: string;          
  content: string;
  createdAt: string;       
  updatedAt: string;       
  author: AuthorType;
  commentCount: number;
  likes?: number;
}

export interface CommentCounts {
  [postId: string]: number;
}

export type LikeCounts = Record<string, number>;
export type UserLikedStatus = Record<string, boolean>;

export const userAtom = atom<User | null>(null);
export const profileAtom = atom<User | null>(null);
export const activeTabAtom = atom<string>('dashboard');
export const activeSectionAtom = atom<string>('posts');
export const userPostsAtom = atom<UserPost[]>([]);
export const allPostsAtom = atom<UserPost[]>([]);

export const commentCountFamily = atom<CommentCounts>({});
export const likeCountsAtom = atom<LikeCounts>({});
export const userLikedStatusAtom = atom<UserLikedStatus>({});
