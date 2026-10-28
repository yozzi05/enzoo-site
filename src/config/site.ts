/**
 * Единый источник контактов, режима работы и параметров развёртывания.
 * Контакты и география - только с https://enzoovet.ru/ (см. SOURCE_MAP.md).
 */

const address = {
  city: 'Махачкала',
  region: 'Республика Дагестан',
  street: 'проспект Имама Шамиля, 35',
  floor: 'этаж 1',
  landmark: 'напротив кинотеатра «Парамакс»',
  country: 'RU',
} as const

const routeQuery = encodeURIComponent(`${address.city}, ${address.street}`)

export const site = {
  name: 'EnZoo',
  legalTitle: 'Ветеринарная клиника EnZoo',
  tagline: 'Ветеринарная клиника EnZoo · Махачкала',

  phone: {
    display: '+7 928 222-00-88',
    href: 'tel:+79282220088',
    e164: '+79282220088',
  },

  address: {
    ...address,
    short: `${address.street}, ${address.floor}`,
    full: `${address.city}, ${address.street}, ${address.floor}`,
  },

  /**
   * Режим работы клиники. На enzoovet.ru заявлена круглосуточная работа.
   * Круглосуточность клиники не означает постоянную доступность каждого
   * специалиста, груминга, выезда и всех процедур - это оговаривается рядом.
   */
  hours: {
    isAroundTheClock: true,
    label: 'Круглосуточно',
    short: '24/7',
    note: 'Приём специалистов, груминг и выезд врача - по предварительному согласованию.',
  },

  /**
   * Маршрут строится по подтверждённому адресу. Карточки организации найдены
   * в сервисах по названию и адресу (проспект Имама Шамиля, 35), сверены 28.10.2026.
   */
  maps: {
    yandexOrg: 'https://yandex.ru/maps/org/enzoo/1271103904/',
    yandexReviews: 'https://yandex.ru/maps/org/enzoo/1271103904/reviews/',
    twoGisOrg: 'https://2gis.ru/makhachkala/firm/70000001031449339',
    twoGisReviews: 'https://2gis.ru/makhachkala/firm/70000001031449339/tab/reviews',
    yandexRoute: `https://yandex.ru/maps/?mode=routes&rtext=~${routeQuery}`,
    embed: `https://yandex.ru/map-widget/v1/?text=${routeQuery}&z=17`,
  },

  /**
   * Email не публикуется: на enzoovet.ru встречаются разные адреса
   * (enzoovet@yandex.ru, enzoovet@mail.ru и ссылка на посторонний hello@bloomly.com).
   * Заполнить после подтверждения владельцем.
   */
  email: null as string | null,

  /** Мессенджеры и соцсети: в источнике только шаблонные ссылки (t.me/username и т. п.). */
  messengers: [] as { id: string; label: string; href: string }[],

  /** Реквизиты оператора персональных данных. Пусто - пока не предоставлены владельцем. */
  legal: {
    operatorName: null as string | null,
    inn: null as string | null,
    ogrn: null as string | null,
    legalAddress: null as string | null,
    updatedAt: '2026-10-28',
  },
} as const

/** Production-домен задаётся переменной NEXT_PUBLIC_SITE_URL. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')

/** Индексация разрешена только при NEXT_PUBLIC_SITE_ENV=production. */
export const isIndexable = process.env.NEXT_PUBLIC_SITE_ENV === 'production'

/** Подкаталог сайта (например /enzoo-site для GitHub Pages). */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

/** Путь к файлу из public/ с учётом подкаталога. */
export function withBase(path: string) {
  return basePath + path
}
