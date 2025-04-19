export interface User {
  _id: string;
  name: string;
  username: string;
  bio?: string;
  profilePictUrl?: string;
  tier: string;
  averageAuthScore: number;
  badge: string;
  postCount: number;
  streakCount: number;
}
