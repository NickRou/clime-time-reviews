export type User = {
  id: string
  firstName: string
  lastName: string
  username: string
  imageUrl: string
}

export type Post = {
  post_id: string
  user_id: string
  loc_name: string
  loc_address: string
  loc_review: number
  loc_content: string
  createTs: Date
}
