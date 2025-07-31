import {
  users,
  posts,
  likes,
  comments,
  follows,
  messages,
  type User,
  type UpsertUser,
  type Post,
  type InsertPost,
  type Comment,
  type InsertComment,
  type Message,
  type InsertMessage,
  type Like,
  type Follow,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, sql, count } from "drizzle-orm";

export interface IStorage {
  // User operations - required for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserByUsername(username: string): Promise<User | undefined>;
  updateUserProfile(id: string, data: Partial<User>): Promise<User>;
  getUserStats(id: string): Promise<{ posts: number; followers: number; following: number; vibeScore: number }>;

  // Post operations
  createPost(post: InsertPost): Promise<Post>;
  getPost(id: string): Promise<Post | undefined>;
  getFeedPosts(userId: string, limit?: number, offset?: number): Promise<Array<Post & { user: User; likesCount: number; commentsCount: number; isLiked: boolean }>>;
  getUserPosts(userId: string, limit?: number, offset?: number): Promise<Array<Post & { user: User; likesCount: number; commentsCount: number }>>;
  getStories(userId: string): Promise<Array<Post & { user: User }>>;
  deletePost(id: string, userId: string): Promise<boolean>;

  // Like operations
  likePost(postId: string, userId: string): Promise<boolean>;
  unlikePost(postId: string, userId: string): Promise<boolean>;
  isPostLiked(postId: string, userId: string): Promise<boolean>;

  // Comment operations
  createComment(comment: InsertComment): Promise<Comment>;
  getPostComments(postId: string): Promise<Array<Comment & { user: User }>>;
  deleteComment(id: string, userId: string): Promise<boolean>;

  // Follow operations
  followUser(followerId: string, followingId: string): Promise<boolean>;
  unfollowUser(followerId: string, followingId: string): Promise<boolean>;
  isFollowing(followerId: string, followingId: string): Promise<boolean>;
  getFollowers(userId: string): Promise<Array<User>>;
  getFollowing(userId: string): Promise<Array<User>>;

  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getConversation(userId1: string, userId2: string): Promise<Array<Message & { sender: User; receiver: User }>>;
  getConversations(userId: string): Promise<Array<{ user: User; lastMessage: Message; unreadCount: number }>>;
  markMessageAsRead(messageId: string): Promise<boolean>;

  // Search operations
  searchUsers(query: string): Promise<Array<User>>;
  searchPosts(query: string): Promise<Array<Post & { user: User; likesCount: number; commentsCount: number }>>;
  searchHashtags(query: string): Promise<Array<{ tag: string; count: number }>>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async updateUserProfile(id: string, data: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getUserStats(id: string): Promise<{ posts: number; followers: number; following: number; vibeScore: number }> {
    const [postsCount] = await db
      .select({ count: count() })
      .from(posts)
      .where(eq(posts.userId, id));

    const [followersCount] = await db
      .select({ count: count() })
      .from(follows)
      .where(eq(follows.followingId, id));

    const [followingCount] = await db
      .select({ count: count() })
      .from(follows)
      .where(eq(follows.followerId, id));

    const [user] = await db.select().from(users).where(eq(users.id, id));

    return {
      posts: postsCount.count,
      followers: followersCount.count,
      following: followingCount.count,
      vibeScore: user?.vibeScore || 0,
    };
  }

  // Post operations
  async createPost(post: InsertPost): Promise<Post> {
    const [newPost] = await db.insert(posts).values(post).returning();
    return newPost;
  }

  async getPost(id: string): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post;
  }

  async getFeedPosts(userId: string, limit = 20, offset = 0): Promise<Array<Post & { user: User; likesCount: number; commentsCount: number; isLiked: boolean }>> {
    const result = await db
      .select({
        post: posts,
        user: users,
        likesCount: count(likes.id),
        isLiked: sql<boolean>`EXISTS(SELECT 1 FROM ${likes} WHERE ${likes.postId} = ${posts.id} AND ${likes.userId} = ${userId})`,
      })
      .from(posts)
      .innerJoin(users, eq(posts.userId, users.id))
      .leftJoin(likes, eq(posts.id, likes.postId))
      .where(and(eq(posts.isStory, false), or(sql`${posts.expiresAt} IS NULL`, sql`${posts.expiresAt} > NOW()`)))
      .groupBy(posts.id, users.id)
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);

