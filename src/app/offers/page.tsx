import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageIntro } from '@/components/ui/PageIntro'
import { offers } from '@/content/clinic'

export const metadata: Metadata = {
  title: 'Акции',
  description: 'Действующие предложения ветеринарной клиники EnZoo в Махачкале.',
  alternates: { canonical: '/offers' },
}

const date = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

/** Страница существует только при наличии подтверждённых предложений; иначе — 404. */
export default function OffersPage() {
  if (offers.length === 0) notFound()
  return (
    <>
      <PageIntro crumbs={[{ href: '/offers', label: 'Акции' }]} title="Акции" />
      <section className="section section--tight">
        <div className="container">
          <ul className="service-grid">
            {offers.map((o) => (
              <li key={o.id}>
                <h2 style={{ fontSize: '1.375rem', marginBottom: 8 }}>{o.title}</h2>
                <p>{o.text}</p>
                <ul className="prose" style={{ marginTop: 8 }}>
                  {o.terms.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                {o.validUntil && <p className="photo-note">Действует до {date.format(new Date(o.validUntil))}</p>}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
