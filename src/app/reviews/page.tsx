import type { Metadata } from 'next'
import { PageIntro } from '@/components/ui/PageIntro'
import { site } from '@/config/site'
import { Icon } from '@/components/Icon'

export const metadata: Metadata = {
  title: 'Отзывы о клинике',
  description: 'Где почитать отзывы о ветеринарной клинике EnZoo в Махачкале и оставить свой: Яндекс Карты и 2ГИС.',
  alternates: { canonical: '/reviews' },
}

export default function ReviewsPage() {
  return (
    <>
      <PageIntro
        crumbs={[{ href: '/reviews', label: 'Отзывы' }]}
        title="Отзывы о клинике"
        lead="Мы не пересказываем отзывы и не публикуем их без указания источника. Мнения владельцев питомцев можно прочитать на независимых площадках."
      />
      <section className="section">
        <div className="container split">
          <div>
            <h2>Хотите оставить отзыв?</h2>
          </div>
          <div className="prose">
            <p>Откройте карточку клиники в удобном сервисе и оставьте отзыв - это помогает другим владельцам сделать выбор.</p>
            <div className="actions" style={{ margin: '20px 0 24px' }}>
              <a href={site.maps.yandexReviews} target="_blank" rel="noopener noreferrer" className="btn btn--primary" data-track="route_click" data-place="review-yandex">
                Оставить отзыв в Яндекс Картах <Icon name="external" size={18} />
                <span className="visually-hidden"> (откроется в новой вкладке)</span>
              </a>
              <a href={site.maps.twoGisReviews} target="_blank" rel="noopener noreferrer" className="btn btn--outline" data-track="route_click" data-place="review-2gis">
                Оставить отзыв в 2ГИС <Icon name="external" size={18} />
                <span className="visually-hidden"> (откроется в новой вкладке)</span>
              </a>
            </div>
            <p>
              Если что-то пошло не так, расскажите об этом по телефону <a href={site.phone.href} data-track="call_click" data-place="reviews">{site.phone.display}</a> - мы постараемся
              разобраться.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
