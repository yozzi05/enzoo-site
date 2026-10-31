'use client'

import { useEffect, useState } from 'react'
import { getServiceOption, type ServiceOption } from '@/content/service-options'
import { ServiceSummary } from './ServicePicker'
import { appointmentTitle } from './AppointmentModal'

/** Когда онлайн-заявки выключены: показывает услугу из ?service=, чтобы её было проще назвать по телефону. */
export function PhoneOnlyService() {
  const [option, setOption] = useState<ServiceOption | undefined>(undefined)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- однократное чтение услуги из адреса после гидратации
    setOption(getServiceOption(new URLSearchParams(window.location.search).get('service')))
  }, [])
  if (!option) return null
  return (
    <div style={{ marginBottom: 20 }}>
      <h2 className="form-card__title">{appointmentTitle(option)}</h2>
      <ServiceSummary option={option} />
    </div>
  )
}
