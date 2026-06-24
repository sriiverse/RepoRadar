"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

interface CoreProps {
  speedMultiplier?: number;
  pulseIntensity?: number;
}

function HolographicMesh({ speedMultiplier = 1, pulseIntensity = 1 }: CoreProps) {
  const outerCrystalRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);
  const innerSphereRef = useRef<THREE.Mesh>(null);
  const logoRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const pointsRef = useRef<THREE.Points>(null);

  // Generate random particles for the data orbit
  const particlePositions = useMemo(() => {
    const count = 150;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Create random points in a sphere shell
      const r = 1.6 + Math.random() * 1.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, []);

  // Generate GitHub logo texture using HTML Canvas
  const logoTexture = useMemo(() => {
    if (typeof window === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, 512, 512);
      ctx.fillStyle = "#ffffff";
      
      // Draw standard SVG path of GitHub Octocat
      ctx.save();
      ctx.translate(56, 56);
      ctx.scale(16.66, 16.66);
      const path = new Path2D(
        "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
      );
      ctx.fill(path);
      ctx.restore();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }, []);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    
    // Core spin speed based on multiplier
    const speed = speedMultiplier;

    // 1. Rotate the Outer Crystal wireframe
    if (outerCrystalRef.current) {
      outerCrystalRef.current.rotation.y = elapsed * 0.15 * speed;
      outerCrystalRef.current.rotation.x = elapsed * 0.08 * speed;
    }

    if (wireframeRef.current) {
      wireframeRef.current.rotation.y = -elapsed * 0.22 * speed;
      wireframeRef.current.rotation.z = elapsed * 0.12 * speed;
    }

    // 2. Pulse the inner energy sphere
    if (innerSphereRef.current) {
      const scale = (1.0 + Math.sin(elapsed * 5.0) * 0.05) * pulseIntensity;
      innerSphereRef.current.scale.set(scale, scale, scale);
      innerSphereRef.current.rotation.y = elapsed * 0.5 * speed;
    }

    // 3. Keep the suspended GitHub logo facing forward but slowly rotating on Y
    if (logoRef.current) {
      logoRef.current.rotation.y = Math.sin(elapsed * 0.8) * 0.3;
    }

    // 4. Spin the holographic data rings on different axes
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = elapsed * 0.4 * speed;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = elapsed * 0.6 * speed;
      ring2Ref.current.rotation.z = elapsed * 0.2 * speed;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = elapsed * 0.5 * speed;
      ring3Ref.current.rotation.y = -elapsed * 0.3 * speed;
    }

    // 5. Spin orbiting particles
    if (pointsRef.current) {
      pointsRef.current.rotation.y = elapsed * 0.12 * speed;
      pointsRef.current.rotation.x = elapsed * 0.05 * speed;
    }
  });

  return (
    <group>
      {/* 1. Outer Crystal Glass Shell */}
      <mesh ref={outerCrystalRef}>
        <icosahedronGeometry args={[1.7, 1]} />
        <meshPhysicalMaterial
          color="#00f5ff"
          transparent
          opacity={0.08}
          roughness={0.1}
          metalness={0.9}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          transmission={0.6}
          thickness={1.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 2. Outer Crystal Wireframe Edge Grid */}
      <mesh ref={wireframeRef}>
        <icosahedronGeometry args={[1.72, 1]} />
        <meshBasicMaterial
          color="#a855f7"
          wireframe
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 3. Central Energy Sphere */}
      <mesh ref={innerSphereRef}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshBasicMaterial
          color="#a855f7"
          transparent
          opacity={0.35 * pulseIntensity}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Dynamic Point Light from core */}
      <pointLight distance={10} intensity={3.5 * pulseIntensity} color="#a855f7" />

      {/* 4. Suspended GitHub Logo (glowing) */}
      <mesh ref={logoRef} position={[0, 0, 0]}>
        <planeGeometry args={[0.7, 0.7]} />
        {logoTexture && (
          <meshBasicMaterial
            map={logoTexture}
            transparent
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        )}
      </mesh>

      {/* 5. Concentric Data Rings */}
      {/* Ring 1 - Outer Cyan Horizontal */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.3, 0.012, 8, 64]} />
        <meshBasicMaterial
          color="#00f5ff"
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Ring 2 - Mid Purple Tilted */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
        <torusGeometry args={[1.05, 0.01, 8, 64]} />
        <meshBasicMaterial
          color="#a855f7"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Ring 3 - Inner Cyan Vertical-ish */}
      <mesh ref={ring3Ref} rotation={[0, Math.PI / 3, Math.PI / 6]}>
        <torusGeometry args={[0.85, 0.008, 8, 64]} />
        <meshBasicMaterial
          color="#00f5ff"
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 6. Orbiting Particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          color="#00f5ff"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

export default function HolographicCore({ speedMultiplier = 1, pulseIntensity = 1 }: CoreProps) {
  return (
    <div className="w-full h-full relative pointer-events-none select-none">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.2} />
        
        {/* Core elements */}
        <HolographicMesh speedMultiplier={speedMultiplier} pulseIntensity={pulseIntensity} />
        
        {/* Cinematic post-processing Bloom */}
        <EffectComposer enableNormalPass={false}>
          <Bloom
            intensity={2.8}
            luminanceThreshold={0.05}
            luminanceSmoothing={0.85}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
