import type { Metadata } from 'next'
import { PageIntro } from '@/components/ui/PageIntro'
import { ReviewsSources } from '@/components/sections/ReviewsSources'
import { site } from '@/config/site'

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
        <div className="container">
          <ReviewsSources titleId="rev-sources" compact={false} />
        </div>
      </section>
      <section className="section section--surface">
        <div className="container split">
          <div>
            <h2>Хотите оставить отзыв?</h2>
          </div>
          <div className="prose">
            <p>Найдите клинику на картах по адресу {site.address.city}, {site.address.street} и оставьте отзыв в карточке организации. Это помогает другим владельцам сделать выбор.</p>
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
