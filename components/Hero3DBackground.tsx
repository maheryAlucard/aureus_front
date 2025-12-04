import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Hero3DBackgroundProps {
  className?: string;
}

export const Hero3DBackground: React.FC<Hero3DBackgroundProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const meshesRef = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer setup with performance optimizations
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
    renderer.setClearColor(0x000000, 0); // Transparent background
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00d4ff, 0.6, 100);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x8b5cf6, 0.5, 100);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    // Create animated geometric shapes (low-poly for performance)
    const meshes: THREE.Mesh[] = [];
    const geometryTypes = [
      () => new THREE.IcosahedronGeometry(0.3, 0), // Low-poly sphere
      () => new THREE.OctahedronGeometry(0.3, 0),
      () => new THREE.TetrahedronGeometry(0.3, 0),
    ];

    // Create multiple floating shapes
    for (let i = 0; i < 15; i++) {
      const geometry = geometryTypes[Math.floor(Math.random() * geometryTypes.length)]();
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(
          Math.random() * 0.2 + 0.5, // Cyan to purple range
          0.7,
          0.5 + Math.random() * 0.3
        ),
        metalness: 0.3,
        roughness: 0.4,
        emissive: new THREE.Color().setHSL(
          Math.random() * 0.2 + 0.5,
          0.8,
          0.1
        ),
        transparent: true,
        opacity: 0.6,
      });

      const mesh = new THREE.Mesh(geometry, material);
      
      // Random initial positions
      mesh.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
      
      // Random rotation speeds
      (mesh as any).rotationSpeed = {
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.02,
      };
      
      // Random float animation parameters
      (mesh as any).floatSpeed = Math.random() * 0.01 + 0.005;
      (mesh as any).floatAmplitude = Math.random() * 0.5 + 0.3;
      (mesh as any).floatPhase = Math.random() * Math.PI * 2;
      
      scene.add(mesh);
      meshes.push(mesh);
    }
    meshesRef.current = meshes;

    // Create particle system for additional depth
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 20;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x00d4ff,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Mouse interaction
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop with performance optimization
    let time = 0;
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      time += 0.01;

      // Animate meshes
      meshes.forEach((mesh, index) => {
        // Rotation
        mesh.rotation.x += (mesh as any).rotationSpeed.x;
        mesh.rotation.y += (mesh as any).rotationSpeed.y;
        mesh.rotation.z += (mesh as any).rotationSpeed.z;

        // Floating animation
        const floatY = Math.sin(time * (mesh as any).floatSpeed + (mesh as any).floatPhase) * (mesh as any).floatAmplitude;
        mesh.position.y += floatY * 0.01;

        // Subtle mouse interaction
        mesh.position.x += (mouseRef.current.x * 0.1 - mesh.position.x * 0.1) * 0.01;
        mesh.position.y += (mouseRef.current.y * 0.1 - mesh.position.y * 0.1) * 0.01;
      });

      // Animate particles
      particles.rotation.y += 0.001;
      particles.rotation.x += 0.0005;

      // Subtle camera movement
      camera.position.x += (mouseRef.current.x * 0.5 - camera.position.x) * 0.05;
      camera.position.y += (mouseRef.current.y * 0.5 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      // Animate lights
      pointLight1.position.x = Math.sin(time) * 5;
      pointLight1.position.y = Math.cos(time) * 5;
      pointLight2.position.x = Math.cos(time * 0.7) * -5;
      pointLight2.position.y = Math.sin(time * 0.7) * -5;

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Dispose geometries and materials
      meshes.forEach((mesh) => {
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat) => mat.dispose());
        } else {
          mesh.material.dispose();
        }
        scene.remove(mesh);
      });

      particleGeometry.dispose();
      particleMaterial.dispose();
      scene.remove(particles);

      if (rendererRef.current && containerRef.current && containerRef.current.contains(rendererRef.current.domElement)) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 -z-10 pointer-events-none ${className}`}
      style={{ 
        background: 'transparent',
        overflow: 'hidden'
      }}
    />
  );
};

