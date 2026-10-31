'use client'

import Link from 'next/link'
import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { site, withBase } from '@/config/site'
import { Icon } from '@/components/Icon'
import { track } from '@/lib/analytics'
import { dateBounds, formatPhone, LIMITS, speciesOptions, validateAppointment, type AppointmentInput, type FieldErrors } from '@/lib/appointment'
import { getServiceOption, type ServiceOption } from '@/content/service-options'
import { ServicePicker } from './ServicePicker'

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

/**
 * Общая форма заявки. initialService - ID услуги из прайса или slug направления;
 * если не задан, услуга читается из ?service= в адресе (страница /appointment).
 */
export function AppointmentForm({ initialService, onServiceChange }: { initialService?: string; onServiceChange?: (option: ServiceOption | undefined) => void }) {
  const uid = useId()
  const fid = (name: string) => `${uid}-${name}`
  const [values, setValues] = useState<AppointmentInput>({
    name: '',
    phone: '',
    species: '',
    service: initialService && getServiceOption(initialService) ? initialService : '',
    comment: '',
    date: '',
    consent: false,
    sourcePage: '',
    priceSignature: '',
    website: '',
  })
  /** Актуальные сведения о цене от сервера, если они изменились после открытия формы */
  const [priceUpdate, setPriceUpdate] = useState<ServiceOption | null>(null)
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

  // Услуга из ссылки вида /appointment?service=us-one-organ - предзаполняется и остаётся редактируемой.
  useEffect(() => {
    if (initialService !== undefined) return
    const raw = new URLSearchParams(window.location.search).get('service') ?? ''
    if (getServiceOption(raw)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- однократное чтение услуги из адреса после гидратации
      setValues((v) => ({ ...v, service: raw }))
    }
  }, [initialService])

  const option = priceUpdate && priceUpdate.value === values.service ? priceUpdate : getServiceOption(values.service)

  useEffect(() => {
    onServiceChange?.(option)
  }, [option, onServiceChange])

  const set = <K extends keyof AppointmentInput>(key: K, value: AppointmentInput[K]) => {
    setValues((v) => ({ ...v, [key]: value }))
    if (errors[key as FieldName]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const chooseService = (v: string) => {
    setPriceUpdate(null)
    set('service', v)
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
      const res = await fetch(withBase('/api/appointment'), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...values, sourcePage: window.location.pathname, priceSignature: option?.signature ?? '' }),
      })
      const json = (await res.json().catch(() => null)) as { ok?: boolean; id?: string; code?: string; errors?: FieldErrors; service?: ServiceOption } | null
      if (res.status === 409 && json?.code === 'price_changed' && json.service) {
        // Цена изменилась после открытия формы: показываем новую и ждём повторного подтверждения.
        setPriceUpdate(json.service)
        setStatus('idle')
        requestAnimationFrame(() => {
          errorRef.current?.scrollIntoView({ block: 'center' })
          errorRef.current?.focus({ preventScroll: true })
        })
        return
      }
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
          {option && <p>Услуга: {option.label}.</p>}
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
      <p className="field__error" id={fid(`${name}-error`)}>
        <Icon name="alert" size={16} /> {errors[name]}
      </p>
    ) : null
  const aria = (name: FieldName, hint?: string) => ({
    'aria-invalid': errors[name] ? (true as const) : undefined,
    'aria-describedby': [errors[name] ? fid(`${name}-error`) : '', hint ?? ''].filter(Boolean).join(' ') || undefined,
  })
  const busy = status === 'submitting'
  const priceChanged = Boolean(priceUpdate && priceUpdate.value === values.service)

  return (
    <form ref={formRef} className="form" noValidate onSubmit={onSubmit} onInput={onFirstInput} aria-describedby={fid('form-note')}>
      <div className="form__row">
        <div className="field">
          <label htmlFor={fid('name')}>Как к вам обращаться</label>
          <input id={fid('name')} name="name" className="input" autoComplete="name" maxLength={LIMITS.name} value={values.name} onChange={(e) => set('name', e.target.value)} {...aria('name')} required />
          {err('name')}
        </div>
        <div className="field">
          <label htmlFor={fid('phone')}>Телефон</label>
          <input
            id={fid('phone')}
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

      <ServicePicker value={values.service} onChange={chooseService} error={errors.service} errorId={fid('service-error')} />

      <div className="form__row">
        <div className="field">
          <label htmlFor={fid('species')}>
            Питомец <span className="field__opt">- необязательно</span>
          </label>
          <select id={fid('species')} name="species" className="select" value={values.species} onChange={(e) => set('species', e.target.value)} {...aria('species')}>
            <option value="">Не указано</option>
            {speciesOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {err('species')}
        </div>
      <div className="field" style={{ maxWidth: 320 }}>
        <label htmlFor={fid('date')}>
          Желательная дата <span className="field__opt">- необязательно</span>
        </label>
        <input id={fid('date')} name="date" type="date" className="input" min={bounds.min} max={bounds.max} value={values.date} onChange={(e) => set('date', e.target.value)} {...aria('date', fid('date-hint'))} />
        <p className="field__hint" id={fid('date-hint')}>
          Это пожелание, а не запись на конкретное время.
        </p>
        {err('date')}
        </div>
      </div>

      <div className="field">
        <label htmlFor={fid('comment')}>
          Коротко о ситуации <span className="field__opt">- необязательно</span>
        </label>
        <textarea id={fid('comment')} name="comment" className="textarea" maxLength={LIMITS.comment} value={values.comment} onChange={(e) => set('comment', e.target.value)} {...aria('comment', fid('comment-count'))} />
        <p className="field__counter" id={fid('comment-count')}>
          {values.comment.length} / {LIMITS.comment}
        </p>
        {err('comment')}
      </div>

      <div className="hp" aria-hidden="true">
        <label htmlFor={fid('website')}>Не заполняйте это поле</label>
        <input id={fid('website')} name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => set('website', e.target.value)} />
      </div>

      <div className="field">
        <div className="check">
          <input id={fid('consent')} name="consent" type="checkbox" checked={values.consent} onChange={(e) => set('consent', e.target.checked)} {...aria('consent')} />
          <label htmlFor={fid('consent')}>
            Я даю <Link href="/consent" target="_blank">согласие на обработку персональных данных</Link> и ознакомлен(а) с{' '}
            <Link href="/privacy" target="_blank">политикой конфиденциальности</Link>
            <span className="visually-hidden"> (документы откроются в новой вкладке)</span>
          </label>
        </div>
        {err('consent')}
      </div>

      <div className="form__footer">
        {priceChanged && priceUpdate && (
          <div className="status status--error" role="alert" tabIndex={-1} ref={errorRef}>
            <Icon name="info" size={24} />
            <div>
              <h2>Стоимость услуги изменилась</h2>
              <p>
                Актуальная цена: <strong>{priceUpdate.priceText}</strong>
                {priceUpdate.unit && <> {priceUpdate.unit}</>}. Проверьте сведения об услуге выше и отправьте заявку ещё раз.
              </p>
            </div>
          </div>
        )}
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
            priceChanged ? 'Подтвердить и отправить' : 'Отправить заявку'
          )}
        </button>
        <p className="form__note" id={fid('form-note')}>
          <Icon name="clock" size={18} /> Заявка не является подтверждённой записью. Администратор свяжется с вами для согласования времени.
        </p>
        <p className="visually-hidden" role="status" aria-live="polite">
          {busy ? 'Отправляем заявку' : ''}
        </p>
      </div>
    </form>
  )
}
