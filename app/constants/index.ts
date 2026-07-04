// In this file there are three workflows:
// 1. resumes - stores candidate resumes with paths and feedback structure
// 2. AIResponseFormat - defines the strict format that AI should return
// 3. prepareInstructions - generates a prompt for AI to analyze the resume in the exact format

export interface FeedbackCategory {
    score: number;
    tips: string[];
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

export const resumes: Resume[] = [
    {
        id: "1", // Company identifier for the resume
        companyName: "Google", // Company the resume was submitted to
        jobTitle: "Frontend Developer", // Role the candidate applied for
        imagePath: "public\\images\\resume_01.png", // Thumbnail image
        resumePath: "/resumes/resume-1.pdf", // Resume PDF path
        feedback: {
            overallScore: 88,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
    {
        id: "2",
        companyName: "Microsoft",
        jobTitle: "Cloud Engineer",
        imagePath: "public\\images\\resume_02.png",
        resumePath: "/resumes/resume-2.pdf",
        feedback: {
            overallScore: 56,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
    {
        id: "3",
        companyName: "Apple",
        jobTitle: "iOS Developer",
        imagePath: "public\\images\\resume-3.png",
        resumePath: "/resumes/resume-3.pdf",
        feedback: {
            overallScore: 50,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
];

// This is the format in which AI should provide feedback on a resume.
// AIResponseFormat is a string representing a TypeScript interface.

export const AIResponseFormat = ``
interface Feedback {
  overallScore: number;

  ATS: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
    }[];
  };

  toneAndStyle: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
    }[];
  };

  content: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
    }[];
  };

  structure: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
    }[];
  };

  skills: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
    }[];
  };
}
;

// Generates instructions for the AI

export const prepareInstructions = ({
     JobTitle,
    jobDescription,
    AIResponseFormat,
}: {
    JobTitle: string;
    jobDescription: string;
    AIResponseFormat: string;
}) =>

    {
        return `you are an expert in ATS and resume analysis.
please analyze and rate this resume and suggest how to improve it . the rating can be low if the resume is bad .Be through and detalied. Don't be afraid to point out any mistages or are of improvment.
If there is a lot to improve,don,,t hesistste to give low scores. This is to hel the user improve.
If available, use the job description for the job user iss applying to give a more detailed feedback.
If provided, take the job description into consideration before giving a response.
The Job Title is : ${JobTitle}
The Job Description is : ${jobDescription}
provide the feedback usinng the following format : ${AIResponseFormat}
Return the analysis in a JSON object , without any other text and without any backticks.
Do not include any other Text or Comments.`;
    };

