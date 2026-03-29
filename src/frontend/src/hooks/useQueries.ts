import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Segment } from "../backend.d";
import type { ApiKeysState, ProjectSummaryUI } from "../types";
import { useActor } from "./useActor";

export function useListProjects() {
  const { actor, isFetching } = useActor();
  return useQuery<ProjectSummaryUI[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      if (!actor) return [];
      const list = await actor.listProjects();
      return list.map((p) => ({
        id: p.id,
        title: p.title,
        createdAt: p.createdAt,
      }));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProject(id: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getProject(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useGetApiKeys() {
  const { actor, isFetching } = useActor();
  return useQuery<ApiKeysState>({
    queryKey: ["apiKeys"],
    queryFn: async () => {
      if (!actor) return { elevenLabsKey: "", preferredVoiceId: "" };
      const keys = await actor.getApiKeys();
      return {
        elevenLabsKey: keys.elevenLabsKey || "",
        preferredVoiceId: keys.preferredVoiceId || "21m00Tcm4TlvDq8ikWAM",
      };
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveApiKeys() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      elevenLabsKey,
      preferredVoiceId,
    }: {
      elevenLabsKey: string;
      preferredVoiceId: string;
    }) => {
      if (!actor) throw new Error("No actor");
      await actor.saveApiKeys(elevenLabsKey || null, preferredVoiceId || null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apiKeys"] });
    },
  });
}

export function useSaveProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      title,
      script,
      segments,
    }: {
      id: string;
      title: string;
      script: string;
      segments: Segment[];
    }) => {
      if (!actor) throw new Error("No actor");
      await actor.saveProject(id, title, script, segments);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useDeleteProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("No actor");
      await actor.deleteProject(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useGenerateTts() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      voiceId,
      script,
    }: { voiceId: string; script: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.generateTts({ voiceId, script });
    },
  });
}
