import { Copy, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { formatDate } from './admin-utils.js';
import {
  formatWorkspaceApp,
  formatWorkspaceProvider,
  getWorkspaceCustomerName,
  getWorkspacePackageName,
} from './workspace-utils.js';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  StatusBadge,
} from '@/components/ui/index.js';

const DetailItem = ({ label, value, children }) => (
  <div className="rounded-card border border-white/10 bg-white/[0.035] p-4">
    <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#8FA39B]">{label}</p>
    <div className="mt-2 text-sm font-semibold text-white">{children || value || '-'}</div>
  </div>
);

const copyText = async (value) => {
  if (!value) return;
  await navigator.clipboard?.writeText(value);
};

export function WorkspaceDetail({ workspace }) {
  const [showPassword, setShowPassword] = useState(false);
  const workspaceUrls = workspace?.workspaceUrls || {};
  const urlEntries = Object.entries(workspaceUrls).filter(([, value]) => Boolean(value));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader title="Workspace Summary" description="Manual GPU workspace assignment." />
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <DetailItem label="Customer" value={getWorkspaceCustomerName(workspace)} />
          <DetailItem label="Package" value={getWorkspacePackageName(workspace)} />
          <DetailItem label="Provider" value={formatWorkspaceProvider(workspace.provider)} />
          <DetailItem label="GPU" value={workspace.gpuModel} />
          <DetailItem label="Status">
            <StatusBadge status={workspace.status} label={workspace.status} />
          </DetailItem>
          <DetailItem label="Expiry" value={formatDate(workspace.expiryDate)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Applications Installed" />
        <CardContent>
          {workspace.installedApps?.length ? (
            <div className="flex flex-wrap gap-2">
              {workspace.installedApps.map((app) => (
                <Badge key={app} variant="default">
                  {formatWorkspaceApp(app)}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#8FA39B]">No applications selected.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Workspace URLs" />
        <CardContent className="space-y-3">
          {urlEntries.length ? (
            urlEntries.map(([app, url]) => (
              <div
                key={app}
                className="flex flex-col gap-3 rounded-card border border-white/10 bg-white/[0.035] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-bold text-white">{formatWorkspaceApp(app)}</p>
                  <p className="mt-1 break-all text-sm text-[#8FA39B]">{url}</p>
                </div>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  rightIcon={<ExternalLink className="h-4 w-4" />}
                >
                  <a href={url} target="_blank" rel="noreferrer">
                    Open
                  </a>
                </Button>
              </div>
            ))
          ) : (
            <p className="text-sm text-[#8FA39B]">No workspace URLs configured.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Advanced Access" description="Sensitive connection details." />
        <CardContent className="grid gap-4 md:grid-cols-2">
          <DetailItem label="Instance IP" value={workspace.instanceIP} />
          <DetailItem label="SSH Username" value={workspace.sshUsername} />
          <DetailItem label="SSH Port" value={workspace.sshPort} />
          <DetailItem label="SSH Password">
            <div className="flex items-center justify-between gap-3">
              <span className="min-w-0 truncate">
                {showPassword ? workspace.sshPassword || 'Not returned by API' : 'Hidden'}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="icon"
                  size="sm"
                  aria-label={showPassword ? 'Hide password' : 'Reveal password'}
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  variant="icon"
                  size="sm"
                  aria-label="Copy password"
                  onClick={() => copyText(workspace.sshPassword)}
                  disabled={!workspace.sshPassword}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DetailItem>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Notes" />
        <CardContent>
          <p className="whitespace-pre-wrap text-sm leading-6 text-[#8FA39B]">
            {workspace.notes || 'No notes recorded.'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
