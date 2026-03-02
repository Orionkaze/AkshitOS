"use client";

import { Card, Button } from "@/components/ui";
import { Copy, Trash2, Edit2, Tag } from "lucide-react";
import { useState } from "react";

export default function SnippetCard({ 
  snippet, 
  onDelete, 
  onEdit 
}: { 
  snippet: any, 
  onDelete: (id: string) => void,
  onEdit: (snippet: any) => void
}) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tags = Array.isArray(snippet.tags) ? snippet.tags : [];

  return (
    <Card className="group flex flex-col h-full hover:border-accent-primary/50 transition-all duration-300">
      <div className="p-5 flex-1 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-text-primary group-hover:text-accent-primary transition-colors">{snippet.title}</h3>
            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
              {new Date(snippet.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onEdit(snippet)} className="p-1.5 rounded-lg hover:bg-bg-primary text-text-secondary hover:text-accent-primary">
              <Edit2 size={14} />
            </button>
            <button onClick={() => onDelete(snippet.id)} className="p-1.5 rounded-lg hover:bg-alert-error/10 text-text-secondary hover:text-alert-error">
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        <div className="relative group/code">
          <pre className="p-4 rounded-xl bg-bg-primary border border-text-secondary/5 text-xs font-mono text-cyan-400 overflow-x-auto max-h-40 custom-scrollbar">
            <code>{snippet.code}</code>
          </pre>
          <button 
            onClick={copyToClipboard}
            className="absolute top-2 right-2 p-2 rounded-lg bg-bg-surface/80 border border-text-secondary/10 text-text-secondary hover:text-accent-primary backdrop-blur-sm opacity-0 group-hover/code:opacity-100 transition-all"
          >
            <Copy size={14} className={copied ? "text-green-400" : ""} />
          </button>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {tags.map((tag: string, i: number) => (
              <div key={i} className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-accent-primary/5 border border-accent-primary/10 text-[9px] font-bold text-accent-primary uppercase tracking-widest">
                <Tag size={10} /> {tag}
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
