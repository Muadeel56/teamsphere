import { useEffect, useState } from 'react';
import { getTasks, createTask } from '../services/tasks';
import { getProjects } from '../services/projects';
import { getListFromResponse } from '../lib/apiList';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import Card from '../components/Card';
import { Plus, CheckSquare, Folder } from 'lucide-react';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [project, setProject] = useState('');
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  async function fetchTasks() {
    setLoading(true);
    try {
      const res = await getTasks();
      setTasks(getListFromResponse(res.data));
    } catch (e) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }

  async function fetchProjects() {
    try {
      const res = await getProjects();
      setProjects(getListFromResponse(res.data));
    } catch (e) {}
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    setCreating(true);
    try {
      await createTask({ title, description, project });
      setTitle('');
      setDescription('');
      setProject('');
      setModalOpen(false);
      fetchTasks();
    } catch (e) {
      setError('Failed to create task');
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <Button icon={<Plus size={18} />} onClick={() => setModalOpen(true)}>
          Add Task
        </Button>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <CheckSquare size={48} />
          <div className="mt-2 text-lg">No tasks yet. Click "Add Task" to get started!</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {tasks.map(t => (
            <Card key={t.id} className="flex flex-col gap-2 hover:shadow-xl transition-shadow cursor-pointer group">
              <div className="flex items-center gap-2 mb-2">
                <CheckSquare size={22} className="text-emerald-500 group-hover:text-emerald-700" />
                <div className="font-semibold text-lg truncate">{t.title}</div>
              </div>
              <div className="text-gray-500 text-sm line-clamp-2">{t.description || 'No description'}</div>
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                <Folder size={16} />
                <span>{projects.find(p => p.id === t.project)?.name || 'No project'}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Task">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Task title" required />
          <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
          <Input as="select" value={project} onChange={e => setProject(e.target.value)}>
            <option value="">Select Project</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </Input>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex justify-end">
            <Button type="submit" loading={creating}>Create</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
} 