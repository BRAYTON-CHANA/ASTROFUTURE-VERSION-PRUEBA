'use client';

import { Suspense, useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, Sphere, Html } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { NEOObject, OrbitalData } from '@/lib/types';
import { planets, adaptPlanetDataToOrbitalData } from '@/lib/planetary-data';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import { generateOrbitPath, getAnimatedPosition, getPositionAtMeanAnomaly } from '@/lib/orbit-calculator';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface SimulationModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  orbitalData?: NEOObject['orbital_data'];
  asteroidName: string;
}

const SIMULATION_SPEED = 5000000;

// --- Helper Functions and Scene Components ---

function PlanetsReference() {
    return (
        <group>
            {planets.map((planet) => {
                const adaptedOrbitalData = useMemo(() => adaptPlanetDataToOrbitalData(planet.orbital_data), [planet.orbital_data]);
                const orbitPath = useMemo(() => generateOrbitPath(adaptedOrbitalData, 500), [adaptedOrbitalData]);
                const randomMeanAnomaly = useMemo(() => Math.random() * 2 * Math.PI, []);
                const position = useMemo(() => getPositionAtMeanAnomaly(adaptedOrbitalData, randomMeanAnomaly), [adaptedOrbitalData, randomMeanAnomaly]);
                return (
                    <group key={planet.name}>
                        <Line points={orbitPath} color="#2C3E50" lineWidth={1} dashed dashScale={50} dashSize={0.5} gapSize={0.2} />
                        <Sphere args={[planet.visualization.size, 32, 32]} position={position}>
                            <meshStandardMaterial color={planet.visualization.color} />
                            <Html distanceFactor={10}><div className="text-white text-[8px] bg-black/50 rounded-md px-1 whitespace-nowrap">{planet.name}</div></Html>
                        </Sphere>
                    </group>
                );
            })}
        </group>
    );
}

function OrbitalScene({ orbitalData, asteroidName }: { orbitalData?: OrbitalData, asteroidName: string }) {
    const asteroidRef = useRef<THREE.Mesh>(null);
    const orbitPath = useMemo(() => orbitalData ? generateOrbitPath(orbitalData) : [], [orbitalData]);

    useFrame(({ clock }) => {
        if (asteroidRef.current && orbitalData) {
            const newPosition = getAnimatedPosition(orbitalData, clock.getElapsedTime(), SIMULATION_SPEED);
            asteroidRef.current.position.copy(newPosition);
        }
    });

    if (!orbitalData) return null;

    return (
        <>
            <ambientLight intensity={0.05} />
            <pointLight position={[0, 0, 0]} intensity={2.5} color="#FFD700" distance={50} decay={1.5} />
            <Sphere args={[0.07, 32, 32]} position={[0, 0, 0]}>
                 <meshStandardMaterial emissive="#FFD700" emissiveIntensity={5} color="#FFD700" />
            </Sphere>
            <Line points={orbitPath} color="#FFFFFF" lineWidth={1.5} />
            <Sphere ref={asteroidRef} args={[0.02, 20, 20]}>
                <meshStandardMaterial color="#E5E7EB" />
                <Html distanceFactor={10}><div className="text-white text-xs bg-red-900/80 rounded-md px-2 py-1 whitespace-nowrap">{asteroidName}</div></Html>
            </Sphere>
            <PlanetsReference />
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} maxDistance={60} minDistance={0.1} />
        </>
    );
}

const orbitalParameterExplanations: Record<string, string> = {
    "Excentricidad": "Mide qué tan alargada es la órbita. Un valor de 0 es un círculo perfecto, y cercano a 1 es una elipse muy larga y delgada.",
    "Semieje Mayor (AU)": "Es la mitad de la distancia más larga a través de la elipse de la órbita, definiendo su tamaño general. Se mide en Unidades Astronómicas (distancia Tierra-Sol).",
    "Inclinación (grados)": "Es el ángulo de la órbita con respecto al plano principal del sistema solar (la eclíptica). Una inclinación de 0 significa que orbita en el mismo plano que la Tierra.",
    "Long. Nodo Asc. (grados)": "Define la orientación de la órbita. Es el ángulo donde la órbita cruza el plano de referencia del sistema solar de sur a norte.",
    "Argumento del Perihelio (grados)": "Determina la orientación de la elipse en el plano orbital. Es el ángulo entre el nodo ascendente y el perihelio (el punto más cercano al Sol).",
    "Período Orbital (días)": "Es el tiempo que tarda el objeto en completar una órbita completa alrededor del Sol.",
    "Anomalía Media (grados)": "Es una medida de tiempo, representando la fracción del período orbital que ha transcurrido desde que el objeto pasó por el perihelio.",
};

