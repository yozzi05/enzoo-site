'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { site } from '@/config/site'
import { Icon } from '@/components/Icon'
import { track } from '@/lib/analytics'
import { dateBounds, formatPhone, LIMITS, speciesOptions, validateAppointment, type AppointmentInput, type FieldErrors } from '@/lib/appointment'
import { appointmentServiceOptions } from '@/content/services'

type Status = 'idle' | 'submitting' | 'success' | 'error'
type FieldName = keyof FieldErrors

const order: FieldName[] = ['name', 'phone', 'species', 'service', 'date', 'comment', 'consent']

function errorMessage(code: string | undefined): string {
  switch (code) {
    case 'rate_limited':
      return 'Слишком много попыток подряд. Подождите несколько минут или позвоните нам.'
    case 'disabled':
      return 'Приём заявок через сайт сейчас недоступен.'
    default:
      return 'Не удалось отправить заявку.'
  }
}

export function AppointmentForm() {
  const [values, setValues] = useState<AppointmentInput>({
    name: '',
    phone: '',
    species: '',
    service: '',
    comment: '',
    date: '',
    consent: false,
    website: '',
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [serverError, setServerError] = useState<string>('')
  const [requestId, setRequestId] = useState('')
  const submitting = useRef(false)
  const started = useRef(false)
  const formRef = useRef<HTMLFormElement>(null)
  const errorRef = useRef<HTMLDivElement>(null)
  const successRef = useRef<HTMLDivElement>(null)
  const [bounds] = useState(() => dateBounds())

  // Услуга из ссылки вида /appointment?service=ultrasound - предзаполняется и остаётся редактируемой.
  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get('service') ?? ''
    if (appointmentServiceOptions.some((o) => o.value === raw)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- однократное чтение услуги из адреса после гидратации
      setValues((v) => ({ ...v, service: raw }))
    }
  }, [])

  const set = <K extends keyof AppointmentInput>(key: K, value: AppointmentInput[K]) => {
    setValues((v) => ({ ...v, [key]: value }))
    if (errors[key as FieldName]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const onFirstInput = () => {
    if (started.current) return
    started.current = true
    track('appointment_start', { service: values.service || undefined })
  }

  const focusFirstError = (errs: FieldErrors) => {
    const first = order.find((k) => errs[k])
    if (!first) return
    const el = formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)
    el?.focus()
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (submitting.current) return
    const check = validateAppointment(values)
    if (!check.ok) {
      setErrors(check.errors)
      focusFirstError(check.errors)
      return
    }
    submitting.current = true
    setStatus('submitting')
    setServerError('')
    try {
      const res = await fetch('/api/appointment', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(values),
      })
      const json = (await res.json().catch(() => null)) as { ok?: boolean; id?: string; code?: string; errors?: FieldErrors } | null
      if (res.ok && json?.ok) {
        setRequestId(json.id ?? '')
        setStatus('success')
        track('appointment_success', { service: values.service || undefined })
        requestAnimationFrame(() => {
          successRef.current?.scrollIntoView({ block: 'center' })
          successRef.current?.focus({ preventScroll: true })
        })
        return
      }
      if (json?.code === 'validation' && json.errors) {
        setErrors(json.errors)
        setStatus('idle')
        focusFirstError(json.errors)
        return
      }
      throw new Error(json?.code ?? 'unknown')
    } catch (err) {
      const code = err instanceof Error ? err.message : 'network'
      setServerError(errorMessage(code))
      setStatus('error')
      track('appointment_error', { reason: code.slice(0, 30) })
      requestAnimationFrame(() => {
        errorRef.current?.scrollIntoView({ block: 'center' })
        errorRef.current?.focus({ preventScroll: true })
      })
    } finally {
      submitting.current = false
    }
  }

  if (status === 'success') {
    return (
      <div className="status status--success" role="status" tabIndex={-1} ref={successRef}>
        <Icon name="check" size={24} />
        <div>
          <h2>Заявка принята</h2>
          <p>
            Спасибо, {values.name}. Администратор перезвонит на номер {values.phone}, чтобы согласовать и подтвердить время визита.
            {requestId && <> Номер заявки: {requestId}.</>}
          </p>
          <p style={{ marginTop: 12 }}>
            Если помощь нужна срочно, не ждите звонка - позвоните сами:{' '}
            <a href={site.phone.href} data-track="call_click" data-place="form-success">
              {site.phone.display}
            </a>
            .
          </p>
          <p style={{ marginTop: 12 }}>
            <Link href="/">Вернуться на главную</Link>
          </p>
        </div>
      </div>
    )
  }

  const err = (name: FieldName) =>
    errors[name] ? (
      <p className="field__error" id={`${name}-error`}>
        <Icon name="alert" size={16} /> {errors[name]}
      </p>
    ) : null
  const aria = (name: FieldName, hint?: string) => ({
    'aria-invalid': errors[name] ? (true as const) : undefined,
    'aria-describedby': [errors[name] ? `${name}-error` : '', hint ?? ''].filter(Boolean).join(' ') || undefined,
  })
  const busy = status === 'submitting'

  return (
    <form ref={formRef} className="form" noValidate onSubmit={onSubmit} onInput={onFirstInput} aria-describedby="form-note">
      <div className="form__row">
        <div className="field">
          <label htmlFor="f-name">Как к вам обращаться</label>
          <input id="f-name" name="name" className="input" autoComplete="name" maxLength={LIMITS.name} value={values.name} onChange={(e) => set('name', e.target.value)} {...aria('name')} required />
          {err('name')}
        </div>
        <div className="field">
          <label htmlFor="f-phone">Телефон</label>
          <input
            id="f-phone"
            name="phone"
            className="input"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+7 (___) ___-__-__"
            value={values.phone}
            onChange={(e) => set('phone', formatPhone(e.target.value))}
            onPaste={(e) => {
              e.preventDefault()
              set('phone', formatPhone(e.clipboardData.getData('text')))
            }}
            {...aria('phone')}
            required
          />
          {err('phone')}
        </div>
      </div>

      <div className="form__row">
        <div className="field">
          <label htmlFor="f-species">
            Питомец <span className="field__opt">- необязательно</span>
          </label>
          <select id="f-species" name="species" className="select" value={values.species} onChange={(e) => set('species', e.target.value)} {...aria('species')}>
            <option value="">Не указано</option>
            {speciesOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {err('species')}
        </div>
        <div className="field">
          <label htmlFor="f-service">
            Услуга <span className="field__opt">- необязательно</span>
          </label>
          <select id="f-service" name="service" className="select" value={values.service} onChange={(e) => set('service', e.target.value)} {...aria('service')}>
            <option value="">Не знаю, нужна консультация</option>
            {appointmentServiceOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {err('service')}
        </div>
      </div>

      <div className="field" style={{ maxWidth: 320 }}>
        <label htmlFor="f-date">
          Желательная дата <span className="field__opt">- необязательно</span>
        </label>
        <input id="f-date" name="date" type="date" className="input" min={bounds.min} max={bounds.max} value={values.date} onChange={(e) => set('date', e.target.value)} {...aria('date', 'date-hint')} />
        <p className="field__hint" id="date-hint">
          Это пожелание, а не запись на конкретное время.
        </p>
        {err('date')}
      </div>

      <div className="field">
        <label htmlFor="f-comment">
          Коротко о ситуации <span className="field__opt">- необязательно</span>
        </label>
        <textarea id="f-comment" name="comment" className="textarea" maxLength={LIMITS.comment} value={values.comment} onChange={(e) => set('comment', e.target.value)} {...aria('comment', 'comment-count')} />
        <p className="field__counter" id="comment-count">
          {values.comment.length} / {LIMITS.comment}
        </p>
        {err('comment')}
      </div>

      <div className="hp" aria-hidden="true">
        <label htmlFor="f-website">Не заполняйте это поле</label>
        <input id="f-website" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => set('website', e.target.value)} />
      </div>

      <div className="field">
        <div className="check">
          <input id="f-consent" name="consent" type="checkbox" checked={values.consent} onChange={(e) => set('consent', e.target.checked)} {...aria('consent')} />
          <label htmlFor="f-consent">
            Я даю <Link href="/consent" target="_blank">согласие на обработку персональных данных</Link> и ознакомлен(а) с{' '}
            <Link href="/privacy" target="_blank">политикой конфиденциальности</Link>
            <span className="visually-hidden"> (документы откроются в новой вкладке)</span>
          </label>
        </div>
        {err('consent')}
      </div>

      <div className="form__footer">
        {status === 'error' && (
          <div className="status status--error" role="alert" tabIndex={-1} ref={errorRef}>
            <Icon name="alert" size={24} />
            <div>
              <h2>{serverError}</h2>
              <p>
                Введённые данные сохранены - попробуйте отправить ещё раз или позвоните:{' '}
                <a href={site.phone.href} data-track="call_click" data-place="form-error">
                  {site.phone.display}
                </a>
                .
              </p>
            </div>
          </div>
        )}

        <button type="submit" className="btn btn--primary form__submit" disabled={busy} aria-disabled={busy}>
          {busy ? (
            <>
              <span className="spinner" aria-hidden="true" /> Отправляем…
            </>
          ) : (
            'Отправить заявку'
          )}
        </button>
        <p className="form__note" id="form-note">
          <Icon name="clock" size={18} /> Время приёма подтвердит администратор.
        </p>
        <p className="visually-hidden" role="status" aria-live="polite">
          {busy ? 'Отправляем заявку' : ''}
        </p>
      </div>
    </form>
  )
}
