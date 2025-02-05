import {
  pgTable,
  text,
  timestamp,
  integer,
  uuid,
  primaryKey,
} from 'drizzle-orm/pg-core'

export const Posts = pgTable('posts', {
  post_id: uuid('post_id').primaryKey().defaultRandom(),
  user_id: text('user_id').notNull(),
  loc_name: text('loc_name').notNull(),
  loc_address: text('loc_address').notNull(),
  loc_review: integer('loc_review').notNull(),
  loc_content: text('loc_content').notNull(),
  createTs: timestamp('create_ts').defaultNow().notNull(),
})

export const Likes = pgTable('likes', {
  like_id: uuid('like_id').primaryKey().defaultRandom(),
  post_id: uuid('post_id').notNull(),
  user_id: text('user_id').notNull(),
  createTs: timestamp('create_ts').defaultNow().notNull(),
})

export const Follows = pgTable(
  'follows',
  {
    follower_id: text('follower_id').notNull(),
    followee_id: text('followee_id').notNull(),
    createTs: timestamp('create_ts').defaultNow().notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.follower_id, table.followee_id] }),
    }
  }
)
