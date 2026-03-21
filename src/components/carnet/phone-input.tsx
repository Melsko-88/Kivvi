'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { COUNTRIES } from '@/lib/carnet-constants'

interface PhoneInputProps {
  value: string
  onChange: (fullPhone: string) => void
  disabled?: boolean
}

export function PhoneInput({ value, onChange, disabled }: PhoneInputProps) {
  const [countryIndex, setCountryIndex] = useState(0)
  const [showPicker, setShowPicker] = useState(false)
  const country = COUNTRIES[countryIndex]

  function handleInput(raw: string) {
    const digits = raw.replace(/\D/g, '')
    onChange(`${country.dial}${digits}`)
  }

  const localNumber = value.startsWith(country.dial)
    ? value.slice(country.dial.length)
    : value.replace(/^\+\d+/, '')

  return (
    <div className="relative">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          disabled={disabled}
          className="glass-input flex items-center gap-1.5 px-3 py-3 rounded-xl text-sm font-medium shrink-0"
        >
          <span>{country.dial}</span>
          <ChevronDown className="size-3.5 opacity-50" />
        </button>
        <input
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          value={localNumber}
          onChange={(e) => handleInput(e.target.value)}
          disabled={disabled}
          placeholder="77 123 45 67"
          className="glass-input w-full px-4 py-3 rounded-xl text-lg tracking-wide"
        />
      </div>

      {showPicker && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-card border border-border rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
          {COUNTRIES.map((c, i) => (
            <button
              key={c.code}
              type="button"
              onClick={() => {
                setCountryIndex(i)
                setShowPicker(false)
                const digits = localNumber.replace(/\D/g, '')
                onChange(`${c.dial}${digits}`)
              }}
              className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors flex justify-between"
            >
              <span>{c.name}</span>
              <span className="text-muted-foreground">{c.dial}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
