import type { Metadata } from 'next'
import { site } from '@/config/site'
import { Icon } from '@/components/Icon'
import { PageIntro } from '@/components/ui/PageIntro'
import { AppointmentPageForm } from '@/components/appointment/AppointmentPageForm'
import { PhoneOnlyService } from '@/components/appointment/PhoneOnlyService'
import { isAppointmentEnabled } from '@/lib/server/delivery'

export const metadata: Metadata = {
  title: 'Заявка на приём',
  description: 'Оставьте заявку на приём в ветеринарной клинике EnZoo в Махачкале - администратор перезвонит и подтвердит время. Или позвоните: +7 928 222-00-88.',
  alternates: { canonical: '/appointment' },
}

/** Страница статическая: канал доставки определяется при сборке, в статической сборке (GitHub Pages) приёма заявок нет. */
export default function AppointmentPage() {
  const enabled = process.env.STATIC_EXPORT !== '1' && isAppointmentEnabled()

  return (
    <>
      <PageIntro
        crumbs={[{ href: '/appointment', label: 'Заявка на приём' }]}
        title="Заявка на приём"
        lead="Это заявка на согласование визита, а не бронь. Администратор перезвонит, уточнит детали и подтвердит время."
      />
      <section className="section section--tight">
        <div className="container appt-layout">
          <div className="form-card">
            {enabled ? (
              <AppointmentPageForm />
            ) : (
              <>
              <PhoneOnlyService />
              <div className="status status--success" style={{ background: 'var(--surface-2)', borderLeftColor: 'var(--navy)' }}>
                <Icon name="phone" size={24} />
                <div>
                  <h2>Запишитесь по телефону</h2>
                  <p>Онлайн-заявки временно не принимаются. Позвоните администратору - он подберёт время и ответит на вопросы.</p>
                  <p style={{ marginTop: 16 }}>
                    <a href={site.phone.href} className="btn btn--primary" data-track="call_click" data-place="appointment-disabled">
                      <Icon name="phone" size={18} /> {site.phone.display}
                    </a>
                  </p>
                </div>
              </div>
              </>
            )}
          </div>
          <aside className="service-aside" aria-label="Связаться по телефону">
            <div className="aside-card aside-card--navy">
              <h2>Нужна помощь сейчас?</h2>
              <p>Не заполняйте форму - позвоните. Клиника работает {site.hours.label.toLowerCase()}.</p>
              <a href={site.phone.href} className="aside-card__phone" data-track="call_click" data-place="appointment-aside">
                {site.phone.display}
              </a>
            </div>
            <div className="aside-card">
              <h2>Адрес</h2>
              <p>
                {site.address.city}, {site.address.short}
                <br />
                {site.address.landmark}
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
