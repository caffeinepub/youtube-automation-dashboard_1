import type { SegmentState } from "../types";

export function detectScenes(script: string): SegmentState[] {
  if (!script.trim()) return [];

  // Try explicit scene markers
  const sceneMarkerRegex =
    /(?:^|\n)(?=(?:Scene\s+\d+|\[SCENE|\[SEGMENT|INT\.|EXT\.|\d+\.\s+[A-Z]))/gim;
  const parts = script.split(sceneMarkerRegex).filter((p) => p.trim());

  if (parts.length > 1) {
    return parts.map((text, i) => ({
      index: i,
      text: text.trim(),
      brollKeywords: [],
    }));
  }

  // Try paragraph-based detection (double newlines)
  const paragraphs = script
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 20);

  if (paragraphs.length > 1) {
    // Merge very short paragraphs (~<50 chars) with next
    const merged: string[] = [];
    let current = "";
    for (const p of paragraphs) {
      if (current && current.split(/\s+/).length < 30) {
        current = `${current}\n\n${p}`;
      } else {
        if (current) merged.push(current);
        current = p;
      }
    }
    if (current) merged.push(current);

    if (merged.length > 1) {
      return merged.map((text, i) => ({
        index: i,
        text: text.trim(),
        brollKeywords: [],
      }));
    }
  }

  // Fallback: chunk by ~200 words
  const words = script.trim().split(/\s+/);
  const chunkSize = 200;
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(" "));
  }

  return chunks.map((text, i) => ({
    index: i,
    text: text.trim(),
    brollKeywords: [],
  }));
}

export function suggestBrollKeywords(text: string): string[] {
  const stopwords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "from",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "could",
    "should",
    "may",
    "might",
    "shall",
    "can",
    "this",
    "that",
    "these",
    "those",
    "it",
    "its",
    "you",
    "your",
    "we",
    "our",
    "they",
    "their",
    "about",
    "into",
    "just",
    "like",
    "some",
    "all",
    "also",
    "now",
    "when",
    "what",
    "how",
    "who",
    "more",
    "most",
    "than",
    "then",
    "even",
    "every",
    "each",
    "both",
    "very",
    "here",
    "there",
    "where",
    "which",
    "while",
    "after",
    "before",
    "through",
    "over",
    "need",
    "want",
    "make",
    "made",
    "know",
    "think",
    "find",
    "give",
    "take",
    "come",
    "look",
    "good",
    "new",
    "first",
    "last",
    "long",
    "great",
    "little",
    "own",
    "right",
    "still",
    "same",
    "another",
    "well",
    "back",
    "down",
    "going",
    "being",
    "using",
    "creating",
    "getting",
    "having",
    "making",
    "putting",
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 4 && !stopwords.has(w));

  const freq: Record<string, number> = {};
  for (const w of words) {
    freq[w] = (freq[w] || 0) + 1;
  }

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([w]) => w);
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function estimateDuration(wordCount: number): string {
  const minutes = wordCount / 150;
  const m = Math.floor(minutes);
  const s = Math.round((minutes - m) * 60);
  return `${m}m ${s}s`;
}
