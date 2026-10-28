import type { Metadata } from 'next'
import Link from 'next/link'
import { site } from '@/config/site'
import { PageIntro } from '@/components/ui/PageIntro'
import { ContactDetails, RouteLinks } from '@/components/sections/ContactSection'
import { MapEmbed } from '@/components/ui/MapEmbed'

export const metadata: Metadata = {
  title: 'Контакты и маршрут',
  description: `Ветеринарная клиника EnZoo: ${site.address.full}, ${site.address.landmark}. Круглосуточно. Телефон ${site.phone.display}.`,
  alternates: { canonical: '/contacts' },
}

export default function ContactsPage() {
  return (
    <>
      <PageIntro crumbs={[{ href: '/contacts', label: 'Контакты' }]} title="Контакты и маршрут" lead={`${site.address.city}, ${site.address.short} — ${site.address.landmark}.`} />
      <section className="section section--tight">
        <div className="container contact-section__grid">
          <div>
            <ContactDetails />
            <RouteLinks />
            <div className="contact-section__cta">
              <Link href="/appointment" className="btn btn--primary">
                Оставить заявку на приём
              </Link>
            </div>
            <div className="notice" style={{ marginTop: 32 }}>
              <div>
                <h3>Как добраться</h3>
                <p>
                  Клиника находится на первом этаже дома № 35 по проспекту Имама Шамиля, {site.address.landmark}. Если не можете найти вход, позвоните — администратор подскажет.
                </p>
              </div>
            </div>
          </div>
          <MapEmbed />
        </div>
      </section>
    </>
  )
}
