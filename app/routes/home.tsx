import { useEffect } from "react";
import type { Route } from "./+types/home";
import Navbar from "../components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { resumes } from "../constants";
import { usePuterStore } from "~/lib/puter";
import { useLocation, useNavigate } from "react-router";

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
  const { isLoading, auth } = usePuterStore();
      const location = useLocation();
      const navigate = useNavigate();
      const next = new URLSearchParams(location.search).get("next") ?? "/";

      useEffect(() => {
          if (!auth.isAuthenticated) {
              navigate('/auth?next=/');
          }
      }, [auth.isAuthenticated, next, navigate]);
  return (
    <main
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/images/bg_cover.png')",
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Page Content */}
      <div className="relative z-10">
        <Navbar />

        <section className="px-6 pt-20 pb-20 md:pt-28">
          <div className="mx-auto max-w-6xl">

            {/* ================= Hero Section ================= */}
            <div className="text-center">
              <h1 className="text-5xl font-extrabold text-white md:text-7xl lg:text-8xl">
                AI-Powered
                <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Resume Analyzer
                </span>
              </h1>

              <h2 className="mx-auto mt-6 max-w-3xl text-lg text-slate-300 md:text-2xl">
                Get instant ATS scoring, resume analysis, personalized
                recommendations, and AI-powered insights to help you land
                interviews faster.
              </h2>

              {/* CTA Buttons */}
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <button className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 font-semibold text-white hover:scale-105 transition">
                  Analyze Resume
                </button>

                <button className="rounded-2xl border border-slate-500 px-8 py-4 text-white hover:bg-white/10 transition">
                  Learn More
                </button>
              </div>

              {/* Stats */}
              <div className="mt-16 flex flex-wrap justify-center gap-10 text-white">
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

            {/* ================= Resume Section ================= */}
            {resumes.length > 0 && (
              <section className="mt-20">
                <h2 className="mb-8 text-center text-4xl font-bold text-white">
                  Previous Resume Analyses
                </h2>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {resumes.map((resume) => (
                    <ResumeCard
                      key={resume.id}
                      resume={resume}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Empty State */}
            {resumes.length === 0 && (
              <div className="mt-20 text-center text-white">
                <h2 className="text-2xl font-semibold">
                  No resumes found
                </h2>

                <p className="mt-2 text-slate-300">
                  Upload your first resume to get AI-powered feedback.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
