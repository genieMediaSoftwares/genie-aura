import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  FileText,
  Tag,
  Building2,
  Calendar,
  CheckCircle,
  Copy,
  Check,
  Filter,
} from 'lucide-react';
import { KnowledgeDocument, Client } from '../types/index.js';

interface KnowledgeViewProps {
  documents: KnowledgeDocument[];
  clients: Client[];
  onOpenUploadModal: () => void;
}

export const KnowledgeView: React.FC<KnowledgeViewProps> = ({
  documents,
  clients,
  onOpenUploadModal,
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [selectedDoc, setSelectedDoc] = useState<KnowledgeDocument | null>(documents[0] || null);
  const [copied, setCopied] = useState(false);

  const categories = ['ALL', 'Brand Guidelines', 'Menu & Story', 'SOPs', 'Clinical Protocols', 'Real Estate Portfolio'];

  const filteredDocs = documents.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.extractedText.toLowerCase().includes(search.toLowerCase()) ||
      d.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = categoryFilter === 'ALL' || d.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#1A1423]/5 shadow-sm">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search knowledge base & client dossiers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#1A1423]/10 bg-[#FDFCF9] focus:outline-hidden focus:border-[#8B5CF6]"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs border border-[#1A1423]/10 bg-[#FDFCF9] rounded-xl px-3 py-2 font-medium text-[#1A1423] shrink-0"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'ALL' ? 'All Categories' : c}
              </option>
            ))}
          </select>
        </div>

        <button
          id="btn-upload-knowledge-doc"
          onClick={onOpenUploadModal}
          className="flex items-center gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md shadow-purple-200 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Split layout: Document list (5 cols), Document Reader (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List */}
        <div className="lg:col-span-5 space-y-3">
          {filteredDocs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#1A1423]/5 p-8 text-center text-gray-400 text-xs">
              No documents match your query.
            </div>
          ) : (
            filteredDocs.map((doc) => {
              const isSelected = selectedDoc?.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer bg-white ${
                    isSelected
                      ? 'border-[#8B5CF6] ring-2 ring-[#8B5CF6]/20 shadow-md'
                      : 'border-[#1A1423]/5 hover:border-gray-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-[#8B5CF6] uppercase tracking-wider">
                      {doc.category}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Indexed
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-[#1A1423] line-clamp-1">{doc.title}</h4>
                  <p className="text-[11px] text-gray-500 line-clamp-2 mt-1 leading-relaxed">
                    {doc.extractedText}
                  </p>

                  <div className="mt-3.5 pt-2.5 border-t border-[#1A1423]/5 flex items-center justify-between text-[10px] text-gray-400">
                    <span className="text-gray-600 font-medium truncate max-w-[150px]">
                      {doc.clientName || 'Agency Global'}
                    </span>
                    <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Reader */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#1A1423]/5 p-7 shadow-sm sticky top-20">
          {selectedDoc ? (
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-[#1A1423]/5">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-[#8B5CF6] uppercase tracking-wider">
                    {selectedDoc.category}
                  </span>
                  <h3 className="text-lg font-serif font-semibold text-[#1A1423] mt-1.5">
                    {selectedDoc.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-gray-400" />
                      {selectedDoc.clientName || 'Agency Global Knowledge'}
                    </span>
                    <span>&bull;</span>
                    <span>Uploaded by {selectedDoc.uploadedBy}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleCopyText(selectedDoc.extractedText)}
                  className="flex items-center gap-1.5 text-xs bg-[#FDFCF9] hover:bg-purple-50/50 text-[#1A1423] px-3.5 py-1.5 rounded-xl border border-[#1A1423]/10 transition-colors shrink-0 font-medium"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-gray-400" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {selectedDoc.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] bg-[#FDFCF9] text-gray-600 px-2.5 py-0.5 rounded-full border border-[#1A1423]/5 font-medium"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              {/* Extracted Content Body */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Indexed Content & AI Grounding Context:
                </label>
                <div className="p-4 rounded-2xl bg-[#FDFCF9] border border-[#1A1423]/5 text-xs leading-relaxed text-gray-800 font-mono whitespace-pre-wrap max-h-96 overflow-y-auto">
                  {selectedDoc.extractedText}
                </div>
              </div>

              <div className="p-3.5 bg-purple-50/50 rounded-xl border border-purple-100 text-xs text-purple-900 flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                <span>
                  All 6 AI Department Agents automatically retrieve this document when formulating copy, reels, or campaigns for this client.
                </span>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-gray-400 text-xs">
              Select a knowledge document to read its indexed content.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
