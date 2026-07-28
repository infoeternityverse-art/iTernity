import {
  Bot,
  CalendarClock,
  CheckCircle2,
  Clipboard,
  Code2,
  Cpu,
  ExternalLink,
  Globe2,
  HardDrive,
  Layers3,
  Lock,
  NotebookTabs,
  RotateCcw,
  Server,
  Sparkles,
  WifiOff,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { ConnectGpuGuideModal } from './connect-gpu-guide-modal.jsx';
import {
  Accordion,
  Button,
  Card,
  CardContent,
  CardHeader,
  EmptyState,
  Skeleton,
  StatusBadge,
} from '@/components/ui/index.js';
import { copyToClipboard, formatDate } from './dashboard-utils.js';
import { workspaceService } from '@/services/workspace-service.js';
import {
  formatWorkspaceApp,
  formatWorkspaceProvider,
  formatWorkspaceStatus,
  getWorkspacePackageName,
  getWorkspaceDisplayStatus,
  isWorkspaceExpired,
} from '@/components/admin/workspace-utils.js';

const appMeta = {
  comfyui: {
    icon: Sparkles,
    description: 'Visual AI workflow interface for generation and experimentation.',
  },
  jupyterlab: {
    icon: NotebookTabs,
    description: 'Notebook environment for research, training, and analysis.',
  },
  ollama: {
    icon: Bot,
    description: 'Local model runtime for LLM experimentation.',
  },
  openwebui: {
    icon: Globe2,
    description: 'Browser interface for interacting with hosted AI models.',
  },
  codeserver: {
    icon: Code2,
    description: 'Cloud development environment powered by VS Code Server.',
  },
};

const InfoItem = ({ label, value, icon }) => (
  <div className="rounded-card border border-white/10 bg-white/[0.035] p-4">
    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#8FA39B]">
      {icon}
      {label}
    </div>
    <p className="mt-2 break-words text-sm font-semibold text-white">{value || '-'}</p>
  </div>
);

const isWorkspaceReady = (status) => ['running', 'provisioning'].includes(String(status || ''));

const AccessRow = ({ label, value, onCopy, copyLabel = `Copy ${label}` }) => (
  <div className="flex flex-col gap-3 rounded-card border border-white/10 bg-white/[0.035] p-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="min-w-0">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#8FA39B]">{label}</p>
      <p className="mt-2 break-all text-sm font-semibold text-white">{value || '-'}</p>
    </div>
    {onCopy && (
      <Button
        variant="outline"
        size="sm"
        onClick={onCopy}
        disabled={!value}
        leftIcon={<Clipboard className="h-4 w-4" />}
      >
        {copyLabel}
      </Button>
    )}
  </div>
);

function WorkspaceHero({ workspace }) {
  const displayStatus = getWorkspaceDisplayStatus(workspace);

  return (
    <Card className="overflow-hidden border-brand-500/20 bg-[#080808]">
      <CardContent className="relative p-6 sm:p-8">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-500">
              Workspace Status
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <h1 className="text-4xl font-black tracking-normal text-white sm:text-5xl">
                {formatWorkspaceStatus(displayStatus)}
              </h1>
              <StatusBadge status={displayStatus} label={displayStatus} size="lg" />
            </div>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#8FA39B]">
              Your manually provisioned GPU workspace is managed by the Eternityverse operations
              team.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoItem
              label="GPU Model"
              value={workspace.gpuModel}
              icon={<Cpu className="h-4 w-4 text-brand-500" />}
            />
            <InfoItem
              label="GPU Package"
              value={getWorkspacePackageName(workspace)}
              icon={<HardDrive className="h-4 w-4 text-brand-500" />}
            />
            <InfoItem
              label="Provider"
              value={formatWorkspaceProvider(workspace.provider)}
              icon={<Server className="h-4 w-4 text-brand-500" />}
            />
            <InfoItem
              label="Expiry Date"
              value={formatDate(workspace.expiryDate)}
              icon={<CalendarClock className="h-4 w-4 text-brand-500" />}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ApplicationsSection({ workspace }) {
  const apps = workspace.installedApps || [];
  const urls = workspace.workspaceUrls || {};
  const expired = isWorkspaceExpired(workspace);

  return (
    <Card>
      <CardHeader
        title="Applications"
        description="Open the tools installed on your provisioned workspace."
      />
      <CardContent>
        {apps.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {apps.map((app) => {
              const Icon = appMeta[app]?.icon || Layers3;
              const url = urls[app];

              return (
                <div
                  key={app}
                  className="flex min-h-56 flex-col rounded-card border border-white/10 bg-white/[0.035] p-5"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-button border border-brand-500/20 bg-brand-500/10 text-brand-500">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-black text-white">{formatWorkspaceApp(app)}</h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-[#8FA39B]">
                    {appMeta[app]?.description || 'Workspace application configured by admin.'}
                  </p>
                  <Button
                    asChild={Boolean(url && !expired)}
                    disabled={!url || expired}
                    className="mt-5 w-full"
                    rightIcon={<ExternalLink className="h-4 w-4" />}
                  >
                    {url && !expired ? (
                      <a href={url} target="_blank" rel="noreferrer">
                        Open
                      </a>
                    ) : expired ? (
                      'Expired'
                    ) : (
                      'URL pending'
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No applications configured"
            description="Installed applications will appear here after your administrator configures them."
          />
        )}
      </CardContent>
    </Card>
  );
}

function WorkspaceInformation({ workspace }) {
  return (
    <Card>
      <CardHeader title="Workspace Information" />
      <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <InfoItem label="Provider" value={formatWorkspaceProvider(workspace.provider)} />
        <InfoItem label="Provider Instance ID" value={workspace.providerInstanceId} />
        <InfoItem label="Created Date" value={formatDate(workspace.createdAt)} />
        <InfoItem label="Expiry Date" value={formatDate(workspace.expiryDate)} />
        <div className="rounded-card border border-white/10 bg-white/[0.035] p-4 md:col-span-2">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#8FA39B]">Notes</p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#8FA39B]">
            {workspace.notes || 'No notes from administrator.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function AdvancedAccess({ workspace }) {
  const [isGuideOpen, setGuideOpen] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordRevealEndsAt, setPasswordRevealEndsAt] = useState(null);
  const [now, setNow] = useState(Date.now());
  const host = workspace.instanceIP || '';
  const username = workspace.sshUsername || '';
  const sshCommand = useMemo(() => {
    if (!host || !username) return '';
    return `ssh ${username}@${host}`;
  }, [host, username]);
  const expired = isWorkspaceExpired(workspace);
  const ready = isWorkspaceReady(workspace.status) && !expired;
  const lastUpdatedLabel = workspace.updatedAt
    ? `Last updated: ${formatDate(workspace.updatedAt)}`
    : '';

  useEffect(() => {
    if (!isPasswordVisible) return undefined;

    const timeout = window.setTimeout(() => {
      setPasswordVisible(false);
      setPassword('');
      setPasswordRevealEndsAt(null);
    }, 30000);
    const interval = window.setInterval(() => setNow(Date.now()), 1000);

    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, [isPasswordVisible]);

  const fetchPassword = async () => {
    if (expired) {
      setPasswordError('This workspace has expired. Contact the administrator to renew access.');
      return '';
    }

    if (password) return password;

    setPasswordLoading(true);
    setPasswordError('');

    try {
      const response = await workspaceService.revealCustomerPassword();

      if (!response.password) {
        setPasswordError('No SSH password has been saved for this workspace yet.');
        return '';
      }

      setPassword(response.password);
      return response.password;
    } catch (error) {
      setPasswordError(error.message || 'Password could not be loaded.');
      return '';
    } finally {
      setPasswordLoading(false);
    }
  };

  const revealPassword = async () => {
    const revealedPassword = await fetchPassword();

    if (!revealedPassword) return;

    setNow(Date.now());
    setPasswordVisible(true);
    setPasswordRevealEndsAt(Date.now() + 30000);
  };

  const hidePassword = () => {
    setPasswordVisible(false);
    setPassword('');
    setPasswordRevealEndsAt(null);
  };

  const copyPassword = async () => {
    const revealedPassword = await fetchPassword();

    if (!revealedPassword) return;

    await copyToClipboard(revealedPassword);
    setPasswordVisible(true);
    setPasswordRevealEndsAt(Date.now() + 30000);
  };

  const passwordDisplayValue = isPasswordVisible && password ? password : '************';
  const secondsRemaining = passwordRevealEndsAt
    ? Math.max(0, Math.ceil((passwordRevealEndsAt - now) / 1000))
    : 0;

  return (
    <>
      <Card>
        <CardContent className="space-y-5 p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-500">
                Developer Access
              </p>
              <h2 className="mt-2 text-2xl font-black text-white">Connect to your GPU</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8FA39B]">
                Most customers can use the application cards above. Developers can use this guided
                SSH walkthrough when deeper workspace access is needed.
              </p>
            </div>
            <Button size="lg" onClick={() => setGuideOpen(true)} leftIcon={<TerminalIcon />}>
              Connect to GPU
            </Button>
          </div>

          <Accordion
            items={[
              {
                value: 'advanced-access',
                label: 'Advanced Access',
                content: (
                  <div className="space-y-4 pt-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={[
                          'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-bold',
                          ready
                            ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200'
                            : 'border-red-400/25 bg-red-400/10 text-red-200',
                        ].join(' ')}
                      >
                        {ready ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <WifiOff className="h-4 w-4" />
                        )}
                        {ready ? 'Ready' : 'Offline'}
                      </span>
                      {lastUpdatedLabel && (
                        <span className="text-sm text-[#8FA39B]">{lastUpdatedLabel}</span>
                      )}
                    </div>
                    <div className="grid gap-4 xl:grid-cols-2">
                      <AccessRow
                        label="Public IP Address / Host"
                        value={host}
                        onCopy={() => copyToClipboard(host)}
                        copyLabel="Copy IP"
                      />
                      <AccessRow
                        label="SSH Port"
                        value={workspace.sshPort}
                        onCopy={() => copyToClipboard(workspace.sshPort)}
                        copyLabel="Copy Port"
                      />
                      <AccessRow
                        label="Username"
                        value={username}
                        onCopy={() => copyToClipboard(username)}
                        copyLabel="Copy Username"
                      />
                      <AccessRow
                        label="Authentication Type"
                        value="Administrator-managed password"
                      />
                    </div>
                    <div className="rounded-card border border-white/10 bg-white/[0.035] p-4">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="min-w-0">
                          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#8FA39B]">
                            <Lock className="h-4 w-4 text-brand-500" />
                            Password
                          </p>
                          <p className="mt-2 break-all text-sm font-semibold text-white">
                            {passwordDisplayValue}
                          </p>
                          {passwordError && (
                            <p className="mt-1 text-xs text-red-200">{passwordError}</p>
                          )}
                          {isPasswordVisible && (
                            <p className="mt-1 text-xs text-[#8FA39B]">
                              Hides automatically in {secondsRemaining || 30} seconds.
                            </p>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            loading={passwordLoading}
                            disabled={expired}
                            onClick={revealPassword}
                          >
                            Reveal Password
                          </Button>
                          {isPasswordVisible && (
                            <Button variant="outline" size="sm" onClick={hidePassword}>
                              Hide
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            loading={passwordLoading}
                            disabled={expired}
                            onClick={copyPassword}
                            leftIcon={<Clipboard className="h-4 w-4" />}
                          >
                            Copy Password
                          </Button>
                        </div>
                      </div>
                    </div>
                    <AccessRow
                      label="SSH Command"
                      value={sshCommand}
                      onCopy={() => copyToClipboard(sshCommand)}
                      copyLabel="Copy SSH Command"
                    />
                  </div>
                ),
              },
            ]}
          />
        </CardContent>
      </Card>
      <ConnectGpuGuideModal
        open={isGuideOpen}
        onClose={() => setGuideOpen(false)}
        workspace={workspace}
      />
    </>
  );
}

function TerminalIcon() {
  return <Lock className="h-4 w-4" />;
}

export function CustomerWorkspaceDashboard({ workspace, loading, error, onRetry }) {
  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-72" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-56" />
          <Skeleton className="h-56" />
          <Skeleton className="h-56" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
          <p className="text-lg font-black text-white">Workspace could not be loaded.</p>
          <p className="max-w-xl text-sm leading-6 text-red-200">{error}</p>
          <Button onClick={onRetry} leftIcon={<RotateCcw className="h-4 w-4" />}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!workspace) {
    return (
      <EmptyState
        title="No active workspace found."
        description="Your administrator has not provisioned your workspace yet."
      />
    );
  }

  return (
    <div className="space-y-6">
      <WorkspaceHero workspace={workspace} />
      <ApplicationsSection workspace={workspace} />
      <WorkspaceInformation workspace={workspace} />
      <AdvancedAccess workspace={workspace} />
    </div>
  );
}
