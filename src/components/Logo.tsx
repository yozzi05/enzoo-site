import Image from 'next/image'
import Link from 'next/link'

/**
 * Оригинальный логотип enzoo24.ru (EnzooLogo2500.png) в компактной горизонтальной
 * компоновке: знак и надпись — неизменённые фрагменты исходного файла.
 * Горизонтальной версии в источнике нет (см. CONTENT_GAPS.md).
 */
export function Logo({ priority = false }: { priority?: boolean }) {
  return (
    <Link href="/" className="logo" aria-label="EnZoo, ветеринарная клиника — на главную">
      <Image src="/brand/enzoo-mark.png" alt="" width={178} height={300} className="logo__mark" priority={priority} />
      <Image src="/brand/enzoo-name.png" alt="" width={480} height={108} className="logo__word" priority={priority} />
    </Link>
  )
}
