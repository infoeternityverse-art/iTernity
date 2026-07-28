import { motion } from 'framer-motion';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clipboard,
  Laptop,
  Monitor,
  Pause,
  Play,
  RotateCcw,
  Terminal,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Card, CardContent, Modal, ProgressBar } from '@/components/ui/index.js';

const operatingSystems = [
  {
    id: 'windows',
    name: 'Windows',
    icon: Monitor,
    description: 'Use Windows Terminal or PowerShell from your Start menu.',
    terminalName: 'Windows Terminal',
  },
  {
    id: 'macos',
    name: 'macOS',
    icon: Laptop,
    description: 'Use Terminal from Applications, Spotlight, or Launchpad.',
    terminalName: 'macOS Terminal',
  },
  {
    id: 'linux',
    name: 'Linux',
    icon: Terminal,
    description: 'Use your desktop terminal or a remote shell session.',
    terminalName: 'Linux Terminal',
  },
];

const firstCommands = [
  { command: 'nvidia-smi', description: 'Check GPU model, VRAM, driver, and active processes.' },
  { command: 'docker ps', description: 'View currently running workspace containers.' },
  { command: 'ls', description: 'List files in the current directory.' },
  { command: 'cd workspace', description: 'Move into the standard workspace directory.' },
  { command: 'pwd', description: 'Print the current directory path.' },
];

const copyText = async (value) => {
  if (!value) return;
  await navigator.clipboard?.writeText(value);
};

