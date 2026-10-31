'use client'

import Link from 'next/link'
import { useEffect, useId, useRef, useState } from 'react'
import { analyticsConfigured, getConsent, OPEN_SETTINGS_EVENT, saveConsent, type CookieConsent } from '@/lib/consent'

type Mode = 'hidden' | 'banner' | 'settings'

const categories: { key: keyof CookieConsent | 'necessary'; title: string; text: string }[] = [
  { key: 'necessary', title: 'Необходимые', text: 'Нужны для работы сайта и чтобы запомнить ваш выбор. Отключить нельзя.' },
  {
    key: 'analytics',
    title: 'Аналитика',
    text: analyticsConfigured
      ? 'Яндекс Метрика: обезличенная статистика посещений, чтобы понимать, как улучшить сайт.'
      : 'Яндекс Метрика: обезличенная статистика посещений. Сейчас на сайте не подключена - выбор сохранится на будущее.',
  },
  { key: 'maps', title: 'Сторонние сервисы', text: 'Карта Яндекс Карт на странице контактов. Сервис может устанавливать собственные cookie.' },
]

/**
 * Уведомление о cookie при первом посещении: «Принять все», «Отклонить», «Настроить».
 * Не блокирует страницу. Повторно открывается ссылкой «Настройки cookie» в подвале.
 */
export function CookieNotice() {
  const [mode, setMode] = useState<Mode>('hidden')
  const [draft, setDraft] = useState<CookieConsent>({ analytics: false, maps: false })
  const titleRef = useRef<HTMLHeadingElement>(null)
  const titleId = useId()

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- выбор хранится в браузере и известен только после гидратации
    if (getConsent() === null) setMode('banner')
    const open = () => {
      setDraft(getConsent() ?? { analytics: false, maps: false })
      setMode('settings')
      requestAnimationFrame(() => titleRef.current?.focus())
    }
    window.addEventListener(OPEN_SETTINGS_EVENT, open)
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, open)
  }, [])

  if (mode === 'hidden') return null

  const finish = (c: CookieConsent) => {
    saveConsent(c)
    setMode('hidden')
  }
  const acceptAll = () => finish({ analytics: true, maps: true })
  const rejectAll = () => finish({ analytics: false, maps: false })

  return (
    <section className={`cookie-notice${mode === 'settings' ? ' cookie-notice--settings' : ''}`} aria-labelledby={titleId}>
      <h2 className="cookie-notice__title" id={titleId} ref={titleRef} tabIndex={-1}>
        {mode === 'settings' ? 'Настройки cookie' : 'Мы используем cookie'}
      </h2>

      {mode === 'banner' ? (
        <>
          <p className="cookie-notice__text">
            Необходимые cookie нужны для работы сайта. С вашего согласия мы также используем аналитику и сторонние сервисы, например карту. Подробнее - в{' '}
            <Link href="/privacy">политике конфиденциальности</Link>.
          </p>
          <div className="cookie-notice__actions">
            <button type="button" className="btn btn--primary btn--sm" onClick={acceptAll}>
              Принять все
            </button>
            <button type="button" className="btn btn--outline btn--sm" onClick={rejectAll}>
              Отклонить
            </button>
            <button
              type="button"
              className="link-button"
              onClick={() => {
                setDraft(getConsent() ?? { analytics: false, maps: false })
                setMode('settings')
              }}
            >
              Настроить
            </button>
          </div>
        </>
      ) : (
        <>
          <ul className="cookie-cats">
            {categories.map((c) => {
              const id = `cookie-${c.key}`
              const necessary = c.key === 'necessary'
              const checked = necessary ? true : draft[c.key as keyof CookieConsent]
              return (
                <li key={c.key} className="cookie-cat">
                  <div>
                    <label htmlFor={id} className="cookie-cat__title">
                      {c.title}
                    </label>
                    <p className="cookie-cat__text" id={`${id}-desc`}>
                      {c.text}
                    </p>
                  </div>
                  <input
                    id={id}
                    type="checkbox"
                    role="switch"
                    className="switch"
                    checked={checked}
                    disabled={necessary}
                    aria-describedby={`${id}-desc`}
                    onChange={(e) => setDraft((d) => ({ ...d, [c.key]: e.target.checked }))}
                  />
                </li>
              )
            })}
          </ul>
          <div className="cookie-notice__actions">
            <button type="button" className="btn btn--primary btn--sm" onClick={() => finish(draft)}>
              Сохранить выбор
            </button>
            <button type="button" className="btn btn--outline btn--sm" onClick={acceptAll}>
              Принять все
            </button>
            <button type="button" className="btn btn--outline btn--sm" onClick={rejectAll}>
              Отклонить все
            </button>
          </div>
        </>
      )}
    </section>
  )
}
