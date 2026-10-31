'use client'

import { useState } from 'react'
import type { ServiceOption } from '@/content/service-options'
import { AppointmentForm } from './AppointmentForm'
import { appointmentTitle } from './AppointmentModal'

/** Форма на странице /appointment с заголовком выбранной услуги («Заявка на УЗИ одного органа»). */
export function AppointmentPageForm() {
  const [option, setOption] = useState<ServiceOption | undefined>(undefined)
  return (
    <>
      <h2 className="form-card__title" aria-live="polite">
        {appointmentTitle(option)}
      </h2>
      <AppointmentForm onServiceChange={setOption} />
    </>
  )
}
