import { site } from '@/config/site'

/** Незаполненный реквизит: пустая строка под будущие данные. */
function Value({ value }: { value: string | null }) {
  if (value) return <>{value}</>
  return (
    <span className="legal-blank">
      <span className="visually-hidden">будет указано позже</span>
    </span>
  )
}

/**
 * Сведения об операторе - только из конфигурации (site.legal).
 * Пока реквизиты не предоставлены, на их месте остаются пустые строки.
 */
export function Operator() {
  const l = site.legal
  return (
    <ul className="legal-details">
      <li>
        Наименование оператора: <Value value={l.operatorName} />
      </li>
      <li>
        ИНН: <Value value={l.inn} />
      </li>
      <li>
        КПП: <Value value={l.kpp} />
      </li>
      <li>
        ОГРН: <Value value={l.ogrn} />
      </li>
      <li>
        Юридический адрес: <Value value={l.legalAddress} />
      </li>
      <li>
        Фактический адрес (клиника): {l.actualAddress ?? site.address.full}
      </li>
      <li>
        Генеральный директор: <Value value={l.director} />
      </li>
      <li>
        Телефон для обращений: <a href={site.phone.href}>{site.phone.display}</a>
      </li>
      {l.email && (
        <li>
          Email для обращений: <a href={`mailto:${l.email}`}>{l.email}</a>
        </li>
      )}
    </ul>
  )
}

export function LegalUpdated() {
  const d = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(site.legal.updatedAt))
  return <p className="muted">Редакция от {d}</p>
}
