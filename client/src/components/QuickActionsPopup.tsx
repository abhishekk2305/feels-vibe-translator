import { Button } from "@/components/ui/button";

interface QuickActionsPopupProps {
  onActionSelect: (prompt: string) => void;
}

export default function QuickActionsPopup({ onActionSelect }: QuickActionsPopupProps) {
  console.log("QuickActionsPopup rendering with unique vibe starters");
  // VIBE STARTERS - These are different from mood selector!
  const quickActions = [
    { emoji: "🚀", label: "Hyped", prompt: "feeling so hyped and energetic right now, ready to take on anything!" },
    { emoji: "🌊", label: "Chill", prompt: "just vibing and feeling super chill, no stress just good vibes" },
    { emoji: "⚡", label: "Motivated", prompt: "feeling incredibly motivated and ready to crush my goals today" },
    { emoji: "🧠", label: "Thoughtful", prompt: "in a really thoughtful mood, contemplating life and deep stuff" },
    { emoji: "🎭", label: "Funny", prompt: "everything seems hilarious today, in such a goofy mood lol" },
    { emoji: "🙏", label: "Grateful", prompt: "feeling so grateful for all the good things in my life right now" },
    { emoji: "✨", label: "Creative", prompt: "my creative energy is through the roof, ideas flowing everywhere" },
    { emoji: "🕯️", label: "Peaceful", prompt: "feeling so peaceful and zen, everything is in perfect harmony" },
  ];

  return (
    <div className="bg-semi-dark border border-gray-600 rounded-2xl p-3 shadow-lg max-w-full">
      {/* Facebook-style horizontal scrolling row */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollBehavior: 'smooth' }}>
        {quickActions.map((action, index) => (
          <Button
            key={index}
            onClick={() => onActionSelect(action.prompt)}
            className="flex-shrink-0 w-16 h-16 rounded-full p-2 bg-gray-700 hover:bg-gray-600 text-gray-200 transition-all duration-200 transform hover:scale-110"
            variant="ghost"
          >
            <div className="flex flex-col items-center justify-center h-full">
              <span className="text-lg mb-0.5">{action.emoji}</span>
              <span className="text-xs font-medium leading-none text-center">{action.label}</span>
            </div>
          </Button>
        ))}
      </div>
      
      <p className="text-xs text-gray-400 text-center mt-2">
        Tap any vibe starter to get started instantly
      </p>
    </div>
  );
}