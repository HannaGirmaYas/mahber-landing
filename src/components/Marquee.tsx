import { useLayoutEffect, useRef } from 'react'
import { gsap, reducedMotion, ScrollTrigger } from '../motion.ts'
import { stack } from '../studio.ts'

export function Marquee() {
  const rail = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const railEl = rail.current
    const trackEl = track.current
    if (!railEl || !trackEl || reducedMotion()) return

    railEl.classList.add('is-running')
    let x = 0
    let boost = 0
    const setX = gsap.quickSetter(trackEl, 'x', 'px')

    const tick = () => {
      const width = trackEl.scrollWidth / 2
      if (!width) return
      boost *= 0.9
      x -= 0.7 + boost
      if (x <= -width) x += width
      setX(x)
    }

    gsap.ticker.add(tick)
    const trigger = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        boost = Math.min(Math.abs(self.getVelocity()) / 350, 12)
      },
    })

    return () => {
      gsap.ticker.remove(tick)
      trigger.kill()
      railEl.classList.remove('is-running')
      gsap.set(trackEl, { clearProps: 'transform' })
    }
  }, [])

  return (
    <div className="rail" ref={rail}>
      <div className="rail-track" ref={track}>
        {[0, 1].map((copy) => (
          <div className="rail-set" key={copy} aria-hidden={copy === 1 ? true : undefined}>
            {stack.map((item) => (
              <span key={`${copy}-${item}`}>{item}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
