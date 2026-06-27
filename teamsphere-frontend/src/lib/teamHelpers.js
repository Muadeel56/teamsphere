import { buildUserMap as buildProjectUserMap, resolveUser } from './projectHelpers';

const TEAM_TINTS = [
  { bg: 'var(--color-primary-subtle)', fg: 'var(--color-primary)' },
  { bg: 'var(--color-info-subtle)', fg: 'var(--color-info)' },
  { bg: 'var(--color-success-subtle)', fg: 'var(--color-success)' },
  { bg: 'var(--color-warning-subtle)', fg: 'var(--color-warning)' },
];

const ROLE_RANK = { admin: 0, manager: 1, member: 2 };

export function sortMembersByRole(members) {
  return [...members].sort(
    (a, b) => (ROLE_RANK[a.role] ?? 2) - (ROLE_RANK[b.role] ?? 2),
  );
}

export function buildUserMap(currentUser, teams, allUsers = []) {
  const map = buildProjectUserMap(currentUser, teams);

  for (const user of allUsers) {
    if (user?.id) map[user.id] = user;
  }

  for (const team of teams) {
    const members = team.members ?? [];
    for (const member of members) {
      if (member && typeof member === 'object' && member.id) {
        map[member.id] = { ...map[member.id], ...member };
      }
    }
  }

  return map;
}

export function getRoleCounts(members) {
  const counts = { admin: 0, manager: 0, member: 0 };
  for (const user of members) {
    const role = user?.role ?? 'member';
    if (role in counts) counts[role] += 1;
    else counts.member += 1;
  }
  return counts;
}

export function getTeamInitial(name) {
  return (name?.trim()?.charAt(0) || 'T').toUpperCase();
}

export function getTeamTint(teamId) {
  const index = Math.abs(Number(teamId) || 0) % TEAM_TINTS.length;
  return TEAM_TINTS[index];
}

export function formatTeamCreatedDate(iso) {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const formatted = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
  }).format(date);
  return `Created ${formatted}`;
}

export function formatMemberJoinDate(user) {
  if (!user?.date_joined) return '—';
  const date = new Date(user.date_joined);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function getTeamMemberUsers(team, userMap) {
  const members = team.members ?? [];
  return members.map((member) => {
    if (member && typeof member === 'object' && member.id) {
      return { ...resolveUser(member.id, userMap), ...member };
    }
    return resolveUser(member, userMap);
  });
}

export function enrichTeam(team, userMap) {
  const memberUsers = sortMembersByRole(getTeamMemberUsers(team, userMap));
  const tint = getTeamTint(team.id);

  return {
    ...team,
    memberUsers,
    memberCount: memberUsers.length,
    roleCounts: getRoleCounts(memberUsers),
    createdLabel: formatTeamCreatedDate(team.created_at),
    initial: getTeamInitial(team.name),
    tintBg: tint.bg,
    tintFg: tint.fg,
  };
}

export function enrichTeams(teams, userMap) {
  return teams.map((team) => enrichTeam(team, userMap));
}

export function countAdmins(members) {
  return members.filter((m) => m.role === 'admin').length;
}

export function canManageMembers(currentUser) {
  const role = currentUser?.role;
  return role === 'admin' || role === 'manager';
}

export function canRemoveMember(member, members, currentUser) {
  if (!canManageMembers(currentUser)) return false;
  if (member.role === 'admin' && countAdmins(members) <= 1) return false;
  if (member.id === currentUser?.id && member.role === 'admin' && countAdmins(members) <= 1) {
    return false;
  }
  return true;
}
