import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Hero3DBackgroundProps {
  className?: string;
}

interface DotNode {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  basePosition: THREE.Vector3;
}

export const Hero3DBackground: React.FC<Hero3DBackgroundProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, z: 0 });
  const nodesRef = useRef<DotNode[]>([]);
  const pointsRef = useRef<THREE.Points | null>(null);
  const linesRef = useRef<THREE.LineSegments | null>(null);
  const mousePositionRef = useRef(new THREE.Vector3(0, 0, 0));

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
    camera.position.z = 15;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create nodes (dots)
    const nodeCount = 80;
    const nodes: DotNode[] = [];
    const nodePositions = new Float32Array(nodeCount * 3);
    const nodeColors = new Float32Array(nodeCount * 3);

    // Connection distance threshold
    const connectionDistance = 3.5;

    for (let i = 0; i < nodeCount; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 15;

      const position = new THREE.Vector3(x, y, z);
      const basePosition = position.clone();
      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02
      );

      nodes.push({
        position,
        velocity,
        basePosition,
      });

      // Set position
      nodePositions[i * 3] = x;
      nodePositions[i * 3 + 1] = y;
      nodePositions[i * 3 + 2] = z;

      // Set color (cyan to purple gradient)
      const hue = 0.5 + (i / nodeCount) * 0.2;
      const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
      nodeColors[i * 3] = color.r;
      nodeColors[i * 3 + 1] = color.g;
      nodeColors[i * 3 + 2] = color.b;
    }

    nodesRef.current = nodes;

    // Create points geometry
    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));
    pointsGeometry.setAttribute('color', new THREE.BufferAttribute(nodeColors, 3));

    const pointsMaterial = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(points);
    pointsRef.current = points;

    // Create connections (lines) between nearby nodes
    // Estimate max connections: each node can connect to many others
    const maxConnections = nodeCount * 10; // Generous estimate
    const linePositions = new Float32Array(maxConnections * 6); // 2 points per line, 3 coords each
    const lineColors = new Float32Array(maxConnections * 6);

    const linesGeometry = new THREE.BufferGeometry();
    linesGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    linesGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const linesMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
    });

    const lines = new THREE.LineSegments(linesGeometry, linesMaterial);
    scene.add(lines);
    linesRef.current = lines;

    // Mouse interaction
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      // Convert mouse position to 3D space
      const vector = new THREE.Vector3(
        mouseRef.current.x * 10,
        mouseRef.current.y * 10,
        0
      );
      mousePositionRef.current.lerp(vector, 0.1);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    let lastTime = performance.now();
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      
      try {
        const currentTime = performance.now();
        const rawDeltaTime = (currentTime - lastTime) / 1000;
        const deltaTime = Math.max(Math.min(rawDeltaTime, 0.1), 0.001);
        lastTime = currentTime;
        const time = currentTime / 1000;

        if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;

        const nodes = nodesRef.current;
        const points = pointsRef.current;
        const lines = linesRef.current;
        
        if (!nodes || !points || !lines) return;

        const positions = points.geometry.attributes.position.array as Float32Array;
        const mousePos = mousePositionRef.current;
        const mouseInfluenceRadius = 4;
        const mouseRepulsionStrength = 0.8;

        // Update node positions
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          
          // Mouse interaction - repulsion effect
          const mouseDistance = node.position.distanceTo(mousePos);
          if (mouseDistance < mouseInfluenceRadius && mouseDistance > 0) {
            const direction = new THREE.Vector3()
              .subVectors(node.position, mousePos)
              .normalize();
            const force = (mouseInfluenceRadius - mouseDistance) / mouseInfluenceRadius;
            node.velocity.add(direction.multiplyScalar(force * mouseRepulsionStrength * deltaTime * 10));
          }

          // Smooth return to base position
          const returnForce = 0.02;
          node.velocity.x += (node.basePosition.x - node.position.x) * returnForce * deltaTime * 60;
          node.velocity.y += (node.basePosition.y - node.position.y) * returnForce * deltaTime * 60;
          node.velocity.z += (node.basePosition.z - node.position.z) * returnForce * deltaTime * 60;

          // Floating animation
          const floatAmount = 0.3;
          node.velocity.y += Math.sin(time * 0.5 + i * 0.1) * floatAmount * deltaTime;
          node.velocity.x += Math.cos(time * 0.3 + i * 0.15) * floatAmount * 0.5 * deltaTime;

          // Apply velocity with damping
          node.position.add(node.velocity);
          node.velocity.multiplyScalar(0.95);

          // Update positions array
          positions[i * 3] = node.position.x;
          positions[i * 3 + 1] = node.position.y;
          positions[i * 3 + 2] = node.position.z;
        }

        points.geometry.attributes.position.needsUpdate = true;

        // Update connections dynamically
        const linePositions = lines.geometry.attributes.position.array as Float32Array;
        const lineColors = lines.geometry.attributes.color.array as Float32Array;
        let lineIndex = 0;

        // Find and draw connections between nearby nodes
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const distance = nodes[i].position.distanceTo(nodes[j].position);
            
            if (distance < connectionDistance && lineIndex < linePositions.length - 6) {
              const nodeA = nodes[i];
              const nodeB = nodes[j];

              // Update line positions
              linePositions[lineIndex] = nodeA.position.x;
              linePositions[lineIndex + 1] = nodeA.position.y;
              linePositions[lineIndex + 2] = nodeA.position.z;
              
              linePositions[lineIndex + 3] = nodeB.position.x;
              linePositions[lineIndex + 4] = nodeB.position.y;
              linePositions[lineIndex + 5] = nodeB.position.z;

              // Update line colors based on distance (closer = brighter)
              const opacity = Math.max(0, (1 - distance / connectionDistance) * 0.3);
              const hue = 0.5 + (i / nodes.length) * 0.2;
              const color = new THREE.Color().setHSL(hue, 0.7, 0.5);
              
              lineColors[lineIndex] = color.r * opacity;
              lineColors[lineIndex + 1] = color.g * opacity;
              lineColors[lineIndex + 2] = color.b * opacity;
              
              lineColors[lineIndex + 3] = color.r * opacity;
              lineColors[lineIndex + 4] = color.g * opacity;
              lineColors[lineIndex + 5] = color.b * opacity;

              lineIndex += 6;
            }
          }
        }

        // Hide unused line segments by setting them to origin
        for (let i = lineIndex; i < linePositions.length; i += 3) {
          linePositions[i] = 0;
          linePositions[i + 1] = 0;
          linePositions[i + 2] = 0;
          if (i < lineColors.length) {
            lineColors[i] = 0;
            lineColors[i + 1] = 0;
            lineColors[i + 2] = 0;
          }
        }

        lines.geometry.attributes.position.needsUpdate = true;
        lines.geometry.attributes.color.needsUpdate = true;

        // Subtle camera movement with mouse
        const currentCamera = cameraRef.current;
        if (currentCamera) {
          const targetX = mouseRef.current.x * 1.5;
          const targetY = mouseRef.current.y * 1.5;
          currentCamera.position.x += (targetX - currentCamera.position.x) * 0.03;
          currentCamera.position.y += (targetY - currentCamera.position.y) * 0.03;
          currentCamera.lookAt(scene.position);
        }

        // Render
        const currentRenderer = rendererRef.current;
        const currentScene = sceneRef.current;
        if (currentRenderer && currentScene && currentCamera) {
          currentRenderer.render(currentScene, currentCamera);
        }
      } catch (error) {
        console.error("Animation error:", error);
      }
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
      if (pointsRef.current) {
        pointsRef.current.geometry.dispose();
        if (Array.isArray(pointsRef.current.material)) {
          pointsRef.current.material.forEach((mat) => mat.dispose());
        } else {
          pointsRef.current.material.dispose();
        }
        scene.remove(pointsRef.current);
      }

      if (linesRef.current) {
        linesRef.current.geometry.dispose();
        if (Array.isArray(linesRef.current.material)) {
          linesRef.current.material.forEach((mat) => mat.dispose());
        } else {
          linesRef.current.material.dispose();
        }
        scene.remove(linesRef.current);
      }

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
