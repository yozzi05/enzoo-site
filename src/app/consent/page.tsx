import type { Metadata } from 'next'
import Link from 'next/link'
import { PageIntro } from '@/components/ui/PageIntro'
import { LegalUpdated, Operator } from '@/components/legal/Operator'
import { site } from '@/config/site'

export const metadata: Metadata = {
  title: 'Согласие на обработку персональных данных',
  description: 'Текст согласия на обработку персональных данных при отправке заявки на сайте ветеринарной клиники EnZoo.',
  alternates: { canonical: '/consent' },
}

export default function ConsentPage() {
  return (
    <>
      <PageIntro crumbs={[{ href: '/consent', label: 'Согласие на обработку данных' }]} title="Согласие на обработку персональных данных" />
      <section className="section section--tight">
        <div className="container legal">
          <LegalUpdated />
          <p style={{ marginTop: 16 }}>
            Отмечая согласие в форме заявки на сайте, я свободно, своей волей и в своём интересе даю согласие на обработку моих персональных данных на следующих условиях.
          </p>
          <h2>Оператор</h2>
          <Operator />
          <h2>Состав данных</h2>
          <ul>
            <li>имя;</li>
            <li>номер телефона;</li>
            <li>сведения, которые я указал(а) по желанию: вид питомца, услуга, желательная дата визита, комментарий.</li>
          </ul>
          <h2>Цель обработки</h2>
          <p>Связь со мной для согласования и подтверждения визита в ветеринарную клинику и ответа на вопросы по заявке.</p>
          <h2>Действия с данными</h2>
          <p>Сбор, запись, систематизация, хранение, уточнение, использование, удаление и уничтожение — с использованием средств автоматизации и без них.</p>
          <h2>Срок и отзыв согласия</h2>
          <p>
            Согласие действует до достижения цели обработки или до его отзыва. Отозвать согласие можно, сообщив об этом по телефону <a href={site.phone.href}>{site.phone.display}</a>.
          </p>
          <p>
            Подробнее — в <Link href="/privacy">политике конфиденциальности</Link>.
          </p>
        </div>
      </section>
    </>
  )
}
