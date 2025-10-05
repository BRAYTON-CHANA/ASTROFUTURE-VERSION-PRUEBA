'use client';
import { NEOObject } from '@/types/neo';

// Simplified orbital data for demonstration purposes.
const commonOrbitData = {
  orbit_id: '0',
  orbit_determination_date: '',
  first_observation_date: '',
  last_observation_date: '',
  data_arc_in_days: 0,
  observations_used: 0,
  orbit_uncertainty: '0',
  minimum_orbit_intersection: '0',
  jupiter_tisserand_invariant: ''
  ,
  epoch_osculation: ''
  ,
  mean_motion: ''
  ,
  equinox: ''
  ,
  orbit_class: {
    orbit_class_type: 'GEN',
    orbit_class_description: 'Generic Orbit Example',
    orbit_class_range: ''
  },
};

export const ORBIT_PRESETS: Record<string, Partial<NEOObject['orbital_data']>> = {
  Amor: {
    ...commonOrbitData,
    // Approaches Earth's orbit but does not cross it (Perihelion > 1.017 AU)
    eccentricity: '0.15',
    semi_major_axis: '1.2',
    perihelion_distance: '1.02',
    aphelion_distance: '1.38',
    inclination: '10',
    ascending_node_longitude: '180',
    perihelion_argument: '90',
    orbital_period: '450',
    mean_anomaly: '0',
  },
  Apollo: {
    ...commonOrbitData,
    // Crosses Earth's orbit (Semi-major axis > 1 AU, Perihelion < 1.017 AU)
    eccentricity: '0.5',
    semi_major_axis: '1.5',
    perihelion_distance: '0.75',
    aphelion_distance: '2.25',
    inclination: '15',
    ascending_node_longitude: '120',
    perihelion_argument: '180',
    orbital_period: '680',
    mean_anomaly: '0',
  },
  Aten: {
    ...commonOrbitData,
    // Crosses Earth's orbit, but mostly inside (Semi-major axis < 1 AU, Aphelion > 0.983 AU)
    eccentricity: '0.2',
    semi_major_axis: '0.9',
    perihelion_distance: '0.72',
    aphelion_distance: '1.08',
    inclination: '5',
    ascending_node_longitude: '240',
    perihelion_argument: '270',
    orbital_period: '310',
    mean_anomaly: '0',
  },
  Atira: {
    ...commonOrbitData,
    // Orbit is entirely contained within Earth's orbit (Aphelion < 0.983 AU)
    eccentricity: '0.1',
    semi_major_axis: '0.8',
    perihelion_distance: '0.72',
    aphelion_distance: '0.88',
    inclination: '20',
    ascending_node_longitude: '60',
    perihelion_argument: '0',
    orbital_period: '255',
    mean_anomaly: '0',
  },
};
