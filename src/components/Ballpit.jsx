"use client";

import { useEffect, useRef } from 'react';
import {
  Vector3 as a,
  MeshPhysicalMaterial as c,
  InstancedMesh as d,
  Timer as e,
  AmbientLight as f,
  SphereGeometry as g,
  ShaderChunk as h,
  Scene as i,
  Color as l,
  Object3D as m,
  SRGBColorSpace as n,
  MathUtils as o,
  PMREMGenerator as p,
  Vector2 as r,
  WebGLRenderer as s,
  PerspectiveCamera as t,
  PointLight as u,
  ACESFilmicToneMapping as v,
  Plane as w,
  Raycaster as y
} from 'three';
import { RoomEnvironment as z } from 'three/examples/jsm/environments/RoomEnvironment.js';

class x {
  #e;
  canvas;
  camera;
  cameraMinAspect;
  cameraMaxAspect;
  cameraFov;
  maxPixelRatio;
  minPixelRatio;
  scene;
  renderer;
  #t;
  size = { width: 0, height: 0, wWidth: 0, wHeight: 0, ratio: 0, pixelRatio: 0 };
  render = this.#i;
  onBeforeRender = () => {};
  onAfterRender = () => {};
  onAfterResize = () => {};
  #s = false;
  #n = false;
  // Bind once: `.bind()` returns a new function on every call, so binding again
  // in the teardown would hand removeEventListener a function that was never
  // registered, leaving the listener attached for the lifetime of the page.
  #boundResize = this.#f.bind(this);
  #boundVisibilityChange = this.#v.bind(this);
  isDisposed = false;
  #o;
  #r;
  #a;
  #c = new e();
  #h = { elapsed: 0, delta: 0 };
  #l;
  constructor(e) {
    this.#e = { ...e };
    this.#m();
    this.#d();
    this.#p();
    this.resize();
    this.#g();
  }
  #m() {
    this.camera = new t();
    this.cameraFov = this.camera.fov;
  }
  #d() {
    this.scene = new i();
  }
  #p() {
    if (this.#e.canvas) {
      this.canvas = this.#e.canvas;
    } else if (this.#e.id) {
      this.canvas = document.getElementById(this.#e.id);
    } else {
      console.error('Three: Missing canvas or id parameter');
    }
    this.canvas.style.display = 'block';
    const e = {
      canvas: this.canvas,
      powerPreference: 'high-performance',
      ...(this.#e.rendererOptions ?? {})
    };
    this.renderer = new s(e);
    this.renderer.outputColorSpace = n;
  }
  #g() {
    if (!(this.#e.size instanceof Object)) {
      window.addEventListener('resize', this.#boundResize);
      if (this.#e.size === 'parent' && this.canvas.parentNode) {
        this.#r = new ResizeObserver(this.#f.bind(this));
        this.#r.observe(this.canvas.parentNode);
      }
    }
    this.#o = new IntersectionObserver(this.#u.bind(this), {
      root: null,
      rootMargin: '0px',
      threshold: 0
    });
    this.#o.observe(this.canvas);
    document.addEventListener('visibilitychange', this.#boundVisibilityChange);
  }
  #y() {
    window.removeEventListener('resize', this.#boundResize);
    this.#r?.disconnect();
    this.#o?.disconnect();
    document.removeEventListener('visibilitychange', this.#boundVisibilityChange);
  }
  #u(e) {
    this.#s = e[0].isIntersecting;
    this.#s ? this.#w() : this.#z();
  }
  #v() {
    if (this.#s) {
      document.hidden ? this.#z() : this.#w();
    }
  }
  #f() {
    if (this.#a) clearTimeout(this.#a);
    this.#a = setTimeout(this.resize.bind(this), 100);
  }
  resize() {
    let e, t;
    if (this.#e.size instanceof Object) {
      e = this.#e.size.width;
      t = this.#e.size.height;
    } else if (this.#e.size === 'parent' && this.canvas.parentNode) {
      e = this.canvas.parentNode.offsetWidth;
      t = this.canvas.parentNode.offsetHeight;
    } else {
      e = window.innerWidth;
      t = window.innerHeight;
    }
    this.size.width = e;
    this.size.height = t;
    this.size.ratio = e / t;
    this.#x();
    this.#b();
    this.onAfterResize(this.size);
  }
  #x() {
    this.camera.aspect = this.size.width / this.size.height;
    if (this.camera.isPerspectiveCamera && this.cameraFov) {
      if (this.cameraMinAspect && this.camera.aspect < this.cameraMinAspect) {
        this.#A(this.cameraMinAspect);
      } else if (this.cameraMaxAspect && this.camera.aspect > this.cameraMaxAspect) {
        this.#A(this.cameraMaxAspect);
      } else {
        this.camera.fov = this.cameraFov;
      }
    }
    this.camera.updateProjectionMatrix();
    this.updateWorldSize();
  }
  #A(e) {
    const t = Math.tan(o.degToRad(this.cameraFov / 2)) / (this.camera.aspect / e);
    this.camera.fov = 2 * o.radToDeg(Math.atan(t));
  }
  updateWorldSize() {
    if (this.camera.isPerspectiveCamera) {
      const e = (this.camera.fov * Math.PI) / 180;
      this.size.wHeight = 2 * Math.tan(e / 2) * this.camera.position.length();
      this.size.wWidth = this.size.wHeight * this.camera.aspect;
    } else if (this.camera.isOrthographicCamera) {
      this.size.wHeight = this.camera.top - this.camera.bottom;
      this.size.wWidth = this.camera.right - this.camera.left;
    }
  }
  #b() {
    this.renderer.setSize(this.size.width, this.size.height);
    this.#t?.setSize(this.size.width, this.size.height);
    let e = window.devicePixelRatio;
    if (this.maxPixelRatio && e > this.maxPixelRatio) {
      e = this.maxPixelRatio;
    } else if (this.minPixelRatio && e < this.minPixelRatio) {
      e = this.minPixelRatio;
    }
    this.renderer.setPixelRatio(e);
    this.size.pixelRatio = e;
  }
  get postprocessing() {
    return this.#t;
  }
  set postprocessing(e) {
    this.#t = e;
    this.render = e.render.bind(e);
  }
  #w() {
    if (this.#n) return;
    const animate = () => {
      this.#l = requestAnimationFrame(animate);
      this.#c.update();
      this.#h.delta = this.#c.getDelta();
      this.#h.elapsed += this.#h.delta;
      this.onBeforeRender(this.#h);
      this.render();
      this.onAfterRender(this.#h);
    };
    this.#n = true;
    this.#c.reset();
    animate();
  }
  #z() {
    if (this.#n) {
      cancelAnimationFrame(this.#l);
      this.#n = false;
    }
  }
  #i() {
    this.renderer.render(this.scene, this.camera);
  }
  clear() {
    this.scene.traverse(e => {
      if (e.isMesh && typeof e.material === 'object' && e.material !== null) {
        Object.keys(e.material).forEach(t => {
          const i = e.material[t];
          if (i !== null && typeof i === 'object' && typeof i.dispose === 'function') {
            i.dispose();
          }
        });
        e.material.dispose();
        e.geometry.dispose();
      }
    });
    this.scene.clear();
  }
  dispose() {
    this.#y();
    this.#z();
    this.#c.dispose();
    this.clear();
    this.#t?.dispose();
    this.renderer?.dispose();
    this.isDisposed = true;
  }
}

