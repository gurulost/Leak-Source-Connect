import { useState } from "react";
import { useLocation } from "wouter";
import { useCreateLeak, useListCategories, getListLeaksQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Eye, AlertTriangle, CheckCircle2 } from "lucide-react";

export function SubmitLeak() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { data: categories } = useListCategories();
  const createLeak = useCreateLeak();

  const [title, setTitle] = useState("");
  const [teaser, setTeaser] = useState("");
  const [category, setCategory] = useState("");
  const [sensitivity, setSensitivity] = useState<"low" | "medium" | "high" | "critical">("medium");
  const [documentCount, setDocumentCount] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submittedHandle, setSubmittedHandle] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !teaser || !category) return;

    const result = await createLeak.mutateAsync({
      data: { title, teaser, category, sensitivity, documentCount },
    });

    setSubmittedHandle(result.anonymousHandle);
    setSubmitted(true);
    queryClient.invalidateQueries({ queryKey: getListLeaksQueryKey() });
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <div className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-serif">Submission Received</h1>
            <p className="text-muted-foreground mt-2">Your intelligence has been securely submitted and queued for verification.</p>
          </div>
          <Card className="bg-card border-primary/30 text-left">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1">
                <p className="text-xs font-mono uppercase text-muted-foreground">Your Anonymous Handle</p>
                <p className="text-xl font-mono text-primary tracking-wider">{submittedHandle}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Keep this handle private. It is the only identifier associated with your submission. 
                No personal information was collected or stored.
              </p>
              <div className="grid grid-cols-3 gap-3 pt-2">
                {["No IP logging", "No metadata", "Encrypted at rest"].map(item => (
                  <div key={item} className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                    <Lock className="h-3 w-3 text-primary flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <div className="flex gap-3 justify-center">
            <Button variant="secondary" onClick={() => navigate("/leaks")} className="font-mono uppercase tracking-wider text-xs">
              Browse Intel Feed
            </Button>
            <Button onClick={() => { setSubmitted(false); setTitle(""); setTeaser(""); setCategory(""); }} className="font-mono uppercase tracking-wider text-xs">
              Submit Another
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-serif">Secure Submission</h1>
            <p className="text-muted-foreground text-sm font-mono">ANONYMOUS INTEL SUBMISSION TERMINAL</p>
          </div>
        </div>
        <div className="flex gap-3 flex-wrap">
          {["End-to-end encrypted", "Zero metadata stored", "Anonymous by design"].map(item => (
            <Badge key={item} variant="outline" className="font-mono text-xs border-primary/30 text-primary/80">
              <Shield className="mr-1 h-3 w-3" /> {item}
            </Badge>
          ))}
        </div>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="font-serif text-lg">Intelligence Submission Form</CardTitle>
          <CardDescription className="font-mono text-xs">
            Your identity is never collected. Provide enough information for a journalist to assess the value of your submission.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Submission Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="A concise, descriptive headline for your submission..."
                className="font-mono text-sm bg-background"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="teaser" className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Summary / Teaser <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="teaser"
                placeholder="Describe what you have without revealing the full contents. This is what journalists will see when browsing. Be specific about the nature and significance of the information..."
                className="font-mono text-sm bg-background min-h-[140px]"
                value={teaser}
                onChange={(e) => setTeaser(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground font-mono">
                Be precise but don't give everything away. A strong teaser gets claimed faster.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Category <span className="text-destructive">*</span>
                </Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger className="font-mono text-sm bg-background">
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map(c => (
                      <SelectItem key={c.id} value={c.slug} className="font-mono text-sm">{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Sensitivity Level
                </Label>
                <Select value={sensitivity} onValueChange={(v) => setSensitivity(v as typeof sensitivity)}>
                  <SelectTrigger className="font-mono text-sm bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low" className="font-mono text-sm">
                      <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-green-500" /> Low</span>
                    </SelectItem>
                    <SelectItem value="medium" className="font-mono text-sm">
                      <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-amber-500" /> Medium</span>
                    </SelectItem>
                    <SelectItem value="high" className="font-mono text-sm">
                      <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-orange-500" /> High</span>
                    </SelectItem>
                    <SelectItem value="critical" className="font-mono text-sm">
                      <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-destructive" /> Critical</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="doccount" className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Number of Documents
              </Label>
              <Input
                id="doccount"
                type="number"
                min={1}
                max={9999}
                className="font-mono text-sm bg-background w-32"
                value={documentCount}
                onChange={(e) => setDocumentCount(parseInt(e.target.value, 10) || 1)}
              />
            </div>

            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 flex gap-3">
              <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-xs font-mono text-muted-foreground space-y-1">
                <p className="text-amber-500 font-medium">OPERATIONAL SECURITY REMINDER</p>
                <p>Do not include any identifying information in your submission. Remove metadata from documents before sharing. Consider using Tor or a VPN.</p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={createLeak.isPending || !title || !teaser || !category}
                className="font-mono uppercase tracking-wider"
              >
                {createLeak.isPending ? (
                  <>Submitting...</>
                ) : (
                  <><Lock className="mr-2 h-4 w-4" /> Submit Securely</>
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="font-mono text-xs"
                onClick={() => navigate("/leaks")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-card/50 border-dashed border-border">
        <CardContent className="p-5 grid grid-cols-3 divide-x divide-border text-center">
          {[
            { icon: Lock, label: "No Logs", desc: "Zero server-side logging" },
            { icon: Eye, label: "Anonymous", desc: "No identity collected" },
            { icon: Shield, label: "Encrypted", desc: "All data encrypted at rest" },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="px-4 space-y-1">
              <Icon className="h-5 w-5 text-primary mx-auto" />
              <p className="text-xs font-mono font-medium text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
