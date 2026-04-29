'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, BookOpen, History } from 'lucide-react';

interface ExpandableHistoryProps {
  content: string;
}

export default function ExpandableHistory({ content }: ExpandableHistoryProps) {
  const [expandLevel, setExpandLevel] = useState(0);
  const paragraphs = content.split('\n').filter(p => p.trim() !== '');
  if (paragraphs.length === 0) return null;

  const getVisibleParagraphs = () => {
    if (expandLevel === 0) return paragraphs.slice(0, 1);
    if (expandLevel === 1) return paragraphs.slice(0, 3);
    return paragraphs;
  };

  const visibleParagraphs = getVisibleParagraphs();
  const hasMore = paragraphs.length > visibleParagraphs.length;

  return (
    <section className="mb-32">
      <div className="glass-premium p-8 md:p-20 rounded-[4rem] relative overflow-hidden shadow-2xl border border-border/50">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col items-center mb-16 space-y-4">
            <div className="p-4 bg-primary/10 text-primary rounded-3xl mb-2">
              <History size={40} />
            </div>
            <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter text-foreground text-center leading-none">
              Sejarah <br/><span className="text-primary italic border-b-4 border-primary/20">Singkat Desa</span>
            </h2>
          </div>

          <div className="prose prose-xl prose-slate dark:prose-invert max-w-none text-muted-foreground leading-relaxed font-medium space-y-8">
            <AnimatePresence mode="popLayout">
              {visibleParagraphs.map((para, i) => (
                <motion.p 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  {para}
                </motion.p>
              ))}
            </AnimatePresence>
          </div>

          <div className="mt-16 flex justify-center">
            {hasMore ? (
              <button
                onClick={() => setExpandLevel(prev => prev + 1)}
                className="group flex items-center gap-3 bg-primary text-primary-foreground px-12 py-6 rounded-full font-bold hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/40 uppercase tracking-widest text-xs"
              >
                <BookOpen size={18} />
                {expandLevel === 0 ? 'Lanjutkan Membaca' : 'Buka Selengkapnya'}
                <ChevronDown size={18} className="group-hover:translate-y-1 transition-transform" />
              </button>
            ) : expandLevel > 0 ? (
              <button
                onClick={() => setExpandLevel(0)}
                className="group flex items-center gap-3 bg-muted text-muted-foreground px-10 py-5 rounded-full font-bold hover:bg-muted/80 transition-all uppercase tracking-widest text-xs"
              >
                Tutup Sejarah
              </button>
            ) : null}
          </div>
        </div>

        {hasMore && (
          <div className="absolute bottom-0 left-0 right-0 h-60 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-0" />
        )}
      </div>
    </section>
  );
}
