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
    <div className="border rounded-2xl p-3 shadow-lg" style={{ 
      width: '100%', 
      maxWidth: '100%',
      background: 'linear-gradient(135deg, hsl(262, 40%, 20%) 0%, hsl(262, 35%, 15%) 100%)',
      borderColor: 'hsl(262, 50%, 40%)'
    }}>
      {/* Facebook-style horizontal scrolling row */}
      <div className="horizontal-scroll-container" style={{ overflowX: 'scroll', width: '100%' }}>
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={() => onActionSelect(action.prompt)}
            className="horizontal-scroll-item transition-all duration-200 transform hover:scale-110"
            style={{ 
              border: 'none',
              background: 'hsl(262, 30%, 25%)',
              color: 'hsl(262, 70%, 85%)',
              cursor: 'pointer',
              outline: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'hsl(262, 35%, 30%)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'hsl(262, 30%, 25%)';
            }}
          >
            <div className="flex flex-col items-center justify-center h-full w-full">
              <span className="text-base leading-none">{action.emoji}</span>
              <span className="text-xs font-medium leading-tight text-center mt-1" style={{ fontSize: '10px', lineHeight: '1.1' }}>{action.label}</span>
            </div>
          </button>
        ))}
      </div>
      
      <p className="text-xs text-center mt-2" style={{ color: 'hsl(262, 60%, 55%)' }}>
        Tap any vibe starter to get started instantly
      </p>
    </div>
  );
}