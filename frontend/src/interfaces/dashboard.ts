export interface UserData {
    name: string;
    username: string;
    avatar: string;
    followers: number;
    following: number;
    posts: number;
}

export interface FeedItemType {
    id: number;
    author: string;
    username: string;
    avatar: string;
    content: string;
    time: string;
    likes: number;
    comments: number;
    shares: number;
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