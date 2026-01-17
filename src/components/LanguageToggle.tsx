"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Languages } from "lucide-react";

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="px-3 py-2 text-sm font-medium transition-all rounded-lg"
        style={{
          backgroundColor: 'var(--theme-toggle-bg, #ffffff)',
          border: '1px solid var(--theme-toggle-border, #e8e4dc)',
        }}
      >
        <Languages className="h-4 w-4" style={{ color: 'var(--theme-toggle-icon, #666)' }} />
      </button>
    );
  }

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-2 text-sm font-bold transition-all hover:scale-105 active:scale-95 rounded-lg flex items-center gap-2"
      style={{
        backgroundColor: 'var(--theme-toggle-bg, #ffffff)',
        border: '1px solid var(--theme-toggle-border, #e8e4dc)',
        color: 'var(--text-primary, #333333)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--theme-toggle-hover, #f5f3ef)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--theme-toggle-bg, #ffffff)';
      }}
    >
      <Languages className="h-4 w-4" />
      <span>{language === "en" ? "EN" : "中文"}</span>
    </button>
  );
}
