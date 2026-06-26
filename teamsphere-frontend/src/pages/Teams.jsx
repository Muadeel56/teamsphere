import { useEffect, useState } from 'react';
import { getTeams, createTeam } from '../services/teams';
import { getListFromResponse } from '../lib/apiList';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import Card from '../components/Card';
import { Plus, Users } from 'lucide-react';

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

  async function fetchTeams() {
    setLoading(true);
    try {
      const res = await getTeams();
      setTeams(getListFromResponse(res.data));
    } catch (e) {
      setError('Failed to load teams');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    setCreating(true);
    try {
      await createTeam({ name });
      setName('');
      setModalOpen(false);
      fetchTeams();
    } catch (e) {
      setError('Failed to create team');
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Teams</h2>
        <Button icon={<Plus size={18} />} onClick={() => setModalOpen(true)}>
          Add Team
        </Button>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : teams.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <Users size={48} />
          <div className="mt-2 text-lg">No teams yet. Click "Add Team" to get started!</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {teams.map(t => (
            <Card key={t.id} className="flex flex-col gap-2 hover:shadow-xl transition-shadow cursor-pointer group">
              <div className="flex items-center gap-2 mb-2">
                <Users size={22} className="text-pink-500 group-hover:text-pink-700" />
                <div className="font-semibold text-lg truncate">{t.name}</div>
              </div>
            </Card>
          ))}
        </div>
      )}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Team">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="Team name" required />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex justify-end">
            <Button type="submit" loading={creating}>Create</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
} 