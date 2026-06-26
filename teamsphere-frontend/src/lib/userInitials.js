export function getUserInitials(user) {
  if (!user) return 'AR';

  if (user.first_name || user.last_name) {
    const first = (user.first_name || '').charAt(0);
    const last = (user.last_name || '').charAt(0);
    const initials = `${first}${last}`.trim();
    if (initials) return initials.toUpperCase();
  }

  if (user.username) {
    return user.username.slice(0, 2).toUpperCase();
  }

  if (user.email) {
    const local = user.email.split('@')[0] || '';
    return local.slice(0, 2).toUpperCase() || 'AR';
  }

  return 'AR';
}

export function getUserDisplayName(user) {
  if (!user) return 'Amara Reyes';

  if (user.first_name || user.last_name) {
    return [user.first_name, user.last_name].filter(Boolean).join(' ');
  }

  return user.username || user.email || 'Team member';
}
