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

  useEffect(() => {
    if (value !== undefined && value !== selectedId) setSelectedId(value)
  }, [value, selectedId])

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
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input type="hidden" name={name} value={selectedId} required={required} />
        
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left ${
            isOpen 
              ? 'border-blue-500 ring-4 ring-blue-500/10 bg-white dark:bg-slate-900 shadow-sm' 
              : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:bg-white dark:hover:bg-slate-900'
          } ${error ? 'border-red-500' : ''}`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded-lg ${selectedOption ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
              <Icon size={16} />
            </div>
            <span className={selectedOption ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-400'}>
              {selectedOption ? selectedOption.name : placeholder}
            </span>
          </div>
          <ChevronDown 
            size={18} 
            className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="max-h-60 overflow-y-auto p-2 space-y-1">
              {options.length === 0 && (
                <div className="p-4 text-center text-sm text-slate-400">
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
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 font-bold' 
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
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
      
      {error && <p className="text-xs text-red-500 font-medium pl-1">{error}</p>}
    </div>
  )
}
