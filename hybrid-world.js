export function addHybridWorld(T, scene) {
  // Photorealistic architectural language: honed stone, smoked glass, champagne metal and warm architectural light.
  const limestone = new T.MeshStandardMaterial({ color: 0xaaa69d, roughness: .78, metalness: .02 });
  const ivory = new T.MeshStandardMaterial({ color: 0xd1cbc0, roughness: .62, metalness: .02 });
  const concrete = new T.MeshStandardMaterial({ color: 0x55565a, roughness: .82, metalness: .05 });
  const bronze = new T.MeshStandardMaterial({ color: 0x78664c, roughness: .28, metalness: .82 });
  const darkBronze = new T.MeshStandardMaterial({ color: 0x292824, roughness: .34, metalness: .72 });
  const glass = new T.MeshPhysicalMaterial({ color: 0x9eabb1, roughness: .08, metalness: .12, transmission: .72, transparent: true, opacity: .2, thickness: .3, depthWrite: false });
  const warmLight = new T.MeshStandardMaterial({ color: 0xffe8c7, emissive: 0xffd6a0, emissiveIntensity: .48, roughness: .4 });
  const dark = new T.MeshStandardMaterial({ color: 0x181a1c, roughness: .58, metalness: .24 });
  const addBox = (p,w,h,d,m,x,y,z) => {
    const o = new T.Mesh(new T.BoxGeometry(w,h,d),m);
    o.position.set(x,y,z); o.castShadow = true; o.receiveShadow = true; p.add(o); return o;
  };
  const addPoint = (x,y,z,intensity=2.1,distance=10) => {
    const l = new T.PointLight(0xffdfb7,intensity,distance,2); l.position.set(x,y,z); scene.add(l); return l;
  };

  // Tall limestone-clad side walls anchor the room like a real flagship interior.
  for (const side of [-1,1]) {
    addBox(scene,.62,8.2,32,limestone,side*16.9,3.9,-4);
    addBox(scene,.08,8.2,32,darkBronze,side*16.55,3.9,-4);
    // Fine champagne-bronze pilasters, restrained and evenly spaced.
    for (let z=-18;z<=10;z+=7) {
      addBox(scene,.16,7.8,.24,bronze,side*15.95,3.85,z);
      addBox(scene,.035,7.45,.035,ivory,side*15.84,3.85,z);
    }
    // Upper mezzanine with a continuous smoked-glass balustrade.
    addBox(scene,3.0,.38,25,concrete,side*12.1,5.55,-5);
    addBox(scene,3.05,.075,25.1,bronze,side*12.1,5.79,-5);
    addBox(scene,2.92,.025,24.7,ivory,side*12.1,5.84,-5);
    addBox(scene,.055,.92,24.7,glass,side*10.62,6.28,-5);
    addBox(scene,.07,.075,24.8,bronze,side*10.62,6.78,-5);
    // Structural piers and recessed display niches.
    for(let z=-16;z<=8;z+=6) {
      addBox(scene,.5,5.2,.7,limestone,side*13.85,2.6,z);
      addBox(scene,.035,4.3,.035,bronze,side*13.56,2.75,z);
      addBox(scene,1.4,.09,.58,dark,side*14.8,1.1,z);
      addBox(scene,1.4,.06,.58,dark,side*14.8,2.25,z);
      addBox(scene,1.4,.06,.58,dark,side*14.8,3.4,z);
    }
    // Warm linear coves, concealed in the mezzanine soffit.
    addBox(scene,.045,.035,23,warmLight,side*10.72,5.32,-5);
    for(let z=-14;z<=6;z+=5) addPoint(side*11.8,5.1,z,1.25,7);
  }

  // A restrained bridge: stone soffit, bronze handrail and clear glass panels.
  addBox(scene,21.2,.34,1.9,concrete,0,6.12,-6.5);
  addBox(scene,21.0,.045,1.72,ivory,0,6.31,-6.5);
  for(const side of [-1,1]) {
    addBox(scene,21.05,.92,.035,glass,0,6.82,-6.5+side*.88);
    addBox(scene,21.1,.065,.07,bronze,0,7.3,-6.5+side*.88);
    for(let x=-10;x<=10;x+=2.5) addBox(scene,.025,.82,.035,darkBronze,x,6.8,-6.5+side*.88);
  }

  // A calm, coffered ceiling with recessed linear lighting; no floating sci-fi objects.
  addBox(scene,34,.42,32,concrete,0,8.15,-4);
  for(let x=-14;x<=14;x+=4.7) {
    addBox(scene,.13,.24,30,darkBronze,x,7.82,-4);
    addBox(scene,.035,.025,27,warmLight,x,7.67,-4);
  }
  for(let z=-17;z<=8;z+=6) {
    addBox(scene,31,.12,.16,darkBronze,0,7.88,z);
    addBox(scene,27,.025,.035,warmLight,0,7.8,z);
  }

  // Rear feature wall in book-matched stone, with quiet bronze reveals.
  addBox(scene,33,8.4,.65,limestone,0,3.9,-20.2);
  for(let x=-14;x<=14;x+=4.7) {
    addBox(scene,.045,7.6,.035,bronze,x,3.9,-19.84);
  }
  addBox(scene,32,.12,.1,darkBronze,0,7.65,-19.8);
  addBox(scene,32,.035,.045,warmLight,0,7.57,-19.72);

  // Vertical timber fins soften the long elevations and add a crafted, hotel-like finish.
  const timber = new T.MeshStandardMaterial({color:0x89949a,roughness:.72,metalness:.02});
  for(const side of [-1,1]) {
    for(let i=0;i<13;i++) {
      const z=-16+i*2.55;
      addBox(scene,.075,4.8,.13,timber,side*15.55,2.8,z);
    }
  }

  // A few warm pools of light make the marble floor and product displays read naturally.
  for(const x of [-8,0,8]) addPoint(x,6.8,-5,0.85,8);
  function update() {}
  return { update };
}
