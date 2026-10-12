import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export const DOME_RADIUS = 5;
export type AudioPosition = { x: number; y: number; z: number };
// Centers of the three Blender assemblies after Blender Z-up → glTF Y-up conversion.
export const INITIAL_AUDIO_POSITIONS: AudioPosition[] = [
  { x: 1.2995088, y: .5350487, z: 3.5342336 },
  { x: 2.7837203, y: 2.8444907, z: -1.1084234 },
  { x: 1.4800000, y: 1.6555749, z: -.69999999 },
];
export const AUDIO_SOURCE_MIN_HEIGHTS = [.535, .589, .583];
const MODEL_URL = '/models/holo-audio/communication-dome-v4.glb';

function disposeObjects(root: THREE.Object3D) {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  root.traverse(object => {
    if (!(object instanceof THREE.Mesh || object instanceof THREE.Line)) return;
    geometries.add(object.geometry);
    (Array.isArray(object.material) ? object.material : [object.material]).forEach(m => materials.add(m));
  });
  geometries.forEach(g => g.dispose());
  materials.forEach(m => m.dispose());
}

/** Loads the actual V4 Blender meshes; source wrappers keep the existing gesture/audio API. */
export function createAudioScene(container: HTMLElement) {
  const scene = new THREE.Scene();
  // Match the orthographic composition in communication_dome_v4.blend (800 × 702).
  const camera = new THREE.OrthographicCamera(-5.225, 5.225, 4.585, -4.585, .1, 100);
  camera.position.set(0, 11.73, 17.320509);
  camera.lookAt(0, 1.73, 0);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0xffffff, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  container.appendChild(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xb8b2d0, 1.6));
  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(-5, 10, 4);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xffffff, .6);
  fill.position.set(0, 6, 8); scene.add(fill);
  const rim = new THREE.DirectionalLight(0xb9b0ff, .5);
  rim.position.set(5, 7, -3); scene.add(rim);

  const sources = INITIAL_AUDIO_POSITIONS.map((p, i) => {
    const source = new THREE.Group();
    source.name = ['Music source', 'Phone source', 'Podcast source'][i];
    source.position.set(p.x, p.y, p.z);
    scene.add(source);
    return source;
  });
  let disposed = false;

  const ready = new GLTFLoader().loadAsync(MODEL_URL).then(gltf => {
    if (disposed) { disposeObjects(gltf.scene); return; }
    const model = gltf.scene;
    model.updateMatrixWorld(true);
    const assemblies = ['10_Music_note_', '06_Telephone_handset_', '07_Wireless_microphone_'].map(prefix =>
      model.children.find(child => child.name.startsWith(prefix))
    );
    if (assemblies.some(assembly => !assembly)) {
      disposeObjects(model);
      throw new Error('The Blender export is missing an audio assembly.');
    }
    // Center each source's pivot while preserving its authored rotation and scale.
    assemblies.forEach((assembly, i) => {
      const center = new THREE.Box3().setFromObject(assembly!).getCenter(new THREE.Vector3());
      assembly!.position.sub(center);
      sources[i].add(assembly!);
    });
    const retiredMaterials = new Set<THREE.Material>();
    const configure = (object: THREE.Object3D) => {
      if (!(object instanceof THREE.Mesh)) return;
      object.castShadow = false;
      object.receiveShadow = false;
      if (object.name.startsWith('Dome_')) {
        object.castShadow = false;
        object.receiveShadow = false;
        if (object.name.includes('continuous_full_upper_hemisphere')) {
          (Array.isArray(object.material) ? object.material : [object.material]).forEach(m => retiredMaterials.add(m));
          // The Blender transparent/emission node graph is not a glTF PBR material.
          // Restore it on the exported dome geometry, keeping the open foreground clear.
          object.material = new THREE.ShaderMaterial({
            transparent: true, depthWrite: false, side: THREE.BackSide,
            vertexShader: `varying vec3 worldPosition;
              void main() { vec4 p = modelMatrix * vec4(position, 1.); worldPosition = p.xyz;
                gl_Position = projectionMatrix * viewMatrix * p; }`,
            fragmentShader: `varying vec3 worldPosition;
              void main() {
                float t = clamp((worldPosition.x + 4.8) / 9.6, 0., 1.);
                vec3 color = mix(vec3(.94, .93, .995), vec3(.30, .20, .75), t);
                gl_FragColor = vec4(color, mix(.14, .46, t));
                #include <colorspace_fragment>
              }`,
          });
          object.renderOrder = -1;
        } else {
          (Array.isArray(object.material) ? object.material : [object.material]).forEach(m => retiredMaterials.add(m));
          object.material = new THREE.MeshBasicMaterial({
            color: 0xc8c2df, transparent: true, opacity: .65, depthWrite: false,
            polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1,
            toneMapped: false,
          });
          object.renderOrder = 1;
        }
      }
      if (object.name.startsWith('Stage_')) {
        (Array.isArray(object.material) ? object.material : [object.material]).forEach(m => retiredMaterials.add(m));
        object.castShadow = false;
        const floor = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
        // Preserve the source world-X ramp without the studio lighting flattening it.
        floor.onBeforeCompile = shader => {
          shader.vertexShader = 'varying float stageX;\n' + shader.vertexShader.replace('#include <begin_vertex>',
            '#include <begin_vertex>\nstageX = (modelMatrix * vec4(position, 1.)).x;');
          shader.fragmentShader = 'varying float stageX;\n' + shader.fragmentShader.replace('#include <color_fragment>', `
            #include <color_fragment>
            float t = clamp((stageX + 4.8) / 9.6, 0., 1.);
            vec3 a = vec3(.97, .965, .99), b = vec3(.90, .875, .97), c = vec3(.52, .44, .80);
            diffuseColor.rgb *= t < .58 ? mix(a, b, clamp((t - .12) / .46, 0., 1.)) : mix(b, c, (t - .58) / .42);
          `);
        };
        object.material = floor;
      }
    };
    model.traverse(configure);
    sources.forEach(source => source.traverse(configure));
    retiredMaterials.forEach(m => m.dispose());
    scene.add(model);
    addContactShadows();
    container.dataset.model = 'communication-dome-v4';
  });

  // Blender uses large softboxes. Reproduce soft contact shading without sharp
  // directional shadows from the floating sources across the whole stage.
  const shadowMaps: THREE.Texture[] = [];
  function addContactShadows() {
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 128;
    const context = canvas.getContext('2d')!;
    const gradient = context.createRadialGradient(64, 64, 4, 64, 64, 62);
    gradient.addColorStop(0, 'rgba(62,49,92,.24)');
    gradient.addColorStop(.35, 'rgba(62,49,92,.12)');
    gradient.addColorStop(1, 'rgba(62,49,92,0)');
    context.fillStyle = gradient; context.fillRect(0, 0, 128, 128);
    const texture = new THREE.CanvasTexture(canvas); shadowMaps.push(texture);
    function shadow(x: number, z: number, width: number, depth: number) {
      const plane = new THREE.Mesh(new THREE.PlaneGeometry(width, depth),
        new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, toneMapped: false }));
      plane.rotation.x = -Math.PI / 2; plane.position.set(x, .03, z); scene.add(plane);
      return plane;
    }
    shadow(0, -.18, 2.1, 1.6);
    shadow(-2.88, .65, 1.8, 1.05);
    shadow(3.26, .88, 1.45, 1.15);
    shadow(-1.03, 3.36, 1.15, 1.1);
    const musicShadow = shadow(sources[0].position.x, sources[0].position.z, 1.3, 1.1);
    scene.onBeforeRender = () => {
      musicShadow.position.set(sources[0].position.x, .03, sources[0].position.z);
      musicShadow.material.opacity = Math.exp(-Math.max(0, sources[0].position.y - .53) * 1.5);
    };
  }

  function resize() {
    const width = container.clientWidth, height = container.clientHeight;
    if (!width || !height) return;
    const halfHeight = 5.225 * height / width;
    camera.top = halfHeight; camera.bottom = -halfHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  resize();
  const observer = new ResizeObserver(resize);
  observer.observe(container);
  return {
    scene, camera, renderer, sources, ready,
    dispose() {
      disposed = true;
      observer.disconnect();
      disposeObjects(scene);
      shadowMaps.forEach(texture => texture.dispose());
      renderer.dispose();
      renderer.domElement.remove();
      delete container.dataset.model;
    },
  };
}
