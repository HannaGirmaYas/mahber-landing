const steps = [
  {
    index: '01',
    title: 'Consult',
    body: 'We learn the work, what you use today, and what the software should do. Written down before a file is opened.',
  },
  {
    index: '02',
    title: 'Build',
    body: 'We design and develop it around how you work, until you can click through the real product.',
  },
  {
    index: '03',
    title: 'Deploy',
    body: 'We put it live. It belongs to you. Later changes stay with the same people.',
  },
] as const

export function Process() {
  return (
    <section className="section" id="process">
      <header className="section-head">
        <span className="idx">03</span>
        <div>
          <h2>Process</h2>
          <p className="lede">A conversation, a build, then software that is live and yours.</p>
        </div>
      </header>
      <ol className="steps">
        {steps.map((step) => (
          <li key={step.index}>
            <span>{step.index}</span>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
