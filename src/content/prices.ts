/**
 * Модель прайса. Публикуются только цены, подтверждённые владельцем клиники
 * (или опубликованные на enzoovet.ru). Старый прайс enzoo24.ru хранится
 * справочно в reference/ и сюда автоматически НЕ переносится.
 */

export type Species = 'cat' | 'dog' | 'rodent' | 'any'

export type PriceItem = {
  id: string
  name: string
  /** slug направления из services.ts */
  category: string
  /** Сумма в рублях; null — только «уточнить» */
  price: number | null
  /** true — «от N ₽» */
  isFrom?: boolean
  /** «за процедуру», «за час», «за сутки»… */
  unit: string
  species: Species
  /** «до 5 кг», «10–20 кг» */
  weight?: string
  /** «1 категория» и т. п. */
  complexity?: string
  includes?: string[]
  excludes?: string[]
  /** Существенное условие, всегда показывается рядом с суммой */
  note?: string
  /** Дата утверждения владельцем, ISO */
  approvedAt: string
}

/** Утверждённый прайс. Пусто: актуальные цены не предоставлены. */
export const approvedPrices: PriceItem[] = []

export const speciesLabels: Record<Species, string> = {
  any: 'Любой вид',
  cat: 'Кошки',
  dog: 'Собаки',
  rodent: 'Грызуны и мелкие животные',
}

/**
 * Демонстрационные позиции для проверки интерфейса фильтров в разработке.
 * Включаются только при NODE_ENV=development и PRICES_FIXTURE=1.
 * Суммы условные и не являются ценами клиники.
 */
export function getPrices(): { items: PriceItem[]; isFixture: boolean } {
  if (approvedPrices.length > 0) return { items: approvedPrices, isFixture: false }
  if (process.env.NODE_ENV === 'development' && process.env.PRICES_FIXTURE === '1') {
    return { items: fixturePrices, isFixture: true }
  }
  return { items: [], isFixture: false }
}

const fixtureDate = '2000-01-01'
const fixturePrices: PriceItem[] = [
  { id: 'f1', name: 'Первичный приём терапевта', category: 'therapy', price: 1, unit: 'за приём', species: 'any', approvedAt: fixtureDate, excludes: ['анализы', 'медикаменты'] },
  { id: 'f2', name: 'Кастрация кота', category: 'castration', price: 2, unit: 'за операцию', species: 'cat', approvedAt: fixtureDate, includes: ['операция'], excludes: ['анестезиологическое сопровождение', 'обследование'], note: 'Без учёта анестезии' },
  { id: 'f3', name: 'Кастрация кобеля', category: 'castration', price: 3, isFrom: true, unit: 'за операцию', species: 'dog', weight: 'до 5 кг', approvedAt: fixtureDate },
  { id: 'f4', name: 'Кастрация суки, кобеля-крипторха с брюшной локализацией семенника — длинное название для проверки переноса строк', category: 'castration', price: 4, unit: 'за операцию', species: 'dog', weight: '20–40 кг', complexity: '2 категория', approvedAt: fixtureDate },
  { id: 'f5', name: 'УЗИ брюшной полости', category: 'ultrasound', price: 5, unit: 'за исследование', species: 'any', approvedAt: fixtureDate, note: 'Заключение оплачивается отдельно' },
  { id: 'f6', name: 'Стационар, сутки', category: 'hospital', price: null, unit: 'за сутки', species: 'any', complexity: '1–4 категория', approvedAt: fixtureDate, note: 'Медикаменты отдельно' },
  { id: 'f7', name: 'Купание кошки', category: 'grooming', price: 7, unit: 'за процедуру', species: 'cat', complexity: '1 категория', approvedAt: fixtureDate },
  { id: 'f8', name: 'Первичный приём специалиста по грызунам', category: 'rodents', price: 8, unit: 'за приём', species: 'rodent', approvedAt: fixtureDate },
]
