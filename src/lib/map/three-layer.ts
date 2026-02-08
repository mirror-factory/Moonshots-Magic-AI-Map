/**
 * @module lib/map/three-layer
 * MapLibre CustomLayerInterface that renders animated 3D markers
 * at event locations using three.js. Shares the WebGL context with MapLibre.
 */

import * as THREE from "three";
import { MercatorCoordinate } from "maplibre-gl";
import type { Map as MaplibreMap, CustomLayerInterface, CustomRenderMethodInput } from "maplibre-gl";
import { CATEGORY_COLORS } from "./config";
import { createMarkerMesh, disposeMarkerMesh } from "./three-markers";
import { updateMarkerAnimations } from "./three-animations";
import type { EventEntry } from "@/lib/registries/types";

/** Custom layer ID for the three.js marker layer. */
export const THREE_LAYER_ID = "three-markers";

/**
 * Creates a MapLibre custom layer that renders 3D markers with three.js.
 * Each marker is positioned in mercator coordinates and rendered with the map's
 * model-view-projection matrix so they move/rotate correctly with the camera.
 * @param events - Event entries with coordinates.
 * @returns A CustomLayerInterface for MapLibre.
 */
export function createThreeLayer(events: EventEntry[]): CustomLayerInterface {
  let renderer: THREE.WebGLRenderer;
  let scene: THREE.Scene;
  let camera: THREE.Camera;
  let mapInstance: MaplibreMap;
  const markerGroups: THREE.Group[] = [];
  let startTime = 0;

  // Pre-compute mercator transforms for each event
  const eventTransforms = events
    .filter((e) => e.coordinates)
    .map((e) => {
      const coords = e.coordinates!;
      const mercator = MercatorCoordinate.fromLngLat(coords, 0);
      const scale = mercator.meterInMercatorCoordinateUnits();
      return { event: e, mercator, scale };
    });

  return {
    id: THREE_LAYER_ID,
    type: "custom" as const,
    renderingMode: "3d" as const,

    onAdd(_map: MaplibreMap, gl: WebGLRenderingContext) {
      mapInstance = _map;
      startTime = performance.now();

      renderer = new THREE.WebGLRenderer({
        canvas: _map.getCanvas(),
        context: gl,
        antialias: true,
      });
      renderer.autoClear = false;

      scene = new THREE.Scene();
      camera = new THREE.Camera();

      // Create markers at mercator positions
      for (const { event, mercator, scale } of eventTransforms) {
        const color = CATEGORY_COLORS[event.category] || "#888888";
        const group = createMarkerMesh(color, !!event.featured);

        // Build transform matrix: translate to mercator pos, then scale meters → mercator
        // MapLibre mercator: X = east, Y = south, Z = up (in 3d renderingMode)
        const modelTransform = new THREE.Matrix4()
          .makeTranslation(mercator.x, mercator.y, mercator.z ?? 0)
          .scale(new THREE.Vector3(scale, -scale, scale));

        group.applyMatrix4(modelTransform);
        markerGroups.push(group);
        scene.add(group);
      }
    },

    render(_gl: WebGLRenderingContext | WebGL2RenderingContext, args: CustomRenderMethodInput) {
      // Use the model-view-projection matrix that maps mercator world → clip space
      const m = new THREE.Matrix4().fromArray(
        Array.from(args.modelViewProjectionMatrix)
      );
      camera.projectionMatrix = m;

      // Animate
      const elapsed = (performance.now() - startTime) / 1000;
      updateMarkerAnimations(markerGroups, elapsed);

      // Render — share WebGL state with MapLibre
      renderer.resetState();
      renderer.render(scene, camera);

      // Continuous animation
      mapInstance.triggerRepaint();
    },

    onRemove() {
      for (const group of markerGroups) {
        disposeMarkerMesh(group);
        scene.remove(group);
      }
      markerGroups.length = 0;
      renderer.dispose();
    },
  };
}
