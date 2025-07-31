import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage first, then system preference, default to dark
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") {
      return saved as Theme;
    }
    
    // Check system preference
    if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      return "light";
    }
    
    return "dark";
  });

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    
    // Save to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}