import type { Metadata } from 'next'
import { PageIntro } from '@/components/ui/PageIntro'
import { ServiceCatalog, type CatalogEntry } from '@/components/catalog/ServiceCatalog'
import { PriceNotice } from '@/components/sections/PriceNotice'
import { catalogLinks, serviceGroups, serviceHref, services } from '@/content/services'
import { grooming } from '@/content/clinic'

export const metadata: Metadata = {
  title: 'Услуги и направления',
  description: 'Каталог услуг ветеринарной клиники EnZoo в Махачкале: терапия, диагностика, хирургия, вакцинация, стационар, стоматология, груминг. Поиск по процедурам.',
  alternates: { canonical: '/services' },
}

export default function ServicesPage() {
  const entries: CatalogEntry[] = [
    ...services.map((s) => ({
      name: s.name,
      summary: s.summary,
      href: serviceHref(s),
      group: s.group,
      procedures: s.slug === 'grooming' ? grooming.services.map((g) => g.title) : s.procedures.flatMap((b) => b.items),
      keywords: s.keywords,
    })),
    ...catalogLinks.map((c) => ({ ...c, procedures: [] })),
  ]
  return (
    <>
      <PageIntro
        crumbs={[{ href: '/services', label: 'Услуги' }]}
        title="Услуги клиники"
        lead="Выберите направление, чтобы узнать, что в него входит, как записаться и от чего зависит стоимость. Если не уверены, к кому обратиться, - позвоните, администратор подскажет."
      />
      <section className="section section--tight">
        <div className="container">
          <ServiceCatalog entries={entries} groups={serviceGroups} />
        </div>
      </section>
      <section className="section section--tight">
        <div className="container">
          <PriceNotice titleId="services-price" />
        </div>
      </section>
    </>
  )
}
