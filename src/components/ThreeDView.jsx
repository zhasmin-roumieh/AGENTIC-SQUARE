import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'

export default function ThreeDView({ onLoaded, paused = false, interactive = true, autoZoomMs = 0 }) {
  const mountRef = useRef(null)
  const apiRef = useRef({})
  const [mode, setMode] = useState('parallel')
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const onLoadedRef = useRef(onLoaded)
  onLoadedRef.current = onLoaded
  const pausedRef = useRef(paused)
  pausedRef.current = paused

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.outputColorSpace  = THREE.SRGBColorSpace
    renderer.toneMapping       = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.8
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type    = THREE.PCFSoftShadowMap
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#F0EDE5')

    // Base ambient fill (kept low so the sun light below can cast visible shadows)
    scene.add(new THREE.AmbientLight(0xffffff, 2.4))
    scene.add(new THREE.HemisphereLight(0xffffff, 0xd0e8e4, 0.9))

    // Sun / key light — casts the shadows
    const key = new THREE.DirectionalLight(0xfff8f0, 2.6)
    key.castShadow = true
    scene.add(key)
    scene.add(key.target)

    // Fill light — left side, no shadow
    const fillL = new THREE.DirectionalLight(0xddeeff, 0.8)
    fillL.position.set(-6, 4, 2)
    scene.add(fillL)

    // Rim / back light, no shadow
    const rim = new THREE.DirectionalLight(0xffffff, 0.5)
    rim.position.set(-2, 6, -6)
    scene.add(rim)

    // Ground plane — invisible except where it catches a shadow
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(2000, 2000),
      new THREE.ShadowMaterial({ opacity: 0.28 })
    )
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    scene.add(ground)

    const perspCam = new THREE.PerspectiveCamera(42, mount.clientWidth / mount.clientHeight, 0.01, 10000)
    const orthoCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.01, 10000)
    const orthoZoomFactor = Math.tan(THREE.MathUtils.degToRad(perspCam.fov / 2))
    let activeCamera = orthoCam

    let theta = Math.PI / 4, phi = Math.PI / 3.5, radius = 50
    let baseRadius = 50
    let zoomStartTime = null
    // Set once this effect's cleanup has run (e.g. React StrictMode's
    // dev-only double-mount) so a model load already in flight from a
    // torn-down instance can't still call onLoaded a second time.
    let cancelled = false
    const target = new THREE.Vector3()

    // Manual orbit + pinch/wheel zoom — a drag/swipe or pinch on the model
    // takes over from the auto-rotate showcase spin and gives the visitor
    // full control. Zoom range is a fraction of the model's own fitted
    // radius, so it scales correctly regardless of model size.
    let userControlled = false
    let dragging = false
    let lastX = 0, lastY = 0
    let hintTimer = null
    const pointers = new Map()
    let pinchStartDist = null
    let pinchStartRadius = null
    const ORBIT_SPEED = 0.008
    const PHI_MIN = 0.15, PHI_MAX = 1.5
    const radiusMin = () => baseRadius * 0.25
    const radiusMax = () => baseRadius * 2.2
    const pinchDist = () => {
      const [a, b] = [...pointers.values()]
      return Math.hypot(a.x - b.x, a.y - b.y)
    }

    function updateOrthoFrustum() {
      const halfH = radius * orthoZoomFactor
      const halfW = halfH * (mount.clientWidth / mount.clientHeight)
      orthoCam.left = -halfW; orthoCam.right = halfW
      orthoCam.top  = halfH;  orthoCam.bottom = -halfH
      orthoCam.updateProjectionMatrix()
    }

    function updateCamera() {
      const x = target.x + radius * Math.sin(phi) * Math.cos(theta)
      const y = target.y + radius * Math.cos(phi)
      const z = target.z + radius * Math.sin(phi) * Math.sin(theta)
      perspCam.position.set(x, y, z)
      perspCam.lookAt(target)
      orthoCam.position.set(x, y, z)
      orthoCam.lookAt(target)
      updateOrthoFrustum()
    }
    updateCamera()

    let modelRef = null

    function zoomExtents() {
      if (!modelRef) return
      const box = new THREE.Box3().setFromObject(modelRef)
      box.getCenter(target)
      const sphere = box.getBoundingSphere(new THREE.Sphere())
      const vFit = sphere.radius / Math.sin(THREE.MathUtils.degToRad(perspCam.fov / 2))
      const hFit = vFit / perspCam.aspect
      radius = Math.max(vFit, hFit) * 0.85
      updateCamera()
    }

    apiRef.current = {
      setMode: m => { activeCamera = m === 'perspective' ? perspCam : orthoCam },
    }

    const loader = new GLTFLoader()
    loader.setMeshoptDecoder(MeshoptDecoder)
    loader.load(`${import.meta.env.BASE_URL}images/model.glb`, ({ scene: model }) => {
      if (cancelled) return
      model.traverse(node => {
        if (node.isMesh) {
          const mats = Array.isArray(node.material) ? node.material : [node.material]
          mats.forEach(m => { if (m) { m.side = THREE.DoubleSide; m.needsUpdate = true } })
          node.castShadow = true
          node.receiveShadow = true
        }
      })
      const box = new THREE.Box3().setFromObject(model)
      const centre = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())
      const scale = 40 / Math.max(size.x, size.y, size.z)
      model.scale.setScalar(scale)
      model.position.copy(centre.clone().multiplyScalar(-scale))
      scene.add(model)
      modelRef = model

      const fitted = new THREE.Box3().setFromObject(model)
      const sphere = fitted.getBoundingSphere(new THREE.Sphere())

      // Position the sun and its shadow frustum to fully cover the model
      const lightDist = sphere.radius * 3
      key.position.copy(sphere.center).add(new THREE.Vector3(0.6, 1, 0.5).normalize().multiplyScalar(lightDist))
      key.target.position.copy(sphere.center)
      key.shadow.mapSize.set(2048, 2048)
      key.shadow.camera.left   = -sphere.radius * 1.5
      key.shadow.camera.right  =  sphere.radius * 1.5
      key.shadow.camera.top    =  sphere.radius * 1.5
      key.shadow.camera.bottom = -sphere.radius * 1.5
      key.shadow.camera.near   = 0.1
      key.shadow.camera.far    = lightDist + sphere.radius * 2
      key.shadow.camera.updateProjectionMatrix()
      key.shadow.bias = -0.0004

      fillL.position.copy(sphere.center).add(new THREE.Vector3(-0.8, 0.5, 0.3).normalize().multiplyScalar(lightDist))
      rim.position.copy(sphere.center).add(new THREE.Vector3(-0.3, 0.8, -0.9).normalize().multiplyScalar(lightDist))

      ground.position.set(sphere.center.x, fitted.min.y - sphere.radius * 0.002, sphere.center.z)

      // Frame the whole model once on load — this becomes the "home" zoom
      // level that the pinch/wheel zoom range is measured against.
      zoomExtents()
      baseRadius = radius
      if (autoZoomMs > 0) zoomStartTime = performance.now()
      setLoading(false)
      if (interactive) {
        setShowHint(true)
        hintTimer = setTimeout(() => setShowHint(false), 5000)
      }
      onLoadedRef.current?.()
    }, xhr => {
      if (cancelled) return
      if (xhr.total) setProgress(Math.round((xhr.loaded / xhr.total) * 100))
    }, err => {
      if (cancelled) return
      console.error(err); setLoading(false); onLoadedRef.current?.()
    })

    const onResize = () => {
      perspCam.aspect = mount.clientWidth / mount.clientHeight
      perspCam.updateProjectionMatrix()
      updateOrthoFrustum()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener('resize', onResize)

    // Drag/swipe-to-orbit + two-finger pinch-to-zoom — bound to the canvas
    // itself (not the wrapping mount div) so it never intercepts clicks on
    // the Parallel/Perspective buttons, which are separate sibling elements
    // layered on top.
    const canvas = renderer.domElement
    canvas.style.touchAction = 'none'

    const dismissHint = () => {
      userControlled = true
      setShowHint(false)
      clearTimeout(hintTimer)
    }

    const onPointerDown = e => {
      canvas.setPointerCapture(e.pointerId)
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
      dismissHint()

      if (pointers.size === 2) {
        dragging = false
        pinchStartDist = pinchDist()
        pinchStartRadius = radius
      } else if (pointers.size === 1) {
        dragging = true
        lastX = e.clientX
        lastY = e.clientY
      }
    }
    const onPointerMove = e => {
      if (!pointers.has(e.pointerId)) return
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })

      if (pointers.size === 2) {
        const dist = pinchDist()
        if (pinchStartDist) {
          radius = Math.min(radiusMax(), Math.max(radiusMin(), pinchStartRadius * (pinchStartDist / dist)))
        }
        return
      }

      if (dragging) {
        const dx = e.clientX - lastX
        const dy = e.clientY - lastY
        lastX = e.clientX
        lastY = e.clientY
        theta -= dx * ORBIT_SPEED
        phi = Math.min(PHI_MAX, Math.max(PHI_MIN, phi - dy * ORBIT_SPEED))
      }
    }
    const onPointerUp = e => {
      pointers.delete(e.pointerId)
      pinchStartDist = null
      if (pointers.size === 1) {
        const [remaining] = pointers.values()
        dragging = true
        lastX = remaining.x
        lastY = remaining.y
      } else {
        dragging = false
      }
    }
    const onWheel = e => {
      e.preventDefault()
      dismissHint()
      radius = Math.min(radiusMax(), Math.max(radiusMin(), radius * (1 + e.deltaY * 0.001)))
    }
    if (interactive) {
      canvas.addEventListener('pointerdown', onPointerDown)
      canvas.addEventListener('pointermove', onPointerMove)
      canvas.addEventListener('pointerup', onPointerUp)
      canvas.addEventListener('pointercancel', onPointerUp)
      canvas.addEventListener('wheel', onWheel, { passive: false })
    }

    // Continuous auto-orbit until the visitor takes over via drag/pinch/wheel.
    // Skip the actual render/update work while scrolled off-screen so the
    // (software-rendered, on some machines) WebGL loop doesn't compete with
    // the rest of the page's animations for main-thread time.
    let frameId
    const animate = () => {
      frameId = requestAnimationFrame(animate)
      if (pausedRef.current) return
      if (!userControlled) theta += 0.003
      if (autoZoomMs > 0 && zoomStartTime !== null) {
        const t = Math.min(1, (performance.now() - zoomStartTime) / autoZoomMs)
        radius = baseRadius * (1 - 0.75 * t)
      }
      updateCamera()
      renderer.render(scene, activeCamera)
    }
    animate()

    return () => {
      cancelled = true
      cancelAnimationFrame(frameId)
      clearTimeout(hintTimer)
      window.removeEventListener('resize', onResize)
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointercancel', onPointerUp)
      canvas.removeEventListener('wheel', onWheel)
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [])

  const btnStyle = active => ({
    fontFamily: "'BBTorsosPro', sans-serif",
    fontSize: '0.6rem',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: active ? '#000' : '#8A8A8A',
    background: active ? '#fff' : 'transparent',
    border: '1px solid #8A8A8A',
    borderRadius: '100px',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
  })

  const hintLabelStyle = {
    fontFamily: "'BBTorsosPro', sans-serif",
    fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase',
    color: '#8A8A8A',
  }

  return (
    <div ref={mountRef} style={{ position: 'absolute', inset: 0 }}>
      {loading && (
        <div style={{
          position: 'absolute', inset: 0,
          background: '#F0EDE5',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: '1.2rem', zIndex: 20,
        }}>
          <div className="loader-spin" style={{
            width: '2.4rem', height: '2.4rem', borderRadius: '50%',
            border: '3px solid rgba(0,0,0,0.12)',
            borderTopColor: '#a82b39',
          }} />
          <div style={{
            fontFamily: "'BBTorsosPro', sans-serif",
            fontSize: '0.7rem', letterSpacing: '0.2em',
            textTransform: 'uppercase', color: '#8A8A8A',
          }}>
            Loading 3D model{progress > 0 ? ` · ${progress}%` : '…'}
          </div>
        </div>
      )}

      {interactive && (
        <div style={{
          position: 'absolute', top: '1.5rem', right: '1.5rem',
          display: 'flex', gap: '0.5rem', zIndex: 10,
        }}>
          <button
            style={btnStyle(mode === 'parallel')}
            onClick={() => { apiRef.current.setMode?.('parallel'); setMode('parallel') }}
          >Parallel</button>
          <button
            style={btnStyle(mode === 'perspective')}
            onClick={() => { apiRef.current.setMode?.('perspective'); setMode('perspective') }}
          >Perspective</button>
        </div>
      )}

      {interactive && (
        <div style={{
          position: 'absolute', top: '1.8rem', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
          zIndex: 10, pointerEvents: 'none',
          opacity: showHint ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className="hint-hand" style={{ fontSize: '1.2rem' }}>🖐️</span>
            <span style={hintLabelStyle}>Drag to rotate</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className="hint-pinch" style={{ fontSize: '1.2rem' }}>🤏</span>
            <span style={hintLabelStyle}>Pinch to zoom</span>
          </div>
        </div>
      )}
    </div>
  )
}
