import type { Metadata } from 'next'
import Link from 'next/link'
import { site } from '@/config/site'
import { Icon } from '@/components/Icon'
import { PageIntro } from '@/components/ui/PageIntro'
import { FaqList } from '@/components/ui/FaqList'
import { commonFaq } from '@/content/clinic'

export const metadata: Metadata = {
  title: 'Информация владельцам',
  description: 'Как подготовиться к визиту в ветеринарную клинику EnZoo: запись, документы, стационар, выезд врача, что делать при подозрении на инфекцию.',
  alternates: { canonical: '/owners' },
}

const toc = [
  { id: 'visit', label: 'Перед визитом' },
  { id: 'infection', label: 'Если подозреваете инфекцию' },
  { id: 'hospital', label: 'Стационар' },
  { id: 'home-visit', label: 'Выезд врача' },
  { id: 'documents', label: 'Документы' },
  { id: 'farewell', label: 'Прощание с питомцем' },
  { id: 'faq', label: 'Вопросы' },
]

export default function OwnersPage() {
  return (
    <>
      <PageIntro
        crumbs={[{ href: '/owners', label: 'Владельцам' }]}
        title="Информация владельцам"
        lead="Организационные вопросы: как записаться, что взять с собой и как устроены отдельные услуги. Медицинские рекомендации даёт только врач на приёме."
      />
      <section className="section section--tight">
        <div className="container service-layout">
          <div className="prose">
            <h2 id="visit">Перед визитом</h2>
            <p>
              Позвоните по номеру <a href={site.phone.href} data-track="call_click" data-place="owners">{site.phone.display}</a> или <Link href="/appointment">оставьте заявку</Link>. Заявка с
              сайта не является бронью: администратор перезвонит и подтвердит время. Если помощь нужна срочно — звоните сразу, без заявки.
            </p>
            <p>Что взять с собой:</p>
            <ul>
              <li>ветеринарный паспорт, если он есть;</li>
              <li>результаты прошлых анализов, снимков, УЗИ и выписки;</li>
              <li>названия препаратов, которые получает питомец.</li>
            </ul>
            <p>Кошек и мелких животных удобнее привозить в закрытой переноске, собак — на поводке. Правила подготовки к конкретной процедуре уточняйте у администратора.</p>

            <h2 id="infection">Если подозреваете инфекцию</h2>
            <p>
              В клинике нет инфекционного стационара: животных с инфекционными заболеваниями лечат амбулаторно, их не госпитализируют. Обязательно скажите о своих подозрениях при звонке —
              администратор объяснит порядок визита.
            </p>

            <h2 id="hospital">Стационар</h2>
            <p>
              Госпитализацию назначает врач, если питомцу нужно лечение и наблюдение в клинике. Стационар оформляется на 12 часов или на сутки. Порядок посещения и связи с врачом уточняйте
              при госпитализации.
            </p>
            <p>Стационар — это медицинское наблюдение, а не передержка. Возможность содержания здорового питомца нужно согласовывать с администратором отдельно.</p>
            <p>
              <Link href="/services/hospital">Подробнее о стационаре</Link>
            </p>

            <h2 id="home-visit">Выезд врача</h2>
            <p>
              В перечне услуг клиники есть выезд врача в черте города и за город. Возможность и время выезда зависят от загрузки специалистов — их нужно согласовать по телефону заранее.
            </p>

            <h2 id="documents">Документы</h2>
            <p>
              В клинике можно оформить ветеринарный паспорт, провести микрочипирование, внести отметки о прививках и обработках. <Link href="/services/documents">Подробнее о документах</Link>.
            </p>

            <h2 id="farewell">Прощание с питомцем</h2>
            <p>
              Если возникла необходимость в эвтаназии, клиника оказывает эту услугу, помогает с оформлением документов, транспортировкой и кремацией. Обсудить порядок можно по телефону.
            </p>

            <h2 id="faq">Вопросы</h2>
          </div>
          <aside className="service-aside" aria-label="Содержание страницы">
            <nav className="aside-card" aria-label="Разделы страницы">
              <h2>На этой странице</h2>
              <ul className="footer__list" style={{ marginTop: 12 }}>
                {toc.map((t) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`}>{t.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="aside-card aside-card--navy">
              <h2>Нужна помощь сейчас?</h2>
              <p>Звоните — клиника работает {site.hours.label.toLowerCase()}.</p>
              <a href={site.phone.href} className="btn btn--primary" data-track="call_click" data-place="owners-aside">
                <Icon name="phone" size={18} /> {site.phone.display}
              </a>
            </div>
          </aside>
        </div>
        <div className="container" style={{ marginTop: 8 }}>
          <div style={{ maxWidth: 820 }}>
            <FaqList items={commonFaq} />
          </div>
        </div>
      </section>
    </>
  )
}
