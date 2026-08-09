import { ArrowRight, Check, TriangleAlert } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/index.js';
import { useAuthStore } from '@/store/auth-store.js';

export function EmailChangeConfirmedPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const logout = useAuthStore((state) => state.logout);
  const errorDescription = searchParams.get('error_description') || searchParams.get('error');

  const handleContinue = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  if (errorDescription) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-amber-300/30 bg-amber-300/10 text-amber-300">
          <TriangleAlert aria-hidden="true" className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-white">Confirmation link unavailable</h1>
          <p className="leading-7 text-[#8FA39B]">
            This link may have expired or already been used. Return to your profile to request a new
            email change when needed.
          </p>
        </div>
        <Button className="w-full" onClick={handleContinue}>
          Go to login
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-7 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#2DE8C4]/35 bg-[#2DE8C4]/10 text-[#2DE8C4] shadow-[0_0_36px_rgba(45,232,196,0.16)]">
        <Check aria-hidden="true" className="h-8 w-8" strokeWidth={2.5} />
      </div>
      <div className="space-y-3">
        <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[#2DE8C4]">
          Confirmation complete
        </p>
        <h1 className="text-3xl font-black text-white">Email confirmation recorded</h1>
        <p className="leading-7 text-[#8FA39B]">
          If this was your first confirmation, open the link sent to the other email address as well.
          After both confirmations are complete, sign in using your new email address.
        </p>
      </div>
      <Button
        className="w-full"
        rightIcon={<ArrowRight aria-hidden="true" className="h-4 w-4" />}
        onClick={handleContinue}
      >
        Continue to login
      </Button>
      <p className="text-xs leading-5 text-[#667A72]">
        This page will not redirect automatically.
      </p>
    </div>
  );
}
