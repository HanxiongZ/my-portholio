import React, { useEffect, useRef } from 'react';

/** The saved p5.js artwork rendered directly into the hero, without preview controls. */
export function OppoFluidBackdrop({ shaderPath = '/coloros-fluid/saved/fluid.frag', cropStart = 0, cropWidth = 1 }: { shaderPath?: string; cropStart?: number; cropWidth?: number } = {}) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false });
    if (!gl) return;
    const abort = new AbortController();
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0, visible = true, elapsed = 0, previous = 0, lastDraw = 0;
    let program: WebGLProgram | null = null;
    let buffer: WebGLBuffer | null = null;
    const shaders: WebGLShader[] = [];
    let disposed = false;
    const compile = (kind: number, source: string) => {
      const shader = gl.createShader(kind);
      if (!shader) throw new Error('Unable to create background shader');
      shaders.push(shader);
      gl.shaderSource(shader, source); gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error('Unable to compile background shader');
      return shader;
    };
    const pause = () => { cancelAnimationFrame(frame); frame = 0; previous = 0; };
    let draw: (now: number) => void = () => {};
    const resume = () => { if (!disposed && program && !frame) frame = requestAnimationFrame(draw); };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !document.hidden) resume(); else pause();
    });
    observer.observe(canvas);
    const visibility = () => { if (document.hidden) pause(); else if (visible) resume(); };
    const preference = () => { pause(); resume(); };
    document.addEventListener('visibilitychange', visibility);
    reduced.addEventListener('change', preference);
    const resize = new ResizeObserver(() => { pause(); resume(); });
    resize.observe(canvas);
    fetch(shaderPath, { signal: abort.signal })
      .then(response => { if (!response.ok) throw new Error('Missing background shader'); return response.text(); })
      .then(fragment => {
        if (disposed) return;
        program = gl.createProgram();
        if (!program) throw new Error('Unable to create background program');
        gl.attachShader(program, compile(gl.VERTEX_SHADER, 'attribute vec2 position;void main(){gl_Position=vec4(position,0.,1.);}'));
        gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment.replace('void main(){', 'uniform vec2 uCrop;\nvoid main(){').replace('p.y=1.-p.y;', 'p.y=1.-p.y;p.x=uCrop.x+p.x*uCrop.y;')));
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Unable to link background program');
        gl.useProgram(program);
        buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
        const position = gl.getAttribLocation(program, 'position');
        gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
        const resolution = gl.getUniformLocation(program, 'uResolution');
        const time = gl.getUniformLocation(program, 'uTime');
        gl.uniform2f(gl.getUniformLocation(program, 'uCrop'), cropStart, cropWidth);
        draw = now => {
          frame = 0;
          if (disposed || !visible || document.hidden) { previous = 0; return; }
          if (previous && !reduced.matches) elapsed += Math.min(now - previous, 100) / 1000 * 3.375;
          previous = now;
          if (now - lastDraw >= 1000 / 30 || reduced.matches || !canvas.classList.contains('oa-fluid-ready')) {
            const density = Math.min(devicePixelRatio || 1, 1.5);
            const width = Math.round(canvas.clientWidth * density), height = Math.round(canvas.clientHeight * density);
            if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
            gl.viewport(0,0,width,height);
            gl.uniform2f(resolution, width, height); gl.uniform1f(time, elapsed);
            gl.drawArrays(gl.TRIANGLES,0,6); lastDraw = now;
            canvas.classList.add('oa-fluid-ready');
          }
          if (!reduced.matches) frame = requestAnimationFrame(draw);
        };
        resume();
      }).catch(() => { /* The locally saved still remains visible if WebGL cannot render. */ });
    return () => {
      disposed = true; abort.abort(); pause(); observer.disconnect(); resize.disconnect();
      document.removeEventListener('visibilitychange', visibility); reduced.removeEventListener('change', preference);
      shaders.forEach(shader => gl.deleteShader(shader));
      if (buffer) gl.deleteBuffer(buffer); if (program) gl.deleteProgram(program);
    };
  }, [shaderPath, cropStart, cropWidth]);
  return <canvas ref={ref} className="oa-fluid-canvas" aria-hidden="true" />;
}
