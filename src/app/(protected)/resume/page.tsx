"use client";

import { useState } from "react";
import { Card, Button, Input } from "@/components/ui";
import { 
  FileText, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  BarChart3,
  X,
  Plus
} from "lucide-react";

export default function ResumeRanker() {
  const [resumeText, setResumeText] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [ranking, setRanking] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const calculateRank = () => {
    setLoading(true);
    // Simulated AI processing delay
    setTimeout(() => {
      const keywords = jobDesc.toLowerCase().split(/\W+/).filter(w => w.length > 4);
      const resumeLower = resumeText.toLowerCase();
      
      const matched = keywords.filter(w => resumeLower.includes(w));
      const missing = keywords.filter(w => !resumeLower.includes(w));
      
      const score = Math.round((matched.length / keywords.length) * 100) || 0;
      
      setRanking({
        score,
        matched: Array.from(new Set(matched)).slice(0, 10),
        missing: Array.from(new Set(missing)).slice(0, 10),
        feedback: score > 70 ? "Excellent match! Your resume is well-optimized." : 
                  score > 40 ? "Good start, but consider adding more industry-specific keywords." :
                  "Lower match. Try tailoring your experience more closely to the JD."
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Resume Ranker</h1>
        <p className="text-text-secondary">Optimize your resume using AI-simulated keyword matching.</p>
      </div>

      {!ranking ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-8 space-y-6">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest flex items-center gap-2">
              <FileText size={18} className="text-accent-primary" /> Paste Your Resume
            </h3>
            <textarea 
              className="w-full bg-bg-primary border border-text-secondary/10 rounded-2xl p-6 font-mono text-xs text-text-primary placeholder:text-text-secondary/20 focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary transition-all min-h-[400px] resize-none custom-scrollbar"
              placeholder="Paste the text from your resume here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            />
          </Card>

          <Card className="p-8 space-y-6">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest flex items-center gap-2">
              <Search size={18} className="text-accent-secondary" /> Job Description
            </h3>
            <textarea 
              className="w-full bg-bg-primary border border-text-secondary/10 rounded-2xl p-6 font-mono text-xs text-text-primary placeholder:text-text-secondary/20 focus:outline-none focus:ring-2 focus:ring-accent-secondary/20 focus:border-accent-secondary transition-all min-h-[400px] resize-none custom-scrollbar"
              placeholder="Paste the job description you are targeting..."
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
            />
          </Card>

          <div className="lg:col-span-2 flex justify-center">
            <Button 
                onClick={calculateRank} 
                className="px-12 py-8 rounded-2xl text-lg font-bold shadow-2xl shadow-accent-primary/20 group"
                disabled={!resumeText || !jobDesc || loading}
                isLoading={loading}
            >
              Analyze Resume & Rank
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <Card className="p-10 flex flex-col items-center text-center space-y-6 bg-accent-primary/5">
            <div className="relative w-40 h-40">
                <svg className="w-full h-full -rotate-90">
                    <circle className="text-bg-surface stroke-current" strokeWidth="10" fill="transparent" r="70" cx="80" cy="80" />
                    <circle className="text-accent-primary stroke-current transition-all duration-1000" strokeWidth="10" strokeDasharray={2 * Math.PI * 70} strokeDashoffset={2 * Math.PI * 70 * (1 - ranking.score / 100)} strokeLinecap="round" fill="transparent" r="70" cx="80" cy="80" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-extrabold text-4xl text-text-primary">
                    {ranking.score}%
                </div>
            </div>
            <div className="space-y-2">
                <h2 className="text-xl font-bold text-text-primary">Match Score</h2>
                <p className="text-sm text-text-secondary font-medium leading-relaxed">{ranking.feedback}</p>
            </div>
            <Button variant="secondary" className="w-full" onClick={() => setRanking(null)}>
                Start New Analysis
            </Button>
          </Card>

          <div className="lg:col-span-2 space-y-8">
            <Card className="p-8 space-y-6">
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-accent-secondary" /> Keywords Found
                </h3>
                <div className="flex flex-wrap gap-2">
                    {ranking.matched.map((word: string, i: number) => (
                        <span key={i} className="px-3 py-1.5 rounded-xl bg-accent-secondary/10 border border-accent-secondary/20 text-xs font-bold text-accent-secondary capitalize">
                            {word}
                        </span>
                    ))}
                    {ranking.matched.length === 0 && <p className="text-text-secondary text-sm">No significant keyword matches found.</p>}
                </div>
            </Card>

            <Card className="p-8 space-y-6">
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest flex items-center gap-2">
                    <AlertCircle size={18} className="text-alert-error" /> Suggestions (Missing)
                </h3>
                <div className="flex flex-wrap gap-2">
                    {ranking.missing.map((word: string, i: number) => (
                        <span key={i} className="px-3 py-1.5 rounded-xl bg-alert-error/5 border border-alert-error/20 text-xs font-bold text-alert-error capitalize italic">
                            + {word}
                        </span>
                    ))}
                     {ranking.missing.length === 0 && <p className="text-text-secondary text-sm">You have matched all critical keywords!</p>}
                </div>
            </Card>

            <Card className="p-8 bg-bg-surface/50 border-dashed">
                <h4 className="text-xs font-extrabold text-text-primary uppercase tracking-[0.2em] mb-4">Pro Optimization Tip</h4>
                <p className="text-xs text-text-secondary leading-relaxed font-medium capitalize">
                    Focus on integrating the "Missing" keywords naturally into your experience bullets rather than just listing them in a skills section. AI parsers prioritize context over frequency.
                </p>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
