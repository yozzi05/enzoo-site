'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { mainNav, secondaryNav } from '@/config/nav'
import { site } from '@/config/site'
import { Icon } from '@/components/Icon'
import { isActive } from './NavLinks'

/**
 * Мобильное меню на нативном <dialog>: модальность, ловушка фокуса и Escape -
 * средствами браузера; фокус возвращается на кнопку открытия.
 */
export function MobileMenu() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const pathname = usePathname() ?? '/'

  const close = () => dialogRef.current?.close()

  // Закрываем меню после перехода на другую страницу.
  useEffect(() => {
    close()
  }, [pathname])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const onClose = () => {
      setOpen(false)
      document.documentElement.classList.remove('menu-open')
      buttonRef.current?.focus()
    }
    dialog.addEventListener('close', onClose)
    return () => dialog.removeEventListener('close', onClose)
  }, [])

  const openMenu = () => {
    dialogRef.current?.showModal()
    document.documentElement.classList.add('menu-open')
    setOpen(true)
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="menu-button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={openMenu}
      >
        <Icon name="menu" size={22} />
        <span className="menu-button__label">Меню</span>
      </button>
      <dialog
        ref={dialogRef}
        id="mobile-menu"
        className="mobile-menu"
        aria-label="Меню сайта"
        onClick={(e) => {
          if (e.target === dialogRef.current) close()
        }}
      >
        <div className="mobile-menu__panel">
          <div className="mobile-menu__top">
            <span className="mobile-menu__title">Меню</span>
            <button type="button" className="icon-button" onClick={close} aria-label="Закрыть меню">
              <Icon name="close" size={22} />
            </button>
          </div>
          <nav aria-label="Разделы сайта">
            <ul className="mobile-menu__list">
              {[...mainNav, ...secondaryNav].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} aria-current={isActive(pathname, item.href) ? 'page' : undefined} onClick={close}>
                    {item.label}
                    <Icon name="arrow" size={18} />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mobile-menu__contacts">
            <a href={site.phone.href} className="btn btn--primary btn--block" data-track="call_click" data-place="menu">
              <Icon name="phone" size={18} /> {site.phone.display}
            </a>
            <Link href="/appointment" className="btn btn--outline btn--block" onClick={close}>
              Оставить заявку
            </Link>
            <p className="mobile-menu__meta">
              {site.hours.label} · {site.address.short}
              <br />
              {site.address.landmark}
            </p>
          </div>
        </div>
      </dialog>
    </>
  )
}
