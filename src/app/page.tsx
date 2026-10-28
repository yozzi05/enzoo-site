import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { site } from '@/config/site'
import { Icon } from '@/components/Icon'
import { CallActions } from '@/components/ui/CallActions'
import { FaqList } from '@/components/ui/FaqList'
import { ContactSection } from '@/components/sections/ContactSection'
import { ReviewsSources } from '@/components/sections/ReviewsSources'
import { Steps } from '@/components/sections/Steps'
import { PriceNotice } from '@/components/sections/PriceNotice'
import { approach, commonFaq, grooming, photos } from '@/content/clinic'
import { getService, serviceHref } from '@/content/services'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

const quick = [
  { href: '/services/therapy', title: 'Приём врача', text: 'Осмотр и консультация' },
  { href: '/services#diagnostics', title: 'Диагностика', text: 'Анализы, УЗИ, рентген' },
  { href: '/services/vaccination', title: 'Вакцинация', text: 'Прививки и паспорт' },
  { href: '/services/castration', title: 'Кастрация и стерилизация', text: 'Плановые операции' },
  { href: '/services', title: 'Все услуги', text: 'Каталог и поиск' },
]

const featured = [
  { slug: 'therapy', title: 'Терапия', lines: ['Первичный и повторный приём', 'Капельницы и процедуры', 'Консультация по анализам'] },
  { slug: 'diagnostics', title: 'Диагностика', lines: ['Лабораторные исследования', 'УЗИ', 'Рентгенография'], href: '/services#diagnostics' },
  { slug: 'surgery', title: 'Хирургия', lines: ['Общая и пластическая хирургия', 'Ортопедия и травматология', 'Онкохирургия'] },
]

const restSlugs = ['castration', 'vaccination', 'hospital', 'dentistry', 'ophthalmology', 'oncology', 'orthopedics', 'obstetrics', 'rodents', 'documents']

const capabilities = [
  { title: 'Лабораторные исследования', text: 'Общий и биохимический анализ крови выполняют на месте. Расширенные исследования - ПЦР, посевы, гистологию - в партнёрской лаборатории.', href: '/services/laboratory' },
  { title: 'УЗИ', text: 'Брюшная полость, отдельные органы, малый таз, контроль беременности. По результатам - заключение.', href: '/services/ultrasound' },
  { title: 'Рентгенография', text: 'Снимки в одной и двух проекциях, исследование на дисплазию, контрастная рентгенография.', href: '/services/xray' },
  { title: 'Хирургия и анестезия', text: 'Операции разной сложности с анестезиологическим сопровождением и контролем жизненно важных показателей.', href: '/services/surgery' },
  { title: 'Стационар', text: 'Наблюдение и лечение на 12 часов или сутки. Инфекционного стационара в клинике нет.', href: '/services/hospital' },
  { title: 'Стоматология и офтальмология', text: 'Санация полости рта и удаление зубов, обработки глаз и операции на веках.', href: '/services/dentistry' },
]

