import { atom } from 'jotai';

export interface User {
  id: string;
	username: string;
  email: string;
  role: string;
}

export interface UserPost {
	id: number;
	username: string;
  content: string;
  time: string;
  likes: number;
  comments: number;
  shares: number;
  image?: string;
}

export const userAtom = atom<User | null>(null);
export const activeTabAtom = atom<string>('dashboard');
export const activeSectionAtom = atom<string>('posts');
export const userPostsAtom = atom<UserPost[]>([]);