const b = new Map(),
  A = new r();
let R = false;
function S(e) {
  const t = {
    position: new r(),
    nPosition: new r(),
    hover: false,
    touching: false,
    onEnter() {},
    onMove() {},
    onClick() {},
    onLeave() {},
    ...e
  };
  (function (e, t) {
    if (!b.has(e)) {
      b.set(e, t);
      if (!R) {
        document.body.addEventListener('pointermove', M);
        document.body.addEventListener('pointerleave', L);
        document.body.addEventListener('click', C);

        document.body.addEventListener('touchstart', TouchStart, { passive: true });
        document.body.addEventListener('touchmove', TouchMove, { passive: true });
        document.body.addEventListener('touchend', TouchEnd, { passive: true });
        document.body.addEventListener('touchcancel', TouchEnd, { passive: true });

        R = true;
      }
    }
  })(e.domElement, t);
  t.dispose = () => {
    const t = e.domElement;
    b.delete(t);
    if (b.size === 0) {
      document.body.removeEventListener('pointermove', M);
      document.body.removeEventListener('pointerleave', L);
      document.body.removeEventListener('click', C);

      document.body.removeEventListener('touchstart', TouchStart);
      document.body.removeEventListener('touchmove', TouchMove);
      document.body.removeEventListener('touchend', TouchEnd);
      document.body.removeEventListener('touchcancel', TouchEnd);

      R = false;
    }
  };
  return t;
}

