import { Link } from "react-router";
import type { Resume } from "../constants";
import ScoreCircle from "../components/ScoreCircle";

type ResumeCardProps = {
    resume: Resume;
};

const ResumeCard = ({ resume }: ResumeCardProps) => {
    const { id, companyName, jobTitle, feedback } = resume;

    return (
        <Link
            to={`/resume/${id}`}
            className="resume-card block rounded-xl border border-gray-200 bg-white p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
            <div className="flex items-center justify-between">
                {/* Company & Job Title */}
                <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-bold text-black">
                        {companyName}
                    </h2>

                    <h3 className="text-gray-500">
                        {jobTitle || "Untitled Job"}
                    </h3>
                </div>

                {/* Resume Score */}
                <div className="flex-shrink-0">
                    <ScoreCircle score={feedback.overallScore} />
                </div>
            </div>
        </Link>
    );
};

export default ResumeCard;
