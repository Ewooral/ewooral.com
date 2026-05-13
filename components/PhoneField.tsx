"use client"

import PhoneInput from "react-phone-number-input"
import "react-phone-number-input/style.css"
import type { Country, Value } from "react-phone-number-input"

interface PhoneFieldProps {
  value: string
  onChange: (value: string) => void
  defaultCountry?: Country
  placeholder?: string
  error?: boolean
}

/**
 * Themed phone input with country selector, flags, and auto-formatting.
 * Outputs E.164 format (e.g. "+233241234567").
 */
export default function PhoneField({
  value,
  onChange,
  defaultCountry = "GH",
  placeholder = "024 123 4567",
  error,
}: PhoneFieldProps) {
  return (
    <>
      <style>{`
        .phone-field .PhoneInput {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .phone-field .PhoneInputCountry {
          display: flex;
          align-items: center;
          padding: 0 4px;
          flex-shrink: 0;
        }
        .phone-field .PhoneInputCountryIcon {
          width: 24px;
          height: 18px;
          border-radius: 2px;
          overflow: hidden;
          box-shadow: 0 0 0 1px rgba(255,255,255,0.1);
        }
        .phone-field .PhoneInputCountryIcon--border {
          box-shadow: 0 0 0 1px rgba(255,255,255,0.1);
        }
        .phone-field .PhoneInputCountrySelectArrow {
          margin-left: 4px;
          border-color: var(--color-ink-faint, #888);
          opacity: 0.6;
        }
        .phone-field .PhoneInputCountrySelect {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
          z-index: 1;
        }
        .phone-field .PhoneInputInput {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: inherit;
          font: inherit;
          padding: 0;
        }
        .phone-field .PhoneInputInput::placeholder {
          color: var(--color-ink-faint, rgba(255,255,255,0.35));
        }
      `}</style>
      <div className="phone-field">
        <PhoneInput
          international
          countryCallingCodeEditable={false}
          defaultCountry={defaultCountry}
          value={(value || undefined) as Value | undefined}
          onChange={(val) => onChange(val ?? "")}
          placeholder={placeholder}
          className={`w-full bg-[var(--color-bg)] border text-[var(--color-ink)] px-4 py-3 text-[14px] transition-colors rounded-xl ${
            error
              ? "border-red-500"
              : "border-white/10 focus-within:border-[var(--color-accent)]/50"
          }`}
        />
      </div>
    </>
  )
}
