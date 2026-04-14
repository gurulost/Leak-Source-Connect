import { useLocation, useParams } from "wouter";
import { useGetLeak, useClaimLeak, useListJournalists, getGetLeakQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, FileText, Clock, CheckCircle2, Lock, Eye, AlertTriangle, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export function LeakDetail() {
  const { id } = useParams();
  const leakId = parseInt(id || "0");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [selectedJournalistId, setSelectedJournalistId] = useState<string>("");

  const { data: leak, isLoading: isLoadingLeak } = useGetLeak(leakId, {
    query: { enabled: !!leakId, queryKey: getGetLeakQueryKey(leakId) }
  });

  const { data: journalists, isLoading: isLoadingJournalists } = useListJournalists();

  const claimMutation = useClaimLeak({
    mutation: {
      onSuccess: (updatedLeak) => {
        toast({
          title: "Intel Claimed",
          description: "You have successfully claimed this leak.",
        });
        queryClient.setQueryData(getGetLeakQueryKey(leakId), updatedLeak);
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Claim Failed",
          description: error.error || "An error occurred while claiming.",
        });
      }
    }
  });

  const handleClaim = () => {
    if (!selectedJournalistId) {
      toast({
        variant: "destructive",
        title: "Selection Required",
        description: "Please select a journalist profile to claim this leak.",
      });
      return;
    }
    claimMutation.mutate({
      id: leakId,
      data: { journalistId: parseInt(selectedJournalistId) }
    });
  };

  if (isLoadingLeak) {
    return <div className="space-y-4"><Skeleton className="h-10 w-1/3" /><Skeleton className="h-64 w-full" /></div>;
  }

  if (!leak) {
    return <div className="text-center py-20 font-mono text-muted-foreground">LEAK NOT FOUND OR ACCESS DENIED</div>;
  }

  const getSensitivityColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'high': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'medium': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'low': return 'bg-green-500/10 text-green-500 border-green-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <Link href="/leaks" className="inline-flex items-center text-sm font-mono text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> RETURN TO INTEL FEED
        </Link>
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline" className={`px-3 py-1 uppercase font-mono text-xs tracking-wider ${getSensitivityColor(leak.sensitivity)}`}>
            {leak.sensitivity} SENSITIVITY
          </Badge>
          <div className="font-mono text-sm text-muted-foreground">
            ID: {leak.id.toString().padStart(6, '0')}
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight font-serif leading-tight">{leak.title}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-card border-border">
            <CardHeader className="border-b border-border/50 bg-muted/20">
              <CardTitle className="font-mono text-sm text-muted-foreground uppercase flex items-center">
                <FileText className="mr-2 h-4 w-4" /> Intel Synopsis
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-base leading-relaxed text-foreground/90 whitespace-pre-wrap">
                {leak.teaser}
              </p>
            </CardContent>
          </Card>

          {leak.status === 'verified' && !leak.claimedByJournalistId && (
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="font-serif flex items-center">
                  <Lock className="mr-2 h-5 w-5 text-primary" /> Claim This Intel
                </CardTitle>
                <CardDescription>
                  Verified journalists can claim exclusive access to the full documents.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-mono text-muted-foreground uppercase">Select Operating Profile</label>
                  <Select value={selectedJournalistId} onValueChange={setSelectedJournalistId}>
                    <SelectTrigger className="font-mono bg-background">
                      <SelectValue placeholder="Select a journalist profile..." />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingJournalists ? (
                        <SelectItem value="loading" disabled>Loading profiles...</SelectItem>
                      ) : journalists?.map(j => (
                        <SelectItem key={j.id} value={j.id.toString()}>
                          {j.displayName} ({j.outlet})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  className="w-full font-mono uppercase tracking-wider" 
                  onClick={handleClaim}
                  disabled={claimMutation.isPending || !selectedJournalistId}
                >
                  {claimMutation.isPending ? "Processing..." : "Initiate Claim"}
                </Button>
              </CardContent>
            </Card>
          )}

          {leak.claimedByJournalistName && (
             <Card className="bg-muted/10 border-border">
               <CardContent className="p-6 flex items-center space-x-4">
                 <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                   <Lock className="h-6 w-6 text-primary" />
                 </div>
                 <div>
                   <h4 className="font-serif font-bold">Intel Claimed</h4>
                   <p className="text-sm text-muted-foreground font-mono mt-1">
                     Under investigation by {leak.claimedByJournalistName}
                   </p>
                 </div>
               </CardContent>
             </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader className="border-b border-border/50 bg-muted/20">
              <CardTitle className="font-mono text-sm text-muted-foreground uppercase flex items-center">
                <Shield className="mr-2 h-4 w-4" /> Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 text-sm font-mono space-y-4">
              <div>
                <div className="text-muted-foreground mb-1">SOURCE</div>
                <div className="font-bold text-primary">{leak.anonymousHandle}</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">STATUS</div>
                <div className="uppercase">{leak.status}</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">CATEGORY</div>
                <div className="uppercase">{leak.category}</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">ATTACHMENTS</div>
                <div>{leak.documentCount} encrypted files</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">SUBMITTED</div>
                <div>{format(new Date(leak.createdAt), 'yyyy-MM-dd HH:mm:ss')}</div>
              </div>
              {leak.verifiedAt && (
                <div>
                  <div className="text-muted-foreground mb-1">VERIFIED</div>
                  <div>{format(new Date(leak.verifiedAt), 'yyyy-MM-dd HH:mm:ss')}</div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive flex items-start">
            <AlertTriangle className="mr-2 h-4 w-4 flex-shrink-0 mt-0.5" />
            <p>Access to source documents requires cryptographic key exchange outside this terminal.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
