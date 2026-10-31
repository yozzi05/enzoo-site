'use client'

import { useEffect, useState } from 'react'
import { getConsent, onConsent, saveConsent } from '@/lib/consent'
import { site } from '@/config/site'
import { Icon } from '@/components/Icon'

/**
 * Карта загружается только по нажатию: без автоматических запросов к картам и геолокации.
 * Если посетитель не разрешил сторонние сервисы, кнопка просит разрешение и только потом загружает карту.
 */
export function MapEmbed() {
  const [shown, setShown] = useState(false)
  const [mapsAllowed, setMapsAllowed] = useState(false)
  useEffect(() => onConsent((c) => setMapsAllowed(Boolean(c?.maps))), [])

  const show = () => {
    if (!mapsAllowed) saveConsent({ analytics: getConsent()?.analytics ?? false, maps: true })
    setShown(true)
  }
  return (
    <div className="map">
      {shown ? (
        <iframe src={site.maps.embed} title={`Карта: ${site.address.full}`} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" />
      ) : (
        <div className="map__placeholder">
          <Icon name="map" size={32} />
          <p>
            {site.address.city}, {site.address.street}
            <br />
            <span>{site.address.landmark}</span>
          </p>
          <button type="button" className="btn btn--outline btn--sm" onClick={show}>
            {mapsAllowed ? 'Показать карту' : 'Разрешить и показать карту'}
          </button>
          <p className="map__note">
            {mapsAllowed ? 'Карта загрузится с сервиса Яндекс Карты.' : 'Карта загружается с Яндекс Карт, сервис может устанавливать свои cookie.'}
          </p>
        </div>
      )}
    </div>
  )
}
