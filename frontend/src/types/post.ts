export interface Comment {
  _id: string;
  content: string;
  userId: string;
  username?: string;
  createdAt: string;
}

export interface Post {
  _id: string;
  text: string;
  aiDetectionSummary: string;
  createdAt: string;
  userId: string;
  username?: string;
  comments: Comment[];
}
