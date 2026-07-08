// ======================================================
// upload.tsx
// Merged version — combines the best of both drafts:
//  - Fixed missing e.preventDefault() (was a real bug: form
//    reloaded the page on submit in one version)
//  - Fixed ScoreCircle import path + actually renders it
//  - More robust response/score parsing (multiple regex
//    patterns + JSON fallback), but atsScore stays `null`
//    on failure instead of silently defaulting to 0
//  - getSection() uses a word-boundary lookahead so it can't
//    false-match a heading mid-word
//  - Report download (handleDownloadReport) draws the report
//    onto a <canvas> by hand, then wraps that canvas into a
//    single-page PDF via jsPDF. This avoids
//    html2canvas's known issue with modern Tailwind gradients
//    that use oklch() colors (which it can render as solid
//    black). Trade-off: the section list in handleDownloadReport
//    must be kept in sync by hand with the JSX below.
//  - Keeps the fuller report UI: Formatting Issues section,
//    ScoreCircle, dynamic status message, download-in-progress
//    button state
// ======================================================
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import FileUploader from "../components/FileUploader";
import ScoreCircle from "../components/ScoreCircle";
import { getPuterAPI } from "../lib/puter";

const Upload = () => {
    // ==========================================
    // FORM STATE
    // ==========================================

    const [companyName, setCompanyName] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [file, setFile] = useState<File | null>(null);

    // ==========================================
    // UI STATE
    // ==========================================

    const [isProcessing, setProcessing] = useState(false);
    const [statusText, setStatusText] = useState("");
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);
    const [atsScore, setAtsScore] = useState<number | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploadedPath, setUploadedPath] = useState<string | null>(null);
    const [isDownloading, setDownloading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ==========================================
    // RESET FUNCTIONS
    // ==========================================

    const resetAnalysis = () => {
        setProcessing(false);
        setStatusText("");
        setAnalysisResult(null);
        setAtsScore(null);
        setUploadedPath(null);
        setError("");
        setSuccess("");
    };

    const resetForm = () => {
        resetAnalysis();
        setCompanyName("");
        setJobTitle("");
        setJobDescription("");
        setFile(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
    };

    // ==========================================
    // FILE SELECT
    // ==========================================

    const handleFileSelect = (selected: File | null) => {
        setFile(selected);

        if (selected) {
            const url = URL.createObjectURL(selected);
            setPreviewUrl(url);
        } else {
            setPreviewUrl(null);
        }
    };

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    // ==========================================
    // AI RESPONSE PARSING
    // ==========================================

    const extractTextFromContent = (content: any): string | null => {
        if (!content) return null;

        if (typeof content === "string") return content.trim();

        if (Array.isArray(content))
            return content
                .map(extractTextFromContent)
                .filter(Boolean)
                .join("\n\n");

        if (typeof content === "object") {
            if (content.text) return content.text;
            if (content.content) return extractTextFromContent(content.content);
            if (content.value) return content.value;
        }

        return null;
    };

    const extractMessage = (response: any): string | null => {
        if (!response) return null;

        if (typeof response === "string") return response;

        const content =
            response?.message?.content ??
            response?.output?.[0]?.content ??
            response?.choices?.[0]?.message?.content ??
            response?.data;

        const text = extractTextFromContent(content);

        if (text) return text;

        if (typeof response === "object") return JSON.stringify(response, null, 2);

        return String(response);
    };

    const getUploadPath = (upload: any): string | null => {
        if (!upload) return null;
        if (typeof upload === "string") return upload;
        if (Array.isArray(upload)) return getUploadPath(upload[0]);
        return upload.path || upload.filePath || null;
    };

    // ==========================================
    // ATS SCORE PARSER
    // (kept the wider pattern set + JSON fallback; on
    //  failure we return null rather than a misleading 0)
    // ==========================================

    const parseScoreFromText = (text: string): number | null => {
        if (!text) return null;

        const patterns = [
            /ATS\s*Score\s*(?:[:\-–—])?\s*([0-9]{1,3})/i,
            /Overall\s*Score\s*(?:[:\-–—])?\s*([0-9]{1,3})/i,
            /Score\s*(?:[:\-–—])?\s*([0-9]{1,3})/i,
            /score\s*is\s*([0-9]{1,3})/i,
            /score\s*[:=]\s*([0-9]{1,3})\s*\/\s*100/i,
            /([0-9]{1,3})\s*\/\s*100/i,
            /([0-9]{1,3})\s*%/,
            /overallScore["']?\s*[:=]?\s*([0-9]{1,3})/i,
            /atsScore["']?\s*[:=]?\s*([0-9]{1,3})/i,
            /score["']?\s*[:=]?\s*([0-9]{1,3})/i,
            /([0-9]{1,3})\s*out\s*of\s*100/i,
        ];

        for (const pattern of patterns) {
            const match = text.match(pattern);

            if (match) {
                const score = Number(match[1]);
                if (!isNaN(score) && score >= 0 && score <= 100) return score;
            }
        }

        try {
            const json = text.match(/\{[\s\S]*\}/);

            if (json) {
                const parsed = JSON.parse(json[0]);
                return parsed.overallScore ?? parsed.atsScore ?? parsed.score ?? parsed.ATS?.score ?? null;
            }
        } catch {
            // ignore invalid JSON
        }

        return null;
    };

    // ==========================================
    // SECTION EXTRACTOR
    // Line-based, not a single regex over the whole blob. This matters
    // because a heading word (e.g. "strengths") can legitimately appear
    // mid-sentence inside another section (e.g. inside the Executive
    // Summary's own prose), and a whole-text regex search will happily
    // match that occurrence instead of the real heading line further
    // down. Scanning line-by-line and requiring the heading to start
    // the (trimmed) line avoids that false match.
    // ==========================================

    const SECTION_HEADINGS = [
        "Executive Summary",
        "ATS Score",
        "Strengths",
        "Weaknesses",
        "Missing Keywords",
        "Formatting Issues",
        "Recommendations",
        "Final Verdict",
    ];

    // A line "is" a given heading if, once trimmed, it starts with that
    // heading text AND whatever comes right after is either nothing, or
    // punctuation/whitespace (":", "-", etc) — not a letter continuing
    // the same word/sentence (e.g. "Strengths of this candidate..." is
    // NOT a heading line for "Strengths").
    const lineMatchesHeading = (line: string, heading: string): boolean => {
        const trimmed = line.trim();
        if (!trimmed) return false;

        const lower = trimmed.toLowerCase();
        const headingLower = heading.toLowerCase();

        if (!lower.startsWith(headingLower)) return false;

        const rest = trimmed.slice(heading.length);
        if (rest === "") return true;

        return /^[\s:.\-–—]/.test(rest);
    };

    const getSection = (heading: string): string => {
        if (!analysisResult) return "";

        const lines = analysisResult.split("\n");

        let startLine = -1;
        let sameLineRemainder = "";

        for (let i = 0; i < lines.length; i++) {
            if (lineMatchesHeading(lines[i], heading)) {
                startLine = i;
                const trimmed = lines[i].trim();
                sameLineRemainder = trimmed
                    .slice(heading.length)
                    .replace(/^[\s:.\-–—]+/, "")
                    .trim();
                break;
            }
        }

        if (startLine === -1) return "";

        let endLine = lines.length;

        for (let i = startLine + 1; i < lines.length; i++) {
            const isOtherHeading = SECTION_HEADINGS.some(
                (h) => h !== heading && lineMatchesHeading(lines[i], h)
            );

            if (isOtherHeading) {
                endLine = i;
                break;
            }
        }

        const body = lines.slice(startLine + 1, endLine).join("\n").trim();

        return [sameLineRemainder, body].filter(Boolean).join("\n").trim();
    };

    // ==========================================
    // DOWNLOAD REPORT
    // Draws the report from scratch onto a <canvas>, then wraps that
    // canvas into a single-page PDF via jsPDF. This sidesteps html2canvas's known
    // issues with modern Tailwind gradients that use oklch()
    // colors (which it can render as solid black). The trade-off
    // is that this content list has to be kept in sync by hand
    // with the sections rendered in the JSX below.
    // ==========================================

    const handleDownloadReport = async () => {
        if (!analysisResult) {
            setError("No report available to download.");
            return;
        }

        setDownloading(true);
        setError("");

        try {
            const sections = [
                {
                    title: "Executive Summary",
                    content: getSection("Executive Summary") || analysisResult,
                    bgColor: "#eff6ff",
                },
                {
                    title: "Strengths",
                    content: getSection("Strengths"),
                    bgColor: "#ecfdf5",
                },
                {
                    title: "Weaknesses",
                    content: getSection("Weaknesses"),
                    bgColor: "#fef2f2",
                },
                {
                    title: "Missing Keywords",
                    content: getSection("Missing Keywords"),
                    bgColor: "#fef9c3",
                },
                {
                    title: "Formatting Issues",
                    content: getSection("Formatting Issues"),
                    bgColor: "#fff7ed",
                },
                {
                    title: "Recommendations",
                    content: getSection("Recommendations"),
                    bgColor: "#f5f3ff",
                },
                {
                    title: "Final Verdict",
                    content: getSection("Final Verdict"),
                    bgColor: "#eef2ff",
                },
            ];

            const canvasWidth = 1200;
            const padding = 50;
            const cardPadding = 36;
            const titleFont = "bold 44px sans-serif";
            const headerFont = "600 20px sans-serif";
            const sectionTitleFont = "700 26px sans-serif";
            const bodyFont = "normal 20px sans-serif";
            const lineHeight = 32;
            const cardGap = 28;
            const scoreCardHeight = 220;
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            if (!ctx) {
                throw new Error("Unable to create canvas context.");
            }

            const maxTextWidth = canvasWidth - padding * 2 - cardPadding * 2;
            ctx.textBaseline = "top";

            const wrapText = (text: string, font: string) => {
                ctx.font = font;
                const words = text.split(" ");
                const lines: string[] = [];
                let currentLine = "";

                for (const word of words) {
                    const testLine = currentLine ? `${currentLine} ${word}` : word;
                    const width = ctx.measureText(testLine).width;
                    if (width > maxTextWidth && currentLine) {
                        lines.push(currentLine);
                        currentLine = word;
                    } else {
                        currentLine = testLine;
                    }
                }

                if (currentLine) lines.push(currentLine);
                return lines;
            };

            const headerLines = wrapText("Smart AI Resume Analyzer", titleFont);
            let totalHeight =
                padding + headerLines.length * lineHeight + 8 + lineHeight + 30 + scoreCardHeight + cardGap;

            const sectionLayouts = sections.map((section) => {
                const titleLines = wrapText(section.title, sectionTitleFont);
                const contentText = section.content || "No information available.";
                const contentLines = wrapText(contentText, bodyFont);
                const sectionHeight =
                    titleLines.length * lineHeight + contentLines.length * lineHeight + cardPadding * 2 + 16;
                totalHeight += sectionHeight + cardGap;
                return { ...section, titleLines, contentLines, sectionHeight };
            });

            canvas.width = canvasWidth;
            canvas.height = totalHeight;

            ctx.fillStyle = "#f8fafc";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            let y = padding;
            ctx.fillStyle = "#0f172a";
            ctx.font = titleFont;
            for (const line of headerLines) {
                ctx.fillText(line, padding, y);
                y += lineHeight;
            }

            y += 8;
            ctx.font = headerFont;
            ctx.fillStyle = "#475569";
            ctx.fillText(`Company: ${companyName || "N/A"} · Job Title: ${jobTitle || "N/A"}`, padding, y);
            y += lineHeight + 30;

            // Score card
            const scoreCardX = padding;
            const scoreCardWidth = canvasWidth - padding * 2;
            const scoreCardY = y;
            ctx.fillStyle = "#2563eb";
            ctx.fillRect(scoreCardX, scoreCardY, scoreCardWidth, scoreCardHeight);
            ctx.fillStyle = "#ffffff";

            // The label (20px) and the score number (72px, bold) are drawn
            // with wildly different font sizes. "top" baseline positioning
            // is unreliable in that situation — some fonts reserve a lot of
            // empty space above the visible glyph, others don't — which was
            // causing the label, number, and "out of 100" to visually
            // overlap. Switching to "alphabetic" baseline and spacing by
            // baseline-to-baseline distance is consistent regardless of
            // font metrics, so we swap to it just for this card.
            ctx.textBaseline = "alphabetic";

            const scoreLabelBaseline = scoreCardY + 34;
            const scoreValueBaseline = scoreLabelBaseline + 80;
            const scoreOutOfBaseline = scoreValueBaseline + 50;

            ctx.font = "600 20px Inter, ui-sans-serif, system-ui, sans-serif";
            ctx.fillText("ATS SCORE", scoreCardX + cardPadding, scoreLabelBaseline);

            ctx.font = "bold 72px Inter, ui-sans-serif, system-ui, sans-serif";
            ctx.fillText(
                atsScore !== null ? String(atsScore) : "--",
                scoreCardX + cardPadding,
                scoreValueBaseline
            );

            ctx.font = "600 20px Inter, ui-sans-serif, system-ui, sans-serif";
            ctx.fillText("out of 100", scoreCardX + cardPadding, scoreOutOfBaseline);

            ctx.textBaseline = "top"; // restore for the section cards below, which step through wrapped lines assuming "top"

            y += scoreCardHeight + cardGap;

            sectionLayouts.forEach((section) => {
                const cardX = padding;
                const cardWidth = canvasWidth - padding * 2;
                const cardY = y;
                ctx.fillStyle = section.bgColor;
                const radius = 28;
                ctx.beginPath();
                ctx.moveTo(cardX + radius, cardY);
                ctx.lineTo(cardX + cardWidth - radius, cardY);
                ctx.quadraticCurveTo(cardX + cardWidth, cardY, cardX + cardWidth, cardY + radius);
                ctx.lineTo(cardX + cardWidth, cardY + section.sectionHeight - radius);
                ctx.quadraticCurveTo(
                    cardX + cardWidth,
                    cardY + section.sectionHeight,
                    cardX + cardWidth - radius,
                    cardY + section.sectionHeight
                );
                ctx.lineTo(cardX + radius, cardY + section.sectionHeight);
                ctx.quadraticCurveTo(
                    cardX,
                    cardY + section.sectionHeight,
                    cardX,
                    cardY + section.sectionHeight - radius
                );
                ctx.lineTo(cardX, cardY + radius);
                ctx.quadraticCurveTo(cardX, cardY, cardX + radius, cardY);
                ctx.closePath();
                ctx.fill();

                let textY = cardY + cardPadding;
                ctx.fillStyle = "#1d4ed8";
                ctx.font = sectionTitleFont;
                section.titleLines.forEach((line) => {
                    ctx.fillText(line, cardX + cardPadding, textY);
                    textY += lineHeight;
                });

                textY += 8;
                ctx.fillStyle = "#0f172a";
                ctx.font = bodyFont;
                section.contentLines.forEach((line) => {
                    ctx.fillText(line, cardX + cardPadding, textY);
                    textY += lineHeight;
                });

                y += section.sectionHeight + cardGap;
            });

            // Convert the drawn canvas into a single-page PDF sized to match
            // it exactly (no forced A4/Letter splitting). Requires the
            // "jspdf" package — install with `npm install jspdf`.
            const jsPDFModule = await import("jspdf");
            const JsPDF = jsPDFModule.jsPDF ?? jsPDFModule.default;

            const pdf = new JsPDF({
                orientation: canvas.height >= canvas.width ? "portrait" : "landscape",
                unit: "px",
                format: [canvas.width, canvas.height],
            });

            pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, canvas.width, canvas.height);

            const fileName = `${jobTitle ? jobTitle.replace(/[^a-zA-Z0-9-_ ]/g, "") : "resume"
                }-analysis-report.pdf`;

            pdf.save(fileName);

            setSuccess("Report downloaded successfully.");
        } catch (err: unknown) {
            console.error(err);
            setError(err instanceof Error ? err.message : "Unable to download report.");
        } finally {
            setDownloading(false);
        }
    };

    // ==========================================
    // HANDLE SUBMIT
    // ==========================================

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setAnalysisResult(null);
        setAtsScore(null);

        // ----------------------------
        // Validation
        // ----------------------------

        if (!companyName.trim()) {
            setError("Please enter company name.");
            return;
        }

        if (!jobTitle.trim()) {
            setError("Please enter job title.");
            return;
        }

        if (!jobDescription.trim()) {
            setError("Please enter job description.");
            return;
        }

        if (!file) {
            setError("Please upload your resume.");
            return;
        }

        try {
            setProcessing(true);
            setStatusText("Uploading Resume...");

            const api = getPuterAPI();

            // ----------------------------
            // Upload Resume
            // ----------------------------

            const uploadResult = await api.fs.upload([file]);
            const uploadPath = getUploadPath(uploadResult);

            if (!uploadPath) {
                setError("Resume upload failed.");
                return;
            }

            setUploadedPath(uploadPath);

            // ----------------------------
            // AI Processing
            // ----------------------------

            setStatusText("AI is analyzing your resume...");

            const prompt = `
You are an expert ATS Resume Analyzer.

The uploaded file is the candidate's resume.

Company:
${companyName}

Job Title:
${jobTitle}

Job Description:
${jobDescription}

Analyze the resume against the job description.

Return the result using exactly these headings:

Executive Summary

ATS Score: <number>/100

Strengths
- Bullet points

Weaknesses
- Bullet points

Missing Keywords
- Bullet points

Formatting Issues
- Bullet points

Recommendations
- Bullet points

Final Verdict

Rules

- ATS Score MUST always be a number.
- Keep each section concise.
- Do not use Markdown tables.
- Do not return JSON.
- Never say "No resume attached."
- Assume the attached PDF is available.
`;

            const response = await api.ai.feedback(uploadPath, prompt);

            if (!response) {
                setError("AI returned no response.");
                return;
            }

            // ----------------------------
            // Extract Response + Score
            // ----------------------------

            const text = extractMessage(response);

            if (!text) {
                setError("Unable to read AI response.");
                return;
            }

            let score: number | null = null;

            try {
                const json = JSON.parse(text);
                score = json.overallScore ?? json.atsScore ?? json.score ?? json.ATS?.score ?? null;
            } catch {
                score = parseScoreFromText(text);
            }

            console.log("========== AI RESPONSE ==========");
            console.log(text);
            console.log("Detected ATS Score:", score);

            setAnalysisResult(text);
            setAtsScore(score);
            setSuccess("Resume analyzed successfully.");
            setStatusText("Completed");
        } catch (err: unknown) {
            console.error(err);
            setError(err instanceof Error ? err.message : "Something went wrong.");
        } finally {
            setProcessing(false);
        }
    };

    // ==========================================
    // RETURN JSX
    // ==========================================

    return (
        <main
            className="min-h-screen bg-cover bg-center"
            style={{ backgroundImage: "url('/images/bg_cover.png')" }}
        >
            <Navbar />

            <section className="mx-auto max-w-6xl px-6 py-12">
                <div className="rounded-3xl bg-white/90 p-10 shadow-2xl backdrop-blur">
                    {/* ===============================
                        PAGE HEADING
                    =============================== */}
                    <div className="mb-12 text-center">
                        <h1 className="text-5xl font-bold text-slate-900">Smart AI Resume Analyzer</h1>
                        <p className="mt-4 text-lg text-slate-500">
                            Upload your resume and receive an ATS Score, AI feedback and recruiter suggestions.
                        </p>
                    </div>

                    {/* ===============================
                        LOADING SCREEN
                    =============================== */}
                    {isProcessing ? (
                        <div className="flex flex-col items-center py-16">
                            <img src="/images/searching for profile.gif" alt="Processing Resume" className="w-72" />
                            <h2 className="mt-8 text-2xl font-bold text-indigo-600">{statusText}</h2>
                        </div>
                    ) : analysisResult ? (
                        <div className="space-y-8">
                            {/* REPORT HEADER */}
                            <div className="flex flex-col gap-6 rounded-3xl bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-500 p-10 text-white md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h1 className="text-4xl font-bold">Resume Analysis Report</h1>
                                    <p className="mt-3 text-white/80">Generated : {new Date().toLocaleString()}</p>
                                    <p className="mt-2">
                                        Company : <strong>{companyName}</strong>
                                    </p>
                                    <p>
                                        Position : <strong>{jobTitle}</strong>
                                    </p>
                                </div>

                                <div className="rounded-full bg-white/20 px-8 py-4">
                                    <p className="text-lg font-semibold">AI Generated</p>
                                </div>
                            </div>

                            {/* ATS SCORE + STATUS */}
                            <div className="grid gap-8 md:grid-cols-2">
                                <div className="rounded-3xl bg-white p-8 shadow-lg">
                                    <p className="uppercase tracking-widest text-slate-500">ATS SCORE</p>

                                    <div className="mt-5 flex items-center gap-8">
                                        <ScoreCircle score={atsScore ?? 0} />

                                        <div>
                                            <h2 className="text-6xl font-bold text-indigo-700">{atsScore ?? "--"}</h2>
                                            <p className="mt-2 text-gray-500">out of 100</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 p-8 text-white shadow-xl">
                                    <h2 className="text-2xl font-bold">Resume Status</h2>

                                    <p className="mt-5 text-lg">
                                        {atsScore === null
                                            ? "Score unavailable"
                                            : atsScore >= 85
                                                ? "Excellent Resume"
                                                : atsScore >= 70
                                                    ? "Good Resume"
                                                    : atsScore >= 50
                                                        ? "Needs Improvement"
                                                        : "Poor ATS Compatibility"}
                                    </p>

                                    <p className="mt-5 text-white/90">
                                        Your resume has been evaluated using ATS compatibility, recruiter readability,
                                        formatting, keyword optimization and content quality.
                                    </p>
                                </div>
                            </div>

                            {/* EXECUTIVE SUMMARY */}
                            <div className="rounded-3xl border border-blue-200 bg-blue-50 p-8">
                                <h2 className="mb-5 text-3xl font-bold text-blue-700">📋 Executive Summary</h2>
                                <div className="whitespace-pre-wrap leading-8 text-gray-700">
                                    {getSection("Executive Summary")}
                                </div>
                            </div>

                            {/* STRENGTHS */}
                            <div className="rounded-3xl border border-green-200 bg-green-50 p-8">
                                <h2 className="mb-5 text-3xl font-bold text-green-700">✅ Strengths</h2>
                                <div className="whitespace-pre-wrap leading-8 text-gray-700">
                                    {getSection("Strengths")}
                                </div>
                            </div>

                            {/* WEAKNESSES */}
                            <div className="rounded-3xl border border-red-200 bg-red-50 p-8">
                                <h2 className="mb-5 text-3xl font-bold text-red-700">⚠ Weaknesses</h2>
                                <div className="whitespace-pre-wrap leading-8 text-gray-700">
                                    {getSection("Weaknesses")}
                                </div>
                            </div>

                            {/* MISSING KEYWORDS */}
                            <div className="rounded-3xl border border-yellow-200 bg-yellow-50 p-8">
                                <h2 className="mb-5 text-3xl font-bold text-yellow-700">🔍 Missing Keywords</h2>
                                <div className="whitespace-pre-wrap leading-8 text-gray-700">
                                    {getSection("Missing Keywords")}
                                </div>
                            </div>

                            {/* FORMATTING ISSUES */}
                            <div className="rounded-3xl border border-orange-200 bg-orange-50 p-8">
                                <h2 className="mb-5 text-3xl font-bold text-orange-700">📝 Formatting Issues</h2>
                                <div className="whitespace-pre-wrap leading-8 text-gray-700">
                                    {getSection("Formatting Issues")}
                                </div>
                            </div>

                            {/* RECOMMENDATIONS */}
                            <div className="rounded-3xl border border-purple-200 bg-purple-50 p-8">
                                <h2 className="mb-5 text-3xl font-bold text-purple-700">💡 Recommendations</h2>
                                <div className="whitespace-pre-wrap leading-8 text-gray-700">
                                    {getSection("Recommendations")}
                                </div>
                            </div>

                            {/* FINAL VERDICT */}
                            <div className="rounded-3xl border border-indigo-200 bg-indigo-50 p-8">
                                <h2 className="mb-5 text-3xl font-bold text-indigo-700">🏆 Final Verdict</h2>
                                <div className="whitespace-pre-wrap leading-8 text-gray-700">
                                    {getSection("Final Verdict")}
                                </div>
                            </div>

                            {/* Error / success feedback for the download action */}
                            {error && (
                                <div className="rounded-xl bg-red-100 p-4 text-center font-medium text-red-600">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="rounded-xl bg-green-100 p-4 text-center font-medium text-green-700">
                                    {success}
                                </div>
                            )}

                            {/* ACTION BUTTONS */}
                            <div className="mt-10 flex flex-wrap justify-center gap-5">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="rounded-xl bg-indigo-600 px-8 py-4 text-lg font-semibold text-white transition hover:bg-indigo-700"
                                >
                                    Analyze Another Resume
                                </button>

                                <button
                                    type="button"
                                    onClick={handleDownloadReport}
                                    disabled={isDownloading}
                                    className="rounded-xl bg-green-600 px-8 py-4 text-lg font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
                                >
                                    {isDownloading ? "Preparing Report..." : "📥 Download PDF Report"}
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* ===============================
                            UPLOAD FORM
                        =============================== */
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Company */}
                            <div>
                                <label className="mb-2 block font-semibold">Company Name</label>
                                <input
                                    type="text"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    placeholder="Google"
                                    className="w-full rounded-xl border border-gray-300 p-4 focus:border-indigo-500 focus:outline-none"
                                />
                            </div>

                            {/* Job Title */}
                            <div>
                                <label className="mb-2 block font-semibold">Job Title</label>
                                <input
                                    type="text"
                                    value={jobTitle}
                                    onChange={(e) => setJobTitle(e.target.value)}
                                    placeholder="Frontend Developer"
                                    className="w-full rounded-xl border border-gray-300 p-4 focus:border-indigo-500 focus:outline-none"
                                />
                            </div>

                            {/* Job Description */}
                            <div>
                                <label className="mb-2 block font-semibold">Job Description</label>
                                <textarea
                                    rows={7}
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    placeholder="Paste complete job description..."
                                    className="w-full resize-none rounded-xl border border-gray-300 p-4 focus:border-indigo-500 focus:outline-none"
                                />
                            </div>

                            {/* Resume Upload */}
                            <div>
                                <label className="mb-2 block font-semibold">Upload Resume</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="rounded-xl bg-red-100 p-4 text-center font-medium text-red-600">
                                    {error}
                                </div>
                            )}

                            {/* Success */}
                            {success && (
                                <div className="rounded-xl bg-green-100 p-4 text-center font-medium text-green-700">
                                    {success}
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isProcessing}
                                className="w-full rounded-xl bg-indigo-600 py-4 text-lg font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
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
