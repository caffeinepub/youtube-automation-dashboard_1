import { Clock, Film, Hash } from "lucide-react";
import type { SegmentState } from "../types";
import { countWords, estimateDuration } from "../utils/sceneDetection";

interface ProjectStatsProps {
  script: string;
  segments: SegmentState[];
}

export function ProjectStats({ script, segments }: ProjectStatsProps) {
  const wordCount = countWords(script);
  const duration = estimateDuration(wordCount);
  const audioCount = segments.filter((s) => s.audioUrl).length;

  const stats = [
    {
      label: "Words",
      value: wordCount.toLocaleString(),
      icon: <Hash size={14} />,
    },
    {
      label: "Scenes",
      value: segments.length.toString(),
      icon: <Film size={14} />,
    },
    { label: "Duration", value: duration, icon: <Clock size={14} /> },
  ];

  return (
    <div
      className="rounded-lg p-4"
      style={{
        background: "oklch(0.148 0.016 243)",
        border: "1px solid oklch(0.265 0.025 243)",
      }}
    >
      <h3
        className="text-xs font-semibold mb-3 uppercase tracking-wider"
        style={{ color: "oklch(0.55 0.015 243)" }}
      >
        Project Stats
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center gap-1 p-3 rounded-lg"
            style={{
              background: "oklch(0.122 0.014 243)",
              border: "1px solid oklch(0.22 0.02 243)",
            }}
          >
            <span style={{ color: "oklch(0.52 0.18 258)" }}>{stat.icon}</span>
            <span
              className="text-base font-bold"
              style={{ color: "oklch(0.92 0.012 243)" }}
            >
              {stat.value}
            </span>
            <span className="text-xs" style={{ color: "oklch(0.5 0.015 243)" }}>
              {stat.label}
            </span>
          </div>
        ))}
      </div>
      {audioCount > 0 && (
        <p
          className="text-xs mt-3 text-center"
          style={{ color: "oklch(0.6 0.15 160)" }}
        >
          ✓ {audioCount}/{segments.length} scenes have audio
        </p>
      )}
    </div>
  );
}
