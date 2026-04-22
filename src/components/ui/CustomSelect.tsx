'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, LucideIcon, HelpCircle } from 'lucide-react'

interface Option {
  id: string
  name: string
}

interface CustomSelectProps {
  options: Option[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  name?: string
  label?: string
  error?: string
  required?: boolean
  placeholder?: string
  icon?: LucideIcon
}

export default function CustomSelect({ 
  options, 
  value,
  defaultValue,
  onChange,
  name,
  label, 
  error, 
  required,
  placeholder = "Pilih opsi...",
  icon: Icon = HelpCircle
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedId, setSelectedId] = useState(value || defaultValue || '')
  const containerRef = useRef<HTMLDivElement>(null)

  // Sync state with prop during render (React 19 pattern)
  const [prevValue, setPrevValue] = useState(value)
  if (value !== prevValue) {
    setSelectedId(value || '')
    setPrevValue(value)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find(o => o.id === selectedId)

  const handleSelect = (id: string) => {
    setSelectedId(id)
    setIsOpen(false)
    if (onChange) {
      onChange(id)
    }
  }

  return (
    <div className="space-y-2.5" ref={containerRef}>
      {label && (
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1 flex items-center gap-2">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input type="hidden" name={name} value={selectedId} required={required} />
        
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full h-12 flex items-center justify-between px-6 rounded-full border transition-all text-left shadow-sm ${
            isOpen 
              ? 'border-primary ring-4 ring-primary/10 bg-white dark:bg-slate-950' 
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-slate-300'
          } ${error ? 'border-red-500' : ''}`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded-full ${selectedOption ? 'bg-primary/10 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
              <Icon size={14} />
            </div>
            <span className={`text-sm ${selectedOption ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-400 font-medium'}`}>
              {selectedOption ? selectedOption.name : placeholder}
            </span>
          </div>
          <ChevronDown 
            size={16} 
            className={`text-slate-400 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>

        {isOpen && (
          <div className="absolute z-[999] w-full mt-3 bg-popover border border-border rounded-[2rem] shadow-2xl shadow-black/5 dark:shadow-none overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="max-h-72 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
              {options.length === 0 && (
                <div className="p-6 text-center text-sm text-muted-foreground italic">
                  Tidak ada opsi tersedia
                </div>
              )}
              {options.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelect(opt.id)}
                  className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl text-sm transition-all ${
                    selectedId === opt.id 
                      ? 'bg-primary text-primary-foreground font-black shadow-lg shadow-primary/30' 
                      : 'text-foreground hover:bg-muted hover:translate-x-1'
                  }`}
                >
                  {opt.name}
                  {selectedId === opt.id && <Check size={18} className="animate-in zoom-in duration-300" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {error && <p className="text-xs text-destructive font-bold pl-2 animate-in slide-in-from-top-1">{error}</p>}
    </div>
  )
}
