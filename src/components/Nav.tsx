import { useEffect, useRef, useState } from 'react'
import { useMagnetic } from '../hooks/useMagnetic.ts'
import { useStudioClock } from '../hooks/useStudioClock.ts'
import { navLinks } from '../studio.ts'
import { Mark } from './Mark.tsx'

export function Nav() {
  const [open, setOpen] = useState(false)
  const cta = useRef<HTMLAnchorElement>(null)
  const menuCta = useRef<HTMLAnchorElement>(null)
  useMagnetic(cta)
  useMagnetic(menuCta)
  const { time, zone } = useStudioClock()

  useEffect(() => {
    document.body.classList.toggle('nav-open', open)
    return () => document.body.classList.remove('nav-open')
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <header className="nav">
        <a className="wordmark" href="#top">
          <Mark />
          <span>Mahber Studio</span>
        </a>
        <nav className="nav-links" aria-label="Primary">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <p className="nav-clock" aria-hidden="true">
          <span>Local</span>
          <time>{time}</time>
          <span>{zone}</span>
        </p>
        <a ref={cta} className="btn nav-cta" href="#contact">
          Start a consultation
        </a>
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </header>
      <div id="mobile-nav" className={open ? 'mobile-nav is-open' : 'mobile-nav'} hidden={!open}>
        <nav aria-label="Mobile">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
        </nav>
        <p className="mobile-clock">
          <span>Local studio time</span>
          <time>
            {time} {zone}
          </time>
        </p>
        <a ref={menuCta} className="btn" href="#contact" onClick={() => setOpen(false)}>
          Start a consultation
        </a>
      </div>
    </>
  )
}
