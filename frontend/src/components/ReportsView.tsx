import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  TrendingUp,
  Sparkles,
  IndianRupee,
  FileText,
  Calendar,
  Building2,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { Report, Client } from '../types/index.js';
import { api } from '../api/client.js';

interface ReportsViewProps {
  reports: Report[];
  clients: Client[];
  onOpenGenerateModal: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  reports,
  clients,
  onOpenGenerateModal,
}) => {
  const [selectedReport, setSelectedReport] = useState<Report | null>(reports[0] || null);

  const kpis = [
    { label: 'Average Agency ROAS', value: '4.2x', change: '+24% vs Q2 benchmark', color: 'text-purple-600' },
    { label: 'Total Regional Reach', value: '1.24M', change: 'Visakhapatnam & AP', color: 'text-indigo-600' },
    { label: 'Monthly Ad Spend Managed', value: '₹1,85,000', change: 'Meta & Google Ads', color: 'text-emerald-600' },
    { label: 'Client Conversions', value: '208', change: 'Avg CPA ₹890', color: 'text-blue-600' },
  ];

  const handleDownloadCsv = (reportId: string) => {
    const url = api.reports.getExportUrl(reportId);
    window.location.href = url;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((k, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 border border-[#1A1423]/5 shadow-sm">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-1">{k.label}</span>
            <div className={`text-2xl sm:text-3xl font-serif font-semibold ${k.color}`}>{k.value}</div>
            <p className="mt-1.5 text-xs text-gray-400 font-medium">{k.change}</p>
          </div>
        ))}
      </div>

      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#1A1423]/5 shadow-sm">
        <div>
          <h3 className="text-base font-serif font-semibold text-[#1A1423]">
            Client Performance Audits & Reports
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Synthesized by Reporting AI with real CSV export capabilities.
          </p>
        </div>

        <button
          id="btn-generate-ai-report"
          onClick={onOpenGenerateModal}
          className="flex items-center gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md shadow-purple-200 transition-all shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate New Report via AI</span>
        </button>
      </div>

      {/* Split layout: Reports list (5 cols), Report detail view (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List */}
        <div className="lg:col-span-5 space-y-3">
          {reports.map((r) => {
            const isSelected = selectedReport?.id === r.id;
            return (
              <div
                key={r.id}
                onClick={() => setSelectedReport(r)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer bg-white ${
                  isSelected
                    ? 'border-[#8B5CF6] ring-2 ring-[#8B5CF6]/20 shadow-md'
                    : 'border-[#1A1423]/5 hover:border-gray-300 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-[#8B5CF6] uppercase tracking-wider">
                    {r.type} AUDIT
                  </span>
                  <span className="text-[11px] font-semibold text-gray-400">{r.period}</span>
                </div>

                <h4 className="text-xs font-bold text-[#1A1423] line-clamp-1">{r.title}</h4>
                <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                  {r.executiveSummary}
                </p>

                <div className="mt-3.5 pt-2.5 border-t border-[#1A1423]/5 flex items-center justify-between text-[11px] text-gray-500">
                  <span className="font-semibold text-gray-700">{r.clientName}</span>
                  <span className="font-mono text-emerald-700 font-bold">ROAS {r.kpiMetrics.roas}x</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Detail */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#1A1423]/5 p-7 shadow-sm sticky top-20">
          {selectedReport ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-[#1A1423]/5">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-[#8B5CF6] uppercase tracking-wider">
                      {selectedReport.type}
                    </span>
                    <span className="text-xs text-gray-400">{selectedReport.period}</span>
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-[#1A1423]">
                    {selectedReport.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Client: <strong className="text-gray-700">{selectedReport.clientName}</strong>
                  </p>
                </div>

                <button
                  id="btn-download-csv"
                  onClick={() => handleDownloadCsv(selectedReport.id)}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-colors shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Download CSV</span>
                </button>
              </div>

              {/* KPI Metrics Box */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2.5">
                  Performance Metric Matrix:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-[#FDFCF9] border border-[#1A1423]/5">
                    <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">ROAS</span>
                    <span className="text-xl font-bold font-serif text-[#8B5CF6]">
                      {selectedReport.kpiMetrics.roas}x
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#FDFCF9] border border-[#1A1423]/5">
                    <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">Total Reach</span>
                    <span className="text-xl font-bold font-serif text-[#1A1423]">
                      {selectedReport.kpiMetrics.reach.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#FDFCF9] border border-[#1A1423]/5">
                    <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">Impressions</span>
                    <span className="text-xl font-bold font-serif text-[#1A1423]">
                      {selectedReport.kpiMetrics.impressions.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#FDFCF9] border border-[#1A1423]/5">
                    <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">Ad Spend</span>
                    <span className="text-xl font-bold font-serif text-[#1A1423]">
                      ₹{selectedReport.kpiMetrics.adSpend.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#FDFCF9] border border-[#1A1423]/5">
                    <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">Conversions</span>
                    <span className="text-xl font-bold font-serif text-[#1A1423]">
                      {selectedReport.kpiMetrics.conversions}
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#FDFCF9] border border-[#1A1423]/5">
                    <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">Avg CPA</span>
                    <span className="text-xl font-bold font-serif text-[#1A1423]">
                      ₹{selectedReport.kpiMetrics.cpa}
                    </span>
                  </div>
                </div>
              </div>

              {/* Executive Summary */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Executive Summary:
                </label>
                <div className="p-4 rounded-2xl bg-[#FDFCF9] border border-[#1A1423]/5 text-xs leading-relaxed text-[#1A1423]">
                  {selectedReport.executiveSummary}
                </div>
              </div>

              {/* AI Recommendations */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Strategic Recommendations for Next Period:
                </label>
                <div className="p-4 rounded-2xl bg-purple-50/40 border border-purple-100 text-xs leading-relaxed text-purple-950 font-sans whitespace-pre-wrap">
                  {selectedReport.recommendations}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-gray-400 text-xs">
              Select a performance report to inspect details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
