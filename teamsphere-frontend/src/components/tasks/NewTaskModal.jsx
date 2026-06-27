import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import Modal from '../Modal';
import Button from '../Button';
import Input from '../Input';
import { createTask } from '../../services/tasks';
import { getUserDisplayName } from '../../lib/userInitials';

const schema = z.object({
  title: z.string().trim().min(2, 'At least 2 characters'),
  description: z
    .string()
    .max(500, 'Keep it under 500 characters')
    .optional()
    .or(z.literal('')),
  project: z.coerce.number().int().positive('Project is required'),
  assignee: z.union([z.coerce.number().int().positive(), z.literal('')]).optional(),
  priority: z.enum(['high', 'medium', 'low']),
  due_date: z.string().optional(),
});

const selectClasses =
  'w-full h-10 px-3 rounded-[8px] border border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-text)] text-[14px] font-normal transition-[border-color,box-shadow] duration-150 focus:outline-none focus:border-[var(--color-primary)] focus:shadow-[0_0_0_3px_var(--color-ring)] disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-subtle)] disabled:cursor-not-allowed';

export default function NewTaskModal({
  open,
  onClose,
  onCreated,
  projects,
  assigneeOptions,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      project: '',
      assignee: '',
      priority: 'medium',
      due_date: '',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        title: '',
        description: '',
        project: projects[0]?.id ?? '',
        assignee: '',
        priority: 'medium',
        due_date: '',
      });
    }
  }, [open, projects, reset]);

  const onSubmit = async (data) => {
    try {
      await createTask({
        title: data.title.trim(),
        description: data.description?.trim() || '',
        project: data.project,
        assignee: data.assignee || null,
        priority: data.priority,
        due_date: data.due_date || null,
        status: 'todo',
      });
      toast.success('Task created');
      onClose();
      onCreated?.();
    } catch {
      toast.error('Failed to create task. Please try again.');
    }
  };

  const footer = (
    <div className="flex items-center justify-end gap-3 -mx-5 -mb-5 mt-5 px-5 py-5 border-t border-[var(--color-border)] bg-[var(--color-surface-2)] rounded-b-[14px]">
      <Button variant="secondary" size="sm" onClick={onClose} disabled={isSubmitting}>
        Cancel
      </Button>
      <Button size="sm" loading={isSubmitting} onClick={handleSubmit(onSubmit)}>
        Create task
      </Button>
    </div>
  );

  return (
    <Modal open={open} onClose={onClose} title="New task" footer={footer}>
      <p className="text-[13.5px] text-[var(--color-muted)] -mt-1 mb-4">
        Add a task and assign it to a project.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Input
          label="Title"
          placeholder="e.g. Wire up OAuth callback"
          disabled={isSubmitting}
          error={errors.title?.message}
          autoFocus
          {...register('title')}
        />

        <Input
          as="textarea"
          label={
            <>
              Description{' '}
              <span className="text-[var(--color-subtle)] font-normal">· optional</span>
            </>
          }
          placeholder="Add more detail…"
          disabled={isSubmitting}
          error={errors.description?.message}
          {...register('description')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label htmlFor="task-project" className="block font-medium text-[13px] mb-[7px] text-[var(--color-text)]">
              Project
            </label>
            <select
              id="task-project"
              className={selectClasses}
              disabled={isSubmitting}
              {...register('project')}
            >
              <option value="" disabled>
                Select a project
              </option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            {errors.project?.message && (
              <p className="text-[12.5px] text-[var(--color-danger)] mt-1.5">
                {errors.project.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="task-assignee" className="block font-medium text-[13px] mb-[7px] text-[var(--color-text)]">
              Assignee
            </label>
            <select
              id="task-assignee"
              className={selectClasses}
              disabled={isSubmitting}
              {...register('assignee')}
            >
              <option value="">Unassigned</option>
              {assigneeOptions.map((user) => (
                <option key={user.id} value={user.id}>
                  {getUserDisplayName(user)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label htmlFor="task-priority" className="block font-medium text-[13px] mb-[7px] text-[var(--color-text)]">
              Priority
            </label>
            <select
              id="task-priority"
              className={selectClasses}
              disabled={isSubmitting}
              {...register('priority')}
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label htmlFor="task-due-date" className="block font-medium text-[13px] mb-[7px] text-[var(--color-text)]">
              Due date{' '}
              <span className="text-[var(--color-subtle)] font-normal">· optional</span>
            </label>
            <input
              id="task-due-date"
              type="date"
              className={selectClasses}
              disabled={isSubmitting}
              {...register('due_date')}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
