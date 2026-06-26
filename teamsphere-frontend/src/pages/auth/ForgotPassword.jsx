import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';
import { requestPasswordReset } from '../../services/auth';
import Button from '../../components/Button';
import Input from '../../components/Input';

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
});

function SuccessView({ sentEmail, onResend, resending }) {
  return (
    <div className="animate-[ds-rise_.5s_cubic-bezier(.2,.8,.2,1)_both] text-center">
      <div className="mx-auto mb-[22px] grid h-16 w-16 place-items-center rounded-full bg-[var(--color-success-subtle)] animate-[ds-pop_.5s_cubic-bezier(.2,.9,.3,1.2)_both]">
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
          <path
            d="M8 15.5l4.5 4.5L22 9.5"
            stroke="var(--color-success)"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h1 className="m-0 mb-3 font-serif text-[32px] leading-[1.15] font-medium tracking-[-0.01em] text-[var(--color-text)]">
        Check your inbox
      </h1>
      <p className="m-0 mb-1.5 text-[15px] leading-[1.6] text-[var(--color-muted)]">
        We sent a password reset link to
      </p>
      <p className="m-0 mb-[26px] break-all text-[15px] font-semibold leading-[1.6] text-[var(--color-text)]">
        {sentEmail}
      </p>

      <div className="mb-[26px] rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-left text-[13px] leading-[1.6] text-[var(--color-muted)]">
        The link expires in 30 minutes. Check your spam folder if you don&apos;t see it.
      </div>

      <div className="flex flex-col gap-2.5">
        <Button
          type="button"
          variant="secondary"
          className="h-[46px] w-full rounded-[10px] text-[15px]"
          loading={resending}
          disabled={resending}
          onClick={onResend}
        >
          {resending ? 'Sending…' : 'Resend link'}
        </Button>
        <Link
          to="/login"
          className="inline-flex h-[46px] w-full items-center justify-center rounded-[10px] bg-[var(--color-primary)] text-[15px] font-semibold text-[var(--color-primary-fg)] transition-colors duration-150 hover:bg-[var(--color-primary-hover)]"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );
}

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');
  const [resending, setResending] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      await requestPasswordReset({ email: data.email });
      setSentEmail(data.email);
      setSent(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await requestPasswordReset({ email: sentEmail });
      toast.success('Reset link sent again.');
    } catch {
      toast.error('Could not resend. Please try again.');
    } finally {
      setResending(false);
    }
  };

  if (sent) {
    return <SuccessView sentEmail={sentEmail} onResend={handleResend} resending={resending} />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="animate-[ds-rise_.5s_cubic-bezier(.2,.8,.2,1)_both]">
        <h1 className="m-0 mb-2 font-serif text-[34px] leading-[1.15] font-medium tracking-[-0.01em] text-[var(--color-text)]">
          Reset your password
        </h1>
        <p className="m-0 mb-[26px] text-[15px] leading-[1.55] text-[var(--color-muted)]">
          Enter the email on your account and we&apos;ll send a secure reset link.
        </p>
      </div>

      <div className="mb-3.5 animate-[ds-rise_.5s_cubic-bezier(.2,.8,.2,1)_both] [animation-delay:.08s]">
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

      {error && (
        <div className="mb-3.5 rounded-lg border border-[var(--color-danger)] bg-[var(--color-danger-subtle)] px-3 py-2 text-[12.5px] text-[var(--color-danger)]">
          {error}
        </div>
      )}

      <div className="animate-[ds-rise_.5s_cubic-bezier(.2,.8,.2,1)_both] [animation-delay:.14s]">
        <Button
          type="submit"
          className="h-[46px] w-full rounded-[10px] text-[15px]"
          loading={loading}
          disabled={loading}
        >
          {loading ? 'Sending…' : 'Send reset link'}
        </Button>
      </div>

      <p className="mt-[22px] animate-[ds-rise_.5s_cubic-bezier(.2,.8,.2,1)_both] [animation-delay:.20s] text-center text-sm text-[var(--color-muted)]">
        Remember it?{' '}
        <Link to="/login" className="font-semibold text-[var(--color-primary)] hover:underline">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
