/**
 * Общая клиентская и серверная валидация заявки на приём.
 * Заявка - запрос на согласование визита, а не подтверждённая бронь.
 */
import { appointmentServiceOptions } from '@/content/services'
import { toE164 } from './phone'

export { formatPhone, phoneDigits, toE164 } from './phone'

export const LIMITS = {
  name: 60,
  comment: 500,
  service: 80,
  bodyBytes: 4096,
  maxDaysAhead: 90,
} as const

export const speciesOptions = [
  { value: 'cat', label: 'Кошка' },
  { value: 'dog', label: 'Собака' },
  { value: 'rodent', label: 'Грызун или кролик' },
  { value: 'ferret', label: 'Хорёк' },
  { value: 'other', label: 'Другое' },
] as const

export type AppointmentInput = {
  name: string
  phone: string
  species: string
  service: string
  comment: string
  date: string
  consent: boolean
  /** honeypot */
  website: string
}

export type AppointmentData = {
  name: string
  phone: string
  species: string | null
  service: string | null
  comment: string | null
  date: string | null
}

export type FieldErrors = Partial<Record<'name' | 'phone' | 'species' | 'service' | 'comment' | 'date' | 'consent', string>>

function todayIso(now = new Date()): string {
  const z = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
  return z.toISOString().slice(0, 10)
}

export function dateBounds(now = new Date()) {
  const min = todayIso(now)
  const maxD = new Date(now)
  maxD.setDate(maxD.getDate() + LIMITS.maxDaysAhead)
  return { min, max: todayIso(maxD) }
}

const serviceValues = new Set(appointmentServiceOptions.map((o) => o.value))
const speciesValues = new Set<string>(speciesOptions.map((o) => o.value))

// Управляющие символы, кроме перевода строки
const CONTROL = /[\u0000-\u0009\u000B-\u001F\u007F]/g

export function clean(s: unknown, max: number): string {
  if (typeof s !== 'string') return ''
  return s.replace(CONTROL, '').trim().slice(0, max)
}

export function validateAppointment(input: Partial<AppointmentInput>, now = new Date()): { ok: true; data: AppointmentData } | { ok: false; errors: FieldErrors } {
  const errors: FieldErrors = {}
  const name = clean(input.name, LIMITS.name + 1)
  const phone = toE164(typeof input.phone === 'string' ? input.phone : '')
  const species = clean(input.species, 20)
  const service = clean(input.service, LIMITS.service)
  const comment = clean(input.comment, LIMITS.comment + 1)
  const date = clean(input.date, 10)

  if (name.length < 2) errors.name = 'Укажите, как к вам обращаться'
  else if (name.length > LIMITS.name) errors.name = `Не больше ${LIMITS.name} символов`
  else if (!/^[\p{L}\s.'-]+$/u.test(name)) errors.name = 'Используйте только буквы'

  if (!phone) errors.phone = 'Введите номер полностью: +7 и 10 цифр'

  if (species && !speciesValues.has(species)) errors.species = 'Выберите вариант из списка'
  if (service && !serviceValues.has(service)) errors.service = 'Выберите услугу из списка'
  if (comment.length > LIMITS.comment) errors.comment = `Не больше ${LIMITS.comment} символов`

  if (date) {
    const { min, max } = dateBounds(now)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) errors.date = 'Укажите дату в формате ДД.ММ.ГГГГ'
    else if (date < min) errors.date = 'Дата не может быть в прошлом'
    else if (date > max) errors.date = `Выберите дату в пределах ${LIMITS.maxDaysAhead} дней`
  }

  if (input.consent !== true) errors.consent = 'Нужно согласие на обработку персональных данных'

  if (Object.keys(errors).length) return { ok: false, errors }
  return {
    ok: true,
    data: { name, phone: phone!, species: species || null, service: service || null, comment: comment || null, date: date || null },
  }
}

export function serviceLabel(value: string | null): string | null {
  if (!value) return null
  return appointmentServiceOptions.find((o) => o.value === value)?.label ?? null
}

export function speciesLabel(value: string | null): string | null {
  if (!value) return null
  return speciesOptions.find((o) => o.value === value)?.label ?? null
}
