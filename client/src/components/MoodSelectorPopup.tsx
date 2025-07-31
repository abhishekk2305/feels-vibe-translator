import { Button } from "@/components/ui/button";

interface Mood {
  id: string;
  emoji: string;
  label: string;
  color: string;
}

interface MoodSelectorPopupProps {
  moods: Mood[];
  selectedMoods: string[];
  onMoodChange: (moods: string[]) => void;
  maxSelection?: number;
}

export default function MoodSelectorPopup({ 
  moods, 
  selectedMoods, 
  onMoodChange, 
  maxSelection = 3 
}: MoodSelectorPopupProps) {
  console.log("MoodSelectorPopup rendering with mood options:", moods.map(m => m.label));
  // This shows actual mood selection - different from quick actions!
  const handleMoodClick = (moodId: string) => {
    let newSelectedMoods;
    if (selectedMoods.includes(moodId)) {
      newSelectedMoods = selectedMoods.filter(id => id !== moodId);
    } else {
      if (selectedMoods.length >= maxSelection) {
        newSelectedMoods = [...selectedMoods.slice(1), moodId];
      } else {
        newSelectedMoods = [...selectedMoods, moodId];
      }
    }
    onMoodChange(newSelectedMoods);
  };

  return (
    <div className="bg-semi-dark border border-gray-600 rounded-2xl p-3 shadow-lg" style={{ width: '100%', maxWidth: '100%' }}>
      {/* Facebook-style horizontal scrolling row */}
      <div className="horizontal-scroll-container" style={{ overflowX: 'scroll', width: '100%' }}>
        {moods.map((mood) => {
          const isSelected = selectedMoods.includes(mood.id);
          return (
            <button
              key={mood.id}
              onClick={() => handleMoodClick(mood.id)}
              className={`
                horizontal-scroll-item transition-all duration-200 transform hover:scale-110
              `}
              style={{
                border: 'none',
                background: isSelected 
                  ? 'linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to))'
                  : '#374151',
                color: isSelected ? '#ffffff' : '#e5e7eb',
                cursor: 'pointer',
                outline: 'none',
                boxShadow: isSelected ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 0 0 2px rgba(255, 255, 255, 0.5)' : 'none'
              }}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <span className="text-lg mb-0.5">{mood.emoji}</span>
                <span className="text-xs font-medium leading-none text-center">{mood.label}</span>
              </div>
            </button>
          );
        })}
      </div>
      
      {maxSelection && (
        <p className="text-xs text-gray-400 text-center mt-2">
          Select up to {maxSelection} moods • {selectedMoods.length}/{maxSelection} selected
        </p>
      )}
    </div>
  );
}