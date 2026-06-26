import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { login as loginApi, getCurrentUser } from '../../services/auth';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/Button';
import Input from '../../components/Input';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });
  const setAuth = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      const res = await loginApi({ email: data.email, password: data.password });
      const token = res.data.access;
      if (!token) throw new Error('No token received');
      setAuth(null, token);
      const userRes = await getCurrentUser();
      setAuth(userRes.data, token);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="animate-[ds-rise_.5s_cubic-bezier(.2,.8,.2,1)_both]">
        <h1 className="m-0 mb-2 font-serif text-[34px] leading-[1.15] font-medium tracking-[-0.01em] text-[var(--color-text)]">
          Welcome back
        </h1>
        <p className="m-0 mb-[26px] text-[15px] leading-[1.55] text-[var(--color-muted)]">
          Sign in to pick up where your team left off.
        </p>
      </div>

      <div className="mb-3.5 animate-[ds-rise_.5s_cubic-bezier(.2,.8,.2,1)_both] [animation-delay:.08s]">
        <Input
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          error={errors.email?.message}
          className="[&_input]:h-11 [&_input]:rounded-[9px] [&_input]:px-3.5 [&_input]:text-[14.5px]"
          {...register('email')}
        />
      </div>

      <div className="mb-3.5 animate-[ds-rise_.5s_cubic-bezier(.2,.8,.2,1)_both] [animation-delay:.14s]">
        <div className="mb-1.5 flex items-baseline justify-between">
          <label htmlFor="password" className="text-[13px] font-medium text-[var(--color-text)]">
            Password
          </label>
          <Link
            to="/forgot-password"
            className="text-[12.5px] font-medium text-[var(--color-primary)] hover:underline"
          >
            Forgot?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="Your password"
          error={errors.password?.message}
          className="[&_input]:h-11 [&_input]:rounded-[9px] [&_input]:px-3.5 [&_input]:text-[14.5px]"
          {...register('password')}
        />
      </div>

      {error && (
        <div className="mb-3.5 rounded-lg border border-[var(--color-danger)] bg-[var(--color-danger-subtle)] px-3 py-2 text-[12.5px] text-[var(--color-danger)]">
          {error}
        </div>
      )}

      <Button
        type="submit"
        className="h-[46px] w-full rounded-[10px] text-[15px]"
        loading={loading}
        disabled={loading}
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </Button>

      <p className="mt-[22px] animate-[ds-rise_.5s_cubic-bezier(.2,.8,.2,1)_both] [animation-delay:.32s] text-center text-sm text-[var(--color-muted)]">
        New to TeamSphere?{' '}
        <Link to="/register" className="font-semibold text-[var(--color-primary)] hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
