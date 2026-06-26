import { useEffect, useState } from 'react';
import { getProjects, createProject } from '../services/projects';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import { Plus, Folder } from 'lucide-react';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    setLoading(true);
    try {
      const res = await getProjects();
      setProjects(res.data);
    } catch (e) {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    setCreating(true);
    try {
      await createProject({ name, description });
      setName('');
      setDescription('');
      setModalOpen(false);
      fetchProjects();
    } catch (e) {
      setError('Failed to create project');
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Projects</h2>
        <Button icon={<Plus size={18} />} onClick={() => setModalOpen(true)}>
          Add Project
        </Button>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <Folder size={48} />
          <div className="mt-2 text-lg">No projects yet. Click "Add Project" to get started!</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {projects.map(p => (
            <div key={p.id} className="ts-card flex flex-col gap-2 transition-shadow hover:shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <Folder size={24} className="text-blue-500 group-hover:text-blue-700" />
                <div className="font-semibold text-lg truncate">{p.name}</div>
              </div>
              <div className="text-gray-500 text-sm line-clamp-2">{p.description || 'No description'}</div>
            </div>
          ))}
        </div>
      )}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Project">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="Project name" required />
          <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex justify-end">
            <Button type="submit" loading={creating}>Create</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
} 