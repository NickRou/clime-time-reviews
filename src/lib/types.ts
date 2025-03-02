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
  images?: Image[]
  user: User
  createTs: Date
}

export type Like = {
  post_id: string
  user_id: string
}

export type Image = {
  image_url: string
}

export type PostState = {
  loc_place_id: string
  loc_name: string
  loc_address: string
  loc_cost: number
  loc_review: number
  loc_content: string
}
