import { AlertTriangle, ExternalLink } from "lucide-react";

interface ApiKeysBannerProps {
  onOpenSettings: () => void;
}

export function ApiKeysBanner({ onOpenSettings }: ApiKeysBannerProps) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-2.5 rounded-lg"
      style={{
        background: "oklch(0.76 0.16 70 / 0.08)",
        border: "1px solid oklch(0.76 0.16 70 / 0.3)",
      }}
      data-ocid="api_key.warning.panel"
    >
      <AlertTriangle
        size={15}
        style={{ color: "oklch(0.76 0.16 70)", flexShrink: 0 }}
      />
      <p className="text-xs flex-1" style={{ color: "oklch(0.82 0.1 70)" }}>
        Add your ElevenLabs API key in Settings to enable voice generation.
      </p>
      <button
        type="button"
        onClick={onOpenSettings}
        className="text-xs font-medium underline transition-opacity hover:opacity-80"
        style={{ color: "oklch(0.76 0.16 70)", whiteSpace: "nowrap" }}
        data-ocid="api_key.settings.button"
      >
        Open Settings
      </button>
      <a
        href="https://elevenlabs.io"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-xs font-medium transition-opacity hover:opacity-80"
        style={{ color: "oklch(0.72 0.12 258)", whiteSpace: "nowrap" }}
        data-ocid="api_key.get_key.link"
      >
        Get API Key
        <ExternalLink size={10} />
      </a>
    </div>
  );
}
