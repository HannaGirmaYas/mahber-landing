import { useLayoutEffect, useRef, useState } from 'react'
import { gsap, reducedMotion } from '../motion.ts'

const records = [
  {
    name: 'Billing',
    status: 'Live',
    owner: 'Finance',
    load: 72,
    note: 'Invoices and the figure that closed the week.',
  },
  {
    name: 'Queue',
    status: 'Hold',
    owner: 'Ops',
    load: 41,
    note: 'Work waiting on a person, listed in the order it arrived.',
  },
  {
    name: 'Audit',
    status: 'Draft',
    owner: 'Studio',
    load: 18,
    note: 'Who changed what, from the latest edit backward.',
  },
  {
    name: 'Release',
    status: 'Live',
    owner: 'Build',
    load: 63,
    note: 'The version that is actually in production.',
  },
] as const

const tasks = ['Open today’s jobs', 'Mark one done', 'Leave a note'] as const

function LandingPreview() {
  const [mode, setMode] = useState<'about' | 'contact'>('about')
  const [noted, setNoted] = useState(false)

  return (
    <div className="lp">
      <div className="lp-bar">
        <span>Example / Website</span>
        <span>01</span>
      </div>
      <div className="lp-body">
        <p className="lp-title">A site of their own.</p>
        <p className="lp-deck">What they do, who they are, and a way to reach them. Built for them and put on their domain.</p>
      </div>
      <div className="lp-controls">
        <div className="lp-toggle" role="group" aria-label="Pages on the sample site">
          <button type="button" aria-pressed={mode === 'about'} onClick={() => setMode('about')}>
            About
          </button>
          <button type="button" aria-pressed={mode === 'contact'} onClick={() => setMode('contact')}>
            Contact
          </button>
        </div>
        <p className="lp-note">
          {mode === 'about'
            ? 'What they do, stated on their site.'
            : 'A way to reach them. The site is theirs.'}
        </p>
        <label className="lp-field">
          <span>Email</span>
          <input type="email" name="sample-email" placeholder="name@company.com" autoComplete="off" />
        </label>
        <button type="button" className="lp-go" onClick={() => setNoted(true)}>
          {noted ? 'Noted in the sample' : 'Request a consultation'}
        </button>
        <p className="lp-fine">Example of client work. Nothing is sent.</p>
      </div>
    </div>
  )
}

function DashboardPreview() {
  const [active, setActive] = useState(0)
  const row = records[active]

  return (
    <div className="dash">
      <div className="dash-nav" role="group" aria-label="Sections">
        {records.map((item, index) => (
          <button
            key={item.name}
            type="button"
            aria-pressed={index === active}
            onClick={() => setActive(index)}
          >
            {item.name}
          </button>
        ))}
      </div>
      <div className="dash-main">
        <div className="kpis">
          <p>
            <span>Open</span>
            <strong>18</strong>
          </p>
          <p>
            <span>Waiting</span>
            <strong>04</strong>
          </p>
          <p>
            <span>Shipped</span>
            <strong>07</strong>
          </p>
        </div>
        <div className="bars" aria-hidden="true">
          {records.map((item, index) => (
            <span key={item.name} style={{ height: `${item.load}%` }} data-on={index === active} />
          ))}
        </div>
        <div className="table">
          {records.map((item, index) => (
            <button
              key={item.name}
              type="button"
              aria-pressed={index === active}
              onClick={() => setActive(index)}
            >
              <span>{item.name}</span>
              <span className={`status status-${item.status.toLowerCase()}`}>{item.status}</span>
              <span>{item.owner}</span>
            </button>
          ))}
        </div>
      </div>
      <aside className="dash-detail">
        <p className="detail-label">{row.name}</p>
        <p>{row.note}</p>
        <p className="detail-load">Load {String(row.load).padStart(2, '0')}</p>
      </aside>
    </div>
  )
}

