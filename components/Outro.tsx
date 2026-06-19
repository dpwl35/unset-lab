'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Outro() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement!;
    let w = parent.offsetWidth;
    let h = parent.offsetHeight;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();

    const aspect = w / h;
    const viewSize = 10;
    const camera = new THREE.OrthographicCamera(
      (-viewSize * aspect) / 2,
      (viewSize * aspect) / 2,
      viewSize / 2,
      -viewSize / 2,
      0.1,
      1000,
    );
    camera.position.set(0, 0, 20);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 1.5));
    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(2, 5, 5);
    scene.add(dirLight);

    const world = new CANNON.World();
    world.gravity.set(0, -15, 0);

    const groundMaterial = new CANNON.Material('ground');
    const objectMaterial = new CANNON.Material('object');
    const contactMaterial = new CANNON.ContactMaterial(
      groundMaterial,
      objectMaterial,
      { friction: 0.6, restitution: 0.1 },
    );
    world.addContactMaterial(contactMaterial);

    let groundBody: CANNON.Body, leftWall: CANNON.Body, rightWall: CANNON.Body;
    const wallShape = new CANNON.Plane();

    const updatePhysicsBounds = () => {
      const currentAspect = w / h;
      const xBound = (viewSize * currentAspect) / 2;
      const yBound = viewSize / 2;

      if (groundBody) world.removeBody(groundBody);
      if (leftWall) world.removeBody(leftWall);
      if (rightWall) world.removeBody(rightWall);

      groundBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: wallShape,
        material: groundMaterial,
      });
      groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
      groundBody.position.set(0, -yBound, 0);
      world.addBody(groundBody);

      leftWall = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: wallShape,
        material: groundMaterial,
      });
      leftWall.quaternion.setFromEuler(0, Math.PI / 2, 0);
      leftWall.position.set(-xBound, 0, 0);
      world.addBody(leftWall);

      rightWall = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: wallShape,
        material: groundMaterial,
      });
      rightWall.quaternion.setFromEuler(0, -Math.PI / 2, 0);
      rightWall.position.set(xBound, 0, 0);
      world.addBody(rightWall);
    };

    updatePhysicsBounds();

    const frontWall = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: wallShape,
      material: groundMaterial,
    });
    frontWall.quaternion.setFromEuler(0, Math.PI, 0);
    frontWall.position.set(0, 0, 1.5);
    world.addBody(frontWall);

    const backWall = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: wallShape,
      material: groundMaterial,
    });
    backWall.position.set(0, 0, -1.5);
    world.addBody(backWall);

    const meshBodyPairs: { mesh: THREE.Mesh; body: CANNON.Body }[] = [];
    const loader = new GLTFLoader();

    const startFalling = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      meshBodyPairs.forEach(({ body }) => {
        body.type = CANNON.Body.DYNAMIC;
        body.mass = 1;
        body.updateMassProperties();
        body.wakeUp();
        body.angularVelocity.set(
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 5,
        );
      });
    };

    loader.load('/unsetlab-object.glb', (gltf) => {
      let i = 0;
      gltf.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const mesh = child.clone();
          mesh.geometry = child.geometry.clone();
          mesh.material = new THREE.MeshStandardMaterial({
            color: 0xf5f5f5,
            roughness: 0.3,
          });

          mesh.geometry.computeBoundingBox();
          const bbox = mesh.geometry.boundingBox!;
          const size = new THREE.Vector3();
          bbox.getSize(size);

          const worldScale = new THREE.Vector3();
          child.getWorldScale(worldScale);
          size.multiply(worldScale);

          mesh.geometry.center();
          scene.add(mesh);

          const radius = Math.max(size.x, size.y, size.z) / 2 || 0.5;
          const currentAspect = w / h;
          const xRange = (viewSize * currentAspect) / 2 - 1;

          const body = new CANNON.Body({
            mass: 0,
            type: CANNON.Body.STATIC,
            shape: new CANNON.Sphere(radius),
            material: objectMaterial,
            position: new CANNON.Vec3(
              (Math.random() - 0.5) * xRange * 1.5,
              viewSize / 2 + 2 + i * 1.5,
              (Math.random() - 0.5) * 1,
            ),
          });

          world.addBody(body);
          meshBodyPairs.push({ mesh, body });
          i++;
        }
      });

      // 마운트 시점에 이미 화면에 보이는 상태인지 체크
      if (wrapRef.current) {
        const rect = wrapRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
          startFalling();
        }
      }

      ScrollTrigger.create({
        trigger: wrapRef.current,
        start: 'top 80%',
        onEnter: startFalling,
      });
    });

    let animId: number;
    const timeStep = 1 / 60;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      world.step(timeStep);

      meshBodyPairs.forEach(({ mesh, body }) => {
        mesh.position.set(body.position.x, body.position.y, body.position.z);
        mesh.quaternion.set(
          body.quaternion.x,
          body.quaternion.y,
          body.quaternion.z,
          body.quaternion.w,
        );
      });

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      w = parent.offsetWidth;
      h = parent.offsetHeight;

      renderer.setSize(w, h);

      const currentAspect = w / h;
      camera.left = (-viewSize * currentAspect) / 2;
      camera.right = (viewSize * currentAspect) / 2;
      camera.top = viewSize / 2;
      camera.bottom = -viewSize / 2;
      camera.updateProjectionMatrix();

      updatePhysicsBounds();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach((t) => t.kill());
      renderer.dispose();
    };
  }, []);

  return (
    <main
      ref={wrapRef}
      className='main-outro-wrap'
      style={{ width: '100%', height: '100%', overflow: 'hidden' }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
    </main>
  );
}
