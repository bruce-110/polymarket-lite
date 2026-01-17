"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="p-2.5 rounded-lg transition-all hover:scale-105 active:scale-95"
        style={{
          backgroundColor: 'var(--theme-toggle-bg, #ffffff)',
          border: '1px solid var(--theme-toggle-border, #e8e4dc)',
        }}
      >
        <Moon className="h-5 w-5" style={{ color: 'var(--theme-toggle-icon, #666)' }} />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-lg transition-all hover:scale-105 active:scale-95"
      style={{
        backgroundColor: 'var(--theme-toggle-bg, #ffffff)',
        border: '1px solid var(--theme-toggle-border, #e8e4dc)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--theme-toggle-hover, #f5f3ef)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--theme-toggle-bg, #ffffff)';
      }}
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5" style={{ color: 'var(--theme-toggle-icon, #666)' }} />
      ) : (
        <Sun className="h-5 w-5" style={{ color: 'var(--theme-toggle-icon, #f5f5f5)' }} />
      )}
    </button>
  );
}
