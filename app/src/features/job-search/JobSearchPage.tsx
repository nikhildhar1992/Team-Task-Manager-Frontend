import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';

interface JobResult {
  id: string;
  title: string;
  company: string;
  location: string;
  matchScore: string;
  url: string;
}

interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

interface SpeechRecognitionResultLike {
  [index: number]: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionEventLike {
  results: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

const PLATFORM_OPTIONS = ['LinkedIn', 'Naukri', 'NaukriGulf', 'GulfTalent'] as const;

const COUNTRY_OPTIONS = [
  'UAE',
  'Saudi Arabia',
  'Qatar',
  'Bahrain',
  'Kuwait',
  'Oman',
  'Finland',
  'Germany',
  'New Zealand',
  'Any',
] as const;

const MOCK_JOBS: JobResult[] = [
  {
    id: 'job-1',
    title: 'Senior Frontend Engineer',
    company: 'DesertTech Labs',
    location: 'Dubai, UAE',
    matchScore: '92%',
    url: 'https://www.linkedin.com',
  },
  {
    id: 'job-2',
    title: 'React Developer',
    company: 'Gulf Product Hub',
    location: 'Riyadh, Saudi Arabia',
    matchScore: '88%',
    url: 'https://www.naukri.com',
  },
  {
    id: 'job-3',
    title: 'UI Engineer (TypeScript)',
    company: 'Nordic Cloud Systems',
    location: 'Helsinki, Finland',
    matchScore: '84%',
    url: 'https://www.gulftalent.com',
  },
];

function getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | null {
  const recognitionWindow = window as Window & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };

  return recognitionWindow.SpeechRecognition ?? recognitionWindow.webkitSpeechRecognition ?? null;
}

export function JobSearchPage() {
  const [platform, setPlatform] = useState<(typeof PLATFORM_OPTIONS)[number]>('LinkedIn');
  const [country, setCountry] = useState<(typeof COUNTRY_OPTIONS)[number]>('Any');
  const [jobsCount, setJobsCount] = useState(10);
  const [prompt, setPrompt] = useState('');
  const [excludeSeenJobs, setExcludeSeenJobs] = useState(true);
  const [jobs, setJobs] = useState<JobResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  function startVoiceInput() {
    setVoiceError(null);
    const Recognition = getSpeechRecognitionConstructor();

    if (!Recognition) {
      setVoiceError('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const recognition = new Recognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript?.trim();
      if (transcript) {
        setPrompt(transcript);
      }
    };
    recognition.onerror = (event) => {
      setVoiceError(event.error ? `Voice input failed: ${event.error}` : 'Voice input failed.');
    };
    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    setIsListening(true);
    recognition.start();
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasSearched(true);
    setJobs(MOCK_JOBS);
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-xl font-semibold text-slate-900">Job Search</h2>
        <p className="mt-1 text-sm text-slate-600">
          Search jobs by platform and country, and use voice to fill your prompt.
        </p>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <form className="space-y-4" onSubmit={handleSearch}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Platform</span>
              <select
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={platform}
                onChange={(event) => setPlatform(event.target.value as (typeof PLATFORM_OPTIONS)[number])}
              >
                {PLATFORM_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Country</span>
              <select
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={country}
                onChange={(event) => setCountry(event.target.value as (typeof COUNTRY_OPTIONS)[number])}
              >
                {COUNTRY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Jobs Count</span>
            <input
              type="number"
              min={1}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm md:w-56"
              value={jobsCount}
              onChange={(event) => setJobsCount(Number(event.target.value))}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Prompt</span>
            <textarea
              rows={4}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              placeholder="Show me latest jobs matching my profile"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
            />
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={startVoiceInput}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              {isListening ? 'Stop Voice Input' : 'Voice Input'}
            </button>

            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300"
                checked={excludeSeenJobs}
                onChange={(event) => setExcludeSeenJobs(event.target.checked)}
              />
              Exclude Seen Jobs
            </label>

            <button
              type="submit"
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Search
            </button>
          </div>

          {voiceError ? <p className="text-sm text-red-700">{voiceError}</p> : null}

          <p className="text-xs text-slate-500">
            Selected: {platform} | {country} | {jobsCount} jobs |{' '}
            {excludeSeenJobs ? 'excluding seen jobs' : 'including seen jobs'}
          </p>
        </form>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold text-slate-900">Results</h3>

        {!hasSearched ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
            Run a search to view jobs.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job) => (
              <article key={job.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <h4 className="text-sm font-semibold text-slate-900">{job.title}</h4>
                <p className="mt-1 text-sm text-slate-600">{job.company}</p>
                <p className="mt-1 text-xs text-slate-500">{job.location}</p>
                <p className="mt-2 text-xs font-semibold text-emerald-700">Match Score: {job.matchScore}</p>

                <a
                  href={job.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex rounded-md bg-amber-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-amber-700"
                >
                  Open Job
                </a>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
