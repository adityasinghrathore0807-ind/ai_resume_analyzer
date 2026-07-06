import { Link } from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import type { Resume } from "~/constants";

interface ResumeCardProps {
    resume: Resume;
}

export default function ResumeCard({
    resume: {
        id,
        companyName,
        jobTitle,
        feedback,
        imagePath,
    },
}: ResumeCardProps) {
    const score = feedback?.overallScore ?? 0;

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-600";
        if (score >= 60) return "text-yellow-500";
        return "text-red-500";
    };

    const getScoreBadge = (score: number) => {
        if (score >= 80)
            return "bg-green-100 text-green-700";
        if (score >= 60)
            return "bg-yellow-100 text-yellow-700";
        return "bg-red-100 text-red-700";
    };

    const getScoreLabel = (score: number) => {
        if (score >= 80) return "Excellent";
        if (score >= 60) return "Good";
        return "Needs Improvement";
    };

    return (
        <Link
            to={`/resume/${id}`}
            className="
                group
                flex
                flex-col
                overflow-hidden
                rounded-3xl
                bg-white
                border
                border-gray-200
                shadow-md
                hover:shadow-2xl
                hover:-translate-y-2
                transition-all
                duration-300
            "
        >
            {/* ================= Header ================= */}
            <div className="flex items-start justify-between p-6">

                <div className="flex-1 min-w-0">

                    <h2 className="text-2xl font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                        {companyName || "Resume Analysis"}
                    </h2>

                    <p className="mt-1 text-gray-500">
                        {jobTitle || "No Job Title"}
                    </p>

                    <span
                        className={`inline-block mt-4 rounded-full px-3 py-1 text-sm font-semibold ${getScoreBadge(score)}`}
                    >
                        {getScoreLabel(score)}
                    </span>

                </div>

                <ScoreCircle score={score} />

            </div>

            {/* ================= Resume Preview ================= */}

            {imagePath && (
                <div className="px-6">

                    <div className="rounded-2xl border border-gray-200 bg-gray-100 p-4">

                        <img
                            src={imagePath}
                            alt={`${companyName ?? "Resume"} Preview`}
                            loading="lazy"
                            className="
                                w-full
                                h-auto
                                object-contain
                                rounded-xl
                                bg-white
                                shadow-md
                                transition-all
                                duration-300
                                group-hover:scale-[1.01]
                            "
                        />

                    </div>

                </div>
            )}

            {/* ================= Footer ================= */}

            <div className="mt-6 border-t border-gray-200 px-6 py-5 flex items-center justify-between">

                <div className="flex items-center gap-3">

                    <div
                        className={`h-3 w-3 rounded-full ${score >= 80
                                ? "bg-green-500"
                                : score >= 60
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                            }`}
                    />

                    <span className={`font-semibold ${getScoreColor(score)}`}>
                        {score}/100
                    </span>

                </div>

                <span className="flex items-center gap-2 font-medium text-gray-600 group-hover:text-blue-600 transition-all">

                    View Details

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 transition-transform group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>

                </span>

            </div>

        </Link>
    );
}
