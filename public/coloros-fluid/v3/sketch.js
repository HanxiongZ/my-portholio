/* p5.js + a WebGL fragment shader. Elapsed time controls the liquid warp. */
let fluidShader, elapsed = 0, playing = !matchMedia('(prefers-reduced-motion: reduce)').matches;
let speed = 1;
function preload() {
  fluidShader = loadShader('fluid.vert', 'fluid.frag');
}
function setup() {
  pixelDensity(Math.min(window.devicePixelRatio, 1.5));
  const canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.parent('motion');
  noStroke();
  frameRate(30);
  syncButton();
}
function draw() {
  if (playing && !document.hidden) elapsed += Math.min(deltaTime, 100) / 1000 * speed;
  shader(fluidShader);
  fluidShader.setUniform('uResolution', [width * pixelDensity(), height * pixelDensity()]);
  fluidShader.setUniform('uTime', elapsed);
  rect(-width/2, -height/2, width, height);
}
function windowResized(){resizeCanvas(windowWidth,windowHeight);}
function syncButton(){document.querySelector('#pause').textContent=playing?'暂停流动':'开始流动';}
document.querySelector('#pause').onclick=()=>{playing=!playing;syncButton();};
document.querySelector('#speed').oninput=e=>speed=Number(e.target.value);
document.querySelector('#save').onclick=()=>{
 if(document.body.classList.contains('static')){
  const link=document.createElement('a');link.href='fluid-python.png';link.download='fluid-python.png';link.click();
 }else saveCanvas('coloros-fluid-v3','png');
};
document.querySelector('#version').onchange=e=>{
 document.body.classList.toggle('static',e.target.value==='python');
 if(e.target.value==='python')noLoop();else loop();
};
document.addEventListener('keydown',e=>{if(e.key.toLowerCase()==='h')document.querySelector('nav').classList.toggle('hidden');});
