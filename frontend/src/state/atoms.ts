import { atom } from 'jotai';

export interface User {
  id: string;
	username: string;
  email: string;
  role: string;
	avatarUrl?: string;
}

export interface AuthorType {
  id: string;
  username: string;
	email: string;
}

export interface UserPost {
	id: string;
	author: AuthorType;
	username: string;
  content: string;
  time: string;
  likes: number;
  comments: number;
  shares: number;
  image?: string;
	createdAt: string;
}

export const userAtom = atom<User | null>(null);
export const activeTabAtom = atom<string>('dashboard');
export const activeSectionAtom = atom<string>('posts');
export const userPostsAtom = atom<UserPost[]>([]);
export const allPostsAtom = atom<UserPost[]>([]);
