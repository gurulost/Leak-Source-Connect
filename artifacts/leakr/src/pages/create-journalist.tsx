import { useState } from "react";
import { useLocation } from "wouter";
import { useCreateJournalist, getListJournalistsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, X, Plus, CheckCircle2 } from "lucide-react";

const COMMON_SPECIALIZATIONS = [
  "Government", "National Security", "Corporate Fraud", "Finance",
  "Healthcare", "Environment", "Technology", "Law Enforcement",
  "Civil Rights", "Immigration", "International Affairs", "Climate"
];

export function CreateJournalist() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const createJournalist = useCreateJournalist();

  const [displayName, setDisplayName] = useState("");
  const [outlet, setOutlet] = useState("");
  const [bio, setBio] = useState("");
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [customSpec, setCustomSpec] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const toggleSpec = (spec: string) => {
    setSpecializations(prev =>
      prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]
    );
  };

  const addCustomSpec = () => {
    const trimmed = customSpec.trim();
    if (trimmed && !specializations.includes(trimmed)) {
      setSpecializations(prev => [...prev, trimmed]);
      setCustomSpec("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName || !outlet || !bio) return;

    const result = await createJournalist.mutateAsync({
      data: { displayName, outlet, bio, specializations },
    });

    queryClient.invalidateQueries({ queryKey: getListJournalistsQueryKey() });
    setSubmitted(true);
    setTimeout(() => navigate(`/journalists/${result.id}`), 1500);
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold font-serif">Profile Created</h2>
        <p className="text-muted-foreground font-mono text-sm">Redirecting to your profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate("/journalists")} className="font-mono text-xs -ml-2">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Journalists
      </Button>

      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
          <Users className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-serif">Register Profile</h1>
          <p className="text-muted-foreground text-sm font-mono">JOURNALIST CREDENTIAL REGISTRATION</p>
        </div>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="font-serif text-lg">Journalist Profile</CardTitle>
          <CardDescription className="font-mono text-xs">
            Register your press credentials to claim and publish leaks. Your profile is visible to sources.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Display Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Your byline name..."
                  className="font-mono text-sm bg-background"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="outlet" className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  News Outlet <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="outlet"
                  placeholder="The Times, Substack, etc..."
                  className="font-mono text-sm bg-background"
                  value={outlet}
                  onChange={(e) => setOutlet(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Bio <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="bio"
                placeholder="Brief professional biography. What have you covered? What's your expertise? Sources need to trust you..."
                className="font-mono text-sm bg-background min-h-[100px]"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                required
              />
            </div>

            <div className="space-y-3">
              <Label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Specializations
              </Label>
              <div className="flex flex-wrap gap-2">
                {COMMON_SPECIALIZATIONS.map(spec => (
                  <button
                    key={spec}
                    type="button"
                    onClick={() => toggleSpec(spec)}
                    className={`text-xs font-mono px-3 py-1 rounded border transition-colors ${
                      specializations.includes(spec)
                        ? "border-primary/50 bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    {spec}
                  </button>
                ))}
              </div>
              {specializations.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {specializations.map(spec => (
                    <Badge key={spec} variant="outline" className="font-mono text-xs border-primary/30 text-primary gap-1">
                      {spec}
                      <button type="button" onClick={() => toggleSpec(spec)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  placeholder="Add custom specialization..."
                  className="font-mono text-sm bg-background"
                  value={customSpec}
                  onChange={(e) => setCustomSpec(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomSpec())}
                />
                <Button type="button" variant="secondary" onClick={addCustomSpec} size="sm" className="font-mono">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={createJournalist.isPending || !displayName || !outlet || !bio}
                className="font-mono uppercase tracking-wider"
              >
                {createJournalist.isPending ? "Creating..." : "Create Profile"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="font-mono text-xs"
                onClick={() => navigate("/journalists")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
