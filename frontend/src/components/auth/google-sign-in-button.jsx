export function GoogleSignInButton({ onClick, disabled = false, loading = false }) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        {/* <p className="text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#2DE8C4]">
          Fastest and recommended
        </p> */}
        <button
          type="button"
          disabled={disabled}
          onClick={onClick}
          className="group relative flex min-h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-full border border-white/80 bg-white px-6 py-4 text-[15px] font-extrabold text-[#101713] shadow-[0_20px_54px_rgba(0,0,0,0.28),0_0_0_1px_rgba(45,232,196,0.08)] transition-all duration-200 ease-premium hover:-translate-y-0.5 hover:border-[#2DE8C4] hover:shadow-[0_24px_64px_rgba(45,232,196,0.20)] active:translate-y-0 active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          <span className="pointer-events-none absolute inset-x-10 bottom-0 h-px bg-gradient-to-r from-transparent via-[#2DE8C4] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <svg
            viewBox="0 0 256 262"
            preserveAspectRatio="xMidYMid"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-auto shrink-0"
            aria-hidden="true"
          >
          <path
            d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
            fill="#4285F4"
          />
          <path
            d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
            fill="#34A853"
          />
          <path
            d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
            fill="#FBBC05"
          />
          <path
            d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
            fill="#EB4335"
          />
          </svg>
          {loading ? 'Connecting securely...' : 'Continue with Google'}
        </button>
      </div>
      <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#71847C]">
        <span className="h-px flex-1 bg-white/10" />
        <span>or continue with email</span>
        <span className="h-px flex-1 bg-white/10" />
      </div>
    </div>
  );
}
