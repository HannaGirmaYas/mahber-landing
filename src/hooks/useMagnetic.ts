import { useEffect, type RefObject } from 'react'

export function useMagnetic<T extends HTMLElement>(ref: RefObject<T | null>, max = 14) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    let cx = 0
    let cy = 0
    let x = 0
    let y = 0
    let vx = 0
    let vy = 0
    let tx = 0
    let ty = 0
    let raf = 0
    let looping = false

    const step = () => {
      vx = (vx + (tx - x) * 0.16) * 0.74
      vy = (vy + (ty - y) * 0.16) * 0.74
      x += vx
      y += vy
      const settled =
        Math.abs(tx - x) < 0.12 &&
        Math.abs(ty - y) < 0.12 &&
        Math.abs(vx) < 0.12 &&
        Math.abs(vy) < 0.12
      if (settled) {
        looping = false
        if (tx === 0 && ty === 0) el.style.transform = ''
        else el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`
        return
      }
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`
      raf = requestAnimationFrame(step)
    }

    const kick = () => {
      if (looping) return
      looping = true
      raf = requestAnimationFrame(step)
    }

    const clamp = (value: number) => Math.max(-max, Math.min(max, value))

    const onEnter = () => {
      const rect = el.getBoundingClientRect()
      cx = rect.left + rect.width / 2
      cy = rect.top + rect.height / 2
    }

    const onMove = (event: PointerEvent) => {
      tx = clamp((event.clientX - cx) * 0.35)
      ty = clamp((event.clientY - cy) * 0.45)
      kick()
    }

    const onLeave = () => {
      tx = 0
      ty = 0
      kick()
    }

    el.addEventListener('pointerenter', onEnter)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      el.style.transform = ''
      el.removeEventListener('pointerenter', onEnter)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [ref, max])
}
