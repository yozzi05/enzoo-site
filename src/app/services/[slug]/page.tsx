import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { site } from '@/config/site'
import { Icon } from '@/components/Icon'
import { PageIntro } from '@/components/ui/PageIntro'
import { FaqList } from '@/components/ui/FaqList'
import { CallActions } from '@/components/ui/CallActions'
import { PriceNotice } from '@/components/sections/PriceNotice'
import { ServiceViewTracker } from '@/components/catalog/ServiceViewTracker'
import { getService, serviceHref, services } from '@/content/services'
import { pricesFor } from '@/content/prices'
import { PriceList } from '@/components/prices/PriceRow'
import { RequestButton } from '@/components/appointment/AppointmentModal'

export const dynamicParams = false

export function generateStaticParams() {
  return services.filter((s) => !s.href).map((s) => ({ slug: s.slug }))
}

export async function generateMetadata(props: PageProps<'/services/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params
  const s = getService(slug)
  if (!s || s.href) return {}
  return {
    title: s.h1,
    description: s.metaDescription,
    alternates: { canonical: `/services/${s.slug}` },
    openGraph: { title: `${s.h1} - EnZoo, Махачкала`, description: s.metaDescription, url: `/services/${s.slug}` },
  }
}

export default async function ServicePage(props: PageProps<'/services/[slug]'>) {
  const { slug } = await props.params
  const s = getService(slug)
  if (!s || s.href) notFound()

  const prices = pricesFor(s.slug)
  const related = s.related.map(getService).filter((r) => r !== undefined)

  return (
    <>
      <ServiceViewTracker slug={s.slug} />
      <PageIntro crumbs={[{ href: '/services', label: 'Услуги' }, { href: `/services/${s.slug}`, label: s.name }]} title={s.h1} lead={s.summary}>
        <CallActions service={s.slug} place="service-intro" variant="dark" />
      </PageIntro>

      <section className="section section--tight">
        <div className="container service-layout">
          <div>
            <div className="content-block intro-text">
              {s.intro.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            <div className="content-block" id="procedures">
              <h2>Что входит в направление</h2>
              {s.procedures.map((b, i) => (
                <div key={b.title ?? i} className="proc-block">
                  {b.title && <h3>{b.title}</h3>}
                  <ul className="proc-list">
                    {b.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="content-block">
              <h2>Как обратиться</h2>
              <ol className="order-list">
                <li>
                  <span>
                    Позвоните по номеру{' '}
                    <a href={site.phone.href} data-track="call_click" data-place="service-order" data-service={s.slug}>
                      {site.phone.display}
                    </a>{' '}
                    или <Link href={`/appointment?service=${s.slug}`}>оставьте заявку</Link> - администратор подтвердит время.
                  </span>
                </li>
                <li>
                  <span>Если ситуация срочная, не ждите ответа на заявку - звоните сразу.</span>
                </li>
                <li>
                  <span>Возьмите ветеринарный паспорт, результаты прошлых анализов и исследований, список препаратов. Правила подготовки к конкретной процедуре уточните у администратора.</span>
                </li>
              </ol>
            </div>

            {s.limits.length > 0 && (
              <div className="content-block">
                <h2>Важно знать</h2>
                <ul className="limits">
                  {s.limits.map((l) => (
                    <li key={l}>
                      <Icon name="info" />
                      <span>{l}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {prices.length > 0 ? (
              <div className="content-block" id="prices">
                <h2>Цены</h2>
                <p className="muted" style={{ marginBottom: 12 }}>
                  Цена указана за отдельную процедуру. Итоговая стоимость зависит от объёма помощи и уточняется в клинике.
                </p>
                <PriceList items={prices} />
                <p style={{ marginTop: 16 }}>
                  <Link href={`/prices?cat=${s.slug}`} className="link-arrow">
                    Все цены клиники <Icon name="arrow" size={18} />
                  </Link>
                </p>
              </div>
            ) : (
              <div className="content-block">
                <PriceNotice titleId="service-price" service={s.slug} />
              </div>
            )}

            {s.faq.length > 0 && (
              <div className="content-block">
                <h2>Частые вопросы</h2>
                <FaqList items={s.faq} />
              </div>
            )}

            {related.length > 0 && (
              <div className="content-block">
                <h2>Связанные направления</h2>
                <ul className="related">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link href={serviceHref(r)}>
                        {r.name} <Icon name="arrow" size={18} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside className="service-aside" aria-label="Запись">
            <div className="aside-card aside-card--navy">
              <h2>Записаться: {s.name}</h2>
              <p>Заявка - не бронь: администратор перезвонит и подтвердит время приёма.</p>
              <RequestButton serviceId={s.slug} className="btn btn--primary" />
              <a href={site.phone.href} className="aside-card__phone" data-track="call_click" data-place="service-aside" data-service={s.slug}>
                {site.phone.display}
              </a>
              <p>{site.hours.label} · {site.address.short}</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
