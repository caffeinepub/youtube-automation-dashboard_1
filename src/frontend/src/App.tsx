import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { Loader2, PenLine, Save, Settings } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ApiKeysBanner } from "./components/ApiKeysBanner";
import { ApiKeysPanel } from "./components/ApiKeysPanel";
import { ProjectStats } from "./components/ProjectStats";
import { ScriptEditor } from "./components/ScriptEditor";
import { SegmentsList } from "./components/SegmentsList";
import { SettingsModal } from "./components/SettingsModal";
import { Sidebar } from "./components/Sidebar";
import {
  useDeleteProject,
  useGenerateTts,
  useGetApiKeys,
  useListProjects,
  useSaveApiKeys,
  useSaveProject,
} from "./hooks/useQueries";
import type { ProjectState, SegmentState } from "./types";
import { SAMPLE_SCRIPT } from "./types";
import { detectScenes } from "./utils/sceneDetection";

function generateId() {
  return `proj_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function base64ToAudioUrl(base64: string): string {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: "audio/mpeg" });
  return URL.createObjectURL(blob);
}

export default function App() {
  const [activeNav, setActiveNav] = useState("projects");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const [project, setProject] = useState<ProjectState>({
    id: generateId(),
    title: "Untitled Project",
    script: SAMPLE_SCRIPT,
    segments: [],
  });

  const { data: projects = [], isLoading: projectsLoading } = useListProjects();
  const { data: apiKeys } = useGetApiKeys();
  const saveApiKeysMutation = useSaveApiKeys();
  const saveProjectMutation = useSaveProject();
  const deleteProjectMutation = useDeleteProject();
  const generateTtsMutation = useGenerateTts();

  const elevenLabsKey = apiKeys?.elevenLabsKey || "";
  const preferredVoiceId = apiKeys?.preferredVoiceId || "21m00Tcm4TlvDq8ikWAM";
  const hasApiKey = !!elevenLabsKey;

  // Auto-detect scenes on first load with sample script
  const initializedRef = useRef(false);
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      setProject((prev) => {
        if (prev.segments.length === 0 && prev.script) {
          const detected = detectScenes(prev.script);
          return { ...prev, segments: detected };
        }
        return prev;
      });
    }
  }, []);

  // Focus title input when editing
  useEffect(() => {
    if (editingTitle) {
      titleInputRef.current?.focus();
    }
  }, [editingTitle]);

  const handleDetectScenes = useCallback(() => {
    setProject((prev) => {
      const hasAudio = prev.segments.some((s) => s.audioUrl);
      if (hasAudio) {
        if (
          !confirm("Re-detecting scenes will clear existing audio. Continue?")
        )
          return prev;
      }
      const detected = detectScenes(prev.script);
      toast.success(`Detected ${detected.length} scenes`);
      return { ...prev, segments: detected };
    });
  }, []);

  const handleUpdateSegment = useCallback((updated: SegmentState) => {
    setProject((prev) => ({
      ...prev,
      segments: prev.segments.map((s) =>
        s.index === updated.index ? updated : s,
      ),
    }));
  }, []);

  const handleGenerateVoice = useCallback(
    async (segmentIndex: number) => {
      if (!hasApiKey) {
        toast.error("Please add your ElevenLabs API key in Settings");
        return;
      }

      let segmentText = "";
      setProject((prev) => {
        const seg = prev.segments.find((s) => s.index === segmentIndex);
        if (seg) segmentText = seg.text;
        return {
          ...prev,
          segments: prev.segments.map((s) =>
            s.index === segmentIndex
              ? { ...s, isGenerating: true, audioError: undefined }
              : s,
          ),
        };
      });

      if (!segmentText) return;

      try {
        const result = await generateTtsMutation.mutateAsync({
          voiceId: preferredVoiceId,
          script: segmentText,
        });

        if (result.error) {
          throw new Error(result.error);
        }

        const audioUrl = base64ToAudioUrl(result.audio);
        setProject((prev) => ({
          ...prev,
          segments: prev.segments.map((s) =>
            s.index === segmentIndex
              ? { ...s, isGenerating: false, audioUrl }
              : s,
          ),
        }));
        toast.success("Voice generated successfully!");
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Failed to generate voice";
        setProject((prev) => ({
          ...prev,
          segments: prev.segments.map((s) =>
            s.index === segmentIndex
              ? { ...s, isGenerating: false, audioError: msg }
              : s,
          ),
        }));
        toast.error(msg);
      }
    },
    [hasApiKey, preferredVoiceId, generateTtsMutation],
  );

  const handleSaveProject = useCallback(async () => {
    try {
      await saveProjectMutation.mutateAsync({
        id: project.id,
        title: project.title,
        script: project.script,
        segments: project.segments.map((s) => ({
          index: BigInt(s.index),
          text: s.text,
          brollKeywords: s.brollKeywords,
        })),
      });
      toast.success("Project saved!");
    } catch {
      toast.error("Failed to save project");
    }
  }, [project, saveProjectMutation]);

  const handleLoadProject = useCallback(
    async (id: string) => {
      try {
        const summary = projects.find((p) => p.id === id);
        if (!summary) return;
        toast.loading("Loading project...", { id: "load" });
        setProject((prev) => ({
          ...prev,
          id: summary.id,
          title: summary.title,
          script: "",
          segments: [],
        }));
        toast.dismiss("load");
      } catch {
        toast.error("Failed to load project");
      }
    },
    [projects],
  );

  const handleDeleteProject = useCallback(
    async (id: string) => {
      if (!confirm("Delete this project?")) return;
      try {
        await deleteProjectMutation.mutateAsync(id);
        setProject((prev) => {
          if (prev.id === id) {
            return {
              id: generateId(),
              title: "Untitled Project",
              script: "",
              segments: [],
            };
          }
          return prev;
        });
        toast.success("Project deleted");
      } catch {
        toast.error("Failed to delete project");
      }
    },
    [deleteProjectMutation],
  );

  const handleNewProject = useCallback(() => {
    setProject({
      id: generateId(),
      title: "New Project",
      script: "",
      segments: [],
    });
  }, []);

  const handleSaveApiKeys = useCallback(
    async (key: string, voiceId: string) => {
      await saveApiKeysMutation.mutateAsync({
        elevenLabsKey: key,
        preferredVoiceId: voiceId,
      });
      toast.success("Settings saved!");
    },
    [saveApiKeysMutation],
  );

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "oklch(0.112 0.012 243)" }}
    >
      {/* Sidebar */}
      <div className="w-60 flex-shrink-0 flex flex-col">
        <Sidebar
          activeNav={activeNav}
          onNavChange={setActiveNav}
          projects={projects}
          activeProjectId={project.id}
          onLoadProject={handleLoadProject}
          onDeleteProject={handleDeleteProject}
          onNewProject={handleNewProject}
          onOpenSettings={() => setSettingsOpen(true)}
        />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top header */}
        <header
          className="flex items-center justify-between px-6 py-3 flex-shrink-0"
          style={{
            background: "oklch(0.132 0.015 243)",
            borderBottom: "1px solid oklch(0.265 0.025 243)",
          }}
        >
          <div className="flex items-center gap-3">
            {projectsLoading && (
              <Loader2
                size={14}
                className="animate-spin"
                style={{ color: "oklch(0.52 0.18 258)" }}
              />
            )}
            {editingTitle ? (
              <input
                ref={titleInputRef}
                value={project.title}
                onChange={(e) =>
                  setProject((prev) => ({ ...prev, title: e.target.value }))
                }
                onBlur={() => setEditingTitle(false)}
                onKeyDown={(e) => e.key === "Enter" && setEditingTitle(false)}
                className="bg-transparent outline-none text-lg font-semibold border-b"
                style={{
                  color: "oklch(0.92 0.012 243)",
                  borderColor: "oklch(0.52 0.18 258)",
                }}
                data-ocid="project.title.input"
              />
            ) : (
              <div className="flex items-center gap-2">
                <h1
                  className="text-lg font-semibold"
                  style={{ color: "oklch(0.92 0.012 243)" }}
                >
                  {project.title}
                </h1>
                <button
                  type="button"
                  onClick={() => setEditingTitle(true)}
                  className="p-1 rounded transition-opacity hover:opacity-70"
                  style={{ color: "oklch(0.5 0.015 243)" }}
                  data-ocid="project.title.edit_button"
                >
                  <PenLine size={13} />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSaveProject}
              disabled={saveProjectMutation.isPending}
              className="h-8 text-xs gap-1.5 px-3"
              style={{
                background: "oklch(0.19 0.02 243)",
                border: "1px solid oklch(0.265 0.025 243)",
                color: "oklch(0.72 0.012 243)",
              }}
              data-ocid="project.save.button"
            >
              {saveProjectMutation.isPending ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Save size={12} />
              )}
              Save
            </Button>
            <Button
              size="sm"
              onClick={() => setSettingsOpen(true)}
              className="h-8 text-xs gap-1.5 px-3"
              style={{
                background: "oklch(0.76 0.16 70)",
                color: "oklch(0.13 0.01 243)",
              }}
              data-ocid="header.settings.button"
            >
              <Settings size={12} />
              Settings
            </Button>
          </div>
        </header>

        {/* API Key Banner */}
        {!hasApiKey && (
          <div className="px-6 pt-3">
            <ApiKeysBanner onOpenSettings={() => setSettingsOpen(true)} />
          </div>
        )}

        {/* Two-column layout */}
        <main className="flex-1 overflow-hidden px-6 pt-4 pb-4">
          <div className="flex gap-4 h-full">
            {/* Left column - Script Editor (60%) */}
            <div
              className="flex flex-col gap-4"
              style={{ width: "60%", minWidth: 0 }}
            >
              <div className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
                <ScriptEditor
                  script={project.script}
                  onChange={(s) =>
                    setProject((prev) => ({ ...prev, script: s }))
                  }
                  onDetectScenes={handleDetectScenes}
                  segmentCount={project.segments.length}
                />
              </div>
              <ProjectStats
                script={project.script}
                segments={project.segments}
              />
            </div>

            {/* Right column - Segments (40%) */}
            <div
              className="flex flex-col gap-4"
              style={{ width: "40%", minWidth: 0 }}
            >
              <div className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
                <SegmentsList
                  segments={project.segments}
                  onUpdateSegment={handleUpdateSegment}
                  onGenerateVoice={handleGenerateVoice}
                  hasApiKey={hasApiKey}
                />
              </div>
              <ApiKeysPanel
                elevenLabsKey={elevenLabsKey}
                preferredVoiceId={preferredVoiceId}
                onOpenSettings={() => setSettingsOpen(true)}
              />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer
          className="flex items-center justify-between px-6 py-2 text-xs flex-shrink-0"
          style={{
            borderTop: "1px solid oklch(0.265 0.025 243)",
            color: "oklch(0.4 0.012 243)",
          }}
        >
          <span>© {new Date().getFullYear()} TubeFlow</span>
          <div className="flex gap-4">
            <a
              href="https://elevenlabs.io"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80"
            >
              ElevenLabs
            </a>
            <a
              href="https://pexels.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80"
            >
              Pexels
            </a>
            <a
              href="https://pixabay.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80"
            >
              Pixabay
            </a>
          </div>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80"
          >
            Built with ❤️ using caffeine.ai
          </a>
        </footer>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        elevenLabsKey={elevenLabsKey}
        preferredVoiceId={preferredVoiceId}
        onSave={handleSaveApiKeys}
      />

      <Toaster
        theme="dark"
        toastOptions={{
          style: {
            background: "oklch(0.172 0.018 243)",
            border: "1px solid oklch(0.265 0.025 243)",
            color: "oklch(0.92 0.012 243)",
          },
        }}
      />
    </div>
  );
}
