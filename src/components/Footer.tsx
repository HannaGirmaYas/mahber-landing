import { useRef, useState, type FormEvent } from 'react'
import { useMagnetic } from '../hooks/useMagnetic.ts'
import { studioEmail } from '../studio.ts'

export function Footer() {
  const submit = useRef<HTMLButtonElement>(null)
  const [note, setNote] = useState('')
  useMagnetic(submit)

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const brief = String(data.get('brief') ?? '').trim()
    const subject = encodeURIComponent('A consultation with Mahber Studio')
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${brief}`)
    setNote('Opening your email app with this note.')
    window.location.href = `mailto:${studioEmail}?subject=${subject}&body=${body}`
  }

  return (
    <footer className="site-footer" id="contact">
      <div className="footer-grid">
        <div>
          <p className="kicker">Start a consultation</p>
          <h2 id="contact-title">Tell us what you are working around.</h2>
          <p className="lede">
            A website, an operations tool, an app, or software that should replace a spreadsheet. We reply, talk it through with you, and say plainly what we would build.
          </p>
        </div>
        <form className="footer-form" onSubmit={onSubmit} aria-labelledby="contact-title">
          <label className="field">
            <span>Name</span>
            <input name="name" type="text" autoComplete="name" required />
          </label>
          <label className="field">
            <span>Email</span>
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label className="field">
            <span>What you need</span>
            <textarea name="brief" required placeholder="What should the software do?" />
          </label>
          <button ref={submit} className="btn" type="submit">
            Request a consultation
          </button>
          <p className="form-note" role="status">
            {note}
          </p>
        </form>
      </div>
      <div className="footer-base">
        <a href={`mailto:${studioEmail}`}>{studioEmail}</a>
        <p className="ethiopic" lang="am">
          ማህበር
        </p>
        <p>© {new Date().getFullYear()} Mahber Studio</p>
      </div>
    </footer>
  )
}
