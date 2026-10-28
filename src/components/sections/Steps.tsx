import Link from 'next/link'
import { site } from '@/config/site'

export function Steps() {
  return (
    <ol className="steps">
      <li>
        <h3>Свяжитесь с клиникой</h3>
        <p>
          Позвоните по номеру <a href={site.phone.href} data-track="call_click" data-place="steps">{site.phone.display}</a> или{' '}
          <Link href="/appointment">оставьте заявку</Link>. Если ситуация срочная — сразу звоните.
        </p>
      </li>
      <li>
        <h3>Согласуйте визит</h3>
        <p>Администратор уточнит, что беспокоит питомца, подберёт направление и время приёма.</p>
      </li>
      <li>
        <h3>Приезжайте с документами</h3>
        <p>Возьмите ветеринарный паспорт и результаты прошлых анализов и исследований, если они есть.</p>
      </li>
    </ol>
  )
}
