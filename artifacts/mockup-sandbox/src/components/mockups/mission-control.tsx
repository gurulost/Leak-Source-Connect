import React from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Activity, AlertCircle, CheckCircle, Users } from "lucide-react";
import { LeakrShell, SENSITIVITY_COLORS, EVENT_TYPE_COLORS } from "./_theme";
import {
  AnimatedCounter,
  ActivityFeedItem,
  SensitivityBadge,
  StatusBadge,
  GlowCard,
  TerminalText,
} from "./_shared-components";
import {
  MOCK_PLATFORM_STATS,
  MOCK_ACTIVITY,
  MOCK_SENSITIVITY_BREAKDOWN,
  MOCK_CATEGORIES,
  MOCK_LEAKS,
} from "./_mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const Dashboard: React.FC = () => {
  const stats = MOCK_PLATFORM_STATS;
  const recentLeaks = MOCK_LEAKS.slice(0, 5).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const chartData = MOCK_SENSITIVITY_BREAKDOWN.map((item) => ({
    name: item.sensitivity,
    count: item.count,
    fill: SENSITIVITY_COLORS[item.sensitivity],
  }));

  const categoryData = MOCK_CATEGORIES.slice(0, 5).map((cat) => ({
    name: cat.name,
    count: cat.leakCount,
    fill: SENSITIVITY_COLORS.medium,
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <LeakrShell>
      <div className="min-h-screen p-6">
        {/* Header */}
        <motion.div className="mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold font-terminal text-primary">
            ▮ LEAKR // MISSION CONTROL
          </h1>
          <p className="text-xs text-muted-foreground font-terminal mt-2">
            Platform Status: {new Date().toLocaleTimeString()} UTC
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <GlowCard glowColor="#00ff41">
              <CardContent className="p-6">
                <AnimatedCounter
                  value={stats.totalLeaks}
                  label="Total Leaks"
                  icon={<AlertCircle className="w-5 h-5 text-primary" />}
                  glowColor="#00ff41"
                />
              </CardContent>
            </GlowCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <GlowCard glowColor="#00bfff">
              <CardContent className="p-6">
                <AnimatedCounter
                  value={stats.verifiedLeaks}
                  label="Verified"
                  icon={<CheckCircle className="w-5 h-5" style={{ color: "#00bfff" }} />}
                  glowColor="#00bfff"
                />
              </CardContent>
            </GlowCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <GlowCard glowColor="#ff0040">
              <CardContent className="p-6">
                <AnimatedCounter
                  value={stats.criticalLeaks}
                  label="Critical"
                  icon={<AlertCircle className="w-5 h-5" style={{ color: "#ff0040" }} />}
                  glowColor="#ff0040"
                />
              </CardContent>
            </GlowCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <GlowCard glowColor="#ffb800">
              <CardContent className="p-6">
                <AnimatedCounter
                  value={stats.totalJournalists}
                  label="Journalists"
                  icon={<Users className="w-5 h-5" style={{ color: "#ffb800" }} />}
                  glowColor="#ffb800"
                />
              </CardContent>
            </GlowCard>
          </motion.div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Charts and Table */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sensitivity Breakdown Chart */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <GlowCard>
                <CardHeader>
                  <CardTitle className="font-terminal text-sm">
                    <TerminalText>→ SENSITIVITY BREAKDOWN</TerminalText>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,65,0.1)" />
                      <XAxis dataKey="name" stroke="rgba(0,255,65,0.3)" style={{ fontSize: "11px" }} />
                      <YAxis stroke="rgba(0,255,65,0.3)" style={{ fontSize: "11px" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(10, 10, 15, 0.95)",
                          border: "1px solid rgba(0,255,65,0.2)",
                          borderRadius: "4px",
                        }}
                        cursor={{ fill: "rgba(0,255,65,0.05)" }}
                      />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]} isAnimationActive>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </GlowCard>
            </motion.div>

            {/* Category Distribution */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <GlowCard>
                <CardHeader>
                  <CardTitle className="font-terminal text-sm">
                    <TerminalText>→ CATEGORY DISTRIBUTION</TerminalText>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#00ff41"
                        dataKey="count"
                        isAnimationActive
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(10, 10, 15, 0.95)",
                          border: "1px solid rgba(0,255,65,0.2)",
                          borderRadius: "4px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </GlowCard>
            </motion.div>

            {/* Recent Leaks Table */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <GlowCard>
                <CardHeader>
                  <CardTitle className="font-terminal text-sm">
                    <TerminalText>→ RECENT LEAKS</TerminalText>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="w-full">
                    <Table className="text-xs">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-terminal">TITLE</TableHead>
                          <TableHead className="font-terminal">STATUS</TableHead>
                          <TableHead className="font-terminal">SENSITIVITY</TableHead>
                          <TableHead className="font-terminal">VIEWS</TableHead>
                          <TableHead className="font-terminal">HANDLE</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentLeaks.map((leak, idx) => (
                          <motion.tr
                            key={leak.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 + idx * 0.05 }}
                            className="border-b border-border/50"
                          >
                            <TableCell className="max-w-xs truncate">
                              <span className="text-foreground text-xs">{leak.title.substring(0, 30)}</span>
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={leak.status} />
                            </TableCell>
                            <TableCell>
                              <SensitivityBadge sensitivity={leak.sensitivity} />
                            </TableCell>
                            <TableCell className="font-terminal">{leak.viewCount}</TableCell>
                            <TableCell className="font-terminal text-primary text-xs">{leak.anonymousHandle}</TableCell>
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </GlowCard>
            </motion.div>
          </div>

          {/* Right Column - Activity Feed */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <GlowCard glowColor="#a855f7">
              <CardHeader>
                <CardTitle className="font-terminal text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4" style={{ color: "#a855f7" }} />
                  <TerminalText>LIVE ACTIVITY</TerminalText>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[600px]">
                  <div className="p-4 space-y-2">
                    {MOCK_ACTIVITY.map((event, idx) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.1 }}
                      >
                        <ActivityFeedItem
                          id={event.id}
                          eventType={event.eventType}
                          description={event.description}
                          timestamp={event.timestamp}
                          sensitivity={event.sensitivity}
                        />
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </GlowCard>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          className="mt-8 text-center text-[10px] text-muted-foreground font-terminal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Separator className="mb-4" style={{ backgroundColor: "rgba(0, 255, 65, 0.1)" }} />
          <p>SECURE WHISTLEBLOWER PLATFORM • API: /api • STATUS: OPERATIONAL ▮</p>
        </motion.div>
      </div>
    </LeakrShell>
  );
};

export default Dashboard;
