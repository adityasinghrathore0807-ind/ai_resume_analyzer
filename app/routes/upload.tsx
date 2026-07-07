import React, { useState } from "react";
import Navbar from "../components/Navbar";

const Upload = () => {
    const [companyName, setCompanyName] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [resume, setResume] = useState<File | null>(null);

    const [isProcessing, setProcessing] = useState(false);
    const [statusText, setStatusText] = useState("");

    // ============================
    // Handle File Selection
    // ============================
    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (e.target.files && e.target.files.length > 0) {
            setResume(e.target.files[0]);
        }
    };

    // ============================
    // Submit Form
    // ============================
    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!companyName.trim()) {
            alert("Please enter Company Name");
            return;
        }

        if (!jobTitle.trim()) {
            alert("Please enter Job Title");
            return;
        }

        if (!jobDescription.trim()) {
            alert("Please enter Job Description");
            return;
        }

        if (!resume) {
            alert("Please upload your resume.");
            return;
        }

        setProcessing(true);
        setStatusText("Uploading Resume...");

        try {
            // ============================
            // Your Upload Logic Here
            // ============================

            console.log({
                companyName,
                jobTitle,
                jobDescription,
                resume,
            });

            setStatusText("Analyzing Resume...");

            // Fake API Delay
            await new Promise((resolve) =>
                setTimeout(resolve, 3000)
            );

            setStatusText("Analysis Complete!");
        } catch (error) {
            console.error(error);
            alert("Something went wrong.");
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
            <Navbar />

            <section className="flex justify-center py-16 px-4">
                <div className="w-full max-w-3xl rounded-3xl bg-white/90 backdrop-blur-xl shadow-2xl p-10">

                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-bold">
                            AI Resume Analyzer
                        </h1>

                        <p className="text-gray-500 mt-3">
                            Upload your resume and receive ATS score,
                            personalized feedback and improvement tips.
                        </p>
                    </div>

                    {isProcessing ? (
                        <div className="flex flex-col items-center gap-6">

                            <img
                                src="/images/searching for profile.gif"
                                alt="Processing Resume"
                                className="w-72"
                            />

                            <h2 className="text-xl font-semibold text-indigo-600">
                                {statusText}
                            </h2>
                        </div>
                    ) : (
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >
                            {/* Company Name */}
                            <div>
                                <label className="font-semibold block mb-2">
                                    Company Name
                                </label>

                                <input
                                    type="text"
                                    value={companyName}
                                    onChange={(e) =>
                                        setCompanyName(e.target.value)
                                    }
                                    placeholder="Google"
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Job Title */}
                            <div>
                                <label className="font-semibold block mb-2">
                                    Job Title
                                </label>

                                <input
                                    type="text"
                                    value={jobTitle}
                                    onChange={(e) =>
                                        setJobTitle(e.target.value)
                                    }
                                    placeholder="Frontend Developer"
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Job Description */}
                            <div>
                                <label className="font-semibold block mb-2">
                                    Job Description
                                </label>

                                <textarea
                                    rows={6}
                                    value={jobDescription}
                                    onChange={(e) =>
                                        setJobDescription(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Paste the job description..."
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Upload Resume */}
                            <div>
                                <label className="font-semibold block mb-3">
                                    Resume
                                </label>

                                <div className="border-2 border-dashed border-indigo-300 rounded-2xl p-8 text-center hover:border-indigo-500 transition">

                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleFileChange}
                                        className="w-full"
                                    />

                                    <p className="mt-3 text-gray-500 text-sm">
                                        PDF or DOCX (Max 5 MB)
                                    </p>

                                    {resume && (
                                        <p className="mt-3 font-medium text-green-600">
                                            {resume.name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isProcessing}
                                className="w-full rounded-xl bg-indigo-600 py-4 text-lg font-semibold text-white hover:bg-indigo-700 transition disabled:opacity-50"
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
