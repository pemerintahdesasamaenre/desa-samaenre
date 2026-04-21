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
    <div className="space-y-2" ref={containerRef}>
      {label && (
        <label className="text-sm font-semibold text-foreground/70 flex items-center gap-2">
          {label}
          {required && <span className="text-destructive">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input type="hidden" name={name} value={selectedId} required={required} />
        
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left ${
            isOpen 
              ? 'border-primary ring-4 ring-primary/10 bg-background shadow-sm' 
              : 'border-border bg-muted/30 hover:bg-background'
          } ${error ? 'border-destructive' : ''}`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded-lg ${selectedOption ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
              <Icon size={16} />
            </div>
            <span className={selectedOption ? 'text-foreground font-medium' : 'text-muted-foreground'}>
              {selectedOption ? selectedOption.name : placeholder}
            </span>
          </div>
          <ChevronDown 
            size={18} 
            className={`text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>

        {isOpen && (
          <div className="absolute z-[100] w-full mt-2 bg-popover border border-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="max-h-60 overflow-y-auto p-2 space-y-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:display-none">
              {options.length === 0 && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Tidak ada opsi tersedia
                </div>
              )}
              {options.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelect(opt.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-colors ${
                    selectedId === opt.id 
                      ? 'bg-primary/10 text-primary font-bold' 
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  {opt.name}
                  {selectedId === opt.id && <Check size={16} />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {error && <p className="text-xs text-destructive font-medium pl-1">{error}</p>}
    </div>
  )
}
