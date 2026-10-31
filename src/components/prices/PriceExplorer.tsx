'use client'

import { useEffect, useId, useMemo, useState } from 'react'
import { speciesLabels, type PriceItem, type Species } from '@/content/prices'
import { PriceRow } from './PriceRow'

type Filters = { q: string; cat: string; sp: string }
const empty: Filters = { q: '', cat: '', sp: '' }

function norm(s: string) {
  return s.toLowerCase().replace(/ё/g, 'е')
}

/**
 * Полный прайс с поиском и фильтрами в URL (?q=&cat=&sp=), сгруппированный по направлениям.
 * Без JS показывается весь список (серверный рендер).
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
  const usedSpecies = (Object.keys(speciesLabels) as Species[]).filter((s) => s !== 'any' && items.some((i) => i.species === s))

  const list = useMemo(() => {
    const q = norm(f.q.trim())
    return items.filter(
      (i) =>
        (!f.cat || i.category === f.cat) &&
        (!f.sp || i.species === f.sp || i.species === 'any') &&
        (!q || norm([i.name, i.complexity, i.note, i.section, ...(i.excludes ?? [])].filter(Boolean).join(' ')).includes(q)),
    )
  }, [items, f])

  const groups = usedCats.map((c) => ({ ...c, items: list.filter((i) => i.category === c.slug) })).filter((g) => g.items.length)
  const active = Boolean(f.q || f.cat || f.sp)

  return (
    <div>
      <form className="price-filters" role="search" onSubmit={(e) => e.preventDefault()}>
        <div className="field">
          <label htmlFor={ids.q}>Поиск по названию</label>
          <input id={ids.q} type="search" className="input" value={f.q} maxLength={60} onChange={(e) => setF({ ...f, q: e.target.value })} placeholder="Например: УЗИ, стрижка, катетер" />
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
            {usedSpecies.map((s) => (
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
          </div>
        </div>
      ) : (
        groups.map((g) => (
          <section key={g.slug} className="price-group" aria-labelledby={`pg-${g.slug}`}>
            <h3 id={`pg-${g.slug}`}>{g.name}</h3>
            <ul className="price-table">
              {g.items.map((i) => (
                <PriceRow key={i.id} item={i} />
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  )
}
