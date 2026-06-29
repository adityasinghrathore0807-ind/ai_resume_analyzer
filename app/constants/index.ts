//In this file three workflows :
//resumes -store candidate resume with paths and feedback structure
//AI response Format - defines the structure strict format that AI should return
//prepareInstructions - generate a prompt for AI to analyzer the resume ine xact format


export const resumes: Resumes[] = [
    {
        id: "1"// company identifier for the resume
    companyName: "Google",//Company the resume was submitted to
        jobTitle: "Frontend Developer",//Role the candidate applied for
        imagePath: "/image/resume-1/png", //thumbnail Image for the Resume
        ResumePath: "/resumes/resume-1.pdf",//path to the full pdf Resume
        feedback: {// Feedback structure for resume Evaluation
            overallScore: 58, //overall Score out of 100
            ATS: {// Applicant Tracking System (relevant for automatic screening)
                score: 90,
                tips[],// Tips to improve ATS compatibility
            }
            toneAndStyle: {// feedback on writing dtyle, tone and readablity
                score: 90,
                tips: []// tips for improving tone and style
            },
            content: {//feedback on content quality and relevance
                score: 90,
                tips: [],// Tips for imporving content
            },
            structure: {//feedback on formatting, layout and organization
                score: 90
                tips: [],// tips for improving structure
            },
            skills: { //feedback for skills listed, relevancy and clearity
                score: 90,
                tips: [],//tips for improving skills section
            },
        }
    }
{
        id: "2",
        companyName: "Microsoft",
        jobTitle: 'cloude Engineer',
        imagePath: "/image/resume-2.png",
        resumePath: '/resume/resume-2.pdf',
        feedback: {
            overallScore: 50// low score to indicate that resume needs improvement
            ATS: { score: 90, tips: [] },
            toneAndstyle { score: 90, tips: [] },
    content: { score, tips: [] },
    structure : { score: 90, tips: [] },
    skills : { score: 90, tips: [] },
    },
 }
{
    id: "3",
        companyName: "Apple",
            jobTitle: 'iOs Developer',
                imagePath: "/image/resume-3.png",
                    resumePath: '/resume/resume-3.pdf',
                        feedback: {
        overallScore: 50// low score to indicate that resume needs improvement
        ATS: { score: 90, tips: [] },
        toneAndstyle: { score: 90, tips: [] },
        content: { score0, tips: [] },
        structure: { score: 90, tips: [] },
        skills: { score: 90, tips: [] },
    },
}
];
//This is the format in  which AI should provide us the feedback on a resume.
//The AIResponseformat is a string representing a TypeScript Interface.
//It tells the AI exactly what structure to use when returning the feedback.
export const AIResponseformat = ````
interface feedback {
    overallScore: number; //max 100
    ATS: {
        score: number;// rate us based on ATS Suitability
        tips: {
            tips: "good" | "improve";// idicate if this is a positive point or an improvement
            tip: string// short feedback tip
        }[]:
        toneAndStyle: {
            score:
        }
    }
`;

