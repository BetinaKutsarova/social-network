import { User, UserPost } from "../state/atoms";
import { PostData } from "./profile";

export interface UserData {
	email: string;
	username: string;
	avatarUrl?: string;
	followers: number;
	following: number;
	posts: PostData[];
}

export interface AuthorType {
  id: string;
  username: string;
  email: string;
}

export interface FeedItemType {
	id: string;
	author: AuthorType; 
	username: string;
	content: string;
	time: string;
	likes: number;
	comments: number;
	avatarUrl?: string;
	shares: number;
	image?: string;
	createdAt: string;
	currentUser: User;
}

export interface TrendingTopic {
	id: number;
	name: string;
	posts: string;
}

export interface SuggestionUser {
	id: number;
	name: string;
	username: string;
	avatar: string;
}

export interface FeedItemProps {
	item: UserPost;
	avatarUrl?: string;
	currentUser: User | null;
	onDelete: () => void;
}