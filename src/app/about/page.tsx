import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Icon } from '@/components/Icon'
import { PageIntro } from '@/components/ui/PageIntro'
import { CallActions } from '@/components/ui/CallActions'
import { Steps } from '@/components/sections/Steps'
import { ContactSection } from '@/components/sections/ContactSection'
import { approach, photos } from '@/content/clinic'
import { primaryServices, serviceHref } from '@/content/services'

export const metadata: Metadata = {
  title: 'О клинике',
  description: 'Ветеринарная клиника EnZoo в Махачкале: круглосуточная работа, диагностика, лечение и груминг-студия по одному адресу - проспект Имама Шамиля, 35.',
  alternates: { canonical: '/about' },
}

const limits = [
  'В клинике нет инфекционного стационара: животных с инфекционными заболеваниями лечат амбулаторно. Если подозреваете инфекцию, предупредите об этом при звонке.',
  'Часть лабораторных исследований выполняется в партнёрской лаборатории - сроки зависят от вида анализа.',
  'Клиника работает круглосуточно, но приём отдельных специалистов, груминг и выезд врача проводятся по согласованию.',
]

export default function AboutPage() {
  return (
    <>
      <PageIntro crumbs={[{ href: '/about', label: 'О клинике' }]} title="О клинике EnZoo" lead={approach.lead}>
        <CallActions place="about-intro" variant="dark" />
      </PageIntro>

      <section className="section">
        <div className="container media-split">
          <div>
            <p className="eyebrow eyebrow--dark">Подход</p>
            <h2>Лечение и уход - по одному адресу</h2>
            <div className="prose" style={{ marginTop: 20 }}>
              {approach.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
          <figure style={{ margin: 0 }}>
            <Image src={photos.catOnCounter.src} alt={photos.catOnCounter.alt} width={photos.catOnCounter.width} height={photos.catOnCounter.height} sizes="(min-width: 1024px) 600px, 100vw" style={{ aspectRatio: '4 / 3', objectPosition: '50% 40%' }} />
          </figure>
        </div>
      </section>

      <section className="section section--surface" aria-labelledby="facts-title">
        <div className="container about-teaser">
          <div>
            <p className="eyebrow eyebrow--dark">Особенности</p>
            <h2 id="facts-title">Что важно знать о клинике</h2>
          </div>
          <dl className="facts">
            {approach.facts.map((f) => (
              <div key={f.title}>
                <dt>{f.title}</dt>
                <dd>{f.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section" aria-labelledby="dirs-title">
        <div className="container">
          <div className="section__head">
            <h2 id="dirs-title">Направления работы</h2>
            <Link href="/services" className="link-arrow">
              Каталог услуг <Icon name="arrow" size={18} />
            </Link>
          </div>
          <ul className="service-rows" style={{ marginTop: 0 }}>
            {primaryServices.map((s) => (
              <li key={s.slug}>
                <Link href={serviceHref(s)}>
                  <span className="service-rows__name">{s.name}</span>
                  <span className="service-rows__text">{s.summary}</span>
                  <Icon name="arrow" size={18} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--surface" aria-labelledby="limits-title">
        <div className="container split">
          <div>
            <h2 id="limits-title">Ограничения, о которых стоит знать заранее</h2>
          </div>
          <ul className="limits">
            {limits.map((l) => (
              <li key={l}>
                <Icon name="info" />
                <span>{l}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="how-title">
        <div className="container">
          <h2 id="how-title" style={{ marginBottom: 32 }}>
            Как устроено обращение
          </h2>
          <Steps />
        </div>
      </section>

      <ContactSection titleId="about-contacts" />
    </>
  )
}
