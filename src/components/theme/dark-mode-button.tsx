import { Button } from "../ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/providers/theme-provider";

export default function DarkModeButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="absolute right-1 top-1 z-50">
      <Button onClick={toggleTheme} variant="outline">
        {theme === "light" ? <Sun /> : <Moon />}
      </Button>
    </div>
  );
}
