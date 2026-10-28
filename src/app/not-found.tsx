import Link from 'next/link'
import type { Metadata } from 'next'
import { site } from '@/config/site'
import { Icon } from '@/components/Icon'

export const metadata: Metadata = {
  title: 'Страница не найдена',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <section className="not-found">
      <div className="container">
        <p className="not-found__code" aria-hidden="true">
          404
        </p>
        <h1>Такой страницы нет</h1>
        <p className="lead">Возможно, адрес изменился или в нём опечатка. Если нужна помощь питомцу - позвоните, клиника работает {site.hours.label.toLowerCase()}.</p>
        <div className="actions">
          <a href={site.phone.href} className="btn btn--primary" data-track="call_click" data-place="404">
            <Icon name="phone" size={18} /> {site.phone.display}
          </a>
          <Link href="/" className="btn btn--outline">
            На главную
          </Link>
        </div>
        <ul className="not-found__links">
          <li>
            <Link href="/services">Услуги</Link>
          </li>
          <li>
            <Link href="/contacts">Контакты и маршрут</Link>
          </li>
          <li>
            <Link href="/appointment">Заявка на приём</Link>
          </li>
          <li>
            <Link href="/prices">Цены</Link>
          </li>
        </ul>
      </div>
    </section>
  )
}
