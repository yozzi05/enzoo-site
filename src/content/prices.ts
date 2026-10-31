/**
 * Утверждённый прайс клиники - единый источник цен для всего сайта:
 * полного прайса, страниц направлений, каталога, формы заявки и сервера.
 *
 * Источник: «Прайс.pdf», предоставлен владельцем 31.10.2026 (90 позиций).
 * Старый прайс enzoo24.ru хранится справочно в reference/ и здесь не используется.
 * ID позиций стабильны: меняйте название и цену, но не ID.
 */

export type Species = 'cat' | 'dog' | 'any'

export type Price =
  | { kind: 'fixed'; amount: number }
  | { kind: 'from'; amount: number }
  | { kind: 'range'; min: number; max: number }
  | { kind: 'request' }

export type PriceItem = {
  id: string
  /** slug направления из services.ts */
  category: string
  /** Раздел исходного прайса */
  section: string
  name: string
  price: Price
  /** «за сутки», «за час», «за проекцию»… */
  unit?: string
  species: Species
  weight?: string
  complexity?: string
  includes?: string[]
  excludes?: string[]
  /** Существенное условие, всегда показывается рядом с суммой */
  note?: string
  /** Есть расходы сверх указанной суммы (медикаменты, вакцина и т. п.) */
  extraCosts?: boolean
}

export const pricesApprovedAt = '2026-10-31'
export const pricesSource = 'Прайс.pdf (предоставлен клиникой)'

const fixed = (amount: number): Price => ({ kind: 'fixed', amount })

type Raw = Omit<PriceItem, 'category' | 'section' | 'species'> & { species?: Species }
const make = (category: string, section: string, raw: Raw[]): PriceItem[] => raw.map((i) => ({ species: 'any', ...i, category, section }))

/* ——— Терапия ——— */
const therapy = make('therapy', 'Терапия', [
  { id: 'th-primary-exam', name: 'Первичный осмотр', price: fixed(1000) },
  { id: 'th-repeat-exam', name: 'Повторный осмотр', price: fixed(500) },
  { id: 'th-chief-primary', name: 'Первичный приём главного врача', price: fixed(1500) },
  { id: 'th-derm-primary', name: 'Первичный осмотр дерматолога', price: fixed(1200) },
  { id: 'th-aspiration-1', name: 'Аспирация воздуха / жидкости из грудной / брюшной полости', complexity: '1 категория', price: fixed(600) },
  { id: 'th-aspiration-2', name: 'Аспирация воздуха / жидкости из грудной / брюшной полости', complexity: '2 категория', price: fixed(1200) },
  { id: 'th-aspiration-3', name: 'Аспирация воздуха / жидкости из грудной / брюшной полости', complexity: '3 категория', price: fixed(1800) },
  { id: 'th-drug-admin', name: 'Введение лекарственных средств (орально, ректально, вагинально)', price: fixed(250), extraCosts: true },
  { id: 'th-blood-draw', name: 'Взятие крови', price: fixed(400) },
  { id: 'th-scrapings', name: 'Взятие соскобов', price: fixed(350) },
  { id: 'th-iv-drip-first-hour', name: 'Внутривенное введение препарата капельно, первый час', unit: 'за первый час', price: fixed(400), extraCosts: true },
  { id: 'th-iv-drip-next-hour', name: 'Внутривенное введение препарата капельно, каждый последующий час', unit: 'за каждый последующий час', price: fixed(150), extraCosts: true },
  { id: 'th-iv-bolus', name: 'Внутривенные инъекции струйно', price: fixed(400), extraCosts: true },
  { id: 'th-im-sc-injection', name: 'Внутримышечное, подкожное введение препаратов', price: fixed(100), extraCosts: true },
  { id: 'th-sc-drip', name: 'Подкожное введение препарата капельно', price: fixed(300), extraCosts: true },
  { id: 'th-blood-pressure', name: 'Измерение артериального давления', price: fixed(300) },
  { id: 'th-cath-male-1', name: 'Катетеризация мочевого пузыря кота / кобеля', complexity: '1 категория', price: fixed(1200) },
  { id: 'th-cath-male-2', name: 'Катетеризация мочевого пузыря кота / кобеля', complexity: '2 категория', price: fixed(1800) },
  { id: 'th-cath-female-1', name: 'Катетеризация мочевого пузыря кошки / суки', complexity: '1 категория', price: fixed(1500) },
  { id: 'th-cath-female-2', name: 'Катетеризация мочевого пузыря кошки / суки', complexity: '2 категория', price: fixed(2200) },
  { id: 'th-lum', name: 'ЛЮМ-диагностика', price: fixed(300) },
  { id: 'th-treatment-1', name: 'Обработка', complexity: '1 категория', price: fixed(300) },
  { id: 'th-treatment-2', name: 'Обработка', complexity: '2 категория', price: fixed(500) },
  { id: 'th-urine-massage', name: 'Отведение мочи массажем через брюшную стенку (без катетеризации)', price: fixed(500) },
  { id: 'th-iv-catheter', name: 'Постановка внутривенного катетера', price: fixed(400) },
  { id: 'th-claws-cat-1', name: 'Стрижка когтей у кошки', species: 'cat', complexity: '1 категория', price: fixed(300) },
  { id: 'th-claws-cat-2', name: 'Стрижка когтей у кошки', species: 'cat', complexity: '2 категория', price: fixed(350) },
  { id: 'th-claws-dog-1', name: 'Стрижка когтей у собаки', species: 'dog', complexity: '1 категория', price: fixed(500) },
  { id: 'th-claws-dog-2', name: 'Стрижка когтей у собаки', species: 'dog', complexity: '2 категория', price: fixed(600) },
  { id: 'th-glucose-curve', name: 'Тест на глюкозу при выведении сахарной кривой', unit: 'за тест', price: fixed(350) },
  { id: 'th-thoracocentesis-1', name: 'Торакоцентез', complexity: '1 категория', price: fixed(1000) },
  { id: 'th-thoracocentesis-2', name: 'Торакоцентез', complexity: '2 категория', price: fixed(1500) },
  { id: 'th-tick-removal', name: 'Удаление клещей', price: fixed(100) },
  { id: 'th-ixodid-tick-removal', name: 'Удаление иксодового клеща', price: fixed(200) },
  { id: 'th-paraanal', name: 'Удаление секрета параанальных желёз', price: fixed(600) },
  { id: 'th-restraint-aggr-1', name: 'Фиксация агрессивного животного', complexity: '1 категория', price: fixed(300) },
  { id: 'th-restraint-aggr-2', name: 'Фиксация агрессивного животного', complexity: '2 категория', price: fixed(600) },
  { id: 'th-restraint-calm', name: 'Фиксация неагрессивного животного', price: fixed(400) },
])