function M(e) {
  A.x = e.clientX;
  A.y = e.clientY;
  processInteraction();
}

function processInteraction() {
  for (const [elem, t] of b) {
    const i = elem.getBoundingClientRect();
    if (D(i)) {
      P(t, i);
      if (!t.hover) {
        t.hover = true;
        t.onEnter(t);
      }
      t.onMove(t);
    } else if (t.hover && !t.touching) {
      t.hover = false;
      t.onLeave(t);
    }
  }
}

function C(e) {
  A.x = e.clientX;
  A.y = e.clientY;
  for (const [elem, t] of b) {
    const i = elem.getBoundingClientRect();
    P(t, i);
    if (D(i)) t.onClick(t);
  }
}

function L() {
  for (const t of b.values()) {
    if (t.hover) {
      t.hover = false;
      t.onLeave(t);
    }
  }
}

function TouchStart(e) {
  if (e.touches.length > 0) {
    A.x = e.touches[0].clientX;
    A.y = e.touches[0].clientY;

    for (const [elem, t] of b) {
      const rect = elem.getBoundingClientRect();
      if (D(rect)) {
        t.touching = true;
        P(t, rect);
        if (!t.hover) {
          t.hover = true;
          t.onEnter(t);
        }
        t.onMove(t);
      }
    }
  }
}

function TouchMove(e) {
  if (e.touches.length > 0) {
    A.x = e.touches[0].clientX;
    A.y = e.touches[0].clientY;

    for (const [elem, t] of b) {
      const rect = elem.getBoundingClientRect();
      P(t, rect);

      if (D(rect)) {
        if (!t.hover) {
          t.hover = true;
          t.touching = true;
          t.onEnter(t);
        }
        t.onMove(t);
      } else if (t.hover && t.touching) {
        t.onMove(t);
      }
    }
  }
}

function TouchEnd() {
  for (const [, t] of b) {
    if (t.touching) {
      t.touching = false;
      if (t.hover) {
        t.hover = false;
        t.onLeave(t);
      }
    }
  }
}

function P(e, t) {
  const { position: i, nPosition: s } = e;
  i.x = A.x - t.left;
  i.y = A.y - t.top;
  s.x = (i.x / t.width) * 2 - 1;
  s.y = (-i.y / t.height) * 2 + 1;
}
function D(e) {
  const { x: t, y: i } = A;
  const { left: s, top: n, width: o, height: r } = e;
  return t >= s && t <= s + o && i >= n && i <= n + r;
}

const { randFloat: k, randFloatSpread: E } = o;
const F = new a();
const I = new a();
const O = new a();
const V = new a();
const B = new a();
const N = new a();
const _ = new a();
const j = new a();
const H = new a();
const T = new a();

