"use client";

import { useState } from "react";
import { Card, Button, Input } from "@/components/ui";
import { 
  Type, 
  MessageSquare, 
  PieChart, 
  Zap, 
  Smile, 
  Frown, 
  Meh, 
  Tag,
  BarChart2
} from "lucide-react";

export default function TextClassifier() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const classifyText = () => {
    setLoading(true);
    setTimeout(() => {
      const textLower = text.toLowerCase();
      
      // Mock Sentiment Analysis
      const positiveWords = ["happy", "great", "excellent", "love", "good", "best", "awesome"];
      const negativeWords = ["sad", "bad", "terrible", "hate", "worst", "awful", "horrible"];
      
      const posCount = positiveWords.filter(w => textLower.includes(w)).length;
      const negCount = negativeWords.filter(w => textLower.includes(w)).length;
      
      let sentiment = "Neutral";
      let score = 50;
      let Icon = Meh;
      let color = "text-text-secondary";

      if (posCount > negCount) {
        sentiment = "Positive";
        score = 75 + (posCount * 5);
        Icon = Smile;
        color = "text-green-400";
      } else if (negCount > posCount) {
        sentiment = "Negative";
        score = 25 - (negCount * 5);
        Icon = Frown;
        color = "text-red-400";
      }

      // Mock Category Analysis
      let category = "General";
      if (textLower.includes("price") || textLower.includes("money") || textLower.includes("cost")) category = "Finance";
      else if (textLower.includes("tech") || textLower.includes("code") || textLower.includes("software")) category = "Technology";
      else if (textLower.includes("study") || textLower.includes("learn") || textLower.includes("math")) category = "Education";
      else if (textLower.includes("work") || textLower.includes("job") || textLower.includes("career")) category = "Professional";

      setResult({
        sentiment,
        score: Math.min(Math.max(score, 0), 100),
        Icon,
        color,
        category,
        wordCount: text.split(/\s+/).length,
        readingTime: Math.ceil(text.split(/\s+/).length / 200)
      });
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Text Classifier</h1>
        <p className="text-text-secondary">Simulate advanced NLP analysis for sentiment and categorization.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        <Card className="xl:col-span-2 p-8 space-y-6">
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest flex items-center gap-2">
            <MessageSquare size={18} className="text-accent-primary" /> Input Text
          </h3>
          <textarea 
            className="w-full bg-bg-primary border border-text-secondary/10 rounded-2xl p-6 font-mono text-sm text-text-primary placeholder:text-text-secondary/20 focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary transition-all min-h-[450px] resize-none custom-scrollbar"
            placeholder="Type or paste your text here for analysis..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex justify-end">
            <Button 
                onClick={classifyText} 
                className="px-10 py-6 rounded-xl shadow-xl shadow-accent-primary/20"
                disabled={!text || loading}
                isLoading={loading}
            >
              Analyze Text
            </Button>
          </div>
        </Card>

        <div className="space-y-8">
          {result ? (
            <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
              <Card className="p-8 space-y-6 bg-accent-primary/5">
                <h3 className="text-xs font-bold text-text-secondary uppercase tracking-[0.2em]">Analysis Results</h3>
                
                <div className="flex items-center gap-6">
                    <div className={`p-4 rounded-2xl bg-bg-surface border border-text-secondary/10 ${result.color}`}>
                        <result.Icon size={32} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Sentiment</p>
                        <h4 className={`text-2xl font-bold ${result.color}`}>{result.sentiment}</h4>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-text-secondary uppercase tracking-tighter">
                        <span>Neg</span>
                        <span>{result.score}% Pos</span>
                        <span>Pos</span>
                    </div>
                    <div className="w-full h-2 bg-bg-surface rounded-full overflow-hidden border border-text-secondary/5">
                        <div 
                            className={`h-full transition-all duration-1000 ${result.color.replace('text-', 'bg-')}`}
                            style={{ width: `${result.score}%` }}
                        />
                    </div>
                </div>

                <div className="pt-4 grid grid-cols-2 gap-4 border-t border-text-secondary/10">
                    <div>
                        <p className="text-[10px] font-extrabold text-text-secondary uppercase tracking-widest">Category</p>
                        <div className="flex items-center gap-2 mt-2">
                            <Tag size={12} className="text-accent-secondary" />
                            <span className="text-sm font-bold text-text-primary">{result.category}</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-extrabold text-text-secondary uppercase tracking-widest">Time</p>
                        <div className="flex items-center gap-2 mt-2">
                            <Zap size={12} className="text-yellow-400" />
                            <span className="text-sm font-bold text-text-primary">~{result.readingTime}m Read</span>
                        </div>
                    </div>
                </div>
              </Card>

              <Card className="p-8 space-y-4 border-dashed">
                <h4 className="text-[10px] font-extrabold text-text-primary uppercase tracking-[0.1em]">NLP Insights</h4>
                <p className="text-xs text-text-secondary leading-relaxed font-medium">
                  The model detected a <span className={result.color}>{result.sentiment.toLowerCase()}</span> tone with strong associations to <span className="text-accent-secondary">{result.category}</span> topics. Word density is optimal for readability.
                </p>
              </Card>
            </div>
          ) : (
            <Card className="p-10 flex flex-col items-center text-center space-y-6 border-dashed opacity-50">
                <BarChart2 size={40} className="text-text-secondary animate-pulse" />
                <div className="space-y-2">
                    <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest">Ready for analysis</h3>
                    <p className="text-xs text-text-secondary">Input text on the left to see sentiment and category classification.</p>
                </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
