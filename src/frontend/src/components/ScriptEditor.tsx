import { Button } from "@/components/ui/button";
import { FileText, Wand2 } from "lucide-react";
import { useRef } from "react";
import { countWords, estimateDuration } from "../utils/sceneDetection";

interface ScriptEditorProps {
  script: string;
  onChange: (script: string) => void;
  onDetectScenes: () => void;
  segmentCount: number;
}

export function ScriptEditor({
  script,
  onChange,
  onDetectScenes,
  segmentCount,
}: ScriptEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const wordCount = countWords(script);
  const duration = estimateDuration(wordCount);
  const lineCount = Math.max(script.split("\n").length, 1);
  // Build a single string of line numbers for display
  const lineNumbersText = Array.from(
    { length: lineCount },
    (_, i) => i + 1,
  ).join("\n");

  return (
    <div
      className="flex flex-col h-full rounded-lg overflow-hidden"
      style={{
        background: "oklch(0.148 0.016 243)",
        border: "1px solid oklch(0.265 0.025 243)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid oklch(0.265 0.025 243)" }}
      >
        <div className="flex items-center gap-2">
          <FileText size={15} style={{ color: "oklch(0.52 0.18 258)" }} />
          <span
            className="text-sm font-semibold"
            style={{ color: "oklch(0.92 0.012 243)" }}
          >
            Script Editor
          </span>
        </div>
        <Button
          type="button"
          onClick={onDetectScenes}
          data-ocid="script.detect_scenes.button"
          size="sm"
          className="h-7 text-xs gap-1.5 px-3"
          style={{
            background: "oklch(0.76 0.16 70 / 0.15)",
            border: "1px solid oklch(0.76 0.16 70 / 0.4)",
            color: "oklch(0.76 0.16 70)",
          }}
        >
          <Wand2 size={12} />
          Detect Scenes
        </Button>
      </div>

      {/* Editor area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Line numbers - rendered as a pre block for performance */}
        <pre
          aria-hidden="true"
          className="text-xs leading-6 font-mono text-right px-3 pt-3 select-none overflow-hidden"
          style={{
            minWidth: 40,
            background: "oklch(0.122 0.014 243)",
            borderRight: "1px solid oklch(0.265 0.025 243)",
            color: "oklch(0.4 0.015 243)",
            margin: 0,
          }}
        >
          {lineNumbersText}
        </pre>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={script}
          onChange={(e) => onChange(e.target.value)}
          data-ocid="script.textarea"
          className="flex-1 resize-none outline-none p-3 text-sm leading-6 font-mono"
          style={{
            background: "oklch(0.122 0.014 243)",
            color: "oklch(0.85 0.012 243)",
            minHeight: 300,
          }}
          placeholder={`Paste your video script here...\n\nTip: Use 'Scene 1:', 'Scene 2:' or empty lines to separate scenes.`}
          spellCheck={false}
        />
      </div>

      {/* Footer stats */}
      <div
        className="flex items-center gap-6 px-4 py-2.5 text-xs"
        style={{
          borderTop: "1px solid oklch(0.265 0.025 243)",
          background: "oklch(0.132 0.015 243)",
        }}
      >
        <span style={{ color: "oklch(0.55 0.015 243)" }}>
          Words:{" "}
          <span style={{ color: "oklch(0.72 0.12 258)" }}>{wordCount}</span>
        </span>
        <span style={{ color: "oklch(0.55 0.015 243)" }}>
          Scenes:{" "}
          <span style={{ color: "oklch(0.72 0.12 258)" }}>{segmentCount}</span>
        </span>
        <span style={{ color: "oklch(0.55 0.015 243)" }}>
          Est. Duration:{" "}
          <span style={{ color: "oklch(0.72 0.12 258)" }}>{duration}</span>
        </span>
      </div>
    </div>
  );
}
