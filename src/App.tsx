import { Capabilities } from './components/Capabilities.tsx'
import { Footer } from './components/Footer.tsx'
import { Hero } from './components/Hero.tsx'
import { Marquee } from './components/Marquee.tsx'
import { Nav } from './components/Nav.tsx'
import { Process } from './components/Process.tsx'
import { Showcase } from './components/Showcase.tsx'

export default function App() {
  return (
    <>
      <a className="skip" href="#top">
        Skip to content
      </a>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Showcase />
        <Capabilities />
        <Process />
      </main>
      <Footer />
    </>
  )
}