class W {
  constructor(e) {
    this.config = e;
    this.positionData = new Float32Array(3 * e.count).fill(0);
    this.velocityData = new Float32Array(3 * e.count).fill(0);
    this.sizeData = new Float32Array(e.count).fill(1);
    this.center = new a();
    this.#R();
    this.setSizes();
  }
  #R() {
    const { config: e, positionData: t, velocityData: v } = this;
    this.center.toArray(t, 0);
    const minSpd = e.minVelocity ?? 0.006;
    const maxSpd = e.maxVelocity ?? 0.02;
    for (let i = 1; i < e.count; i++) {
      const s = 3 * i;
      t[s] = E(2 * e.maxX);
      t[s + 1] = E(2 * e.maxY);
      t[s + 2] = E(2 * (e.maxZ ?? 2));

      // Initial smooth slow random drift velocities in 3D
      const speed = k(minSpd, maxSpd);
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      v[s] = speed * Math.cos(phi) * Math.cos(theta);
      v[s + 1] = speed * Math.cos(phi) * Math.sin(theta);
      v[s + 2] = speed * Math.sin(phi) * 0.35;
    }
  }
  setSizes() {
    const { config: e, sizeData: t } = this;
    t[0] = e.size0;
    for (let i = 1; i < e.count; i++) {
      t[i] = k(e.minSize, e.maxSize);
    }
  }
  update(e) {
    const { config: t, center: i, positionData: s, sizeData: n, velocityData: o } = this;
    let r = 0;
    if (t.controlSphere0) {
      r = 1;
      F.fromArray(s, 0);
      F.lerp(i, 0.1).toArray(s, 0);
      V.set(0, 0, 0).toArray(o, 0);
    }

    // 1. Velocity & Position Update
    for (let idx = r; idx < t.count; idx++) {
      const base = 3 * idx;
      I.fromArray(s, base);
      B.fromArray(o, base);

      if (t.gravity !== 0) {
        B.y -= e.delta * t.gravity * n[idx];
        B.multiplyScalar(t.friction);
        B.clampLength(0, t.maxVelocity);
      } else {
        // Zero-gravity: keep balls smoothly and slowly cruising without decaying to a standstill
        const minSpeed = t.minVelocity ?? 0.006;
        const maxSpeed = t.maxVelocity ?? 0.02;
        const currentSpeed = B.length();

        if (currentSpeed < minSpeed) {
          if (currentSpeed > 0.0001) {
            B.multiplyScalar(minSpeed / currentSpeed);
          } else {
            const theta = Math.random() * Math.PI * 2;
            B.set(Math.cos(theta) * minSpeed, Math.sin(theta) * minSpeed, E(minSpeed * 0.3));
          }
        } else if (currentSpeed > maxSpeed) {
          B.multiplyScalar(maxSpeed / currentSpeed);
        }
      }

      I.add(B);
      I.toArray(s, base);
      B.toArray(o, base);
    }

    // 2. Smooth, Physically Realistic Sphere Collisions
    for (let idx = r; idx < t.count; idx++) {
      const base = 3 * idx;
      I.fromArray(s, base);
      B.fromArray(o, base);
      const radius = n[idx];

      for (let jdx = idx + 1; jdx < t.count; jdx++) {
        const otherBase = 3 * jdx;
        O.fromArray(s, otherBase);
        N.fromArray(o, otherBase);
        const otherRadius = n[jdx];

        _.copy(O).sub(I);
        const dist = _.length();
        const sumRadius = radius + otherRadius;

        if (dist < sumRadius && dist > 0.0001) {
          const overlap = sumRadius - dist;
          j.copy(_).normalize();

          // Positional separation to prevent overlapping/clumping
          const halfOverlap = 0.5 * overlap;
          I.addScaledVector(j, -halfOverlap);
          O.addScaledVector(j, halfOverlap);

          // Soft elastic impulse along normal
          const vRelNorm = (B.x - N.x) * j.x + (B.y - N.y) * j.y + (B.z - N.z) * j.z;

          if (vRelNorm > 0) {
            const restitution = t.gravity === 0 ? 0.98 : (t.restitution ?? 0.95);
            const impulse = 0.5 * (1 + restitution) * vRelNorm;
            B.addScaledVector(j, -impulse);
            N.addScaledVector(j, impulse);
          }

          I.toArray(s, base);
          B.toArray(o, base);
          O.toArray(s, otherBase);
          N.toArray(o, otherBase);
        }
      }

      // Cursor interaction
      if (t.controlSphere0) {
        _.copy(F).sub(I);
        const dist = _.length();
        const sumRadius0 = radius + n[0];
        if (dist < sumRadius0 && dist > 0.0001) {
          const diff = sumRadius0 - dist;
          j.copy(_).normalize();
          I.addScaledVector(j, -diff);
          B.addScaledVector(j, -Math.max(B.length(), 0.02) * 1.2);
        }
      }

      // 3. Smooth Boundary Deflection
      if (Math.abs(I.x) + radius > t.maxX) {
        I.x = Math.sign(I.x) * (t.maxX - radius);
        B.x = -B.x * (t.gravity === 0 ? 1 : t.wallBounce);
      }
      if (Math.abs(I.y) + radius > t.maxY) {
        I.y = Math.sign(I.y) * (t.maxY - radius);
        B.y = -B.y * (t.gravity === 0 ? 1 : t.wallBounce);
      }
      const maxBoundary = Math.max(t.maxZ ?? 2, t.maxSize);
      if (Math.abs(I.z) + radius > maxBoundary) {
        I.z = Math.sign(I.z) * (maxBoundary - radius);
        B.z = -B.z * (t.gravity === 0 ? 1 : t.wallBounce);
      }

      I.toArray(s, base);
      B.toArray(o, base);
    }
  }
}

