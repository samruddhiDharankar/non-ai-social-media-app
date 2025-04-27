export interface Follow {
  _id: string;
  follower: { username: string; name: string };
  following: { username: string; name: string };
}
