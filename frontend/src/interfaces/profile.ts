export interface UserWithPetsData {
  name: string;
  username: string;
  bio: string;
  location?: string;
  website?: string;
  joinDate: string;
  avatarUrl?: string;
  coverPhoto: string;
  followers: number;
  following: number;
  posts: number;
	pets: PetData[]; 
}

export interface PetData {
	id: string;
	userId: string;
	name: string;
	species: string;
	breed?: string;
	ageYears?: number;
	bio?: string;
	avatarUrl?: string;
}

export interface PostData {
  id: number;
  content: string;
  time: string;
  likes: number;
  comments: number;
  shares: number;
  image?: string;
}

export interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}