function OrbitalDataPanel({ orbitalData }: { orbitalData?: OrbitalData }) {
    if (!orbitalData) return null;
    const dataPoints = [
        { id: "Excentricidad", label: "Excentricidad", value: parseFloat(orbitalData.eccentricity).toFixed(6) },
        { id: "Semieje Mayor (AU)", label: "Semieje Mayor (AU)", value: parseFloat(orbitalData.semi_major_axis).toFixed(6) },
        { id: "Inclinación (grados)", label: "Inclinación (grados)", value: parseFloat(orbitalData.inclination).toFixed(6) },
        { id: "Long. Nodo Asc. (grados)", label: "Long. Nodo Asc. (grados)", value: parseFloat(orbitalData.ascending_node_longitude).toFixed(6) },
        { id: "Argumento del Perihelio (grados)", label: "Argumento del Perihelio (grados)", value: parseFloat(orbitalData.perihelion_argument).toFixed(6) },
        { id: "Período Orbital (días)", label: "Período Orbital (días)", value: parseFloat(orbitalData.orbital_period).toFixed(2) },
        { id: "Anomalía Media (grados)", label: "Anomalía Media (grados)", value: parseFloat(orbitalData.mean_anomaly).toFixed(6) },
    ];
    return (
        <div className="bg-gray-900/50 p-4 rounded-lg text-white overflow-y-auto flex-shrink-0">
            <h3 className="text-lg font-bold mb-4 text-gray-200">Parámetros Orbitales</h3>
            <TooltipProvider delayDuration={100}>
                <div className="space-y-3 text-sm">
                    {dataPoints.map(({ id, label, value }) => (
                        <div key={id} className="flex justify-between items-center border-b border-gray-700 pb-2">
                            <div className="flex items-center">
                                <span className="text-gray-400">{label}</span>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button className="ml-2 text-gray-500 hover:text-gray-300"><HelpCircle size={14} /></button>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs"><p>{orbitalParameterExplanations[id]}</p></TooltipContent>
                                </Tooltip>
                            </div>
                            <span className="font-mono text-gray-200 tracking-tighter">{value}</span>
                        </div>
                    ))}
                </div>
            </TooltipProvider>
        </div>
    );
}

const PARAMETER_CONFIG: Record<keyof Omit<OrbitalData, 'orbit_class' | 'last_observation_date' | 'first_observation_date' | 'orbit_determination_date' | 'epoch' | 'orbit_id' | 'orbit_uncertainty' | 'minimum_orbit_intersection' | 'jupiter_tisserand_invariant' | 'observations_used' | 'data_arc_in_days' | 'epoch_osculation' | 'perihelion_time' | 'mean_motion' | 'equinox' | 'aphelion_distance' | 'perihelion_distance'>, { min: number; max: number; step: number; }> = {
    eccentricity: { min: 0, max: 0.999, step: 0.001 },
    semi_major_axis: { min: 0.1, max: 50, step: 0.1 },
    inclination: { min: 0, max: 180, step: 0.1 },
    ascending_node_longitude: { min: 0, max: 360, step: 0.1 },
    perihelion_argument: { min: 0, max: 360, step: 0.1 },
    orbital_period: { min: 1, max: 100000, step: 100 },
    mean_anomaly: { min: 0, max: 360, step: 0.1 },
};

