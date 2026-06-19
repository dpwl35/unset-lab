'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const DitherShader = {
  uniforms: {
    tDiffuse: { value: null },
    resolution: { value: new THREE.Vector2() },
    gridSize: { value: 4.0 },
    pixelSizeRatio: { value: 1.0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 resolution;
    uniform float gridSize;
    uniform float pixelSizeRatio;
    varying vec2 vUv;

    float bayer4x4(vec2 pos) {
      int x = int(mod(pos.x, 4.0));
      int y = int(mod(pos.y, 4.0));
      int index = y * 4 + x;
      float matrix[16];
      matrix[0]  =  0.0; matrix[1]  =  8.0; matrix[2]  =  2.0; matrix[3]  = 10.0;
      matrix[4]  = 12.0; matrix[5]  =  4.0; matrix[6]  = 14.0; matrix[7]  =  6.0;
      matrix[8]  =  3.0; matrix[9]  = 11.0; matrix[10] =  1.0; matrix[11] =  9.0;
      matrix[12] = 15.0; matrix[13] =  7.0; matrix[14] = 13.0; matrix[15] =  5.0;
      return matrix[index] / 16.0;
    }

    void main() {
      float pixelSize = gridSize * pixelSizeRatio;
      vec2 fragCoord = vUv * resolution;
      vec2 pixelatedUV = floor(fragCoord / pixelSize) * pixelSize / resolution;

      vec4 texColor = texture2D(tDiffuse, pixelatedUV);
      float brightness = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));

      if (brightness < 0.05) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
        return;
      }

      float threshold = bayer4x4(floor(fragCoord / pixelSize));
      float dithered = step(threshold, brightness);
      gl_FragColor = vec4(vec3(dithered), 1.0);
    }
  `,
};

export default function CameraScene({
  canvasRef,
}: {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}) {
  const [gridSize, setGridSize] = useState(4);
  const [pixelSize, setPixelSize] = useState(1);
  const ditherPassRef = useRef<ShaderPass | null>(null);

  useEffect(() => {
    if (ditherPassRef.current) {
      ditherPassRef.current.uniforms.gridSize.value = gridSize;
    }
  }, [gridSize]);

  useEffect(() => {
    if (ditherPassRef.current) {
      ditherPassRef.current.uniforms.pixelSizeRatio.value = pixelSize;
    }
  }, [pixelSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement!;
    const w = parent.offsetWidth;
    const h = parent.offsetHeight;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.set(0, 0, 3);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(2, 2, 2);
    scene.add(dirLight);

    let renderTarget = new THREE.WebGLRenderTarget(w, h, {
      format: THREE.RGBAFormat,
      type: THREE.UnsignedByteType,
    });

    const composer = new EffectComposer(renderer, renderTarget);
    composer.addPass(new RenderPass(scene, camera));

    const ditherPass = new ShaderPass(DitherShader);
    ditherPass.uniforms.resolution.value.set(w, h);
    ditherPass.uniforms.gridSize.value = 4;
    ditherPass.uniforms.pixelSizeRatio.value = 1;
    composer.addPass(ditherPass);
    ditherPassRef.current = ditherPass;

    const loader = new GLTFLoader();
    let mesh: THREE.Mesh | null = null;

    loader.load('/unsetlab-object.glb', (gltf) => {
      gltf.scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.name === 'sphere_cluster') {
          mesh = child.clone();
          mesh.material = new THREE.MeshStandardMaterial({ color: 0xffffff });
          const box = new THREE.Box3().setFromObject(mesh);
          const center = box.getCenter(new THREE.Vector3());
          mesh.position.sub(center);

          mesh.position.y -= 2; // 초기 위치 아래로
          scene.add(mesh);

          gsap.to(mesh.position, {
            y: 0,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.main-about-camera',
              start: 'top center',
              toggleActions: 'play none none reverse',
            },
          });
        }
      });
    });

    const controls = new OrbitControls(camera, canvas);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    const handleResize = () => {
      const newW = parent.offsetWidth;
      const newH = parent.offsetHeight;

      renderer.setSize(newW, newH);
      composer.setSize(newW, newH);
      ditherPass.uniforms.resolution.value.set(newW, newH);

      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update();
      if (mesh) mesh.rotation.y += 0.005;
      composer.render();
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className='camera-controls'>
      <label>
        Grid Size: {gridSize}
        <input
          type='range'
          min={1}
          max={20}
          value={gridSize}
          onChange={(e) => setGridSize(Number(e.target.value))}
        />
      </label>
      <span>/</span>
      <label>
        Pixel Size: {pixelSize}
        <input
          type='range'
          min={1}
          max={10}
          value={pixelSize}
          onChange={(e) => setPixelSize(Number(e.target.value))}
        />
      </label>
    </div>
  );
}
