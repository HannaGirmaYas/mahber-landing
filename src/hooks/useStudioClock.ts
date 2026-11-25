import { useEffect, useState } from 'react'

export function useStudioClock() {
  const [time, setTime] = useState('--:--:--')
  const [zone, setZone] = useState('')

  useEffect(() => {
    const clock = new Intl.DateTimeFormat(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
    const zoneFormat = new Intl.DateTimeFormat(undefined, { timeZoneName: 'short' })

    const tick = () => {
      const now = new Date()
      setTime(clock.format(now))
      const part = zoneFormat.formatToParts(now).find((item) => item.type === 'timeZoneName')
      setZone(part?.value ?? '')
    }

    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  return { time, zone }
}
