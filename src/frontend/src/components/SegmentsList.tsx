import { ScrollArea } from "@/components/ui/scroll-area";
import { Layers } from "lucide-react";
import type { SegmentState } from "../types";
import { SegmentCard } from "./SegmentCard";

interface SegmentsListProps {
  segments: SegmentState[];
  onUpdateSegment: (updated: SegmentState) => void;
  onGenerateVoice: (segmentIndex: number) => void;
  hasApiKey: boolean;
}

export function SegmentsList({
  segments,
  onUpdateSegment,
  onGenerateVoice,
  hasApiKey,
}: SegmentsListProps) {
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
          <Layers size={15} style={{ color: "oklch(0.52 0.18 258)" }} />
          <span
            className="text-sm font-semibold"
            style={{ color: "oklch(0.92 0.012 243)" }}
          >
            Scene Segments
          </span>
        </div>
        <span
          className="text-xs px-2 py-0.5 rounded-full"
          style={{
            background: "oklch(0.21 0.022 243)",
            color: "oklch(0.6 0.015 243)",
            border: "1px solid oklch(0.265 0.025 243)",
          }}
        >
          {segments.length} scenes
        </span>
      </div>

      {/* Segments */}
      <ScrollArea className="flex-1 p-3">
        {segments.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16 text-center"
            data-ocid="scenes.empty_state"
          >
            <Layers
              size={32}
              style={{ color: "oklch(0.35 0.02 243)", marginBottom: 12 }}
            />
            <p
              className="text-sm font-medium"
              style={{ color: "oklch(0.55 0.015 243)" }}
            >
              No scenes detected yet
            </p>
            <p
              className="text-xs mt-1"
              style={{ color: "oklch(0.4 0.012 243)" }}
            >
              Paste a script and click "Detect Scenes"
            </p>
          </div>
        ) : (
          <div className="space-y-3" data-ocid="scenes.list">
            {segments.map((seg, i) => (
              <SegmentCard
                key={seg.index}
                segment={seg}
                index={i}
                onUpdate={onUpdateSegment}
                onGenerateVoice={onGenerateVoice}
                hasApiKey={hasApiKey}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
