import Image from 'next/image'
import Link from 'next/link'
import { site, withBase } from '@/config/site'
import { legalNav, mainNav, secondaryNav } from '@/config/nav'
import { primaryServices, serviceHref } from '@/content/services'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="site-footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <div className="footer__logo">
            <Image src={withBase('/brand/enzoo-logo-vertical.png')} alt="EnZoo, ветеринарная клиника" width={600} height={595} />
          </div>
          <p>Ветеринарная клиника в Махачкале. Работаем {site.hours.label.toLowerCase()}.</p>
        </div>
        <div>
          <h2 className="footer__title">Связаться</h2>
          <ul className="footer__list">
            <li>
              <a href={site.phone.href} className="footer__phone" data-track="call_click" data-place="footer">
                {site.phone.display}
              </a>
            </li>
            <li>
              {site.address.city}, {site.address.short}
            </li>
            <li>{site.address.landmark}</li>
            <li>
              <a href={site.maps.yandexRoute} target="_blank" rel="noopener noreferrer" data-track="route_click" data-place="footer">
                Построить маршрут<span className="visually-hidden"> (откроется в новой вкладке)</span>
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="footer__title">Направления</h2>
          <ul className="footer__list footer__list--cols">
            {primaryServices.map((s) => (
              <li key={s.slug}>
                <Link href={serviceHref(s)}>{s.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="footer__title">Разделы</h2>
          <ul className="footer__list">
            {[...mainNav, ...secondaryNav, { href: '/appointment', label: 'Заявка на приём' }].map((i) => (
              <li key={i.href}>
                <Link href={i.href}>{i.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="container footer__bottom">
        <p>
          © {year} {site.legalTitle}. Информация на сайте не заменяет консультацию ветеринарного врача.
        </p>
        <ul>
          {legalNav.map((i) => (
            <li key={i.href}>
              <Link href={i.href}>{i.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
