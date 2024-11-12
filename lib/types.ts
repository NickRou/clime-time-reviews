import { QueryResultRow } from "@vercel/postgres";

export type ClerkUser = {
  id: string;
  username: string;
};

export interface UserReview extends QueryResultRow {
  review_id: string;
  user_id: string;
  user_name: string;
  timestamp: string;
  restaurant_name: string;
  address: string;
  date: string;
  rating: number;
  review: string;
  tags: string[];
  what_to_order: string;
}

export interface Friend extends QueryResultRow {
  id: string;
  follower_id: string;
  following_id: string;
  follower_username: string;
  following_username: string;
}
