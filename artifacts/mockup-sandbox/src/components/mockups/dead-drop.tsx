import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LeakrShell, SENSITIVITY_COLORS } from "./_theme";
import { GlowCard } from "./_shared-components";
import { MOCK_CATEGORIES, type LeakSensitivity } from "./_mock-data";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CheckCircle, Copy, AlertCircle } from "lucide-react";

const DeadDrop: React.FC = () => {
  const [step, setStep] = useState<"form" | "submitted">("form");
  const [sensitivity, setSensitivity] = useState<LeakSensitivity>("medium");
  const [formData, setFormData] = useState({
    title: "",
    teaser: "",
    category: "",
    documentCount: 1,
  });
  const [generatedHandle, setGeneratedHandle] = useState("");

  const handleSubmit = () => {
    // Generate a random anonymous handle
    const adjectives = ["ghost", "phantom", "shadow", "cipher", "veil", "echo", "specter", "wraith", "mirage", "signal"];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const num = Math.floor(1000 + Math.random() * 9000);
    const handle = `${adj}-${num}`;
    setGeneratedHandle(handle);
    setStep("submitted");
  };

  const color = SENSITIVITY_COLORS[sensitivity];
  const isValid = !!(formData.title && formData.teaser && formData.category);

  return (
    <LeakrShell>
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        {/* Ambient color overlay based on sensitivity */}
        <motion.div
          className="fixed inset-0 pointer-events-none"
          animate={{
            backgroundColor: `${color}08`,
          }}
          transition={{ duration: 0.5 }}
        />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-2xl"
        >
          <AnimatePresence mode="wait">
            {step === "form" ? (
              <SubmissionForm
                key="form"
                formData={formData}
                setFormData={setFormData}
                sensitivity={sensitivity}
                setSensitivity={setSensitivity}
                onSubmit={handleSubmit}
                isValid={isValid}
                color={color}
              />
            ) : (
              <ConfirmationScreen
                key="confirmed"
                handle={generatedHandle}
                onReset={() => {
                  setStep("form");
                  setFormData({ title: "", teaser: "", category: "", documentCount: 1 });
                  setSensitivity("medium");
                }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </LeakrShell>
  );
};

interface SubmissionFormProps {
  formData: {
    title: string;
    teaser: string;
    category: string;
    documentCount: number;
  };
  setFormData: (data: any) => void;
  sensitivity: LeakSensitivity;
  setSensitivity: (s: LeakSensitivity) => void;
  onSubmit: () => void;
  isValid: boolean;
  color: string;
}

const SubmissionForm: React.FC<SubmissionFormProps> = ({
  formData,
  setFormData,
  sensitivity,
  setSensitivity,
  onSubmit,
  isValid,
  color,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <motion.div className="text-center mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <h1 className="text-4xl font-bold font-terminal text-primary mb-2">
          ▮ DEAD DROP
        </h1>
        <p className="text-xs text-muted-foreground font-terminal">
          Secure Anonymous Submission
        </p>
      </motion.div>

      {/* Form */}
      <GlowCard glowColor={color}>
        <CardContent className="p-8 space-y-6">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <Label htmlFor="title" className="font-terminal text-xs">
              SUBJECT
            </Label>
            <Input
              id="title"
              placeholder="Headline of your leak..."
              className="font-terminal text-sm bg-background/50 border-primary/20"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </motion.div>

          {/* Teaser */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="space-y-2"
          >
            <Label htmlFor="teaser" className="font-terminal text-xs">
              DESCRIPTION
            </Label>
            <Textarea
              id="teaser"
              placeholder="Brief summary of what you're submitting..."
              className="font-terminal text-sm bg-background/50 border-primary/20 min-h-24"
              value={formData.teaser}
              onChange={(e) => setFormData({ ...formData, teaser: e.target.value })}
            />
          </motion.div>

          {/* Category */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-2"
          >
            <Label htmlFor="category" className="font-terminal text-xs">
              CATEGORY
            </Label>
            <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
              <SelectTrigger className="font-terminal text-sm h-10 bg-background/50 border-primary/20">
                <SelectValue placeholder="Select category..." />
              </SelectTrigger>
              <SelectContent>
                {MOCK_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>

          {/* Sensitivity Selector */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="space-y-3"
          >
            <Label className="font-terminal text-xs">SENSITIVITY LEVEL</Label>
            <div className="grid grid-cols-4 gap-2">
              {(["low", "medium", "high", "critical"] as LeakSensitivity[]).map((level) => (
                <motion.button
                  key={level}
                  onClick={() => setSensitivity(level)}
                  className="p-3 rounded border font-terminal text-xs font-bold uppercase transition-all"
                  style={{
                    borderColor: SENSITIVITY_COLORS[level],
                    backgroundColor: sensitivity === level ? `${SENSITIVITY_COLORS[level]}20` : "transparent",
                    color: SENSITIVITY_COLORS[level],
                    boxShadow:
                      sensitivity === level
                        ? `0 0 15px ${SENSITIVITY_COLORS[level]}40, inset 0 0 10px ${SENSITIVITY_COLORS[level]}10`
                        : "none",
                  }}
                  animate={sensitivity === level ? { scale: 1.05 } : { scale: 1 }}
                >
                  {level}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Document Count */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-2"
          >
            <Label htmlFor="docs" className="font-terminal text-xs">
              NUMBER OF DOCUMENTS
            </Label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFormData({ ...formData, documentCount: Math.max(1, formData.documentCount - 1) })}
                className="px-3 py-2 border border-primary/20 rounded text-sm font-terminal"
              >
                −
              </button>
              <Input
                id="docs"
                type="number"
                min="1"
                max="999"
                className="flex-1 font-terminal text-center bg-background/50 border-primary/20"
                value={formData.documentCount}
                onChange={(e) => setFormData({ ...formData, documentCount: Math.max(1, parseInt(e.target.value) || 1) })}
              />
              <button
                onClick={() => setFormData({ ...formData, documentCount: formData.documentCount + 1 })}
                className="px-3 py-2 border border-primary/20 rounded text-sm font-terminal"
              >
                +
              </button>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="pt-4"
          >
            <Button
              onClick={onSubmit}
              disabled={!isValid}
              className="w-full font-terminal text-sm font-bold uppercase py-3 bg-primary text-black hover:bg-primary/90"
              style={{
                backgroundColor: isValid ? "#00ff41" : "#00ff4140",
                cursor: isValid ? "pointer" : "not-allowed",
              }}
            >
              DROP IT
            </Button>
          </motion.div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-[10px] text-muted-foreground text-center font-terminal"
          >
            All submissions are anonymous. You will receive a handle to track your leak. Do not lose it.
          </motion.p>
        </CardContent>
      </GlowCard>
    </motion.div>
  );
};

interface ConfirmationScreenProps {
  handle: string;
  onReset: () => void;
}

const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({ handle, onReset }) => {
  const [copied, setCopied] = useState(false);

  const copyHandle = () => {
    navigator.clipboard.writeText(handle);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
    >
      {/* Success Flash */}
      <motion.div
        className="fixed inset-0 bg-white pointer-events-none"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      />

      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div className="mb-4" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: "spring" }}>
          <CheckCircle className="w-16 h-16 mx-auto text-primary" />
        </motion.div>
        <h1 className="text-3xl font-bold font-terminal text-primary mb-2">
          ▮ DROPPED
        </h1>
        <p className="text-xs text-muted-foreground font-terminal">
          Your submission has been received
        </p>
      </motion.div>

      {/* Handle Display */}
      <GlowCard glowColor="#00ff41">
        <CardContent className="p-8 space-y-6">
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-center text-xs text-muted-foreground font-terminal">YOUR ANONYMOUS HANDLE</p>

            <motion.div
              className="relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="text-4xl font-bold font-terminal text-primary text-center tracking-wider">
                {handle}
              </div>
            </motion.div>

            <motion.button
              onClick={copyHandle}
              className="w-full py-3 border border-primary/30 rounded font-terminal text-xs uppercase flex items-center justify-center gap-2 hover:bg-primary/10 transition"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Copy className="w-4 h-4" />
              {copied ? "COPIED!" : "COPY HANDLE"}
            </motion.button>
          </motion.div>

          {/* Warning */}
          <motion.div
            className="p-4 border-l-2 border-destructive/50 bg-destructive/10 space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex gap-2 items-start">
              <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-destructive font-terminal">CRITICAL</p>
                <p className="text-xs text-destructive/80">
                  This handle will not be shown again. It will not be sent to you. Memorize it or save it somewhere safe to track your submission.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            className="pt-4 space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-[10px] text-muted-foreground text-center font-terminal">
              You can use this handle to check the status of your leak. Keep it private.
            </p>
            <Button
              onClick={onReset}
              variant="outline"
              className="w-full font-terminal text-xs uppercase border-primary/30"
            >
              Submit Another Leak
            </Button>
          </motion.div>
        </CardContent>
      </GlowCard>
    </motion.div>
  );
};

export default DeadDrop;
