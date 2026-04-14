import { useParams, useLocation, Link } from "wouter";
import { useGetJournalist, useListLeaks, getListLeaksQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BadgeCheck, FileText, BookOpen, ArrowLeft, Calendar } from "lucide-react";
import { format } from "date-fns";

export function JournalistDetail() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const id = parseInt(params.id, 10);

  const { data: journalist, isLoading } = useGetJournalist(id, {
    query: { enabled: !!id, queryKey: getListLeaksQueryKey() },
  });

  const { data: claimedLeaks } = useListLeaks(
    { status: "claimed" },
    { query: { enabled: !!journalist } }
  );

  const journalistLeaks = claimedLeaks?.filter(l => l.claimedByJournalistId === id);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Card className="bg-card">
          <CardContent className="p-8">
            <div className="flex items-start gap-6">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!journalist) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-serif">Journalist Not Found</h2>
        <Button variant="ghost" onClick={() => navigate("/journalists")} className="mt-4 font-mono text-xs">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Journalists
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate("/journalists")} className="font-mono text-xs -ml-2">
        <ArrowLeft className="mr-2 h-4 w-4" /> All Journalists
      </Button>

      <Card className="bg-card border-border">
        <CardContent className="p-8">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="h-20 w-20 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-mono font-bold text-xl">{journalist.avatarInitials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h1 className="text-2xl font-bold font-serif">{journalist.displayName}</h1>
                {journalist.verificationBadge && (
                  <Badge className="bg-primary/10 text-primary border-primary/30 font-mono text-xs">
                    <BadgeCheck className="mr-1 h-3 w-3" /> Verified Press
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground font-mono text-sm mb-4">{journalist.outlet}</p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">{journalist.bio}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {journalist.specializations.map(s => (
                  <Badge key={s} variant="outline" className="font-mono text-xs border-border text-muted-foreground">{s}</Badge>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                <div className="space-y-0.5">
                  <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Leaks Claimed</p>
                  <div className="flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-amber-500" />
                    <span className="text-2xl font-mono font-bold">{journalist.leaksClaimed}</span>
                  </div>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Published</p>
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-green-500" />
                    <span className="text-2xl font-mono font-bold">{journalist.leaksPublished}</span>
                  </div>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Member Since</p>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-mono">{format(new Date(journalist.createdAt), "MMM yyyy")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {journalistLeaks && journalistLeaks.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader className="border-b border-border">
            <CardTitle className="font-serif text-base">Active Claims</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {journalistLeaks.map((leak, idx) => (
              <Link key={leak.id} href={`/leaks/${leak.id}`}>
                <div className={`flex items-center justify-between p-4 hover:bg-muted/30 transition-colors cursor-pointer ${idx < journalistLeaks.length - 1 ? "border-b border-border" : ""}`}>
                  <div>
                    <p className="text-sm font-medium font-serif leading-tight">{leak.title}</p>
                    <p className="text-xs font-mono text-muted-foreground mt-0.5">{leak.category} · {format(new Date(leak.createdAt), "MMM d, yyyy")}</p>
                  </div>
                  <Badge variant="outline" className="font-mono text-[10px] border-amber-500/30 text-amber-500 ml-4 flex-shrink-0">Claimed</Badge>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