    return result.map(row => ({
      ...row.post,
      user: row.user,
      likesCount: Number(row.likesCount),
      commentsCount: 0, // Will be populated separately if needed
      isLiked: row.isLiked,
    }));
  }

  async getUserPosts(userId: string, limit = 20, offset = 0): Promise<Array<Post & { user: User; likesCount: number; commentsCount: number }>> {
    const result = await db
      .select({
        post: posts,
        user: users,
        likesCount: count(likes.id),
      })
      .from(posts)
      .innerJoin(users, eq(posts.userId, users.id))
      .leftJoin(likes, eq(posts.id, likes.postId))
      .where(and(eq(posts.userId, userId), eq(posts.isStory, false)))
      .groupBy(posts.id, users.id)
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);

    return result.map(row => ({
      ...row.post,
      user: row.user,
      likesCount: Number(row.likesCount),
      commentsCount: 0,
    }));
  }

  async getStories(userId: string): Promise<Array<Post & { user: User }>> {
    const result = await db
      .select({
        post: posts,
        user: users,
      })
      .from(posts)
      .innerJoin(users, eq(posts.userId, users.id))
      .where(and(eq(posts.isStory, true), sql`${posts.expiresAt} > NOW()`))
      .orderBy(desc(posts.createdAt));

    return result.map(row => ({
      ...row.post,
      user: row.user,
    }));
  }

  async deletePost(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(posts)
      .where(and(eq(posts.id, id), eq(posts.userId, userId)));
    return (result.rowCount ?? 0) > 0;
  }

  // Like operations
  async likePost(postId: string, userId: string): Promise<boolean> {
    try {
      await db.insert(likes).values({ postId, userId });
      await db
        .update(posts)
        .set({ likesCount: sql`${posts.likesCount} + 1` })
        .where(eq(posts.id, postId));
      return true;
    } catch {
      return false; // Already liked
    }
  }

  async unlikePost(postId: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(likes)
      .where(and(eq(likes.postId, postId), eq(likes.userId, userId)));
    
    if ((result.rowCount ?? 0) > 0) {
      await db
        .update(posts)
        .set({ likesCount: sql`${posts.likesCount} - 1` })
        .where(eq(posts.id, postId));
      return true;
    }
    return false;
  }

  async isPostLiked(postId: string, userId: string): Promise<boolean> {
    const [like] = await db
      .select()
      .from(likes)
      .where(and(eq(likes.postId, postId), eq(likes.userId, userId)));
    return !!like;
  }

  // Comment operations
  async createComment(comment: InsertComment): Promise<Comment> {
    const [newComment] = await db.insert(comments).values(comment).returning();
    await db
      .update(posts)
      .set({ commentsCount: sql`${posts.commentsCount} + 1` })
      .where(eq(posts.id, comment.postId));
    return newComment;
  }

  async getPostComments(postId: string): Promise<Array<Comment & { user: User }>> {
    const result = await db
      .select({
        comment: comments,
        user: users,
      })
      .from(comments)
      .innerJoin(users, eq(comments.userId, users.id))
      .where(eq(comments.postId, postId))
      .orderBy(desc(comments.createdAt));

    return result.map(row => ({
      ...row.comment,
      user: row.user,
    }));
  }

  async deleteComment(id: string, userId: string): Promise<boolean> {
    const [comment] = await db.select().from(comments).where(eq(comments.id, id));
    if (!comment) return false;

    const result = await db
      .delete(comments)
      .where(and(eq(comments.id, id), eq(comments.userId, userId)));
    
    if ((result.rowCount ?? 0) > 0) {
      await db
        .update(posts)
        .set({ commentsCount: sql`${posts.commentsCount} - 1` })
        .where(eq(posts.id, comment.postId));
      return true;
    }
    return false;
  }

  // Follow operations
  async followUser(followerId: string, followingId: string): Promise<boolean> {
    try {
      await db.insert(follows).values({ followerId, followingId });
      return true;
    } catch {
      return false; // Already following
    }
  }

  async unfollowUser(followerId: string, followingId: string): Promise<boolean> {
    const result = await db
      .delete(follows)
      .where(and(eq(follows.followerId, followerId), eq(follows.followingId, followingId)));
    return (result.rowCount ?? 0) > 0;
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const [follow] = await db
      .select()
      .from(follows)
      .where(and(eq(follows.followerId, followerId), eq(follows.followingId, followingId)));
    return !!follow;
  }

  async getFollowers(userId: string): Promise<Array<User>> {
    const result = await db
      .select({ user: users })
      .from(follows)
      .innerJoin(users, eq(follows.followerId, users.id))
      .where(eq(follows.followingId, userId));

    return result.map(row => row.user);
  }

  async getFollowing(userId: string): Promise<Array<User>> {
    const result = await db
      .select({ user: users })
      .from(follows)
      .innerJoin(users, eq(follows.followingId, users.id))
      .where(eq(follows.followerId, userId));

    return result.map(row => row.user);
  }

  // Message operations
  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    return newMessage;
  }

  async getConversation(userId1: string, userId2: string): Promise<Array<Message & { sender: User; receiver: User }>> {
    const result = await db
      .select({
        message: messages,
        sender: { ...users, id: sql`sender.id`.as('sender_id') },
        receiver: { ...users, id: sql`receiver.id`.as('receiver_id') },
      })
      .from(messages)
      .innerJoin(sql`${users} as sender`, eq(messages.senderId, sql`sender.id`))
      .innerJoin(sql`${users} as receiver`, eq(messages.receiverId, sql`receiver.id`))
      .where(
        or(
          and(eq(messages.senderId, userId1), eq(messages.receiverId, userId2)),
          and(eq(messages.senderId, userId2), eq(messages.receiverId, userId1))
        )
      )
      .orderBy(desc(messages.createdAt));

    return result.map(row => ({
      ...row.message,
      sender: row.sender as User,
      receiver: row.receiver as User,
    }));
  }

  async getConversations(userId: string): Promise<Array<{ user: User; lastMessage: Message; unreadCount: number }>> {
    // This is a simplified version - in production, you'd want more sophisticated conversation grouping
    const result = await db
      .select({
        user: users,
        message: messages,
      })
      .from(messages)
      .innerJoin(users, or(eq(messages.senderId, users.id), eq(messages.receiverId, users.id)))
      .where(and(or(eq(messages.senderId, userId), eq(messages.receiverId, userId)), sql`${users.id} != ${userId}`))
      .orderBy(desc(messages.createdAt));

    // Group by user and get latest message
    const conversations = new Map();
    result.forEach(row => {
      if (!conversations.has(row.user.id)) {
        conversations.set(row.user.id, {
          user: row.user,
          lastMessage: row.message,
          unreadCount: 0,
        });
      }
    });

    return Array.from(conversations.values());
  }

  async markMessageAsRead(messageId: string): Promise<boolean> {
    const result = await db
      .update(messages)
      .set({ isRead: true })
      .where(eq(messages.id, messageId));
    return (result.rowCount ?? 0) > 0;
  }

  // Search operations
  async searchUsers(query: string): Promise<Array<User>> {
    const searchTerm = `%${query.toLowerCase()}%`;
    return await db
      .select()
      .from(users)
      .where(
        or(
          sql`LOWER(${users.username}) LIKE ${searchTerm}`,
          sql`LOWER(${users.firstName}) LIKE ${searchTerm}`,
          sql`LOWER(${users.lastName}) LIKE ${searchTerm}`,
          sql`LOWER(CONCAT(${users.firstName}, ' ', ${users.lastName})) LIKE ${searchTerm}`
        )
      )
      .limit(20);
  }

  async searchPosts(query: string): Promise<Array<Post & { user: User; likesCount: number; commentsCount: number }>> {
    const searchTerm = `%${query.toLowerCase()}%`;
    
    const result = await db
      .select({
        post: posts,
        user: users,
        likesCount: count(likes.id),
        commentsCount: count(comments.id),
      })
      .from(posts)
      .innerJoin(users, eq(posts.userId, users.id))
      .leftJoin(likes, eq(posts.id, likes.postId))
      .leftJoin(comments, eq(posts.id, comments.postId))
      .where(sql`LOWER(${posts.content}) LIKE ${searchTerm}`)
      .groupBy(posts.id, users.id)
      .orderBy(desc(posts.createdAt))
      .limit(20);

    return result.map(row => ({
      ...row.post,
      user: row.user,
      likesCount: Number(row.likesCount || 0),
      commentsCount: Number(row.commentsCount || 0),
    }));
  }

  async searchHashtags(query: string): Promise<Array<{ tag: string; count: number }>> {
    const searchTerm = `%#${query.toLowerCase()}%`;
    
    // Extract hashtags from post content and count occurrences
    const result = await db
      .select({
        content: posts.content,
      })
      .from(posts)
      .where(sql`LOWER(${posts.content}) LIKE ${searchTerm}`);

    // Process hashtags (simplified implementation)
    const hashtagCounts = new Map<string, number>();
    result.forEach(row => {
      const hashtags = row.content.match(/#\w+/g) || [];
      hashtags.forEach(tag => {
        const normalizedTag = tag.toLowerCase().substring(1);
        if (normalizedTag.includes(query.toLowerCase())) {
          hashtagCounts.set(normalizedTag, (hashtagCounts.get(normalizedTag) || 0) + 1);
        }
      });
    });

    return Array.from(hashtagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
  }
}

export const storage = new DatabaseStorage();
