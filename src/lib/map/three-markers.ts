/**
 * @module lib/map/three-markers
 * Creates individual 3D marker meshes for event locations.
 * Each marker is a glowing emissive sphere with a vertical light beam pillar.
 */

import * as THREE from "three";

/** Default sphere radius in meters. */
const SPHERE_RADIUS = 12;
/** Featured sphere radius in meters. */
const FEATURED_SPHERE_RADIUS = 18;
/** Light beam height in meters. */
const BEAM_HEIGHT = 80;
/** Light beam radius in meters. */
const BEAM_RADIUS = 2;

/**
 * Creates a 3D marker mesh group for an event location.
 * Consists of a glowing sphere and a vertical light beam.
 * @param color - Hex color string for the marker.
 * @param featured - Whether this is a featured event (larger/brighter).
 * @returns A THREE.Group containing the sphere and beam meshes.
 */
export function createMarkerMesh(color: string, featured: boolean): THREE.Group {
  const group = new THREE.Group();
  const threeColor = new THREE.Color(color);
  const radius = featured ? FEATURED_SPHERE_RADIUS : SPHERE_RADIUS;

  // Glowing emissive sphere
  const sphereGeometry = new THREE.SphereGeometry(radius, 16, 16);
  const sphereMaterial = new THREE.MeshBasicMaterial({
    color: threeColor,
    transparent: true,
    opacity: featured ? 0.95 : 0.85,
  });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.y = radius; // Sit on ground
  sphere.name = "sphere";
  group.add(sphere);

  // Vertical light beam pillar
  const beamGeometry = new THREE.CylinderGeometry(BEAM_RADIUS, BEAM_RADIUS, BEAM_HEIGHT, 8, 1, true);
  const beamMaterial = new THREE.MeshBasicMaterial({
    color: threeColor,
    transparent: true,
    opacity: featured ? 0.2 : 0.12,
    side: THREE.DoubleSide,
  });
  const beam = new THREE.Mesh(beamGeometry, beamMaterial);
  beam.position.y = BEAM_HEIGHT / 2; // Center vertically
  beam.name = "beam";
  group.add(beam);

  // Store metadata for animations
  group.userData = { featured, baseY: radius, color };

  return group;
}

/**
 * Disposes all geometries and materials in a marker group.
 * @param group - The marker group to dispose.
 */
export function disposeMarkerMesh(group: THREE.Group): void {
  group.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.geometry.dispose();
      if (child.material instanceof THREE.Material) {
        child.material.dispose();
      }
    }
  });
}
