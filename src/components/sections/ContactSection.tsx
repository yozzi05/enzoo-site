import Link from 'next/link'
import { site } from '@/config/site'
import { Icon } from '@/components/Icon'
import { MapEmbed } from '@/components/ui/MapEmbed'

export function ContactDetails() {
  return (
    <dl className="contact-list">
      <div>
        <dt>
          <Icon name="phone" /> Телефон
        </dt>
        <dd>
          <a href={site.phone.href} className="contact-list__phone" data-track="call_click" data-place="contacts">
            {site.phone.display}
          </a>
          <span className="muted">Звонок — самый быстрый способ связаться с клиникой.</span>
        </dd>
      </div>
      <div>
        <dt>
          <Icon name="pin" /> Адрес
        </dt>
        <dd>
          <span className="contact-list__value">
            {site.address.city}, {site.address.street}
          </span>
          <span>
            {site.address.floor[0].toUpperCase() + site.address.floor.slice(1)}, {site.address.landmark}
          </span>
        </dd>
      </div>
      <div>
        <dt>
          <Icon name="clock" /> Режим работы
        </dt>
        <dd>
          <span className="contact-list__value">{site.hours.label}, без выходных</span>
          <span className="muted">{site.hours.note}</span>
        </dd>
      </div>
    </dl>
  )
}

export function RouteLinks() {
  return (
    <div className="route-links">
      <a href={site.maps.yandexRoute} target="_blank" rel="noopener noreferrer" className="btn btn--outline btn--sm" data-track="route_click" data-place="yandex">
        <Icon name="route" size={18} /> Маршрут в Яндекс Картах<span className="visually-hidden"> (откроется в новой вкладке)</span>
      </a>
      <a href={site.maps.twoGisSearch} target="_blank" rel="noopener noreferrer" className="btn btn--outline btn--sm" data-track="route_click" data-place="2gis">
        <Icon name="map" size={18} /> Открыть в 2ГИС<span className="visually-hidden"> (откроется в новой вкладке)</span>
      </a>
    </div>
  )
}

export function ContactSection({ titleId = 'contacts-title' }: { titleId?: string }) {
  return (
    <section className="section contact-section" aria-labelledby={titleId}>
      <div className="container contact-section__grid">
        <div className="contact-section__info">
          <p className="eyebrow eyebrow--dark">Контакты</p>
          <h2 id={titleId}>Как нас найти</h2>
          <ContactDetails />
          <RouteLinks />
          <div className="contact-section__cta">
            <Link href="/appointment" className="btn btn--primary">
              Записаться на приём
            </Link>
            <Link href="/contacts" className="link-arrow">
              Все контакты <Icon name="arrow" size={18} />
            </Link>
          </div>
        </div>
        <MapEmbed />
      </div>
    </section>
  )
}
