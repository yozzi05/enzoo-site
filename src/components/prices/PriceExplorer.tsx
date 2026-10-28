'use client'

import Link from 'next/link'
import { useEffect, useId, useMemo, useState } from 'react'
import { Icon } from '@/components/Icon'
import { speciesLabels, type PriceItem, type Species } from '@/content/prices'

type Filters = { q: string; cat: string; sp: string }
const empty: Filters = { q: '', cat: '', sp: '' }

const rub = new Intl.NumberFormat('ru-RU')
const date = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

function norm(s: string) {
  return s.toLowerCase().replace(/ё/g, 'е')
}

/**
 * Прайс с поиском и фильтрами в URL (?q=&cat=&sp=). Показывается только
 * при наличии утверждённых позиций. Условия всегда рядом с суммой.
 */
export function PriceExplorer({ items, categories }: { items: PriceItem[]; categories: { slug: string; name: string }[] }) {
  const [f, setF] = useState<Filters>(empty)
  const ids = { q: useId(), cat: useId(), sp: useId() }

  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    const next = { q: (p.get('q') ?? '').slice(0, 60), cat: p.get('cat') ?? '', sp: p.get('sp') ?? '' }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- однократное чтение фильтров из адреса после гидратации
    if (next.q || next.cat || next.sp) setF(next)
  }, [])

  useEffect(() => {
    const url = new URL(window.location.href)
    for (const k of ['q', 'cat', 'sp'] as const) {
      const v = f[k].trim()
      if (v) url.searchParams.set(k, v)
      else url.searchParams.delete(k)
    }
    window.history.replaceState(window.history.state, '', url.pathname + url.search)
  }, [f])

  const usedCats = categories.filter((c) => items.some((i) => i.category === c.slug))
  const usedSpecies = (Object.keys(speciesLabels) as Species[]).filter((s) => items.some((i) => i.species === s))

  const list = useMemo(() => {
    const q = norm(f.q.trim())
    return items.filter(
      (i) =>
        (!f.cat || i.category === f.cat) &&
        (!f.sp || i.species === f.sp || i.species === 'any') &&
        (!q || norm([i.name, i.weight, i.complexity, i.note].filter(Boolean).join(' ')).includes(q)),
    )
  }, [items, f])

  const active = Boolean(f.q || f.cat || f.sp)
  const catName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug

  return (
    <div>
      <form className="price-filters" role="search" onSubmit={(e) => e.preventDefault()}>
        <div className="field">
          <label htmlFor={ids.q}>Поиск по названию</label>
          <input id={ids.q} type="search" className="input" value={f.q} maxLength={60} onChange={(e) => setF({ ...f, q: e.target.value })} placeholder="Например: кастрация" />
        </div>
        <div className="field">
          <label htmlFor={ids.cat}>Направление</label>
          <select id={ids.cat} className="select" value={f.cat} onChange={(e) => setF({ ...f, cat: e.target.value })}>
            <option value="">Все</option>
            {usedCats.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor={ids.sp}>Питомец</label>
          <select id={ids.sp} className="select" value={f.sp} onChange={(e) => setF({ ...f, sp: e.target.value })}>
            <option value="">Все</option>
            {usedSpecies
              .filter((s) => s !== 'any')
              .map((s) => (
                <option key={s} value={s}>
                  {speciesLabels[s]}
                </option>
              ))}
          </select>
        </div>
        <button type="button" className="btn btn--outline" onClick={() => setF(empty)} disabled={!active}>
          Сбросить
        </button>
      </form>

      <p className="catalog-status" role="status" aria-live="polite">
        {active ? `Найдено позиций: ${list.length}` : `Всего позиций: ${items.length}`}
      </p>

      {list.length === 0 ? (
        <div className="empty-state">
          <h3>Подходящих позиций нет</h3>
          <p>Измените условия поиска или уточните стоимость у администратора.</p>
          <div className="actions">
            <button type="button" className="btn btn--outline btn--sm" onClick={() => setF(empty)}>
              Сбросить фильтры
            </button>
            <Link href="/appointment" className="btn btn--primary btn--sm">
              Уточнить стоимость
            </Link>
          </div>
        </div>
      ) : (
        <ul className="price-table">
          {list.map((i) => (
            <li key={i.id} className="price-row">
              <div>
                <div className="price-row__name">{i.name}</div>
                <div className="price-row__meta">
                  <span>{catName(i.category)}</span>
                  {i.species !== 'any' && <span>{speciesLabels[i.species]}</span>}
                  {i.weight && <span>{i.weight}</span>}
                  {i.complexity && <span>{i.complexity}</span>}
                </div>
                {(i.includes?.length || i.excludes?.length) && (
                  <div className="price-row__terms">
                    {i.includes?.length ? (
                      <div>
                        <strong>Входит:</strong> {i.includes.join(', ')}
                      </div>
                    ) : null}
                    {i.excludes?.length ? (
                      <div>
                        <strong>Оплачивается отдельно:</strong> {i.excludes.join(', ')}
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
              <div className="price-row__price">
                {i.price === null ? (
                  <Link href={`/appointment?service=${i.category}`} className="price-dirs__link">
                    Уточнить <Icon name="arrow" size={16} />
                  </Link>
                ) : (
                  <>
                    {i.isFrom ? 'от ' : ''}
                    {rub.format(i.price)} ₽<span className="price-row__unit">{i.unit}</span>
                  </>
                )}
                {i.note && <span className="price-row__note">{i.note}</span>}
              </div>
            </li>
          ))}
        </ul>
      )}
      {items[0] && <p className="photo-note">Цены утверждены {date.format(new Date(items[0].approvedAt))} Окончательную стоимость врач называет после осмотра.</p>}
    </div>
  )
}
