# Feels API Setup Guide 🚀

Welcome to Feels! This guide will help you set up all the API keys and services needed to power your AI social media app.

## Required API Keys

### OpenAI API Key (Required for Core Features)
Your Feels app uses OpenAI for:
- 🎭 Emotion detection from text, voice, and images
- 🤖 AI meme and content generation
- 🛡️ Content moderation for safety

**How to get your OpenAI API Key:**
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in to your account
3. Click "Create new secret key"
4. Give it a name like "Feels App"
5. Copy the key (starts with "sk-...")

**Cost Information:**
- OpenAI charges per API usage
- Typical costs: $0.01-0.06 per image generation
- Text analysis: $0.0015 per 1000 tokens
- Budget tip: Set usage limits in OpenAI dashboard

**Adding to Feels:**
- In Replit: Go to Secrets tab → Add `OPENAI_API_KEY` → Paste your key
- Your app will automatically detect and use it

## Current Service Status ✅

### Active Integrations
- ✅ **OpenAI GPT-4o** - Emotion analysis and content generation
- ✅ **PostgreSQL Database** - User data and content storage  
- ✅ **Replit Auth** - User authentication (no setup needed)

## Future Integrations (Placeholders Ready) 🔮

Your Feels app is architected to easily add these features:

### Social Features
- **Instagram Integration** - Auto-share generated content
- **TikTok API** - Direct video uploads
- **Twitter API** - Tweet your memes instantly
- **Discord Bot** - Share in communities

### AR & Advanced Features  
- **Lens Studio** - Custom AR filters
- **MediaPipe** - Real-time face/hand tracking
- **WebRTC** - Live streaming capabilities
- **FFmpeg** - Advanced video processing

### Monetization Ready
- **Stripe** - Creator monetization and tips
- **PayPal** - Alternative payment processing
- **Shopify** - Merchandise integration
- **Patreon API** - Subscription management

### Analytics & Growth
- **Google Analytics** - User behavior tracking
- **Mixpanel** - Advanced event analytics
- **Twilio** - SMS notifications for viral content
- **SendGrid** - Email marketing campaigns

## Adding New APIs Later

When you're ready to add more features:

1. **Get API credentials** from the service provider
2. **Add to Replit Secrets** using the pattern: `SERVICE_NAME_API_KEY`
3. **Update environment variables** in your code
4. **Enable features** by uncommenting placeholder code

## Security Best Practices 🔒

- ✅ All API keys stored in Replit Secrets (never in code)
- ✅ Environment variables auto-loaded securely
- ✅ Database credentials managed by Replit
- ✅ HTTPS enabled by default

## Cost Management 💰

**OpenAI Usage Tips:**
- Set monthly spending limits in OpenAI dashboard
- Monitor usage in OpenAI → Usage section
- Start with $10-20/month limit for testing
- Scale up as your user base grows

**Free Tier Info:**
- New OpenAI accounts get $5 free credit
- Replit Auth is completely free
- PostgreSQL included with Replit subscription

## Troubleshooting 🛠️

**"API Key Invalid" Error:**
1. Check key starts with "sk-"
2. Ensure no extra spaces in Replit Secrets
3. Restart your app after adding new keys

**"Rate Limit" Error:**
1. You've hit OpenAI's usage limits
2. Wait a few minutes or upgrade OpenAI plan
3. Check OpenAI dashboard for current limits

**Database Issues:**
1. Database auto-configured by Replit
2. Check workflow logs for specific errors
3. Run `npm run db:push` to sync schema

## Getting Help 💬

- **OpenAI Issues**: Check [OpenAI Status](https://status.openai.com)
- **Replit Issues**: Use Replit support chat
- **App Bugs**: Check browser console for errors

---

🎉 **You're all set!** Your Feels app is ready to transform vibes into viral content. Happy creating!