import { useEffect, useRef } from 'react'

const VERT = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`

const FRAG = `
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = rot * p * 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv * vec2(u_resolution.x / u_resolution.y, 1.0);
  float t = u_time * 0.055;

  float n1 = fbm(p * 1.7 + vec2(t, -t * 0.6));
  float n2 = fbm(p * 2.6 - vec2(t * 0.7, t * 0.45) + n1);

  vec3 cyan = vec3(0.13, 0.83, 0.93);
  vec3 violet = vec3(0.51, 0.55, 0.97);
  vec3 pink = vec3(0.91, 0.47, 0.98);
  vec3 base = vec3(0.016, 0.004, 0.06);

  vec3 col = base;
  col += cyan * pow(smoothstep(0.35, 0.9, n1), 3.0) * 0.30;
  col += violet * pow(n2, 2.6) * 0.26;
  col += pink * pow(smoothstep(0.55, 0.98, n1 * n2 * 2.3), 3.0) * 0.20;

  float md = distance(uv, u_mouse);
  col += violet * 0.10 * exp(-md * 3.5);
  col *= mix(1.0, 0.42, smoothstep(0.45, 0.0, uv.y));

  gl_FragColor = vec4(col, 1.0);
}
`

function compile(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  return shader
}

export default function AuroraBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false })
    if (!gl) return undefined

    const program = gl.createProgram()
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT))
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return undefined
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(program, 'a_pos')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const uTime = gl.getUniformLocation(program, 'u_time')
    const uRes = gl.getUniformLocation(program, 'u_resolution')
    const uMouse = gl.getUniformLocation(program, 'u_mouse')

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const staticOnly =
      reduced || window.matchMedia('(max-width: 767px)').matches || navigator.hardwareConcurrency <= 4
    const SCALE = 0.55

    const target = { x: 0.5, y: 0.6 }
    const current = { x: 0.5, y: 0.6 }
    let raf = 0
    let running = false

    const resize = () => {
      canvas.width = Math.max(1, Math.floor(window.innerWidth * SCALE))
      canvas.height = Math.max(1, Math.floor(window.innerHeight * SCALE))
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    const draw = (ms) => {
      current.x += (target.x - current.x) * 0.05
      current.y += (target.y - current.y) * 0.05
      gl.uniform1f(uTime, ms * 0.001)
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform2f(uMouse, current.x, current.y)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    const loop = (ms) => {
      draw(ms)
      if (running) raf = requestAnimationFrame(loop)
    }

    const startLoop = () => {
      if (staticOnly || running) return
      running = true
      raf = requestAnimationFrame(loop)
    }

    const stopLoop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    const onMove = (e) => {
      target.x = e.clientX / window.innerWidth
      target.y = 1 - e.clientY / window.innerHeight
    }

    const onVisibility = () => {
      if (document.hidden) stopLoop()
      else startLoop()
    }

    const onResize = () => {
      resize()
      if (staticOnly) draw(14000)
    }

    resize()
    if (staticOnly) {
      draw(14000)
    } else {
      startLoop()
    }

    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMove)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      stopLoop()
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-75"
    />
  )
}
