import { Clock3, Folder, FolderOpen, FolderPlus, Github, LayoutGrid, Plus, Sparkles, X } from 'lucide-react';
import { useBrandName, useLanguage, useT } from '@/i18n';
import { folderTrail, type ProjectFolder } from '@/lib/project-folders';
import { BrandLogo } from './BrandLogo';
import type { LibraryProject, LibraryScope } from './ProjectsView';

type SidebarView = 'projects' | 'examples';

const ITEM = 'flex h-[30px] w-full min-w-0 items-center gap-2.5 rounded-[6px] px-2.5 text-left text-[12.5px] transition-colors duration-150';

export function LibrarySidebar({
  view,
  scope,
  folderId,
  projects,
  folders,
  counts,
  currentProjectId,
  creating,
  onNewProject,
  onProjects,
  onExamples,
  onFolder,
  onOpenProject,
  onOpenFolder,
  onGetFromGitHub,
  onClose,
}: {
  view: SidebarView;
  scope: LibraryScope;
  folderId: string | null;
  projects: LibraryProject[];
  folders: ProjectFolder[];
  counts: Record<string, number>;
  currentProjectId: string;
  creating: boolean;
  onNewProject: () => void;
  onProjects: (scope: LibraryScope) => void;
  onExamples: () => void;
  onFolder: (folderId: string) => void;
  onOpenProject: (project: LibraryProject) => void;
  onOpenFolder: () => void;
  onGetFromGitHub: () => void;
  onClose?: () => void;
}) {
  const t = useT();
  const language = useLanguage();
  const brand = useBrandName();
  const chinese = language === 'zh-CN';
  const recent = [...projects].sort((a, b) => b.openedAt - a.openedAt).slice(0, 4);
  const orderedFolders = [...folders].sort((a, b) => {
    const da = folderTrail(folders, a.id).length;
    const db = folderTrail(folders, b.id).length;
    return da - db || a.name.localeCompare(b.name, language);
  });

  return (
    <aside className="flex w-[240px] shrink-0 flex-col border-r border-[var(--border)] bg-[var(--glass)] backdrop-blur-[18px]">
      <div className="flex h-14 shrink-0 items-center gap-2.5 px-4" style={{ paddingLeft: 'max(16px, calc(var(--titlebar-logo-x) + 10px))' }}>
        <span className="text-[var(--text)]"><BrandLogo size={21} /></span>
        <span className="min-w-0 truncate text-[14px] font-semibold tracking-[-0.015em] text-[var(--text)]">
          {brand}
        </span>
        <span className="shrink-0 text-[9px] font-medium uppercase tracking-[0.12em] text-[var(--text-faint)]">
          {chinese ? 'SETPIECE' : '造境'}
        </span>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label={t('project.close')}
            className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] text-[var(--text-faint)] transition hover:bg-[var(--bg-hover)] hover:text-[var(--text)]"
          >
            <X size={15} strokeWidth={1.75} />
          </button>
        ) : null}
      </div>

      <div className="px-3 pb-4">
        <button
          type="button"
          onClick={onNewProject}
          disabled={creating}
          className="flex h-[32px] w-full items-center gap-2 rounded-[6px] bg-[var(--text)] px-3 text-[12.5px] font-medium text-[var(--bg)] transition-opacity duration-150 hover:opacity-85 disabled:opacity-50"
        >
          <Plus size={15} strokeWidth={2} />
          {t('projects.newProject')}
          <span className="ml-auto text-[10px] font-normal opacity-55">⌘N</span>
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2.5 pb-4 [scrollbar-gutter:stable]">
        <div className="px-2 pb-1 pt-1 text-[10.5px] font-medium text-[var(--text-faint)]">{t('library.sidebar.library')}</div>
        <button type="button" onClick={() => onProjects('recent')}
          className={`${ITEM} ${view === 'projects' && scope === 'recent' && !folderId ? 'bg-[var(--bg-active)] font-medium text-[var(--text)]' : 'text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text)]'}`}>
          <Clock3 size={15} strokeWidth={1.7} />
          <span className="min-w-0 flex-1 truncate">{t('library.recent')}</span>
          <span className="text-[10.5px] tabular-nums text-[var(--text-faint)]">{Math.min(12, projects.length)}</span>
        </button>
        <button type="button" onClick={() => onProjects('all')}
          className={`${ITEM} ${view === 'projects' && scope === 'all' && !folderId ? 'bg-[var(--bg-active)] font-medium text-[var(--text)]' : 'text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text)]'}`}>
          <LayoutGrid size={15} strokeWidth={1.7} />
          <span className="min-w-0 flex-1 truncate">{t('library.all')}</span>
          <span className="text-[10.5px] tabular-nums text-[var(--text-faint)]">{projects.length}</span>
        </button>
        <button type="button" onClick={onExamples}
          className={`${ITEM} ${view === 'examples' ? 'bg-[var(--bg-active)] font-medium text-[var(--text)]' : 'text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text)]'}`}>
          <Sparkles size={15} strokeWidth={1.7} />
          <span className="min-w-0 flex-1 truncate">{t('launcher.examples')}</span>
        </button>

        {orderedFolders.length ? (
          <>
            <div className="px-2 pb-1 pt-4 text-[10.5px] font-medium text-[var(--text-faint)]">{t('library.sidebar.folders')}</div>
            {orderedFolders.map((folder) => {
              const depth = Math.max(0, folderTrail(folders, folder.id).length - 1);
              return (
                <button key={folder.id} type="button" onClick={() => onFolder(folder.id)}
                  className={`${ITEM} ${view === 'projects' && folderId === folder.id ? 'bg-[var(--bg-active)] font-medium text-[var(--text)]' : 'text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text)]'}`}
                  style={{ paddingLeft: 10 + Math.min(depth, 2) * 12 }}>
                  <Folder size={15} strokeWidth={1.65} className="shrink-0" />
                  <span className="min-w-0 flex-1 truncate">{folder.name}</span>
                  <span className="text-[10.5px] tabular-nums text-[var(--text-faint)]">{counts[folder.id] ?? 0}</span>
                </button>
              );
            })}
          </>
        ) : null}

        {recent.length ? (
          <>
            <div className="px-2 pb-1 pt-4 text-[10.5px] font-medium text-[var(--text-faint)]">{t('library.sidebar.recentlyOpened')}</div>
            {recent.map((project) => (
              <button key={project.id} type="button" onClick={() => onOpenProject(project)}
                className={`${ITEM} ${project.id === currentProjectId ? 'bg-[var(--bg-active)] font-medium text-[var(--text)]' : 'text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text)]'}`}>
                <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[4px] bg-[var(--surface-2)] text-[10px] font-semibold text-[var(--text-faint)]">
                  {(project.name.trim()[0] ?? '·').toUpperCase()}
                </span>
                <span className="min-w-0 flex-1 truncate">{project.name || t('project.untitled')}</span>
              </button>
            ))}
          </>
        ) : null}
      </div>

      <div className="shrink-0 border-t border-[var(--border)] p-2.5">
        <button type="button" onClick={onOpenFolder}
          className="flex h-[30px] w-full items-center gap-2.5 rounded-[6px] px-2.5 text-left text-[12px] text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text)]">
          <FolderOpen size={15} strokeWidth={1.65} />
          <span className="truncate">{t('projects.openFolder')}</span>
        </button>
        <button type="button" onClick={onGetFromGitHub}
          className="flex h-[30px] w-full items-center gap-2.5 rounded-[6px] px-2.5 text-left text-[12px] text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text)]">
          <Github size={15} strokeWidth={1.65} />
          <span className="truncate">{t('projects.getFromGitHub')}</span>
        </button>
        <div className="mt-1 flex items-center gap-1.5 px-2.5 py-1.5 text-[10.5px] text-[var(--text-faint)]">
          <FolderPlus size={11} strokeWidth={1.7} />
          <span className="truncate">{t('library.sidebar.local')}</span>
        </div>
      </div>
    </aside>
  );
}
