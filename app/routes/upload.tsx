// Imports
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import FileUploader from "../components/FileUploader";
import { getPuterAPI } from "../lib/puter";

const Upload = () => {
    // ============================
    // Form State
    // ============================

    const [companyName, setCompanyName] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [file, setFile] = useState<File | null>(null);

    // ============================
    // UI State
    // ============================

    const [isProcessing, setProcessing] = useState(false);
    const [statusText, setStatusText] = useState("");
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);
    const [atsScore, setAtsScore] = useState<number | null>(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ============================
    // Reset Functions
    // ============================

    const resetAnalysis = () => {
        setProcessing(false);
        setStatusText("");
        setAnalysisResult(null);
        setAtsScore(null);
        setError("");
        setSuccess("");
    };

    const resetForm = () => {
        resetAnalysis();
        setCompanyName("");
        setJobTitle("");
        setJobDescription("");
        setFile(null);
    };

    // ============================
    // File Upload
    // ============================

    const handleFileSelect = (selectedFile: File | null) => {
        setFile(selectedFile);
    };

    // ============================
    // AI Helpers
    // ============================

    const extractTextFromContent = (content: any): string | null => {
        if (!content) return null;

        if (typeof content === "string")
            return content.trim();

        if (Array.isArray(content))
            return content
                .map(extractTextFromContent)
                .filter(Boolean)
                .join("\n\n");

        if (typeof content === "object") {
            if (content.text)
                return content.text;

            if (content.content)
                return extractTextFromContent(content.content);

            if (content.value)
                return content.value;
        }

        return null;
    };

    const extractMessage = (response: any): string | null => {
        if (!response) return null;

        if (typeof response === "string")
            return response;

        const content =
            response?.message?.content ??
            response?.output?.[0]?.content ??
            response?.choices?.[0]?.message?.content ??
            response?.data;

        const text = extractTextFromContent(content);

        if (text) return text;

        if (typeof response === "object")
            return JSON.stringify(response, null, 2);

        return String(response);
    };

    const getUploadPath = (upload: any): string | null => {
        if (!upload) return null;

        if (typeof upload === "string")
            return upload;

        if (Array.isArray(upload))
            return getUploadPath(upload[0]);

        if (upload.path)
            return upload.path;

        if (upload.filePath)
            return upload.filePath;

        return null;
    };

    const parseScoreFromText = (text: string): number | null => {

        const match = text.match(/score(?:[^\d]{1,10})(\d{1,3})/i);

        if (match) {
            const value = Number(match[1]);

            if (value >= 0 && value <= 100)
                return value;
        }

        try {

            const json = text.match(/\{[\s\S]*\}/);

            if (json) {

                const parsed = JSON.parse(json[0]);

                return (
                    parsed.atsScore ??
                    parsed.score ??
                    parsed.ATS?.score ??
                    null
                );

            }

        } catch { }

        return null;
    };

    // ============================
    // Submit
    // ============================

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        if (!companyName.trim())
            return setError("Enter company name.");

        if (!jobTitle.trim())
            return setError("Enter job title.");

        if (!jobDescription.trim())
            return setError("Enter job description.");

        if (!file)
            return setError("Upload your resume.");

        setProcessing(true);
        setStatusText("Uploading Resume...");
        setAnalysisResult(null);
        setAtsScore(null);

        try {

            const api = getPuterAPI();

            const upload = await api.fs.upload([file]);

            const uploadPath = getUploadPath(upload);

            if (!uploadPath) {

                setError("Resume upload failed.");

                setProcessing(false);

                return;

            }

            setStatusText("AI is analyzing your resume...");

            const prompt = `
Company: ${companyName}

Job Title: ${jobTitle}

Job Description:

${jobDescription}

Analyze this resume.

Return:

1. ATS Score (0-100)

2. Strengths

3. Weaknesses

4. Missing Keywords

5. Formatting

6. Final Suggestions.
`;

            const response =
                await api.ai.feedback(uploadPath, prompt);

            if (!response) {

                setError("AI returned no response.");

                setProcessing(false);

                return;

            }

            const result = extractMessage(response);

            setAnalysisResult(result);

            if (result) {

                const score = parseScoreFromText(result);

                if (score !== null)
                    setAtsScore(score);

            }

            setSuccess("Analysis Complete");

        } catch (err) {

            console.error(err);

            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong."
            );

        } finally {

            setProcessing(false);

        }
    };
    return (
        <main
            className="min-h-screen bg-cover bg-center"
            style={{
                backgroundImage: "url('/images/bg_cover.png')",
            }}
        >
            {/* ==========================
                Navbar
            ========================== */}
            <Navbar />

            <section className="flex justify-center px-5 py-14">
                <div className="w-full max-w-4xl rounded-3xl bg-white/90 p-8 shadow-2xl backdrop-blur-lg">

                    {/* ==========================
                        Page Heading
                    ========================== */}
                    <div className="mb-10 text-center">
                        <h1 className="text-4xl font-bold text-gray-900">
                            Smart AI Resume Analyzer
                        </h1>

                        <p className="mt-3 text-gray-500">
                            Upload your resume and receive ATS Score,
                            AI feedback and recruiter suggestions.
                        </p>
                    </div>

                    {/* ==========================
                        Processing UI
                    ========================== */}
                    {isProcessing ? (
                        <div className="flex flex-col items-center gap-6 py-10">

                            <img
                                src="/images/searching for profile.gif"
                                alt="Processing Resume"
                                className="w-72"
                            />

                            <h2 className="text-xl font-semibold text-indigo-600">
                                {statusText}
                            </h2>

                        </div>

                    ) : analysisResult ? (

                        /* ==========================
                            Analysis Result
                        ========================== */

                        <div className="space-y-8">

                            {/* ATS Score Card */}
                            <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 p-8 text-white shadow-xl">

                                <div className="flex items-center justify-between">

                                    <div>
                                        <p className="uppercase tracking-widest text-white/70">
                                            ATS Score
                                        </p>

                                        <h2 className="mt-3 text-6xl font-bold">
                                            {atsScore ?? "--"}
                                        </h2>

                                        <p className="mt-2">
                                            out of 100
                                        </p>
                                    </div>

                                    <div className="rounded-full bg-white/20 px-6 py-3">
                                        AI Powered
                                    </div>

                                </div>

                            </div>

                            {/* Written Report */}
                            <div className="rounded-3xl border bg-white p-8 shadow-lg">

                                <h2 className="mb-5 text-2xl font-bold">
                                    Resume Analysis
                                </h2>

                                <div className="whitespace-pre-wrap leading-8 text-gray-700">
                                    {analysisResult}
                                </div>

                            </div>

                            {/* Buttons */}
                            <div className="flex flex-wrap gap-4">

                                <button
                                    onClick={resetForm}
                                    className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
                                >
                                    Analyze Another Resume
                                </button>

                            </div>

                        </div>

                    ) : (

                        /* ==========================
                            Upload Form
                        ========================== */

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >

                            {/* Company Name */}
                            <div>

                                <label className="mb-2 block font-semibold">
                                    Company Name
                                </label>

                                <input
                                    type="text"
                                    value={companyName}
                                    onChange={(e) =>
                                        setCompanyName(e.target.value)
                                    }
                                    placeholder="Google"
                                    className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-indigo-500"
                                />

                            </div>

                            {/* Job Title */}
                            <div>

                                <label className="mb-2 block font-semibold">
                                    Job Title
                                </label>

                                <input
                                    type="text"
                                    value={jobTitle}
                                    onChange={(e) =>
                                        setJobTitle(e.target.value)
                                    }
                                    placeholder="Frontend Developer"
                                    className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-indigo-500"
                                />

                            </div>

                            {/* Job Description */}
                            <div>

                                <label className="mb-2 block font-semibold">
                                    Job Description
                                </label>

                                <textarea
                                    rows={7}
                                    value={jobDescription}
                                    onChange={(e) =>
                                        setJobDescription(e.target.value)
                                    }
                                    placeholder="Paste Job Description..."
                                    className="w-full resize-none rounded-xl border border-gray-300 p-4 outline-none focus:border-indigo-500"
                                />

                            </div>

                            {/* Resume Upload */}
                            <div>

                                <label className="mb-3 block font-semibold">
                                    Upload Resume
                                </label>

                                <FileUploader
                                    onFileSelect={handleFileSelect}
                                />

                            </div>

                            {/* Error */}
                            {error && (

                                <div className="rounded-xl bg-red-50 p-4 text-center text-red-600">

                                    {error}

                                </div>

                            )}

                            {/* Success */}
                            {success && (

                                <div className="rounded-xl bg-green-50 p-4 text-center text-green-700">

                                    {success}

                                </div>

                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isProcessing}
                                className="w-full rounded-xl bg-indigo-600 py-4 text-lg font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Analyze Resume
                            </button>

                        </form>

                    )}

                </div>
            </section>
        </main>
    );
};

export default Upload;