function TypingTerminal({ lines = [], playing = true, loop = true, speed = 28, className = '' }) {
  const [visibleText, setVisibleText] = useState('');
  const [sequence, setSequence] = useState(0);
  const outputRef = useRef(null);
  const fullText = useMemo(() => lines.join('\n'), [lines]);

  useEffect(() => {
    setVisibleText('');
  }, [fullText, sequence]);

  useEffect(() => {
    if (!playing || !fullText) return undefined;

    if (visibleText.length >= fullText.length) {
      if (!loop) return undefined;
      const timeout = window.setTimeout(() => {
        setSequence((value) => value + 1);
      }, 1500);
      return () => window.clearTimeout(timeout);
    }

    const timeout = window.setTimeout(() => {
      setVisibleText(fullText.slice(0, visibleText.length + 1));
    }, speed);

    return () => window.clearTimeout(timeout);
  }, [fullText, loop, playing, speed, visibleText]);

  useEffect(() => {
    outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight, behavior: 'smooth' });
  }, [visibleText]);

  return (
    <div
      className={`overflow-hidden rounded-card border border-white/10 bg-[#050505] shadow-soft ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.045] px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-400" />
        <span className="h-3 w-3 rounded-full bg-amber-300" />
        <span className="h-3 w-3 rounded-full bg-emerald-400" />
        <span className="ml-2 text-xs font-semibold text-[#8FA39B]">secure shell</span>
      </div>
      <pre
        ref={outputRef}
        className="min-h-56 max-h-72 overflow-y-auto whitespace-pre-wrap p-5 font-mono text-sm leading-7 text-emerald-200"
      >
        {visibleText}
        <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-emerald-200" />
      </pre>
    </div>
  );
}

function Stepper({ steps, currentStep }) {
  return (
    <div
      className="flex items-center gap-2 overflow-x-auto pb-2"
      aria-label="Connection guide progress"
    >
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isComplete = index < currentStep;

        return (
          <div key={step.title} className="flex items-center gap-2">
            <span
              className={[
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-black transition',
                isActive
                  ? 'border-brand-500 bg-brand-500 text-white shadow-cyan'
                  : isComplete
                    ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200'
                    : 'border-white/10 bg-white/[0.04] text-[#8FA39B]',
              ].join(' ')}
            >
              {isComplete ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
            </span>
            {index < steps.length - 1 && <span className="h-px w-7 bg-white/10" />}
          </div>
        );
      })}
    </div>
  );
}

function OsStep({ selectedOs, onSelect }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {operatingSystems.map((os) => {
        const Icon = os.icon;
        const active = selectedOs === os.id;

        return (
          <button
            key={os.id}
            type="button"
            onClick={() => onSelect(os.id)}
            className={[
              'rounded-card border p-5 text-left transition duration-200 hover:-translate-y-0.5 hover:border-brand-500/50',
              active
                ? 'border-brand-500 bg-brand-500/10 shadow-cyan'
                : 'border-white/10 bg-white/[0.035]',
            ].join(' ')}
          >
            <Icon className="h-7 w-7 text-brand-500" />
            <p className="mt-4 text-lg font-black text-white">{os.name}</p>
            <p className="mt-2 text-sm leading-6 text-[#8FA39B]">{os.description}</p>
          </button>
        );
      })}
    </div>
  );
}

function TerminalOpenStep({ os }) {
  const selected = operatingSystems.find((item) => item.id === os) || operatingSystems[0];

  return (
    <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
      <div>
        <p className="text-2xl font-black text-white">Open {selected.terminalName}</p>
        <p className="mt-3 text-sm leading-6 text-[#8FA39B]">
          Start from your operating system terminal. You will paste one SSH command, accept the
          first-time fingerprint prompt, and enter the workspace password when requested.
        </p>
      </div>
      <div className="rounded-card border border-white/10 bg-white/[0.035] p-5">
        <motion.div
          className="rounded-card border border-white/10 bg-[#050505] p-5 font-mono text-sm text-[#F5F7F6]"
          animate={{ y: [0, -4, 0], opacity: [0.86, 1, 0.86] }}
          transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
        >
          <div className="mb-4 flex items-center gap-2 text-[#8FA39B]">
            <Terminal className="h-4 w-4" />
            {selected.terminalName}
          </div>
          <p>$ ready for secure connection</p>
        </motion.div>
      </div>
    </div>
  );
}

function CommandCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {firstCommands.map((item) => (
        <Card key={item.command}>
          <CardContent className="flex items-start justify-between gap-4 p-5">
            <div>
              <code className="text-sm font-bold text-brand-500">{item.command}</code>
              <p className="mt-2 text-sm leading-6 text-[#8FA39B]">{item.description}</p>
            </div>
            <Button
              variant="icon"
              size="sm"
              aria-label={`Copy ${item.command}`}
              onClick={() => copyText(item.command)}
            >
              <Clipboard className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function ConnectGpuGuideModal({ open, onClose, workspace }) {
  const [step, setStep] = useState(0);
  const [selectedOs, setSelectedOs] = useState('windows');
  const [playing, setPlaying] = useState(true);
  const [replayKey, setReplayKey] = useState(0);
  const host = workspace?.instanceIP || '203.xxx.xxx.xxx';
  const username = workspace?.sshUsername || 'ubuntu';
  const sshCommand = `ssh ${username}@${host}`;
  const steps = [
    { title: 'Choose OS' },
    { title: 'Open Terminal' },
    { title: 'SSH Command' },
    { title: 'First Connection' },
    { title: 'Password' },
    { title: 'Success' },
    { title: 'First Commands' },
  ];
  const progress = ((step + 1) / steps.length) * 100;

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Enter' && event.target?.tagName !== 'BUTTON') {
        setStep((value) => Math.min(steps.length - 1, value + 1));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, steps.length]);

  useEffect(() => {
    if (open) {
      setPlaying(true);
      setReplayKey((value) => value + 1);
    }
  }, [open, step]);

  const terminalLinesByStep = {
    2: [`$ ${sshCommand}`],
    3: [
      `$ ${sshCommand}`,
      `The authenticity of host '${host}' can't be established.`,
      'Are you sure you want to continue connecting (yes/no)? yes',
    ],
    4: [`$ ${sshCommand}`, 'Password: **************'],
    5: [`$ ${sshCommand}`, 'Welcome to Ubuntu 24.04 LTS', `${username}@gpu-node:~$`],
  };

  const renderStep = () => {
    if (step === 0) return <OsStep selectedOs={selectedOs} onSelect={setSelectedOs} />;
    if (step === 1) return <TerminalOpenStep os={selectedOs} />;
    if (step === 6) return <CommandCards />;

    return (
      <div className="space-y-4">
        <TypingTerminal
          key={`${step}-${replayKey}`}
          lines={terminalLinesByStep[step]}
          playing={playing}
          loop
        />
        {step === 2 && (
          <p className="text-sm leading-6 text-[#8FA39B]">
            Paste this command into your terminal to start the encrypted SSH session.
          </p>
        )}
        {step === 3 && (
          <p className="text-sm leading-6 text-[#8FA39B]">
            This prompt only appears the first time your computer connects to this workspace.
          </p>
        )}
        {step === 4 && (
          <p className="text-sm leading-6 text-[#8FA39B]">
            Passwords do not appear while typing. This is normal terminal behavior.
          </p>
        )}
        {step === 5 && (
          <div className="rounded-card border border-emerald-400/25 bg-emerald-400/10 p-4 text-emerald-100">
            <p className="font-black">Connected Successfully</p>
            <p className="mt-1 text-sm opacity-90">You are now inside your GPU workspace shell.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Connect to GPU"
      description="A guided SSH walkthrough for developers who need advanced workspace access."
      size="xl"
      className="sm:max-w-5xl max-sm:max-h-screen max-sm:rounded-none"
    >
      <div className="space-y-6">
        <Stepper steps={steps} currentStep={step} />
        <ProgressBar value={progress} label={`${Math.round(progress)}% complete`} />
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="min-h-80"
        >
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-500">
              Step {step + 1}
            </p>
            <h3 className="mt-2 text-2xl font-black text-white">{steps[step].title}</h3>
          </div>
          {renderStep()}
        </motion.div>
        <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setReplayKey((value) => value + 1)}
              leftIcon={<RotateCcw className="h-4 w-4" />}
            >
              Replay
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPlaying((value) => !value)}
              leftIcon={playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            >
              {playing ? 'Pause' : 'Play'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyText(sshCommand)}
              leftIcon={<Clipboard className="h-4 w-4" />}
            >
              Copy Command
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setStep((value) => Math.max(0, value - 1))}
              disabled={step === 0}
              leftIcon={<ChevronLeft className="h-4 w-4" />}
            >
              Previous
            </Button>
            <Button
              onClick={() => setStep((value) => Math.min(steps.length - 1, value + 1))}
              disabled={step === steps.length - 1}
              rightIcon={<ChevronRight className="h-4 w-4" />}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
