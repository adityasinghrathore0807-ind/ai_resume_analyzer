import type { Route } from "./+types/home";

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
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: "url('/images/bg_cover.png')",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="relative z-10">
        <section className="pt-24 md:pt-32 text-center px-6">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-tight text-white">
              AI-Powered
              <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Resume Analyzer
              </span>
            </h1>

            <h2 className="mt-6 text-lg md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Get instant ATS scoring, resume analysis, personalized
              recommendations, and AI-powered insights to help you land
              interviews faster.
            </h2>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="px-8 py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-105 transition-all duration-300 shadow-xl">
                Analyze Resume
              </button>

              <button className="px-8 py-4 rounded-2xl border border-slate-500 text-white backdrop-blur-md hover:bg-white/10 transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
