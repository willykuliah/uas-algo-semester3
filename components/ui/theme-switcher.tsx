"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex gap-2">
      <Button
        variant={theme === "light" ? "default" : "outline"}
        size="icon"
        onClick={() => setTheme("light")}
        className="h-9 w-9"
      >
        <Sun className="h-4 w-4" />
        <span className="sr-only">Light mode</span>
      </Button>

      <Button
        variant={theme === "dark" ? "default" : "outline"}
        size="icon"
        onClick={() => setTheme("dark")}
        className="h-9 w-9"
      >
        <Moon className="h-4 w-4" />
        <span className="sr-only">Dark mode</span>
      </Button>

      <Button
        variant={theme === "system" ? "default" : "outline"}
        size="icon"
        onClick={() => setTheme("system")}
        className="h-9 w-9"
      >
        <Monitor className="h-4 w-4" />
        <span className="sr-only">System theme</span>
      </Button>
    </div>
  );
};
