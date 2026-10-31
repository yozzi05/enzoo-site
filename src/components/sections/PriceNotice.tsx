import Link from 'next/link'
import { site } from '@/config/site'
import { Icon } from '@/components/Icon'
import { RequestButton } from '@/components/appointment/AppointmentModal'

/**
 * Блок о стоимости. Без service - ссылка на опубликованный прайс;
 * с service (направление без опубликованных цен) - уточнение стоимости.
 */
export function PriceNotice({ titleId, service }: { titleId: string; service?: string }) {
  if (!service) {
    return (
      <div className="price-notice">
        <div>
          <p className="eyebrow eyebrow--dark">Стоимость</p>
          <h2 id={titleId}>Цены на услуги</h2>
          <p className="price-notice__text">
            В прайсе - приём врача, анализы, стационар, хирургия, рентген, УЗИ, вакцинация и груминг. Цены указаны за отдельные процедуры; итоговая стоимость зависит от объёма
            помощи и уточняется в клинике.
          </p>
        </div>
        <div className="price-notice__actions">
          <Link href="/prices" className="btn btn--primary">
            Смотреть цены
          </Link>
          <a href={site.phone.href} className="btn btn--outline" data-track="call_click" data-place="price">
            <Icon name="phone" size={18} /> Позвонить
          </a>
        </div>
      </div>
    )
  }
  return (
    <div className="price-notice">
      <div>
        <p className="eyebrow eyebrow--dark">Стоимость</p>
        <h2 id={titleId}>Стоимость по запросу</h2>
        <p className="price-notice__text">
          Цены по этому направлению не опубликованы: они зависят от вида и веса питомца, сложности случая и необходимых материалов. Администратор назовёт ориентир по телефону,
          окончательную сумму - врач после осмотра.
        </p>
      </div>
      <div className="price-notice__actions">
        <a href={site.phone.href} className="btn btn--primary" data-track="call_click" data-place="price" data-service={service}>
          <Icon name="phone" size={18} /> Уточнить стоимость
        </a>
        <RequestButton serviceId={service} className="btn btn--outline" />
        <Link href="/prices" className="link-arrow">
          Все цены <Icon name="arrow" size={18} />
        </Link>
      </div>
    </div>
  )
}
