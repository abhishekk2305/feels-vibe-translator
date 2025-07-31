import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { openaiService } from "./openaiService";
import { insertPostSchema, insertCommentSchema, insertMessageSchema } from "@shared/schema";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // User profile routes
  app.get('/api/users/:id', isAuthenticated, async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const stats = await storage.getUserStats(req.params.id);
      res.json({ ...user, stats });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Failed to fetch user profile" });
    }
  });

  app.put('/api/users/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { username, bio, firstName, lastName } = req.body;
      
      const updatedUser = await storage.updateUserProfile(userId, {
        username,
        bio,
        firstName,
        lastName,
      });
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Vibe analysis routes
  app.post('/api/vibe/analyze-text', isAuthenticated, async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ message: "Text is required" });
      }

      // Moderate content first
      const moderation = await openaiService.moderateContent(text);
      if (!moderation.safe) {
        return res.status(400).json({ 
          message: "Content not appropriate", 
          flagged: moderation.categories 
        });
      }

      const emotion = await openaiService.analyzeTextEmotion(text);
      res.json(emotion);
    } catch (error) {
      console.error("Error analyzing text emotion:", error);
      res.status(500).json({ message: "Failed to analyze emotion" });
    }
  });

  app.post('/api/vibe/analyze-image', isAuthenticated, upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Image is required" });
      }

      const base64Image = req.file.buffer.toString('base64');
      
      // Moderate image first
      const moderation = await openaiService.moderateImage(base64Image);
      if (!moderation.safe) {
        return res.status(400).json({ 
          message: "Image content not appropriate",
          description: moderation.description
        });
      }

      const emotion = await openaiService.analyzeImageEmotion(base64Image);
      res.json(emotion);
    } catch (error) {
      console.error("Error analyzing image emotion:", error);
      res.status(500).json({ message: "Failed to analyze image emotion" });
    }
  });

  app.post('/api/vibe/transcribe-audio', isAuthenticated, upload.single('audio'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Audio file is required" });
      }

      const transcription = await openaiService.transcribeAudio(req.file.buffer);
      
      // Analyze emotion from transcribed text
      const moderation = await openaiService.moderateContent(transcription);
      if (!moderation.safe) {
        return res.status(400).json({ 
          message: "Audio content not appropriate", 
          flagged: moderation.categories 
        });
      }

      const emotion = await openaiService.analyzeTextEmotion(transcription);
      res.json({ transcription, emotion });
    } catch (error) {
      console.error("Error transcribing audio:", error);
      res.status(500).json({ message: "Failed to transcribe audio" });
    }
  });

  // Meme generation route
  app.post('/api/vibe/generate-meme', isAuthenticated, async (req: any, res) => {
    try {
      const { emotion, mood, userText, style } = req.body;
      if (!emotion || !mood || !userText) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const memeResult = await openaiService.generateMeme({
        emotion,
        mood,
        userText,
        style,
      });

      res.json(memeResult);
    } catch (error) {
      console.error("Error generating meme:", error);
      res.status(500).json({ message: "Failed to generate meme" });
    }
  });

  // Post routes
  app.post('/api/posts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const postData = insertPostSchema.parse({ ...req.body, userId });
      
      // Set story expiration if it's a story
      if (postData.isStory) {
        postData.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      }

      const post = await storage.createPost(postData);
      res.json(post);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  app.get('/api/posts/feed', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;

      const posts = await storage.getFeedPosts(userId, limit, offset);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching feed:", error);
      res.status(500).json({ message: "Failed to fetch feed" });
    }
  });

  app.get('/api/posts/user/:userId', isAuthenticated, async (req, res) => {
    try {
      const { userId } = req.params;
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;

      const posts = await storage.getUserPosts(userId, limit, offset);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching user posts:", error);
      res.status(500).json({ message: "Failed to fetch user posts" });
    }
  });

  app.get('/api/stories', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stories = await storage.getStories(userId);
      res.json(stories);
    } catch (error) {
      console.error("Error fetching stories:", error);
      res.status(500).json({ message: "Failed to fetch stories" });
    }
  });

  app.delete('/api/posts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const success = await storage.deletePost(req.params.id, userId);
      if (!success) {
        return res.status(404).json({ message: "Post not found or unauthorized" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ message: "Failed to delete post" });
    }
  });

  // Like routes
  app.post('/api/posts/:id/like', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const success = await storage.likePost(req.params.id, userId);
      res.json({ success });
    } catch (error) {
      console.error("Error liking post:", error);
      res.status(500).json({ message: "Failed to like post" });
    }
  });

  app.delete('/api/posts/:id/like', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const success = await storage.unlikePost(req.params.id, userId);
      res.json({ success });
    } catch (error) {
      console.error("Error unliking post:", error);
      res.status(500).json({ message: "Failed to unlike post" });
    }
  });

  // Comment routes
  app.post('/api/posts/:id/comments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const commentData = insertCommentSchema.parse({
        ...req.body,
        userId,
        postId: req.params.id,
      });

      const comment = await storage.createComment(commentData);
      res.json(comment);
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  app.get('/api/posts/:id/comments', isAuthenticated, async (req, res) => {
    try {
      const comments = await storage.getPostComments(req.params.id);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  // Follow routes
  app.post('/api/users/:id/follow', isAuthenticated, async (req: any, res) => {
    try {
      const followerId = req.user.claims.sub;
      const followingId = req.params.id;
      
      if (followerId === followingId) {
        return res.status(400).json({ message: "Cannot follow yourself" });
      }

      const success = await storage.followUser(followerId, followingId);
      res.json({ success });
    } catch (error) {
      console.error("Error following user:", error);
      res.status(500).json({ message: "Failed to follow user" });
    }
  });

  app.delete('/api/users/:id/follow', isAuthenticated, async (req: any, res) => {
    try {
      const followerId = req.user.claims.sub;
      const followingId = req.params.id;

      const success = await storage.unfollowUser(followerId, followingId);
      res.json({ success });
    } catch (error) {
      console.error("Error unfollowing user:", error);
      res.status(500).json({ message: "Failed to unfollow user" });
    }
  });

  // Message routes
  app.post('/api/messages', isAuthenticated, async (req: any, res) => {
    try {
      const senderId = req.user.claims.sub;
      const messageData = insertMessageSchema.parse({
        ...req.body,
        senderId,
      });

      const message = await storage.createMessage(messageData);
      res.json(message);
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  app.get('/api/conversations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const conversations = await storage.getConversations(userId);
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  app.get('/api/conversations/:userId', isAuthenticated, async (req: any, res) => {
    try {
      const userId1 = req.user.claims.sub;
      const userId2 = req.params.userId;
      
      const messages = await storage.getConversation(userId1, userId2);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching conversation:", error);
      res.status(500).json({ message: "Failed to fetch conversation" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
