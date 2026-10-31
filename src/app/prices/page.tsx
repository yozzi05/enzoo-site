import type { Metadata } from 'next'
import Link from 'next/link'
import { site } from '@/config/site'
import { Icon } from '@/components/Icon'
import { PageIntro } from '@/components/ui/PageIntro'
import { FaqList } from '@/components/ui/FaqList'
import { PriceExplorer } from '@/components/prices/PriceExplorer'
import { RequestButton } from '@/components/appointment/AppointmentModal'
import { priceItems, pricesApprovedAt } from '@/content/prices'
import { serviceHref, services } from '@/content/services'

export const metadata: Metadata = {
  title: 'Цены на услуги',
  description: 'Прайс ветеринарной клиники EnZoo в Махачкале: приём, анализы, стационар, хирургия, рентген, УЗИ, вакцинация, груминг. Заявка на любую услугу.',
  alternates: { canonical: '/prices' },
}

const faq = [
  {
    q: 'Это окончательная стоимость лечения?',
    a: 'Нет. В прайсе указана цена отдельной процедуры. Если понадобятся другие процедуры, анализы, медикаменты или стационар, итоговая сумма будет выше - её назовут в клинике.',
  },
  { q: 'Входит ли стоимость вакцины в вакцинацию?', a: 'Нет, вакцина оплачивается отдельно от осмотра.' },
  { q: 'Как узнать цену услуги, которой нет в списке?', a: 'Позвоните администратору или оставьте заявку с нужным направлением - стоимость уточнят в клинике.' },
]

const date = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

export default function PricesPage() {
  const categories = services.map((s) => ({ slug: s.slug, name: s.name }))
  const unpriced = services.filter((s) => !priceItems.some((i) => i.category === s.slug))
  return (
    <>
      <PageIntro
        crumbs={[{ href: '/prices', label: 'Цены' }]}
        title="Цены на услуги"
        lead="Цены указаны за отдельные процедуры. Нажмите «Оставить заявку» у нужной услуги - она подставится в форму вместе с ценой и условиями."
      >
        <div className="actions">
          <a href={site.phone.href} className="btn btn--primary" data-track="call_click" data-place="prices-intro">
            <Icon name="phone" size={18} /> Позвонить
          </a>
          <Link href="/appointment" className="btn btn--ghost-light">
            Общая заявка
          </Link>
        </div>
      </PageIntro>

      <section className="section section--tight" aria-labelledby="pricelist-title">
        <div className="container">
          <h2 id="pricelist-title" className="visually-hidden">
            Прайс
          </h2>
          <PriceExplorer items={priceItems} categories={categories} />
          <p className="photo-note">Прайс утверждён клиникой {date.format(new Date(pricesApprovedAt))} Итоговая стоимость зависит от объёма помощи и уточняется в клинике.</p>
        </div>
      </section>

      {unpriced.length > 0 && (
        <section className="section section--tight" aria-labelledby="ask-title">
          <div className="container">
            <h2 id="ask-title">Стоимость по запросу</h2>
            <p className="lead" style={{ margin: '12px 0 24px' }}>
              По этим направлениям цены не опубликованы - их назовёт администратор. Оставьте заявку или позвоните: {site.phone.display}.
            </p>
            <ul className="price-dirs">
              {unpriced.map((s) => (
                <li key={s.slug}>
                  <span className="price-dirs__name">
                    <Link href={serviceHref(s)}>{s.name}</Link>
                  </span>
                  <RequestButton serviceId={s.slug} srLabel={s.name} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="section section--tight">
        <div className="container split">
          <div>
            <h2>Вопросы о стоимости</h2>
          </div>
          <FaqList items={faq} />
        </div>
      </section>
    </>
  )
}
