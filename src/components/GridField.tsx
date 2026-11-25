import { useEffect, useRef, useState } from 'react'
import type { Material, Object3D } from 'three'

type ThreeModule = typeof import('three')

function disposeTree(root: Object3D) {
  root.traverse((node) => {
    const mesh = node as Object3D & {
      geometry?: { dispose: () => void }
      material?: Material | Material[]
    }
    mesh.geometry?.dispose()
    if (Array.isArray(mesh.material)) mesh.material.forEach((item) => item.dispose())
    else mesh.material?.dispose()
  })
}

function mount(THREE: ThreeModule, host: HTMLDivElement, onFirstFrame: () => void) {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))
  renderer.setClearColor(0x000000, 0)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.domElement.setAttribute('aria-hidden', 'true')
  host.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 40)
  camera.position.set(0, 0.15, 6.2)

  const rig = new THREE.Group()
  scene.add(rig)

  const solid = (w: number, h: number, d: number, color: number) => {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      new THREE.MeshBasicMaterial({ color }),
    )
    return mesh
  }

  const outline = (w: number, h: number, d: number, color: number) => {
    const box = new THREE.BoxGeometry(w, h, d)
    const lines = new THREE.LineSegments(
      new THREE.EdgesGeometry(box),
      new THREE.LineBasicMaterial({ color }),
    )
    box.dispose()
    return lines
  }

  const grid = new THREE.GridHelper(8.5, 18, 0x2a4f40, 0x24362c)
  grid.position.y = -1.45
  const gridMaterials = Array.isArray(grid.material) ? grid.material : [grid.material]
  gridMaterials.forEach((material) => {
    material.transparent = true
    material.opacity = 0.55
  })
  rig.add(grid)

  const sheet = new THREE.PlaneGeometry(4.4, 2.5, 14, 8)
  const wire = new THREE.LineSegments(
    new THREE.WireframeGeometry(sheet),
    new THREE.LineBasicMaterial({ color: 0xb8c9b8, transparent: true, opacity: 0.16 }),
  )
  sheet.dispose()
  wire.position.set(0, 0.2, -0.9)
  rig.add(wire)

  const device = new THREE.Group()
  device.add(solid(2.55, 1.55, 0.14, 0x1b3a2f))
  device.add(outline(2.55, 1.55, 0.14, 0xd4e0d4))
  const screen = solid(2.16, 1.08, 0.02, 0x101614)
  screen.position.set(0, 0.1, 0.08)
  device.add(screen)
  const caret = solid(0.42, 0.035, 0.025, 0xc8e86a)
  caret.position.set(-0.68, 0.32, 0.1)
  device.add(caret)
  for (let index = 0; index < 5; index += 1) {
    const key = solid(0.26, 0.07, 0.03, index === 2 ? 0xc8e86a : 0x2a4f40)
    key.position.set(-0.84 + index * 0.42, -0.58, 0.09)
    device.add(key)
  }
  device.rotation.set(-0.58, 0.62, 0.06)
  device.position.set(-0.2, 0.05, 0)
  rig.add(device)

  const module = new THREE.Group()
  module.add(solid(0.62, 0.86, 0.12, 0x132820))
  module.add(outline(0.62, 0.86, 0.12, 0xb8c9b8))
  const lamp = solid(0.08, 0.08, 0.03, 0xc8e86a)
  lamp.position.set(0, 0.24, 0.08)
  module.add(lamp)
  module.position.set(1.15, -0.42, 0.15)
  module.rotation.set(-0.4, 0.38, 0.08)
  rig.add(module)

  const deviceBaseY = device.position.y
  const deviceRotY = device.rotation.y
  const deviceRotZ = device.rotation.z
  const moduleBase = module.position.clone()
  const moduleRotY = module.rotation.y
  const moduleRotZ = module.rotation.z

  const resize = () => {
    const width = host.clientWidth
    const height = host.clientHeight
    if (!width || !height) return
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
  }
  resize()
  const observer = new ResizeObserver(resize)
  observer.observe(host)

  let tiltX = 0
  let tiltY = 0
  let impulseX = 0
  let impulseY = 0
  let lastX = 0
  let lastY = 0
  const onMove = (event: PointerEvent) => {
    const rect = host.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1
    const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1
    const vx = nx - lastX
    const vy = ny - lastY
    lastX = nx
    lastY = ny
    if (Math.abs(nx) > 1.4 || Math.abs(ny) > 1.4) return
    tiltY = nx * 0.52
    tiltX = -ny * 0.3
    impulseY = Math.max(-0.55, Math.min(0.55, impulseY + vx * 1.6))
    impulseX = Math.max(-0.4, Math.min(0.4, impulseX - vy * 1.6))
  }
  window.addEventListener('pointermove', onMove)

  let stopped = false
  let active = true
  let raf = 0
  const clock = new THREE.Clock()
  const draw = () => {
    const t = clock.getElapsedTime()
    impulseX *= 0.97
    impulseY *= 0.97
    const nextX = tiltX + impulseX + Math.sin(t * 0.42) * 0.06
    const nextY = tiltY + impulseY + Math.cos(t * 0.31) * 0.08
    rig.rotation.x += (nextX - rig.rotation.x) * 0.035
    rig.rotation.y += (nextY - rig.rotation.y) * 0.035

    device.position.y = deviceBaseY + Math.sin(t * 0.72) * 0.075
    device.rotation.y = deviceRotY + Math.sin(t * 0.27) * 0.07
    device.rotation.z = deviceRotZ + Math.sin(t * 0.48) * 0.04

    module.position.y = moduleBase.y + Math.cos(t * 0.58) * 0.1
    module.position.x = moduleBase.x + Math.sin(t * 0.36) * 0.055
    module.rotation.y = moduleRotY + Math.sin(t * 0.33) * 0.09
    module.rotation.z = moduleRotZ + Math.cos(t * 0.51) * 0.05

    wire.position.y = 0.2 + Math.sin(t * 0.24) * 0.04
    renderer.render(scene, camera)
  }
  try {
    draw()
    onFirstFrame()
  } catch {
    return () => {
      stopped = true
      observer.disconnect()
      window.removeEventListener('pointermove', onMove)
      disposeTree(scene)
      renderer.dispose()
      renderer.forceContextLoss()
      renderer.domElement.remove()
    }
  }
  const loop = () => {
    if (stopped || !active) return
    raf = requestAnimationFrame(loop)
    draw()
  }
  const onVis = () => {
    if (stopped) return
    const show = document.visibilityState === 'visible'
    if (!show) {
      active = false
      cancelAnimationFrame(raf)
      return
    }
    if (!active) {
      active = true
      raf = requestAnimationFrame(loop)
    }
  }
  document.addEventListener('visibilitychange', onVis)
  raf = requestAnimationFrame(loop)

  return () => {
    stopped = true
    active = false
    cancelAnimationFrame(raf)
    observer.disconnect()
    window.removeEventListener('pointermove', onMove)
    document.removeEventListener('visibilitychange', onVis)
    disposeTree(scene)
    renderer.dispose()
    renderer.forceContextLoss()
    renderer.domElement.remove()
  }
}

