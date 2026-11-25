import { useLayoutEffect, useRef } from 'react'
import { useMagnetic } from '../hooks/useMagnetic.ts'
import { gsap, reducedMotion } from '../motion.ts'
import { GridField } from './GridField.tsx'

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const cta = useRef<HTMLAnchorElement>(null)
  useMagnetic(cta)

  useLayoutEffect(() => {
    const scope = root.current
    if (!scope || reducedMotion()) return

    const targets = () => scope.querySelectorAll<HTMLElement>('.line-inner, .hero-reveal')
    const ctx = gsap.context(() => {
      gsap.from('.line-inner', {
        yPercent: 110,
        duration: 1.05,
        stagger: 0.08,
        ease: 'power3.out',
        overwrite: 'auto',
      })
      gsap.from('.hero-reveal', {
        y: 16,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.06,
        delay: 0.22,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }, scope)

    const failsafe = window.setTimeout(() => {
      gsap.killTweensOf(targets())
      targets().forEach((node) => {
        node.style.removeProperty('transform')
        node.style.removeProperty('opacity')
        node.style.removeProperty('visibility')
      })
    }, 1800)

    return () => {
      window.clearTimeout(failsafe)
      ctx.revert()
    }
  }, [])

  return (
    <section className="hero" id="top" ref={root}>
      <div className="hero-top">
        <div className="hero-copy">
          <p className="kicker hero-reveal">Custom software</p>
          <h1>
            <span className="line">
              <span className="line-inner">Let’s Build</span>
            </span>
            <span className="line">
              <span className="line-inner">Together.</span>
            </span>
          </h1>
          <p className="hero-deck hero-reveal">
            Mahber means we gather, and we stay. We consult, build, and deploy with you, and we
            won’t leave you hanging once it is live. The product is yours.
          </p>
          <div className="hero-actions hero-reveal">
            <a ref={cta} className="btn" href="#contact">
              Start a consultation
            </a>
            <a className="text-link" href="#work">
              See the work
            </a>
          </div>
        </div>
        <GridField />
      </div>
      <dl className="metrics hero-reveal">
        <div>
          <dt>01</dt>
          <dd>Consult on the real work</dd>
        </div>
        <div>
          <dt>02</dt>
          <dd>Build software for it</dd>
        </div>
        <div>
          <dt>03</dt>
          <dd>Deploy it. You own it.</dd>
        </div>
      </dl>
    </section>
  )
}
