"use client";

import { useEffect, useState } from "react";
import SnippetCard from "@/components/snippets/SnippetCard";
import SnippetForm from "@/components/snippets/SnippetForm";
import { Button, Card, Input } from "@/components/ui";
import { 
  Plus, 
  Search, 
  Code2, 
  Terminal, 
  Filter, 
  Columns2,
  List,
  Loader2 
} from "lucide-react";

export default function SnippetVaultPage() {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  const fetchSnippets = async (query = "") => {
    try {
      const res = await fetch(`/api/snippets?q=${query}`);
      if (res.ok) {
        const data = await res.json();
        setSnippets(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSnippets(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this snippet?")) return;
    try {
      const res = await fetch(`/api/snippets/${id}`, { method: "DELETE" });
      if (res.ok) fetchSnippets(search);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (snippet: any) => {
    setEditingSnippet(snippet);
    setShowForm(true);
  };

  const handleSave = () => {
    setShowForm(false);
    setEditingSnippet(null);
    fetchSnippets(search);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Snippet Vault</h1>
          <p className="text-text-secondary">Your high-performance private code repository.</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="w-full md:w-auto px-8 py-6 rounded-2xl shadow-xl shadow-accent-primary/20">
          <Plus size={20} className="mr-2" />
          Add Snippet
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search snippets or code..." 
            className="w-full bg-bg-surface border border-text-secondary/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary transition-all shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 bg-bg-surface p-1 rounded-xl border border-text-secondary/5">
          <button 
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-bg-primary text-accent-primary shadow-sm" : "text-text-secondary hover:text-text-primary"}`}
          >
            <Columns2 size={18} />
          </button>
          <button 
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-bg-primary text-accent-primary shadow-sm" : "text-text-secondary hover:text-text-primary"}`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {showForm ? (
        <SnippetForm 
          snippet={editingSnippet} 
          onSave={handleSave} 
          onCancel={() => { setShowForm(false); setEditingSnippet(null); }} 
        />
      ) : (
        <>
          {loading ? (
            <div className="h-[40vh] flex items-center justify-center">
              <Loader2 className="animate-spin text-accent-primary" size={40} />
            </div>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
              {snippets.length > 0 ? (
                snippets.map((snippet) => (
                  <SnippetCard 
                    key={snippet.id} 
                    snippet={snippet} 
                    onDelete={handleDelete} 
                    onEdit={handleEdit}
                  />
                ))
              ) : (
                <Card className="col-span-full py-20 text-center border-dashed">
                  <div className="p-5 rounded-full bg-bg-primary border border-text-secondary/5 inline-block mx-auto mb-4">
                     <Code2 size={32} className="text-text-secondary opacity-40" />
                  </div>
                  <h3 className="text-lg font-bold text-text-primary">No snippets found</h3>
                  <p className="text-sm text-text-secondary max-w-xs mx-auto mt-2">
                    {search ? `No results for "${search}". Try another query.` : "Start collecting your best code snippets today."}
                  </p>
                </Card>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
