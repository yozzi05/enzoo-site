import type { Metadata } from 'next'
import Link from 'next/link'
import { site } from '@/config/site'
import { Icon } from '@/components/Icon'
import { PageIntro } from '@/components/ui/PageIntro'
import { FaqList } from '@/components/ui/FaqList'
import { PriceExplorer } from '@/components/prices/PriceExplorer'
import { getPrices } from '@/content/prices'
import { serviceHref, services } from '@/content/services'

export const metadata: Metadata = {
  title: 'Стоимость услуг',
  description: 'Как узнать стоимость услуг ветеринарной клиники EnZoo в Махачкале: от чего зависит цена, как уточнить её по телефону или через заявку.',
  alternates: { canonical: '/prices' },
}

const factors = [
  { title: 'Вид и вес питомца', text: 'Для многих процедур цена различается для кошек, собак разных весовых категорий и мелких животных.' },
  { title: 'Сложность случая', text: 'Операции и процедуры делятся на категории сложности — её определяет врач после осмотра.' },
  { title: 'Медикаменты и материалы', text: 'Часть позиций указывается без стоимости препаратов, вакцин, расходных материалов.' },
  { title: 'Сопутствующие услуги', text: 'Анестезия, обследование, стационар оплачиваются отдельно, если они нужны.' },
]

const faq = [
  { q: 'Почему на сайте нет точных цен?', a: 'Стоимость зависит от вида, веса питомца и сложности случая, поэтому её удобнее уточнить у администратора. Как только клиника утвердит актуальный прайс, он появится на этой странице.' },
  { q: 'Можно ли узнать цену операции заранее?', a: 'Администратор подскажет ориентир по телефону. Итоговую сумму врач называет после осмотра и, при необходимости, обследования.' },
  { q: 'Входит ли стоимость вакцины в вакцинацию?', a: 'Нет, вакцина оплачивается отдельно от осмотра и введения.' },
]

export default function PricesPage() {
  const { items, isFixture } = getPrices()
  const categories = services.map((s) => ({ slug: s.slug, name: s.name }))
  return (
    <>
      <PageIntro
        crumbs={[{ href: '/prices', label: 'Цены' }]}
        title="Стоимость услуг"
        lead="Цена зависит от питомца и объёма помощи. Уточните её по телефону или оставьте заявку с выбранной услугой — администратор перезвонит."
      >
        <div className="actions">
          <a href={site.phone.href} className="btn btn--primary" data-track="call_click" data-place="prices-intro">
            <Icon name="phone" size={18} /> Уточнить стоимость
          </a>
          <Link href="/appointment" className="btn btn--ghost-light">
            Оставить заявку
          </Link>
        </div>
      </PageIntro>

      {items.length > 0 && (
        <section className="section section--tight" aria-labelledby="pricelist-title">
          <div className="container">
            {isFixture && <p className="fixture-banner">Демонстрационные данные для проверки интерфейса. Это не цены клиники.</p>}
            <h2 id="pricelist-title" className="visually-hidden">
              Прайс
            </h2>
            <PriceExplorer items={items} categories={categories} />
          </div>
        </section>
      )}

      <section className="section section--tight" aria-labelledby="factors-title">
        <div className="container">
          <h2 id="factors-title" style={{ marginBottom: 24 }}>
            От чего зависит стоимость
          </h2>
          <ul className="factors">
            {factors.map((f) => (
              <li key={f.title}>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {items.length === 0 && (
        <section className="section section--tight" aria-labelledby="ask-title">
          <div className="container">
            <h2 id="ask-title">Уточнить стоимость по направлению</h2>
            <p className="lead" style={{ margin: '12px 0 24px' }}>
              Выберите направление — заявка откроется с уже указанной услугой. Или просто позвоните: {site.phone.display}.
            </p>
            <ul className="price-dirs">
              {services.map((s) => (
                <li key={s.slug}>
                  <span className="price-dirs__name">
                    <Link href={serviceHref(s)}>{s.name}</Link>
                  </span>
                  <Link href={`/appointment?service=${s.slug}`} className="price-dirs__link">
                    Уточнить стоимость <Icon name="arrow" size={16} />
                  </Link>
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
