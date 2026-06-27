export function getProjectTasks(project, tasks) {
  return tasks.filter((t) => t.project === project.id);
}

export function deriveProjectProgress(project, tasks) {
  const projectTasks = getProjectTasks(project, tasks);
  if (projectTasks.length === 0) return 0;
  const done = projectTasks.filter((t) => t.status === 'done').length;
  return Math.round((done / projectTasks.length) * 100);
}

export function deriveProjectStatus(project, tasks) {
  const projectTasks = getProjectTasks(project, tasks);
  if (projectTasks.length === 0) return 'on_hold';
  if (projectTasks.every((t) => t.status === 'done')) return 'completed';
  if (projectTasks.some((t) => t.status === 'in_progress')) return 'active';
  return 'on_hold';
}

export function deriveProjectDueDate(project, tasks) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = getProjectTasks(project, tasks)
    .filter((t) => t.due_date)
    .map((t) => new Date(t.due_date.slice(0, 10)))
    .filter((d) => d >= today)
    .sort((a, b) => a - b);

  return upcoming[0] ?? null;
}

export function statusToBadge(status) {
  switch (status) {
    case 'active':
      return { variant: 'in-progress', label: 'Active' };
    case 'completed':
      return { variant: 'done', label: 'Completed' };
    case 'on_hold':
    default:
      return { variant: 'on-hold', label: 'On hold' };
  }
}

export function buildUserMap(currentUser, teams) {
  const map = {};

  if (currentUser?.id) {
    map[currentUser.id] = currentUser;
  }

  for (const team of teams) {
    const members = team.members ?? [];
    for (const member of members) {
      const id = typeof member === 'object' ? member.id : member;
      if (!id) continue;
      if (!map[id]) {
        map[id] =
          typeof member === 'object'
            ? member
            : { id, username: `Member ${id}` };
      }
    }
  }

  return map;
}

export function resolveUser(userId, userMap) {
  if (!userId) return null;
  return userMap[userId] ?? { id: userId, username: `Member ${userId}` };
}

export function getProjectAssignees(project, tasks, userMap) {
  const seen = new Set();
  const assignees = [];

  const owner = resolveUser(project.owner, userMap);
  if (owner) {
    seen.add(owner.id);
    assignees.push(owner);
  }

  for (const task of getProjectTasks(project, tasks)) {
    if (task.assignee && !seen.has(task.assignee)) {
      seen.add(task.assignee);
      const user = resolveUser(task.assignee, userMap);
      if (user) assignees.push(user);
    }
  }

  return assignees;
}

export function enrichProject(project, tasks, userMap) {
  const status = deriveProjectStatus(project, tasks);
  const badge = statusToBadge(status);

  return {
    ...project,
    status,
    progress: deriveProjectProgress(project, tasks),
    dueDate: deriveProjectDueDate(project, tasks),
    assignees: getProjectAssignees(project, tasks, userMap),
    badgeVariant: badge.variant,
    badgeLabel: badge.label,
  };
}

export function enrichProjects(projects, tasks, userMap) {
  return projects.map((p) => enrichProject(p, tasks, userMap));
}

export function filterProjectsByStatus(projects, tab) {
  if (tab === 'all') return projects;
  return projects.filter((p) => p.status === tab);
}

export function filterProjectsBySearch(projects, query) {
  const q = query.trim().toLowerCase();
  if (!q) return projects;
  return projects.filter(
    (p) =>
      p.name?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q),
  );
}

export function formatDueDate(date) {
  if (!date) return null;
  const formatted = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
  return `Due ${formatted}`;
}
