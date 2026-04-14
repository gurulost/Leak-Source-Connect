import React, { useState } from "react";
import { motion } from "framer-motion";
import { LeakrShell, SENSITIVITY_COLORS, STATUS_COLORS } from "./_theme";
import {
  SensitivityBadge,
  StatusBadge,
  GlowCard,
  TerminalText,
} from "./_shared-components";
import { MOCK_JOURNALISTS, MOCK_LEAKS, type LeakStatus } from "./_mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShieldCheck } from "lucide-react";

const JournalistHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState("profiles");

  return (
    <LeakrShell>
      <div className="min-h-screen p-6">
        {/* Header */}
        <motion.div className="mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold font-terminal text-primary">
            ▮ LEAKR // JOURNALIST HUB
          </h1>
          <p className="text-xs text-muted-foreground font-terminal mt-2">
            {MOCK_JOURNALISTS.length} journalists
          </p>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-xs grid-cols-2 mb-6 bg-background/50 border border-border/50">
            <TabsTrigger value="profiles" className="font-terminal">
              Profiles
            </TabsTrigger>
            <TabsTrigger value="warroom" className="font-terminal">
              War Room
            </TabsTrigger>
          </TabsList>

          {/* Profiles Tab */}
          <TabsContent value="profiles" className="space-y-6">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {MOCK_JOURNALISTS.map((journalist, idx) => (
                <motion.div
                  key={journalist.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.05 }}
                >
                  <GlowCard glowColor="#00bfff">
                    <CardContent className="p-6 space-y-4">
                      {/* Avatar */}
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12 border-2" style={{ borderColor: journalist.verificationBadge ? "#00ff41" : "rgba(0,255,65,0.2)" }}>
                          <AvatarFallback className="bg-primary/20 font-bold font-terminal">
                            {journalist.avatarInitials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm text-foreground">{journalist.displayName}</h3>
                          <p className="text-xs text-muted-foreground">{journalist.outlet}</p>
                        </div>
                      </div>

                      {/* Verification Badge */}
                      {journalist.verificationBadge && (
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-primary" />
                          <span className="text-xs font-terminal text-primary uppercase">Verified</span>
                        </div>
                      )}

                      {/* Bio */}
                      <p className="text-xs text-muted-foreground line-clamp-2">{journalist.bio}</p>

                      {/* Specializations */}
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground font-terminal">SPECIALIZATIONS</p>
                        <div className="flex gap-1 flex-wrap">
                          {journalist.specializations.slice(0, 3).map((spec) => (
                            <Badge key={spec} variant="outline" className="text-[10px] font-terminal">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/50">
                        <div className="space-y-1">
                          <p className="text-[10px] text-muted-foreground font-terminal">CLAIMED</p>
                          <p className="text-base font-bold text-primary font-terminal">{journalist.leaksClaimed}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] text-muted-foreground font-terminal">PUBLISHED</p>
                          <p className="text-base font-bold text-primary font-terminal">{journalist.leaksPublished}</p>
                        </div>
                      </div>
                    </CardContent>
                  </GlowCard>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          {/* War Room Tab */}
          <TabsContent value="warroom">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {["pending", "verified", "claimed", "published"].map((status) => (
                <KanbanColumn key={status} status={status as any} />
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </LeakrShell>
  );
};

const KanbanColumn: React.FC<{ status: LeakStatus }> = ({ status }) => {
  const columnLeaks = MOCK_LEAKS.filter((leak) => leak.status === status);
  const color = STATUS_COLORS[status];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
      <GlowCard glowColor={color}>
        <CardHeader className="pb-3">
          <CardTitle className="text-xs font-terminal uppercase flex items-center gap-2" style={{ color }}>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            {status} ({columnLeaks.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <div className="p-4 space-y-2">
              {columnLeaks.map((leak, idx) => (
                <motion.div
                  key={leak.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + idx * 0.05 }}
                >
                  <div className="p-3 bg-background/50 border border-border/50 rounded text-xs space-y-2 hover:border-primary/30 transition">
                    <p className="font-semibold text-foreground line-clamp-2">{leak.title}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <SensitivityBadge sensitivity={leak.sensitivity} />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground font-terminal">
                      <span>{leak.anonymousHandle}</span>
                      {leak.claimedByJournalistName && (
                        <span className="text-primary text-[9px]">{leak.claimedByJournalistName}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              {columnLeaks.length === 0 && (
                <div className="text-center py-6 text-muted-foreground text-xs">
                  No leaks
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </GlowCard>
    </motion.div>
  );
};

export default JournalistHub;
