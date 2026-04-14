import React, { useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import type { LeakSensitivity, LeakStatus, ActivityEventType } from "./_mock-data";

// Design tokens
export const SENSITIVITY_COLORS: Record<LeakSensitivity, string> = {
  low: "#00ff41",
  medium: "#ffb800",
  high: "#ff6b00",
  critical: "#ff0040",
};

export const STATUS_COLORS: Record<LeakStatus, string> = {
  pending: "#888888",
  verified: "#00ff41",
  claimed: "#00bfff",
  published: "#a855f7",
};

export const EVENT_TYPE_COLORS: Record<ActivityEventType, string> = {
  leak_submitted: "#00ff41",
  leak_verified: "#00bfff",
  leak_claimed: "#ffb800",
  leak_published: "#a855f7",
};

export const CATEGORY_ICONS: Record<string, string> = {
  government: "Building2",
  finance: "Banknote",
  healthcare: "Heart",
  environment: "Leaf",
  technology: "Cpu",
  defense: "Shield",
  corporate: "Briefcase",
};

export const formatTimeAgo = (dateString: string): string => {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true });
};

// LeakrShell: wrapper component that applies hacker theme
interface LeakrShellProps {
  children: React.ReactNode;
  className?: string;
}

export const LeakrShell: React.FC<LeakrShellProps> = ({ children, className }) => {
  useEffect(() => {
    // Load JetBrains Mono font
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => link.remove();
  }, []);

  const themeStyles = `
    /* Hacker theme CSS variable overrides */
    --background: 240 15% 3%;
    --foreground: 120 40% 90%;
    --card: 240 12% 5%;
    --card-foreground: 120 30% 88%;
    --border: 120 100% 20% / 0.15;
    --muted: 240 10% 10%;
    --muted-foreground: 120 10% 50%;
    --primary: 120 100% 50%;
    --primary-foreground: 240 15% 3%;
    --destructive: 0 100% 50%;
    --destructive-foreground: 0 0% 100%;
    --accent: 120 100% 13%;
    --ring: 120 100% 50%;
    --chart-1: 120 100% 50%;
    --chart-2: 40 100% 50%;
    --chart-3: 0 100% 50%;
    --chart-4: 200 100% 50%;
    --chart-5: 270 100% 60%;
  `;

  const backgroundPattern = `
    background-image:
      linear-gradient(rgba(0,255,65,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,255,65,0.03) 1px, transparent 1px);
    background-size: 20px 20px;
  `;

  return (
    <div
      className={cn("dark min-h-screen w-full", className)}
      style={{
        backgroundColor: "#0a0a0f",
        color: "hsl(120 40% 90%)",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        ...JSON.parse(`{"${themeStyles.replace(/\s+/g, ' ').replace(/:\s*/g, '":"').replace(/;\s*/g, '","').slice(0, -2)}"}`),
      } as React.CSSProperties}
    >
      <style>{`
        :root {
          ${themeStyles}
        }
        .dark {
          ${themeStyles}
        }

        body {
          background-color: #0a0a0f;
          color: hsl(120 40% 90%);
        }

        .font-terminal {
          font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
        }

        .grid-background {
          ${backgroundPattern}
        }

        .glow-accent {
          box-shadow: 0 0 20px rgba(0, 255, 65, 0.2);
        }

        .terminal-text {
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          color: #00ff41;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes scan-line {
          0% { top: 0; }
          100% { top: 100%; }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* Recharts dark theme */
        [data-chart] .recharts-cartesian-axis-tick-value {
          fill: hsl(120 30% 50%);
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
        }

        [data-chart] .recharts-tooltip-wrapper {
          outline: none;
        }

        [data-chart] .recharts-tooltip {
          background-color: rgba(10, 10, 15, 0.9) !important;
          border: 1px solid rgba(0, 255, 65, 0.2) !important;
          border-radius: 4px;
          box-shadow: 0 0 20px rgba(0, 255, 65, 0.1);
        }

        [data-chart] .recharts-default-tooltip {
          background: transparent !important;
        }

        [data-chart] text {
          font-family: 'JetBrains Mono', monospace;
        }
      `}</style>
      <div className="grid-background min-h-screen">
        {children}
      </div>
    </div>
  );
};
