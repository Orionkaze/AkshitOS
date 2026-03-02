"use client";

import { useState, useEffect } from "react";
import { Card, Button, Input } from "@/components/ui";
import { Save, X, Plus, Terminal } from "lucide-react";

export default function SnippetForm({ 
  snippet, 
  onSave, 
  onCancel 
}: { 
  snippet?: any, 
  onSave: () => void, 
  onCancel: () => void 
}) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(snippet?.title || "");
  const [code, setCode] = useState(snippet?.code || "");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(snippet?.tags || []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const method = snippet ? "PATCH" : "POST";
    const url = snippet ? `/api/snippets/${snippet.id}` : "/api/snippets";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, code, tags }),
      });

      if (res.ok) {
        onSave();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  return (
    <Card className="p-8 space-y-8 animate-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between border-b border-text-secondary/5 pb-4">
        <h3 className="text-lg font-bold text-text-primary uppercase tracking-widest flex items-center gap-2">
          <Terminal size={18} className="text-accent-primary" />
          {snippet ? "Edit Snippet" : "Create New Snippet"}
        </h3>
        <button onClick={onCancel} className="p-2 rounded-lg hover:bg-bg-primary text-text-secondary">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input 
          label="Title" 
          placeholder="e.g. Next.js API Route Template" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] block pl-1">Code</label>
          <textarea 
            className="w-full bg-bg-primary border border-text-secondary/10 rounded-2xl p-6 font-mono text-sm text-cyan-400 placeholder:text-text-secondary/20 focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary transition-all min-h-[300px] resize-none custom-scrollbar"
            placeholder="Paste your code snippet here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input 
              label="Tags" 
              placeholder="e.g. React, Tailwind" 
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
            />
            <Button type="button" variant="secondary" className="mt-[22px] px-6" onClick={addTag}>
              <Plus size={18} />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-bg-surface border border-text-secondary/5 text-xs font-bold text-text-primary">
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="text-text-secondary hover:text-alert-error">
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button variant="secondary" className="flex-1 py-6" onClick={onCancel} type="button">
            Cancel
          </Button>
          <Button className="flex-1 py-6 shadow-2xl shadow-accent-primary/20" type="submit" isLoading={loading}>
            <Save size={18} className="mr-2" />
            {snippet ? "Save Changes" : "Save Snippet"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
