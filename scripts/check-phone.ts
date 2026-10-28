// Быстрая проверка маски телефона: node --experimental-strip-types scripts/check-phone.ts
import { formatPhone, toE164 } from '../src/lib/phone.ts'

function typeChars(chars: string) {
  let v = ''
  for (const c of chars) v = formatPhone(v + c)
  return v
}
const cases: [string, string, string | null][] = [
  ['typed 8-prefix', typeChars('89001234567'), '+79001234567'],
  ['typed 9...', typeChars('9001234567'), '+79001234567'],
  ['typed +7', typeChars('+79001234567'), '+79001234567'],
  ['paste +7 900 123 45 67', formatPhone('+7 900 123 45 67'), '+79001234567'],
  ['paste 8 (8722) 12-34-56', formatPhone('8 (8722) 12-34-56'), '+78722123456'],
  ['landline typed 8722...', typeChars('8722123456'), '+78722123456'],
  ['short', formatPhone('900123'), null],
]
let fail = 0
for (const [name, shown, expected] of cases) {
  const got = toE164(shown)
  const ok = got === expected
  if (!ok) fail++
  console.log(ok ? 'OK  ' : 'FAIL', name, '→', shown, got)
}
process.exit(fail ? 1 : 0)
