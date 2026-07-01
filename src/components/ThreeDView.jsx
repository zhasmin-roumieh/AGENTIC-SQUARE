import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export default function ThreeDView() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.outputColorSpace  = THREE.SRGBColorSpace
    renderer.toneMapping       = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.8
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#F0EDE5')

    // Strong ambient base — flat, even light with no hard shadows
    scene.add(new THREE.AmbientLight(0xffffff, 3.5))

    // Key light — top right front
    const key = new THREE.DirectionalLight(0xfff8f0, 1.4)
    key.position.set(5, 8, 4)
    scene.add(key)

    // Fill light — left side
    const fillL = new THREE.DirectionalLight(0xddeeff, 0.9)
    fillL.position.set(-6, 4, 2)
    scene.add(fillL)

    // Rim / back light
    const rim = new THREE.DirectionalLight(0xffffff, 0.6)
    rim.position.set(-2, 6, -6)
    scene.add(rim)

    // Soft ground bounce
    scene.add(new THREE.HemisphereLight(0xffffff, 0xd0e8e4, 1.4))

    const camera = new THREE.PerspectiveCamera(42, mount.clientWidth / mount.clientHeight, 0.01, 10000)
    let theta = Math.PI / 4, phi = Math.PI / 3.5, radius = 50
    const target = new THREE.Vector3()

    function updateCamera() {
      camera.position.set(
        target.x + radius * Math.sin(phi) * Math.cos(theta),
        target.y + radius * Math.cos(phi),
        target.z + radius * Math.sin(phi) * Math.sin(theta)
      )
      camera.lookAt(target)
    }
    updateCamera()

    new GLTFLoader().load(`${import.meta.env.BASE_URL}images/model.glb`, ({ scene: model }) => {
      model.traverse(node => {
        if (node.isMesh) {
          const mats = Array.isArray(node.material) ? node.material : [node.material]
          mats.forEach(m => { if (m) { m.side = THREE.DoubleSide; m.needsUpdate = true } })
        }
      })
      const box = new THREE.Box3().setFromObject(model)
      const centre = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())
      const scale = 40 / Math.max(size.x, size.y, size.z)
      model.scale.setScalar(scale)
      model.position.copy(centre.clone().multiplyScalar(-scale))
      const fitted = new THREE.Box3().setFromObject(model)
      fitted.getCenter(target)

      // Fit the whole model in view: find the distance needed so the
      // bounding sphere fits within both the vertical and horizontal FOV.
      const sphere = fitted.getBoundingSphere(new THREE.Sphere())
      const vFitDistance = sphere.radius / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2))
      const hFitDistance = vFitDistance / camera.aspect
      radius = Math.max(vFitDistance, hFitDistance) * 1.15
      updateCamera()
      scene.add(model)
    }, undefined, err => console.error(err))

    let mode = 'none', autoRotate = true, lastX = 0, lastY = 0

    const getRight = () => new THREE.Vector3().subVectors(camera.position, target).normalize().cross(new THREE.Vector3(0,1,0)).normalize()
    const getUp    = () => { const r = getRight(); return new THREE.Vector3().subVectors(camera.position, target).normalize().negate().cross(r).normalize() }

    const onMouseDown = e => { e.preventDefault(); autoRotate = false; lastX = e.clientX; lastY = e.clientY; mode = e.button === 2 ? 'pan' : 'orbit' }
    const onMouseMove = e => {
      if (mode === 'none') return
      const dx = e.clientX - lastX, dy = e.clientY - lastY
      lastX = e.clientX; lastY = e.clientY
      if (mode === 'orbit') { theta -= dx * 0.007; phi = Math.max(0.05, Math.min(Math.PI / 2.02, phi + dy * 0.007)) }
      if (mode === 'pan')   { const s = radius * 0.0012; target.addScaledVector(getRight(), -dx * s); target.addScaledVector(getUp(), dy * s) }
    }
    const onMouseUp  = () => { mode = 'none' }
    const onWheel    = e  => { radius = Math.max(1, Math.min(2000, radius + e.deltaY * 0.08)) }
    const onContext  = e  => e.preventDefault()

    let lastPinch = null
    const onTDown = e => { autoRotate = false; if (e.touches.length===1){mode='orbit';lastX=e.touches[0].clientX;lastY=e.touches[0].clientY} if(e.touches.length===2){mode='none';lastPinch=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY)} }
    const onTMove = e => { if(e.touches.length===1&&mode==='orbit'){theta-=(e.touches[0].clientX-lastX)*0.007;phi=Math.max(0.05,Math.min(Math.PI/2.02,phi+(e.touches[0].clientY-lastY)*0.007));lastX=e.touches[0].clientX;lastY=e.touches[0].clientY} if(e.touches.length===2){const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);if(lastPinch)radius=Math.max(1,radius*(lastPinch/d));lastPinch=d} }
    const onTEnd   = () => { mode = 'none'; lastPinch = null }
    const onResize = () => { camera.aspect = mount.clientWidth/mount.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(mount.clientWidth, mount.clientHeight) }

    renderer.domElement.addEventListener('mousedown',   onMouseDown)
    window.addEventListener('mousemove',                onMouseMove)
    window.addEventListener('mouseup',                  onMouseUp)
    renderer.domElement.addEventListener('wheel',       onWheel,  { passive: true })
    renderer.domElement.addEventListener('contextmenu', onContext)
    renderer.domElement.addEventListener('touchstart',  onTDown,  { passive: true })
    window.addEventListener('touchmove',                onTMove,  { passive: true })
    window.addEventListener('touchend',                 onTEnd)
    window.addEventListener('resize',                   onResize)

    let frameId
    const animate = () => { frameId = requestAnimationFrame(animate); if (autoRotate) theta += 0.003; updateCamera(); renderer.render(scene, camera) }
    animate()

    return () => {
      cancelAnimationFrame(frameId)
      renderer.domElement.removeEventListener('mousedown',   onMouseDown)
      window.removeEventListener('mousemove',                onMouseMove)
      window.removeEventListener('mouseup',                  onMouseUp)
      renderer.domElement.removeEventListener('wheel',       onWheel)
      renderer.domElement.removeEventListener('contextmenu', onContext)
      renderer.domElement.removeEventListener('touchstart',  onTDown)
      window.removeEventListener('touchmove',                onTMove)
      window.removeEventListener('touchend',                 onTEnd)
      window.removeEventListener('resize',                   onResize)
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [])

  return (
    <div ref={mountRef} style={{ position: 'absolute', inset: 0 }}>
      <div style={{
        position: 'absolute', bottom: '6rem', left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: "'BBTorsosPro', sans-serif",
        fontSize: '0.6rem', letterSpacing: '0.18em',
        color: '#8A8A8A', textTransform: 'uppercase',
        pointerEvents: 'none', userSelect: 'none', zIndex: 10,
        whiteSpace: 'nowrap',
      }}>
        left drag · orbit &nbsp;|&nbsp; right drag · pan &nbsp;|&nbsp; scroll · zoom
      </div>
    </div>
  )
}
