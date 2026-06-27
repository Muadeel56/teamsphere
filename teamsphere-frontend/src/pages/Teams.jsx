import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import { useAuthStore } from '../store/authStore';
import {
  deleteTeam,
  getTeam,
  getTeamsPageData,
  removeTeamMember,
  updateMemberRole,
} from '../services/teams';
import { enrichTeam } from '../lib/teamHelpers';

import Button from '../components/Button';
import TeamCard from '../components/teams/TeamCard';
import { TeamsSkeletonGrid } from '../components/teams/TeamCardSkeleton';
import TeamsEmptyState from '../components/teams/TeamsEmptyState';
import TeamsErrorState from '../components/teams/TeamsErrorState';
import TeamDetailDrawer from '../components/teams/TeamDetailDrawer';
import NewTeamModal from '../components/teams/NewTeamModal';
import InviteMemberModal from '../components/teams/InviteMemberModal';

export default function Teams() {
  const user = useAuthStore((s) => s.user);

  const [teams, setTeams] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [selectedTeamDetail, setSelectedTeamDetail] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteTeamId, setInviteTeamId] = useState(null);
  const [kebabOpenId, setKebabOpenId] = useState(null);

  const loadTeams = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const data = await getTeamsPageData(user);
      setTeams(data.teams);
      setUserMap(data.userMap);
      setAllUsers(data.allUsers);
      return data;
    } catch {
      setLoadError(true);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  const refreshSelectedTeam = useCallback(
    async (teamId, mapOverride) => {
      if (!teamId) return;
      try {
        const res = await getTeam(teamId);
        const map = mapOverride ?? userMap;
        setSelectedTeamDetail(enrichTeam(res.data, map));
      } catch {
        toast.error('Failed to refresh team details.');
      }
    },
    [userMap],
  );

  useEffect(() => {
    if (!selectedTeamId) {
      setSelectedTeamDetail(null);
      return;
    }
    const fromList = teams.find((t) => t.id === selectedTeamId);
    if (fromList) {
      setSelectedTeamDetail(fromList);
    }
    refreshSelectedTeam(selectedTeamId);
  }, [selectedTeamId, teams, refreshSelectedTeam]);

  const selectedTeam = useMemo(() => {
    if (selectedTeamDetail) return selectedTeamDetail;
    return teams.find((t) => t.id === selectedTeamId) ?? null;
  }, [selectedTeamDetail, selectedTeamId, teams]);

  const handleViewTeam = (teamId) => {
    setKebabOpenId(null);
    setSelectedTeamId(teamId);
  };

  const handleDeleteTeam = async (teamId) => {
    try {
      await deleteTeam(teamId);
      toast.success('Team deleted');
      if (selectedTeamId === teamId) setSelectedTeamId(null);
      await loadTeams();
    } catch {
      toast.error('Failed to delete team. Please try again.');
    }
  };

  const handleRoleChange = async (userId, role) => {
    if (!selectedTeamId) return;
    try {
      await updateMemberRole(userId, role);
      toast.success('Role updated');
      const data = await loadTeams();
      await refreshSelectedTeam(selectedTeamId, data?.userMap);
    } catch {
      toast.error('Failed to update role. Please try again.');
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!selectedTeamId) return;
    try {
      await removeTeamMember(selectedTeamId, userId);
      toast.success('Member removed');
      const data = await loadTeams();
      await refreshSelectedTeam(selectedTeamId, data?.userMap);
    } catch {
      toast.error('Failed to remove member. Please try again.');
    }
  };

  const handleInvite = () => {
    if (!selectedTeamId) return;
    setInviteTeamId(selectedTeamId);
    setInviteModalOpen(true);
  };

  const handleInvited = async () => {
    const data = await loadTeams();
    if (inviteTeamId) await refreshSelectedTeam(inviteTeamId, data?.userMap);
  };

  return (
    <div style={{ animation: 'ds-rise .4s cubic-bezier(.2,.8,.2,1) both' }}>
      {kebabOpenId != null && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-[25] cursor-default border-none bg-transparent p-0"
          onClick={() => setKebabOpenId(null)}
        />
      )}

      <div className="flex items-end justify-between gap-4 flex-wrap mb-[26px]">
        <div>
          <div className="flex items-center gap-[11px]">
            <h2 className="font-serif text-[30px] font-medium leading-tight tracking-[-0.01em] text-[var(--color-text)] m-0">
              Teams
            </h2>
            {!loading && !loadError && (
              <span className="font-mono text-[13px] font-semibold text-[var(--color-muted)] bg-[var(--color-surface-2)] border border-[var(--color-border)] px-2.5 py-0.5 rounded-full">
                {teams.length} teams
              </span>
            )}
          </div>
          <p className="text-[15px] text-[var(--color-muted)] mt-[7px] mb-0">
            The groups doing the work, and who&apos;s in them.
          </p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => setCreateModalOpen(true)}>
          New team
        </Button>
      </div>

      {loading && <TeamsSkeletonGrid />}

      {!loading && loadError && <TeamsErrorState onRetry={loadTeams} />}

      {!loading && !loadError && teams.length === 0 && (
        <TeamsEmptyState onCreate={() => setCreateModalOpen(true)} />
      )}

      {!loading && !loadError && teams.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-[18px]">
          {teams.map((team, index) => (
            <TeamCard
              key={team.id}
              team={team}
              animationDelay={`${index * 0.04}s`}
              kebabOpen={kebabOpenId === team.id}
              onKebabToggle={setKebabOpenId}
              onView={() => handleViewTeam(team.id)}
              onDelete={() => handleDeleteTeam(team.id)}
            />
          ))}
        </div>
      )}

      <TeamDetailDrawer
        open={Boolean(selectedTeamId)}
        team={selectedTeam}
        currentUser={user}
        onClose={() => setSelectedTeamId(null)}
        onInvite={handleInvite}
        onRoleChange={handleRoleChange}
        onRemoveMember={handleRemoveMember}
      />

      <NewTeamModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={loadTeams}
        memberOptions={allUsers}
      />

      <InviteMemberModal
        open={inviteModalOpen}
        teamId={inviteTeamId}
        onClose={() => {
          setInviteModalOpen(false);
          setInviteTeamId(null);
        }}
        onInvited={handleInvited}
      />
    </div>
  );
}
