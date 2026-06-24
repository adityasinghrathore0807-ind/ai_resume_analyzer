import type { Route } from "./+types/home";
import Navbar from "../components/Navbar";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "AI Resume Analyzer" },
    {
      name: "description",
      content: "Use AI-powered feedback to land jobs faster",
    },
  ];
}

export default function Home() {
  return (
    <main
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/images/bg_cover.png')",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10">
        <Navbar />

        <section className="px-6 pt-20 md:pt-28">
          <div className="mx-auto max-w-6xl text-center">
            <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-white md:text-7xl lg:text-8xl">
              AI-Powered
              <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Resume Analyzer
              </span>
            </h1>

            <h2 className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-slate-300 md:text-2xl">
              Get instant ATS scoring, resume analysis, personalized
              recommendations, and AI-powered insights to help you land
              interviews faster.
            </h2>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 font-semibold text-white shadow-xl transition-all duration-300 hover:scale-105">
                Analyze Resume
              </button>

              <button className="rounded-2xl border border-slate-500 px-8 py-4 text-white backdrop-blur-md transition-all duration-300 hover:bg-white/10">
                Learn More
              </button>
            </div>

            {/* Stats */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-10 text-white">
              <div>
                <h3 className="text-3xl font-bold">95%</h3>
                <p className="text-slate-300">ATS Accuracy</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold">10K+</h3>
                <p className="text-slate-300">Resumes Analyzed</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold">24/7</h3>
                <p className="text-slate-300">AI Feedback</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
