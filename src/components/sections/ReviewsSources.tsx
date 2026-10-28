import Link from 'next/link'
import { site } from '@/config/site'
import { Icon } from '@/components/Icon'

/** Отзывы не генерируются и не пересказываются: только переходы на площадки. */
export function ReviewsSources({ titleId, compact = true }: { titleId: string; compact?: boolean }) {
  return (
    <div className="reviews-sources">
      <div>
        <p className="eyebrow eyebrow--dark">Отзывы</p>
        <h2 id={titleId}>Отзывы - на независимых площадках</h2>
        <p className="reviews-sources__text">Мы не публикуем отзывы без указания источника. Почитать мнения владельцев и оставить свой отзыв можно в картографических сервисах.</p>
      </div>
      <div className="reviews-sources__links">
        <a href={site.maps.yandexSearch} target="_blank" rel="noopener noreferrer" className="btn btn--outline" data-track="route_click" data-place="reviews-yandex">
          Яндекс Карты <Icon name="external" size={18} />
          <span className="visually-hidden"> (откроется в новой вкладке)</span>
        </a>
        <a href={site.maps.twoGisSearch} target="_blank" rel="noopener noreferrer" className="btn btn--outline" data-track="route_click" data-place="reviews-2gis">
          2ГИС <Icon name="external" size={18} />
          <span className="visually-hidden"> (откроется в новой вкладке)</span>
        </a>
        {compact && (
          <Link href="/reviews" className="link-arrow">
            Об отзывах <Icon name="arrow" size={18} />
          </Link>
        )}
      </div>
    </div>
  )
}
