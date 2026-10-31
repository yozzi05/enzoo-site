'use client'

import { openCookieSettings } from '@/lib/consent'

export function CookieSettingsLink() {
  return (
    <button type="button" className="footer__link-button" onClick={openCookieSettings}>
      Настройки cookie
    </button>
  )
}