function MobilePreview() {
  const [screen, setScreen] = useState<'Today' | 'Queue' | 'Note'>('Today')
  const [done, setDone] = useState<string[]>(['Write the scope'])

  return (
    <div className="phone-wrap">
      <div className="phone">
        <p className="phone-status">
          <span>Sample</span>
          <span>App</span>
        </p>
        <div className="phone-screen">
          {screen === 'Today' ? (
            <ul className="checks">
              {tasks.map((task) => {
                const on = done.includes(task)
                return (
                  <li key={task}>
                    <button
                      type="button"
                      className="check"
                      aria-pressed={on}
                      onClick={() =>
                        setDone((current) =>
                          current.includes(task) ? current.filter((item) => item !== task) : [...current, task],
                        )
                      }
                    >
                      <span>{task}</span>
                      <span className="tick" aria-hidden="true" />
                    </button>
                  </li>
                )
              })}
            </ul>
          ) : null}
          {screen === 'Queue' ? (
            <ul className="queue">
              <li>
                <span>04</span>
                <p>Review the open jobs before the day starts.</p>
              </li>
              <li>
                <span>05</span>
                <p>Leave the next step where the team can see it.</p>
              </li>
            </ul>
          ) : null}
          {screen === 'Note' ? (
            <p className="phone-note">A note left on the job, in the app the client keeps.</p>
          ) : null}
        </div>
        <div className="phone-tabs" role="group" aria-label="App sections">
          {(['Today', 'Queue', 'Note'] as const).map((item) => (
            <button key={item} type="button" aria-pressed={screen === item} onClick={() => setScreen(item)}>
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

const studies = [
  {
    index: '01',
    kicker: 'Website',
    title: 'A site of their own.',
    body: 'We consulted, built the site, and deployed it on their domain. It belongs to them.',
    meta: 'WEB / 01',
    preview: <LandingPreview />,
  },
  {
    index: '02',
    kicker: 'Operations',
    title: 'The work, in one place.',
    body: 'Jobs, status, and who owns the next step, instead of a spreadsheet passed around. Built for the client. Their product.',
    meta: 'APP / 02',
    preview: <DashboardPreview />,
  },
  {
    index: '03',
    kicker: 'App',
    title: 'Work that leaves the desk.',
    body: 'A short app for jobs people do away from a desk. Built, deployed, and left in their hands.',
    meta: 'APP / 03',
    preview: <MobilePreview />,
  },
]

function setPanelState(nodes: HTMLElement[], index: number) {
  nodes.forEach((node, nodeIndex) => {
    const on = nodeIndex === index
    node.setAttribute('aria-hidden', on ? 'false' : 'true')
    node.inert = !on
  })
}

export function Showcase() {
  const root = useRef<HTMLElement>(null)
  const pin = useRef<HTMLDivElement>(null)
  const progress = useRef<HTMLParagraphElement>(null)
  const bar = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const section = root.current
    const pinned = pin.current
    if (!section || !pinned || reducedMotion()) return

    const copies = Array.from(section.querySelectorAll<HTMLElement>('[data-copy]'))
    const frames = Array.from(section.querySelectorAll<HTMLElement>('[data-frame]'))
    if (copies.length < 3 || frames.length < 3) return

    const mm = gsap.matchMedia()
    mm.add('(min-width: 960px)', () => {
      gsap.set([copies[0], frames[0]], { autoAlpha: 1, y: 0 })
      gsap.set([copies[1], copies[2], frames[1], frames[2]], { autoAlpha: 0 })
      gsap.set([frames[1], frames[2]], { y: 28 })
      setPanelState(copies, 0)
      setPanelState(frames, 0)

      let current = 0
      const apply = (index: number) => {
        setPanelState(copies, index)
        setPanelState(frames, index)
        if (progress.current) progress.current.textContent = `0${index + 1} / 03`
      }

      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          pin: pinned,
          start: 'top top',
          end: '+=220%',
          scrub: 0.6,
          anticipatePin: 1,
          onUpdate: (self) => {
            const index = self.progress < 0.34 ? 0 : self.progress < 0.67 ? 1 : 2
            if (index !== current) {
              current = index
              apply(index)
            }
            if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`
          },
        },
      })

      timeline
        .to({}, { duration: 0.8 })
        .add('toDashboard')
        .to(copies[0], { autoAlpha: 0, duration: 0.45 }, 'toDashboard')
        .to(frames[0], { autoAlpha: 0, y: -24, duration: 0.45 }, 'toDashboard')
        .to(copies[1], { autoAlpha: 1, duration: 0.45 }, 'toDashboard+=0.12')
        .to(frames[1], { autoAlpha: 1, y: 0, duration: 0.45 }, 'toDashboard+=0.12')
        .to({}, { duration: 0.8 })
        .add('toMobile')
        .to(copies[1], { autoAlpha: 0, duration: 0.45 }, 'toMobile')
        .to(frames[1], { autoAlpha: 0, y: -24, duration: 0.45 }, 'toMobile')
        .to(copies[2], { autoAlpha: 1, duration: 0.45 }, 'toMobile+=0.12')
        .to(frames[2], { autoAlpha: 1, y: 0, duration: 0.45 }, 'toMobile+=0.12')
        .to({}, { duration: 0.7 })

      return () => {
        ;[...copies, ...frames].forEach((node) => {
          node.removeAttribute('aria-hidden')
          node.inert = false
        })
        if (bar.current) bar.current.style.transform = ''
        timeline.scrollTrigger?.kill()
        timeline.kill()
      }
    })

    return () => mm.revert()
  }, [])

  return (
    <section className="showcase" id="work" ref={root}>
      <div className="showcase-pin" ref={pin}>
        <p className="eyebrow">Work</p>
        {studies.map((study) => (
          <article className="case" key={study.index}>
            <div className="case-copy" data-copy>
              <p className="case-kicker">
                <span>{study.index}</span>
                {study.kicker}
              </p>
              <h2>{study.title}</h2>
              <p>{study.body}</p>
            </div>
            <div className="case-frame" data-frame>
              <div className="frame-meta">
                <span>Client work</span>
                <span>{study.meta}</span>
              </div>
              <div className="frame-body">{study.preview}</div>
            </div>
          </article>
        ))}
        <p className="progress" ref={progress}>
          01 / 03
        </p>
        <div className="scrub" aria-hidden="true">
          <span ref={bar} />
        </div>
      </div>
    </section>
  )
}
