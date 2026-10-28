'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { NavItem } from '@/config/nav'

export function isActive(pathname: string, href: string) {
  const p = pathname.replace(/\/$/, '') || '/'
  return p === href || p.startsWith(href + '/')
}

export function NavLinks({ items, className, label }: { items: NavItem[]; className?: string; label: string }) {
  const pathname = usePathname() ?? '/'
  return (
    <nav className={className} aria-label={label}>
      <ul>
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} aria-current={isActive(pathname, item.href) ? 'page' : undefined}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