export default function HomePage() {
  const rest = restSlugs.map((s) => getService(s)!).filter(Boolean)
  return (
    <>
      {/* Первый экран */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero__grid">
          <div className="hero__text">
            <p className="eyebrow">{site.tagline}</p>
            <h1 id="hero-title">
              Ветеринарная помощь в&nbsp;Махачкале&nbsp;-<span className="hero__accent"> круглосуточно</span>
            </h1>
            <p className="hero__lead">Приём, диагностика и лечение питомцев. Поможем выбрать направление и согласовать визит в клинику.</p>
            <CallActions place="hero" variant="dark" />
            <div className="hero__place">
              <Icon name="pin" size={20} />
              <p>
                <strong>{site.address.street}, {site.address.floor}</strong>
                <span>{site.address.landmark}</span>
              </p>
              <a href={site.maps.yandexRoute} target="_blank" rel="noopener noreferrer" className="hero__route" data-track="route_click" data-place="hero">
                Построить маршрут<span className="visually-hidden"> (откроется в новой вкладке)</span>
                <Icon name="arrow" size={18} />
              </a>
            </div>
            <p className="hero__urgent">
              Если помощь нужна сейчас - позвоните:{' '}
              <a href={site.phone.href} data-track="call_click" data-place="hero-urgent">
                {site.phone.display}
              </a>
            </p>
          </div>
          <figure className="hero__media">
            <Image src={photos.catOnCounter.src} alt={photos.catOnCounter.alt} width={photos.catOnCounter.width} height={photos.catOnCounter.height} priority sizes="(min-width: 1024px) 460px, 100vw" />
            <figcaption>
              <Icon name="clock" size={18} /> {site.hours.label}, без выходных
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Быстрый выбор */}
      <nav className="quick" aria-label="Быстрый выбор направления">
        <div className="container">
          <ul className="quick__list">
            {quick.map((q) => (
              <li key={q.href}>
                <Link href={q.href}>
                  <span className="quick__title">{q.title}</span>
                  <span className="quick__text">{q.text}</span>
                  <Icon name="arrow" size={18} className="quick__arrow" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Основные направления */}
      <section className="section" aria-labelledby="directions-title">
        <div className="container">
          <div className="section__head">
            <div>
              <p className="eyebrow eyebrow--dark">Направления</p>
              <h2 id="directions-title">Чем мы можем помочь</h2>
            </div>
            <Link href="/services" className="link-arrow">
              Все направления и процедуры <Icon name="arrow" size={18} />
            </Link>
          </div>
          <ul className="featured">
            {featured.map((f, i) => (
              <li key={f.slug} className="featured__item">
                <span className="featured__num" aria-hidden="true">
                  0{i + 1}
                </span>
                <h3>
                  <Link href={f.href ?? `/services/${f.slug}`} className="featured__link">
                    {f.title}
                  </Link>
                </h3>
                <ul className="featured__lines">
                  {f.lines.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
                <Icon name="arrow" size={22} className="featured__arrow" />
              </li>
            ))}
          </ul>
          <ul className="service-rows">
            {rest.map((s) => (
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

      {/* О клинике */}
      <section className="section section--surface" aria-labelledby="about-title">
        <div className="container about-teaser">
          <div>
            <p className="eyebrow eyebrow--dark">О клинике</p>
            <h2 id="about-title">{approach.lead}</h2>
            <div className="about-teaser__text">
              {approach.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <Link href="/about" className="link-arrow">
              Подробнее о клинике <Icon name="arrow" size={18} />
            </Link>
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

      {/* Возможности */}
      <section className="section section--navy" aria-labelledby="caps-title">
        <div className="container">
          <div className="section__head">
            <div>
              <p className="eyebrow">Возможности</p>
              <h2 id="caps-title">Диагностика и лечение в одном месте</h2>
            </div>
            <p className="caps__note">Объём исследований определяет врач. Сроки и доступность отдельных анализов уточняйте у администратора.</p>
          </div>
          <ul className="caps">
            {capabilities.map((c) => (
              <li key={c.title}>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
                <Link href={c.href} className="caps__link" aria-label={`Подробнее: ${c.title}`}>
                  <Icon name="arrow" size={20} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Груминг */}
      <section className="section" aria-labelledby="grooming-title">
        <div className="container grooming-teaser">
          <div className="grooming-teaser__media">
            <Image src={photos.catAfterGrooming.src} alt={photos.catAfterGrooming.alt} width={photos.catAfterGrooming.width} height={photos.catAfterGrooming.height} sizes="(min-width: 1024px) 360px, 60vw" className="grooming-teaser__main" />
            <Image src={photos.groomingPoodle.src} alt={photos.groomingPoodle.alt} width={photos.groomingPoodle.width} height={photos.groomingPoodle.height} sizes="(min-width: 1024px) 240px, 40vw" className="grooming-teaser__side" />
          </div>
          <div className="grooming-teaser__text">
            <p className="eyebrow eyebrow--dark">Груминг-студия</p>
            <h2 id="grooming-title">Стрижка и уход - там же, где лечат</h2>
            <p className="lead">{grooming.lead}</p>
            <ul className="tags">
              {grooming.services.map((s) => (
                <li key={s.title}>{s.title}</li>
              ))}
            </ul>
            <div className="actions">
              <Link href="/grooming" className="btn btn--outline">
                О груминге
              </Link>
              <Link href="/appointment?service=grooming" className="btn btn--primary">
                Записаться на груминг
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Как обратиться */}
      <section className="section section--surface" aria-labelledby="steps-title">
        <div className="container">
          <div className="section__head">
            <div>
              <p className="eyebrow eyebrow--dark">Как обратиться</p>
              <h2 id="steps-title">Три шага до визита</h2>
            </div>
          </div>
          <Steps />
        </div>
      </section>

      {/* Стоимость */}
      <section className="section section--tight" aria-labelledby="price-title">
        <div className="container">
          <PriceNotice titleId="price-title" />
        </div>
      </section>

      {/* Отзывы */}
      <section className="section section--tight" aria-labelledby="reviews-title">
        <div className="container">
          <ReviewsSources titleId="reviews-title" />
        </div>
      </section>

      {/* Вопросы */}
      <section className="section" aria-labelledby="faq-title">
        <div className="container split">
          <div>
            <p className="eyebrow eyebrow--dark">Вопросы</p>
            <h2 id="faq-title">Коротко о записи и визите</h2>
            <p className="lead split__lead">Не нашли ответ - позвоните, администратор подскажет.</p>
            <a href={site.phone.href} className="link-arrow" data-track="call_click" data-place="faq">
              <Icon name="phone" size={18} /> {site.phone.display}
            </a>
          </div>
          <FaqList items={commonFaq} />
        </div>
      </section>

      <ContactSection />
    </>
  )
}
