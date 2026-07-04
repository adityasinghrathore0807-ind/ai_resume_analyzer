import { Link } from "react-router";
import type { Resume } from "../constants";
import ScoreCircle from "./ScoreCircle";

type ResumeCardProps = {
    resume: Resume;
};

const ResumeCard = ({ resume }: ResumeCardProps) => {
    const {
        id,
        companyName,
        jobTitle,
        imagePath,
        feedback,
    } = resume;

    return (
        <Link
            to={`/resume/${id}`}
            className="block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-5">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">
                        {companyName}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        {jobTitle}
                    </p>
                </div>

                <ScoreCircle score={feedback.overallScore} />
            </div>

            {/* Resume Preview */}
            <div className="border-t border-gray-200 bg-gray-100 p-3">
                <div className="h-[260px] overflow-hidden rounded-lg">
                    <img
                        src={imagePath}
                        alt={`${jobTitle} Resume`}
                        className="w-full object-cover object-top"
                    />
                </div>
            </div>
        </Link>
    );
};

export default ResumeCard;
