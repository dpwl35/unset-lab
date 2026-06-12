"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import GUI from "lil-gui";

export default function Scene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const mirrorObjects = [
    "cylinder_stand_01",
    "cylinder_stand_02",
    "torus_glass_01",
    "torus_glass_02",
    "torus_02",
    "sphere_03",
  ];
  const darkObjects = ["sphere_stripe", "cube_black"];

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const scene = new THREE.Scene();

    const rgbeLoader = new RGBELoader();
    rgbeLoader.load("/studio_small_08_4k.hdr", (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
    });

    const camera = new THREE.PerspectiveCamera(
      45,
      canvas.offsetWidth / canvas.offsetHeight,
      0.1,
      100,
    );
    camera.position.set(0, 0, 5);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0);
    scene.add(ambientLight);

    const gui = new GUI();
    const cameraFolder = gui.addFolder("Camera");
    cameraFolder.add(camera.position, "x", -20, 20).name("x");
    cameraFolder.add(camera.position, "y", -20, 20).name("y");
    cameraFolder.add(camera.position, "z", -20, 20).name("z");
    const ambientFolder = gui.addFolder("Ambient Light");
    ambientFolder.add(ambientLight, "intensity", 0, 100);

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

    const meshes: THREE.Mesh[] = [];

    const loader = new GLTFLoader();
    loader.load("/unsetlab-object.glb", (gltf) => {
      gltf.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          meshes.push(child);
          if (mirrorObjects.includes(child.name))
            child.material = mirrorMaterial;
          if (darkObjects.includes(child.name)) child.material = darkMaterial;
          if (child.name === "sphere_cluster")
            child.material = sphereClusterMaterial;
        }
      });

      gltf.scene.position.set(0, 0.2, 0.4);
      gltf.scene.rotation.set(0.1885, -1.8221, -0.0628);
      gltf.scene.scale.set(1, 1, 1);
      scene.add(gltf.scene);

      const objectFolder = gui.addFolder("Object");
      objectFolder.add(gltf.scene.position, "x", -20, 20).name("x");
      objectFolder.add(gltf.scene.position, "y", -20, 20).name("y");
      objectFolder.add(gltf.scene.position, "z", -20, 20).name("z");
      objectFolder
        .add(gltf.scene.rotation, "x", -Math.PI, Math.PI)
        .name("rot x");
      objectFolder
        .add(gltf.scene.rotation, "y", -Math.PI, Math.PI)
        .name("rot y");
      objectFolder
        .add(gltf.scene.rotation, "z", -Math.PI, Math.PI)
        .name("rot z");
      objectFolder.add(gltf.scene.scale, "x", 0.01, 5).name("scale x");
      objectFolder.add(gltf.scene.scale, "y", 0.01, 5).name("scale y");
      objectFolder.add(gltf.scene.scale, "z", 0.01, 5).name("scale z");
    });

    const animate = () => {
      requestAnimationFrame(animate);
      const t = Date.now() * 0.001;
      meshes.forEach((mesh, i) => {
        mesh.position.y += Math.sin(t + i) * 0.001;
        mesh.rotation.y += 0.003;
      });
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      gui.destroy();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}
