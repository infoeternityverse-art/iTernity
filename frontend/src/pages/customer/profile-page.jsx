import { useEffect, useState } from 'react';
import { ChangePasswordForm, ProfileForm } from '@/components/dashboard/profile-forms.jsx';
import { formatDate } from '@/components/dashboard/dashboard-utils.js';
import { Alert, Card, CardContent, PageHeader, SectionHeader } from '@/components/ui/index.js';
import { useAuthStore } from '@/store/auth-store.js';

export function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const changePassword = useAuthStore((state) => state.changePassword);
  const [success, setSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [pendingEmailChange, setPendingEmailChange] = useState(null);
  const [emailChangeRetryAt, setEmailChangeRetryAt] = useState(0);
  const [clock, setClock] = useState(Date.now());
  const emailChangeCooldownSeconds = emailChangeRetryAt
    ? Math.max(0, Math.ceil((emailChangeRetryAt - clock) / 1000))
    : 0;

  useEffect(() => {
    if (!emailChangeRetryAt || emailChangeRetryAt <= Date.now()) return undefined;

    const timer = window.setInterval(() => {
      const now = Date.now();
      setClock(now);

      if (now >= emailChangeRetryAt) {
        window.clearInterval(timer);
      }
    }, 1000);

    return () => window.clearInterval(timer);
  }, [emailChangeRetryAt]);

  const handleProfileUpdate = async (payload) => {
    let result;
    setProfileError('');
    setSuccess('');
    setProfileLoading(true);

    try {
      result = await updateProfile(payload);
    } catch (requestError) {
      if (requestError.status === 429 && requestError.retryAfterSeconds) {
        const retryAt = Date.now() + requestError.retryAfterSeconds * 1000;
        setClock(Date.now());
        setEmailChangeRetryAt(retryAt);
      } else {
        setProfileError(requestError.message);
      }
      return;
    } finally {
      setProfileLoading(false);
    }

    if (result.emailChangePending) {
      setSuccess('');
      setPendingEmailChange({ currentEmail: user.email, newEmail: payload.email });
      setClock(Date.now());
      setEmailChangeRetryAt(Date.now() + 60 * 1000);
      return;
    }

    setPendingEmailChange(null);
    setSuccess('Profile updated successfully.');
  };

  const handlePasswordChange = async (payload) => {
    setPasswordError('');
    setSuccess('');
    setPasswordLoading(true);

    try {
      await changePassword(payload);
      setSuccess('Password updated successfully.');
      return true;
    } catch (requestError) {
      setPasswordError(requestError.message);
      return false;
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        description="Manage account information and password settings."
      />
      {success && (
        <Alert variant="success" onDismiss={() => setSuccess('')}>
          {success}
        </Alert>
      )}
      {pendingEmailChange && (
        <Alert
          variant="warning"
          title="Action required: confirm both email addresses"
          onDismiss={() => setPendingEmailChange(null)}
        >
          <ol className="list-decimal space-y-2 pl-4">
            <li>
              Confirm the security message sent to{' '}
              <strong>{pendingEmailChange.currentEmail}</strong>.
            </li>
            <li>
              Confirm the ownership message sent to <strong>{pendingEmailChange.newEmail}</strong>.
            </li>
            <li>After both confirmations, sign out and use the new email on your next sign-in.</li>
          </ol>
          <p className="mt-3">Until then, your account continues using the current email.</p>
        </Alert>
      )}
      <Card>
        <CardContent className="grid gap-4 p-6 md:grid-cols-3">
          <div>
            <p className="text-sm text-slate-500">Name</p>
            <p className="font-medium">{user?.name}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Email</p>
            <p className="font-medium">{user?.email}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Last Login</p>
            <p className="font-medium">{formatDate(user?.lastLoginAt)}</p>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-4 p-6">
            <SectionHeader title="Update Profile" />
            <ProfileForm
              user={user}
              onSubmit={handleProfileUpdate}
              loading={profileLoading}
              error={profileError}
              emailChangeCooldownSeconds={emailChangeCooldownSeconds}
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-4 p-6">
            <SectionHeader title="Change Password" />
            <ChangePasswordForm
              onSubmit={handlePasswordChange}
              loading={passwordLoading}
              error={passwordError}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
