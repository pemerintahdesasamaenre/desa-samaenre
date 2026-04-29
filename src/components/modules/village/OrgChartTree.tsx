'use client'

import { useMemo, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { StaffMember } from '@/types'
import { toPng } from 'html-to-image'
import { Download, Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'

interface TreeNode extends StaffMember {
  children: TreeNode[]
}

interface OrgChartTreeProps {
  staff: StaffMember[]
  villageName?: string
  logoUrl?: string | null
  orgTitle?: string
}

const StaffNode = ({ node, isFullscreen }: { node: TreeNode, isFullscreen: boolean }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="flex flex-col items-center">
      {/* Node Card */}
      <div
        className={`relative flex flex-col items-center group transition-all duration-500 hover:-translate-y-1 z-10 ${isFullscreen
            ? 'p-4 min-w-[180px] max-w-[220px] rounded-2xl bg-card border-2 border-primary/20 shadow-xl hover:border-primary/40'
            : 'p-2 min-w-[120px] max-w-[160px] rounded-lg bg-card shadow-sm border border-border hover:shadow-primary/10'
          }`}
      >
        {/* Full Details only in Fullscreen */}
        {isFullscreen && (
          <div className="flex flex-col items-center mb-2">
            <div className="w-20 h-20 border-[3px] relative rounded-full overflow-hidden bg-muted mb-2 border-background shadow-md shrink-0 group-hover:scale-110 transition-transform duration-500">
              {node.photo_url ? (
                <Image
                  src={node.photo_url}
                  alt={node.name}
                  fill
                  className="object-cover"
                  crossOrigin="anonymous"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 bg-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </div>
              )}
            </div>
            <h3 className="font-bold text-foreground text-center uppercase tracking-tight leading-tight text-sm">{node.name}</h3>
          </div>
        )}

        {!isFullscreen && (
          <h3 className="font-bold text-foreground text-center uppercase tracking-tight leading-tight text-[10px] mb-1">{node.name}</h3>
        )}

        <p className={`font-bold text-center uppercase tracking-widest px-3 py-1 rounded-full border ${isFullscreen
            ? 'bg-primary/10 border-primary/20 text-[10px] text-primary shadow-sm w-full mt-1'
            : 'bg-primary text-primary-foreground text-[8px] shadow-sm w-full'
          }`}>
          {node.position}
        </p>

        {node.children.length > 0 && (
          <button
            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
            className="absolute left-1/2 -translate-x-1/2 -bottom-2.5 w-5 h-5 bg-background border border-border rounded-full flex items-center justify-center hover:bg-muted transition-colors shadow-sm z-20 text-muted-foreground hover:text-foreground html2canvas-ignore"
            title={isExpanded ? "Collapse" : "Expand"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            >
              <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      {/* Children & Lines */}
      {node.children.length > 0 && isExpanded && (
        <div className="relative flex flex-col items-center animate-in fade-in zoom-in-95 duration-500 pt-8">
          {/* Vertical line from parent to horizontal rail */}
          <div className="absolute top-0 w-[2px] h-8 bg-border"></div>

          <div className="flex justify-center relative">
            {node.children.map((child, index) => (
              <div key={child.id} className="relative pt-8 px-1 sm:px-2">
                {/* Horizontal line rail */}
                {node.children.length > 1 && (
                  <div
                    className={`absolute top-0 h-[2px] bg-border ${index === 0 ? 'left-[50%] right-0' :
                        index === node.children.length - 1 ? 'left-0 right-[50%]' :
                          'left-0 right-0'
                      }`}
                  ></div>
                )}

                {/* Vertical line to child node */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-8 bg-border"></div>

                <StaffNode node={child} isFullscreen={isFullscreen} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function OrgChartTree({ 
  staff, 
  villageName, 
  logoUrl, 
  orgTitle = "Pemerintah Desa" 
}: OrgChartTreeProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scale, setScale] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // drag-to-scroll
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const treeData = useMemo(() => {
    const staffMap = new Map<string, TreeNode>()
    staff.forEach(member => staffMap.set(member.id, { ...member, children: [] }))
    const roots: TreeNode[] = []
    staffMap.forEach(node => {
      if (node.parent_id && staffMap.has(node.parent_id)) {
        staffMap.get(node.parent_id)!.children.push(node)
      } else roots.push(node)
    })
    const sortNodes = (nodes: TreeNode[]) => {
      nodes.sort((a, b) => a.order_index - b.order_index)
      nodes.forEach(node => { if (node.children.length > 0) sortNodes(node.children) })
    }
    sortNodes(roots)
    return roots
  }, [staff]);

  useEffect(() => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2;
      container.scrollTop = 0;
    }
  }, [treeData, isFullscreen]);

  // Auto-fit when entering fullscreen
  useEffect(() => {
    if (isFullscreen && contentRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const content = contentRef.current;

      const padding = 120; // More padding for fullscreen
      const availableWidth = container.clientWidth - padding;
      const availableHeight = container.clientHeight - 160; // accounting for header

      const contentWidth = content.scrollWidth;
      const contentHeight = content.scrollHeight;

      const scaleX = availableWidth / contentWidth;
      const scaleY = availableHeight / contentHeight;

      const newScale = Math.min(Math.min(scaleX, scaleY), 1); // don't scale up past 1 by default
      setScale(Math.max(newScale, 0.3)); // don't scale down too much

      // Initial scroll to top-center
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollLeft = (scrollRef.current.scrollWidth - scrollRef.current.clientWidth) / 2;
          scrollRef.current.scrollTop = 0;
        }
      }, 50);
    } else if (!isFullscreen) {
      setScale(1);
    }
  }, [isFullscreen]);

  // Lock body scroll when fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isFullscreen]);

  // Handle ESC key to exit fullscreen
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isFullscreen]);

  const handleDownload = async () => {
    if (!contentRef.current) return;
    setIsDownloading(true);

    // Store original state
    const originalTransform = contentRef.current.style.transform;
    const originalTransition = contentRef.current.style.transition;

    try {
      // 1. Prepare for high-quality capture at 100% scale
      contentRef.current.style.transition = 'none';
      contentRef.current.style.transform = 'scale(1)';
      
      // Wait for re-render/reflow
      await new Promise(resolve => setTimeout(resolve, 150));
      
      const dataUrl = await toPng(contentRef.current, {
        cacheBust: true,
        backgroundColor: '#ffffff',
        pixelRatio: 3, // Higher quality
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top center',
        },
        filter: (node: HTMLElement) => {
          return !node.classList?.contains('html2canvas-ignore');
        }
      });

      const link = document.createElement('a');
      link.download = `Struktur_Organisasi_${new Date().getTime()}.png`;
      link.href = dataUrl;
      link.click();
      toast.success('Bagan berhasil diunduh');
    } catch (err) {
      console.error("Gagal mendownload gambar:", err);
      toast.error("Terjadi kesalahan saat mengunduh gambar.");
    } finally {
      // Restore original state
      if (contentRef.current) {
        contentRef.current.style.transition = originalTransition;
        contentRef.current.style.transform = originalTransform;
      }
      setIsDownloading(false);
    }
  };

  if (!staff || staff.length === 0) return null;

  const content = (
    <div
      className={`overflow-hidden ${isFullscreen
          ? 'fixed inset-0 z-[99999] bg-background rounded-none border-none'
          : 'relative w-full border-y border-border bg-card/30'
        }`}
    >
      {/* Background decoration in fullscreen */}
      {isFullscreen && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, var(--border) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-primary/5"></div>
        </div>
      )}
      {/* Floating Action Buttons */}
      <div className={`absolute z-50 flex gap-2 ${isFullscreen ? 'top-6 right-6' : 'top-4 right-4'}`}>
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="p-2.5 bg-background border border-border text-foreground rounded-full shadow-sm hover:bg-muted transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed group"
          title="Unduh Bagan"
        >
          {isDownloading ? (
            <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
          )}
        </button>

        {isFullscreen && (
          <div className="flex bg-background border border-border rounded-full shadow-sm">
            <button
              onClick={() => setScale(prev => Math.max(prev - 0.1, 0.2))}
              className="p-2.5 hover:bg-muted rounded-l-full border-r border-border transition-all group"
              title="Perkecil"
            >
              <ZoomOut className="w-5 h-5 group-hover:scale-90" />
            </button>
            <div className="flex items-center px-3 text-xs font-medium min-w-[3.5rem] justify-center">
              {Math.round(scale * 100)}%
            </div>
            <button
              onClick={() => setScale(prev => Math.min(prev + 0.1, 2))}
              className="p-2.5 hover:bg-muted border-l border-border transition-all group"
              title="Perbesar"
            >
              <ZoomIn className="w-5 h-5 group-hover:scale-110" />
            </button>
            <button
              onClick={() => {
                // Reset to fit
                if (contentRef.current && scrollRef.current) {
                  const container = scrollRef.current;
                  const content = contentRef.current;
                  const scaleX = (container.clientWidth - 64) / content.scrollWidth;
                  const scaleY = (container.clientHeight - 120) / content.scrollHeight;
                  setScale(Math.max(Math.min(scaleX, scaleY, 1), 0.2));
                }
              }}
              className="p-2.5 hover:bg-muted border-l border-border transition-all group"
              title="Fit to Screen"
            >
              <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            </button>
          </div>
        )}

        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2.5 bg-background border border-border text-foreground rounded-full shadow-sm hover:bg-muted transition-all flex items-center justify-center group"
          title={isFullscreen ? "Keluar Layar Penuh" : "Layar Penuh"}
        >
          {isFullscreen ? (
            <Minimize2 className="w-5 h-5 group-hover:scale-90 transition-transform" />
          ) : (
            <Maximize2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
          )}
        </button>
      </div>

      <div
        ref={scrollRef}
        className={`w-full overflow-auto scrollbar-hide select-none transition-all ${isFullscreen ? 'h-[100dvh] w-[100dvw]' : 'h-[600px] py-8'
          } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <div className={`inline-flex min-w-full min-h-full justify-center items-start ${isFullscreen ? 'p-12' : 'px-2'}`}>
          <div
            ref={contentRef}
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'top center',
              transition: 'transform 0.2s ease-out'
            }}
            className="flex flex-col items-center py-4 px-12 shrink-0"
          >
            {/* Header for Download/Fullscreen */}
            <div className="flex flex-col items-center mb-16 text-center space-y-4">
              {logoUrl && (
                <div className="relative w-24 h-24 mb-2">
                  <Image 
                    src={logoUrl} 
                    alt="Logo Desa" 
                    fill 
                    className="object-contain"
                    crossOrigin="anonymous"
                  />
                </div>
              )}
              <div className="space-y-1">
                <h2 className="text-3xl font-bold uppercase tracking-tighter text-foreground">
                  Struktur Organisasi {orgTitle}
                </h2>
                <h3 className="text-xl font-bold text-primary uppercase tracking-widest">
                  Desa {villageName || '...'} • Tahun {new Date().getFullYear()}
                </h3>
              </div>
              <div className="w-32 h-1.5 bg-primary rounded-full mt-4"></div>
            </div>

            <div className="flex flex-row justify-center gap-8 sm:gap-12">
              {treeData.map(root => (
                <StaffNode key={root.id} node={root} isFullscreen={isFullscreen} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isFullscreen && mounted) {
    return (
      <>
        <div className="w-full h-[600px] rounded-2xl border border-dashed border-border flex items-center justify-center bg-muted/20">
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <Maximize2 className="w-5 h-5 animate-pulse" />
            Bagan sedang ditampilkan dalam mode layar penuh
          </p>
        </div>
        {createPortal(content, document.body)}
      </>
    );
  }

  return content;
}