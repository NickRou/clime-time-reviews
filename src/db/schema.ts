import {
  pgTable,
  text,
  timestamp,
  integer,
  uuid,
  primaryKey,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const Posts = pgTable('posts', {
  post_id: uuid('post_id').primaryKey().defaultRandom(),
  user_id: text('user_id')
    .notNull()
    .references(() => Users.user_id),
  loc_place_id: text('loc_place_id').notNull(),
  loc_review: integer('loc_review').notNull(),
  loc_content: text('loc_content').notNull(),
  loc_cost: integer('loc_cost').notNull().default(0),
  createTs: timestamp('create_ts').defaultNow().notNull(),
})

export const Likes = pgTable('likes', {
  like_id: uuid('like_id').primaryKey().defaultRandom(),
  post_id: uuid('post_id')
    .notNull()
    .references(() => Posts.post_id),
  user_id: text('user_id')
    .notNull()
    .references(() => Users.user_id),
  createTs: timestamp('create_ts').defaultNow().notNull(),
})

export const Follows = pgTable(
  'follows',
  {
    follower_id: text('follower_id')
      .notNull()
      .references(() => Users.user_id),
    followee_id: text('followee_id')
      .notNull()
      .references(() => Users.user_id),
    createTs: timestamp('create_ts').defaultNow().notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.follower_id, table.followee_id] }),
    }
  }
)

export const Users = pgTable('users', {
  user_id: text('user_id').primaryKey(),
  username: text('username').notNull(),
  first_name: text('first_name').notNull(),
  last_name: text('last_name').notNull(),
  image_url: text('image_url').notNull(),
  createTs: timestamp('create_ts').defaultNow().notNull(),
})

export const Images = pgTable('images', {
  image_id: uuid('image_id').primaryKey().defaultRandom(),
  post_id: uuid('post_id')
    .notNull()
    .references(() => Posts.post_id),
  image_url: text('image_url').notNull(),
  createTs: timestamp('create_ts').defaultNow().notNull(),
})

export const postsRelations = relations(Posts, ({ one }) => ({
  user: one(Users, {
    fields: [Posts.user_id],
    references: [Users.user_id],
  }),
}))

export const usersRelations = relations(Users, ({ many }) => ({
  posts: many(Posts),
  likes: many(Likes),
  followedBy: many(Follows, { relationName: 'followee' }),
  following: many(Follows, { relationName: 'follower' }),
}))

export const likesRelations = relations(Likes, ({ one }) => ({
  post: one(Posts, {
    fields: [Likes.post_id],
    references: [Posts.post_id],
  }),
  user: one(Users, {
    fields: [Likes.user_id],
    references: [Users.user_id],
  }),
}))

export const followsRelations = relations(Follows, ({ one }) => ({
  follower: one(Users, {
    fields: [Follows.follower_id],
    references: [Users.user_id],
  }),
  followee: one(Users, {
    fields: [Follows.followee_id],
    references: [Users.user_id],
  }),
}))
