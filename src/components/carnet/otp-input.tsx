'use client'

import { useRef, useCallback, type KeyboardEvent, type ClipboardEvent } from 'react'

interface OtpInputProps {
  value: string
  onChange: (otp: string) => void
  length?: number
  disabled?: boolean
}

export function OtpInput({ value, onChange, length = 6, disabled }: OtpInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([])
  const digits = Array.from({ length }, (_, i) => value[i] || '')

  const focusIndex = useCallback(
    (i: number) => {
      if (i >= 0 && i < length) refs.current[i]?.focus()
    },
    [length]
  )

  function handleChange(i: number, char: string) {
    if (!/^\d?$/.test(char)) return

    const next = [...digits]
    next[i] = char
    onChange(next.join(''))

    if (char && i < length - 1) focusIndex(i + 1)
  }

  function handleKeyDown(i: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      focusIndex(i - 1)
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (pasted) onChange(pasted)
  }

  return (
    <div className="flex gap-3 justify-center">
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el }}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={i === 0 ? handlePaste : undefined}
          disabled={disabled}
          className="glass-input w-12 h-14 text-center text-xl font-semibold rounded-xl border border-foreground/[0.06] transition-all duration-200 focus:border-foreground/[0.25] focus:bg-foreground/[0.03]"
        />
      ))}
    </div>
  )
}
