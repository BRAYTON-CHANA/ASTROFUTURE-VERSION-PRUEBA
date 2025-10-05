'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, Sphere, Html } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { OrbitalData } from '@/lib/types';
import { generateOrbitPath, getAnimatedPosition } from '@/lib/orbit-calculator';
import { adaptPlanetDataToOrbitalData, planets } from '@/lib/planetary-data';

const SIMULATION_SPEED = 500000;

// Helper to satisfy the OrbitalData type from a partial preset
const completeOrbitalData = (partialData: Partial<OrbitalData>): OrbitalData => {
  return {
    orbit_id: '0',
    orbit_determination_date: '',
    first_observation_date: '',
    last_observation_date: '',
    data_arc_in_days: 0,
    observations_used: 0,
    orbit_uncertainty: '0',
    minimum_orbit_intersection: '0',
    jupiter_tisserand_invariant: '',
    epoch_osculation: '',
    orbital_period: '0',
    perihelion_distance: '0',
    aphelion_distance: '0',
    perihelion_time: '0',
    mean_anomaly: '0',
    mean_motion: '0',
    equinox: '',
    orbit_class: { orbit_class_type: 'PRESET', orbit_class_description: 'Preset', orbit_class_range: '' },
    ...partialData,
  } as OrbitalData;
};

const earthData = planets.find(p => p.name === 'Earth');

// --- 3D Components ---
const Sun = () => (
  <Sphere args={[0.2, 32, 32]} position={[0, 0, 0]}> 
    <meshStandardMaterial emissive="#FFD700" emissiveIntensity={5} color="#FFD700" />
    <Html distanceFactor={15}>
      <div className="text-white text-[9px] bg-black/60 rounded-md px-1 py-0 whitespace-nowrap font-semibold"> 
        Sol
      </div>
    </Html>
  </Sphere>
);

const Earth = () => {
  const earthRef = useRef<THREE.Mesh>(null);
  
  if (!earthData) {
    return null;
  }

  const adaptedOrbitalData = useMemo(() => adaptPlanetDataToOrbitalData(earthData.orbital_data), []);
  const orbitPath = useMemo(() => generateOrbitPath(adaptedOrbitalData, 500), [adaptedOrbitalData]);

  useFrame(({ clock }) => {
    if (earthRef.current) {
      const newPosition = getAnimatedPosition(adaptedOrbitalData, clock.getElapsedTime(), SIMULATION_SPEED);
      earthRef.current.position.copy(newPosition);
    }
  });

  return (
    <group>
      <Line points={orbitPath} color="#0077ff" lineWidth={2} /> 
      <Sphere ref={earthRef} args={[0.08, 32, 32]}> 
        <meshStandardMaterial color={earthData.visualization.color} />
        <Html distanceFactor={10}>
          <div className="text-white text-[9px] bg-black/60 rounded-md px-1 py-0 whitespace-nowrap font-semibold">
            Tierra
          </div>
        </Html>
      </Sphere>
    </group>
  );
};

const Asteroid = ({ orbitalData, name }: { orbitalData: Partial<OrbitalData>, name: string }) => {
  const asteroidRef = useRef<THREE.Mesh>(null);
  const fullOrbitalData = useMemo(() => completeOrbitalData(orbitalData), [orbitalData]);
  const orbitPath = useMemo(() => generateOrbitPath(fullOrbitalData), [fullOrbitalData]);

  useFrame(({ clock }) => {
    if (asteroidRef.current) {
      const newPosition = getAnimatedPosition(fullOrbitalData, clock.getElapsedTime(), SIMULATION_SPEED);
      asteroidRef.current.position.copy(newPosition);
    }
  });

  return (
    <group>
      <Line points={orbitPath} color="#ff4500" lineWidth={1.5} />
      <Sphere ref={asteroidRef} args={[0.04, 20, 20]}> 
        <meshStandardMaterial color="#E5E7EB" />
        <Html distanceFactor={10}>
           <div className="text-white text-[9px] bg-black/60 rounded-md px-1 py-0 whitespace-nowrap font-semibold">
            {name}
          </div>
        </Html>
      </Sphere>
    </group>
  );
};

// --- Main Card Component ---
interface OrbitCardProps {
  orbitalData: Partial<OrbitalData>;
  name: string;
}

export const OrbitCard = ({ orbitalData, name }: OrbitCardProps) => {
  return (
    <div className="w-full h-64 bg-gray-900 rounded-lg relative">
      <Canvas camera={{ position: [0, 2.5, 5], fov: 50 }}>
        <ambientLight intensity={0.1} />
        <pointLight position={[0, 0, 0]} intensity={2.5} color="#ffdd88" />
        
        <Sun />
        <Earth />
        <Asteroid orbitalData={orbitalData} name={name} />

        <OrbitControls 
          enableZoom={true} 
          enablePan={true} 
          minDistance={1}
          maxDistance={20} 
          zoomSpeed={0.8}
        />
      </Canvas>
    </div>
  );
};