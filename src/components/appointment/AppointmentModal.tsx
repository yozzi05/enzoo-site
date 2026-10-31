'use client'

import Link from 'next/link'
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { site } from '@/config/site'
import { Icon } from '@/components/Icon'
import { track } from '@/lib/analytics'
import { getServiceOption, type ServiceOption } from '@/content/service-options'
import { AppointmentForm } from './AppointmentForm'
import { ServiceSummary } from './ServicePicker'

/** «Заявка на услугу «УЗИ одного органа»», «Заявка: Хирургия» - без склонения названий. */
export function appointmentTitle(o: ServiceOption | undefined): string {
  if (!o) return 'Заявка на приём'
  if (o.kind === 'direction') return `Заявка: ${o.categoryName}`
  return `Заявка на услугу «${o.label}»`
}

type Ctx = { openAppointment: (serviceId: string, trigger?: HTMLElement | null) => void }
const AppointmentContext = createContext<Ctx | null>(null)

/**
 * Одна общая форма заявки в модальном окне (нативный <dialog>):
 * Escape, ловушка фокуса и модальность - средствами браузера, фокус возвращается на кнопку.
 * enabled=false (канал доставки не настроен) - вместо формы предлагается звонок с названием услуги.
 */
export function AppointmentModalProvider({ enabled, children }: { enabled: boolean; children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const [state, setState] = useState<{ serviceId: string; key: number } | null>(null)
  const [current, setCurrent] = useState<ServiceOption | undefined>(undefined)

  const openAppointment = useCallback((serviceId: string, trigger?: HTMLElement | null) => {
    triggerRef.current = trigger ?? (document.activeElement as HTMLElement | null)
    setState((s) => ({ serviceId, key: (s?.key ?? 0) + 1 }))
    setCurrent(getServiceOption(serviceId))
    track('appointment_start', { service: serviceId, place: 'modal' })
  }, [])

  useEffect(() => {
    const d = dialogRef.current
    if (state && d && !d.open) {
      d.showModal()
      document.documentElement.classList.add('modal-open')
    }
  }, [state])

  useEffect(() => {
    const d = dialogRef.current
    if (!d) return
    const onClose = () => {
      document.documentElement.classList.remove('modal-open')
      setState(null)
      triggerRef.current?.focus()
    }
    d.addEventListener('close', onClose)
    return () => d.removeEventListener('close', onClose)
  }, [])

  const close = () => dialogRef.current?.close()
  const title = appointmentTitle(current)

  return (
    <AppointmentContext.Provider value={{ openAppointment }}>
      {children}
      <dialog
        ref={dialogRef}
        className="appt-modal"
        aria-labelledby="appt-modal-title"
        onClick={(e) => {
          if (e.target === dialogRef.current) close()
        }}
      >
        {state && (
          <div className="appt-modal__panel">
            <div className="appt-modal__head">
              <h2 id="appt-modal-title">{title}</h2>
              <button type="button" className="icon-button appt-modal__close" onClick={close} aria-label="Закрыть окно заявки">
                <Icon name="close" size={22} />
              </button>
            </div>
            {enabled ? (
              <AppointmentForm key={state.key} initialService={state.serviceId} onServiceChange={setCurrent} />
            ) : (
              <div className="appt-modal__phone">
                {current && <ServiceSummary option={current} />}
                <p>Онлайн-заявки пока не принимаются. Позвоните администратору и назовите услугу - он подберёт время визита.</p>
                <a href={site.phone.href} className="btn btn--primary btn--block" data-track="call_click" data-place="modal" data-service={current?.value}>
                  <Icon name="phone" size={18} /> {site.phone.display}
                </a>
                <p className="field__hint">{site.hours.label}. Заявка не является подтверждённой записью - время согласует администратор.</p>
                <Link href="/prices" className="link-arrow" onClick={close}>
                  Все цены <Icon name="arrow" size={18} />
                </Link>
              </div>
            )}
          </div>
        )}
      </dialog>
    </AppointmentContext.Provider>
  )
}

/**
 * Кнопка «Оставить заявку» для конкретной услуги. Без JS - обычная ссылка
 * на /appointment?service=ID; с JS - открывает общую форму в модальном окне.
 */
export function RequestButton({ serviceId, label = 'Оставить заявку', className = 'btn btn--outline btn--sm', srLabel }: { serviceId: string; label?: string; className?: string; srLabel?: string }) {
  const ctx = useContext(AppointmentContext)
  return (
    <Link
      href={`/appointment?service=${encodeURIComponent(serviceId)}`}
      className={className}
      onClick={(e) => {
        if (!ctx || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
        e.preventDefault()
        ctx.openAppointment(serviceId, e.currentTarget)
      }}
    >
      {label}
      {srLabel && <span className="visually-hidden">: {srLabel}</span>}
    </Link>
  )
}
