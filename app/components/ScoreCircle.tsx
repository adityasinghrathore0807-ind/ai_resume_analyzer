import React from "react";

// ScoreCircle component takes a score (default 75)
// and renders a circular progress indicator.
const ScoreCircle = ({ score = 75 }: { score?: number }) => {
    // Radius of the circle
    const radius = 50;

    // Stroke width
    const stroke = 8;

    // Adjust radius so the stroke fits inside the SVG
    const normalizedRadius = radius - stroke / 2;

    // Circumference of the circle
    const circumference = 2 * Math.PI * normalizedRadius;

    // Progress between 0 and 1
    const progress = score / 100;

    // Stroke offset
    const strokeDashoffset = circumference * (1 - progress);

    return (
        <div className="relative h-[100px] w-[100px]">
            <svg
                height="100%"
                width="100%"
                viewBox="0 0 100 100"
                className="-rotate-90"
            >
                {/* Gradient */}
                <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#360461f6" />
                        <stop offset="100%" stopColor="#1d4ed8" />
                    </linearGradient>
                </defs>

                {/* Background Circle */}
                <circle
                    cx="50"
                    cy="50"
                    r={normalizedRadius}
                    stroke="#e5e7eb"
                    strokeWidth={stroke}
                    fill="transparent"
                />

                {/* Progress Circle */}
                <circle
                    cx="50"
                    cy="50"
                    r={normalizedRadius}
                    stroke="url(#grad)"
                    strokeWidth={stroke}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                />
            </svg>

            {/* Center Score */}
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-semibold text-black">
                    {score}/100
                </span>
            </div>
        </div>
    );
};

export default ScoreCircle;
