import { useState } from 'react';
import { Copy, Download, Eye, EyeOff } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, StatusBadge } from '@/components/ui/index.js';
import { copyToClipboard, downloadTextFile, formatDate, getId } from './dashboard-utils.js';

export function CredentialCard({ credential }) {
  const [revealed, setRevealed] = useState(false);
  const password = credential.password || '';
  const maskedPassword = password ? '************' : 'Not available';
  const text = [
    `Host: ${credential.host}`,
    `Port: ${credential.port}`,
    `Username: ${credential.username}`,
    `Password: ${password}`,
    `SSH Command: ${credential.sshCommand}`,
    `Instructions: ${credential.accessInstructions || ''}`,
    `Expires: ${formatDate(credential.expiresAt)}`,
  ].join('\n');

  return (
    <Card>
      <CardHeader
        title={credential.gpuPackage?.name || 'GPU Credential'}
        description={credential.host}
        action={<StatusBadge status={credential.status} label={credential.status} />}
      />
      <CardContent className="space-y-4">
        <dl className="grid gap-3 text-sm md:grid-cols-2">
          <div>
            <dt className="text-[#8FA39B]">Host</dt>
            <dd className="font-semibold text-white">{credential.host}</dd>
          </div>
          <div>
            <dt className="text-[#8FA39B]">Port</dt>
            <dd className="font-semibold text-white">{credential.port}</dd>
          </div>
          <div>
            <dt className="text-[#8FA39B]">Username</dt>
            <dd className="font-semibold text-white">{credential.username}</dd>
          </div>
          <div>
            <dt className="text-[#8FA39B]">Expiry</dt>
            <dd className="font-semibold text-white">{formatDate(credential.expiresAt)}</dd>
          </div>
        </dl>
        <div className="rounded-button border border-white/10 bg-white/[0.055] p-4">
          <p className="text-sm font-semibold text-[#8FA39B]">Password</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <code className="break-all text-sm text-[#F5F7F6]">
              {revealed ? password || 'Not available' : maskedPassword}
            </code>
            <Button
              variant="icon"
              size="sm"
              onClick={() => setRevealed((value) => !value)}
              aria-label="Reveal password"
            >
              {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button
              variant="icon"
              size="sm"
              onClick={() => copyToClipboard(password)}
              aria-label="Copy password"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="rounded-button border border-white/10 bg-white/[0.055] p-4">
          <p className="text-sm font-semibold text-[#8FA39B]">SSH Command</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <code className="break-all text-sm text-[#F5F7F6]">{credential.sshCommand}</code>
            <Button
              variant="icon"
              size="sm"
              onClick={() => copyToClipboard(credential.sshCommand)}
              aria-label="Copy SSH command"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {credential.accessInstructions && (
          <p className="text-sm leading-6 text-[#8FA39B]">{credential.accessInstructions}</p>
        )}
        <Button
          variant="outline"
          onClick={() => downloadTextFile(`credential-${getId(credential)}.txt`, text)}
          leftIcon={<Download className="h-4 w-4" />}
        >
          Download credentials
        </Button>
      </CardContent>
    </Card>
  );
}
