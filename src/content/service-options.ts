/**
 * Варианты выбора услуги в заявке: конкретные позиции прайса и общие направления.
 * Одна запись прайса (prices.ts) используется в прайсе, на страницах направлений,
 * в форме и на сервере.
 */
import { formatPrice, priceConditions, priceItems, needsFinalPriceNote, priceSignature, type PriceItem } from './prices'
import { services } from './services'

export type ServiceOption = {
  /** ID позиции прайса или slug направления */
  value: string
  kind: 'item' | 'direction'
  label: string
  /** slug направления */
  category: string
  categoryName: string
  priceText: string | null
  priceKind: PriceItem['price']['kind'] | null
  unit: string | null
  conditions: string[]
  finalPriceNote: boolean
  signature: string | null
}

const categoryName = (slug: string) => services.find((s) => s.slug === slug)?.name ?? slug

const itemOptions: ServiceOption[] = priceItems.map((i) => ({
  value: i.id,
  kind: 'item',
  label: i.complexity ? `${i.name} (${i.complexity})` : i.name,
  category: i.category,
  categoryName: categoryName(i.category),
  priceText: formatPrice(i.price),
  priceKind: i.price.kind,
  unit: i.unit ?? null,
  conditions: priceConditions(i).filter((c) => c !== i.complexity),
  finalPriceNote: needsFinalPriceNote(i),
  signature: priceSignature(i),
}))

const direction = (value: string, label: string, category = value): ServiceOption => ({
  value,
  kind: 'direction',
  label,
  category,
  categoryName: categoryName(category),
  priceText: null,
  priceKind: null,
  unit: null,
  conditions: [],
  finalPriceNote: false,
  signature: null,
})

const directionOptions: ServiceOption[] = [
  direction('consultation', 'Приём врача / нужна консультация', 'therapy'),
  ...services.map((s) => direction(s.slug, `${s.name}: подобрать услугу с администратором`)),
  direction('home-visit', 'Выезд врача', 'therapy'),
]

export const serviceOptions: ServiceOption[] = [...itemOptions, ...directionOptions]

const byValue = new Map(serviceOptions.map((o) => [o.value, o]))

export function getServiceOption(value: string | null | undefined): ServiceOption | undefined {
  return value ? byValue.get(value) : undefined
}
