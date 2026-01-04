'use client';

import { useState, useEffect, useMemo } from 'react';
import SEOAuditPanel from '@/components/seo-audit/SEOAuditPanel';
import { 
  Loader2, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Search,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Filter
} from 'lucide-react';

export default function SEOOptizPage() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'issues', 'warnings'
  const [loading, setLoading] = useState(true);
  const [loadingFile, setLoadingFile] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [scanErrors, setScanErrors] = useState([]);

  // --- Statistics Calculation ---
  const stats = useMemo(() => ({
    total: files.length,
    withIssues: files.filter(f => f.hasIssues).length,
    withWarnings: files.filter(f => f.hasWarnings && !f.hasIssues).length,
    perfect: files.filter(f => !f.hasIssues && !f.hasWarnings).length,
  }), [files]);

  // --- Filtering Logic ---
  const filteredFiles = useMemo(() => {
    return files.filter(file => {
      const matchesSearch = file.slug.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (filterMode === 'issues') return file.hasIssues;
      if (filterMode === 'warnings') return file.hasWarnings;
      return true;
    });
  }, [files, searchQuery, filterMode]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
      const host = window.location.host;
      if (!host.includes('localhost') && !host.includes('127.0.0.1')) {
        window.location.href = '/';
        return;
      }
    }
    loadFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadFiles = async () => {
    try {
      setLoading(true);
      setLoadError(null);
      
      const response = await fetch('/api/seo-optiz/files');
      
      if (!response.ok) {
        // ... (Keep existing error handling logic)
        const errorPayload = await response.json().catch(() => ({}));
        if (errorPayload.files?.length > 0) {
           setFiles(errorPayload.files);
           setScanErrors(errorPayload.errors || []);
           if (!selectedFile) selectFile(errorPayload.files[0]);
           setLoading(false);
           return;
        }
        throw new Error(errorPayload.error || 'Failed to fetch');
      }

      const data = await response.json();
      const fileList = Array.isArray(data) ? data : (data.files || []);
      setFiles(fileList);
      setScanErrors(data.errors || []);

      if (fileList.length > 0 && !selectedFile) {
        selectFile(fileList[0]);
      }
    } catch (error) {
      setLoadError(error.message);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const selectFile = async (file) => {
    if (!file) return;
    setSelectedFile(file);
    setLoadingFile(true);
    try {
      const response = await fetch(`/api/seo-optiz/${file.slug}`);
      if (!response.ok) throw new Error('Failed to load file');
      const data = await response.json();
      setFileData({
        ...data,
        issues: file.issues || [],
        warnings: file.warnings || [],
        imageMetadata: file.imageMetadata || data.imageMetadata,
      });
    } catch (error) {
      // Error handled silently in UI
    } finally {
      setLoadingFile(false);
    }
  };

  const handleSave = () => {
    loadFiles();
    // Optimistic UI update or wait for reload
    setTimeout(() => {
      if(selectedFile) selectFile(selectedFile);
    }, 500);
  };

  const currentIndex = files.findIndex(f => f.slug === selectedFile?.slug);
  
  const navigateFile = (direction) => {
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= 0 && newIndex < files.length) {
      selectFile(files[newIndex]);
    }
  };

  // --- Sub-components for Cleaner JSX ---

  const StatusBadge = ({ count, type, icon: Icon, active }) => (
    <div className={`flex flex-col p-3 rounded-lg border ${active ? 'bg-white shadow-sm border-slate-200' : 'bg-slate-50 border-transparent'} transition-all`}>
      <div className="flex items-center justify-between mb-1">
        <span className={`text-xs font-semibold uppercase ${
          type === 'issue' ? 'text-red-600' : 
          type === 'warning' ? 'text-amber-600' : 
          type === 'perfect' ? 'text-emerald-600' : 'text-slate-600'
        }`}>
          {type}
        </span>
        <Icon className={`w-4 h-4 ${
          type === 'issue' ? 'text-red-500' : 
          type === 'warning' ? 'text-amber-500' : 
          type === 'perfect' ? 'text-emerald-500' : 'text-slate-400'
        }`} />
      </div>
      <span className="text-2xl font-bold text-slate-800">{count}</span>
    </div>
  );

  const FileListItem = ({ file }) => {
    const isSelected = selectedFile?.slug === file.slug;
    return (
      <button
        onClick={() => selectFile(file)}
        className={`w-full text-left px-4 py-3 border-b border-slate-100 transition-colors flex items-center justify-between group
          ${isSelected ? 'bg-blue-50 border-blue-100' : 'hover:bg-slate-50'}
        `}
      >
        <div className="min-w-0 flex-1">
          <p className={`text-sm font-medium truncate ${isSelected ? 'text-blue-700' : 'text-slate-700'}`}>
            {file.slug}
          </p>
          <p className="text-xs text-slate-400 truncate mt-0.5">
            {file.issues?.length > 0 ? `${file.issues.length} issues` : 'Ready to publish'}
          </p>
        </div>
        
        <div className="ml-3 flex-shrink-0">
          {file.hasIssues ? (
            <AlertCircle className="w-4 h-4 text-red-500" />
          ) : file.hasWarnings ? (
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          )}
        </div>
      </button>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <p className="text-slate-500 font-medium">Scanning content repository...</p>
      </div>
    );
  }

  if (loadError && files.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center max-w-md p-8 bg-white rounded-xl shadow-lg border border-red-100">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Connection Failed</h2>
          <p className="text-slate-600 mb-6">{loadError}</p>
          <button
            onClick={() => { setLoading(true); loadFiles(); }}
            className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* --- LEFT SIDEBAR (Navigation) --- */}
      <aside className="w-80 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 z-10 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
        
        {/* Header & Stats */}
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-bold text-lg text-slate-800">SEO Audit</h1>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <StatusBadge count={stats.withIssues} type="issue" icon={AlertCircle} active={filterMode === 'issues'} />
            <StatusBadge count={stats.perfect} type="perfect" icon={CheckCircle2} active={filterMode === 'all'} />
          </div>
        </div>

        {/* Search & Filter */}
        <div className="p-4 border-b border-slate-100 bg-white sticky top-0">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search files..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          
          <div className="flex p-1 bg-slate-100 rounded-lg">
            {['all', 'issues', 'warnings'].map((mode) => (
              <button
                key={mode}
                onClick={() => setFilterMode(mode)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md capitalize transition-all ${
                  filterMode === mode ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* File List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredFiles.length > 0 ? (
            filteredFiles.map(file => <FileListItem key={file.slug} file={file} />)
          ) : (
            <div className="p-8 text-center text-slate-400">
              <Filter className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No files found matching filters.</p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 text-xs text-center text-slate-400">
          {files.length} documents total
        </div>
      </aside>


      {/* --- RIGHT MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50/50">
        
        {/* Top Toolbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <FileText className="w-5 h-5 text-slate-400 flex-shrink-0" />
            <h2 className="text-sm font-semibold text-slate-800 truncate">
              {selectedFile ? selectedFile.slug : 'Select a file'}
            </h2>
            {selectedFile?.hasIssues && (
              <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-wide border border-red-100">
                Needs Attention
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 rounded-lg p-1 mr-2">
              <button 
                onClick={() => navigateFile('prev')}
                disabled={currentIndex <= 0}
                className="p-1.5 rounded-md text-slate-500 hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none transition-all"
                title="Previous File"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => navigateFile('next')}
                disabled={currentIndex >= files.length - 1}
                className="p-1.5 rounded-md text-slate-500 hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none transition-all"
                title="Next File"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative">
          {loadingFile ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : !selectedFile ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <FileText className="w-10 h-10 text-slate-300" />
              </div>
              <p className="text-lg font-medium text-slate-600">No file selected</p>
              <p className="text-sm">Select a file from the sidebar to begin auditing.</p>
            </div>
          ) : (
            <div className="h-full overflow-y-auto p-6">
              <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 min-h-[500px]">
                {/* We assume SEOAuditPanel is a purely presentational component 
                   or handles its own internal form logic. We wrap it nicely here.
                */}
                <SEOAuditPanel 
                  file={fileData} 
                  onSave={handleSave}
                  onNext={() => navigateFile('next')}
                  onPrevious={() => navigateFile('prev')}
                  hasNext={currentIndex < files.length - 1}
                  hasPrevious={currentIndex > 0}
                />
              </div>
              <div className="h-10"></div> {/* Bottom spacer */}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}