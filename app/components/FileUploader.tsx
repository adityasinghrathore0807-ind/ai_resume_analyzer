import React, { useRef, useState } from "react";
import PdfIcon from "/icons/pdf.svg";
interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
}

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect }) => {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState("");
    const [dragActive, setDragActive] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    // ==========================
    // Validate Selected File
    // ==========================
    const validateFile = (selectedFile: File | null) => {
        setError("");

        if (!selectedFile) return;

        if (selectedFile.type !== "application/pdf") {
            setError("Only PDF files are allowed.");
            setFile(null);
            onFileSelect?.(null);
            return;
        }

        if (selectedFile.size > MAX_FILE_SIZE) {
            setError("File size must be less than 20MB.");
            setFile(null);
            onFileSelect?.(null);
            return;
        }

        setFile(selectedFile);
        onFileSelect?.(selectedFile);
    };

    // ==========================
    // Input Selection
    // ==========================
    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const selectedFile = event.target.files?.[0] ?? null;
        validateFile(selectedFile);
    };

    // ==========================
    // Drag Events
    // ==========================
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();

        setDragActive(false);

        const droppedFile = e.dataTransfer.files?.[0] ?? null;

        validateFile(droppedFile);
    };

    // ==========================
    // Remove File
    // ==========================
    const removeFile = () => {
        setFile(null);
        setError("");

        if (inputRef.current) {
            inputRef.current.value = "";
        }

        onFileSelect?.(null);
    };

    return (
        <div className="space-y-5">
            {/* Upload Area */}
            <div
                onClick={() => inputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300
                ${dragActive
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-gray-300 bg-white hover:border-indigo-500 hover:bg-indigo-50"
                    }`}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                />

                <img
                    src="/icons/info.svg"
                    alt="Upload"
                    className="mx-auto h-16 w-16"
                />

                {file ? (
                    <>
                        <h3 className="mt-5 text-xl font-semibold text-green-600">
                            Resume Selected
                        </h3>

                        <p className="mt-2 font-medium text-gray-700">
                            {file.name}
                        </p>

                        <p className="text-sm text-gray-500">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>

                        <p className="mt-2 text-sm text-green-500">
                            Ready for analysis
                        </p>
                    </>
                ) : (
                    <>
                        <h3 className="mt-5 text-xl font-semibold text-gray-800">
                            Upload Your Resume
                        </h3>

                        <p className="mt-2 text-gray-500">
                            Click or Drag & Drop your PDF here
                        </p>

                        <p className="mt-1 text-sm text-gray-400">
                            PDF only • Maximum 20 MB
                        </p>
                    </>
                )}
            </div>

            {/* Error */}
            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
                    {error}
                </div>
            )}

            {/* Selected File */}
            {file && (
                <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 p-4 shadow">
                    <div className="flex items-center gap-3">
                        <img
                            src="/icons/pdf.svg"
                            alt="PDF"
                            className="h-10 w-10"
                        />
                        

                        <div>
                            <p className="font-semibold">{file.name}</p>

                            <p className="text-sm text-gray-500">
                                {(file.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={removeFile}
                        className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                    >
                        Remove
                    </button>
                </div>
            )}
        </div>
    );
};

export default FileUploader;
