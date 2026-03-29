import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BarChart3,
  Film,
  FolderOpen,
  LayoutDashboard,
  Play,
  Plus,
  Settings,
  Trash2,
} from "lucide-react";
import type { ProjectSummaryUI } from "../types";

type NavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
  { id: "projects", label: "Projects", icon: <FolderOpen size={16} /> },
  { id: "analytics", label: "Analytics", icon: <BarChart3 size={16} /> },
  { id: "media", label: "Media", icon: <Film size={16} /> },
  { id: "settings", label: "Settings", icon: <Settings size={16} /> },
];

interface SidebarProps {
  activeNav: string;
  onNavChange: (id: string) => void;
  projects: ProjectSummaryUI[];
  activeProjectId: string | null;
  onLoadProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onNewProject: () => void;
  onOpenSettings: () => void;
}

export function Sidebar({
  activeNav,
  onNavChange,
  projects,
  activeProjectId,
  onLoadProject,
  onDeleteProject,
  onNewProject,
  onOpenSettings,
}: SidebarProps) {
  return (
    <aside
      className="flex flex-col h-full"
      style={{
        background: "oklch(0.132 0.015 243)",
        borderRight: "1px solid oklch(0.265 0.025 243)",
      }}
    >
      {/* Brand */}
      <div
        className="flex items-center gap-3 px-5 py-5"
        style={{ borderBottom: "1px solid oklch(0.265 0.025 243)" }}
      >
        <div
          className="flex items-center justify-center rounded-lg"
          style={{
            width: 36,
            height: 36,
            background: "oklch(0.76 0.16 70 / 0.15)",
            border: "1px solid oklch(0.76 0.16 70 / 0.3)",
          }}
        >
          <Play
            size={16}
            fill="oklch(0.76 0.16 70)"
            style={{ color: "oklch(0.76 0.16 70)" }}
          />
        </div>
        <span
          className="text-base font-bold tracking-tight"
          style={{ color: "oklch(0.92 0.012 243)" }}
        >
          TubeFlow
        </span>
      </div>

      {/* Primary nav */}
      <nav className="px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              type="button"
              data-ocid={`nav.${item.id}.link`}
              onClick={() => {
                if (item.id === "settings") onOpenSettings();
                else onNavChange(item.id);
              }}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium transition-colors"
              style={{
                background: isActive
                  ? "oklch(0.52 0.18 258 / 0.15)"
                  : "transparent",
                color: isActive
                  ? "oklch(0.72 0.16 258)"
                  : "oklch(0.63 0.015 243)",
                border: isActive
                  ? "1px solid oklch(0.52 0.18 258 / 0.3)"
                  : "1px solid transparent",
              }}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </nav>

      <div
        className="px-5 py-2"
        style={{ borderTop: "1px solid oklch(0.265 0.025 243)" }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "oklch(0.45 0.02 243)" }}
        >
          Project List
        </p>
      </div>

      {/* Project list */}
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-0.5 py-2">
          {projects.length === 0 && (
            <p
              className="px-3 py-4 text-xs text-center"
              style={{ color: "oklch(0.45 0.02 243)" }}
            >
              No saved projects yet
            </p>
          )}
          {projects.map((project, idx) => {
            const isActive = project.id === activeProjectId;
            const itemOcid = `projects.item.${idx + 1}`;
            const deleteOcid = `projects.delete_button.${idx + 1}`;
            return (
              <div
                key={project.id}
                className="group flex items-center gap-2 rounded-md"
                style={{
                  background: isActive ? "oklch(0.19 0.02 243)" : "transparent",
                  border: isActive
                    ? "1px solid oklch(0.265 0.025 243)"
                    : "1px solid transparent",
                }}
              >
                <button
                  type="button"
                  className="flex items-center gap-2 flex-1 px-3 py-2 text-left min-w-0"
                  onClick={() => onLoadProject(project.id)}
                  data-ocid={itemOcid}
                >
                  <FolderOpen
                    size={13}
                    style={{
                      color: isActive
                        ? "oklch(0.76 0.16 70)"
                        : "oklch(0.45 0.02 243)",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    className="flex-1 text-xs truncate"
                    style={{
                      color: isActive
                        ? "oklch(0.85 0.012 243)"
                        : "oklch(0.6 0.012 243)",
                    }}
                  >
                    {project.title}
                  </span>
                </button>
                <button
                  type="button"
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded mr-1"
                  style={{ color: "oklch(0.577 0.245 27)" }}
                  onClick={() => onDeleteProject(project.id)}
                  data-ocid={deleteOcid}
                  aria-label="Delete project"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* New Project */}
      <div
        className="p-3"
        style={{ borderTop: "1px solid oklch(0.265 0.025 243)" }}
      >
        <Button
          type="button"
          onClick={onNewProject}
          data-ocid="projects.new.button"
          className="w-full text-xs h-8 gap-2"
          style={{
            background: "oklch(0.19 0.02 243)",
            border: "1px solid oklch(0.265 0.025 243)",
            color: "oklch(0.78 0.01 243)",
          }}
          variant="ghost"
        >
          <Plus size={13} />
          New Project
        </Button>
      </div>
    </aside>
  );
}
