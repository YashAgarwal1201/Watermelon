import React from "react";

// LandingSection.tsx
// A responsive landing section for a remote application using Tailwind CSS v4
// Tech stack: Webpack + React + TypeScript + Module Federation + Tailwind CSS

const techStack: { name: string; href: string; desc: string }[] = [
  {
    name: "Webpack",
    href: "https://webpack.js.org/",
    desc: "Bundler used to build and serve the remote application (Module Federation).",
  },
  {
    name: "React",
    href: "https://reactjs.org/",
    desc: "UI library for building component-driven interfaces.",
  },
  {
    name: "TypeScript",
    href: "https://www.typescriptlang.org/",
    desc: "Static typing on top of JavaScript for safer, more maintainable code.",
  },
  {
    name: "Module Federation",
    href: "https://webpack.js.org/concepts/module-federation/",
    desc: "Runtime code sharing mechanism for microfrontends and remote modules.",
  },
  {
    name: "Tailwind CSS",
    href: "https://tailwindcss.com/",
    desc: "Utility-first CSS framework for rapid UI development.",
  },
];

export default function LandingSection(): JSX.Element {
  return (
    <section className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100">
      <div className="w-full mx-auto px-6 py-12 lg:py-20">
        {/* HERO */}
        <div className="grid gap-8 lg:grid-cols-2 items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
              Remote App — Lightweight & Composable
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-xl">
              A remote application built with modern web tooling: fast bundling
              via Webpack, type safety with TypeScript, microfrontend
              composition through Module Federation, and pixel-perfect UIs with
              Tailwind CSS.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#get-started"
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg font-medium shadow hover:shadow-lg transition-shadow"
              >
                Get Started
              </a>

              <a
                href="#tech-stack"
                className="inline-flex items-center gap-2 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                View Tech Stack
              </a>
            </div>

            <dl className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-xl">
              <div className="bg-white dark:bg-slate-800/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                <dt className="text-xs text-slate-500">Bundle</dt>
                <dd className="text-sm font-semibold">Webpack</dd>
              </div>
              <div className="bg-white dark:bg-slate-800/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                <dt className="text-xs text-slate-500">Language</dt>
                <dd className="text-sm font-semibold">TypeScript</dd>
              </div>
              <div className="bg-white dark:bg-slate-800/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                <dt className="text-xs text-slate-500">Styling</dt>
                <dd className="text-sm font-semibold">Tailwind CSS</dd>
              </div>
            </dl>
          </div>

          <div className="relative">
            <div className="aspect-video rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-lg">
              {/* Placeholder screenshot / illustration */}
              <div className="w-full h-full bg-gradient-to-tr from-indigo-50 to-sky-50 dark:from-indigo-900 dark:to-sky-900 flex items-center justify-center">
                <svg
                  width="68"
                  height="68"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="opacity-80"
                >
                  <rect width="24" height="24" rx="6" fill="currentColor" />
                </svg>
                <span className="sr-only">App preview</span>
              </div>
            </div>

            <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              Live remote modules, hot reload for host and remotes, and zero
              downtime deployments when using Module Federation.
            </div>
          </div>
        </div>

        {/* FEATURES */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <article className="p-6 rounded-xl bg-white dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-semibold">Microfrontend Ready</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
              Expose and consume remote components with Webpack Module
              Federation for independent deployments and team-scale development.
            </p>
          </article>

          <article className="p-6 rounded-xl bg-white dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-semibold">Type‑Safe Development</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
              Use TypeScript for predictable refactors, better DX, and fewer
              runtime errors across host and remote apps.
            </p>
          </article>

          <article className="p-6 rounded-xl bg-white dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-semibold">Utility‑First Styling</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
              Rapidly compose responsive layouts using Tailwind CSS — no bloated
              CSS frameworks, just utility classes.
            </p>
          </article>
        </div>

        {/* TECH STACK */}
        <div id="tech-stack" className="mt-12">
          <h2 className="text-2xl font-bold">Tech Stack</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
            This remote application combines proven tools for modern web apps.
            Click any item to jump to official docs.
          </p>

          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {techStack.map((t) => (
              <li
                key={t.name}
                className="bg-white dark:bg-slate-800/40 p-4 rounded-lg border border-slate-100 dark:border-slate-800"
              >
                <a
                  href={t.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <h3 className="text-sm font-semibold">{t.name}</h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
                    {t.desc}
                  </p>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* GET STARTED */}
        <div
          id="get-started"
          className="mt-12 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 p-6 rounded-xl border border-slate-100 dark:border-slate-800"
        >
          <h2 className="text-xl font-bold">Get started locally</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Clone the repo, install deps and run the host + remotes.
          </p>

          <pre className="mt-4 bg-slate-900 text-slate-50 p-4 rounded-md text-sm overflow-x-auto">
            {`# install
npm install

# run host (example)
npm run start:host

# run a remote
npm run start:remote-1
`}
          </pre>

          <div className="mt-4 flex flex-wrap gap-3">
            <a
              className="inline-block px-4 py-2 rounded-md bg-emerald-600 text-white font-medium hover:brightness-105"
              href="#"
            >
              Open Demo
            </a>

            <a
              className="inline-block px-4 py-2 rounded-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
              href="#"
            >
              Read Docs
            </a>
          </div>
        </div>

        {/* FOOTER / CONTACT */}
        <footer className="mt-12 text-sm text-slate-500 dark:text-slate-400">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <strong>Remote App</strong>
              <div>Built with care. License: MIT.</div>
            </div>

            <div className="text-xs">
              <div>
                Want this component exported as a standalone package or
                storybook story?{" "}
                <a href="#" className="underline">
                  Get in touch
                </a>
                .
              </div>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}
