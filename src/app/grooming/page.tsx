import type { Metadata } from 'next'
import Image from 'next/image'
import { Icon } from '@/components/Icon'
import { PageIntro } from '@/components/ui/PageIntro'
import { CallActions } from '@/components/ui/CallActions'
import { FaqList } from '@/components/ui/FaqList'
import { PriceNotice } from '@/components/sections/PriceNotice'
import { ServiceViewTracker } from '@/components/catalog/ServiceViewTracker'
import { grooming, photos } from '@/content/clinic'

export const metadata: Metadata = {
  title: 'Груминг для собак и кошек',
  description: 'Груминг-студия при ветеринарной клинике EnZoo в Махачкале: купание, стрижка, тримминг, вычёсывание и гигиена для собак и кошек. Запись по телефону.',
  alternates: { canonical: '/grooming' },
}

export default function GroomingPage() {
  return (
    <>
      <ServiceViewTracker slug="grooming" />
      <PageIntro crumbs={[{ href: '/grooming', label: 'Груминг' }]} title="Груминг для собак и кошек" lead={grooming.lead}>
        <CallActions service="grooming" place="grooming-intro" appointmentLabel="Записаться на груминг" variant="dark" />
      </PageIntro>

      <section className="section">
        <div className="container">
          <div className="photo-row">
            <Image src={photos.catAfterGrooming.src} alt={photos.catAfterGrooming.alt} width={photos.catAfterGrooming.width} height={photos.catAfterGrooming.height} sizes="(min-width: 900px) 50vw, 100vw" priority />
            <Image src={photos.groomingTerrier.src} alt={photos.groomingTerrier.alt} width={photos.groomingTerrier.width} height={photos.groomingTerrier.height} sizes="(min-width: 900px) 25vw, 50vw" />
            <Image src={photos.groomingPoodle.src} alt={photos.groomingPoodle.alt} width={photos.groomingPoodle.width} height={photos.groomingPoodle.height} sizes="(min-width: 900px) 25vw, 50vw" />
          </div>
          <div className="media-split" style={{ marginTop: 56, alignItems: 'start' }}>
            <div>
              <h2>О студии</h2>
            </div>
            <div className="prose">
              {grooming.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section--surface" aria-labelledby="gservices-title">
        <div className="container">
          <h2 id="gservices-title" style={{ marginBottom: 24 }}>
            Виды ухода
          </h2>
          <ul className="service-grid">
            {grooming.services.map((s) => (
              <li key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ul>
          <h3 style={{ marginTop: 40 }}>Стрижки по породам</h3>
          <ul className="breeds">
            {grooming.breeds.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <ul className="limits">
            <li>
              <Icon name="info" />
              <span>
                Седация не применяется по умолчанию. Если без неё провести процедуру нельзя, возможность и условия определяет ветеринарный врач после осмотра питомца.
              </span>
            </li>
            <li>
              <Icon name="info" />
              <span>Время процедуры зависит от размера питомца, состояния шерсти и выбранного ухода - обычно 1,5-2 часа для стрижки.</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <PriceNotice titleId="grooming-price" service="grooming" />
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <h2>Вопросы о груминге</h2>
            <p className="lead split__lead">Время записи на груминг согласует администратор.</p>
          </div>
          <FaqList items={grooming.faq} />
        </div>
      </section>
    </>
  )
}
