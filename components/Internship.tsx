/**
 * Internship application page — Ewooral & BFAM Holdings
 * Fixes: correct API URL default, correct endpoint paths, adds Nav
 * Design: two-panel layout — brand story left, form right
 */
"use client"
import { useState, useCallback, useEffect, type ChangeEvent } from "react"
import Nav from "@/components/Nav"
import PhoneField from "@/components/PhoneField"

// ─── API config ───────────────────────────────────────────────────────────────
// Default to production. Override with NEXT_PUBLIC_API_URL in .env.local for dev.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://bfam-backend-api.ewooral.com"

const ENDPOINTS = {
  APPLY: `${API_URL}/api/v1/internships/apply`,
  STATS: `${API_URL}/api/v1/internships/stats`,
} as const

// ─── Types ────────────────────────────────────────────────────────────────────
type Stats = { applications: number; schools: number; roles: number }
type AcademicStatus = "student" | "graduate" | "national_service"
type ExperienceLevel = "no_experience" | "beginner" | "intermediate" | "experienced"

interface FormData {
  full_name: string; email: string; phone: string
  experience_level: ExperienceLevel | ""; linkedin_url: string; portfolio_url: string
  school: string; program_of_study: string; level: string
  academic_status: AcademicStatus | ""; cv_url: string
  interests: string[]; why_join: string
}
type Errors = Partial<Record<keyof FormData, string>>

// ─── Constants ────────────────────────────────────────────────────────────────
const INTEREST_OPTIONS = [
  "Software Engineering", "AI / Machine Learning", "Product Design",
  "Backend Systems", "Web Platforms", "Mobile Development",
  "Data & Analytics", "Brand & Marketing", "Social Media",
  "Business Development", "Finance & Fintech", "Content Writing",
]

const EXPERIENCE_OPTIONS: { value: ExperienceLevel; label: string }[] = [
  { value: "no_experience", label: "No experience yet" },
  { value: "beginner", label: "Beginner (0–1 yr)" },
  { value: "intermediate", label: "Intermediate (1–3 yrs)" },
  { value: "experienced", label: "Experienced (3+ yrs)" },
]

const ACADEMIC_STATUS_OPTIONS: { value: AcademicStatus; label: string }[] = [
  { value: "student", label: "Currently studying" },
  { value: "graduate", label: "Graduate" },
  { value: "national_service", label: "National service" },
]

const LEVEL_OPTIONS = [
  { value: "level_100", label: "Level 100" },
  { value: "level_200", label: "Level 200" },
  { value: "level_300", label: "Level 300" },
  { value: "level_400", label: "Level 400" },
  { value: "graduate", label: "Graduate" },
  { value: "postgraduate", label: "Postgraduate" },
]

const STEPS = ["Personal", "Academic", "Interests", "Review"]

const INITIAL_FORM: FormData = {
  full_name: "", email: "", phone: "", experience_level: "",
  linkedin_url: "", portfolio_url: "", school: "", program_of_study: "",
  level: "", academic_status: "", cv_url: "", interests: [], why_join: "",
}

const WHY_JOIN_MAX = 500

const STEP_META = [
  { title: "Personal information",    sub: "Tell us who you are" },
  { title: "Academic background",     sub: "Where are you studying or from?" },
  { title: "Interests & motivation",  sub: "What drives you?" },
  { title: "Review & submit",         sub: "Everything look right?" },
]

const PERKS = [
  "Fully remote — work from anywhere",
  "Unpaid — gain real experience & portfolio",
  "Work on live products used daily",
  "Direct mentorship from engineers",
  "Real ownership, not busy work",
  "Path to a full-time offer",
]

// ─── Validation ───────────────────────────────────────────────────────────────
function validateStep(step: number, data: FormData): Errors {
  const e: Errors = {}
  if (step === 1) {
    if (!data.full_name.trim()) e.full_name = "Please enter your full name"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = "Enter a valid email address"
    if (!data.phone.trim()) e.phone = "Please enter your phone number"
    if (!data.experience_level) e.experience_level = "Please select your experience level"
  }
  if (step === 2) {
    if (!data.school.trim()) e.school = "Please enter your school"
    if (!data.program_of_study.trim()) e.program_of_study = "Please enter your programme"
    if (!data.level) e.level = "Please select your level"
    if (!data.academic_status) e.academic_status = "Please select your status"
  }
  if (step === 3) {
    if (!data.interests.length) e.interests = "Select at least one area of interest"
    if (!data.why_join.trim()) e.why_join = "Please tell us why you want to join"
    if (data.why_join.length > WHY_JOIN_MAX) e.why_join = `Keep it under ${WHY_JOIN_MAX} characters`
  }
  return e
}

