import Link from 'next/link'
import { site } from '@/config/site'
import { Icon } from '@/components/Icon'

/** Блок о стоимости, пока утверждённый прайс не опубликован. */
export function PriceNotice({ titleId, service, showPricesLink = true }: { titleId: string; service?: string; showPricesLink?: boolean }) {
  return (
    <div className="price-notice">
      <div>
        <p className="eyebrow eyebrow--dark">Стоимость</p>
        <h2 id={titleId}>Как узнать стоимость</h2>
        <p className="price-notice__text">
          Стоимость зависит от вида и веса питомца, сложности случая и необходимых материалов. Администратор подскажет ориентир по телефону, а окончательную сумму врач
          назовёт после осмотра.
        </p>
      </div>
      <div className="price-notice__actions">
        <a href={site.phone.href} className="btn btn--primary" data-track="call_click" data-place="price" data-service={service}>
          <Icon name="phone" size={18} /> Уточнить стоимость
        </a>
        <Link href={service ? `/appointment?service=${service}` : '/appointment'} className="btn btn--outline">
          Оставить заявку
        </Link>
        {showPricesLink && (
          <Link href="/prices" className="link-arrow">
            Как формируется стоимость <Icon name="arrow" size={18} />
          </Link>
        )}
      </div>
    </div>
  )
}
