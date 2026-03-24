// src/app/page.tsx
"use client";

import React, { useState } from 'react';
import FileUploader from '../components/FileUploader';
import { analyzeArchitecture } from '../lib/apiClient';
import { ArchitectureCritique } from '../types/critique';
import { Loader2 } from 'lucide-react';
import CritiqueCard from '../components/CritiqueCard';

export default function Home() {
    const [description, setDescription] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<ArchitectureCritique | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!description.trim() && !selectedFile) {
            setError("Please provide either a text description or upload a diagram.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await analyzeArchitecture(description, selectedFile || undefined);
            setResult(data);
        } catch (err: any) {
            setError(err.message || "Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="max-w-7xl mx-auto p-4 md:p-8">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
                    AI Architecture Reviewer
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Upload your system design diagram or describe your architecture. Get instant, expert critiques on bottlenecks, scalability, and cost.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Inputs */}
                <div className="lg:col-span-5 space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Upload Architecture Diagram (UML)
                        </label>
                        <FileUploader
                            selectedFile={selectedFile}
                            onFileSelect={setSelectedFile}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            System Description (Optional)
                        </label>
                        <textarea
                            className="w-full h-32 p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                            placeholder="e.g., A Next.js frontend talking to a FastAPI backend, using PostgreSQL for user data and Redis for caching..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleAnalyze}
                        disabled={isLoading}
                        className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-colors flex items-center justify-center disabled:opacity-70"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Analyzing Design...
                            </>
                        ) : (
                            'Analyze Architecture'
                        )}
                    </button>
                </div>

                {/* Right Column: Results Placeholder */}
                <div className="lg:col-span-7 bg-slate-100 p-6 rounded-2xl border border-slate-200 min-h-[500px] flex flex-col">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Analysis Results</h2>

                    {!result && !isLoading && (
                        <div className="flex-1 flex items-center justify-center text-slate-400 text-center">
                            Submit a design to see the AI critique here.
                        </div>
                    )}

                    {isLoading && (
                        <div className="flex-1 flex flex-col items-center justify-center text-blue-600 space-y-4">
                            <Loader2 className="w-10 h-10 animate-spin" />
                            <p className="animate-pulse font-medium">Consulting best practices...</p>
                        </div>
                    )}

                    {result && (
                        <div className="flex-1 h-full max-h-[800px]">
                            <CritiqueCard critique={result} />
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}