export const ROUTE_TITLES = {
  '/': 'Dashboard',
  '/projects': 'Projects',
  '/tasks': 'Tasks',
  '/teams': 'Teams',
  '/attendance': 'Attendance',
};

export function getPageTitle(pathname) {
  return ROUTE_TITLES[pathname] ?? 'Dashboard';
}