/* Анализы из раздела «Терапия» исходного прайса - направление «Лабораторные исследования» */
const laboratory = make('laboratory', 'Терапия', [
  { id: 'lab-cbc', name: 'Общий анализ крови', price: fixed(700) },
  { id: 'lab-biochem-16', name: 'Биохимический анализ крови (16 показателей)', price: fixed(3400) },
  { id: 'lab-biochem-11', name: 'Биохимический анализ крови (11 показателей)', price: fixed(2400) },
  { id: 'lab-biochem-8', name: 'Биохимический анализ крови (8 показателей)', price: fixed(2200) },
])

/* ——— Стационар ——— */
const hospital = make('hospital', 'Стационар', [
  {
    id: 'hosp-hotel-day',
    name: 'Отель (суточное содержание)',
    unit: 'за сутки',
    price: fixed(1500),
    note: 'Содержание здорового животного, не медицинский стационар',
  },
  { id: 'hosp-day-1', name: 'Стационар (суточное содержание)', complexity: '1 категория', unit: 'за сутки', price: fixed(1800), extraCosts: true },
  { id: 'hosp-day-2', name: 'Стационар (суточное содержание)', complexity: '2 категория', unit: 'за сутки', price: fixed(2100), extraCosts: true },
  { id: 'hosp-day-3', name: 'Стационар (суточное содержание)', complexity: '3 категория', unit: 'за сутки', price: fixed(2700), extraCosts: true },
  { id: 'hosp-1h', name: 'Стационар, 1 час', unit: 'за час', price: fixed(100), extraCosts: true },
  { id: 'hosp-12h', name: 'Стационар, 12 часов', unit: 'за 12 часов', price: fixed(900), extraCosts: true },
  { id: 'hosp-oxygen-1h', name: 'Оксигенотерапия, 1 час', unit: 'за час', price: fixed(300) },
  { id: 'hosp-oxygen-24h', name: 'Оксигенотерапия, 24 часа', unit: 'за 24 часа', price: fixed(3600) },
])

