'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getCookieChoice, hasOptionalCookies, setCookieChoice, type CookieChoice } from '@/lib/consent'

/**
 * Уведомление о cookie при первом посещении. Не блокирует страницу и не забирает фокус.
 * Если подключена Яндекс Метрика - можно принять или отклонить; без неё - только «Понятно».
 */
export function CookieNotice() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- выбор хранится в браузере и известен только после гидратации
    setVisible(getCookieChoice() === null)
  }, [])

  if (!visible) return null

  const choose = (c: CookieChoice) => {
    setCookieChoice(c)
    setVisible(false)
  }

  return (
    <section className="cookie-notice" aria-label="Уведомление о cookie">
      <p>
        {hasOptionalCookies
          ? 'Мы используем файлы cookie, чтобы сайт работал корректно, и сервис Яндекс Метрика для обезличенной статистики посещений.'
          : 'Сайт использует файлы cookie, в том числе сторонних сервисов (например, Яндекс Карт), чтобы работать корректно.'}{' '}
        Подробнее - в <Link href="/privacy">политике конфиденциальности</Link>.
      </p>
      <div className="cookie-notice__actions">
        {hasOptionalCookies ? (
          <>
            <button type="button" className="btn btn--primary btn--sm" onClick={() => choose('accepted')}>
              Принять
            </button>
            <button type="button" className="btn btn--outline btn--sm" onClick={() => choose('declined')}>
              Только необходимые
            </button>
          </>
        ) : (
          <button type="button" className="btn btn--primary btn--sm" onClick={() => choose('accepted')}>
            Понятно
          </button>
        )}
      </div>
    </section>
  )
}
