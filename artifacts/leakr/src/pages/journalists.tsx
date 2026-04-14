import { Link } from "wouter";
import { useListJournalists } from "@workspace/api-client-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BadgeCheck, FileText, BookOpen, Plus } from "lucide-react";

export function JournalistsList() {
  const { data: journalists, isLoading } = useListJournalists();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-serif">Journalists</h1>
          <p className="text-muted-foreground mt-2 font-mono text-sm">VERIFIED PRESS & INVESTIGATIVE REPORTERS</p>
        </div>
        <Link href="/journalists/new">
          <Button className="font-mono uppercase tracking-wider">
            <Plus className="mr-2 h-4 w-4" /> Register Profile
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-card">
              <CardHeader><Skeleton className="h-12 w-12 rounded-full" /></CardHeader>
              <CardContent><Skeleton className="h-20 w-full" /></CardContent>
            </Card>
          ))}
        </div>
      ) : journalists && journalists.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {journalists.map((journalist) => (
            <Card key={journalist.id} className="bg-card border-border hover:border-primary/50 transition-colors flex flex-col">
              <CardContent className="p-6 flex-1">
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-mono font-bold text-sm">{journalist.avatarInitials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-serif font-semibold text-base leading-tight">{journalist.displayName}</h3>
                      {journalist.verificationBadge && (
                        <BadgeCheck className="h-4 w-4 text-primary flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs font-mono text-muted-foreground mt-0.5">{journalist.outlet}</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{journalist.bio}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {journalist.specializations.slice(0, 3).map(s => (
                    <Badge key={s} variant="outline" className="text-[10px] font-mono border-border text-muted-foreground">{s}</Badge>
                  ))}
                  {journalist.specializations.length > 3 && (
                    <Badge variant="outline" className="text-[10px] font-mono border-border text-muted-foreground">+{journalist.specializations.length - 3}</Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
                  <div className="space-y-0.5">
                    <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Claimed</p>
                    <div className="flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-amber-500" />
                      <span className="text-sm font-mono font-semibold">{journalist.leaksClaimed}</span>
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Published</p>
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5 text-green-500" />
                      <span className="text-sm font-mono font-semibold">{journalist.leaksPublished}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 px-6 pb-6">
                <Link href={`/journalists/${journalist.id}`} className="w-full">
                  <Button variant="secondary" className="w-full font-mono uppercase tracking-wider text-xs">
                    View Profile
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-border rounded-xl bg-card/30">
          <BookOpen className="mx-auto h-10 w-10 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium font-serif">No Journalists Registered</h3>
          <p className="text-sm text-muted-foreground font-mono mt-2 mb-6">Be the first to register your press credentials.</p>
          <Link href="/journalists/new">
            <Button className="font-mono uppercase tracking-wider text-xs">
              <Plus className="mr-2 h-4 w-4" /> Register Profile
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
