export interface SegmentState {
  index: number;
  text: string;
  brollKeywords: string[];
  audioUrl?: string;
  isGenerating?: boolean;
  audioError?: string;
}

export interface ProjectState {
  id: string;
  title: string;
  script: string;
  segments: SegmentState[];
}

export interface ProjectSummaryUI {
  id: string;
  title: string;
  createdAt: bigint;
}

export interface ApiKeysState {
  elevenLabsKey: string;
  preferredVoiceId: string;
}

export const SAMPLE_SCRIPT = `Scene 1: The AI Revolution is Here

Right now, artificial intelligence is changing everything about how we create content. From writing scripts to generating voiceovers, the tools available to content creators have never been more powerful.

Think about it—just a few years ago, producing a professional YouTube video required an entire team. A writer, a voice actor, a video editor, a thumbnail designer. Now? You can do it all yourself with the right AI tools.

Scene 2: Meet the Top AI Tools for Creators

Let's break down the five tools every serious content creator needs to know about in 2024.

First up: ElevenLabs for AI voice generation. This tool creates incredibly realistic voice clones and text-to-speech audio that sounds indistinguishable from a real human. You can clone your own voice or choose from hundreds of pre-built voices.

Second: Midjourney and DALL-E for AI image generation. Need a custom thumbnail or a unique visual asset? These tools can generate stunning, professional-quality images from a simple text description.

Scene 3: B-Roll and Stock Footage Strategy

One of the biggest challenges for solo creators is finding quality b-roll footage. B-roll is the supplementary video that plays while you're narrating—it makes your content look polished and professional.

The good news: sites like Pexels, Pixabay, and Unsplash offer thousands of free, high-quality stock videos and images. The key is knowing what keywords to search for.

For example, if you're talking about artificial intelligence, search for: "technology abstract", "data visualization", "computer code", "futuristic city", or "robot hand".

Scene 4: Putting It All Together

Here's your action plan for creating AI-powered YouTube content:

Step one: Write your script using an AI writing assistant like ChatGPT or Claude. Step two: Use TubeFlow to break your script into scenes and generate your voiceover with ElevenLabs. Step three: Find matching b-roll footage using the keyword suggestions. Step four: Combine everything in your video editor of choice.

The result? Professional, engaging content that your audience will love—produced in a fraction of the time it used to take.`;
