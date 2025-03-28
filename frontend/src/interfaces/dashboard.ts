import { PostData } from "./profile";

export interface UserData {
	name: string;
	email: string;
	username: string;
	avatar: string;
	followers: number;
	following: number;
	posts: PostData[];
}

export interface AuthorType {
  id: number;
  username: string;
  email: string;
}

export interface FeedItemType {
	id: number;
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

export interface NavItemProps {
	icon: React.ReactNode;
	label: string;
	isActive: boolean;
	onClick: () => void;
}

export interface FeedItemProps {
	item: FeedItemType;
}