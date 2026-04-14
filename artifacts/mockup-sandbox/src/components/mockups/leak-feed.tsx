import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, LayoutGrid, List } from "lucide-react";
import { LeakrShell, SENSITIVITY_COLORS, formatTimeAgo } from "./_theme";
import {
  SensitivityBadge,
  StatusBadge,
  GlowCard,
  TerminalText,
} from "./_shared-components";
import { MOCK_LEAKS, MOCK_CATEGORIES, type Leak, type LeakSensitivity, type LeakStatus } from "./_mock-data";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { FileText, Eye } from "lucide-react";

interface FilterState {
  search: string;
  category: string;
  status: string;
  sensitivity: string[];
}

const LeakFeed: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "",
    status: "",
    sensitivity: [],
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedLeak, setSelectedLeak] = useState<Leak | null>(null);

  const filteredLeaks = MOCK_LEAKS.filter((leak) => {
    let matches = true;

    if (filters.search) {
      matches = leak.title.toLowerCase().includes(filters.search.toLowerCase());
    }

    if (filters.category && filters.category !== "all") {
      matches = matches && leak.category === filters.category;
    }

    if (filters.status && filters.status !== "all") {
      matches = matches && leak.status === filters.status;
    }

    if (filters.sensitivity.length > 0) {
      matches = matches && filters.sensitivity.includes(leak.sensitivity);
    }

    return matches;
  });

  return (
    <LeakrShell>
      <div className="min-h-screen p-6">
        {/* Header */}
        <motion.div className="mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold font-terminal text-primary">
            ▮ LEAKR // LEAK FEED
          </h1>
          <p className="text-xs text-muted-foreground font-terminal mt-2">
            {filteredLeaks.length} of {MOCK_LEAKS.length} leaks
          </p>
        </motion.div>

        {/* Filter Bar */}
        <motion.div
          className="sticky top-0 z-10 mb-6 p-4 rounded-lg border bg-card/80 backdrop-blur-sm space-y-4"
          style={{ borderColor: "rgba(0, 255, 65, 0.1)" }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search leaks..."
                className="pl-8 font-terminal text-xs h-9 bg-background/50"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>

            {/* Category */}
            <Select value={filters.category} onValueChange={(val) => setFilters({ ...filters, category: val })}>
              <SelectTrigger className="font-terminal text-xs h-9">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {MOCK_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status */}
            <Select value={filters.status} onValueChange={(val) => setFilters({ ...filters, status: val })}>
              <SelectTrigger className="font-terminal text-xs h-9">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="claimed">Claimed</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>

            {/* Sensitivity */}
            <div className="col-span-1 md:col-span-2">
              <ToggleGroup
                type="multiple"
                value={filters.sensitivity}
                onValueChange={(val) => setFilters({ ...filters, sensitivity: val as LeakSensitivity[] })}
                className="justify-start gap-1"
              >
                {["low", "medium", "high", "critical"].map((level) => (
                  <ToggleGroupItem
                    key={level}
                    value={level}
                    className="font-terminal text-xs h-8 px-2 data-[state=on]:text-black"
                    style={{
                      borderColor: SENSITIVITY_COLORS[level as LeakSensitivity],
                      color: SENSITIVITY_COLORS[level as LeakSensitivity],
                    }}
                  >
                    {level.toUpperCase()}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex justify-end">
            <div className="inline-flex gap-2 p-1 rounded border border-border/50">
              <Button
                size="sm"
                variant={viewMode === "grid" ? "default" : "ghost"}
                className="h-7 w-7 p-0"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === "list" ? "default" : "ghost"}
                className="h-7 w-7 p-0"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Leak Grid/List */}
        <AnimatePresence mode="wait">
          {viewMode === "grid" ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filteredLeaks.map((leak, idx) => (
                <LeakCard key={leak.id} leak={leak} index={idx} onSelect={setSelectedLeak} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {filteredLeaks.map((leak, idx) => (
                <LeakListItem key={leak.id} leak={leak} index={idx} onSelect={setSelectedLeak} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {filteredLeaks.length === 0 && (
          <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-muted-foreground font-terminal text-sm">No leaks match your filters</p>
          </motion.div>
        )}

        {/* Leak Detail Sheet */}
        <Sheet open={!!selectedLeak} onOpenChange={() => setSelectedLeak(null)}>
          <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
            {selectedLeak && (
              <div className="space-y-4">
                <SheetHeader>
                  <SheetTitle className="font-terminal text-base">{selectedLeak.title}</SheetTitle>
                </SheetHeader>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground font-terminal">TEASER</p>
                    <p className="text-sm text-foreground">{selectedLeak.teaser}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground font-terminal">SENSITIVITY</p>
                      <SensitivityBadge sensitivity={selectedLeak.sensitivity} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground font-terminal">STATUS</p>
                      <StatusBadge status={selectedLeak.status} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                    <div>
                      <p className="text-xs text-muted-foreground font-terminal">HANDLE</p>
                      <p className="font-terminal text-sm text-primary mt-1">{selectedLeak.anonymousHandle}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-terminal">DOCUMENTS</p>
                      <p className="font-terminal text-sm mt-1">{selectedLeak.documentCount}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground font-terminal">VIEWS</p>
                      <p className="font-terminal text-sm mt-1">{selectedLeak.viewCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-terminal">CATEGORY</p>
                      <p className="font-terminal text-sm mt-1 capitalize">{selectedLeak.category}</p>
                    </div>
                  </div>

                  {selectedLeak.claimedByJournalistName && (
                    <div className="pt-4 border-t border-border/50 p-3 rounded bg-card/50">
                      <p className="text-xs text-muted-foreground font-terminal mb-2">CLAIMED BY</p>
                      <p className="text-sm font-terminal text-blue-400">{selectedLeak.claimedByJournalistName}</p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-border/50 space-y-1">
                    <p className="text-xs text-muted-foreground font-terminal">
                      SUBMITTED {formatTimeAgo(selectedLeak.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </LeakrShell>
  );
};

interface LeakCardProps {
  leak: Leak;
  index: number;
  onSelect: (leak: Leak) => void;
}

const LeakCard: React.FC<LeakCardProps> = ({ leak, index, onSelect }) => {
  const color = SENSITIVITY_COLORS[leak.sensitivity];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => onSelect(leak)}
      className="cursor-pointer"
    >
      <GlowCard glowColor={color}>
        <div
          className="absolute top-0 left-0 bottom-0 w-1"
          style={{ backgroundColor: color }}
        />
        <CardContent className="p-4 pl-5">
          <div className="space-y-3">
            <h3 className="font-semibold text-sm line-clamp-2 text-foreground">
              {leak.title}
            </h3>

            <p className="text-xs text-muted-foreground line-clamp-2">
              {leak.teaser}
            </p>

            <div className="flex gap-2 flex-wrap pt-2">
              <SensitivityBadge sensitivity={leak.sensitivity} />
              <StatusBadge status={leak.status} />
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground font-terminal pt-3 border-t border-border/50">
              <span className="text-primary">{leak.anonymousHandle}</span>
              <div className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                {leak.documentCount}
              </div>
              <div className="flex items-center gap-1 ml-auto">
                <Eye className="w-3 h-3" />
                {leak.viewCount}
              </div>
            </div>

            <p className="text-[10px] text-muted-foreground font-terminal">
              {formatTimeAgo(leak.createdAt)}
            </p>
          </div>
        </CardContent>
      </GlowCard>
    </motion.div>
  );
};

interface LeakListItemProps {
  leak: Leak;
  index: number;
  onSelect: (leak: Leak) => void;
}

const LeakListItem: React.FC<LeakListItemProps> = ({ leak, index, onSelect }) => {
  const color = SENSITIVITY_COLORS[leak.sensitivity];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => onSelect(leak)}
      className="cursor-pointer"
    >
      <GlowCard glowColor={color}>
        <div
          className="absolute top-0 left-0 bottom-0 w-1"
          style={{ backgroundColor: color }}
        />
        <CardContent className="p-4 pl-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-1">
              <h3 className="font-semibold text-sm text-foreground">{leak.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-1">{leak.teaser}</p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <SensitivityBadge sensitivity={leak.sensitivity} />
              <StatusBadge status={leak.status} />
              <div className="text-xs font-terminal text-muted-foreground flex gap-3">
                <span className="text-primary">{leak.anonymousHandle}</span>
                <span>{leak.viewCount} views</span>
              </div>
            </div>
          </div>
        </CardContent>
      </GlowCard>
    </motion.div>
  );
};

export default LeakFeed;
