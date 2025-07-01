export interface Post {
  id?: string
  text?: string;
  medias?: string[]
  userId: string;
  publicationDate: string;
}

export interface Reactions {
  postId: string;
  likes: string[];
  dislikes: string[];
  likesCount: number;
  dislikesCount: number;
}

