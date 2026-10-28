import Link from 'next/link'
import { site } from '@/config/site'
import { Icon } from '@/components/Icon'

/** Пара основных действий: заявка и звонок. */
export function CallActions({ service, place, appointmentLabel = 'Записаться на приём', variant = 'light' }: { service?: string; place: string; appointmentLabel?: string; variant?: 'light' | 'dark' }) {
  const href = service ? `/appointment?service=${encodeURIComponent(service)}` : '/appointment'
  return (
    <div className="actions">
      <Link href={href} className="btn btn--primary">
        {appointmentLabel}
      </Link>
      <a href={site.phone.href} className={variant === 'dark' ? 'btn btn--ghost-light' : 'btn btn--outline'} data-track="call_click" data-place={place} data-service={service}>
        <Icon name="phone" size={18} /> {site.phone.display}
      </a>
    </div>
  )
}
