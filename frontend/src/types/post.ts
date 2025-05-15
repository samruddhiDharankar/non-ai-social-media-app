export interface User {
  _id: string;
  username: string;
}

export interface Comment {
  _id: string;
  content: string;
  user: User;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  _id: string;
  text: string;
  aiDetectionSummary: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  comments: Comment[];
  isDeleted: boolean;
}
