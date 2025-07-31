import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Hash, 
  Copy, 
  RefreshCw, 
  Flame, 
  Target,
  Zap,
  Crown
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Challenge {
  id: string;
  title: string;
  description: string;
  hashtags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  trend_score: number;
}

interface ViralChallengeGeneratorProps {
  onChallengeSelect?: (challenge: Challenge) => void;
}

export default function ViralChallengeGenerator({ onChallengeSelect }: ViralChallengeGeneratorProps) {
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  // Trending challenge templates based on current social media trends
  const challengeTemplates = [
    {
      category: "dance",
      templates: [
        {
          title: "15-Second Vibe Check",
          description: "show ur current mood in exactly 15 seconds of pure energy",
          baseHashtags: ["#vibecheck", "#15secondchallenge", "#moodreveal"],
          difficulty: 'easy' as const
        },
        {
          title: "Transition Tuesday",
          description: "outfit change that'll make everyone's jaw drop",
          baseHashtags: ["#transitiontuesday", "#outfitchange", "#glowup"],
          difficulty: 'medium' as const
        },
        {
          title: "Duo Sync Challenge",
          description: "perfectly synced moves with ur bestie - no words needed",
          baseHashtags: ["#duosync", "#bestiegoals", "#synchronize"],
          difficulty: 'hard' as const
        }
      ]
    },
    {
      category: "lifestyle",
      templates: [
        {
          title: "That Girl Morning",
          description: "aesthetic morning routine that screams main character energy",
          baseHashtags: ["#thatgirl", "#morningvibes", "#maincharacter"],
          difficulty: 'easy' as const
        },
        {
          title: "Room Makeover Magic",
          description: "transform ur space from basic to absolutely iconic",
          baseHashtags: ["#roommakeover", "#decorinspo", "#aesthetic"],
          difficulty: 'medium' as const
        },
        {
          title: "Week in My Life",
          description: "document 7 days of living ur best life with style",
          baseHashtags: ["#weekinmylife", "#lifestyle", "#dayinthelife"],
          difficulty: 'medium' as const
        }
      ]
    },
    {
      category: "comedy",
      templates: [
        {
          title: "POV Challenge",
          description: "act out the most relatable scenario ever - bonus points for accuracy",
          baseHashtags: ["#pov", "#relatable", "#acting"],
          difficulty: 'easy' as const
        },
        {
          title: "Text to Speech Comedy",
          description: "let the robot voice tell ur story while u act it out dramatically",
          baseHashtags: ["#texttospeech", "#comedy", "#storytelling"],
          difficulty: 'medium' as const
        },
        {
          title: "Expectation vs Reality",
          description: "show the hilarious truth behind those perfect moments",
          baseHashtags: ["#expectationvsreality", "#reality", "#honest"],
          difficulty: 'easy' as const
        }
      ]
    },
    {
      category: "creative",
      templates: [
        {
          title: "Art Transformation",
          description: "turn something ordinary into a masterpiece before our eyes",
          baseHashtags: ["#arttransformation", "#creative", "#satisfying"],
          difficulty: 'hard' as const
        },
        {
          title: "DIY Hack Life",
          description: "mind-blowing life hack that everyone needs to know",
          baseHashtags: ["#diyhack", "#lifehack", "#genius"],
          difficulty: 'medium' as const
        },
        {
          title: "Speed Art Challenge",
          description: "create something amazing in under 60 seconds",
          baseHashtags: ["#speedart", "#timelapse", "#artistic"],
          difficulty: 'hard' as const
        }
      ]
    },
    {
      category: "fitness",
      templates: [
        {
          title: "Core Burn 30",
          description: "30 seconds of abs workout that actually works (and hurts)",
          baseHashtags: ["#coreburn", "#absworkout", "#fitness"],
          difficulty: 'medium' as const
        },
        {
          title: "Flexibility Test",
          description: "see how flexible u really are with these simple moves",
          baseHashtags: ["#flexibilitytest", "#stretch", "#mobility"],
          difficulty: 'easy' as const
        },
        {
          title: "Workout Outfit Check",
          description: "rate the fit while breaking a sweat - style meets gains",
          baseHashtags: ["#workoutfit", "#gymstyle", "#activewear"],
          difficulty: 'easy' as const
        }
      ]
    }
  ];

  // Trending hashtags that are currently popular
  const trendingHashtags = [
    "#fyp", "#viral", "#trending", "#foryou", "#xyzbca",
    "#aesthetic", "#vibe", "#mood", "#energy", "#iconic",
    "#slay", "#periodt", "#facts", "#realtalk", "#lowkey",
    "#highkey", "#nofr", "#literally", "#bestie", "#queen",
    "#king", "#legend", "#goat", "#fire", "#slaps",
    "#hits", "#different", "#understood", "#assignment", "#serve"
  ];

  const generateChallenge = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      // Randomly select category and template
      const category = challengeTemplates[Math.floor(Math.random() * challengeTemplates.length)];
      const template = category.templates[Math.floor(Math.random() * category.templates.length)];
      
      // Add trending hashtags
      const extraHashtags = trendingHashtags
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 5) + 3);
      
      const challenge: Challenge = {
        id: Date.now().toString(),
        title: template.title,
        description: template.description,
        hashtags: [...template.baseHashtags, ...extraHashtags],
        difficulty: template.difficulty,
        category: category.category,
        trend_score: Math.floor(Math.random() * 30) + 70 // 70-100% trend score
      };
      
      setCurrentChallenge(challenge);
      setIsGenerating(false);
      
      toast({
        title: "Challenge Generated! 🔥",
        description: "this one's about to go viral fr",
      });
    }, 1500);
  };

  const copyHashtags = () => {
    if (!currentChallenge) return;
    
    const hashtagText = currentChallenge.hashtags.join(' ');
    navigator.clipboard.writeText(hashtagText);
    
    toast({
      title: "Hashtags Copied! 📋",
      description: "ready to paste and go viral",
    });
  };

  const copyFullChallenge = () => {
    if (!currentChallenge) return;
    
    const challengeText = `${currentChallenge.title}
    
${currentChallenge.description}

${currentChallenge.hashtags.join(' ')}`;
    
    navigator.clipboard.writeText(challengeText);
    
    toast({
      title: "Challenge Copied! ✨",
      description: "ur viral moment awaits",
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'dance': return '💃';
      case 'lifestyle': return '✨';
      case 'comedy': return '😂';
      case 'creative': return '🎨';
      case 'fitness': return '💪';
      default: return '🔥';
    }
  };

  return (
    <Card className="bg-semi-dark border-gray-700">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'hsl(262, 70%, 65%)' }}>Viral Challenge Generator 🔥</h3>
          <p style={{ color: 'hsl(262, 60%, 55%)' }}>get the next trending challenge before everyone else</p>
        </div>

        {!currentChallenge ? (
          <Button 
            onClick={generateChallenge}
            disabled={isGenerating}
            className="w-full gradient-bg text-white py-4 text-lg font-semibold rounded-xl"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                cooking up something viral...
              </>
            ) : (
              <>
                <Flame className="w-5 h-5 mr-2" />
                generate viral challenge
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-4">
            {/* Challenge Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getCategoryIcon(currentChallenge.category)}</span>
                <Badge 
                  className={`${getDifficultyColor(currentChallenge.difficulty)} text-white`}
                >
                  {currentChallenge.difficulty}
                </Badge>
                <Badge variant="outline" className="text-primary border-primary">
                  {currentChallenge.category}
                </Badge>
              </div>
              <div className="flex items-center space-x-1">
                <Target className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-semibold text-orange-500">
                  {currentChallenge.trend_score}% viral potential
                </span>
              </div>
            </div>

            {/* Challenge Content */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="text-xl font-bold text-white mb-2">
                {currentChallenge.title}
              </h4>
              <p className="text-gray-300 mb-4">
                {currentChallenge.description}
              </p>
              
              {/* Hashtags */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Hash className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-white">trending hashtags</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyHashtags}
                    className="text-xs"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    copy
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {currentChallenge.hashtags.map((tag, index) => (
                    <Badge 
                      key={index}
                      variant="secondary" 
                      className="text-xs bg-primary/20 text-primary"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={generateChallenge}
                variant="outline"
                className="flex items-center justify-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                new challenge
              </Button>
              <Button 
                onClick={copyFullChallenge}
                className="gradient-bg text-white"
              >
                <Copy className="w-4 h-4 mr-2" />
                copy & create
              </Button>
            </div>

            {onChallengeSelect && (
              <Button 
                onClick={() => onChallengeSelect(currentChallenge)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3"
              >
                <Crown className="w-4 h-4 mr-2" />
                use this challenge ✨
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}