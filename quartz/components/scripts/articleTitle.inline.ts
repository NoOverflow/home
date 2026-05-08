document.addEventListener("nav", () => {
  const canvas = document.querySelector<HTMLCanvasElement>(".article-title-canvas")
  if (!canvas) return

  const gl = canvas.getContext("webgl2")
  if (!gl) {
    canvas.style.display = "none"
    return
  }

  // ── Shaders ──────────────────────────────────────────────────────────────

  const VS = `#version 300 es
    in vec2 a_pos;
    out vec2 fragCoord;
    void main() {
      fragCoord = a_pos;
      gl_Position = vec4(a_pos, 0.0, 1.0);
    }`

  const FS = `#version 300 es

    precision mediump float;

    uniform vec2 iResolution;           // viewport resolution (in pixels)
    uniform float iTime;                 // shader playback time (in seconds)
    uniform float iLightMode;

    out vec4 fragColor;
    in vec2 fragCoord;

    float colormap_red(float x) {
        if (x < 0.0) {
            return 0.0 + iLightMode;
        } else if (x < 20049.0 / 82979.0) {
            return (829.79 * x + 54.51) / 255.0;
        } else {
            return 1.0 - iLightMode;
        }
    }

    float colormap_green(float x) {
        if (x < 0.0) {
            return 0.0 + iLightMode;
        } else if (x < 327013.0 / 810990.0) {
            return (8546482679670.0 / 10875673217.0 * x - 2064961390770.0 / 10875673217.0) / 255.0;
        } else if (x <= 1.0) {
            return (103806720.0 / 483977.0 * x + 19607415.0 / 483977.0) / 255.0;
        } else {
            return 1.0 - iLightMode;
        }
    }

    float colormap_blue(float x) {
        if (x < 0.0) {
            return 0.0 + iLightMode;
        } else if (x < 0.08) {
            return (829.79 * x + 54.51) / 255.0;
        } else if (x < 0.24) {
            return 127.0 / 255.0;
        } else if (x < 0.4) {
            return (792.0 * x - 64.0) / 255.0;
        } else {
            return 1.0 - iLightMode;
        }
    }

    vec4 colormap(float x) {
        // x = iLightMode == 1.0 ? x : 1.0 - x; // Invert colors in dark mode
        vec4 mappedColor = vec4(colormap_red(x), colormap_green(x), colormap_blue(x), 1.0);

        return mappedColor;
    }


    float rand(vec2 n) {
        return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
    }

    float noise(vec2 p) {
        vec2 ip = floor(p);
        vec2 u = fract(p);

        u = u * u *(3.0 - 2.0 * u);

        float res = mix(
            mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
            mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
        return res * res;
    }

    const mat2 mtx = mat2( 1.00,  1.80, -1.80,  1.00 );

    float fbm(vec2 p)
    {
        float f = 0.0;

        f += 0.500000 * noise(p); p = mtx * p * 2.02;
        f += 0.031250 * noise(p); p = mtx * p * 2.01;
        f += 0.250000 * noise(p); p = mtx * p * 2.03;
        f += 0.125000 * noise(p); p = mtx * p * 2.01;
        f += 0.062500 * noise(p); p = mtx * p * 2.04;
        f += 0.015625 * noise(p + sin(iTime * 0.1) );

        return f / 1.6;
    }

    float pattern(in vec2 p)
    {
        return fbm(p + fbm(p + fbm(p + fbm(p))));
    }

    void main()
    {
        vec2 uv = fragCoord / iResolution.x;
        float shade = pattern(uv);

        fragColor = vec4(colormap(shade).rgb, 1.0);
    }`

  // ── GL bootstrap ─────────────────────────────────────────────────────────

  function compile(type: number, src: string): WebGLShader | null {
    const s = gl.createShader(type)!
    gl.shaderSource(s, src)
    gl.compileShader(s)
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error("[ArticleTitle]", gl.getShaderInfoLog(s))
      gl.deleteShader(s)
      return null
    }
    return s
  }

  const vs = compile(gl.VERTEX_SHADER, VS)
  const fs = compile(gl.FRAGMENT_SHADER, FS)
  if (!vs || !fs) return

  const prog = gl.createProgram()!
  gl.attachShader(prog, vs)
  gl.attachShader(prog, fs)
  gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error("[ArticleTitle]", gl.getProgramInfoLog(prog))
    return
  }
  gl.useProgram(prog)

  const vao = gl.createVertexArray()
  gl.bindVertexArray(vao)

  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array([-1,-1, 1,-1, -1,1, 1,-1, 1,1, -1,1]), gl.STATIC_DRAW)

  const aPos = gl.getAttribLocation(prog, "a_pos")
  gl.enableVertexAttribArray(aPos)
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

  const iTime = gl.getUniformLocation(prog, "iTime")
  const iResolution = gl.getUniformLocation(prog, "iResolution")
  const iLightMode = gl.getUniformLocation(prog, "iLightMode")

  function resize() {
    const rect = canvas.getBoundingClientRect()
    const dpr  = Math.min(window.devicePixelRatio, 2)

    canvas.width  = rect.width  * dpr
    canvas.height = rect.height * dpr
    gl.viewport(0, 0, canvas.width, canvas.height)
  }
  resize()
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)

  // ── Theme ─────────────────────────────────────────────────────────────────

  function isDark(): number {
    return document.documentElement.getAttribute("saved-theme") === "dark" ? 1.0 : 0.0
  }
  let darkMode = isDark()

  function onThemeChange() { darkMode = isDark() }
  document.addEventListener("themechange", onThemeChange)

  const t0  = performance.now()
  let raf   = 0
  let alive = true

  function render() {
    if (!alive) return

    const t = (performance.now() - t0) / 1000

    gl.uniform1f(iTime, t)
    gl.uniform2f(iResolution, canvas.width, canvas.height)
    gl.uniform1f(iLightMode, darkMode === 1.0 ? 0.0 : 1.0)
    gl.drawArrays(gl.TRIANGLES, 0, 6)

    raf = requestAnimationFrame(render)
  }
  render()

  // ── Cleanup ───────────────────────────────────────────────────────────────

  window.addCleanup(() => {
    alive = false
    cancelAnimationFrame(raf)
    ro.disconnect()
    document.removeEventListener("themechange", onThemeChange)
    gl.deleteVertexArray(vao)
    gl.deleteBuffer(buf)
    gl.deleteProgram(prog)
    gl.deleteShader(vs)
    gl.deleteShader(fs)
  })
})
