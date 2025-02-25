export type User = {
  user_id: string
  first_name: string
  last_name: string
  username: string
  image_url: string
}

export type Post = {
  post_id: string
  user_id: string
  loc_name: string
  loc_address: string
  loc_review: number
  loc_content: string
  loc_cost: number
  loc_longitude: number
  loc_latitude: number
  image_urls?: string[]
  createTs: Date
}

export type PostWithUser = Post & {
  user: User
}

export type Like = {
  post_id: string
  user_id: string
}

export type Image = {
  image_url: string
}
