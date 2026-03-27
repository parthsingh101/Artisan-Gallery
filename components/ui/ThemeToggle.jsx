"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="p-2 w-10 h-10" />;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full text-charcoal-700 hover:text-gold-600 dark:text-cream-200 dark:hover:text-gold-400 transition-all duration-300 bg-transparent hover:bg-cream-50 dark:hover:bg-charcoal-800 border border-transparent"
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? (
        <HiOutlineSun className="w-5 h-5 animate-slide-up" />
      ) : (
        <HiOutlineMoon className="w-5 h-5 animate-slide-up" />
      )}
    </button>
  );
}
