import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';
import { register as registerApi } from '../../services/auth';
import Button from '../../components/Button';
import Input from '../../components/Input';
import PasswordField from '../../components/auth/PasswordField';
import PasswordStrengthMeter from '../../components/auth/PasswordStrengthMeter';

const schema = z
  .object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
    password: z.string().min(8, 'At least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export default function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const passwordValue = watch('password') ?? '';

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      const username = data.email
        .split('@')[0]
        .replace(/[^a-zA-Z0-9_.-]/g, '')
        .toLowerCase();
      await registerApi({
        email: data.email,
        username,
        password: data.password,
        re_password: data.confirmPassword,
        first_name: data.fullName,
      });
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      const detail =
        err?.response?.data?.email?.[0] ||
        err?.response?.data?.username?.[0] ||
        err?.response?.data?.password?.[0] ||
        err?.response?.data?.non_field_errors?.[0];
      setError(detail || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="animate-[ds-rise_.5s_cubic-bezier(.2,.8,.2,1)_both]">
        <h1 className="m-0 mb-2 font-serif text-[34px] leading-[1.15] font-medium tracking-[-0.01em] italic text-[var(--color-text)]">
          Create your account
        </h1>
        <p className="m-0 mb-[26px] text-[15px] leading-[1.55] text-[var(--color-muted)]">
          Start organizing projects, tasks, and attendance.
        </p>
      </div>

      <div className="mb-3.5 animate-[ds-rise_.5s_cubic-bezier(.2,.8,.2,1)_both] [animation-delay:.06s]">
        <Input
          id="fullName"
          label="Full name"
          type="text"
          autoComplete="name"
          placeholder="e.g. Amara Reyes"
          disabled={loading}
          error={errors.fullName?.message}
          className="[&_input]:h-11 [&_input]:rounded-[9px] [&_input]:px-3.5 [&_input]:text-[14.5px]"
          {...register('fullName')}
        />
      </div>

      <div className="mb-3.5 animate-[ds-rise_.5s_cubic-bezier(.2,.8,.2,1)_both] [animation-delay:.10s]">
        <Input
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          disabled={loading}
          error={errors.email?.message}
          className="[&_input]:h-11 [&_input]:rounded-[9px] [&_input]:px-3.5 [&_input]:text-[14.5px]"
          {...register('email')}
        />
      </div>

      <div className="mb-3.5 animate-[ds-rise_.5s_cubic-bezier(.2,.8,.2,1)_both] [animation-delay:.14s]">
        <label className="block font-medium text-[13px] mb-[7px] text-[var(--color-text)]">
          Password
        </label>
        <PasswordField
          id="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          disabled={loading}
          error={errors.password?.message}
          {...register('password')}
        />
        <PasswordStrengthMeter password={passwordValue} />
      </div>

      <div className="mb-3.5 animate-[ds-rise_.5s_cubic-bezier(.2,.8,.2,1)_both] [animation-delay:.18s]">
        <PasswordField
          id="confirmPassword"
          label="Confirm password"
          autoComplete="new-password"
          placeholder="Repeat your password"
          disabled={loading}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
      </div>

      {error && (
        <div className="mb-3.5 rounded-lg border border-[var(--color-danger)] bg-[var(--color-danger-subtle)] px-3 py-2 text-[12.5px] text-[var(--color-danger)]">
          {error}
        </div>
      )}

      <div className="animate-[ds-rise_.5s_cubic-bezier(.2,.8,.2,1)_both] [animation-delay:.22s]">
        <Button
          type="submit"
          className="h-[46px] w-full rounded-[10px] text-[15px]"
          loading={loading}
          disabled={loading}
        >
          {loading ? 'Creating account…' : 'Create account'}
        </Button>
      </div>

      <p className="mt-[22px] animate-[ds-rise_.5s_cubic-bezier(.2,.8,.2,1)_both] [animation-delay:.28s] text-center text-sm text-[var(--color-muted)]">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-[var(--color-primary)] hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
