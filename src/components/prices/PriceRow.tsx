import { RequestButton } from '@/components/appointment/AppointmentModal'
import { formatPrice, priceConditions, type PriceItem } from '@/content/prices'

/** Строка прайса: название, условия, цена и «Оставить заявку». Условия видны без наведения. */
export function PriceRow({ item, showCategory }: { item: PriceItem; showCategory?: string }) {
  const conditions = priceConditions(item)
  return (
    <li className="price-row">
      <div className="price-row__main">
        <div className="price-row__name">{item.name}</div>
        {(showCategory || conditions.length > 0) && (
          <div className="price-row__meta">
            {showCategory && <span>{showCategory}</span>}
            {conditions.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
        )}
      </div>
      <div className="price-row__side">
        <div className="price-row__price">
          {formatPrice(item.price)}
          {item.unit && <span className="price-row__unit">{item.unit}</span>}
        </div>
        <RequestButton serviceId={item.id} srLabel={item.complexity ? `${item.name}, ${item.complexity}` : item.name} />
      </div>
    </li>
  )
}

/** Список цен направления. */
export function PriceList({ items }: { items: PriceItem[] }) {
  return (
    <ul className="price-table">
      {items.map((i) => (
        <PriceRow key={i.id} item={i} />
      ))}
    </ul>
  )
}
