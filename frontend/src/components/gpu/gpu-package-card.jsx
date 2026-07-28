import { Link } from 'react-router-dom';
import { Cpu, HardDrive, MapPin, MemoryStick, Server } from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  StatusBadge,
} from '@/components/ui/index.js';

const formatPrice = (value, currency = 'USD') =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

export function GpuPackageCard({ gpuPackage }) {
  const id = gpuPackage.id || gpuPackage._id;
  const storage = `${gpuPackage.storageGb || '-'}GB ${gpuPackage.storageType || 'storage'}`;

  return (
    <Card interactive className="flex h-full flex-col">
      <CardHeader
        title={gpuPackage.name}
        description={gpuPackage.gpuModel}
        action={
          <StatusBadge
            status={gpuPackage.availabilityStatus}
            label={gpuPackage.availabilityStatus || 'unknown'}
          />
        }
      />
      <CardContent className="flex flex-1 flex-col gap-4">
        <div className="grid grid-cols-2 gap-3 text-sm text-[#8FA39B]">
          <span className="inline-flex items-center gap-2">
            <MemoryStick className="h-4 w-4" />
            {gpuPackage.gpuMemoryGb || '-'}GB VRAM
          </span>
          <span className="inline-flex items-center gap-2">
            <Cpu className="h-4 w-4" />
            {gpuPackage.cpuCores || '-'} CPU
          </span>
          <span className="inline-flex items-center gap-2">
            <Server className="h-4 w-4" />
            {gpuPackage.ramGb || '-'}GB RAM
          </span>
          <span className="inline-flex items-center gap-2">
            <HardDrive className="h-4 w-4" />
            {storage}
          </span>
        </div>
        <Badge variant="outline" className="w-fit">
          <MapPin className="mr-1 h-3.5 w-3.5" />
          {gpuPackage.region || 'Region pending'}
        </Badge>
        <div className="mt-auto grid grid-cols-2 gap-3 rounded-button border border-white/10 bg-white/[0.055] p-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8FA39B]">
              Hourly
            </p>
            <p className="mt-1 font-bold text-white">
              {formatPrice(gpuPackage.hourlyPrice, gpuPackage.currency)}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8FA39B]">
              Monthly
            </p>
            <p className="mt-1 font-bold text-white">
              {formatPrice(gpuPackage.monthlyPrice, gpuPackage.currency)}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to={`/gpus/${id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
