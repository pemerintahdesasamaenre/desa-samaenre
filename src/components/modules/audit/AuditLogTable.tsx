'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Clock, 
  User as UserIcon, 
  Database, 
  Loader2, 
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Activity
} from 'lucide-react';
import { getAuditLogs } from '@/actions/analytics';
import { AuditLog } from '@/types/audit';

export const AuditLogTable = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const loader = useRef(null);

  const fetchLogs = useCallback(async (pageNum: number) => {
    if (loading) return;
    setLoading(true);

    try {
      const { data } = await getAuditLogs(pageNum, 15);
      if (data.length < 15) setHasMore(false);
      setLogs(prev => pageNum === 1 ? data : [...prev, ...data]);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs(1);
  }, [fetchLogs]);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !loading) {
      setPage(prev => {
        const nextPage = prev + 1;
        fetchLogs(nextPage);
        return nextPage;
      });
    }
  }, [hasMore, loading, fetchLogs]);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
    
    return () => observer.disconnect();
  }, [handleObserver]);

  const toggleRow = (id: string) => {
    setExpandedRows(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const getMethodBadge = (method: string) => {
    const styles: Record<string, string> = {
      CREATE: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      UPDATE: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      DELETE: 'bg-red-500/10 text-red-600 border-red-500/20',
      VIEW: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      AUTH: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    };
    
    return (
      <span className={`px-2 py-0.5 border rounded-full text-[9px] font-bold uppercase tracking-widest ${styles[method] || 'bg-slate-500/10 text-slate-600 border-slate-500/20'}`}>
        {method}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-2xl sm:rounded-3xl shadow-sm border border-border overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="px-6 sm:px-10 py-5 text-xs font-bold text-primary/80 uppercase tracking-wider">Waktu & Aktivitas</th>
                <th className="hidden md:table-cell px-10 py-5 text-xs font-bold text-primary/80 uppercase tracking-wider">Aktor</th>
                <th className="hidden lg:table-cell px-10 py-5 text-xs font-bold text-primary/80 uppercase tracking-wider">Metode</th>
                <th className="w-10 px-6 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs.map((log) => (
                <React.Fragment key={log.id}>
                  <tr 
                    className="hover:bg-primary/5 transition-colors group cursor-pointer"
                    onClick={() => toggleRow(log.id)}
                  >
                    <td className="px-6 sm:px-10 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          log.method === 'DELETE' ? 'bg-red-500/10 text-red-600' : 
                          log.method === 'CREATE' ? 'bg-emerald-500/10 text-emerald-600' :
                          'bg-primary/10 text-primary'
                        }`}>
                          <Activity size={18} />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-foreground tracking-tight text-sm sm:text-base leading-none truncate mb-1.5">
                            {log.action}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                            <Clock size={12} className="text-primary/50" />
                            {new Date(log.created_at).toLocaleString('id-ID', { 
                              day: '2-digit', 
                              month: 'short', 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-10 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                          <UserIcon size={12} />
                        </div>
                        <span className="text-xs font-bold text-foreground truncate max-w-[150px]">
                          {log.user_email || 'System'}
                        </span>
                      </div>
                    </td>
                    <td className="hidden lg:table-cell px-10 py-5">
                      {getMethodBadge(log.method)}
                    </td>
                    <td className="px-6 py-5 text-right">
                       <button className="p-2 text-muted-foreground group-hover:text-primary transition-colors">
                          {expandedRows.includes(log.id) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                       </button>
                    </td>
                  </tr>

                  {expandedRows.includes(log.id) && (
                    <tr className="bg-muted/10 animate-in fade-in slide-in-from-top-1 duration-200">
                      <td colSpan={4} className="px-6 sm:px-10 py-6 border-l-4 border-primary/30">
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-1">
                              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Entity Type</p>
                              <p className="text-xs font-bold text-foreground uppercase tracking-widest flex items-center gap-2 mt-1">
                                <Database size={14} className="text-primary" />
                                {log.entity_type}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">User ID</p>
                              <p className="text-[10px] font-mono font-bold text-foreground break-all mt-1">{log.user_id || '-'}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Full Timestamp</p>
                              <p className="text-xs font-bold text-foreground mt-1">{new Date(log.created_at).toLocaleString('id-ID')}</p>
                            </div>
                          </div>
                          
                          <div className="p-4 bg-background/50 rounded-2xl border border-border/50">
                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Payload Details</p>
                            <pre className="text-[10px] font-mono text-primary overflow-x-auto whitespace-pre-wrap leading-relaxed">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              
              {logs.length === 0 && !loading && (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                       <ShieldAlert size={40} className="text-muted-foreground/30" />
                       <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Belum ada rekaman aktivitas</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Infinite Scroll Loader */}
      <div ref={loader} className="py-10 flex justify-center">
        {loading && (
          <div className="flex items-center gap-3 px-6 py-3 bg-card border border-border rounded-full shadow-sm">
            <Loader2 className="w-4 h-4 text-primary animate-spin" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Memuat data aktivitas...</span>
          </div>
        )}
        {!hasMore && logs.length > 0 && (
          <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">Akhir dari rekaman aktivitas (2 Bulan Terakhir)</p>
        )}
      </div>
    </div>
  );
};
