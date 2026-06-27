const SKILLS = [
  {
    category: 'Frontend',
    items: ['React', 'Angular', 'TypeScript', 'Responsive Design'],
  },
  {
    category: 'Backend',
    items: ['Node.js', 'REST APIs', 'MySQL', 'Redis', 'BullMQ'],
  },
  {
    category: 'Payments & Integrations',
    items: ['Stripe', 'Apple Pay', 'Google Pay', 'Twilio', 'QuickBooks'],
  },
  {
    category: 'Architecture',
    items: ['Clean Architecture', 'System Design', 'Microservices', 'Distributed Systems', 'RBAC', 'API Design'],
  },
  {
    category: 'DevOps & Tools',
    items: ['Docker', 'AWS (Amplify, EC2, Lambda)', 'GitHub Actions', 'Git', 'Postman', 'Swagger'],
  },
  {
    category: 'AI & Integrations',
    items: ['OpenAI API', 'Google Gemini API', 'RAG (Production)', 'Vector Embeddings', 'Semantic Search', 'Prompt Engineering', 'Cursor API', 'Notion API'],
  },
  {
    category: 'Other',
    items: ['JWT Authentication', 'Caching', 'Rate Limiting', 'Logging', 'Monitoring'],
  },
];

const EXPERIENCE = [
  {
    title: 'Lead Full Stack Engineer | Associate Product Manager',
    company: 'Bridging Healthcare Technologies Pvt. Ltd',
    period: 'Apr 2021 – Present',
    location: 'Mohali, Punjab',
    highlights: [
      'Led 25+ engineers across fintech and healthcare platforms, driving architecture, delivery, and technical decision-making.',
      'Improved API performance by 60% through Redis caching and query optimization.',
      'Designed secure RBAC and JWT-based authentication systems.',
      'Implemented Docker-based development workflows and monitoring practices.',
      'Designed scalable backend architectures supporting fintech payment workflows and third-party integrations.',
    ],
    integrations: [
      'Delivered Stripe onboarding, payments, and identity verification workflows.',
      'Integrated Apple Pay, Google Pay, QuickBooks, Twilio, and Credit Bureau APIs.',
      'Automated financial assessment workflows using AI-powered review systems.',
      'Built resilient integrations with retry mechanisms, rate limiting, and secure token management.',
    ],
    achievements: [
      'Promoted to Associate Product Manager — recognizing contributions to product strategy, roadmap planning, and cross-functional collaboration.',
      'Received High Achiever Award for technical leadership and measurable product contributions.',
    ],
  },
  {
    title: 'Senior Angular Developer',
    company: 'Cyient',
    period: 'Dec 2019 – Apr 2021',
    location: 'Noida, UP',
    highlights: [
      'Transformed a legacy desktop application into a modern Angular web application, improving performance and maintainability.',
      'Collaborated directly with clients to translate business requirements into scalable technical solutions.',
    ],
    integrations: [],
    achievements: [],
  },
  {
    title: 'Software Developer',
    company: 'ATMECS',
    period: 'Feb 2019 – Dec 2019',
    location: 'Hyderabad',
    highlights: [
      'Developed enterprise web and mobile applications using Citrix (SAPHO) for multiple clients simultaneously.',
    ],
    integrations: [],
    achievements: [],
  },
  {
    title: 'Software Developer',
    company: 'Tvisha Technologies',
    period: 'Aug 2016 – Feb 2019',
    location: 'Hyderabad',
    highlights: [
      'Delivered web and mobile solutions across logistics and energy domains.',
      'Worked directly with US-based clients, gathering requirements and delivering business-critical solutions.',
    ],
    integrations: [],
    achievements: [],
  },
];

