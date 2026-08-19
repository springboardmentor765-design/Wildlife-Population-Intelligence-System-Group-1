'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import * as THREE from 'three';

interface DataPoint {
  species: string;
  count: number;
}

interface Props {
  data: DataPoint[];
}

// A single 3D Bar component
function Bar({ position, value, label, color, maxValue }: { position: [number, number, number], value: number, label: string, color: string, maxValue: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);
  
  // Normalize height relative to the max value (max height = 4)
  const height = (value / Math.max(maxValue, 1)) * 4;
  // Shift Y position so the bar sits on the ground
  const yPos = position[1] + height / 2;

  // Add a simple hovering animation
  useFrame((state) => {
    if (meshRef.current && hovered) {
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, yPos + 0.2, 0.1);
    } else if (meshRef.current && !hovered) {
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, yPos, 0.1);
    }
  });

  return (
    <group>
      <mesh
        position={[position[0], yPos, position[2]]}
        ref={meshRef}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); }}
        onPointerOut={(e) => { setHover(false); }}
      >
        <boxGeometry args={[0.8, height, 0.8]} />
        <meshStandardMaterial color={hovered ? '#4ade80' : color} roughness={0.2} metalness={0.1} />
        
        {/* Tooltip on Hover */}
        {hovered && (
          <Html position={[0, height / 2 + 0.5, 0]} center>
            <div className="bg-[#18181b] text-white px-3 py-2 rounded-lg text-sm shadow-xl border border-zinc-800 pointer-events-none whitespace-nowrap">
              <span className="capitalize font-semibold text-emerald-400">{label}</span>: {value}
            </div>
          </Html>
        )}
      </mesh>
      
      {/* Label under the bar */}
      <Text
        position={[position[0], position[1] - 0.5, position[2] + 0.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.25}
        color="#71717a"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}

export default function SpeciesDistribution3D({ data }: Props) {
  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.count));
  const spacing = 1.5;
  const startX = -((data.length - 1) * spacing) / 2;

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas camera={{ position: [0, 4, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <group position={[0, -1, 0]}>
          {/* Base Grid */}
          <gridHelper args={[20, 20, '#27272a', '#18181b']} position={[0, -0.01, 0]} />
          
          {/* Bars */}
          {data.map((item, index) => (
            <Bar 
              key={item.species}
              position={[startX + index * spacing, 0, 0]}
              value={item.count}
              label={item.species}
              color="#10b981"
              maxValue={maxValue}
            />
          ))}
        </group>
        
        <OrbitControls 
          enablePan={false}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2 - 0.1} // Prevent going below ground
        />
      </Canvas>
    </div>
  );
}
