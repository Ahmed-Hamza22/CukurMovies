export interface IReview {
  author: string;
  author_details: Authordetails;
  content: string;
  created_at: string;
  id: string;
  updated_at: string;
  url: string;
}
export interface Authordetails {
  name: string;
  username: string;
  avatar_path: null;
  rating: number;
}