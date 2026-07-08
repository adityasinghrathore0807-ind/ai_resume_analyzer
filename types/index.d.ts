//Represent a job posting with key details
interface Job {
    title: string;//Title of the job description
    description: string;//full description of job responsibilities
    location: string; //Location of the job (City,Remote,Hybride etc.)
    requiredSkills: string[];//List of Slikks required for the job
    salary: number; //Salary of the job
}

//Represent a candidate's resume and associated evalution feedback
interface Resume{
    id: String;//Unique Identifier for the Resume
    companyName?: string;//Optional-Company Associated with the Resume/Job
    jobTitle?: string;//optional-job Title associated with the resume
    ImagePath: string;//Path to the candidate's profile image
    resumePath: string;//path to the actual resume file(PDF.)
    feedback: feedback;//Detailed feedback after resume evaluation
}

//Represent detailed evaluation feedback for a resume
interface Feedback{
    overallscore: number; //Overall score summarizing the resume evaluation
//Section evaluation ATS (Applicant Tracking System) Compatibility
    ATS: {
        score: number;//ATS score based onn keyboard matching,formatting
        tips: {
            type: "good" | "imporve";//Indicate if the tip is a strength or an area to improve
            tip: string;//Concise feedback Tip
        }[];//Array of tips related to ATS evaluation
    };
    // Section evaluation the Tone and style of the Resume
    toneAndStyle: {
        score: number;//Score for tone, readability,writing style
        tips:{
    type: "good" | "improve";//Indicate if the tip is a strength or an area to improve
    tip: string;//Specific feedback for toneAndStyle
    explanation: string;//Detailed reasoning behind the tip
} [];// Array of the related to the tone and style evaluation
    };
//Section evaluation  the Content Quality of the Resume
content: {
    score: number;//Score for clarity, relevance and completeness of content
        tips:{
        type: "good" | "improve";//Indicate if the tip is a strength or an area to improve
        tip: string;//Specific feedback for content
        explanation: string;//Detailed reasoning behind the tip
    } [];// Array of the related to the content evaluation
};

//Section evaluating the Structure and Formating of thr resume
structure: {
        score: number;//Score for Organization,Layout and Readability
        tips:{
            type: "good" | "improve";//Indicate if the tip is a strength or an area to improve
            tip: string;//Specific feedback for structure
            explanation: string;//Detailed reasoning behind the tip
        } [];// Array of the related to the Structure and formatting
};
//Section evaluating how well skills are presented in the resume
skills: {
    score: number;//Score for skills Relevance and presentation
        tips:{
        type: "good" | "improve";//Indicate if the tip is a strength or an area to improve
        tip: string;//Specific feedback for skills
        explanation: string;//Detailed reasoning behind the tip
    } [];// Array of the related to the skills evaluation
};
}
