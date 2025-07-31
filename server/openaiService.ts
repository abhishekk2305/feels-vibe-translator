import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

export interface EmotionAnalysis {
  emotion: string;
  confidence: number;
  mood: string;
  intensity: number;
}

export interface MemeGenerationRequest {
  emotion: string;
  mood: string;
  userText: string;
  style?: string;
}

export interface MemeResult {
  imageUrl: string;
  caption: string;
  prompt: string;
}

export class OpenAIService {
  async analyzeTextEmotion(text: string): Promise<EmotionAnalysis> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an emotion analysis expert for a Gen Z social media app. Analyze the emotion, mood, and intensity from text input. Return JSON with: 
            - emotion: primary emotion (happy, sad, excited, angry, anxious, chill, motivated, funny, confused, grateful)
            - confidence: 0-1 confidence score
            - mood: overall mood description (1-2 words, Gen Z friendly)
            - intensity: 1-10 scale of emotional intensity`,
          },
          {
            role: "user",
            content: text,
          },
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      return {
        emotion: result.emotion || "neutral",
        confidence: Math.max(0, Math.min(1, result.confidence || 0.5)),
        mood: result.mood || "vibing",
        intensity: Math.max(1, Math.min(10, result.intensity || 5)),
      };
    } catch (error) {
      throw new Error("Failed to analyze emotion: " + (error as Error).message);
    }
  }

  async analyzeImageEmotion(base64Image: string): Promise<EmotionAnalysis> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `Analyze the emotion and mood from this image (likely a selfie). Focus on facial expressions, body language, and overall vibe. Return JSON with emotion, confidence, mood, and intensity fields.`,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze the emotion and mood in this image.",
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        response_format: { type: "json_object" },
        max_tokens: 300,
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      return {
        emotion: result.emotion || "neutral",
        confidence: Math.max(0, Math.min(1, result.confidence || 0.5)),
        mood: result.mood || "vibing",
        intensity: Math.max(1, Math.min(10, result.intensity || 5)),
      };
    } catch (error) {
      throw new Error("Failed to analyze image emotion: " + (error as Error).message);
    }
  }

  async transcribeAudio(audioBuffer: Buffer): Promise<string> {
    try {
      // Create a temporary file-like object for OpenAI
      const audioFile = new File([audioBuffer], "audio.webm", { type: "audio/webm" });
      
      const transcription = await openai.audio.transcriptions.create({
        file: audioFile as any,
        model: "whisper-1",
      });

      return transcription.text;
    } catch (error) {
      throw new Error("Failed to transcribe audio: " + (error as Error).message);
    }
  }

  async generateMeme(request: MemeGenerationRequest): Promise<MemeResult> {
    try {
      // Generate meme prompt based on emotion and user input
      const promptResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a professional viral content creator specializing in high-quality social media visuals. Create engaging, shareable content based on the user's emotion and text. The content should be:
            - Premium quality and Instagram-worthy
            - Authentic and relatable to Gen Z
            - Emotionally resonant and shareable
            - Motivational or inspirational when appropriate
            - Safe for all social media platforms
            - Professional yet trendy aesthetic
            Return JSON with 'imagePrompt' (detailed description for high-quality DALL-E image) and 'caption' (engaging social media caption with emojis and hashtags)`,
          },
          {
            role: "user",
            content: `Emotion: ${request.emotion}, Mood: ${request.mood}, User said: "${request.userText}", Style: ${request.style || 'meme'}`,
          },
        ],
        response_format: { type: "json_object" },
      });

      const memeContent = JSON.parse(promptResponse.choices[0].message.content || "{}");
      
      // Generate the actual image with enhanced quality
      const enhancedPrompt = `Create a high-quality, professional social media image: ${memeContent.imagePrompt}. 

Style requirements:
- Premium digital art quality, HD resolution
- Instagram-worthy aesthetic with modern typography
- Vibrant colors and cinematic lighting
- Clean, polished design suitable for viral sharing
- Professional meme/quote format with clear text overlay
- Trendy Gen Z visual style with artistic composition
- Eye-catching and share-worthy appearance
- High production value, not amateur-looking`;

      const imageResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: enhancedPrompt,
        n: 1,
        size: "1024x1024",
        quality: "hd", // Use HD quality for better results
      });

      return {
        imageUrl: imageResponse.data?.[0]?.url || "",
        caption: memeContent.caption || "When you're feeling it! 💯",
        prompt: memeContent.imagePrompt || "",
      };
    } catch (error) {
      throw new Error("Failed to generate meme: " + (error as Error).message);
    }
  }

  async moderateContent(content: string): Promise<{ safe: boolean; flagged: boolean; categories: string[] }> {
    try {
      const moderation = await openai.moderations.create({
        input: content,
      });

      const result = moderation.results[0];
      const flaggedCategories = Object.entries(result.categories)
        .filter(([_, flagged]) => flagged)
        .map(([category]) => category);

      return {
        safe: !result.flagged,
        flagged: result.flagged,
        categories: flaggedCategories,
      };
    } catch (error) {
      throw new Error("Failed to moderate content: " + (error as Error).message);
    }
  }

  async moderateImage(base64Image: string): Promise<{ safe: boolean; description: string }> {
    try {
      // Use vision to analyze image content for safety
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Analyze this image for content safety. Check for inappropriate content, harmful material, or anything that violates social media guidelines. Return JSON with 'safe' (boolean) and 'description' (brief explanation).",
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Is this image safe for a social media platform?",
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        response_format: { type: "json_object" },
        max_tokens: 200,
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      return {
        safe: result.safe !== false, // Default to safe if unclear
        description: result.description || "Content analyzed",
      };
    } catch (error) {
      throw new Error("Failed to moderate image: " + (error as Error).message);
    }
  }
}

export const openaiService = new OpenAIService();
