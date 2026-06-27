import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import Modal from '../Modal';
import Button from '../Button';
import Input from '../Input';
import { inviteTeamMember } from '../../services/teams';

const schema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
  role: z.enum(['admin', 'manager', 'member']),
});

const selectClasses =
  'w-full h-10 px-3 rounded-[8px] border border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-text)] text-[14px] font-normal transition-[border-color,box-shadow] duration-150 focus:outline-none focus:border-[var(--color-primary)] focus:shadow-[0_0_0_3px_var(--color-ring)] disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-subtle)] disabled:cursor-not-allowed';

function getInviteErrorMessage(err) {
  const status = err?.response?.status;
  const detail = err?.response?.data?.detail;
  const emailError = err?.response?.data?.email;

  if (status === 404 || detail?.toLowerCase?.().includes('no user')) {
    return 'No user found with that email address.';
  }
  if (status === 400 && detail?.toLowerCase?.().includes('already')) {
    return 'This user is already a member of the team.';
  }
  if (emailError) return emailError;
  if (detail) return detail;
  return 'Failed to send invite. Please try again.';
}

export default function InviteMemberModal({ open, onClose, teamId, onInvited }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', role: 'member' },
  });

  useEffect(() => {
    if (open) reset({ email: '', role: 'member' });
  }, [open, reset]);

  const onSubmit = async (data) => {
    if (!teamId) return;
    try {
      await inviteTeamMember(teamId, {
        email: data.email.trim(),
        role: data.role,
      });
      toast.success('Member invited');
      onClose();
      onInvited?.();
    } catch (err) {
      toast.error(getInviteErrorMessage(err));
    }
  };

  const footer = (
    <div className="flex items-center justify-end gap-3 -mx-5 -mb-5 mt-5 px-5 py-5 border-t border-[var(--color-border)] bg-[var(--color-surface-2)] rounded-b-[14px]">
      <Button variant="secondary" size="sm" onClick={onClose} disabled={isSubmitting}>
        Cancel
      </Button>
      <Button size="sm" loading={isSubmitting} onClick={handleSubmit(onSubmit)}>
        Send invite
      </Button>
    </div>
  );

  return (
    <Modal open={open} onClose={onClose} title="Invite member" footer={footer}>
      <p className="text-[13.5px] text-[var(--color-muted)] -mt-1 mb-4">
        Invite an existing workspace user by email.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="colleague@company.com"
          disabled={isSubmitting}
          error={errors.email?.message}
          autoFocus
          {...register('email')}
        />

        <div>
          <label htmlFor="invite-role" className="block font-medium text-[13px] mb-[7px] text-[var(--color-text)]">
            Role
          </label>
          <select
            id="invite-role"
            className={selectClasses}
            disabled={isSubmitting}
            {...register('role')}
          >
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="member">Member</option>
          </select>
          {errors.role?.message && (
            <p className="text-[12.5px] text-[var(--color-danger)] mt-1.5">{errors.role.message}</p>
          )}
        </div>
      </form>
    </Modal>
  );
}
