/**
 * Выбор посетителя по cookie. Хранится только в браузере (localStorage);
 * при недоступном хранилище уведомление просто покажется снова.
 */
export type CookieChoice = 'accepted' | 'declined'

const KEY = 'enzoo-cookie-choice'
export const CONSENT_EVENT = 'enzoo:cookie-choice'

export function getCookieChoice(): CookieChoice | null {
  try {
    const v = window.localStorage.getItem(KEY)
    return v === 'accepted' || v === 'declined' ? v : null
  } catch {
    return null
  }
}

export function setCookieChoice(choice: CookieChoice) {
  try {
    window.localStorage.setItem(KEY, choice)
  } catch {
    // хранилище недоступно (приватный режим) - выбор действует до перезагрузки
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: choice }))
}

/** Подключена ли аналитика, требующая согласия. */
export const hasOptionalCookies = /^\d+$/.test(process.env.NEXT_PUBLIC_YM_ID ?? '')
