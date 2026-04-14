import React from "react";
import { motion } from "framer-motion";
import { useMotionValue, useTransform, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Clock, Shield, User, Globe } from "lucide-react";
import {
  SENSITIVITY_COLORS,
  STATUS_COLORS,
  EVENT_TYPE_COLORS,
  formatTimeAgo,
} from "./_theme";
import type { LeakSensitivity, LeakStatus, ActivityEventType } from "./_mock-data";

// SensitivityBadge component
interface SensitivityBadgeProps {
  sensitivity: LeakSensitivity;
  className?: string;
}

export const SensitivityBadge: React.FC<SensitivityBadgeProps> = ({
  sensitivity,
  className,
}) => {
  const color = SENSITIVITY_COLORS[sensitivity];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn("inline-flex items-center gap-1", className)}
    >
      <div
        className="w-2 h-2 rounded-full animate-pulse"
        style={{ backgroundColor: color }}
      />
      <Badge
        variant="outline"
        className="font-terminal text-xs uppercase"
        style={{
          borderColor: `${color}60`,
          color: color,
          boxShadow: `0 0 8px ${color}40`,
        }}
      >
        {sensitivity}
      </Badge>
    </motion.div>
  );
};

// StatusBadge component
interface StatusBadgeProps {
  status: LeakStatus;
  className?: string;
}

const StatusIconMap: Record<LeakStatus, React.ReactNode> = {
  pending: <Clock className="w-3 h-3" />,
  verified: <Shield className="w-3 h-3" />,
  claimed: <User className="w-3 h-3" />,
  published: <Globe className="w-3 h-3" />,
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className,
}) => {
  const color = STATUS_COLORS[status];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn("inline-flex items-center gap-1", className)}
    >
      <Badge
        variant="outline"
        className="font-terminal text-xs uppercase inline-flex items-center gap-1"
        style={{
          borderColor: `${color}60`,
          color: color,
          boxShadow: `0 0 8px ${color}40`,
        }}
      >
        {StatusIconMap[status]}
        {status}
      </Badge>
    </motion.div>
  );
};

// GlowCard component
interface GlowCardProps {
  children: React.ReactNode;
  glowColor?: string;
  className?: string;
}

export const GlowCard: React.FC<GlowCardProps> = ({
  children,
  glowColor = "#00ff41",
  className,
}) => {
  return (
    <motion.div
      whileHover={{ boxShadow: `0 0 30px ${glowColor}40` }}
      className={className}
    >
      <Card
        className="border bg-card/50 backdrop-blur-sm"
        style={{
          borderColor: `${glowColor}40`,
          boxShadow: `0 0 15px ${glowColor}20, inset 0 1px 0 ${glowColor}10`,
          transition: "box-shadow 0.3s ease-out",
        }}
      >
        {children}
      </Card>
    </motion.div>
  );
};

// AnimatedCounter component
interface AnimatedCounterProps {
  value: number;
  label: string;
  icon?: React.ReactNode;
  glowColor?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  label,
  icon,
  glowColor = "#00ff41",
}) => {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) =>
    Math.round(latest)
  );
  const spring = useSpring(rounded, { duration: 2000 });

  React.useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  return (
    <div className="relative">
      <div className="absolute -inset-1 rounded-lg blur opacity-25" style={{ backgroundColor: glowColor }} />
      <div className="relative">
        <div className="text-left">
          {icon && <div className="text-xl mb-2">{icon}</div>}
          <motion.div
            className="font-terminal text-3xl font-bold"
            style={{ color: glowColor }}
          >
            {spring}
          </motion.div>
          <p className="text-xs text-muted-foreground font-terminal mt-1">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
};

// ActivityFeedItem component
interface ActivityFeedItemProps {
  id: number;
  eventType: ActivityEventType;
  description: string;
  timestamp: string;
  sensitivity: LeakSensitivity;
}

export const ActivityFeedItem: React.FC<ActivityFeedItemProps> = ({
  eventType,
  description,
  timestamp,
  sensitivity,
}) => {
  const color = EVENT_TYPE_COLORS[eventType];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex gap-3 py-2 px-2 border-l-2 border-card hover:border-primary/50 transition-colors"
      style={{ borderLeftColor: `${color}60` }}
    >
      <div
        className="w-2 h-2 rounded-full mt-2 flex-shrink-0 animate-pulse"
        style={{ backgroundColor: color }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-foreground line-clamp-2">{description}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] text-muted-foreground font-terminal">
            {formatTimeAgo(timestamp)}
          </span>
          <SensitivityBadge sensitivity={sensitivity} />
        </div>
      </div>
    </motion.div>
  );
};

// PulsingDot component
interface PulsingDotProps {
  color: string;
  size?: number;
  className?: string;
}

export const PulsingDot: React.FC<PulsingDotProps> = ({
  color,
  size = 8,
  className,
}) => {
  return (
    <motion.div
      animate={{ opacity: [1, 0.5, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
      className={cn("rounded-full", className)}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        boxShadow: `0 0 ${size * 2}px ${color}80`,
      }}
    />
  );
};

// TerminalText component
interface TerminalTextProps {
  children: React.ReactNode;
  className?: string;
}

export const TerminalText: React.FC<TerminalTextProps> = ({
  children,
  className,
}) => {
  return (
    <span className={cn("font-terminal text-primary", className)}>
      {children}
    </span>
  );
};
