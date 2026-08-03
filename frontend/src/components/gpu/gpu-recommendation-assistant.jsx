import { Link } from 'react-router-dom';
import { BrainCircuit, Copy, Cpu, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Alert, Badge, Button, Card, CardContent, Textarea, Input } from '@/components/ui/index.js';
import { gpuPackageService } from '@/services/index.js';

const examples = [
  'ComfyUI and SDXL image generation for 3 designers',
  'Llama inference API for a small customer support app',
  'Blender rendering and AI video experiments for 2 weeks',
];

const ENQUIRY_DRAFT_KEY = 'gpu-marketplace-enquiry-draft';

const formatPrice = (value, currency = 'USD') =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

export function GpuRecommendationAssistant() {
  const [workload, setWorkload] = useState('');
  const [duration, setDuration] = useState('');
  const [budget, setBudget] = useState('');
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const recommend = async () => {
    setLoading(true);
    setError('');
    setCopied(false);

    try {
      const result = await gpuPackageService.recommend({
        workload,
        duration,
        budget: budget === '' ? undefined : Number(budget),
      });
      setRecommendation(result);
    } catch (recommendationError) {
      setError(recommendationError.message || 'Recommendation could not be generated.');
    } finally {
      setLoading(false);
    }
  };

  const copyDraft = async () => {
    if (!recommendation?.suggestedEnquiryText) return;
    await navigator.clipboard?.writeText(recommendation.suggestedEnquiryText);
    setCopied(true);
  };

  const selectedPackage = recommendation?.recommendation;
  const packageId = selectedPackage?.id || selectedPackage?._id;
  const enquiryDraft = selectedPackage
    ? {
        gpuPackageId: packageId,
        projectDescription: recommendation.suggestedEnquiryText || workload,
        expectedUsage: recommendation.explanation || '',
        duration,
        budget,
      }
    : null;
  const persistDraft = () => {
    if (!enquiryDraft) return;
    sessionStorage.setItem(ENQUIRY_DRAFT_KEY, JSON.stringify(enquiryDraft));
  };

  return (
    <Card className="overflow-hidden border-[rgba(45,232,196,0.22)] bg-[#07110E]/90">
      <CardContent className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-button border border-brand-500/25 bg-brand-500/10 text-brand-500">
              <BrainCircuit className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-black text-white">Find the right GPU faster</h2>
              <p className="text-sm leading-6 text-[#8FA39B]">
                Describe your workload and get a package recommendation from current listings.
              </p>
            </div>
          </div>
          <Textarea
            id="gpu-recommendation-workload"
            label="Workload"
            rows={4}
            value={workload}
            onChange={(event) => setWorkload(event.target.value)}
            placeholder="Tell us what you want to run, model size, app, users, or rendering needs."
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              id="gpu-recommendation-duration"
              label="Duration"
              value={duration}
              onChange={(event) => setDuration(event.target.value)}
              placeholder="Example: 2 weeks"
            />
            <Input
              id="gpu-recommendation-budget"
              label="Budget"
              type="number"
              value={budget}
              onChange={(event) => setBudget(event.target.value)}
              placeholder="Optional"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {examples.map((example) => (
              <Button
                key={example}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setWorkload(example)}
              >
                {example}
              </Button>
            ))}
          </div>
          {error && <Alert variant="danger">{error}</Alert>}
          <Button
            type="button"
            loading={loading}
            disabled={workload.trim().length < 10}
            leftIcon={<Sparkles className="h-4 w-4" />}
            onClick={recommend}
          >
            Recommend GPU
          </Button>
        </div>

        <div className="rounded-card border border-white/10 bg-white/[0.035] p-4">
          {!selectedPackage ? (
            <div className="flex h-full min-h-72 flex-col items-center justify-center text-center text-[#8FA39B]">
              <Cpu className="mb-3 h-8 w-8 text-brand-500" />
              <p className="font-semibold text-white">Recommendation appears here</p>
              <p className="mt-2 text-sm leading-6">
                Results are generated only when you click, keeping the marketplace fast.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase text-brand-500">Recommended</p>
                  <h3 className="mt-1 text-xl font-black text-white">{selectedPackage.name}</h3>
                  <p className="text-sm text-[#8FA39B]">{selectedPackage.gpuModel}</p>
                </div>
                <Badge variant="outline">{recommendation.fitScore}% fit</Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-[#8FA39B]">VRAM</p>
                  <p className="font-semibold text-white">{selectedPackage.gpuMemoryGb}GB</p>
                </div>
                <div>
                  <p className="text-[#8FA39B]">Need</p>
                  <p className="font-semibold text-white">{recommendation.requiredVramGb}GB est.</p>
                </div>
                <div>
                  <p className="text-[#8FA39B]">Hourly</p>
                  <p className="font-semibold text-white">
                    {formatPrice(selectedPackage.hourlyPrice, selectedPackage.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-[#8FA39B]">Region</p>
                  <p className="font-semibold text-white">{selectedPackage.region}</p>
                </div>
              </div>
              <p className="text-sm leading-6 text-[#F5F7F6]">{recommendation.explanation}</p>
              {recommendation.clarificationQuestions?.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-white">Questions to confirm</p>
                  <ul className="mt-2 space-y-1 text-sm text-[#8FA39B]">
                    {recommendation.clarificationQuestions.map((question) => (
                      <li key={question}>- {question}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="grid gap-2">
                <Button asChild className="w-full">
                  <Link
                    to={`/enquiry/${packageId}`}
                    state={{ enquiryDraft }}
                    onClick={persistDraft}
                  >
                    Request This GPU
                  </Link>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  leftIcon={<Copy className="h-4 w-4" />}
                  onClick={copyDraft}
                >
                  {copied ? 'Draft Copied' : 'Copy Enquiry Draft'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