// ─── Input styles ─────────────────────────────────────────────────────────────
function inputCls(hasError = false) {
  return [
    "w-full px-4 py-3 text-sm rounded-xl",
    "bg-[var(--color-bg)] text-ink placeholder:text-ink-faint",
    "border transition-all duration-200 outline-none",
    "focus:ring-2 focus:ring-accent/20",
    hasError
      ? "border-red-500/60 focus:border-red-400/80"
      : "border-[var(--line-strong)] focus:border-accent/60",
  ].join(" ")
}

// ─── Field wrapper ────────────────────────────────────────────────────────────
function Field({ label, required, hint, error, children }: {
  label: string; required?: boolean; hint?: string; error?: string; children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className={`text-[11px] font-semibold uppercase tracking-[0.08em] ${error ? "text-red-400" : "text-ink-faint"}`}>
        {label}
        {required && <span className="text-accent ml-1">*</span>}
        {!required && <span className="text-ink-faint font-normal normal-case tracking-normal ml-1.5 opacity-70">optional</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1.5 mt-0.5">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" className="flex-shrink-0">
            <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M5.5 3v2.5M5.5 7.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          {error}
        </p>
      )}
      {hint && !error && <p className="text-[11px] text-ink-faint leading-relaxed mt-0.5">{hint}</p>}
    </div>
  )
}

// ─── Step 1: Personal ─────────────────────────────────────────────────────────
function StepPersonal({ data, errors, onChange }: {
  data: FormData; errors: Errors; onChange: (k: keyof FormData, v: string) => void
}) {
  const f = (k: keyof FormData) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => onChange(k, e.target.value)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <Field label="Full name" required error={errors.full_name}>
        <input className={inputCls(!!errors.full_name)} value={data.full_name} onChange={f("full_name")} placeholder="Ada Boahen" autoComplete="name" />
      </Field>
      <Field label="Email address" required error={errors.email}>
        <input type="email" className={inputCls(!!errors.email)} value={data.email} onChange={f("email")} placeholder="ada@example.com" autoComplete="email" />
      </Field>
      <Field label="Phone number" required error={errors.phone}>
        <PhoneField value={data.phone} onChange={(val) => onChange("phone", val)} error={!!errors.phone} />
      </Field>
      <Field label="Experience level" required error={errors.experience_level}>
        <select className={inputCls(!!errors.experience_level)} value={data.experience_level} onChange={f("experience_level")}>
          <option value="">Select…</option>
          {EXPERIENCE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </Field>
      <Field label="LinkedIn profile" error={errors.linkedin_url}>
        <input type="url" className={inputCls()} value={data.linkedin_url} onChange={f("linkedin_url")} placeholder="https://linkedin.com/in/yourname" />
      </Field>
      <Field label="Portfolio / GitHub" error={errors.portfolio_url}>
        <input type="url" className={inputCls()} value={data.portfolio_url} onChange={f("portfolio_url")} placeholder="https://github.com/yourname" />
      </Field>
    </div>
  )
}

