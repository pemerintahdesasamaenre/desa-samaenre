'use client'

import { Share2, MessageCircle, Link2, Check } from 'lucide-react'
import { useState } from 'react'

interface ShareButtonsProps {
  title: string
  url: string
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareWA = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`, '_blank')
  }

  return (
    <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-10">
      <div className="flex items-center gap-6">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">Bagikan</span>
        <div className="flex gap-4">
          <button 
            onClick={shareWA}
            className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-muted-foreground hover:bg-emerald-500 hover:text-white transition-all hover-lift"
            title="Bagikan ke WhatsApp"
          >
            <MessageCircle size={20} />
          </button>
          <button 
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title, url })
              } else {
                copyToClipboard()
              }
            }}
            className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all hover-lift"
            title="Bagikan"
          >
            <Share2 size={20} />
          </button>
        </div>
      </div>

      <button 
        onClick={copyToClipboard}
        className={`flex items-center gap-3 px-8 py-4 glass rounded-2xl font-bold transition-all hover-lift ${
          copied ? 'text-emerald-500 border-emerald-500/50' : 'text-foreground hover:bg-primary hover:text-white'
        }`}
      >
        {copied ? <Check size={18} /> : <Link2 size={18} />}
        {copied ? 'Tautan Disalin!' : 'Salin Tautan'}
      </button>
    </div>
  )
}
