'use client'

import Script from 'next/script'
import { useEffect } from 'react'
import { track, type AnalyticsEvent } from '@/lib/analytics'

const ymId = process.env.NEXT_PUBLIC_YM_ID

/**
 * Делегирование кликов по элементам с data-track (звонок, маршрут, мессенджер).
 * Ссылки остаются серверными; здесь только отправка события без персональных данных.
 */
export function AnalyticsListener() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-track]')
      if (!el) return
      track(el.dataset.track as AnalyticsEvent, { place: el.dataset.place, service: el.dataset.service })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  if (!ymId || !/^\d+$/.test(ymId)) return null
  return (
    <Script id="ym" strategy="afterInteractive">
      {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");ym(${ymId},"init",{clickmap:false,trackLinks:true,accurateTrackBounce:true,webvisor:false});`}
    </Script>
  )
}