const POCS = [
  {
    title: 'AI-Powered Team Task Platform',
    tagline: 'RAG · RBAC · Agentic AI · Orchestrator · CI/CD Agent · AWS',
    description:
      'End-to-end production POC combining RAG-based knowledge retrieval, RBAC-secured multi-team task management, and an AI orchestrator that auto-routes prompts to specialised agents (general, task-breakdown, operations). Also includes an autonomous CI/CD agent built with GitHub Actions, Cursor API, and Notion integrations — fully deployed on AWS.',
    stack: ['RAG', 'Vector Embeddings', 'Agentic AI', 'Orchestrator', 'RBAC', 'Node.js', 'React', 'Docker', 'AWS', 'OpenAI API', 'GitHub Actions', 'Cursor API', 'Notion API'],
    url: 'https://koshurwaan.in',
    urlLabel: 'koshurwaan.in',
    accent: 'blue',
  },
  {
    title: 'Multi-Portal Job Search Agent',
    tagline: 'Azure · React PWA · Playwright · Whisper · Job APIs',
    description:
      'A Resume-aware PWA that aggregates live job listings from Playwright-scraped portals (NaukriGulf, GulfTalent) and API-based job boards (Greenhouse, Lever, Ashby, Workable). Uses GPT-4o-mini to generate structured search criteria from your resume profile, OpenAI Whisper for voice-to-search (auto-fills country/platform dropdowns and triggers search automatically), and ranks results with a match-scoring engine. Features seen-job deduplication across sources and runs on Azure Cloud.',
    stack: ['GPT-4o-mini', 'Multi-source aggregation', 'Match scoring', 'Resume-aware AI', 'Fastify'],
    url: 'https://jobsearchagent.koshurwaan.in',
    urlLabel: 'jobsearchagent.koshurwaan.in',
    accent: 'violet',
  },
];

const AI_HIGHLIGHTS = [
  'Built AI-powered automation using OpenAI and Gemini APIs for financial assessment workflows.',
  'Developed autonomous CI/CD agents using GitHub Actions, Cursor API, and Notion integrations.',
  'Implemented a RAG-powered AI assistant using Vector Embeddings and Semantic Search.',
  'Deployed full-stack applications on AWS using Amplify, EC2, and Lambda.',
];

function Tag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
      {label}
    </span>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <h2 className="text-lg font-bold text-slate-900 tracking-tight">{children}</h2>
      <div className="flex-1 h-px bg-slate-200" />
    </div>
  );
}

