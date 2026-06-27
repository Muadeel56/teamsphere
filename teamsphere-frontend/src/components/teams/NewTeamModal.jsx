import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Check, Plus } from 'lucide-react';

import Modal from '../Modal';
import Button from '../Button';
import Input from '../Input';
import Avatar from '../Avatar';
import { createTeam } from '../../services/teams';
import { getUserDisplayName, getUserInitials } from '../../lib/userInitials';

const schema = z.object({
  name: z.string().trim().min(2, 'At least 2 characters'),
});

export default function NewTeamModal({ open, onClose, onCreated, memberOptions = [] }) {
  const [selectedIds, setSelectedIds] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '' },
  });

  useEffect(() => {
    if (open) {
      reset({ name: '' });
      setSelectedIds([]);
    }
  }, [open, reset]);

  const toggleMember = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const onSubmit = async (data) => {
    try {
      await createTeam({
        name: data.name.trim(),
        members: selectedIds,
      });
      toast.success('Team created');
      onClose();
      onCreated?.();
    } catch {
      toast.error('Failed to create team. Please try again.');
    }
  };

  const footer = (
    <div className="flex items-center justify-end gap-3 -mx-5 -mb-5 mt-5 px-5 py-5 border-t border-[var(--color-border)] bg-[var(--color-surface-2)] rounded-b-[14px]">
      <Button variant="secondary" size="sm" onClick={onClose} disabled={isSubmitting}>
        Cancel
      </Button>
      <Button size="sm" loading={isSubmitting} onClick={handleSubmit(onSubmit)}>
        Create team
      </Button>
    </div>
  );

  return (
    <Modal open={open} onClose={onClose} title="New team" footer={footer}>
      <p className="text-[13.5px] text-[var(--color-muted)] -mt-1 mb-4">
        Name your team and add members to get started.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Input
          label="Team name"
          placeholder="e.g. Growth Engineering"
          disabled={isSubmitting}
          error={errors.name?.message}
          autoFocus
          {...register('name')}
        />

        {memberOptions.length > 0 && (
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <label className="text-[13px] font-medium text-[var(--color-text)]">
                Members{' '}
                <span className="text-[var(--color-subtle)] font-normal">· optional</span>
              </label>
              <span className="font-mono text-[11.5px] text-[var(--color-subtle)]">
                {selectedIds.length} selected
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {memberOptions.map((user) => {
                const selected = selectedIds.includes(user.id);
                return (
                  <button
                    key={user.id}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => toggleMember(user.id)}
                    className="inline-flex items-center gap-2 h-9 pl-1.5 pr-3 rounded-full border text-[12.5px] font-semibold cursor-pointer transition-colors disabled:opacity-60"
                    style={{
                      borderColor: selected ? 'var(--color-primary)' : 'var(--color-border)',
                      background: selected ? 'var(--color-primary-subtle)' : 'var(--color-surface)',
                      color: selected ? 'var(--color-primary)' : 'var(--color-text)',
                    }}
                  >
                    <Avatar initials={getUserInitials(user)} size="sm" />
                    {getUserDisplayName(user)}
                    {selected ? <Check size={13} strokeWidth={2.6} /> : <Plus size={13} strokeWidth={2.2} />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
}
