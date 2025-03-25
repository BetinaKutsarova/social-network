export interface UserData {
  name: string;
  username: string;
  bio: string;
  location?: string;
  website?: string;
  joinDate: string;
  avatar: string;
  coverPhoto: string;
  followers: number;
  following: number;
  posts: number;
}

export interface PetData {
  id: number;
  name: string;
  type: string;
  breed: string;
  age: string;
  photo: string;
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