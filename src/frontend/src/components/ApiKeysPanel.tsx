import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ExternalLink, Key } from "lucide-react";

interface ApiKeysPanelProps {
  elevenLabsKey: string;
  preferredVoiceId: string;
  onOpenSettings: () => void;
}

export function ApiKeysPanel({
  elevenLabsKey,
  preferredVoiceId,
  onOpenSettings,
}: ApiKeysPanelProps) {
  const hasKey = !!elevenLabsKey;

  return (
    <div
      className="rounded-lg p-4"
      style={{
        background: "oklch(0.148 0.016 243)",
        border: "1px solid oklch(0.265 0.025 243)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "oklch(0.55 0.015 243)" }}
        >
          API Keys
        </h3>
        <button
          type="button"
          onClick={onOpenSettings}
          className="text-xs transition-opacity hover:opacity-80"
          style={{ color: "oklch(0.52 0.18 258)" }}
          data-ocid="api_keys.settings.button"
        >
          Configure
        </button>
      </div>

      <div className="space-y-3">
        <div
          className="flex items-center justify-between p-3 rounded-lg"
          style={{
            background: "oklch(0.122 0.014 243)",
            border: "1px solid oklch(0.22 0.02 243)",
          }}
        >
          <div className="flex items-center gap-2">
            <Key
              size={13}
              style={{
                color: hasKey
                  ? "oklch(0.72 0.16 258)"
                  : "oklch(0.45 0.015 243)",
              }}
            />
            <div>
              <Label
                className="text-xs font-medium block"
                style={{ color: "oklch(0.78 0.012 243)" }}
              >
                ElevenLabs
              </Label>
              <span
                className="text-xs"
                style={{ color: "oklch(0.5 0.015 243)" }}
              >
                {hasKey ? `••••${elevenLabsKey.slice(-4)}` : "Not configured"}
              </span>
            </div>
          </div>
          <Switch
            checked={hasKey}
            onCheckedChange={() => onOpenSettings()}
            data-ocid="api_keys.elevenlabs.switch"
          />
        </div>

        {hasKey && (
          <div
            className="flex items-center justify-between p-3 rounded-lg"
            style={{
              background: "oklch(0.122 0.014 243)",
              border: "1px solid oklch(0.22 0.02 243)",
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: "oklch(0.6 0.15 160)" }}
              />
              <div>
                <Label
                  className="text-xs font-medium block"
                  style={{ color: "oklch(0.78 0.012 243)" }}
                >
                  Voice ID
                </Label>
                <span
                  className="text-xs font-mono"
                  style={{ color: "oklch(0.5 0.015 243)" }}
                >
                  {preferredVoiceId
                    ? `${preferredVoiceId.slice(0, 8)}...`
                    : "Default"}
                </span>
              </div>
            </div>
            <span
              className="text-xs px-1.5 py-0.5 rounded"
              style={{
                background: "oklch(0.6 0.15 160 / 0.15)",
                color: "oklch(0.6 0.15 160)",
              }}
            >
              Active
            </span>
          </div>
        )}
      </div>

      <a
        href="https://elevenlabs.io"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 mt-3 text-xs transition-opacity hover:opacity-80"
        style={{ color: "oklch(0.52 0.18 258)" }}
      >
        <ExternalLink size={10} /> Get ElevenLabs API key
      </a>
    </div>
  );
}
