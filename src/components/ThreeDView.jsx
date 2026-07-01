import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export default function ThreeDView() {
  const mountRef = useRef(null)
  const apiRef = useRef({})
  const [mode, setMode] = useState('isometric')
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)

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
    scene.add(new THREE.AmbientLight(0xffffff, 1.6))
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
    const target = new THREE.Vector3()

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
      radius = Math.max(vFit, hFit) * 1.15
      updateCamera()
    }

    apiRef.current = {
      setMode: m => { activeCamera = m === 'perspective' ? perspCam : orthoCam },
      zoomExtents,
    }

    new GLTFLoader().load(`${import.meta.env.BASE_URL}images/model.glb`, ({ scene: model }) => {
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

      // Open on zoom-extents, isometric
      zoomExtents()
      setLoading(false)
    }, xhr => {
      if (xhr.total) setProgress(Math.round((xhr.loaded / xhr.total) * 100))
    }, err => { console.error(err); setLoading(false) })

    let dragMode = 'none', autoRotate = true, lastX = 0, lastY = 0

    const getRight = () => new THREE.Vector3().subVectors(activeCamera.position, target).normalize().cross(new THREE.Vector3(0,1,0)).normalize()
    const getUp    = () => { const r = getRight(); return new THREE.Vector3().subVectors(activeCamera.position, target).normalize().negate().cross(r).normalize() }

    // Right click → orbit, left click → pan
    const onMouseDown = e => { e.preventDefault(); autoRotate = false; lastX = e.clientX; lastY = e.clientY; dragMode = e.button === 2 ? 'orbit' : 'pan' }
    const onMouseMove = e => {
      if (dragMode === 'none') return
      const dx = e.clientX - lastX, dy = e.clientY - lastY
      lastX = e.clientX; lastY = e.clientY
      if (dragMode === 'orbit') { theta -= dx * 0.007; phi = Math.max(0.05, Math.min(Math.PI / 2.02, phi + dy * 0.007)) }
      if (dragMode === 'pan')   { const s = radius * 0.0012; target.addScaledVector(getRight(), -dx * s); target.addScaledVector(getUp(), dy * s) }
    }
    const onMouseUp  = () => { dragMode = 'none' }
    const onWheel    = e  => { radius = Math.max(1, Math.min(2000, radius + e.deltaY * 0.08)) }
    const onContext  = e  => e.preventDefault()

    let lastPinch = null
    const onTDown = e => { autoRotate = false; if (e.touches.length===1){dragMode='orbit';lastX=e.touches[0].clientX;lastY=e.touches[0].clientY} if(e.touches.length===2){dragMode='none';lastPinch=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY)} }
    const onTMove = e => { if(e.touches.length===1&&dragMode==='orbit'){theta-=(e.touches[0].clientX-lastX)*0.007;phi=Math.max(0.05,Math.min(Math.PI/2.02,phi+(e.touches[0].clientY-lastY)*0.007));lastX=e.touches[0].clientX;lastY=e.touches[0].clientY} if(e.touches.length===2){const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);if(lastPinch)radius=Math.max(1,radius*(lastPinch/d));lastPinch=d} }
    const onTEnd   = () => { dragMode = 'none'; lastPinch = null }
    const onResize = () => {
      perspCam.aspect = mount.clientWidth / mount.clientHeight
      perspCam.updateProjectionMatrix()
      updateOrthoFrustum()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }

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
    const animate = () => { frameId = requestAnimationFrame(animate); if (autoRotate) theta += 0.003; updateCamera(); renderer.render(scene, activeCamera) }
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

      <div style={{
        position: 'absolute', top: '1.5rem', right: '1.5rem',
        display: 'flex', gap: '0.5rem', zIndex: 10,
      }}>
        <button
          style={btnStyle(mode === 'isometric')}
          onClick={() => { apiRef.current.setMode?.('isometric'); setMode('isometric') }}
        >Isometric</button>
        <button
          style={btnStyle(mode === 'perspective')}
          onClick={() => { apiRef.current.setMode?.('perspective'); setMode('perspective') }}
        >Perspective</button>
        <button
          style={btnStyle(false)}
          onClick={() => apiRef.current.zoomExtents?.()}
        >Zoom Extents</button>
      </div>

      <div style={{
        position: 'absolute', bottom: '6rem', left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: "'BBTorsosPro', sans-serif",
        fontSize: '0.6rem', letterSpacing: '0.18em',
        color: '#8A8A8A', textTransform: 'uppercase',
        pointerEvents: 'none', userSelect: 'none', zIndex: 10,
        whiteSpace: 'nowrap',
      }}>
        right drag · orbit &nbsp;|&nbsp; left drag · pan &nbsp;|&nbsp; scroll · zoom
      </div>
    </div>
  )
}