export function GridField({ onReady = () => undefined }: { onReady?: () => void }) {
  const host = useRef<HTMLDivElement>(null)
  const readyRef = useRef(onReady)
  const [live, setLive] = useState(false)

  useEffect(() => {
    readyRef.current = onReady
  }, [onReady])

  useEffect(() => {
    const node = host.current
    if (!node) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const narrow = window.matchMedia('(max-width: 800px)').matches
    if (reduce || narrow) {
      readyRef.current()
      return
    }

    let cancelled = false
    let cleanup = () => {}
    void import('three')
      .then((THREE) => {
        if (cancelled || !host.current) return
        try {
          cleanup = mount(THREE, host.current, () => {
            if (cancelled) return
            setLive(true)
            readyRef.current()
          })
        } catch {
          readyRef.current()
        }
      })
      .catch(() => {
        if (!cancelled) readyRef.current()
      })

    return () => {
      cancelled = true
      cleanup()
    }
  }, [])

  return (
    <div className={live ? 'gridfield is-live' : 'gridfield'} ref={host} aria-hidden="true">
      <svg className="device-drawing" viewBox="0 0 640 480" fill="none">
        <g stroke="#2A4F40" strokeWidth="1">
          {Array.from({ length: 9 }, (_, index) => (
            <line key={`v${index}`} x1={40 + index * 70} y1="40" x2={40 + index * 70} y2="440" />
          ))}
          {Array.from({ length: 7 }, (_, index) => (
            <line key={`h${index}`} x1="40" y1={40 + index * 66} x2="600" y2={40 + index * 66} />
          ))}
        </g>
        <rect x="108" y="86" width="340" height="236" fill="#132820" stroke="#D4E0D4" />
        <rect x="128" y="108" width="300" height="156" fill="#101614" stroke="#2A4F40" />
        <rect x="146" y="126" width="78" height="6" fill="#C8E86A" />
        {Array.from({ length: 5 }, (_, index) => (
          <rect
            key={`k${index}`}
            x={146 + index * 54}
            y="284"
            width="36"
            height="14"
            fill={index === 2 ? '#C8E86A' : '#2A4F40'}
          />
        ))}
        <rect x="470" y="150" width="78" height="128" fill="#1B3A2F" stroke="#B8C9B8" />
        <rect x="494" y="170" width="12" height="12" fill="#C8E86A" />
        <text
          x="108"
          y="360"
          fill="#B8C9B8"
          fontFamily="IBM Plex Mono, ui-monospace, monospace"
          fontSize="12"
        >
          MODULE 240 × 148
        </text>
      </svg>
      <p className="grid-label">
        <span>Module</span>
        <span>240 × 148</span>
      </p>
    </div>
  )
}
