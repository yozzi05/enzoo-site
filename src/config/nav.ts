import { offers } from '@/content/clinic'

export type NavItem = { href: string; label: string }

export const mainNav: NavItem[] = [
  { href: '/services', label: 'Услуги' },
  { href: '/about', label: 'О клинике' },
  { href: '/grooming', label: 'Груминг' },
  { href: '/reviews', label: 'Отзывы' },
  { href: '/contacts', label: 'Контакты' },
]

/** Раздел акций появляется только при наличии подтверждённых предложений. */
export const secondaryNav: NavItem[] = [
  { href: '/prices', label: 'Цены' },
  { href: '/owners', label: 'Владельцам' },
  ...(offers.length > 0 ? [{ href: '/offers', label: 'Акции' }] : []),
]

export const legalNav: NavItem[] = [
  { href: '/privacy', label: 'Политика конфиденциальности' },
  { href: '/consent', label: 'Согласие на обработку данных' },
]