class Y extends c {
  constructor(e) {
    super(e);
    this.uniforms = {
      thicknessDistortion: { value: 0.1 },
      thicknessAmbient: { value: 0 },
      thicknessAttenuation: { value: 0.1 },
      thicknessPower: { value: 2 },
      thicknessScale: { value: 10 }
    };
    this.defines.USE_UV = '';
    this.onBeforeCompile = e => {
      Object.assign(e.uniforms, this.uniforms);
      e.fragmentShader =
        '\n        uniform float thicknessPower;\n        uniform float thicknessScale;\n        uniform float thicknessDistortion;\n        uniform float thicknessAmbient;\n        uniform float thicknessAttenuation;\n      ' +
        e.fragmentShader;
      e.fragmentShader = e.fragmentShader.replace(
        'void main() {',
        '\n        void RE_Direct_Scattering(const in IncidentLight directLight, const in vec2 uv, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, inout ReflectedLight reflectedLight) {\n          vec3 scatteringHalf = normalize(directLight.direction + (geometryNormal * thicknessDistortion));\n          float scatteringDot = pow(saturate(dot(geometryViewDir, -scatteringHalf)), thicknessPower) * thicknessScale;\n          #ifdef USE_COLOR\n            vec3 scatteringIllu = (scatteringDot + thicknessAmbient) * vColor.rgb;\n          #else\n            vec3 scatteringIllu = (scatteringDot + thicknessAmbient) * diffuse;\n          #endif\n          reflectedLight.directDiffuse += scatteringIllu * thicknessAttenuation * directLight.color;\n        }\n\n        void main() {\n      '
      );
      const t = h.lights_fragment_begin.replaceAll(
        'RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );',
        '\n          RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n          RE_Direct_Scattering(directLight, vUv, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, reflectedLight);\n        '
      );
      e.fragmentShader = e.fragmentShader.replace('#include <lights_fragment_begin>', t);
      if (this.onBeforeCompile2) this.onBeforeCompile2(e);
    };
  }
}

export const AWARAA_BALLPIT_COLORS = ["#FF5E1E", "#FDE047", "#88C057", "#FF6B8B", "#111827"];

const X = {
  count: 75,
  colors: AWARAA_BALLPIT_COLORS,
  ambientColor: 16777215,
  ambientIntensity: 1.25,
  lightIntensity: 190,
  materialParams: {
    metalness: 0.5,
    roughness: 0.5,
    clearcoat: 1,
    clearcoatRoughness: 0.15
  },
  minSize: 0.45,
  maxSize: 1.15,
  size0: 1,
  gravity: 0,
  friction: 0.998,
  wallBounce: 0.98,
  maxVelocity: 0.018,
  minVelocity: 0.006,
  maxX: 5,
  maxY: 5,
  maxZ: 2,
  controlSphere0: false,
  followCursor: true
};

const U = new m();

class Z extends d {
  constructor(e, t = {}) {
    const i = { ...X, ...t };
    const s = new z();
    const pmrem = new p(e, 0.04);
    const n = pmrem.fromScene(s).texture;
    pmrem.dispose();
    const o = new g();
    const r = new Y({ envMap: n, ...i.materialParams });
    r.envMapRotation.x = -Math.PI / 2;
    super(o, r, i.count);
    this.config = i;
    this.physics = new W(i);
    this.#S();
    this.setColors(i.colors);
  }
  #S() {
    this.ambientLight = new f(this.config.ambientColor, this.config.ambientIntensity);
    this.add(this.ambientLight);
    this.light = new u(this.config.colors[0], this.config.lightIntensity);
    this.add(this.light);
  }
  setColors(e) {
    if (Array.isArray(e) && e.length > 1) {
      const t = (function (e) {
        let t, i;
        function setColors(e) {
          t = e;
          i = [];
          t.forEach(col => {
            i.push(new l(col));
          });
        }
        setColors(e);
        return {
          setColors,
          getColorAt: function (ratio, out = new l()) {
            const scaled = Math.max(0, Math.min(1, ratio)) * (t.length - 1);
            const idx = Math.floor(scaled);
            const start = i[idx];
            if (idx >= t.length - 1) return start.clone();
            const alpha = scaled - idx;
            const end = i[idx + 1];
            out.r = start.r + alpha * (end.r - start.r);
            out.g = start.g + alpha * (end.g - start.g);
            out.b = start.b + alpha * (end.b - start.b);
            return out;
          }
        };
      })(e);
      for (let idx = 0; idx < this.count; idx++) {
        this.setColorAt(idx, t.getColorAt(idx / this.count));
        if (idx === 0) {
          this.light.color.copy(t.getColorAt(idx / this.count));
        }
      }
      this.instanceColor.needsUpdate = true;
    }
  }
  update(e) {
    this.physics.update(e);
    for (let idx = 0; idx < this.count; idx++) {
      U.position.fromArray(this.physics.positionData, 3 * idx);
      if (idx === 0) {
        if (!this.config.controlSphere0 || this.config.followCursor === false) {
          U.scale.setScalar(0);
        } else {
          U.scale.setScalar(this.physics.sizeData[0]);
        }
      } else {
        U.scale.setScalar(this.physics.sizeData[idx]);
      }
      U.updateMatrix();
      this.setMatrixAt(idx, U.matrix);
      if (idx === 0) this.light.position.copy(U.position);
    }
    this.instanceMatrix.needsUpdate = true;
  }
}

