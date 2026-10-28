/**
 * Карта редиректов старых страниц enzoo24.ru на новые маршруты.
 * Работает, если старый домен будет направлен на этот сайт (миграция домена —
 * отдельное поручение). Полная таблица — REDIRECTS.md.
 */
const map: [string, string][] = [
  ['/home', '/'],
  ['/home/terapiya', '/services/therapy'],
  ['/home/surgery', '/services/surgery'],
  ['/home/castration', '/services/castration'],
  ['/home/vaccination', '/services/vaccination'],
  ['/home/laboratoriya', '/services/laboratory'],
  ['/home/hospital', '/services/hospital'],
  ['/home/stomatologiya', '/services/dentistry'],
  ['/home/oftalmologiya', '/services/ophthalmology'],
  ['/home/gruming', '/grooming'],
  ['/home/rentgen', '/services/xray'],
  ['/home/uzi', '/services/ultrasound'],
  ['/home/onko', '/services/oncology'],
  // Груминг живёт на собственном маршруте
  ['/services/grooming', '/grooming'],
]

export const legacyRedirects = map.map(([source, destination]) => ({ source, destination, permanent: true }))
