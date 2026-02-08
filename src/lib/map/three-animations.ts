/**
 * @module lib/map/three-animations
 * Per-frame animation updates for 3D markers.
 * Handles sphere hover, beam pulse, and featured marker rotation.
 *
 * Note: Markers have been positioned via applyMatrix4 in mercator space.
 * Animations modify material properties (opacity, emissive) rather than
 * geometry position to avoid coordinate-space issues.
 */

import * as THREE from "three";

/**
 * Updates all marker animations for the current frame.
 * @param markers - Array of marker groups to animate.
 * @param elapsed - Total elapsed time in seconds.
 */
export function updateMarkerAnimations(markers: THREE.Group[], elapsed: number): void {
  for (const group of markers) {
    const { featured } = group.userData as { featured: boolean };

    // Sphere: subtle opacity pulse (avoids position changes in mercator space)
    const sphere = group.getObjectByName("sphere") as THREE.Mesh | undefined;
    if (sphere && sphere.material instanceof THREE.MeshBasicMaterial) {
      const baseOpacity = featured ? 0.95 : 0.85;
      const pulseAmplitude = 0.1;
      const pulseSpeed = featured ? 1.5 : 1.0;
      sphere.material.opacity = baseOpacity + Math.sin(elapsed * pulseSpeed) * pulseAmplitude;
    }

    // Beam: opacity pulse
    const beam = group.getObjectByName("beam") as THREE.Mesh | undefined;
    if (beam && beam.material instanceof THREE.MeshBasicMaterial) {
      const baseOpacity = featured ? 0.2 : 0.12;
      const pulseAmplitude = featured ? 0.08 : 0.04;
      beam.material.opacity = baseOpacity + Math.sin(elapsed * 1.5) * pulseAmplitude;
    }
  }
}
