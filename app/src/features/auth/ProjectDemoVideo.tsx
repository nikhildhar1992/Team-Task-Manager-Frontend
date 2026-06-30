import { useState } from 'react';

export function ProjectDemoVideo() {
  const [videoMissing, setVideoMissing] = useState(false);

  return (
    <div className="flex h-full min-h-[420px] flex-col bg-slate-950">
      <div className="border-b border-slate-800 px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-300">Project demo</p>
        <p className="text-sm text-slate-400">Live app walkthrough — Dashboard &amp; RAG</p>
      </div>

      <div className="relative flex flex-1 items-center justify-center bg-black p-4">
        {videoMissing ? (
          <div className="max-w-sm rounded-lg border border-slate-700 bg-slate-900 p-6 text-center text-slate-300">
            <p className="text-sm font-medium text-white">Demo video not found</p>
            <p className="mt-2 text-sm text-slate-400">
              Add your walkthrough at{' '}
              <code className="rounded bg-slate-800 px-1.5 py-0.5 text-xs text-slate-200">
                public/project-walkthrough.mp4
              </code>
            </p>
          </div>
        ) : (
          <video
            className="h-full max-h-[calc(100vh-5rem)] w-full rounded-lg object-contain shadow-2xl"
            src="/project-walkthrough.mp4"
            autoPlay
            muted
            loop
            playsInline
            controls
            preload="auto"
            onError={() => setVideoMissing(true)}
          >
            Your browser does not support embedded video.
          </video>
        )}
      </div>
    </div>
  );
}
