export type User = {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  profile_picture?: string;
  gender: string;

};

export type Like = {
  user_id: string;
};

export type Comment = {
  id: number;
  content: string;
  user: User;
};

export type Post = {
  id: number;
  user: User;
  content: string;
  likes: Like[];
  comments: Comment[];
};

