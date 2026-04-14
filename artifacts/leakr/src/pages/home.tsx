import { motion } from "framer-motion";
import { Link } from "wouter";
import { Shield, Lock, Eye, ArrowRight, ShieldAlert, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Home() {
  return (
    <div className="flex flex-col space-y-16">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
        
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6 font-mono">
              <ShieldAlert className="mr-2 h-4 w-4" />
              SECURE SECRETS EXCHANGE
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl font-serif text-foreground">
              Truth in the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50">Shadows.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Leakr connects courageous whistleblowers with verified journalists. An anonymous, high-stakes intelligence platform built for those risking everything to expose the truth.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/leaks/submit">
                <Button size="lg" className="w-full sm:w-auto font-mono uppercase tracking-wider">
                  <Lock className="mr-2 h-4 w-4" />
                  Submit a Leak Anonymously
                </Button>
              </Link>
              <Link href="/leaks">
                <Button size="lg" variant="outline" className="w-full sm:w-auto font-mono uppercase tracking-wider border-primary/30 hover:bg-primary/10">
                  <Eye className="mr-2 h-4 w-4" />
                  Browse Intelligence
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="grid gap-8 md:grid-cols-3">
        <motion.div 
          className="rounded-xl border border-border bg-card p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
            <Lock className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold font-serif mb-2">Absolute Anonymity</h3>
          <p className="text-muted-foreground">Sources are assigned randomized cryptographic handles. Zero tracking. Zero logs. Your identity remains protected.</p>
        </motion.div>

        <motion.div 
          className="rounded-xl border border-border bg-card p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
            <Shield className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold font-serif mb-2">Verified Journalists</h3>
          <p className="text-muted-foreground">Only verified, reputable journalists from established news organizations can claim and publish high-sensitivity leaks.</p>
        </motion.div>

        <motion.div 
          className="rounded-xl border border-border bg-card p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
            <Activity className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold font-serif mb-2">Live Intelligence</h3>
          <p className="text-muted-foreground">Track the status of submissions in real-time as they move from pending, to verified, to claimed, and finally published.</p>
        </motion.div>
      </section>

      {/* Call to action */}
      <section className="rounded-2xl border border-primary/20 bg-card overflow-hidden">
        <div className="px-6 py-12 sm:px-12 sm:py-16 lg:flex lg:items-center lg:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-serif">
              Ready to expose the truth?
              <br />
              <span className="text-primary">We're ready to protect you.</span>
            </h2>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">
              Join the network of brave insiders and dedicated journalists holding power accountable.
            </p>
          </div>
          <div className="mt-8 flex gap-4 lg:mt-0 lg:flex-shrink-0">
            <Link href="/dashboard">
              <Button size="lg" className="font-mono uppercase tracking-wider">
                View Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
