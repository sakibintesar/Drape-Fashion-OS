/**
 * three.js does not bundle TypeScript types in this project; declaring it as a
 * shorthand ambient module lets Demo 4's import type-check (the namespace is
 * only passed through to Vanta and read for REVISION).
 */
declare module 'three';

/**
 * Ambient declarations for the Vanta.js generative-effect scripts used by
 * Demo 4 (Generative Atmosphere).
 *
 * The Vanta distributions are loaded at runtime as classic <script> tags
 * (copied to /public/vendor/vanta) and register themselves on `window.VANTA`.
 * They read THREE.js from `window.THREE` at evaluation time and also accept
 * it via the `THREE` option at construction time.
 */

interface VantaEffectOptions {
  el?: HTMLElement | Element
  THREE?: unknown
  mouseControls?: boolean
  touchControls?: boolean
  gyroControls?: boolean
  minHeight?: number
  minWidth?: number
  [key: string]: unknown
}

interface VantaEffect {
  destroy: () => void
  setOptions: (options: VantaEffectOptions) => void
}

interface VantaGlobal {
  FOG?: (options: VantaEffectOptions) => VantaEffect
  NET?: (options: VantaEffectOptions) => VantaEffect
  WAVES?: (options: VantaEffectOptions) => VantaEffect
  [key: string]: ((options: VantaEffectOptions) => VantaEffect) | undefined
}

interface Window {
  THREE?: unknown
  VANTA?: VantaGlobal
}