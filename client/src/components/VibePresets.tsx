import { useState } from "react";

interface VibePreset {
  id: string;
  label: string;
  emoji: string;
  color: string;
  description: string;
}

interface VibePresetsProps {
  onPresetSelect: (preset: VibePreset) => void;
  selectedPreset: string | null;
}

const presets: VibePreset[] = [
  {
    id: "happy",
    label: "Happy",
    emoji: "😊",
    color: "from-yellow-400 to-orange-400",
    description: "Feeling bright and positive"
  },
  {
    id: "excited",
    label: "Excited",
    emoji: "🚀",
    color: "from-purple-400 to-pink-400",
    description: "Full of energy and enthusiasm"
  },
  {
    id: "chill",
    label: "Chill",
    emoji: "😌",
    color: "from-blue-400 to-cyan-400",
    description: "Relaxed and peaceful vibes"
  },
  {
    id: "silly",
    label: "Silly",
    emoji: "🤪",
    color: "from-green-400 to-lime-400",
    description: "Playful and goofy mood"
  },
  {
    id: "anxious",
    label: "Anxious",
    emoji: "😰",
    color: "from-gray-400 to-slate-500",
    description: "Feeling nervous or worried"
  },
  {
    id: "random",
    label: "Random!",
    emoji: "🎲",
    color: "from-rainbow-gradient",
    description: "Surprise me with something unique"
  }
];

export default function VibePresets({ onPresetSelect, selectedPreset }: VibePresetsProps) {
  const [isMobileDropdown, setIsMobileDropdown] = useState(false);

  const handlePresetClick = (preset: VibePreset) => {
    onPresetSelect(preset);
    setIsMobileDropdown(false);
  };

  return (
    <div className="w-full">
      {/* Desktop Pills */}
      <div className="hidden sm:block">
        <h3 className="text-sm font-semibold text-gray-600 mb-3 font-poppins">Quick Vibes</h3>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePresetClick(preset)}
              className={`vibe-preset-pill ${
                selectedPreset === preset.id ? 'active' : ''
              } bg-gradient-to-r ${preset.color} text-white`}
            >
              <span className="mr-2">{preset.emoji}</span>
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div className="block sm:hidden">
        <label className="text-sm font-semibold text-gray-600 mb-2 block font-poppins">
          Choose Your Vibe
        </label>
        <select
          value={selectedPreset || ""}
          onChange={(e) => {
            const preset = presets.find(p => p.id === e.target.value);
            if (preset) handlePresetClick(preset);
          }}
          className="w-full mobile-button rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-white font-poppins"
        >
          <option value="">Select a mood...</option>
          {presets.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.emoji} {preset.label} - {preset.description}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export type { VibePreset };