function isWebGLSupported() {
  if (typeof window === 'undefined') return false;
  try {
    const testCanvas = document.createElement('canvas');
    const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
    if (!gl) return false;
    const precision = gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT);
    return Boolean(precision && precision.precision > 0);
  } catch {
    return false;
  }
}

function createBallpit(e, t = {}) {
  if (!isWebGLSupported()) return null;

  const i = new x({
    canvas: e,
    size: 'parent',
    rendererOptions: { antialias: true, alpha: true }
  });
  let s;
  i.renderer.toneMapping = v;
  i.camera.position.set(0, 0, 20);
  i.camera.lookAt(0, 0, 0);
  i.cameraMaxAspect = 1.5;
  i.resize();
  initialize({
    maxX: i.size.wWidth ? i.size.wWidth / 2 : 12,
    maxY: i.size.wHeight ? i.size.wHeight / 2 : 8,
    ...t
  });
  i.onAfterResize = e => {
    if (s) {
      s.config.maxX = e.wWidth / 2;
      s.config.maxY = e.wHeight / 2;
    }
  };
  i.onAfterResize(i.size);
  const n = new y();
  const o = new w(new a(0, 0, 1), 0);
  const r = new a();
  let c = false;

  e.style.touchAction = 'none';
  e.style.userSelect = 'none';
  e.style.webkitUserSelect = 'none';

  const h = S({
    domElement: e,
    onMove() {
      n.setFromCamera(h.nPosition, i.camera);
      i.camera.getWorldDirection(o.normal);
      n.ray.intersectPlane(o, r);
      if (s) {
        s.physics.center.copy(r);
        s.config.controlSphere0 = true;
      }
    },
    onLeave() {
      if (s) s.config.controlSphere0 = false;
    }
  });
  function initialize(e) {
    if (s) {
      i.clear();
      i.scene.remove(s);
    }
    s = new Z(i.renderer, e);
    i.scene.add(s);
  }
  i.onBeforeRender = e => {
    if (!c && s) s.update(e);
  };
  i.onAfterResize = e => {
    if (s) {
      s.config.maxX = e.wWidth / 2;
      s.config.maxY = e.wHeight / 2;
    }
  };
  return {
    three: i,
    get spheres() {
      return s;
    },
    setCount(e) {
      initialize({ ...s?.config, count: e });
    },
    updateConfig(newProps) {
      if (!s) return;
      if (newProps.count !== undefined && newProps.count !== s.config.count) {
        initialize({ ...s.config, ...newProps });
      } else {
        Object.assign(s.config, newProps);
        if (newProps.colors) {
          s.setColors(s.config.colors);
        }
        if (newProps.minSize !== undefined || newProps.maxSize !== undefined || newProps.size0 !== undefined) {
          s.physics.setSizes();
        }
      }
    },
    togglePause() {
      c = !c;
    },
    dispose() {
      h.dispose();
      i.dispose();
    }
  };
}

const Ballpit = ({ className = '', followCursor = true, ...props }) => {
  const containerRef = useRef(null);
  const spheresInstanceRef = useRef(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isWebGLSupported()) return;

    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    try {
      spheresInstanceRef.current = createBallpit(canvas, { followCursor, ...props });
    } catch (err) {
      console.error('Failed to initialize Ballpit:', err);
    }

    return () => {
      if (spheresInstanceRef.current) {
        spheresInstanceRef.current.dispose();
        spheresInstanceRef.current = null;
      }
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (spheresInstanceRef.current) {
      spheresInstanceRef.current.updateConfig({ followCursor, ...props });
    }
  }, [props, followCursor]);

  return (
    <div
      className={className}
      ref={containerRef}
      style={{ width: '100%', height: '100%', overflow: 'hidden' }}
    />
  );
};

export const BallpitBackground = ({ className = '', ...props }) => {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 z-0 overflow-hidden pointer-events-none ${className}`}
    >
      <Ballpit {...props} />
    </div>
  );
};

export default Ballpit;
