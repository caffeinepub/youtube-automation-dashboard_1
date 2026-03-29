import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  Mic,
  Pause,
  Play,
  Sparkles,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { SegmentState } from "../types";
import { suggestBrollKeywords } from "../utils/sceneDetection";

interface SegmentCardProps {
  segment: SegmentState;
  onUpdate: (updated: SegmentState) => void;
  onGenerateVoice: (segmentIndex: number) => void;
  hasApiKey: boolean;
  index: number;
}

export function SegmentCard({
  segment,
  onUpdate,
  onGenerateVoice,
  hasApiKey,
  index,
}: SegmentCardProps) {
  const [expanded, setExpanded] = useState(index < 3);
  const [keywordInput, setKeywordInput] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const ocidIndex = index + 1;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, []);

  const addKeyword = (kw: string) => {
    const trimmed = kw.trim().toLowerCase();
    if (!trimmed || segment.brollKeywords.includes(trimmed)) return;
    onUpdate({
      ...segment,
      brollKeywords: [...segment.brollKeywords, trimmed],
    });
    setKeywordInput("");
  };

  const removeKeyword = (kw: string) => {
    onUpdate({
      ...segment,
      brollKeywords: segment.brollKeywords.filter((k) => k !== kw),
    });
  };

  const handleAutoSuggest = () => {
    const suggestions = suggestBrollKeywords(segment.text);
    const newKws = suggestions.filter(
      (s) => !segment.brollKeywords.includes(s),
    );
    onUpdate({
      ...segment,
      brollKeywords: [...segment.brollKeywords, ...newKws],
    });
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const previewText =
    segment.text.slice(0, 80) + (segment.text.length > 80 ? "..." : "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-lg overflow-hidden"
      style={{
        background: "oklch(0.172 0.018 243)",
        border: "1px solid oklch(0.265 0.025 243)",
      }}
      data-ocid={`scene.card.${ocidIndex}`}
    >
      {/* Card header - full-width button */}
      <button
        type="button"
        className="flex items-center justify-between w-full px-4 py-3 text-left cursor-pointer"
        style={{
          borderBottom: expanded ? "1px solid oklch(0.265 0.025 243)" : "none",
          background: "oklch(0.148 0.016 243)",
        }}
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-2.5">
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{
              background: "oklch(0.52 0.18 258 / 0.18)",
              color: "oklch(0.72 0.16 258)",
              border: "1px solid oklch(0.52 0.18 258 / 0.3)",
            }}
          >
            {ocidIndex}
          </span>
          <span
            className="text-xs font-semibold"
            style={{ color: "oklch(0.76 0.16 70)" }}
          >
            Scene {ocidIndex}
          </span>
          <span
            className="text-xs truncate max-w-[160px]"
            style={{ color: "oklch(0.6 0.012 243)" }}
          >
            — {previewText}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {segment.audioUrl && (
            <span
              className="text-xs px-1.5 py-0.5 rounded"
              style={{
                background: "oklch(0.52 0.18 258 / 0.15)",
                color: "oklch(0.72 0.16 258)",
              }}
            >
              ✓ Audio
            </span>
          )}
          {expanded ? (
            <ChevronUp size={14} style={{ color: "oklch(0.5 0.015 243)" }} />
          ) : (
            <ChevronDown size={14} style={{ color: "oklch(0.5 0.015 243)" }} />
          )}
        </div>
      </button>

      {expanded && (
        <div className="p-4 space-y-4">
          {/* Script text */}
          <div>
            <p
              className="text-xs font-medium mb-1.5"
              style={{ color: "oklch(0.55 0.015 243)" }}
            >
              Script Text
            </p>
            <p
              className="text-xs leading-relaxed p-3 rounded-md"
              style={{
                background: "oklch(0.122 0.014 243)",
                color: "oklch(0.75 0.012 243)",
                border: "1px solid oklch(0.22 0.02 243)",
              }}
            >
              {segment.text}
            </p>
          </div>

          {/* B-Roll Keywords */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p
                className="text-xs font-medium"
                style={{ color: "oklch(0.55 0.015 243)" }}
              >
                B-Roll Keywords
              </p>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-6 px-2 text-xs gap-1"
                style={{
                  color: "oklch(0.76 0.16 70)",
                  background: "oklch(0.76 0.16 70 / 0.08)",
                }}
                onClick={handleAutoSuggest}
                data-ocid={`scene.suggest.button.${ocidIndex}`}
              >
                <Sparkles size={10} />
                Auto-suggest
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {segment.brollKeywords.map((kw) => (
                <span
                  key={kw}
                  className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: "oklch(0.21 0.022 243)",
                    color: "oklch(0.78 0.012 243)",
                    border: "1px solid oklch(0.265 0.025 243)",
                  }}
                >
                  {kw}
                  <button
                    type="button"
                    onClick={() => removeKeyword(kw)}
                    className="hover:text-red-400 transition-colors"
                    style={{ color: "oklch(0.5 0.015 243)" }}
                    aria-label={`Remove ${kw}`}
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
              {segment.brollKeywords.length === 0 && (
                <span
                  className="text-xs"
                  style={{ color: "oklch(0.4 0.015 243)" }}
                >
                  No keywords yet
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Input
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addKeyword(keywordInput)}
                placeholder="Add keyword..."
                className="h-7 text-xs"
                style={{
                  background: "oklch(0.122 0.014 243)",
                  border: "1px solid oklch(0.265 0.025 243)",
                  color: "oklch(0.85 0.012 243)",
                }}
                data-ocid={`scene.keyword.input.${ocidIndex}`}
              />
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-7 px-2 text-xs"
                style={{
                  background: "oklch(0.19 0.02 243)",
                  border: "1px solid oklch(0.265 0.025 243)",
                  color: "oklch(0.72 0.12 258)",
                }}
                onClick={() => addKeyword(keywordInput)}
              >
                Add
              </Button>
            </div>
          </div>

          {/* Voice Generation */}
          <div>
            <p
              className="text-xs font-medium mb-2"
              style={{ color: "oklch(0.55 0.015 243)" }}
            >
              Voice Generation
            </p>

            {segment.audioError && (
              <p
                className="text-xs mb-2 px-2 py-1.5 rounded"
                style={{
                  background: "oklch(0.577 0.245 27 / 0.12)",
                  color: "oklch(0.75 0.18 27)",
                  border: "1px solid oklch(0.577 0.245 27 / 0.3)",
                }}
                data-ocid={`scene.audio.error_state.${ocidIndex}`}
              >
                ⚠ {segment.audioError}
              </p>
            )}

            {segment.audioUrl ? (
              <div
                className="flex items-center gap-3 p-2 rounded-md"
                style={{
                  background: "oklch(0.122 0.014 243)",
                  border: "1px solid oklch(0.265 0.025 243)",
                }}
              >
                <button
                  type="button"
                  onClick={togglePlay}
                  className="flex items-center justify-center rounded-full w-7 h-7 flex-shrink-0 transition-colors"
                  style={{ background: "oklch(0.52 0.18 258)", color: "white" }}
                  data-ocid={`scene.audio.toggle.${ocidIndex}`}
                  aria-label={isPlaying ? "Pause audio" : "Play audio"}
                >
                  {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                </button>
                <div className="flex-1">
                  <div
                    className="h-1.5 rounded-full"
                    style={{ background: "oklch(0.265 0.025 243)" }}
                  >
                    <div
                      className="h-1.5 rounded-full w-0"
                      style={{ background: "oklch(0.52 0.18 258)" }}
                    />
                  </div>
                </div>
                <span
                  className="text-xs"
                  style={{ color: "oklch(0.5 0.015 243)" }}
                >
                  Audio ready
                </span>
                {/* biome-ignore lint/a11y/useMediaCaption: voice-generated audio has no captions */}
                <audio
                  ref={audioRef}
                  src={segment.audioUrl}
                  className="hidden"
                />
              </div>
            ) : (
              <Button
                type="button"
                onClick={() => onGenerateVoice(segment.index)}
                disabled={!hasApiKey || segment.isGenerating}
                size="sm"
                className="h-7 text-xs gap-1.5 w-full"
                style={{
                  background: hasApiKey
                    ? "oklch(0.52 0.18 258 / 0.85)"
                    : "oklch(0.22 0.02 243)",
                  color: hasApiKey ? "white" : "oklch(0.45 0.015 243)",
                  border: "none",
                }}
                data-ocid={`scene.generate_voice.button.${ocidIndex}`}
              >
                {segment.isGenerating ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Mic size={12} />
                )}
                {segment.isGenerating ? "Generating..." : "Generate Voice"}
              </Button>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
