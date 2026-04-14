import { motion } from "framer-motion";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetPlatformStats, useGetRecentActivity, useGetSensitivityBreakdown } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, ShieldAlert, CheckCircle2, FileText, Users, Eye } from "lucide-react";
import { format } from "date-fns";

export function Dashboard() {
  const { data: stats, isLoading: isLoadingStats } = useGetPlatformStats();
  const { data: activity, isLoading: isLoadingActivity } = useGetRecentActivity();
  const { data: breakdown, isLoading: isLoadingBreakdown } = useGetSensitivityBreakdown();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-serif">Intelligence Dashboard</h1>
        <p className="text-muted-foreground mt-2 font-mono text-sm">SYSTEM STATUS: OPERATIONAL // NETWORK: SECURE</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-mono uppercase text-muted-foreground">Total Leaks</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold font-mono">{stats?.totalLeaks || 0}</div>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-mono uppercase text-muted-foreground">Verified Leaks</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold font-mono">{stats?.verifiedLeaks || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-mono uppercase text-muted-foreground">Critical Assets</CardTitle>
            <ShieldAlert className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold font-mono text-destructive">{stats?.criticalLeaks || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-mono uppercase text-muted-foreground">Verified Journalists</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold font-mono">{stats?.totalJournalists || 0}</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-card border-border">
          <CardHeader>
            <CardTitle className="font-serif">Recent Intelligence Activity</CardTitle>
            <CardDescription>Latest secure events across the platform.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingActivity ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : activity && activity.length > 0 ? (
              <div className="space-y-4">
                {activity.map((event) => (
                  <div key={event.id} className="flex items-start space-x-4 border-b border-border pb-4 last:border-0 last:pb-0">
                    <div className="mt-1 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{event.description}</p>
                      <div className="flex items-center text-xs text-muted-foreground font-mono space-x-2">
                        <span>{format(new Date(event.timestamp), 'MMM d, HH:mm')}</span>
                        <span>•</span>
                        <span className="uppercase">{event.eventType.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground font-mono text-sm">
                NO RECENT ACTIVITY DETECTED
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-3 bg-card border-border">
          <CardHeader>
            <CardTitle className="font-serif">Sensitivity Breakdown</CardTitle>
            <CardDescription>Current volume of active intel by threat level.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingBreakdown ? (
              <Skeleton className="h-48 w-full" />
            ) : breakdown && breakdown.length > 0 ? (
              <div className="space-y-4">
                {breakdown.map((item) => (
                  <div key={item.sensitivity} className="flex items-center">
                    <div className="w-24 font-mono text-xs uppercase">{item.sensitivity}</div>
                    <div className="flex-1 ml-4">
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            item.sensitivity === 'critical' ? 'bg-destructive' :
                            item.sensitivity === 'high' ? 'bg-orange-500' :
                            item.sensitivity === 'medium' ? 'bg-amber-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${(item.count / Math.max(...breakdown.map(b => b.count))) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="w-12 text-right font-mono text-sm">{item.count}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground font-mono text-sm">
                NO DATA AVAILABLE
              </div>
            )}
            <div className="mt-8 pt-6 border-t border-border flex justify-center">
               <Link href="/leaks">
                <Button variant="outline" className="font-mono uppercase tracking-wider">
                  <Eye className="mr-2 h-4 w-4" />
                  View All Leaks
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
