import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import Modal from '../Modal';
import Button from '../Button';
import Input from '../Input';
import { createProject } from '../../services/projects';
import { getUserDisplayName } from '../../lib/userInitials';

const schema = z.object({
  name: z.string().trim().min(2, 'At least 2 characters'),
  description: z
    .string()
    .max(200, 'Keep it under 200 characters')
    .optional()
    .or(z.literal('')),
  owner: z.coerce.number().int().positive('Owner is required'),
  due_date: z.string().optional(),
});

const selectClasses =
  'w-full h-10 px-3 rounded-[8px] border border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-text)] text-[14px] font-normal transition-[border-color,box-shadow] duration-150 focus:outline-none focus:border-[var(--color-primary)] focus:shadow-[0_0_0_3px_var(--color-ring)] disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-subtle)] disabled:cursor-not-allowed';

export default function NewProjectModal({
  open,
  onClose,
  onCreated,
  defaultOwnerId,
  ownerOptions,
}) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      owner: defaultOwnerId ?? '',
      due_date: '',
    },
  });

  const description = watch('description') ?? '';
  const descLen = description.length;

  useEffect(() => {
    if (open) {
      reset({
        name: '',
        description: '',
        owner: defaultOwnerId ?? '',
        due_date: '',
      });
    }
  }, [open, defaultOwnerId, reset]);

  const onSubmit = async (data) => {
    try {
      await createProject({
        name: data.name.trim(),
        description: data.description?.trim() || '',
        owner: data.owner,
      });
      toast.success('Project created');
      onClose();
      onCreated?.();
    } catch {
      toast.error('Failed to create project. Please try again.');
    }
  };

  const footer = (
    <div className="flex items-center justify-end gap-3 -mx-5 -mb-5 mt-5 px-5 py-5 border-t border-[var(--color-border)] bg-[var(--color-surface-2)] rounded-b-[14px]">
      <Button variant="secondary" size="sm" onClick={onClose} disabled={isSubmitting}>
        Cancel
      </Button>
      <Button
        size="sm"
        loading={isSubmitting}
        onClick={handleSubmit(onSubmit)}
      >
        Create project
      </Button>
    </div>
  );

  return (
    <Modal open={open} onClose={onClose} title="New project" footer={footer}>
      <p className="text-[13.5px] text-[var(--color-muted)] -mt-1 mb-4">
        Give your project a name to get started.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Input
          label="Project name"
          placeholder="e.g. Q4 Marketing Site"
          disabled={isSubmitting}
          error={errors.name?.message}
          autoFocus
          {...register('name')}
        />

        <div>
          <div className="flex items-baseline justify-between mb-[7px]">
            <label className="text-[13px] font-medium text-[var(--color-text)]">
              Description{' '}
              <span className="text-[var(--color-subtle)] font-normal">· optional</span>
            </label>
            <span
              className="font-mono text-[11.5px]"
              style={{ color: descLen > 200 ? 'var(--color-danger)' : 'var(--color-subtle)' }}
            >
              {descLen}/200
            </span>
          </div>
          <Input
            as="textarea"
            placeholder="What is this project about?"
            disabled={isSubmitting}
            error={errors.description?.message}
            {...register('description')}
          />
        </div>

        <div>
          <label htmlFor="project-owner" className="block font-medium text-[13px] mb-[7px] text-[var(--color-text)]">
            Owner
          </label>
          <select
            id="project-owner"
            className={selectClasses}
            disabled={isSubmitting}
            {...register('owner')}
          >
            {ownerOptions.map((user) => (
              <option key={user.id} value={user.id}>
                {getUserDisplayName(user)}
              </option>
            ))}
          </select>
          {errors.owner?.message && (
            <p className="text-[12.5px] text-[var(--color-danger)] mt-1.5">
              {errors.owner.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="project-due-date" className="block font-medium text-[13px] mb-[7px] text-[var(--color-text)]">
            Due date{' '}
            <span className="text-[var(--color-subtle)] font-normal">· optional</span>
          </label>
          <input
            id="project-due-date"
            type="date"
            className={selectClasses}
            disabled={isSubmitting}
            title="Due date is not saved yet — backend support coming soon"
            {...register('due_date')}
          />
          <p className="text-[11.5px] text-[var(--color-subtle)] mt-1.5">
            Not saved yet — backend support coming soon.
          </p>
        </div>
      </form>
    </Modal>
  );
}
