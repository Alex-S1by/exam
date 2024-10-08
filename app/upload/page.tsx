"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

import pdfToText from "react-pdftotext";

interface ExtractedText {
    index: number;
  text: string | null; // or any other appropriate type for your text
}

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
 

  const router = useRouter();

//   function extractText(files: File[]) {
//     files.forEach(async (file,index) => {
//       pdfToText(file)
//         .then((text) =>  extractedTexts.push({ index, text }))
//         .catch((error) => {
//           console.log("Failed to extract text from pdf", error);
//           extractedTexts.push({index, text: null });
//         });
//     });
//   }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const uniqueNewFiles = newFiles.filter(
        (newFile) =>
          !files.some(
            (existingFile) =>
              existingFile.name === newFile.name &&
              existingFile.size === newFile.size
          )
      );
      if (uniqueNewFiles.length < newFiles.length) {
      }
      setFiles((prevFiles) => [...prevFiles, ...uniqueNewFiles]);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) return;

    setUploading(true);

    try {
        let extractedTexts: ExtractedText[] = [];

        const promises = files.map((file, index) => {
            return pdfToText(file).then((text) => ({ index, text })).catch((error) => {
              console.log("Failed to extract text from pdf", error);
              return { index, text: null };
            });
          });
          extractedTexts = await Promise.all(promises);
     
          
      

      const response = await fetch("/api/analyse", {
        method: "POST",
        body: JSON.stringify(extractedTexts),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        try {
          const result = await response.json();
        
          
          // Store the result in local storage
          sessionStorage.setItem("analysisResults", JSON.stringify(result));
          // Navigate to the results page
          router.push("/results");
        } catch (error) {
          console.error("Failed to parse JSON response", error);
        }
      } else {
        console.error("Failed to fetch results");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-amber-50 to-white text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Upload Question Papers
      </h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="mb-4">
          <Label htmlFor="file" className="text-gray-700">
            Select PDF files
          </Label>
          <Input
            id="file"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            disabled={uploading}
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            multiple
            ref={fileInputRef}
          />
        </div>
        {files.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2 text-gray-700">
              Selected Files:
            </h2>
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-gray-100 p-2 rounded"
                >
                  <span className="text-sm text-gray-600 truncate">
                    {file.name}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <Button
          type="submit"
          disabled={files.length === 0 || uploading}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold "
        >
          {uploading ? "Uploading..." : "Upload and Analyze"}
        </Button>
      </form>
    </div>
  );
}
