import Link from 'next/link'
import { site } from '@/config/site'
import { mainNav, secondaryNav } from '@/config/nav'
import { Logo } from '@/components/Logo'
import { Icon } from '@/components/Icon'
import { NavLinks } from './NavLinks'
import { MobileMenu } from './MobileMenu'

export function Header() {
  return (
    <header className="site-header">
      <div className="utility">
        <div className="container utility__inner">
          <p className="utility__info">
            <span className="utility__hours">
              <Icon name="clock" size={16} /> {site.hours.label}
            </span>
            <span>
              {site.address.street}, {site.address.floor} · {site.address.landmark}
            </span>
          </p>
          <NavLinks items={secondaryNav} className="utility__nav" label="Дополнительная навигация" />
        </div>
      </div>
      <div className="container header__bar">
        <Logo priority />
        <NavLinks items={mainNav} className="header__nav" label="Основная навигация" />
        <div className="header__actions">
          <a href={site.phone.href} className="header__phone" data-track="call_click" data-place="header">
            <Icon name="phone" size={18} />
            <span className="header__phone-text">{site.phone.display}</span>
            <span className="visually-hidden header__phone-sr">Позвонить: {site.phone.display}</span>
          </a>
          <Link href="/appointment" className="btn btn--primary btn--sm header__cta">
            Записаться
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}
