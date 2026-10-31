'use client'

import { useId, useMemo, useRef, useState } from 'react'
import { Icon } from '@/components/Icon'
import { serviceOptions, type ServiceOption } from '@/content/service-options'

function norm(s: string) {
  return s.toLowerCase().replace(/ё/g, 'е')
}

const MAX_RESULTS = 40

/** Выбранная услуга: название, направление, цена, единица и условия - видны сразу. */
export function ServiceSummary({ option, headingId }: { option: ServiceOption; headingId?: string }) {
  return (
    <div className="svc-summary">
      <p className="svc-summary__cat">{option.categoryName}</p>
      <p className="svc-summary__name" id={headingId}>
        {option.label}
      </p>
      {option.priceText ? (
        <p className="svc-summary__price">
          {option.priceText}
          {option.unit && <span className="svc-summary__unit"> {option.unit}</span>}
        </p>
      ) : (
        <p className="svc-summary__price svc-summary__price--muted">Стоимость назовёт администратор</p>
      )}
      {option.conditions.length > 0 && (
        <ul className="svc-summary__cond">
          {option.conditions.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

/**
 * Выбор услуги с поиском по всему прайсу и направлениям.
 * Без длинного выпадающего списка: результаты фильтруются по вводу.
 */
export function ServicePicker({
  value,
  onChange,
  error,
  errorId,
}: {
  value: string
  onChange: (value: string) => void
  error?: string
  errorId: string
}) {
  const selected = serviceOptions.find((o) => o.value === value)
  const [open, setOpen] = useState(!selected)
  const [query, setQuery] = useState('')
  const searchId = useId()
  const listId = useId()
  const changeRef = useRef<HTMLButtonElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const openPanel = () => {
    setOpen(true)
    requestAnimationFrame(() => searchRef.current?.focus())
  }

  const results = useMemo(() => {
    const q = norm(query.trim())
    const list = q ? serviceOptions.filter((o) => norm(`${o.label} ${o.categoryName} ${o.conditions.join(' ')}`).includes(q)) : serviceOptions.filter((o) => o.kind === 'direction')
    return list
  }, [query])

  const choose = (v: string) => {
    onChange(v)
    setOpen(false)
    setQuery('')
    requestAnimationFrame(() => changeRef.current?.focus())
  }

  return (
    <fieldset className="field svc-picker">
      <legend>
        Услуга <span className="field__opt">- необязательно</span>
      </legend>

      {selected && <ServiceSummary option={selected} />}
      {!selected && !open && <p className="muted">Услуга не выбрана - администратор поможет определиться.</p>}

      {!open ? (
        <div className="svc-picker__actions">
          <button ref={changeRef} type="button" className="btn btn--outline btn--sm" onClick={openPanel} aria-expanded={false} aria-controls={listId}>
            <Icon name="search" size={18} /> {selected ? 'Изменить услугу' : 'Выбрать услугу'}
          </button>
          {selected && (
            <button type="button" className="link-button" onClick={() => onChange('')}>
              Не знаю, нужна консультация
            </button>
          )}
        </div>
      ) : (
        <div className="svc-picker__panel">
          <label htmlFor={searchId} className="visually-hidden">
            Поиск услуги
          </label>
          <div className="catalog-search">
            <Icon name="search" size={20} />
            <input
              ref={searchRef}
              id={searchId}
              name="service"
              type="search"
              className="input"
              placeholder="Найти услугу: УЗИ, кастрация, стрижка…"
              value={query}
              maxLength={60}
              autoComplete="off"
              onChange={(e) => setQuery(e.target.value)}
              aria-controls={listId}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? errorId : undefined}
            />
          </div>
          <p className="field__hint" role="status" aria-live="polite">
            {query.trim()
              ? results.length
                ? `Найдено: ${results.length}${results.length > MAX_RESULTS ? `, показаны первые ${MAX_RESULTS} - уточните запрос` : ''}`
                : 'Ничего не нашлось. Выберите направление или оставьте поле пустым.'
              : 'Начните вводить название или выберите направление.'}
          </p>
          <ul className="svc-picker__list" id={listId}>
            <li>
              <button type="button" className="svc-option" onClick={() => choose('')}>
                <span className="svc-option__name">Не знаю, нужна консультация</span>
              </button>
            </li>
            {results.slice(0, MAX_RESULTS).map((o) => (
              <li key={o.value}>
                <button type="button" className="svc-option" onClick={() => choose(o.value)} aria-current={o.value === value ? 'true' : undefined}>
                  <span className="svc-option__name">{o.label}</span>
                  <span className="svc-option__meta">
                    {o.categoryName}
                    {o.priceText && <strong> · {o.priceText}</strong>}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          {selected && (
            <button type="button" className="link-button" onClick={() => setOpen(false)}>
              Оставить «{selected.label}»
            </button>
          )}
        </div>
      )}
      {error && (
        <p className="field__error" id={errorId}>
          <Icon name="alert" size={16} /> {error}
        </p>
      )}
    </fieldset>
  )
}
