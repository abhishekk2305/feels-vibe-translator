# Feels - AI Vibe Translator

## Overview

Feels is a modern social media app that transforms user emotions and moods into viral content using AI. The platform allows users to express their feelings through text, voice, or images, which are then processed by AI to generate memes, images, or short videos that match their "vibe."

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Styling**: Tailwind CSS with shadcn/ui component library for a modern, mobile-first design
- **State Management**: TanStack React Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Design System**: Custom Gen Z-inspired design tokens with gradient themes and dark mode support

### Backend Architecture
- **Runtime**: Node.js with Express.js REST API
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful endpoints with middleware for authentication, logging, and error handling
- **File Uploads**: Multer for handling media file uploads (images, videos)

### Data Storage Solutions
- **Database**: PostgreSQL using Neon serverless database
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple

### Authentication and Authorization
- **Provider**: Replit Auth using OpenID Connect (OIDC)
- **Session Management**: Express sessions with PostgreSQL storage
- **Middleware**: Custom authentication middleware for protecting routes
- **User Management**: Automatic user creation and profile management

### External Service Integrations
- **AI Services**: OpenAI GPT-4o for emotion analysis and content generation
- **Content Types**: Support for meme generation, image creation, and video processing
- **Mood Detection**: Text analysis, voice-to-text processing, and image emotion recognition

## Key Components

### Core Features
1. **Vibe/Emotion Detection**: Multi-modal input processing (text, voice, image)
2. **AI Content Generation**: Meme, image, and video creation based on detected emotions
3. **Social Feed**: Timeline with posts, likes, comments, and sharing capabilities
4. **Stories**: Ephemeral content that expires after 24 hours
5. **Direct Messaging**: Private conversations between users
6. **User Profiles**: Personal profiles with stats and content history

### Database Schema
- **Users**: Profile information, authentication data, and social metrics
- **Posts**: Content with AI-generated media, emotions, and engagement metrics
- **Social Features**: Likes, comments, follows, and messages
- **Sessions**: Secure session management for authentication

### Mobile-First Design
- **Responsive Layout**: Optimized for mobile devices with desktop support
- **PWA Support**: Service worker and manifest for app-like experience
- **Touch Interactions**: Mobile-optimized UI components and gestures
- **Performance**: Optimized loading and caching strategies

## Data Flow

1. **User Input**: Text, voice, or image input captured through the UI
2. **Emotion Analysis**: AI processing to detect mood and emotional state
3. **Content Generation**: AI creates relevant memes, images, or videos
4. **Post Creation**: Generated content saved to database with metadata
5. **Social Distribution**: Content appears in feeds and can be shared
6. **Engagement**: Users can like, comment, and interact with content

## External Dependencies

### Production Dependencies
- **Frontend**: React ecosystem, Radix UI components, TanStack Query
- **Backend**: Express.js, authentication middleware, file handling
- **Database**: Drizzle ORM, PostgreSQL drivers, connection pooling
- **AI Services**: OpenAI API integration for content generation
- **Styling**: Tailwind CSS, PostCSS, CSS variable system

### Development Dependencies
- **Build Tools**: Vite for frontend, esbuild for backend bundling
- **Type Safety**: TypeScript configuration for both client and server
- **Development**: Hot reloading, error overlays, and debugging tools

## Deployment Strategy

### Environment Configuration
- **Development**: Local development with Vite dev server and TSX
- **Production**: Built assets served statically with Express backend
- **Database**: Neon PostgreSQL with environment-based connection strings
- **API Keys**: Environment variables for OpenAI and other services

### Build Process
1. **Frontend Build**: Vite builds React app to static assets
2. **Backend Build**: esbuild bundles Node.js server with dependencies
3. **Database Setup**: Drizzle migrations ensure schema consistency
4. **Asset Optimization**: Static file serving with proper caching headers

### Scalability Considerations
- **Database**: Serverless PostgreSQL for automatic scaling
- **API Design**: RESTful structure ready for microservices migration
- **Caching**: Query caching and static asset optimization
- **Media Storage**: Prepared for CDN integration for generated content

## Recent Updates (July 31, 2025)

### Enhanced User Experience
- ✓ Complete rebranding from "Remixz" to "Feels" across all interfaces
- ✓ Added comprehensive Settings page with logout functionality  
- ✓ Fixed content overflow issues with responsive text containers
- ✓ Enhanced VibeCreator with interactive mood selection and voice recording
- ✓ Added animated analysis states and quick action prompts
- ✓ Improved mobile responsiveness with proper text sizing

### New Interactive Components
- **MoodSelector**: Visual mood picker with gradient colors and selection limits
- **VoiceRecorder**: Full-featured audio recording with playback controls
- **AnalyzingAnimation**: Engaging loading states with brain analysis visualization
- **QuickActions**: Pre-made vibe prompts for instant content creation

## Future Enhancements

The codebase includes placeholders and architecture for advanced features:
- Voice-to-text analysis integration with OpenAI Whisper
- Duets and remixes functionality  
- AR/AI filters and live streaming
- Group communities and interest-based feeds
- Gamification with badges and streaks
- Creator monetization and social commerce
- Advanced analytics and content moderation