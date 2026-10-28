/** Маска и нормализация российского номера телефона (без зависимостей). */

/** Оставляет только цифры, приводит к 10 цифрам российского номера без кода страны. */
export function phoneDigits(raw: string): string {
  const s = raw.trim()
  // Уже отформатированное значение: код страны +7 не считаем частью номера.
  let d = (s.startsWith('+7') ? s.slice(2) : s).replace(/\D/g, '')
  // 8XXXXXXXXXX или 7XXXXXXXXXX — 11 цифр с кодом страны/выхода.
  if (d.length >= 11 && (d.startsWith('7') || d.startsWith('8'))) d = d.slice(1)
  return d.slice(0, 10)
}

/** Форматирование при вводе и вставке: +7 (928) 222-00-88 */
export function formatPhone(raw: string): string {
  const d = phoneDigits(raw)
  if (!d) return ''
  let out = '+7 (' + d.slice(0, 3)
  if (d.length >= 3) out += ')'
  if (d.length > 3) out += ' ' + d.slice(3, 6)
  if (d.length > 6) out += '-' + d.slice(6, 8)
  if (d.length > 8) out += '-' + d.slice(8, 10)
  return out
}

export function toE164(raw: string): string | null {
  const d = phoneDigits(raw)
  return d.length === 10 ? '+7' + d : null
}
