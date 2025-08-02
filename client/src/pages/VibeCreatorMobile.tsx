import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { ArrowLeft, Sparkles, Zap, ChevronDown, ChevronUp, Info, Download, Copy } from "lucide-react";
import CopyButton from "@/components/CopyButton";
import DownloadButton from "@/components/DownloadButton";

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

interface VibePreset {
  id: string;
  emoji: string;
  label: string;
  color: string;
}

export default function VibeCreatorMobile() {
  const [, setLocation] = useLocation();
  const [textInput, setTextInput] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<string>("happy");
  const [vibeResult, setVibeResult] = useState<VibeResult | null>(null);
  const [memeResult, setMemeResult] = useState<MemeResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { toast } = useToast();

  // Compact preset options for mobile carousel
  const vibePresets: VibePreset[] = [
    { id: "happy", emoji: "😊", label: "Happy", color: "from-yellow-400 to-orange-400" },
    { id: "excited", emoji: "🔥", label: "Excited", color: "from-red-400 to-pink-400" },
    { id: "chill", emoji: "😌", label: "Chill", color: "from-blue-400 to-cyan-400" },
    { id: "motivated", emoji: "💪", label: "Motivated", color: "from-green-400 to-emerald-400" },
    { id: "creative", emoji: "🎨", label: "Creative", color: "from-purple-400 to-indigo-400" },
    { id: "funny", emoji: "😂", label: "Funny", color: "from-pink-400 to-rose-400" },
    { id: "sad", emoji: "😢", label: "Sad", color: "from-gray-400 to-slate-400" },
    { id: "confident", emoji: "😎", label: "Confident", color: "from-orange-400 to-yellow-400" },
  ];

  const analyzeTextMutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await apiRequest("POST", "/api/vibe/analyze-text", { text });
      return response.json();
    },
    onSuccess: (data) => {
      setVibeResult(data);
      setIsAnalyzing(false);
    },
    onError: (error) => {
      toast({
        title: "Analysis failed",
        description: "Please try again",
        variant: "destructive",
      });
      setIsAnalyzing(false);
    },
  });

  const generateContentMutation = useMutation({
    mutationFn: async () => {
      if (!vibeResult) throw new Error("No vibe result");
      const response = await apiRequest("POST", "/api/vibe/generate-meme", {
        emotion: vibeResult.emotion,
        mood: vibeResult.mood,
        originalText: textInput,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setMemeResult(data);
      setIsGenerating(false);
    },
    onError: (error) => {
      toast({
        title: "Generation failed",
        description: "Please try again",
        variant: "destructive",
      });
      setIsGenerating(false);
    },
  });

  const handleAnalyze = async () => {
    const finalText = textInput.trim() || `I'm feeling ${selectedPreset}`;
    
    if (!finalText) {
      toast({
        title: "Tell us your vibe!",
        description: "Type something or select a preset",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    analyzeTextMutation.mutate(finalText);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    generateContentMutation.mutate();
  };

  const handleReset = () => {
    setTextInput("");
    setSelectedPreset("happy");
    setVibeResult(null);
    setMemeResult(null);
    setIsAnalyzing(false);
    setIsGenerating(false);
    setShowAdvanced(false);
  };

  const scrollToPreset = (index: number) => {
    const container = scrollRef.current;
    if (container) {
      const itemWidth = 120; // Approximate width of each preset pill
      container.scrollTo({
        left: index * itemWidth - container.clientWidth / 2,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background flex flex-col">
      {/* Fixed Header - Ultra Compact */}
      <div className="sticky top-0 z-50 bg-background/95 dark:bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-2 h-14">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/")}
            className="p-2 hover:bg-muted"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-bold text-lg font-poppins gradient-text">create vibe ✨</h1>
          <Button
            variant="ghost" 
            size="sm"
            onClick={() => setShowTips(!showTips)}
            className="p-2"
          >
            <Info className="w-4 h-4" />
          </Button>
        </div>

        {/* Collapsible Tips */}
        {showTips && (
          <div className="px-4 pb-3 bg-muted/50 dark:bg-muted/50 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Express your mood in text or choose a preset vibe below 💭
            </p>
          </div>
        )}
      </div>

      {/* Main Content Area - Optimized for 1-1.5 screens */}
      <div className="flex-1 flex flex-col px-4 py-3 space-y-4 max-w-md mx-auto w-full">
        
        {/* Horizontal Preset Carousel */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground dark:text-foreground">Quick vibes:</label>
          <div 
            ref={scrollRef}
            className="flex space-x-2 overflow-x-auto hide-scrollbar pb-2"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {vibePresets.map((preset, index) => (
              <button
                key={preset.id}
                onClick={() => {
                  setSelectedPreset(preset.id);
                  scrollToPreset(index);
                }}
                className={`flex-shrink-0 px-4 py-3 rounded-full border-2 transition-all duration-300 min-w-[110px] h-12 flex items-center justify-center space-x-2 ${
                  selectedPreset === preset.id
                    ? 'border-primary bg-primary text-white shadow-lg scale-105'
                    : 'border-border bg-background hover:border-primary/50 hover:bg-muted text-foreground'
                }`}
                style={{ scrollSnapAlign: 'center' }}
              >
                <span className="text-lg">{preset.emoji}</span>
                <span className="text-sm font-medium font-poppins">{preset.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Text Input - Auto-expanding */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground dark:text-foreground">Or describe your vibe:</label>
          <Textarea
            placeholder="what's ur vibe rn? feeling excited, stressed, creative..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            className="min-h-[80px] max-h-[120px] bg-input dark:bg-input border-border text-foreground dark:text-foreground resize-none text-base font-poppins"
            rows={3}
          />
        </div>

        {/* Advanced Options - Collapsible */}
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-center space-x-2 h-10 text-muted-foreground"
          >
            <span className="text-sm">Advanced options</span>
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          
          {showAdvanced && (
            <div className="space-y-3 p-3 bg-muted/30 dark:bg-muted/30 rounded-lg border border-border">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-background dark:bg-background rounded border">
                  <span className="text-muted-foreground">Output:</span>
                  <p className="text-foreground font-medium">Meme + Image</p>
                </div>
                <div className="p-2 bg-background dark:bg-background rounded border">
                  <span className="text-muted-foreground">Style:</span>
                  <p className="text-foreground font-medium">Gen Z Viral</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Display - Compact */}
        {vibeResult && (
          <div className="bg-card dark:bg-card rounded-lg p-4 border border-border space-y-3">
            <h3 className="font-semibold text-lg text-foreground dark:text-foreground font-poppins flex items-center">
              Analysis complete! ✨
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-muted dark:bg-muted rounded p-2 text-center">
                <div className="text-muted-foreground text-xs">Emotion</div>
                <div className="font-bold text-primary font-poppins">{vibeResult.emotion}</div>
              </div>
              <div className="bg-muted dark:bg-muted rounded p-2 text-center">
                <div className="text-muted-foreground text-xs">Confidence</div>
                <div className="font-bold text-secondary font-poppins">{Math.round(vibeResult.confidence * 100)}%</div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <CopyButton 
                text={`Emotion: ${vibeResult.emotion}, Confidence: ${Math.round(vibeResult.confidence * 100)}%`}
                className="flex-1 h-10"
              />
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white h-10 font-poppins"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Generated Content */}
        {memeResult && (
          <div className="bg-card dark:bg-card rounded-lg p-4 border border-border space-y-3">
            <h3 className="font-semibold text-lg text-foreground dark:text-foreground font-poppins">Your viral content ✨</h3>
            <div className="bg-muted dark:bg-muted rounded-lg p-3">
              <img 
                src={memeResult.imageUrl} 
                alt="Generated content"
                className="w-full rounded-lg mb-2"
              />
              <p className="text-sm text-foreground dark:text-foreground font-medium">{memeResult.caption}</p>
            </div>
            
            <div className="flex space-x-2">
              <CopyButton text={memeResult.caption} className="flex-1 h-10" />
              <DownloadButton imageUrl={memeResult.imageUrl} className="flex-1 h-10" />
            </div>
          </div>
        )}

        {/* Spacer for sticky button */}
        <div className="h-20"></div>
      </div>

      {/* Sticky Bottom Action Button */}
      <div className="sticky bottom-0 left-0 right-0 bg-background/95 dark:bg-background/95 backdrop-blur-sm border-t border-border p-4">
        <div className="max-w-md mx-auto">
          {!vibeResult ? (
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full h-14 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl shadow-lg text-lg font-bold font-poppins"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Analyzing vibe...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Analyze my vibe ✨
                </>
              )}
            </Button>
          ) : (
            <div className="flex space-x-3">
              <Button
                onClick={handleReset}
                variant="outline"
                className="flex-1 h-14 border-2 border-primary text-primary hover:bg-primary hover:text-white font-poppins"
              >
                New vibe
              </Button>
              <Button
                onClick={() => setLocation("/")}
                className="flex-1 h-14 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-poppins"
              >
                Share to feed
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Loading Overlay */}
      {(isAnalyzing || isGenerating) && (
        <div className="fixed inset-0 bg-background/80 dark:bg-background/80 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="bg-card dark:bg-card rounded-lg p-6 border border-border shadow-xl">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-foreground dark:text-foreground font-medium font-poppins">
                {isAnalyzing ? "Analyzing your vibe..." : "Creating viral content..."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}