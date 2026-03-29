import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface http_header {
    value: string;
    name: string;
}
export interface ProjectSummary {
    id: string;
    title: string;
    createdAt: bigint;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface Segment {
    text: string;
    brollKeywords: Array<string>;
    index: bigint;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface TtsResponse {
    audio: string;
    error?: string;
}
export interface Project {
    id: string;
    title: string;
    script: string;
    createdAt: bigint;
    segments: Array<Segment>;
}
export interface ApiKeys {
    elevenLabsKey?: string;
    preferredVoiceId?: string;
}
export interface TtsRequest {
    voiceId: string;
    script: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface backendInterface {
    deleteProject(id: string): Promise<void>;
    generateTts(request: TtsRequest): Promise<TtsResponse>;
    getApiKeys(): Promise<ApiKeys>;
    getProject(id: string): Promise<Project>;
    listProjects(): Promise<Array<ProjectSummary>>;
    saveApiKeys(elevenLabsKey: string | null, preferredVoiceId: string | null): Promise<void>;
    saveProject(id: string, title: string, script: string, segments: Array<Segment>): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
}