function EditableOrbitalDataPanel({ orbitalData, onDataChange }: { orbitalData: OrbitalData, onDataChange: (data: OrbitalData) => void; }) {
    const handleSliderChange = (field: keyof OrbitalData, value: number[]) => {
        onDataChange({ ...orbitalData, [field]: String(value[0]) });
    };

    const dataPoints: { id: keyof typeof PARAMETER_CONFIG; label: string; }[] = [
        { id: "eccentricity", label: "Excentricidad" },
        { id: "semi_major_axis", label: "Semieje Mayor (AU)" },
        { id: "inclination", label: "Inclinación (grados)" },
        { id: "ascending_node_longitude", label: "Long. Nodo Asc. (grados)" },
        { id: "perihelion_argument", label: "Argumento del Perihelio (grados)" },
        { id: "orbital_period", label: "Período Orbital (días)" },
        { id: "mean_anomaly", label: "Anomalía Media (grados)" },
    ];

    return (
        <div className="bg-gray-900/50 p-4 rounded-lg text-white overflow-y-auto flex-shrink-0">
            <h3 className="text-lg font-bold mb-4 text-gray-200">Parámetros Editables</h3>
            <div className="space-y-4 text-sm">
                {dataPoints.map(({ id, label }) => {
                    const config = PARAMETER_CONFIG[id];
                    const value = parseFloat(orbitalData[id]);

                    return (
                        <div key={id} className="grid grid-cols-1 gap-2">
                             <div className="flex justify-between items-center">
                                <Label htmlFor={id} className="text-gray-400 text-xs">{label}</Label>
                                <span className="font-mono text-gray-200 text-xs tracking-tighter">{value.toFixed(4)}</span>
                            </div>
                            <Slider
                                id={id}
                                min={config.min}
                                max={config.max}
                                step={config.step}
                                value={[value]}
                                onValueChange={(newValue) => handleSliderChange(id, newValue)}
                                className="w-full [&>span:first-child]:h-1"
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export function SimulationModal({ isOpen, onOpenChange, orbitalData: initialOrbitalData, asteroidName }: SimulationModalProps) {
    const [isEditMode, setEditMode] = useState(false);
    const [editableOrbitalData, setEditableOrbitalData] = useState(initialOrbitalData);

    useEffect(() => {
        setEditableOrbitalData(initialOrbitalData);
        if (!isOpen) {
            setEditMode(false);
        }
    }, [initialOrbitalData, isOpen]);

    const handleEditModeChange = (checked: boolean) => {
        setEditMode(checked);
        if (!checked) {
            setEditableOrbitalData(initialOrbitalData);
        }
    };

    const simulationData = isEditMode ? editableOrbitalData : initialOrbitalData;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Simulación Orbital: {asteroidName}</DialogTitle>
                    <DialogDescription>Interactúa con la visualización 3D y explora los datos orbitales del asteroide.</DialogDescription>
                </DialogHeader>
                <div className="flex-grow flex flex-row space-x-4 overflow-hidden p-1">
                    <div className="w-72 flex-shrink-0 flex flex-col space-y-4">
                        <div className="flex items-center space-x-2 p-4 bg-gray-900/50 rounded-lg">
                            <Switch id="edit-mode-switch" checked={isEditMode} onCheckedChange={handleEditModeChange} />
                            <Label htmlFor="edit-mode-switch" className="text-white">Modo Editable</Label>
                        </div>
                        {isEditMode && editableOrbitalData ? (
                            <EditableOrbitalDataPanel orbitalData={editableOrbitalData} onDataChange={setEditableOrbitalData} />
                        ) : (
                            <OrbitalDataPanel orbitalData={initialOrbitalData} />
                        )}
                    </div>
                    <div className="flex-grow bg-black rounded-md overflow-hidden relative">
                        <Suspense fallback={<div className='w-full h-full flex justify-center items-center text-white'>Cargando simulación...</div>}>
                            <Canvas camera={{ position: [-5, 5, 5], fov: 60 }}>
                                <OrbitalScene orbitalData={simulationData} asteroidName={asteroidName} />
                                <EffectComposer>
                                    <Bloom intensity={1.8} luminanceThreshold={0.8} luminanceSmoothing={0.025} mipmapBlur />
                                </EffectComposer>
                            </Canvas>
                        </Suspense>
                    </div>
                </div>
                <DialogFooter className="mt-4">
                    <Button onClick={() => onOpenChange(false)} variant="outline">Cerrar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}