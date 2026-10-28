import Link from 'next/link'
import { siteUrl } from '@/config/site'
import { JsonLd } from './JsonLd'

export type Crumb = { href: string; label: string }

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all = [{ href: '/', label: 'Главная' }, ...items]
  return (
    <>
      <nav aria-label="Хлебные крошки" className="crumbs">
        <ol>
          {all.map((c, i) => (
            <li key={c.href}>
              {i < all.length - 1 ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: all.map((c, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: c.label,
            item: `${siteUrl}${c.href === '/' ? '' : c.href}`,
          })),
        }}
      />
    </>
  )
}
