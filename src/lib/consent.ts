/**
 * Согласие посетителя на cookie по категориям. Хранится только в браузере (localStorage);
 * при недоступном хранилище уведомление просто покажется снова.
 *  - necessary: работа сайта, всегда включены (в том числе запоминание этого выбора);
 *  - analytics: Яндекс Метрика (если подключена);
 *  - maps: сторонние сервисы - карта Яндекс Карт на странице контактов.
 */
export type CookieConsent = { analytics: boolean; maps: boolean }

const KEY = 'enzoo-cookie-consent'
const VERSION = 1
export const CONSENT_EVENT = 'enzoo:cookie-consent'
export const OPEN_SETTINGS_EVENT = 'enzoo:cookie-settings'

export function getConsent(): CookieConsent | null {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return null
    const v = JSON.parse(raw) as { v?: number; analytics?: unknown; maps?: unknown }
    if (v.v !== VERSION) return null
    return { analytics: v.analytics === true, maps: v.maps === true }
  } catch {
    return null
  }
}

export function saveConsent(c: CookieConsent) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ v: VERSION, ...c, at: new Date().toISOString() }))
  } catch {
    // хранилище недоступно (приватный режим) - выбор действует до перезагрузки
  }
  window.dispatchEvent(new CustomEvent<CookieConsent>(CONSENT_EVENT, { detail: c }))
}

/** Открыть настройки cookie (ссылка в подвале). */
export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT))
}

/** Подписка на изменение согласия; сразу вызывает колбэк с текущим значением. */
export function onConsent(cb: (c: CookieConsent | null) => void): () => void {
  cb(getConsent())
  const h = (e: Event) => cb((e as CustomEvent<CookieConsent>).detail)
  window.addEventListener(CONSENT_EVENT, h)
  return () => window.removeEventListener(CONSENT_EVENT, h)
}

/** Подключена ли Яндекс Метрика клиники. */
export const analyticsConfigured = /^\d+$/.test(process.env.NEXT_PUBLIC_YM_ID ?? '')
