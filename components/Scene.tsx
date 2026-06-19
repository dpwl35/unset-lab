'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import gsap from 'gsap';
import GridOverlay from './GridOverlay';

const manager = new THREE.LoadingManager();
manager.onLoad = () => {
  window.dispatchEvent(new Event('scene-ready'));
};

const fresnelMaterial = new THREE.ShaderMaterial({
  uniforms: {
    color: { value: new THREE.Color(0xeeeeee) },
    bodyColor: { value: new THREE.Color(0xffffff) },
    innerAlpha: { value: 0.15 },
    fresnelBias: { value: 0 },
    fresnelScale: { value: 2.07 },
    fresnelPower: { value: 4.96 },
  },
  vertexShader: `
    varying vec3 vWorldNormal;
    varying vec3 vWorldPosition;
    void main() {
      vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `,
  fragmentShader: `
    uniform vec3 color;
    uniform vec3 bodyColor;
    uniform float innerAlpha;
    uniform float fresnelBias;
    uniform float fresnelScale;
    uniform float fresnelPower;
    varying vec3 vWorldNormal;
    varying vec3 vWorldPosition;
    void main() {
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      vec3 normal = normalize(vWorldNormal);
      float dotProduct = abs(dot(viewDir, normal));
      float fresnel = pow(1.0 - dotProduct, fresnelPower) * fresnelScale;
      vec3 finalColor = mix(bodyColor, color, fresnel);
      float finalAlpha = max(innerAlpha, fresnel);
      gl_FragColor = vec4(finalColor, finalAlpha);
    }
  `,
  transparent: true,
  blending: THREE.NormalBlending,
  depthWrite: false,
  side: THREE.DoubleSide,
});

const mirrorMaterial = new THREE.MeshStandardMaterial({
  color: 0xe7e7e7,
  metalness: 1.0,
  roughness: 0.0,
  envMapIntensity: 3.0,
});
const darkMaterial = new THREE.MeshStandardMaterial({
  color: 0x111111,
  metalness: 0,
  roughness: 0.4,
  envMapIntensity: 0.5,
});
const sphereClusterMaterial = new THREE.MeshStandardMaterial({
  color: 0xe1e1e1,
  metalness: 0,
  roughness: 0,
  envMapIntensity: 1.0,
});

const mirrorObjects = [
  'cylinder_stand_01',
  'cylinder_stand_02',
  'torus_glass_01',
  'torus_glass_02',
  'torus_02',
  'sphere_03',
];
const darkObjects = ['sphere_stripe', 'cube_black'];

export default function Scene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const meshesRef = useRef<THREE.Mesh[]>([]);
  const [isFresnel, setIsFresnel] = useState(false);
  const [selectedMesh, setSelectedMesh] = useState<THREE.Mesh | null>(null);

  useEffect(() => {
    meshesRef.current.forEach((mesh) => {
      if (isFresnel) {
        mesh.material = fresnelMaterial;
      } else {
        if (mirrorObjects.includes(mesh.name)) mesh.material = mirrorMaterial;
        else if (darkObjects.includes(mesh.name)) mesh.material = darkMaterial;
        else if (mesh.name === 'sphere_cluster')
          mesh.material = sphereClusterMaterial;
        else mesh.material = mirrorMaterial;
      }
    });
  }, [isFresnel]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    const parent = canvas.parentElement!;
    renderer.setSize(parent.offsetWidth, parent.offsetHeight);
    // renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const scene = new THREE.Scene();

    const rgbeLoader = new RGBELoader(manager); // manager 전달
    rgbeLoader.load('/studio_small_08_4k.hdr', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
    });

    const camera = new THREE.PerspectiveCamera(
      45,
      parent.offsetWidth / parent.offsetHeight,
      0.1,
      100,
    );
    camera.position.set(0, 0, 5);

    scene.add(new THREE.AmbientLight(0xffffff, 0));

    const initialYMap = new Map<THREE.Object3D, number>();

    const loader = new GLTFLoader(manager);
    loader.load('/unsetlab-object.glb', (gltf) => {
      gltf.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          meshesRef.current.push(child);
          initialYMap.set(child, child.position.y);

          // 초기 머테리얼 설정
          if (mirrorObjects.includes(child.name))
            child.material = mirrorMaterial;
          else if (darkObjects.includes(child.name))
            child.material = darkMaterial;
          else if (child.name === 'sphere_cluster')
            child.material = sphereClusterMaterial;
          else child.material = mirrorMaterial;
        }
      });

      gltf.scene.position.set(0, -2, 0.4);
      gltf.scene.rotation.set(0.1885, -1.8221, -0.0628);
      gltf.scene.scale.set(1, 1, 1);
      scene.add(gltf.scene);

      gsap.to(gltf.scene.position, {
        y: 0.2,
        duration: 1.2,
        ease: 'power2.out',
      });
    });

    const handleResize = () => {
      const w = parent.offsetWidth;
      const h = parent.offsetHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    const animate = () => {
      requestAnimationFrame(animate);
      const t = Date.now() * 0.001;
      meshesRef.current.forEach((mesh, i) => {
        const initialY = initialYMap.get(mesh) || 0;
        mesh.position.y = initialY + Math.sin(t + i) * 0.05;
        mesh.rotation.y += 0.003;
      });
      renderer.render(scene, camera);
    };
    animate();

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(meshesRef.current);

      if (intersects.length > 0) {
        setSelectedMesh(intersects[0].object as THREE.Mesh);
      }
    };

    canvas.addEventListener('click', onClick);

    // cleanup에 추가
    return () => {
      canvas.removeEventListener('click', onClick);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div className='main-intro-wrap'>
      <div className='main-intro-item'>
        <button
          className='main-intro-button'
          onClick={() => setIsFresnel((prev) => !prev)}
        >
          <span>
            {isFresnel
              ? 'click me!: Normal canvas '
              : 'click me! : X-Ray canvas'}
          </span>
        </button>
        <p>"Click an object to inspect"</p>
        <p>object name : {selectedMesh?.name ?? '-'}</p>
        <p>
          x: {selectedMesh?.position.x.toFixed(2) ?? '-'} y:{' '}
          {selectedMesh?.position.y.toFixed(2) ?? '-'} z:{' '}
          {selectedMesh?.position.z.toFixed(2) ?? '-'}
        </p>
        <p>{(selectedMesh?.material as THREE.Material)?.type ?? '-'}</p>
        <p>{selectedMesh?.geometry.attributes.position.count ?? '-'}</p>
      </div>
      <canvas
        className='main-intro-canvas'
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'auto',
        }}
      />
      <GridOverlay />
    </div>
  );
}
