import { useState } from 'react'

const screens = [
  { name: 'Today', note: 'The three things due before noon.' },
  { name: 'Queue', note: 'Waiting work, in the order it arrived.' },
  { name: 'Note', note: 'The constraint, written on the job.' },
] as const

const rows = [
  ['Home', 'Live', 'Client'],
  ['Work', 'Live', 'Client'],
  ['Contact', 'Live', 'Client'],
  ['Notes', 'Draft', 'Client'],
] as const

export function Capabilities() {
  const [screen, setScreen] = useState(0)
  const [armed, setArmed] = useState(false)

  return (
    <section className="section" id="capabilities">
      <header className="section-head">
        <span className="idx">02</span>
        <div>
          <h2>Services</h2>
          <p className="lede">
            Custom software, from the first conversation through a product the client owns. Websites, operations tools, apps, and the links between systems they already use.
          </p>
        </div>
      </header>
      <div className="bento">
        <article className="cell cell-landing">
          <p className="cell-label">
            <span>01</span> Business software
          </p>
          <h3>Tools shaped to the work.</h3>
          <p>Operations, client records, and the numbers a team checks. Built for that workflow. Not a product you rent.</p>
          <div className="plate">
            <p className="plate-kicker">Ownership</p>
            <p className="plate-title">No license. Yours.</p>
            <button type="button" className="snippet-btn" aria-pressed={armed} onClick={() => setArmed((value) => !value)}>
              {armed ? 'Owned by the client' : 'Yours to keep'}
            </button>
          </div>
        </article>
        <article className="cell">
          <p className="cell-label">
            <span>02</span> Websites
          </p>
          <h3>A public site, on their domain.</h3>
          <p>We consult, build the site, and deploy it on their domain.</p>
          <div className="plate plate-dark">
            <div className="mini-table">
              {rows.map((row) => (
                <p key={row[0]}>
                  <span>{row[0]}</span>
                  <span className={`status status-${row[1].toLowerCase()}`}>{row[1]}</span>
                  <span>{row[2]}</span>
                </p>
              ))}
            </div>
          </div>
        </article>
        <article className="cell">
          <p className="cell-label">
            <span>03</span> Apps and integrations
          </p>
          <h3>Work that leaves the desk.</h3>
          <p>Apps people keep with them, and connections between the systems a business already runs.</p>
          <div className="plate plate-dark">
            <div className="screen-list" role="group" aria-label="Screen list">
              {screens.map((item, index) => (
                <button key={item.name} type="button" aria-pressed={screen === index} onClick={() => setScreen(index)}>
                  <span>{item.name}</span>
                  <small>{item.note}</small>
                </button>
              ))}
            </div>
          </div>
        </article>
      </div>
      <p className="handoff">
        <span>Handoff</span>
        You own what we deploy. The same team can stay on for what comes next.
      </p>
    </section>
  )
}
