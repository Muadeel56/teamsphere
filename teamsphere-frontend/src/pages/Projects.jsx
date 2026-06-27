import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus, Search, RefreshCw, AlertTriangle, FolderPlus } from 'lucide-react';

import { useAuthStore } from '../store/authStore';
import { getProjectsPageData } from '../services/projects';
import {
  filterProjectsBySearch,
  filterProjectsByStatus,
} from '../lib/projectHelpers';

import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import Input from '../components/Input';
import { SkeletonBlock } from '../components/SkeletonCard';
import ProjectCard from '../components/projects/ProjectCard';
import NewProjectModal from '../components/projects/NewProjectModal';

const FILTER_TABS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'on_hold', label: 'On hold' },
  { id: 'completed', label: 'Completed' },
];

function ProjectCardSkeleton() {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[15px] p-5">
      <div className="flex items-center justify-between mb-4">
        <SkeletonBlock className="h-6 w-[84px] rounded-full" />
        <SkeletonBlock className="h-6 w-[72px] rounded-full" />
      </div>
      <SkeletonBlock className="h-5 w-[70%] mb-3" />
      <SkeletonBlock className="h-[13px] w-full mb-2" />
      <SkeletonBlock className="h-[13px] w-[60%] mb-5" />
      <SkeletonBlock className="h-[7px] w-full rounded-full mb-5" />
      <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <SkeletonBlock className="h-7 w-7 rounded-full" />
          <SkeletonBlock className="h-7 w-7 rounded-full" />
        </div>
        <SkeletonBlock className="h-[13px] w-[72px]" />
      </div>
    </div>
  );
}

function ProjectsSkeletonGrid() {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-[18px]">
      {Array.from({ length: 6 }, (_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  );
}

function ProjectsEmptyState({ onCreate }) {
  return (
    <EmptyState
      eyebrow="Projects"
      title="No projects yet"
      description="Spin up your first project and TeamSphere will start tracking its tasks, team, and attendance automatically."
      actionLabel="Create your first project"
      actionIcon={<Plus size={17} />}
      onAction={onCreate}
      icon={
        <div className="relative w-[120px] h-[88px] mb-[26px]">
          <div className="absolute left-[14px] top-4 w-20 h-[60px] rounded-[11px] bg-[var(--color-surface-2)] border border-[var(--color-border)] -rotate-[8deg]" />
          <div className="absolute right-[14px] top-2.5 w-20 h-[60px] rounded-[11px] bg-[var(--color-surface-2)] border border-[var(--color-border)] rotate-[7deg]" />
          <div
            className="absolute left-1/2 top-3.5 -translate-x-1/2 w-[84px] h-16 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-strong)] shadow-[var(--shadow-md)] grid place-items-center text-[var(--color-primary)]"
            style={{ animation: 'ds-floaty 3s ease-in-out infinite alternate' }}
          >
            <FolderPlus size={30} strokeWidth={1.7} />
          </div>
        </div>
      }
    />
  );
}

function ProjectsErrorState({ onRetry }) {
  return (
    <div
      className="flex flex-col items-center text-center px-6 py-16"
      style={{ animation: 'ds-rise .4s cubic-bezier(.2,.8,.2,1) both' }}
    >
      <div className="w-[84px] h-[84px] rounded-[22px] bg-[var(--color-danger-subtle)] grid place-items-center mb-6 text-[var(--color-danger)]">
        <AlertTriangle size={38} strokeWidth={1.7} />
      </div>
      <h3 className="font-serif text-[24px] font-medium tracking-[-0.01em] text-[var(--color-text)] m-0 mb-2.5">
        Couldn&apos;t load projects
      </h3>
      <p className="text-[15px] leading-[1.6] text-[var(--color-muted)] m-0 mb-[26px] max-w-[42ch]">
        Something went wrong reaching the server. Your projects are safe — try again in a moment.
      </p>
      <Button onClick={onRetry} icon={<RefreshCw size={16} />}>
        Retry
      </Button>
    </div>
  );
}

const FOCUS_RING = 'focus:outline-none focus-visible:shadow-[0_0_0_3px_var(--color-ring)]';

function FilterTabs({ activeTab, onChange }) {
  return (
    <div className="inline-flex gap-0.5 p-[3px] rounded-[9px] border border-[var(--color-border)] bg-[var(--color-surface)]">
      {FILTER_TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`h-[30px] px-[11px] rounded-[7px] border-none cursor-pointer font-mono text-[11.5px] font-semibold transition-[background,color] duration-150 ${FOCUS_RING}`}
            style={{
              background: isActive ? 'var(--color-primary-subtle)' : 'transparent',
              color: isActive ? 'var(--color-primary)' : 'var(--color-muted)',
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export default function Projects() {
  const user = useAuthStore((s) => s.user);
  const [projects, setProjects] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await getProjectsPageData(user);
      setProjects(data.projects);
      setUserMap(data.userMap);
    } catch {
      setLoadError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const ownerOptions = useMemo(
    () => Object.values(userMap).sort((a, b) => a.id - b.id),
    [userMap],
  );

  const filteredProjects = useMemo(() => {
    let result = filterProjectsByStatus(projects, activeTab);
    result = filterProjectsBySearch(result, search);
    return result;
  }, [projects, activeTab, search]);

  const projectCountLabel = `${projects.length} project${projects.length === 1 ? '' : 's'}`;

  return (
    <div>
      <div className="flex items-end justify-between gap-4 flex-wrap mb-[26px]">
        <div>
          <div className="flex items-center gap-[11px]">
            <h2 className="font-serif text-[30px] font-medium leading-[1.15] tracking-[-0.01em] text-[var(--color-text)] m-0">
              Projects
            </h2>
            {!loading && !loadError && (
              <span className="font-mono text-[13px] font-semibold text-[var(--color-muted)] bg-[var(--color-surface-2)] border border-[var(--color-border)] px-2.5 py-[3px] rounded-full">
                {projectCountLabel}
              </span>
            )}
          </div>
          <p className="text-[15px] text-[var(--color-muted)] mt-[7px] mb-0">
            Everything your teams are building, in one place.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="min-w-[200px] flex-1 sm:flex-none sm:w-[220px]">
            <Input
              placeholder="Search projects…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search size={16} />}
              aria-label="Search projects"
            />
          </div>
          <Button icon={<Plus size={16} />} onClick={() => setModalOpen(true)}>
            New Project
          </Button>
        </div>
      </div>

      {!loading && !loadError && projects.length > 0 && (
        <div className="mb-[22px]">
          <FilterTabs activeTab={activeTab} onChange={setActiveTab} />
        </div>
      )}

      {loading ? (
        <ProjectsSkeletonGrid />
      ) : loadError ? (
        <ProjectsErrorState onRetry={fetchProjects} />
      ) : projects.length === 0 ? (
        <ProjectsEmptyState onCreate={() => setModalOpen(true)} />
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          variant="filtered"
          description="No projects match your search or filter."
        />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-[18px]">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              animationDelay={`${index * 0.05}s`}
            />
          ))}
        </div>
      )}

      <NewProjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={fetchProjects}
        defaultOwnerId={user?.id}
        ownerOptions={ownerOptions.length > 0 ? ownerOptions : user ? [user] : []}
      />
    </div>
  );
}
