import { ReactNode } from 'react'

export default function SectionCard({ title, children }: { title: string, children: ReactNode }) {
  return (
    <section className="card">
      <div className="card-header">
        <h2 className="card-title">{title}</h2>
      </div>
      <div className="card-content">
        {children}
      </div>
    </section>
  )
}
