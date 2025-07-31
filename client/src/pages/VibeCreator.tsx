import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { ArrowLeft, Camera, Mic, Keyboard, Image, Video, Quote, Sparkles, Zap, TrendingUp, Share2, ExternalLink } from "lucide-react";
import { SiWhatsapp, SiInstagram } from "react-icons/si";
import MoodSelector from "@/components/MoodSelector";
import VoiceRecorder from "@/components/VoiceRecorder";
import AnalyzingAnimation from "@/components/AnalyzingAnimation";
import QuickActions from "@/components/QuickActions";
import ARStickerCreator from "@/components/ARStickerCreator";
import ViralChallengeGenerator from "@/components/ViralChallengeGenerator";

interface VibeResult {
  emotion: string;
  mood: string;
  confidence: number;
  intensity: number;
}

interface MemeResult {
  imageUrl: string;
  caption: string;
  prompt: string;
}

export default function VibeCreator() {
  const [, setLocation] = useLocation();
  const [inputType, setInputType] = useState<"text" | "voice" | "image">("text");
  const [textInput, setTextInput] = useState("");
  const [selectedMoods, setSelectedMoods] = useState<string[]>(["happy"]);
  const [contentStyle, setContentStyle] = useState("meme");
  const [vibeResult, setVibeResult] = useState<VibeResult | null>(null);
  const [memeResult, setMemeResult] = useState<MemeResult | null>(null);
  const [step, setStep] = useState(1); // 1: input, 2: analysis, 3: result
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showARCreator, setShowARCreator] = useState(false);
  const [showChallengeGenerator, setShowChallengeGenerator] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const moods = [
    { id: "happy", emoji: "😊", label: "Happy", color: "from-yellow-400 to-orange-400" },
    { id: "chill", emoji: "😴", label: "Chill", color: "from-blue-400 to-cyan-400" },
    { id: "excited", emoji: "🔥", label: "Excited", color: "from-red-400 to-pink-400" },
    { id: "motivated", emoji: "💪", label: "Motivated", color: "from-green-400 to-emerald-400" },
    { id: "thoughtful", emoji: "🤔", label: "Thoughtful", color: "from-purple-400 to-indigo-400" },
    { id: "funny", emoji: "😂", label: "Funny", color: "from-pink-400 to-rose-400" },
    { id: "sad", emoji: "😢", label: "Sad", color: "from-gray-400 to-slate-400" },
    { id: "angry", emoji: "😠", label: "Angry", color: "from-red-500 to-orange-500" },
  ];

  const analyzeTextMutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await apiRequest("POST", "/api/vibe/analyze-text", { text });
      return response.json();
    },
    onSuccess: (data) => {
      setVibeResult(data);
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        setStep(2);
      }, 2000); // Add dramatic pause for analysis
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const analyzeImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("image", file);
      const response = await fetch("/api/vibe/analyze-image", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to analyze image");
      return response.json();
    },
    onSuccess: (data) => {
      setVibeResult(data);
      setStep(2);
    },
    onError: (error) => {
      toast({
        title: "Image Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const generateContentMutation = useMutation({
    mutationFn: async (data: VibeResult & { userText: string; style: string }) => {
      const response = await apiRequest("POST", "/api/vibe/generate-meme", {
        emotion: data.emotion,
        mood: data.mood,
        userText: data.userText,
        style: data.style,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setMemeResult(data);
      setStep(3);
    },
    onError: (error) => {
      toast({
        title: "Content Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (postData: any) => {
      const response = await apiRequest("POST", "/api/posts", postData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Posted Successfully!",
        description: "Your vibe has been shared to your feed",
      });
      setLocation("/");
    },
    onError: (error) => {
      toast({
        title: "Post Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = () => {
    if (inputType === "text") {
      if (!textInput.trim()) {
        toast({
          title: "Tell us your vibe!",
          description: "Please enter how you're feeling",
          variant: "destructive",
        });
        return;
      }
      analyzeTextMutation.mutate(textInput);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      analyzeImageMutation.mutate(file);
    }
  };

  const handleGenerate = () => {
    if (vibeResult) {
      generateContentMutation.mutate({
        ...vibeResult,
        userText: textInput,
        style: contentStyle,
      });
    }
  };

  const handlePost = () => {
    if (memeResult && vibeResult) {
      createPostMutation.mutate({
        content: textInput,
        aiPrompt: memeResult.prompt,
        mediaUrl: memeResult.imageUrl,
        mediaType: "image",
        detectedEmotion: vibeResult.emotion,
        mood: vibeResult.mood,
        caption: memeResult.caption,
        isStory: false,
      });
    }
  };

  const toggleMood = (moodId: string) => {
    setSelectedMoods(prev => 
      prev.includes(moodId) 
        ? prev.filter(id => id !== moodId)
        : [...prev, moodId]
    );
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <div className="max-w-sm mx-auto overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 pt-8 bg-semi-dark">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/")}
            className="text-white p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">Create Vibe</h1>
          <div className="w-9"></div>
        </div>

        {/* Step 1: Input */}
        {step === 1 && (
          <div className="p-4 space-y-6">
            {/* AI Prompt Input */}
            <Card className="bg-semi-dark border-gray-700">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 flex items-center text-white">
                  <span className="text-primary mr-2">🧠</span>
                  Tell AI Your Vibe
                </h3>
                <Textarea
                  placeholder="Describe how you're feeling or what you want to create..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white resize-none"
                  rows={4}
                />
              </CardContent>
            </Card>

            {/* Quick Actions for text input */}
            {inputType === "text" && !textInput && (
              <QuickActions 
                onActionSelect={(prompt) => setTextInput(prompt)}
              />
            )}

            {/* Input Method Selection */}
            <Card className="bg-semi-dark border-gray-700">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 text-white">How do you want to express yourself?</h3>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant={inputType === "text" ? "default" : "outline"}
                    onClick={() => setInputType("text")}
                    className={`p-3 flex flex-col items-center justify-center space-y-1 ${
                      inputType === "text" 
                        ? "gradient-bg text-white" 
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    } max-w-full overflow-hidden min-h-[80px]`}
                  >
                    <Keyboard className="w-6 h-6" />
                    <span className="text-xs">Type</span>
                  </Button>
                  <Button
                    variant={inputType === "voice" ? "default" : "outline"}
                    onClick={() => setInputType("voice")}
                    className={`p-3 flex flex-col items-center justify-center space-y-1 ${
                      inputType === "voice" 
                        ? "gradient-bg text-white" 
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    } max-w-full overflow-hidden min-h-[80px]`}
                  >
                    <Mic className="w-6 h-6" />
                    <span className="text-xs">Voice</span>
                  </Button>
                  <Button
                    variant={inputType === "image" ? "default" : "outline"}
                    onClick={() => {
                      setInputType("image");
                      fileInputRef.current?.click();
                    }}
                    className={`p-3 flex flex-col items-center justify-center space-y-1 ${
                      inputType === "image" 
                        ? "gradient-bg text-white" 
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    } max-w-full overflow-hidden min-h-[80px]`}
                  >
                    <Camera className="w-6 h-6" />
                    <span className="text-xs">Photo</span>
                  </Button>
                </div>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </CardContent>
            </Card>

            {/* Content Style */}
            <Card className="bg-semi-dark border-gray-700">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 text-white">Content Style</h3>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant={contentStyle === "meme" ? "default" : "outline"}
                    onClick={() => setContentStyle("meme")}
                    className={`p-3 flex flex-col items-center justify-center space-y-1 ${
                      contentStyle === "meme" 
                        ? "gradient-bg text-white" 
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    } max-w-full overflow-hidden min-h-[80px]`}
                  >
                    <Image className="w-6 h-6" />
                    <span className="text-xs">Meme</span>
                  </Button>
                  <Button
                    variant="outline"
                    disabled
                    className="p-3 flex flex-col items-center justify-center space-y-1 bg-gray-800 text-gray-500 cursor-not-allowed max-w-full overflow-hidden min-h-[80px]"
                  >
                    <Video className="w-6 h-6" />
                    <span className="text-xs">Video</span>
                  </Button>
                  <Button
                    variant="outline"
                    disabled
                    className="p-3 flex flex-col items-center justify-center space-y-1 bg-gray-800 text-gray-500 cursor-not-allowed max-w-full overflow-hidden min-h-[80px]"
                  >
                    <Quote className="w-6 h-6" />
                    <span className="text-xs">Quote</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Mood Selection */}
            <MoodSelector
              moods={moods}
              selectedMoods={selectedMoods}
              onMoodChange={setSelectedMoods}
              maxSelection={3}
            />

            {/* Voice Recording Interface */}
            {inputType === "voice" && (
              <VoiceRecorder 
                onRecordingComplete={(blob) => {
                  console.log("Voice recorded:", blob);
                  toast({
                    title: "Voice Recorded!",
                    description: "Your audio is ready for analysis",
                  });
                }}
                maxDuration={30}
              />
            )}

            {/* Creative Tools Section */}
            <Card className="bg-semi-dark border-gray-700">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 text-white">creative tools ✨</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => setShowARCreator(!showARCreator)}
                    className={`p-4 flex flex-col items-center space-y-2 rounded-xl transition-all ${
                      showARCreator 
                        ? "gradient-bg text-white shadow-lg" 
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <Sparkles className="w-6 h-6" />
                    <div className="text-center">
                      <div className="text-xs font-semibold">AR Stickers</div>
                      <div className="text-xs opacity-80">camera effects</div>
                    </div>
                  </Button>
                  <Button
                    onClick={() => setShowChallengeGenerator(!showChallengeGenerator)}
                    className={`p-4 flex flex-col items-center space-y-2 rounded-xl transition-all ${
                      showChallengeGenerator 
                        ? "gradient-bg text-white shadow-lg" 
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <TrendingUp className="w-6 h-6" />
                    <div className="text-center">
                      <div className="text-xs font-semibold">Viral Challenges</div>
                      <div className="text-xs opacity-80">trending ideas</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* AR Sticker Creator */}
            {showARCreator && (
              <ARStickerCreator 
                onStickerComplete={(imageData) => {
                  toast({
                    title: "AR Sticker Ready! ✨",
                    description: "ur custom AR creation is fire",
                  });
                  setShowARCreator(false);
                }}
              />
            )}

            {/* Viral Challenge Generator */}
            {showChallengeGenerator && (
              <ViralChallengeGenerator 
                onChallengeSelect={(challenge) => {
                  setTextInput(challenge.description);
                  setShowChallengeGenerator(false);
                  toast({
                    title: "Challenge Selected! 🔥",
                    description: `ready to create: ${challenge.title}`,
                  });
                }}
              />
            )}

            {/* Generate Button */}
            <Button
              onClick={handleAnalyze}
              disabled={analyzeTextMutation.isPending || analyzeImageMutation.isPending}
              className="w-full gradient-bg text-white py-4 rounded-2xl font-semibold text-lg"
            >
              {(analyzeTextMutation.isPending || analyzeImageMutation.isPending) ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Analyzing Your Vibe...
                </>
              ) : (
                <>
                  <span className="mr-2">✨</span>
                  Analyze My Vibe
                </>
              )}
            </Button>
          </div>
        )}

        {/* Analyzing Animation */}
        {isAnalyzing && (
          <div className="p-4">
            <AnalyzingAnimation message="AI is analyzing your vibe..." />
          </div>
        )}

        {/* Step 2: Analysis Results */}
        {step === 2 && vibeResult && !isAnalyzing && (
          <div className="p-4 space-y-6">
            <Card className="bg-semi-dark border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Your Vibe Analysis</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                    <span className="text-gray-400">Emotion</span>
                    <span className="text-primary font-semibold capitalize">{vibeResult.emotion}</span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                    <span className="text-gray-400">Mood</span>
                    <span className="text-secondary font-semibold capitalize">{vibeResult.mood}</span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                    <span className="text-gray-400">Confidence</span>
                    <span className="text-neon-green font-semibold">{Math.round(vibeResult.confidence * 100)}%</span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                    <span className="text-gray-400">Intensity</span>
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < vibeResult.intensity ? "bg-primary" : "bg-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-primary font-semibold">{vibeResult.intensity}/10</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={generateContentMutation.isPending}
                  className="w-full gradient-bg text-white py-3 rounded-xl font-semibold"
                >
                  {generateContentMutation.isPending ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Creating Your Content...
                    </>
                  ) : (
                    "Generate My Content 🎨"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Generated Content */}
        {step === 3 && memeResult && (
          <div className="p-4 space-y-6">
            <Card className="bg-semi-dark border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4 text-center">ur vibe is ready! ✨</h3>
                
                <div className="relative rounded-xl overflow-hidden mb-4 shadow-2xl">
                  <img 
                    src={memeResult.imageUrl} 
                    alt="Generated content" 
                    className="w-full aspect-square object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20"></div>
                  
                  {/* Enhanced Caption Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                      <p className="text-white font-bold text-lg text-center leading-tight">
                        {memeResult.caption}
                      </p>
                    </div>
                  </div>
                  
                  {/* AI Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 rounded-full text-white text-xs font-semibold flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>AI Generated</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handlePost}
                    disabled={createPostMutation.isPending}
                    className="w-full gradient-bg text-white py-4 rounded-xl font-semibold text-lg"
                  >
                    {createPostMutation.isPending ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        posting to feed...
                      </>
                    ) : (
                      <>
                        <Share2 className="w-5 h-5 mr-2" />
                        share to feels feed
                      </>
                    )}
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={() => {
                        const shareText = `Check out my AI vibe: ${memeResult.caption}`;
                        const shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
                        window.open(shareUrl, '_blank');
                      }}
                      variant="outline"
                      className="bg-green-500 hover:bg-green-600 text-white border-green-500 flex items-center justify-center"
                    >
                      <SiWhatsapp className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(`Check out my AI vibe: ${memeResult.caption}`);
                        toast({
                          title: "Copied!",
                          description: "paste this in ur instagram story",
                        });
                      }}
                      variant="outline"
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-purple-500 flex items-center justify-center"
                    >
                      <SiInstagram className="w-4 h-4 mr-2" />
                      Instagram
                    </Button>
                  </div>

                  {/* Download Button */}
                  <Button
                    variant="outline"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = memeResult.imageUrl;
                      link.download = 'my-vibe.png';
                      link.click();
                    }}
                    className="w-full bg-gray-800 hover:bg-gray-700 border-gray-600 text-white py-3 rounded-xl"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    download image
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => {
                      setStep(1);
                      setVibeResult(null);
                      setMemeResult(null);
                      setTextInput("");
                    }}
                    className="w-full text-gray-400 hover:text-white py-3"
                  >
                    create another vibe ✨
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