// ─── Step 2: Academic ─────────────────────────────────────────────────────────
function StepAcademic({ data, errors, onChange }: {
  data: FormData; errors: Errors; onChange: (k: keyof FormData, v: string) => void
}) {
  const f = (k: keyof FormData) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => onChange(k, e.target.value)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <Field label="School / University" required error={errors.school}>
        <input className={inputCls(!!errors.school)} value={data.school} onChange={f("school")} placeholder="University of Ghana" />
      </Field>
      <Field label="Programme of study" required error={errors.program_of_study}>
        <input className={inputCls(!!errors.program_of_study)} value={data.program_of_study} onChange={f("program_of_study")} placeholder="Computer Science" />
      </Field>
      <Field label="Level / Year" required error={errors.level}>
        <select className={inputCls(!!errors.level)} value={data.level} onChange={f("level")}>
          <option value="">Select…</option>
          {LEVEL_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </Field>
      <Field label="Academic status" required error={errors.academic_status}>
        <select className={inputCls(!!errors.academic_status)} value={data.academic_status} onChange={f("academic_status")}>
          <option value="">Select…</option>
          {ACADEMIC_STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </Field>
      <div className="sm:col-span-2">
        <Field
          label="CV / Resume link"
          hint="Paste a Google Drive, Dropbox, or any shareable link. Ensure it's set to 'Anyone with link can view'."
        >
          <input type="url" className={inputCls()} value={data.cv_url} onChange={f("cv_url")} placeholder="https://drive.google.com/file/..." />
        </Field>
      </div>
    </div>
  )
}

// ─── Step 3: Interests ────────────────────────────────────────────────────────
function StepInterests({ data, errors, onChange, onToggleInterest }: {
  data: FormData; errors: Errors
  onChange: (k: keyof FormData, v: string) => void
  onToggleInterest: (i: string) => void
}) {
  const len = data.why_join.length
  const atLimit = len > WHY_JOIN_MAX
  const nearLimit = len > WHY_JOIN_MAX * 0.85
  return (
    <div className="flex flex-col gap-6">
      <Field label="Areas of interest" required error={errors.interests}>
        <div className="flex flex-wrap gap-2 mt-1">
          {INTEREST_OPTIONS.map(opt => {
            const sel = data.interests.includes(opt)
            return (
              <button
                key={opt}
                type="button"
                onClick={() => onToggleInterest(opt)}
                className={[
                  "px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border",
                  sel
                    ? "bg-accent text-bg border-accent shadow-[0_2px_10px_rgba(245,184,32,0.3)]"
                    : "bg-transparent border-[var(--line-strong)] text-ink-dim hover:border-accent/50 hover:text-ink",
                ].join(" ")}
              >
                {opt}
              </button>
            )
          })}
        </div>
      </Field>

      <Field label="Why do you want to join Ewooral & BFAM?" required error={errors.why_join}>
        <textarea
          value={data.why_join}
          onChange={e => onChange("why_join", e.target.value)}
          rows={5}
          placeholder="Tell us what excites you about Ewooral & BFAM Holdings, what you hope to contribute, and what you want to build..."
          className={[inputCls(!!errors.why_join || atLimit), "resize-y min-h-[120px] leading-relaxed"].join(" ")}
        />
        <div className="flex justify-end -mt-0.5">
          <span className={`text-[11px] font-mono tabular-nums ${atLimit ? "text-red-400" : nearLimit ? "text-accent" : "text-ink-faint"}`}>
            {len} / {WHY_JOIN_MAX}
          </span>
        </div>
      </Field>
    </div>
  )
}

// ─── Step 4: Review ───────────────────────────────────────────────────────────
function ReviewBlock({ heading, items }: {
  heading: string
  items: { label: string; value: string; full?: boolean }[]
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.14em] font-semibold text-accent/80 mb-3">{heading}</p>
      <div className="grid grid-cols-2 gap-2">
        {items.map(({ label, value, full }) => (
          <div
            key={label}
            className={`rounded-xl px-4 py-3 bg-[var(--color-bg)] border border-[var(--line)] ${full ? "col-span-2" : ""}`}
          >
            <p className="text-[10px] text-ink-faint mb-1 uppercase tracking-wide">{label}</p>
            <p className="text-sm text-ink font-medium break-words leading-snug">{value || "—"}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function StepReview({ data }: { data: FormData }) {
  const expLabel = EXPERIENCE_OPTIONS.find(o => o.value === data.experience_level)?.label ?? "—"
  const statusLabel = ACADEMIC_STATUS_OPTIONS.find(o => o.value === data.academic_status)?.label ?? "—"
  const levelLabel = LEVEL_OPTIONS.find(o => o.value === data.level)?.label ?? "—"
  return (
    <div className="flex flex-col gap-5">
      <ReviewBlock heading="Personal" items={[
        { label: "Full name", value: data.full_name },
        { label: "Email", value: data.email },
        { label: "Phone", value: data.phone },
        { label: "Experience", value: expLabel },
        ...(data.linkedin_url ? [{ label: "LinkedIn", value: data.linkedin_url, full: true }] : []),
        ...(data.portfolio_url ? [{ label: "Portfolio", value: data.portfolio_url, full: true }] : []),
      ]} />
      <ReviewBlock heading="Academic" items={[
        { label: "School", value: data.school },
        { label: "Programme", value: data.program_of_study },
        { label: "Level", value: levelLabel },
        { label: "Status", value: statusLabel },
        ...(data.cv_url ? [{ label: "CV link", value: data.cv_url, full: true }] : []),
      ]} />
      <ReviewBlock heading="Interests & motivation" items={[
        { label: "Areas of interest", value: data.interests.join(", ") || "—", full: true },
        { label: "Why Ewooral & BFAM?", value: data.why_join, full: true },
      ]} />
    </div>
  )
}

// ─── Progress indicator ───────────────────────────────────────────────────────
function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex items-start gap-0 mb-8">
      {STEPS.map((label, i) => {
        const n = i + 1
        const done = n < step
        const active = n === step
        return (
          <div key={n} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1.5">
              <div className={[
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 transition-all duration-300",
                done
                  ? "bg-accent text-bg"
                  : active
                  ? "bg-accent text-bg ring-4 ring-accent/20"
                  : "bg-[var(--color-bg-2)] border border-[var(--line-strong)] text-ink-faint",
              ].join(" ")}>
                {done ? (
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M2 5.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : n}
              </div>
              <span className={`text-[10px] font-mono uppercase tracking-wider whitespace-nowrap transition-colors duration-200 ${active ? "text-accent" : done ? "text-ink-faint" : "text-ink-faint/50"}`}>
                {label}
              </span>
            </div>
            {n < 4 && (
              <div className={`flex-1 h-px mx-2 mb-4 transition-colors duration-500 ${done ? "bg-accent/40" : "bg-[var(--line)]"}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Success screen ───────────────────────────────────────────────────────────
function SuccessScreen({ email }: { email: string }) {
  return (
    <div
      className="flex flex-col items-center text-center py-16 px-6"
      style={{ animation: "fadeUp 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both" }}
    >
      <div className="relative mb-8">
        <div className="w-20 h-20 rounded-full bg-accent/12 border border-accent/30 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M6 16l8 8L26 8" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="absolute inset-0 rounded-full bg-accent/8 blur-2xl -z-10 scale-150" />
      </div>

      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-3">Application received</span>
      <h2 className="font-display text-3xl font-bold text-ink leading-tight mb-3">
        Welcome to the Ewooral family.
      </h2>
      <p className="text-ink-dim text-base leading-relaxed max-w-xs mb-8">
        Our team will review your application and reach out within 5–10 business days.
      </p>

      <div className="flex items-center gap-3 px-5 py-3.5 bg-[var(--color-bg)] border border-[var(--line)] rounded-2xl text-sm text-ink-dim max-w-xs w-full">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="flex-shrink-0 text-accent">
          <rect x="1.5" y="3" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M1.5 5.5l6 4 6-4" stroke="currentColor" strokeWidth="1.2"/>
        </svg>
        <span className="truncate">Confirmation sent to <span className="text-ink font-medium">{email}</span></span>
      </div>

      <a
        href="/"
        className="mt-8 text-sm text-ink-faint hover:text-accent transition-colors duration-200 flex items-center gap-1.5"
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path d="M8.5 10.5L4.5 6.5l4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back to ewooral.com
      </a>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function BFAMInternshipPage() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [stats, setStats] = useState<Stats>({ applications: 0, schools: 0, roles: 8 })

  useEffect(() => {
    const controller = new AbortController()
    fetch(ENDPOINTS.STATS, { signal: controller.signal })
      .then(r => r.ok ? r.json() : null)
      .then(json => { if (json?.data) setStats(json.data) })
      .catch(() => {})
    return () => controller.abort()
  }, [])

  const onChange = useCallback((key: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setErrors(prev => ({ ...prev, [key]: undefined }))
  }, [])

  const onToggleInterest = useCallback((interest: string) => {
    setForm(prev => {
      const has = prev.interests.includes(interest)
      return { ...prev, interests: has ? prev.interests.filter(i => i !== interest) : [...prev.interests, interest] }
    })
    setErrors(prev => ({ ...prev, interests: undefined }))
  }, [])

  const goNext = () => {
    const errs = validateStep(step, form)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setStep(s => s + 1)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const goBack = () => {
    setStep(s => s - 1)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setSubmitError(null)
    try {
      const res = await fetch(ENDPOINTS.APPLY, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          linkedin_url: form.linkedin_url || null,
          portfolio_url: form.portfolio_url || null,
          cv_url: form.cv_url || null,
        }),
      })
      if (res.ok) {
        setSubmitted(true)
        window.scrollTo({ top: 0, behavior: "smooth" })
      } else {
        const err = await res.json().catch(() => ({ detail: "Something went wrong." }))
        setSubmitError(err.detail ?? err.error?.message ?? "Submission failed. Please try again.")
      }
    } catch {
      setSubmitError("Network error. Please check your connection and try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const isLastStep = step === 4
  const { title: cardTitle, sub: cardSub } = STEP_META[step - 1]

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes stepIn {
          from { opacity: 0; transform: translateX(10px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .step-enter { animation: stepIn 0.28s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
        .page-enter { animation: fadeUp 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
      `}</style>

      <Nav />

      <div className="min-h-screen pt-[60px]">
        <div className="max-w-6xl mx-auto lg:grid lg:grid-cols-[380px_1fr] xl:grid-cols-[420px_1fr] min-h-[calc(100vh-60px)]">

          {/* ── Left panel: brand story (desktop only) ── */}
          <aside className="dark-panel hidden lg:flex flex-col justify-between lg:sticky lg:top-0 lg:h-screen px-10 py-12 border-r border-[var(--line)] overflow-y-auto">
            <div>
              {/* Back link */}
              <a
                href="/"
                className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.12em] text-ink-faint hover:text-accent transition-colors duration-200 mb-10"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M8 10L4 6l4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                ewooral.com
              </a>

              {/* Headline */}
              <div className="mb-10">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent block mb-4">
                  Internship Program · 2024
                </span>
                <h1 className="font-display font-bold leading-[0.92] text-ink mb-5" style={{ fontSize: "clamp(36px, 3.5vw, 52px)" }}>
                  Build things<br />
                  <em className="font-serif font-normal italic text-ink-dim not-italic" style={{ fontStyle: "italic" }}>that matter</em><br />
                  in Africa.
                </h1>
                <p className="text-ink-dim text-[15px] leading-relaxed">
                  We're building technology that creates real wealth for African businesses.
                  Bring your ambition — we'll give you the tools and space to grow.
                </p>
              </div>

              {/* Live stats */}
              <div className="grid grid-cols-3 gap-2.5 mb-10">
                {[
                  { value: stats.applications, label: "Applications" },
                  { value: stats.schools,      label: "Schools" },
                  { value: stats.roles,        label: "Open roles" },
                ].map(({ value, label }) => (
                  <div
                    key={label}
                    className="text-center py-4 px-2 rounded-xl border border-[var(--line)] bg-white/[0.03]"
                  >
                    <div className="font-display font-bold text-[28px] text-ink leading-none mb-1">{value}+</div>
                    <div className="text-[10px] text-ink-faint uppercase tracking-widest">{label}</div>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="h-px bg-[var(--line)] mb-8" />

              {/* Perks */}
              <ul className="space-y-3.5">
                {PERKS.map(perk => (
                  <li key={perk} className="flex items-center gap-3 text-[14px] text-ink-dim">
                    <span className="w-5 h-5 rounded-full bg-accent/12 border border-accent/25 flex items-center justify-center flex-shrink-0">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2 2 4-4" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    {perk}
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom status */}
            <div className="pt-8 border-t border-[var(--line)] mt-8 flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse flex-shrink-0" />
              <span className="text-[11px] font-mono text-ink-faint">Accepting applications · Accra, Ghana</span>
            </div>
          </aside>

          {/* ── Right panel: form ── */}
          <main className="px-4 sm:px-8 py-10 md:py-14 page-enter flex flex-col items-center">

            {/* Mobile-only header */}
            <div className="lg:hidden mb-10">
              <a href="/" className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-ink-faint hover:text-accent transition-colors mb-6">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M8 10L4 6l4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                ewooral.com
              </a>
              <p className="font-mono text-[11px] uppercase tracking-widest text-accent mb-2">Ewooral & BFAM Holdings</p>
              <h1 className="font-display text-3xl font-bold text-ink mb-2 leading-tight">
                Internship<br />Application
              </h1>
              <p className="text-ink-dim text-sm leading-relaxed mb-5">
                Build real products. Grow with Africa's next great tech company.
              </p>
              <div className="flex gap-2 flex-wrap">
                {["Remote", "Unpaid", "Accra, Ghana"].map(tag => (
                  <span
                    key={tag}
                    className="text-[11px] px-3 py-1 rounded-full border border-accent/30 text-accent font-medium"
                    style={{ background: "rgba(245,184,32,0.08)" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="max-w-xl mx-auto">
              {submitted ? (
                <div className="bg-bg-2 border border-[var(--line)] rounded-2xl overflow-hidden">
                  <SuccessScreen email={form.email} />
                </div>
              ) : (
                <>
                  <ProgressBar step={step} />

                  {/* Form card */}
                  <div className="bg-bg-2 border border-[var(--line)] rounded-2xl overflow-hidden"
                       style={{ boxShadow: "0 4px 32px rgba(0,0,0,0.14), 0 1px 4px rgba(0,0,0,0.08)" }}>

                    {/* Card header */}
                    <div className="px-6 pt-6 pb-5 border-b border-[var(--line)] flex items-start gap-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: "rgba(245,184,32,0.1)", border: "1px solid rgba(245,184,32,0.22)" }}
                      >
                        <span className="text-accent font-mono text-xs font-bold">0{step}</span>
                      </div>
                      <div>
                        <h2 className="font-display text-xl font-semibold text-ink">{cardTitle}</h2>
                        <p className="text-sm text-ink-faint mt-0.5">{cardSub}</p>
                      </div>
                    </div>

                    {/* Card body — key={step} triggers re-animation on step change */}
                    <div key={step} className="px-6 py-6 step-enter">
                      {step === 1 && <StepPersonal data={form} errors={errors} onChange={onChange} />}
                      {step === 2 && <StepAcademic data={form} errors={errors} onChange={onChange} />}
                      {step === 3 && <StepInterests data={form} errors={errors} onChange={onChange} onToggleInterest={onToggleInterest} />}
                      {step === 4 && <StepReview data={form} />}
                    </div>

                    {/* Privacy notice (step 4 only) */}
                    {step === 4 && (
                      <div className="mx-6 mb-4 flex items-center gap-2.5 px-4 py-3 rounded-xl border border-[var(--line)] text-xs text-ink-faint"
                           style={{ background: "var(--color-bg)" }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0 text-accent/60">
                          <rect x="2" y="6" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                          <path d="M4.5 6V4.5a2.5 2.5 0 015 0V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                        </svg>
                        Your information is submitted securely and will not be shared with third parties.
                      </div>
                    )}

                    {/* Error banner */}
                    {submitError && (
                      <div className="mx-6 mb-4 px-4 py-3 rounded-xl border border-red-500/20 text-sm text-red-400 flex items-start gap-2"
                           style={{ background: "rgba(239,68,68,0.06)" }}>
                        <span className="flex-shrink-0 mt-0.5">⚠</span>
                        {submitError}
                      </div>
                    )}

                    {/* Navigation */}
                    <div className="px-6 pb-6 flex items-center justify-between gap-4">
                      {step > 1 ? (
                        <button
                          type="button"
                          onClick={goBack}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm text-ink-dim border border-[var(--line-strong)] hover:text-ink hover:bg-[var(--color-bg)] transition-all duration-200"
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Back
                        </button>
                      ) : (
                        <span className="text-[11px] font-mono text-ink-faint/60">Step 1 of 4</span>
                      )}

                      <div className="flex items-center gap-3">
                        {step > 1 && (
                          <span className="text-[11px] font-mono text-ink-faint">Step {step} of 4</span>
                        )}
                        {isLastStep ? (
                          <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-accent text-bg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ boxShadow: submitting ? "none" : "0 4px 16px rgba(245,184,32,0.3)" }}
                          >
                            {submitting ? (
                              <>
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                                </svg>
                                Submitting…
                              </>
                            ) : (
                              <>
                                Submit application
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </>
                            )}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={goNext}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-accent text-bg transition-all duration-200 hover:brightness-105"
                            style={{ boxShadow: "0 4px 14px rgba(245,184,32,0.28)" }}
                          >
                            {step === 3 ? "Review & submit" : step === 1 ? "Academic details" : "Interests"}
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
