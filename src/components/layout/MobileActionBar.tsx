'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { site } from '@/config/site'
import { Icon } from '@/components/Icon'

/**
 * Нижняя панель на телефоне. Скрывается на странице заявки (не перекрывает
 * форму и кнопку отправки) и пока открыта экранная клавиатура (фокус в поле ввода).
 */
export function MobileActionBar() {
  const pathname = usePathname()
  const [typing, setTyping] = useState(false)

  useEffect(() => {
    const isField = (el: EventTarget | null) => el instanceof HTMLElement && el.matches('input, textarea, select, [contenteditable="true"]')
    const onIn = (e: FocusEvent) => setTyping(isField(e.target))
    const onOut = () => setTyping(false)
    document.addEventListener('focusin', onIn)
    document.addEventListener('focusout', onOut)
    return () => {
      document.removeEventListener('focusin', onIn)
      document.removeEventListener('focusout', onOut)
    }
  }, [])

  if (pathname === '/appointment') return null

  return (
    <div className="action-bar" data-hidden={typing || undefined}>
      <a href={site.phone.href} className="action-bar__btn action-bar__btn--call" data-track="call_click" data-place="action-bar">
        <Icon name="phone" size={20} /> Позвонить
      </a>
      <Link href="/appointment" className="action-bar__btn action-bar__btn--book">
        <Icon name="calendar" size={20} /> Записаться
      </Link>
    </div>
  )
}
