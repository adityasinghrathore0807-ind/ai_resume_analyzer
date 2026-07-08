// =======================================================
// Resume Types
// =======================================================

export interface FeedbackTip {
    type: "good" | "improve";
    tip: string;
}

export interface FeedbackCategory {
    score: number;
    tips: FeedbackTip[];
}

export interface ResumeFeedback {
    overallScore: number;

    ATS: FeedbackCategory;

    toneAndStyle: FeedbackCategory;

    content: FeedbackCategory;

    structure: FeedbackCategory;

    skills: FeedbackCategory;
}

export interface Resume {
    id: string;

    companyName: string;

    jobTitle: string;

    imagePath: string;

    resumePath: string;

    feedback: ResumeFeedback;
}

//
// =======================================================
// Demo Resume Data
// =======================================================
//

export const resumes: Resume[] = [
    {
        id: "1",
        companyName: "Google",
        jobTitle: "Frontend Developer",
        imagePath: "/images/resume_01.png",
        resumePath: "/resumes/resume-1.pdf",

        feedback: {
            overallScore: 89,

            ATS: {
                score: 90,
                tips: [
                    { type: "good", tip: "Uses ATS-friendly headings." },
                    { type: "good", tip: "Keywords are well integrated." },
                    { type: "improve", tip: "Include more role-specific keywords." },
                ],
            },

            toneAndStyle: {
                score: 87,
                tips: [
                    { type: "good", tip: "Professional writing style." },
                    { type: "good", tip: "Clear and concise wording." },
                    { type: "improve", tip: "Reduce repetitive action verbs." },
                ],
            },

            content: {
                score: 89,
                tips: [
                    { type: "good", tip: "Strong project descriptions." },
                    { type: "good", tip: "Achievements are relevant." },
                    { type: "improve", tip: "Add more measurable results." },
                ],
            },

            structure: {
                score: 91,
                tips: [
                    { type: "good", tip: "Easy-to-read layout." },
                    { type: "good", tip: "Logical section order." },
                    { type: "improve", tip: "Reduce unnecessary spacing." },
                ],
            },

            skills: {
                score: 86,
                tips: [
                    { type: "good", tip: "Relevant technical skills listed." },
                    { type: "good", tip: "Skills align with the job role." },
                    { type: "improve", tip: "Add more framework-specific skills." },
                ],
            },
        },
    },

    {
        id: "2",
        companyName: "Apple",
        jobTitle: "iOS Developer",
        imagePath: "/images/resume_03.png",
        resumePath: "/resumes/resume-3.pdf",

        feedback: {
            overallScore: 74,


            ATS: {
                score: 72,
                tips: [
                    { type: "good", tip: "Uses standard section titles." },
                    { type: "good", tip: "Simple formatting." },
                    { type: "improve", tip: "Increase keyword density." },
                ],
            },

            toneAndStyle: {
                score: 76,
                tips: [
                    { type: "good", tip: "Professional language." },
                    { type: "good", tip: "Easy to understand." },
                    { type: "improve", tip: "Use stronger action verbs." },
                ],
            },

            content: {
                score: 75,
                tips: [
                    { type: "good", tip: "Experience is relevant." },
                    { type: "good", tip: "Projects are clearly described." },
                    { type: "improve", tip: "Quantify achievements." },
                ],
            },

            structure: {
                score: 74,
                tips: [
                    { type: "good", tip: "Sections are organized." },
                    { type: "good", tip: "Readable formatting." },
                    { type: "improve", tip: "Improve spacing consistency." },
                ],
            },

            skills: {
                score: 73,
                tips: [
                    { type: "good", tip: "Core cloud skills included." },
                    { type: "good", tip: "Relevant technologies listed." },
                    { type: "improve", tip: "Include Azure certifications if available." },
                ],
            },
        },
    },

    {
        id: "3",
        companyName: "Microsoft",
        jobTitle: "Cloud Engineer",
        imagePath: "/images/resume_02.png",
        resumePath: "/resumes/resume-2.pdf",

        feedback: {
            overallScore: 91,

            ATS: {
                score: 93,
                tips: [
                    { type: "good", tip: "Excellent ATS compatibility." },
                    { type: "good", tip: "Strong keyword optimization." },
                    { type: "improve", tip: "Add more role-specific terminology." },
                ],
            },

            toneAndStyle: {
                score: 90,
                tips: [
                    { type: "good", tip: "Professional tone throughout." },
                    { type: "good", tip: "Clear and concise writing." },
                    { type: "improve", tip: "Reduce passive voice." },
                ],
            },

            content: {
                score: 92,
                tips: [
                    { type: "good", tip: "Excellent project descriptions." },
                    { type: "good", tip: "Achievements are measurable." },
                    { type: "improve", tip: "Highlight leadership experience." },
                ],
            },

            structure: {
                score: 89,
                tips: [
                    { type: "good", tip: "Well-organized sections." },
                    { type: "good", tip: "Easy to scan." },
                    { type: "improve", tip: "Reduce white space slightly." },
                ],
            },

            skills: {
                score: 91,
                tips: [
                    { type: "good", tip: "Excellent Swift expertise." },
                    { type: "good", tip: "Relevant iOS frameworks included." },
                    { type: "improve", tip: "Mention CI/CD experience if applicable." },
                ],
            },
        },
    },
];
