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
            overallScore: 88,

            ATS: {
                score: 90,
                tips: [],
            },

            toneAndStyle: {
                score: 87,
                tips: [],
            },

            content: {
                score: 89,
                tips: [],
            },

            structure: {
                score: 91,
                tips: [],
            },

            skills: {
                score: 86,
                tips: [],
            },
        },
    },

    {
        id: "2",

        companyName: "Microsoft",

        jobTitle: "Cloud Engineer",

        imagePath: "/images/resume_02.png",

        resumePath: "/resumes/resume-2.pdf",

        feedback: {
            overallScore: 74,

            ATS: {
                score: 72,
                tips: [],
            },

            toneAndStyle: {
                score: 76,
                tips: [],
            },

            content: {
                score: 75,
                tips: [],
            },

            structure: {
                score: 74,
                tips: [],
            },

            skills: {
                score: 73,
                tips: [],
            },
        },
    },

    {
        id: "3",

        companyName: "Apple",

        jobTitle: "iOS Developer",

        imagePath: "/images/resume_03.png",

        resumePath: "/resumes/resume-3.pdf",

        feedback: {
            overallScore: 91,

            ATS: {
                score: 93,
                tips: [],
            },

            toneAndStyle: {
                score: 90,
                tips: [],
            },

            content: {
                score: 92,
                tips: [],
            },

            structure: {
                score: 89,
                tips: [],
            },

            skills: {
                score: 91,
                tips: [],
            },
        },
    },
];

//
// =======================================================
// Expected AI Response Format
// =======================================================
//

export const AIResponseFormat = `
{
  "overallScore": number,

  "ATS": {
    "score": number,
    "tips": [
      {
        "type": "good | improve",
        "tip": "string"
      }
    ]
  },

  "toneAndStyle": {
    "score": number,
    "tips": [
      {
        "type": "good | improve",
        "tip": "string"
      }
    ]
  },

  "content": {
    "score": number,
    "tips": [
      {
        "type": "good | improve",
        "tip": "string"
      }
    ]
  },

  "structure": {
    "score": number,
    "tips": [
      {
        "type": "good | improve",
        "tip": "string"
      }
    ]
  },

  "skills": {
    "score": number,
    "tips": [
      {
        "type": "good | improve",
        "tip": "string"
      }
    ]
  }
}
`;

//
// =======================================================
// Prompt Generator
// =======================================================
//

export const prepareInstructions = ({
    jobTitle,
    jobDescription,
    AIResponseFormat,
}: {
    jobTitle: string;
    jobDescription: string;
    AIResponseFormat: string;
}) => {
    return `
You are a Senior ATS Resume Reviewer and Technical Recruiter.

A PDF resume has already been attached.

Your task is to carefully read the uploaded resume and compare it against the job description.

==================================================

JOB TITLE

${jobTitle}

==================================================

JOB DESCRIPTION

${jobDescription}

==================================================

Evaluate the resume using these categories:

• ATS Compatibility
• Resume Structure
• Resume Content
• Skills Match
• Tone and Writing Style

==================================================

Return ONLY valid JSON.

Do NOT use Markdown.

Do NOT use code blocks.

Do NOT explain anything outside JSON.

Do NOT say:
"I cannot access the resume."

Do NOT say:
"No resume attached."

Assume the attached resume is available.

==================================================

JSON FORMAT

${AIResponseFormat}

==================================================

Rules

- Every score must be between 0 and 100.

- overallScore should be the average.

- Every category must contain 3-5 tips.

- Include both positive and improvement tips.

- Return ONLY JSON.

`;
};
