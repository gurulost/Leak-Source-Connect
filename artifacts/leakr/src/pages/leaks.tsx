import { useState } from "react";
import { Link } from "wouter";
import { useListLeaks, useListCategories } from "@workspace/api-client-react";
import type { ListLeaksParams, LeakSensitivity, LeakStatus } from "@workspace/api-client-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, FileText, Search, Clock, CheckCircle2, Lock, Eye } from "lucide-react";
import { format } from "date-fns";

export function LeaksList() {
  const [search, setSearch] = useState("");
  const [sensitivity, setSensitivity] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");

  const queryParams: ListLeaksParams = {};
  if (search) queryParams.search = search;
  if (sensitivity && sensitivity !== "all") queryParams.sensitivity = sensitivity as LeakSensitivity;
  if (status && status !== "all") queryParams.status = status as LeakStatus;
  if (category && category !== "all") queryParams.category = category;

  const { data: leaks, isLoading } = useListLeaks(queryParams);
  const { data: categories } = useListCategories();

  const getSensitivityColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'high': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'medium': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'low': return 'bg-green-500/10 text-green-500 border-green-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground"><Clock className="mr-1 h-3 w-3" /> Pending</Badge>;
      case 'verified': return <Badge variant="outline" className="border-primary/30 text-primary"><CheckCircle2 className="mr-1 h-3 w-3" /> Verified</Badge>;
      case 'claimed': return <Badge variant="outline" className="border-amber-500/30 text-amber-500"><Lock className="mr-1 h-3 w-3" /> Claimed</Badge>;
      case 'published': return <Badge variant="outline" className="border-green-500/30 text-green-500"><Eye className="mr-1 h-3 w-3" /> Published</Badge>;
      default: return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-serif">Intelligence Feed</h1>
          <p className="text-muted-foreground mt-2 font-mono text-sm">BROWSE AVAILABLE SECURE SUBMISSIONS</p>
        </div>
        <Link href="/leaks/submit">
          <Button className="font-mono uppercase tracking-wider">
            <Shield className="mr-2 h-4 w-4" /> Submit Intel
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="bg-card/50 border-border border-dashed">
        <CardContent className="p-4 grid gap-4 md:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search intel..." 
              className="pl-9 font-mono text-sm bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <Select value={sensitivity} onValueChange={setSensitivity}>
            <SelectTrigger className="font-mono text-sm bg-background">
              <SelectValue placeholder="All Sensitivities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sensitivities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="font-mono text-sm bg-background">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="claimed">Claimed</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="font-mono text-sm bg-background">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map(c => (
                <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Grid */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-card">
              <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
              <CardContent><Skeleton className="h-20 w-full" /></CardContent>
            </Card>
          ))}
        </div>
      ) : leaks && leaks.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {leaks.map((leak) => (
            <Card key={leak.id} className="bg-card border-border hover:border-primary/50 transition-colors flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className={`uppercase font-mono text-[10px] tracking-wider ${getSensitivityColor(leak.sensitivity)}`}>
                    {leak.sensitivity}
                  </Badge>
                  {getStatusBadge(leak.status)}
                </div>
                <CardTitle className="font-serif leading-tight">{leak.title}</CardTitle>
                <div className="text-xs text-muted-foreground font-mono mt-1 flex items-center">
                  <span>SRC: {leak.anonymousHandle}</span>
                  <span className="mx-2">•</span>
                  <span>{format(new Date(leak.createdAt), 'MMM d, yyyy')}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-3">{leak.teaser}</p>
                <div className="flex items-center gap-4 mt-4 text-xs font-mono text-muted-foreground">
                  <span className="flex items-center"><FileText className="mr-1 h-3 w-3" /> {leak.documentCount} DOCS</span>
                  <span className="px-2 py-0.5 rounded bg-muted uppercase text-[10px]">{leak.category}</span>
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t border-border">
                <Link href={`/leaks/${leak.id}`} className="w-full">
                  <Button variant="secondary" className="w-full font-mono uppercase tracking-wider text-xs">
                    View Dossier
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-border rounded-xl bg-card/30">
          <Shield className="mx-auto h-10 w-10 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium font-serif">No Intel Found</h3>
          <p className="text-sm text-muted-foreground font-mono mt-2">Adjust filters or check back later.</p>
        </div>
      )}
    </div>
  );
}
