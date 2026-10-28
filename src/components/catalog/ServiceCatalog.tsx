'use client'

import Link from 'next/link'
import { useEffect, useId, useMemo, useState } from 'react'
import { Icon } from '@/components/Icon'

export type CatalogEntry = {
  name: string
  summary: string
  href: string
  group: string
  procedures: string[]
  keywords: string[]
}

type Group = { id: string; title: string }

function norm(s: string) {
  return s.toLowerCase().replace(/ё/g, 'е')
}

function highlight(text: string, q: string) {
  const i = norm(text).indexOf(q)
  if (i < 0) return text
  return (
    <>
      {text.slice(0, i)}
      <mark>{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  )
}

/**
 * Каталог с поиском по названиям, описаниям и процедурам.
 * Без JS виден полный список; запрос синхронизируется с ?q= в адресе.
 */
export function ServiceCatalog({ entries, groups }: { entries: CatalogEntry[]; groups: Group[] }) {
  const [query, setQuery] = useState('')
  const inputId = useId()

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('q')
    // eslint-disable-next-line react-hooks/set-state-in-effect -- однократное чтение запроса из адреса после гидратации
    if (q) setQuery(q.slice(0, 60))
  }, [])

  useEffect(() => {
    const url = new URL(window.location.href)
    if (query.trim()) url.searchParams.set('q', query.trim())
    else url.searchParams.delete('q')
    window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash)
  }, [query])

  const q = norm(query.trim())
  const results = useMemo(() => {
    if (!q) return entries.map((e) => ({ entry: e, matches: [] as string[] }))
    return entries
      .map((e) => {
        const head = norm(e.name + ' ' + e.summary + ' ' + e.keywords.join(' ')).includes(q)
        const matches = e.procedures.filter((p) => norm(p).includes(q)).slice(0, 3)
        return head || matches.length ? { entry: e, matches } : null
      })
      .filter((x): x is { entry: CatalogEntry; matches: string[] } => x !== null)
  }, [entries, q])

  const shown = groups.map((g) => ({ ...g, items: results.filter((r) => r.entry.group === g.id) })).filter((g) => g.items.length)

  return (
    <div>
      <div role="search" className="catalog-search-wrap">
        <label htmlFor={inputId} className="field__label-lg">
          Поиск по направлениям и процедурам
        </label>
        <div className="catalog-search">
          <Icon name="search" size={20} />
          <input
            id={inputId}
            type="search"
            className="input"
            placeholder="Например: УЗИ, кастрация, зубы, перелом"
            value={query}
            maxLength={60}
            autoComplete="off"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <p className="catalog-status" role="status" aria-live="polite">
          {q ? (results.length ? `Найдено направлений: ${results.length}` : '') : ''}
        </p>
      </div>

      {results.length === 0 ? (
        <div className="empty-state">
          <h2>Ничего не нашлось</h2>
          <p>Попробуйте другое слово или позвоните администратору - он подскажет, к какому врачу обратиться.</p>
          <div className="actions">
            <button type="button" className="btn btn--outline btn--sm" onClick={() => setQuery('')}>
              Сбросить поиск
            </button>
            <Link href="/appointment" className="btn btn--primary btn--sm">
              Оставить заявку
            </Link>
          </div>
        </div>
      ) : (
        shown.map((g) => (
          <section key={g.id} className="catalog-group" aria-labelledby={`grp-${g.id}`} id={g.id}>
            <h2 id={`grp-${g.id}`}>{g.title}</h2>
            <ul className="catalog-list">
              {g.items.map(({ entry, matches }) => (
                <li key={entry.href} className="catalog-item">
                  <Link href={entry.href}>
                    <span className="catalog-item__name">{q ? highlight(entry.name, q) : entry.name}</span>
                    <span className="catalog-item__text">{entry.summary}</span>
                    {matches.map((m) => (
                      <span key={m} className="catalog-item__match">
                        {highlight(m, q)}
                      </span>
                    ))}
                    <Icon name="arrow" size={18} />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  )
}
