import type { Faq } from '@/content/services'
import { Icon } from '@/components/Icon'

/** Вопросы на нативных <details>: работают без JS и с клавиатуры. */
export function FaqList({ items }: { items: Faq[] }) {
  return (
    <div className="faq">
      {items.map((f) => (
        <details key={f.q} className="faq__item">
          <summary>
            <span>{f.q}</span>
            <Icon name="chevron" size={20} className="faq__chevron" />
          </summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  )
}
