import { getProjects } from './projects';
import { getTasks } from './tasks';
import { getListFromResponse } from '../lib/apiList';

export async function getDashboardData() {
  const [projectsRes, tasksRes] = await Promise.all([getProjects(), getTasks()]);

  const projects = getListFromResponse(projectsRes.data);
  const tasks = getListFromResponse(tasksRes.data);

  const today = new Date().toISOString().slice(0, 10);
  const dueToday = tasks.filter(
    (t) => t.due_date && t.due_date.slice(0, 10) === today,
  ).length;
  const openTasks = tasks.filter((t) => t.status !== 'done').length;

  return {
    kpis: {
      projects: projects.length,
      tasks: dueToday || openTasks,
      teamOnline: 24,
      attendance: 94,
    },
  };
}
