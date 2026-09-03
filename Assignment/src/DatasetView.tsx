import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  Download, 
  Search, 
  BarChart2, 
  Database,
  Filter,
  PieChart as PieIcon
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { SupportTicket, DatasetStats } from '../../types';
import { SAMPLE_CSV_STRING } from '../../data/sampleDataset';

interface DatasetViewProps {
  tickets: SupportTicket[];
  stats: DatasetStats;
  onUpdateDataset: (newTickets: SupportTicket[], message?: string) => void;
  onResetSample: () => void;
}

const CATEGORY_COLORS: { [key: string]: string } = {
  Payment: '#4f46e5', // Indigo
  Account: '#0284c7', // Sky
  Refund: '#059669', // Emerald
  Technical: '#d97706', // Amber
  Shipping: '#db2777', // Pink
  Other: '#7c3aed'
};

export const DatasetView: React.FC<DatasetViewProps> = ({
  tickets,
  stats,
  onUpdateDataset,
  onResetSample
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse and validate CSV
  const handleCsvFile = (file: File) => {
    setUploadError(null);
    setUploadSuccess(null);

    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      setUploadError('Invalid file format. Please upload a standard CSV (.csv) file.');
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: 'greedy',
      complete: (results) => {
        if (!results.data || results.data.length === 0) {
          setUploadError('The uploaded CSV file is empty. Please upload a valid dataset with records.');
          return;
        }

        const fields = results.meta.fields || [];
        const normalizedFields = fields.map(f => f.trim().toLowerCase());

        // Check required columns
        const hasText = normalizedFields.includes('text') || normalizedFields.includes('ticket') || normalizedFields.includes('query');

        if (!hasText) {
          setUploadError(`Missing required column: "text" (or "ticket"). Found columns: [${fields.join(', ')}]`);
          return;
        }

        const validTickets: SupportTicket[] = [];
        const seenIds = new Set<string>();
        let dupCount = 0;
        let emptyCount = 0;

        results.data.forEach((row: any, idx: number) => {
          // Find text field
          const rawText = row['text'] || row['Text'] || row['ticket'] || row['query'] || '';
          const text = String(rawText).trim();

          if (!text) {
            emptyCount++;
            return;
          }

          // Find id field
          let id = String(row['ticket_id'] || row['id'] || row['ID'] || `T${String(idx + 1).padStart(3, '0')}`).trim();
          if (seenIds.has(id)) {
            dupCount++;
            id = `${id}_dup${dupCount}`;
          }
          seenIds.add(id);

          // Find category field
          const category = String(row['category'] || row['Category'] || row['label'] || 'General').trim();

          validTickets.push({
            ticket_id: id,
            text,
            category: category || 'General'
          });
        });

        if (validTickets.length === 0) {
          setUploadError('No valid support ticket records could be extracted from the file.');
          return;
        }

        onUpdateDataset(
          validTickets,
          `Successfully loaded ${validTickets.length} tickets from "${file.name}" (${dupCount} duplicate IDs handled, ${emptyCount} empty rows filtered).`
        );
        setUploadSuccess(`Successfully loaded ${validTickets.length} tickets from "${file.name}".`);
      },
      error: (error) => {
        setUploadError(`CSV Parsing Error: ${error.message}`);
      }
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleCsvFile(e.dataTransfer.files[0]);
    }
  };

  // Download Sample CSV template
  const handleDownloadSample = () => {
    const blob = new Blob([SAMPLE_CSV_STRING], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'sample_support_tickets.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Chart data: Category distribution
  const categoryChartData = Object.entries(stats.categories).map(([name, count]) => ({
    name,
    count,
    color: CATEGORY_COLORS[name] || '#6366f1'
  }));

  // Chart data: Text Length distribution bins
  const lengthBins = [
    { range: '< 40 chars', min: 0, max: 40, count: 0 },
    { range: '40-70 chars', min: 40, max: 70, count: 0 },
    { range: '70-100 chars', min: 70, max: 100, count: 0 },
    { range: '100+ chars', min: 100, max: 9999, count: 0 }
  ];

  tickets.forEach(t => {
    const len = t.text.length;
    for (const bin of lengthBins) {
      if (len >= bin.min && len < bin.max) {
        bin.count++;
        break;
      }
    }
  });

  // Filtered tickets for preview table
  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.ticket_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || t.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-600" />
            Dataset Management & Statistics
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Upload custom CSV ticket datasets or benchmark against the built-in corpus. All metrics are calculated live from real data.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="download-sample-csv-btn"
            onClick={handleDownloadSample}
            className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 border border-slate-200 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Download CSV Template</span>
          </button>

          <button
            id="reset-sample-dataset-btn"
            onClick={onResetSample}
            className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 border border-slate-200 flex items-center gap-1.5 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
            <span>Reset to Built-in Sample</span>
          </button>
        </div>
      </div>

      {/* Upload CSV Dropzone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all bg-white shadow-xs ${
          dragActive
            ? 'border-emerald-500 bg-emerald-50/40'
            : 'border-slate-300 hover:border-emerald-500'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={(e) => e.target.files && e.target.files[0] && handleCsvFile(e.target.files[0])}
          className="hidden"
          id="csv-file-input"
        />

        <div className="max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <Upload className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900">Upload CSV Dataset</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Drag and drop your file here, or click to browse. Expected format: <code className="text-emerald-700 font-mono bg-emerald-50 px-1 py-0.5 rounded">ticket_id,text,category</code>
            </p>
          </div>

          <button
            id="browse-csv-button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-lg bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition cursor-pointer"
          >
            Select CSV File
          </button>
        </div>
      </div>

      {/* Notifications */}
      {uploadError && (
        <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{uploadError}</span>
        </div>
      )}

      {uploadSuccess && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{uploadSuccess}</span>
        </div>
      )}

      {/* Dataset Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Total Tickets</span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{stats.totalRecords}</div>
          <span className="text-[10px] text-emerald-600 font-bold">100% Loaded</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Categories</span>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">
            {Object.keys(stats.categories).length}
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Class Labels</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Avg Length</span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {stats.avgTextLengthChars} <span className="text-xs font-normal text-slate-400">chars</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">~{stats.avgTokenCount} tokens/ticket</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Vocabulary</span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {stats.vocabularySize}
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Unique terms</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Train Split (80%)</span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {stats.trainCount}
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Index Partition</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Test Split (20%)</span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {stats.testCount}
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Eval Partition</span>
        </div>
      </div>

      {/* Visual Charts: Categories & Length Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Bar Chart */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2.5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-emerald-600" />
              Ticket Category Distribution
            </h3>
            <span className="text-xs text-slate-500 font-medium">Empirical Count</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} angle={-20} textAnchor="end" />
                <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', color: '#0f172a', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]}>
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Text Length Histogram */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2.5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-emerald-600" />
              Character Length Histogram Distribution
            </h3>
            <span className="text-xs text-slate-500 font-medium">Binned Intervals</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lengthBins} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="range" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', color: '#0f172a', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#0284c7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Dataset Preview Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              Dataset Records Preview ({filteredTickets.length} of {tickets.length})
            </h3>
            <p className="text-xs text-slate-500">Validated records loaded in memory for IR indexing & evaluation.</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                id="dataset-search-input"
                type="text"
                placeholder="Filter tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border border-slate-200 text-xs text-slate-900 rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 w-40 sm:w-52 shadow-xs"
              />
            </div>

            {/* Category Filter */}
            <select
              id="dataset-category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-slate-200 text-xs text-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs"
            >
              <option value="ALL">All Categories</option>
              {Object.keys(stats.categories).map(cat => (
                <option key={cat} value={cat}>{cat} ({stats.categories[cat]})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 w-20">ID</th>
                <th className="py-2.5 px-3">Ticket Text</th>
                <th className="py-2.5 px-3 w-32">Category</th>
                <th className="py-2.5 px-3 w-24 text-right">Length</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredTickets.slice(0, 20).map((t) => (
                <tr key={t.ticket_id} className="hover:bg-slate-50/80 transition">
                  <td className="py-2 px-3 text-emerald-700 font-bold">{t.ticket_id}</td>
                  <td className="py-2 px-3 text-slate-800 font-sans">{t.text}</td>
                  <td className="py-2 px-3 font-sans">
                    <span 
                      className="px-2 py-0.5 rounded text-[10px] font-bold border"
                      style={{
                        backgroundColor: `${CATEGORY_COLORS[t.category] || '#4f46e5'}10`,
                        color: CATEGORY_COLORS[t.category] || '#4f46e5',
                        borderColor: `${CATEGORY_COLORS[t.category] || '#4f46e5'}30`
                      }}
                    >
                      {t.category}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-slate-500 text-right">{t.text.length} chars</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredTickets.length > 20 && (
          <div className="text-center text-xs text-slate-500 pt-1">
            Showing first 20 of {filteredTickets.length} records
          </div>
        )}
      </div>
    </div>
  );
};
