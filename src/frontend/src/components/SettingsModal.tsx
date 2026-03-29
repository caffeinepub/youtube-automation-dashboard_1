import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";

const POPULAR_VOICES = [
  { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel", style: "Calm, professional" },
  { id: "AZnzlk1XvdvUeBnXmlld", name: "Domi", style: "Strong, confident" },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Bella", style: "Soft, warm" },
  {
    id: "ErXwobaYiN019PkySvjV",
    name: "Antoni",
    style: "Well-rounded, natural",
  },
];

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  elevenLabsKey: string;
  preferredVoiceId: string;
  onSave: (key: string, voiceId: string) => Promise<void>;
}

export function SettingsModal({
  open,
  onClose,
  elevenLabsKey,
  preferredVoiceId,
  onSave,
}: SettingsModalProps) {
  const [apiKey, setApiKey] = useState(elevenLabsKey);
  const [voiceId, setVoiceId] = useState(
    preferredVoiceId || "21m00Tcm4TlvDq8ikWAM",
  );
  const [showKey, setShowKey] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(apiKey, voiceId);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-lg"
        style={{
          background: "oklch(0.148 0.016 243)",
          border: "1px solid oklch(0.265 0.025 243)",
          color: "oklch(0.92 0.012 243)",
        }}
        data-ocid="settings.dialog"
      >
        <DialogHeader>
          <DialogTitle style={{ color: "oklch(0.92 0.012 243)" }}>
            API & Voice Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* ElevenLabs Key */}
          <div className="space-y-2">
            <Label
              className="text-sm font-medium"
              style={{ color: "oklch(0.78 0.012 243)" }}
            >
              ElevenLabs API Key
            </Label>
            <div className="relative">
              <Input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="pr-10"
                style={{
                  background: "oklch(0.122 0.014 243)",
                  border: "1px solid oklch(0.265 0.025 243)",
                  color: "oklch(0.85 0.012 243)",
                }}
                data-ocid="settings.api_key.input"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-80"
                style={{ color: "oklch(0.5 0.015 243)" }}
                onClick={() => setShowKey((v) => !v)}
                data-ocid="settings.show_key.toggle"
              >
                {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            <p className="text-xs" style={{ color: "oklch(0.5 0.015 243)" }}>
              Don't have an API key?{" "}
              <a
                href="https://elevenlabs.io"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 underline"
                style={{ color: "oklch(0.72 0.12 258)" }}
              >
                Get one free at elevenlabs.io <ExternalLink size={10} />
              </a>
            </p>
          </div>

          <Separator style={{ background: "oklch(0.265 0.025 243)" }} />

          {/* Voice ID */}
          <div className="space-y-2">
            <Label
              className="text-sm font-medium"
              style={{ color: "oklch(0.78 0.012 243)" }}
            >
              Voice ID
            </Label>
            <Input
              value={voiceId}
              onChange={(e) => setVoiceId(e.target.value)}
              placeholder="21m00Tcm4TlvDq8ikWAM"
              className="font-mono text-sm"
              style={{
                background: "oklch(0.122 0.014 243)",
                border: "1px solid oklch(0.265 0.025 243)",
                color: "oklch(0.85 0.012 243)",
              }}
              data-ocid="settings.voice_id.input"
            />

            <div className="space-y-1.5">
              <p
                className="text-xs font-medium"
                style={{ color: "oklch(0.55 0.015 243)" }}
              >
                Popular Voices
              </p>
              {POPULAR_VOICES.map((voice) => (
                <button
                  key={voice.id}
                  type="button"
                  onClick={() => setVoiceId(voice.id)}
                  className="flex items-center justify-between w-full px-3 py-2 rounded-md text-left transition-colors"
                  style={{
                    background:
                      voiceId === voice.id
                        ? "oklch(0.52 0.18 258 / 0.15)"
                        : "oklch(0.122 0.014 243)",
                    border:
                      voiceId === voice.id
                        ? "1px solid oklch(0.52 0.18 258 / 0.4)"
                        : "1px solid oklch(0.22 0.02 243)",
                  }}
                >
                  <div>
                    <span
                      className="text-xs font-medium"
                      style={{ color: "oklch(0.85 0.012 243)" }}
                    >
                      {voice.name}
                    </span>
                    <span
                      className="text-xs ml-2"
                      style={{ color: "oklch(0.55 0.015 243)" }}
                    >
                      {voice.style}
                    </span>
                  </div>
                  <span
                    className="text-xs font-mono"
                    style={{ color: "oklch(0.45 0.015 243)" }}
                  >
                    {voice.id.slice(0, 8)}...
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            style={{
              background: "oklch(0.19 0.02 243)",
              border: "1px solid oklch(0.265 0.025 243)",
              color: "oklch(0.72 0.012 243)",
            }}
            data-ocid="settings.cancel.button"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={saving}
            style={{ background: "oklch(0.52 0.18 258)", color: "white" }}
            data-ocid="settings.save.button"
          >
            {saving ? (
              <Loader2 size={14} className="mr-2 animate-spin" />
            ) : null}
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
