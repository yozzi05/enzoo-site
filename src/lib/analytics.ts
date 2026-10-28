/**
 * Аналитика без персональных данных. Счётчик подключается только при заданном
 * NEXT_PUBLIC_YM_ID (Яндекс Метрика клиники). Параметры событий — лишь slug услуги
 * и тип ошибки; имена, телефоны и комментарии не передаются.
 */
export type AnalyticsEvent =
  | 'call_click'
  | 'messenger_click'
  | 'route_click'
  | 'appointment_start'
  | 'appointment_success'
  | 'appointment_error'
  | 'service_view'

type Params = { service?: string; place?: string; reason?: string }

declare global {
  interface Window {
    ym?: (id: number, action: string, goal: string, params?: Params) => void
  }
}

const ymId = Number(process.env.NEXT_PUBLIC_YM_ID || 0)

export function track(event: AnalyticsEvent, params: Params = {}) {
  if (typeof window === 'undefined') return
  const safe: Params = {}
  if (params.service) safe.service = params.service.slice(0, 40)
  if (params.place) safe.place = params.place.slice(0, 40)
  if (params.reason) safe.reason = params.reason.slice(0, 40)
  if (ymId && typeof window.ym === 'function') window.ym(ymId, 'reachGoal', event, safe)
  window.dispatchEvent(new CustomEvent('enzoo:analytics', { detail: { event, ...safe } }))
}
