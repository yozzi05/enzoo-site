'use client'

import { useState } from 'react'
import { site } from '@/config/site'
import { Icon } from '@/components/Icon'

/** Карта загружается только по нажатию: без автоматических запросов к картам и геолокации. */
export function MapEmbed() {
  const [shown, setShown] = useState(false)
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
          <button type="button" className="btn btn--outline btn--sm" onClick={() => setShown(true)}>
            Показать карту
          </button>
          <p className="map__note">Карта загрузится с сервиса Яндекс Карты.</p>
        </div>
      )}
    </div>
  )
}
