// src/app/(pages)/app/vision/analyzer/page.jsx
"use client";

import Image from "next/image";
import { useImage } from "@/context/image";

export default function AnalyzerPage() {
  const { imageUrl } = useImage();

  return (
    <main>
      <h1 className="text-2xl font-bold mb-4">Analyzer</h1>
      {imageUrl ? (
        <div className="max-w-md mx-auto">
          <Image
            src={imageUrl}
            width={400}
            height={400}
            alt="Selected food for analysis"
            className="rounded-lg object-contain"
          />
        </div>
      ) : (
        <p className="text-center text-gray-500">No image selected yet.</p>
      )}
    </main>
  );
}