export function PortfolioPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">

      {/* Hero */}
      <header className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 px-8 py-10 text-white shadow-lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">Full Stack Engineer</p>
            <h1 className="text-4xl font-extrabold tracking-tight">Nikhil Dhar</h1>
            <p className="mt-1 text-slate-300 text-sm font-medium">Lead Full Stack Engineer · System Architect · Engineering Leader</p>
            <p className="mt-2 text-xs text-slate-400">Mohali, India · 9+ Years Experience</p>
          </div>
          <div className="flex flex-col gap-2 text-sm text-slate-300 sm:text-right min-w-0">
            <a href="mailto:nikhildhar92@gmail.com" className="hover:text-white transition-colors truncate">
              nikhildhar92@gmail.com
            </a>
            <a href="tel:+916006107477" className="hover:text-white transition-colors">
              +91 6006107477
            </a>
            <a
              href="https://linkedin.com/in/nikhil-dhar-2a345057"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              linkedin.com/in/nikhil-dhar
            </a>
          </div>
        </div>

        {/* Quick stats */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { value: '9+', label: 'Years Experience' },
            { value: '25+', label: 'Engineers Led' },
            { value: '60%', label: 'API Perf Gain' },
            { value: 'APM', label: 'Dual Role' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl bg-white/10 px-4 py-3 text-center">
              <p className="text-2xl font-extrabold text-white">{stat.value}</p>
              <p className="mt-0.5 text-xs text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </header>

      {/* Summary */}
      <section>
        <SectionHeading>Professional Summary</SectionHeading>
        <p className="text-sm leading-relaxed text-slate-600">
          Lead Full Stack Engineer with 9+ years of experience architecting and delivering scalable fintech, SaaS, and
          healthcare solutions. Expertise in Node.js, TypeScript, React, Angular, AWS, Redis, distributed systems, cloud
          architecture, payment integrations, and AI-powered applications. Proven track record leading teams of 20+
          engineers, driving technical roadmaps, engineering strategy, platform scalability, and delivering
          business-critical products. Recently promoted to Associate Product Manager, bringing a strong blend of
          engineering leadership, product thinking, and customer-focused innovation.
        </p>
      </section>

      {/* POCs */}
      <section>
        <SectionHeading>Proof of Concepts</SectionHeading>
        <div className="grid gap-6 sm:grid-cols-2">
          {POCS.map((poc) => {
            const isBluePoc = poc.accent === 'blue';
            return (
              <div
                key={poc.title}
                className={`flex flex-col rounded-2xl border p-5 shadow-sm ${
                  isBluePoc
                    ? 'border-blue-100 bg-gradient-to-br from-blue-50 to-slate-50'
                    : 'border-violet-100 bg-gradient-to-br from-violet-50 to-slate-50'
                }`}
              >
                <div className="flex-1">
                  <p
                    className={`text-xs font-semibold uppercase tracking-wider mb-1 ${
                      isBluePoc ? 'text-blue-500' : 'text-violet-500'
                    }`}
                  >
                    {poc.tagline}
                  </p>
                  <h3 className="text-sm font-bold text-slate-900">{poc.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{poc.description}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {poc.stack.map((tag) => (
                      <span
                        key={tag}
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          isBluePoc
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-violet-100 text-violet-700'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <a
                  href={poc.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`mt-4 inline-flex items-center gap-1.5 self-start rounded-lg px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 ${
                    isBluePoc ? 'bg-blue-600' : 'bg-violet-600'
                  }`}
                >
                  {poc.urlLabel} ↗
                </a>
              </div>
            );
          })}
        </div>
      </section>

      {/* Skills */}
      <section>
        <SectionHeading>Technical Skills</SectionHeading>
        <div className="grid gap-4 sm:grid-cols-2">
          {SKILLS.map((group) => (
            <div key={group.category} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">{group.category}</p>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <Tag key={item} label={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section>
        <SectionHeading>Professional Experience</SectionHeading>
        <div className="space-y-6">
          {EXPERIENCE.map((job) => (
            <div key={`${job.company}-${job.period}`} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{job.title}</h3>
                  <p className="text-sm text-slate-600 font-medium">{job.company}</p>
                </div>
                <div className="text-xs text-slate-500 sm:text-right shrink-0">
                  <p>{job.period}</p>
                  <p>{job.location}</p>
                </div>
              </div>

              <ul className="mt-3 space-y-1.5">
                {job.highlights.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-slate-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                    {item}
                  </li>
                ))}
              </ul>

              {job.integrations.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Key Integrations</p>
                  <ul className="space-y-1.5">
                    {job.integrations.map((item) => (
                      <li key={item} className="flex gap-2 text-sm text-slate-600">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {job.achievements.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Achievements</p>
                  <ul className="space-y-1.5">
                    {job.achievements.map((item) => (
                      <li key={item} className="flex gap-2 text-sm text-slate-600">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* AI & Innovation */}
      <section>
        <SectionHeading>AI &amp; Innovation</SectionHeading>
        <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-slate-50 p-5 shadow-sm">
          <ul className="space-y-3">
            {AI_HIGHLIGHTS.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-slate-700">
                <span className="mt-0.5 text-blue-500 shrink-0">✦</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Education */}
      <section>
        <SectionHeading>Education</SectionHeading>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Master of Science (Computer Science)</h3>
              <p className="text-sm text-slate-600">University of Pune</p>
            </div>
            <p className="text-xs text-slate-500 shrink-0">2014 – 2016</p>
          </div>
        </div>
      </section>

      {/* Interests */}
      <section>
        <SectionHeading>Interests</SectionHeading>
        <div className="flex flex-wrap gap-2">
          {['AI Development', 'Coding', 'Traveling', 'Sports'].map((interest) => (
            <span
              key={interest}
              className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 shadow-sm"
            >
              {interest}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <footer className="rounded-2xl border border-slate-200 bg-white px-8 py-6 text-center shadow-sm">
        <p className="text-sm font-semibold text-slate-800">Looking to collaborate or hire?</p>
        <p className="mt-1 text-xs text-slate-500">Feel free to reach out via email or LinkedIn.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <a
            href="mailto:nikhildhar92@gmail.com"
            className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-700 transition-colors"
          >
            Email Me
          </a>
          <a
            href="https://linkedin.com/in/nikhil-dhar-2a345057"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </footer>
    </div>
  );
}
