"use client";

import '../../polyfills'
import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const UploadPage = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    interface ExtractedText {
        index: number;
        text: string | null;
    }

    const extractTextFromPDF = async (file: File, index: number): Promise<ExtractedText> => {
        const textContent: string[] = [];
        try {
            const pdf = await pdfjs.getDocument(URL.createObjectURL(file)).promise;
            const numPages = pdf.numPages;

            for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const content = await page.getTextContent();
                const pageText = content.items.map((item) => {
                    if ('str' in item) {
                      return item.str;
                    } else {
                      return ''; // or some other default value
                    }
                  }).join(' ');
                textContent.push(pageText);
            }

            return { index, text: textContent.join('\n') };
        } catch (error) {
            console.error("Error extracting text:", error);
            return { index, text: null };
        }
    };

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            
            // Check if all files are PDFs
            const nonPdfFiles = newFiles.filter(file => file.type !== 'application/pdf');
            if (nonPdfFiles.length > 0) {
                setFileError("Please upload PDF files only.");
                return;
            }

            // Check for repeated files
            const repeatedFiles = newFiles.filter(
                (newFile) => files.some(
                    (existingFile) => existingFile.name === newFile.name && existingFile.size === newFile.size
                )
            );

            if (repeatedFiles.length > 0) {
                setFileError("Some files have already been selected.");
                return;
            }

            setFiles((prevFiles) => [...prevFiles, ...newFiles]);
            setError(null);
            setFileError(null);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }, [files]);

    const handleRemoveFile = useCallback((index: number) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (files.length === 0) return;

        setUploading(true);
        setError(null);

        try {
            const extractedTexts: ExtractedText[] = await Promise.all(
                files.map((file, index) => extractTextFromPDF(file, index))
            );

            
            sessionStorage.setItem("extractedtext", JSON.stringify(extractedTexts));
            const response = await fetch("/api/analyse", {
                method: "POST",
                body: JSON.stringify(extractedTexts),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const result = await response.json();
                sessionStorage.setItem("analysisResults", JSON.stringify(result));
                router.push("/results");
                console.log(result);
                
            } else {
                throw new Error("Failed to fetch results");
            }
        } catch (error) {
            console.error("Error:", error);
            setError("An error occurred during upload or analysis. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-amber-50 to-white text-gray-800 px-4 sm:px-6 md:px-8 py-8 sm:py-12">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800 text-center">Upload Question Papers</h1>
            <form onSubmit={handleSubmit} className="w-full max-w-md">
                <div className="mb-4 sm:mb-6">
                    <Label htmlFor="file" className="text-gray-700 block mb-2 sm:mb-3">Select PDF files</Label>
                    <Input
                        id="file"
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        disabled={uploading}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full"
                        multiple
                        ref={fileInputRef}
                    />
                </div>
                {fileError && <p className="text-red-500 mb-4 sm:mb-6 text-sm">{fileError}</p>}
                {files.length > 0 && (
                    <div className="mb-4 sm:mb-6">
                        <h2 className="text-lg font-semibold mb-2 sm:mb-3 text-gray-700">Selected Files:</h2>
                        <ul className="space-y-2 max-h-40 sm:max-h-48 overflow-y-auto">
                            {files.map((file, index) => (
                                <li key={index} className="flex items-center justify-between bg-gray-100 p-2 sm:p-3 rounded">
                                    <span className="text-sm text-gray-600 truncate flex-1 mr-2">{file.name}</span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveFile(index)}
                                        className="text-red-500 hover:text-red-700 flex-shrink-0"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {error && <p className="text-red-500 mb-4 sm:mb-6 text-sm">{error}</p>}
                <Button
                    type="submit"
                    disabled={files.length === 0 || uploading}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 sm:py-3 sm:px-6 rounded"
                >
                    {uploading ? "Uploading..." : "Upload and Analyze"}
                </Button>
            </form>
        </div>
    );
};

export default UploadPage;
