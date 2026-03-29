# YouTube Automation Dashboard

## Current State
New project. No existing application files.

## Requested Changes (Diff)

### Add
- Script input area: paste full video script
- Auto scene/segment detection that splits a script into logical sections (by double newline, scene headings, or numbered sections)
- Per-segment view:
  - Script text display
  - B-roll keyword field (editable + auto-suggested from script keywords)
  - "Generate Voice" button that calls ElevenLabs TTS API via HTTP outcall
  - Audio player that appears after voice is generated
- Settings panel: enter/save ElevenLabs API key and preferred voice ID
- Project management: save projects (title + script + segments), list saved projects, load a project
- Dark theme dashboard UI

### Modify
- N/A (new project)

### Remove
- N/A

## Implementation Plan

### Backend (Motoko)
- `saveApiKey(key: Text) : async ()` — store ElevenLabs API key in stable var
- `getApiKey() : async Text` — retrieve stored API key
- `generateVoice(text: Text, voiceId: Text) : async Result<Blob, Text>` — HTTP outcall to ElevenLabs TTS API, return audio bytes
- `saveProject(project: ProjectRecord) : async ProjectId` — persist project (id, title, script, segments with keywords)
- `getProjects() : async [ProjectRecord]` — list all saved projects
- `getProject(id: ProjectId) : async ?ProjectRecord` — load single project
- `deleteProject(id: ProjectId) : async ()` — remove project
- Data types: `ProjectRecord { id; title; script; createdAt; segments: [SegmentRecord] }`, `SegmentRecord { index; text; brollKeywords: [Text] }`

### Frontend (React)
- Dashboard layout: sidebar (project list) + main content area
- Script editor view: textarea for script input + "Detect Scenes" button
- Scene/segment list rendered below with per-segment cards
- Each segment card: text preview, b-roll keywords (tags + editable input), generate voice button, audio player
- Settings modal/drawer: API key input, voice ID selector, save button
- Project save/load flow with project title input
- Missing API key banner with instructions linking to ElevenLabs
- Dark theme using Tailwind