/* ——— Общая хирургия ——— */
const castration = make('castration', 'Общая хирургия', [
  { id: 'surg-spay-cat', name: 'Стерилизация кошки', species: 'cat', price: fixed(4900) },
  { id: 'surg-neuter-cat', name: 'Кастрация кота', species: 'cat', price: fixed(2900) },
  { id: 'surg-neuter-cat-cryptorchid', name: 'Кастрация кота-крипторха', species: 'cat', price: fixed(4200) },
])

const surgery = make('surgery', 'Общая хирургия', [
  { id: 'surg-abscess', name: 'Вскрытие абсцесса', price: fixed(1800), excludes: ['медикаменты'] },
  { id: 'surg-suture-care', name: 'Обработка швов', price: fixed(300) },
  { id: 'surg-suture-removal-1', name: 'Снятие швов', complexity: '1 категория', price: fixed(300) },
  { id: 'surg-suture-removal-2', name: 'Снятие швов', complexity: '2 категория', price: fixed(400) },
  { id: 'surg-drain-1', name: 'Постановка дренажа', complexity: '1 категория', price: fixed(500) },
  { id: 'surg-drain-2', name: 'Постановка дренажа', complexity: '2 категория', price: fixed(1000) },
])

/* ——— Рентген ——— */
const xray = make('xray', 'Рентген', [
  { id: 'xray-1-projection', name: 'Рентгенография, 1 проекция', unit: 'за исследование', price: fixed(1000) },
  { id: 'xray-2-projections', name: 'Рентгенография, 2 проекции', unit: 'за исследование', price: fixed(1700) },
  { id: 'xray-restraint', name: 'Фиксация животного при рентгенографии', price: fixed(400) },
  { id: 'xray-hip-dysplasia', name: 'Рентгенологическое исследование на дисплазию ТБС', price: fixed(2400), excludes: ['заключение'] },
  { id: 'xray-consumables', name: 'Расходные материалы при рентгенографии', price: fixed(100) },
])

/* ——— Вакцинация (без стоимости вакцин) ——— */
const vaccination = make('vaccination', 'Вакцинация', [
  { id: 'vac-passport', name: 'Заведение «Паспорта домашнего животного»', price: fixed(300) },
  { id: 'vac-deworming-mark', name: 'Отметка в ветеринарном паспорте о дегельминтизации и дезинсекции', price: fixed(100) },
  { id: 'vac-exam-primary', name: 'Профилактический клинический осмотр при первичной и ежегодной вакцинации', price: fixed(350), excludes: ['вакцина'], extraCosts: true },
  { id: 'vac-exam-revaccination', name: 'Профилактический клинический осмотр при ревакцинации', price: fixed(250), excludes: ['вакцина'], extraCosts: true },
])

/* ——— УЗИ ——— */
const ultrasound = make('ultrasound', 'УЗИ', [
  { id: 'us-conclusion', name: 'Заключение УЗИ', price: fixed(600) },
  { id: 'us-abdomen', name: 'УЗИ брюшной полости (с исследованием желудка и кишечника)', price: fixed(2000) },
  { id: 'us-pelvis', name: 'УЗИ малого таза', price: fixed(1000) },
  { id: 'us-one-organ', name: 'УЗИ одного органа', unit: 'за орган', price: fixed(1000) },
  { id: 'us-pregnancy', name: 'УЗИ органов малого таза при беременности', price: fixed(1000) },
])

