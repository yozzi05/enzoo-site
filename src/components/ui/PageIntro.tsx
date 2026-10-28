import type { ReactNode } from 'react'
import { Breadcrumbs, type Crumb } from './Breadcrumbs'

/** Шапка внутренней страницы: синяя полоса с крошками, H1 и вводным текстом. */
export function PageIntro({ crumbs, title, lead, children, eyebrow }: { crumbs: Crumb[]; title: string; lead?: ReactNode; children?: ReactNode; eyebrow?: string }) {
  return (
    <section className="page-intro">
      <div className="container">
        <Breadcrumbs items={crumbs} />
        <div className="page-intro__body">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1>{title}</h1>
          {lead && <p className="page-intro__lead">{lead}</p>}
          {children}
        </div>
      </div>
    </section>
  )
}
