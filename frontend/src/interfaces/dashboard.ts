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

export interface FeedItemType {
	id: number;
	username: string;
	content: string;
	time: string;
	likes: number;
	comments: number;
	shares: number;
	image?: string;
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