/* ——— Груминг ——— */
const groomingNote = 'Категорию определяет мастер по размеру питомца и состоянию шерсти'
const grooming = make('grooming', 'Груминг', [
  { id: 'gr-haircut-1', name: 'Стрижка', complexity: '1 категория', price: fixed(1700), note: groomingNote },
  { id: 'gr-haircut-2', name: 'Стрижка', complexity: '2 категория', price: fixed(2000), note: groomingNote },
  { id: 'gr-haircut-3', name: 'Стрижка', complexity: '3 категория', price: fixed(2200), note: groomingNote },
  { id: 'gr-bath-1', name: 'Купание', complexity: '1 категория', price: fixed(1200), note: groomingNote },
  { id: 'gr-bath-2', name: 'Купание', complexity: '2 категория', price: fixed(1700), note: groomingNote },
  { id: 'gr-bath-3', name: 'Купание', complexity: '3 категория', price: fixed(2200), note: groomingNote },
  { id: 'gr-deshed-1', name: 'Экспресс-линька', complexity: '1 категория', price: fixed(1200), note: groomingNote },
  { id: 'gr-deshed-2', name: 'Экспресс-линька', complexity: '2 категория', price: fixed(1700), note: groomingNote },
  { id: 'gr-deshed-3', name: 'Экспресс-линька', complexity: '3 категория', price: fixed(2200), note: groomingNote },
  { id: 'gr-ears', name: 'Санация ушей', price: fixed(200) },
  { id: 'gr-eyes', name: 'Санация глаз', price: fixed(100) },
  { id: 'gr-claws', name: 'Подрезание когтей', price: fixed(300) },
  { id: 'gr-ingrown-claws', name: 'Подрезание вросших когтей', price: fixed(500) },
  { id: 'gr-parasites', name: 'Обработка от паразитов', price: fixed(500) },
  {
    id: 'gr-sedation',
    name: 'Седация при груминге',
    price: fixed(500),
    note: 'Только по решению ветеринарного врача после осмотра',
  },
  { id: 'gr-aggression', name: 'Надбавка за агрессивное поведение', price: fixed(500), unit: 'надбавка к процедуре' },
  {
    id: 'gr-complex-haircut',
    name: 'Комплекс: стрижка, купание, подрезание когтей, санация ушей и глаз',
    price: { kind: 'range', min: 2700, max: 3200 },
    excludes: ['седация'],
  },
  {
    id: 'gr-complex-deshed',
    name: 'Комплекс: вычёсывание, купание, подрезание когтей, санация ушей и глаз',
    price: { kind: 'range', min: 2700, max: 3200 },
    excludes: ['седация'],
  },
])

export const priceItems: PriceItem[] = [...therapy, ...laboratory, ...hospital, ...castration, ...surgery, ...xray, ...vaccination, ...ultrasound, ...grooming]

const byId = new Map(priceItems.map((i) => [i.id, i]))

export function getPriceItem(id: string): PriceItem | undefined {
  return byId.get(id)
}

export function pricesFor(category: string): PriceItem[] {
  return priceItems.filter((i) => i.category === category)
}

export const speciesLabels: Record<Species, string> = {
  any: 'Любой вид',
  cat: 'Кошки',
  dog: 'Собаки',
}

const rub = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 })
const n = (x: number) => rub.format(x).replace(/\s/g, ' ')

/** Единый формат суммы: «1 500 ₽», «от 1 500 ₽», «2 700-3 200 ₽», «по запросу». */
export function formatPrice(p: Price): string {
  switch (p.kind) {
    case 'fixed':
      return `${n(p.amount)} ₽`
    case 'from':
      return `от ${n(p.amount)} ₽`
    case 'range':
      return `${n(p.min)}-${n(p.max)} ₽`
    default:
      return 'Стоимость по запросу'
  }
}

/** Условия рядом с ценой: категория, вид, вес, исключения, примечание. */
export function priceConditions(i: PriceItem): string[] {
  const out: string[] = []
  if (i.complexity) out.push(i.complexity)
  if (i.species !== 'any') out.push(speciesLabels[i.species])
  if (i.weight) out.push(i.weight)
  if (i.includes?.length) out.push(`входит: ${i.includes.join(', ')}`)
  if (i.excludes?.length) out.push(`не входит: ${i.excludes.join(', ')}`)
  if (i.note) out.push(i.note)
  return out
}

/** Нужна ли оговорка «итоговая стоимость уточняется в клинике». */
export function needsFinalPriceNote(i: PriceItem): boolean {
  return i.price.kind !== 'fixed' || Boolean(i.extraCosts) || Boolean(i.excludes?.length)
}

export const finalPriceNote = 'Итоговая стоимость зависит от объёма помощи и уточняется в клинике.'

/** Подпись цены, по которой сервер проверяет, что посетитель видел актуальную сумму. */
export function priceSignature(i: PriceItem): string {
  return [formatPrice(i.price), i.unit ?? '', ...priceConditions(i)].join('|')
}
