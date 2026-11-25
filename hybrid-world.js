export function addHybridWorld(T, scene) {
  const metal = new T.MeshStandardMaterial({ color: 0x35476e, metalness: .9, roughness: .2 });
  const dark = new T.MeshStandardMaterial({ color: 0x101a32, metalness: .48, roughness: .28 });
  const glass = new T.MeshPhysicalMaterial({ color: 0x8fefff, metalness: .08, roughness: .08, transmission: .72, transparent: true, opacity: .22, thickness: .22, depthWrite: false });
  const glow = new T.MeshStandardMaterial({ color: 0x67e7f5, emissive: 0x1c9ebc, emissiveIntensity: 1.45, metalness: .25, roughness: .24 });
  const stone = new T.MeshStandardMaterial({ color: 0x283958, metalness: .38, roughness: .3 });
  const white = new T.MeshStandardMaterial({ color: 0xc4d2ed, metalness: .24, roughness: .34 });
  const animated = [];
  const box = (parent, w, h, d, material, x, y, z) => {
    const mesh = new T.Mesh(new T.BoxGeometry(w, h, d), material);
    mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
  };
  const tube = (parent, points, radius, material, name) => {
    const curve = new T.CatmullRomCurve3(points.map(p => new T.Vector3(...p)));
    const mesh = new T.Mesh(new T.TubeGeometry(curve, 72, radius, 10, false), material);
    if (name) mesh.name = name;
    mesh.castShadow = true; parent.add(mesh); return mesh;
  };
  const cylinder = (parent, radiusTop, radiusBottom, height, material, x, y, z) => {
    const mesh = new T.Mesh(new T.CylinderGeometry(radiusTop, radiusBottom, height, 48), material);
    mesh.position.set(x, y, z); mesh.castShadow = true; parent.add(mesh); return mesh;
  };

  // A suspended library promenade: layered galleries make the atrium feel like a place, not a flat showroom.
  for (const side of [-1, 1]) {
    const x = side * 12.25;
    box(scene, 2.35, .34, 19.2, stone, x, 5.45, -5.2);
    box(scene, 2.48, .08, 19.35, metal, x, 5.67, -5.2);
    box(scene, 2.12, .025, 18.9, glow, x, 5.72, -5.2);
    box(scene, .07, .86, 19.05, glass, side * 11.18, 6.08, -5.2);
    box(scene, .055, .08, 19.1, glow, side * 11.18, 6.52, -5.2);
    // Repeated vertical fins recall monumental library stacks and a futuristic city facade.
    for (let i = 0; i < 13; i++) {
      const z = -14 + i * 1.48;
      box(scene, .18, 5.1, .18, metal, side * 14.1, 2.75, z);
      box(scene, .055, 4.55, .055, glow, side * 14.1, 2.78, z + .13);
      box(scene, .9, .09, .24, dark, side * 13.55, 1.0 + (i % 3) * .12, z);
      box(scene, .9, .07, .24, dark, side * 13.55, 2.05 + (i % 2) * .12, z);
      box(scene, .9, .07, .24, dark, side * 13.55, 3.1 + (i % 3) * .1, z);
    }
    // Glass lift towers on both sides of the upper promenade.
    const liftX = side * 10.7;
    box(scene, 1.15, 5.8, 1.25, glass, liftX, 3.0, -1.2);
    for (const dx of [-.62, .62]) box(scene, .07, 6.0, 1.38, metal, liftX + dx, 3.0, -1.2);
    box(scene, .92, 4.9, .035, glow, liftX, 3.0, -.55);
    for (let y = .65; y < 5.8; y += .85) box(scene, 1.1, .025, 1.3, metal, liftX, y, -1.2);
  }

  // The central skybridge joins the two galleries above the main promenade.
  const bridge = new T.Group(); bridge.position.set(0, 6.0, -6.4); scene.add(bridge);
  box(bridge, 21.8, .24, 1.5, dark, 0, 0, 0);
  box(bridge, 21.5, .045, 1.38, white, 0, .15, 0);
  box(bridge, 21.55, .035, .055, glow, 0, .19, .66);
  for (const side of [-1, 1]) {
    box(bridge, 21.7, .78, .035, glass, 0, .54, side * .7);
    box(bridge, 21.7, .065, .065, metal, 0, .95, side * .7);
    box(bridge, 21.7, .025, .07, glow, 0, .99, side * .7);
  }
  for (let x = -10; x <= 10; x += 2) box(bridge, .035, .72, 1.48, metal, x, .52, 0);

  // Library-inspired monumental arches frame the central atrium.
  for (let i = 0; i < 5; i++) {
    const z = -13.5 + i * 4.25;
    const w = 11.8 - i * .35;
    tube(scene, [[-w, .15, z], [-w, 3.8, z], [-w * .72, 7.2, z], [0, 8.25, z], [w * .72, 7.2, z], [w, 3.8, z], [w, .15, z]], .085, i % 2 ? glow : metal, 'nirvo-gallery-arch-' + i);
    box(scene, w * 2, .09, .18, metal, 0, .2, z);
  }

  // A distant vertical skyline beyond the rear gallery creates the "city inside a library" illusion.
  for (let i = 0; i < 9; i++) {
    const x = -16 + i * 4;
    const height = 5.5 + (i % 4) * 1.35;
    const z = -21.2 - (i % 2) * .9;
    box(scene, 2.35, height, .72, dark, x, height / 2 - .1, z);
    box(scene, 2.42, .07, .82, metal, x, height - .12, z);
    box(scene, 2.12, height - .5, .035, glass, x, height / 2, z + .39);
    for (let y = .65; y < height - .35; y += .72) {
      box(scene, 1.9, .025, .025, glow, x, y, z + .415);
    }
    const beacon = new T.PointLight(i % 2 ? 0x67e7f5 : 0x5148e8, 2.1, 5);
    beacon.position.set(x, height - .2, z + .8); scene.add(beacon);
    animated.push({ light: beacon, phase: i * .8, base: 1.4 + (i % 3) * .45 });
  }

  // Floating orbital sculpture and a concentric halo above the skybridge.
  const orbit = new T.Group(); orbit.position.set(0, 9.1, -5.8); scene.add(orbit);
  for (let i = 0; i < 4; i++) {
    const ring = new T.Mesh(new T.TorusGeometry(2.8 + i * .62, .026, 10, 128), i % 2 ? glow : metal);
    ring.rotation.x = Math.PI / 2 + (i % 2 ? .12 : -.12);
    ring.rotation.y = i * .32; orbit.add(ring);
  }
  const core = new T.Mesh(new T.IcosahedronGeometry(.34, 2), new T.MeshPhysicalMaterial({ color: 0x8fefff, emissive: 0x167b9c, emissiveIntensity: 1.2, metalness: .4, roughness: .15 }));
  orbit.add(core); animated.push({ orbit, phase: 0 });

  // Floor compass: subtle concentric inlays guide visitors toward the destination portals.
  for (let i = 0; i < 5; i++) {
    const ring = new T.Mesh(new T.TorusGeometry(2.1 + i * .72, .018, 8, 120), i % 2 ? metal : glow);
    ring.rotation.x = Math.PI / 2; ring.position.set(0, -.205 + i * .002, -5.5); scene.add(ring);
  }
  for (let x = -9; x <= 9; x += 3) {
    box(scene, .035, .012, 13.5, glow, x, -.19, -5.3);
  }

  // Sculptural vertical book-spine lights and ceiling ribs add the library scale overhead.
  for (let i = 0; i < 17; i++) {
    const x = -15.2 + i * 1.9;
    const rib = new T.Mesh(new T.CylinderGeometry(.035, .09, 7.8, 12), i % 3 ? metal : glow);
    rib.position.set(x, 7.15, -17.4); rib.rotation.z = (i % 2 ? .025 : -.025); scene.add(rib);
  }

  function update(time) {
    orbit.rotation.y = time * .075;
    orbit.rotation.z = Math.sin(time * .22) * .035;
    animated.forEach(item => {
      if (item.light) item.light.intensity = item.base + Math.sin(time * 1.35 + item.phase) * .65;
    });
  }
  return { update };
}
