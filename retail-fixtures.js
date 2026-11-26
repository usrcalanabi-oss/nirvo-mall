export function addRetailFixtures(T,s,b,cy){
 const metal=new T.MeshStandardMaterial({color:'#75644e',metalness:.78,roughness:.28});
 const darkMetal=new T.MeshStandardMaterial({color:'#282725',metalness:.35,roughness:.48});
 const stone=new T.MeshStandardMaterial({color:'#d2c9ba',metalness:.04,roughness:.55});
 const inner=new T.MeshStandardMaterial({color:'#393631',metalness:.12,roughness:.52});
 const glass=new T.MeshPhysicalMaterial({color:'#c6c8c4',metalness:.02,roughness:.09,transparent:true,opacity:.12,transmission:.82,thickness:.22,ior:1.45,depthWrite:false});
 const cyan=new T.MeshStandardMaterial({color:'#b69b72',roughness:.35,metalness:.55});
 const softGlow=new T.MeshStandardMaterial({color:'#d9c7a7',emissive:'#b9874b',emissiveIntensity:.22,roughness:.38});
 const brass=new T.MeshStandardMaterial({color:'#a68a5e',metalness:.88,roughness:.24});
 function box(p,w,h,d,m,x,y,z,bevel=0){const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;p.add(o);return o}
 function tube(p,a,c,h,m,x,y,z){const o=new T.Mesh(new T.CylinderGeometry(a,c,h,32),m);o.position.set(x,y,z);o.castShadow=true;p.add(o);return o}
 function strip(p,w,h,d,m,x,y,z){return box(p,w,h,d,m,x,y,z)}
 function counter(x,z,wide=3.25){
   const g=new T.Group();g.position.set(x,0,z);s.add(g);
   box(g,wide,.76,1.08,stone,0,.43,0);
   box(g,wide+.08,.12,1.16,metal,0,.86,0);
   box(g,wide-.2,.035,.9,softGlow,0,.925,.02);
   box(g,wide-.24,.055,.84,inner,0,.79,0);
   // inset front panels, fine metal reveals and corner guards
   for(let k=-1;k<=1;k++){box(g,.88,.43,.035,inner,k*.98,.43,.555);box(g,.82,.012,.018,brass,k*.98,.65,.578);box(g,.82,.012,.018,brass,k*.98,.21,.578)}
   for(let x2 of [-wide/2+.06,wide/2-.06]){box(g,.045,.7,.05,brass,x2,.43,.57);box(g,.045,.7,.05,brass,x2,.43,-.57)}
   box(g,wide-.22,.035,.04,cyan,0,.12,.575);
   // glass display top with fine rails
   box(g,wide-.24,.025,.82,glass,0,1.02,0);
   for(let xx of [-wide/2+.13,wide/2-.13])for(let zz of [-.42,.42])box(g,.035,.18,.035,metal,xx,1.1,zz);
   box(g,wide-.22,.025,.84,glass,0,1.19,0);
   box(g,wide-.18,.018,.04,softGlow,0,1.205,.42);
   return g;
 }
 function wallRack(x,z,flip=1){
   const g=new T.Group();g.position.set(x,0,z);g.rotation.y=flip===1?0:Math.PI;s.add(g);
   // floating backboard and layered shelves
   box(g,2.8,3.05,.12,inner,0,1.72,0);
   box(g,2.92,.055,.16,metal,0,3.28,.02);
   box(g,2.82,.025,.035,softGlow,0,3.23,.105);
   for(let level=0;level<3;level++){
     const y=.72+level*.92;
     box(g,2.68,.105,.58,stone,0,y,.35);
     box(g,2.72,.035,.62,metal,0,y+.07,.35);
     box(g,2.55,.018,.025,cyan,0,y+.095,.66);
     for(let xx of [-1.18,1.18]){box(g,.075,.34,.1,brass,xx,y+.2,.13);box(g,.13,.045,.24,metal,xx,y+.37,.35)}
     // individual lit product bays
     for(let j=0;j<5;j++){let xx=-1.02+j*.51;box(g,.025,.44,.025,brass,xx,y+.31,.19)}
   }
   for(let xx of [-1.35,1.35])box(g,.06,3.18,.16,metal,xx,1.7,.03);
   box(g,2.9,.08,.25,metal,0,.14,.12);
 }
 function vitrine(x,z,w=1.9){
   const g=new T.Group();g.position.set(x,0,z);s.add(g);
   box(g,w,.16,1.12,metal,0,.88,0);
   box(g,w-.12,.055,1.02,stone,0,.99,0);
   // four glass walls, separate panels keep edges crisp
   box(g,w-.18,.72,.025,glass,0,1.38,-.48);
   box(g,w-.18,.72,.025,glass,0,1.38,.48);
   box(g,.025,.72,.94,glass,-w/2+.09,1.38,0);
   box(g,.025,.72,.94,glass,w/2-.09,1.38,0);
   for(let xx of [-w/2+.07,w/2-.07])for(let zz of [-.49,.49])box(g,.045,.79,.045,metal,xx,1.38,zz);
   box(g,w,.055,1.14,metal,0,1.78,0);
   box(g,w-.08,.022,1.02,softGlow,0,1.815,.02);
   // internal glass shelf and illuminated pedestal
   box(g,w-.26,.025,.78,glass,0,1.37,0);
   tube(g,.19,.24,.38,stone,0,1.16,0);
   tube(g,.24,.24,.035,cyan,0,1.37,0);
   box(g,w-.14,.06,1.08,inner,0,.48,0);
   for(let xx of [-.58,.58])box(g,.035,.38,.035,brass,xx,.48,.57);
 }
 function island(x,z){
   const g=new T.Group();g.position.set(x,0,z);s.add(g);
   tube(g,.9,1,.14,metal,0,.1,0);tube(g,.76,.76,.62,stone,0,.47,0);tube(g,.82,.82,.075,metal,0,.82,0);
   tube(g,.72,.72,.025,softGlow,0,.87,0);
   tube(g,.61,.61,.035,inner,0,.9,0);
   for(let a=0;a<4;a++){const ang=a*Math.PI/2;let x1=Math.cos(ang)*.78,z1=Math.sin(ang)*.78;box(g,.035,.48,.035,brass,x1,.48,z1)}
   // floating halo ring above the product platform
   const ring=new T.Mesh(new T.TorusGeometry(.52,.009,8,72),brass);ring.rotation.x=Math.PI/2;ring.position.y=1.18;g.add(ring);
 }
 function ceilingPendant(x,z){
   const g=new T.Group();g.position.set(x,7.65,z);s.add(g);
   tube(g,.012,.012,1.25,metal,0,-.62,0);
   tube(g,.17,.42,.18,metal,0,-1.34,0);
   tube(g,.34,.34,.025,softGlow,0,-1.45,0);
   const light=new T.PointLight(0xffd8ad,2.2,6);light.position.set(0,-1.5,0);g.add(light);
 }
 // Five distinct boutique interiors: each occupies its own bay along the shared promenade.
 const bayCenters=[-10,-5,0,5,10];
 const bayMats=[
  new T.MeshStandardMaterial({color:'#b9aa94',roughness:.78}),
  new T.MeshStandardMaterial({color:'#332e29',metalness:.24,roughness:.38}),
  new T.MeshStandardMaterial({color:'#c6aaa4',roughness:.68}),
  new T.MeshStandardMaterial({color:'#39413f',metalness:.28,roughness:.34}),
  new T.MeshStandardMaterial({color:'#76563f',roughness:.52})
 ];
 const pale=new T.MeshStandardMaterial({color:'#e1d7c8',roughness:.72});
 const garment=new T.MeshStandardMaterial({color:'#8b7965',roughness:.9});
 const bottleGlass=new T.MeshPhysicalMaterial({color:'#b7c7bf',roughness:.16,metalness:.08,transmission:.5,transparent:true,opacity:.88});
 function bayFloor(x,w,mat){box(s,w,.035,9,mat,x,-.205,-7.1);box(s,w,.025,.06,brass,x,-.18,-11.55);box(s,w,.025,.06,brass,x,-.18,-2.65)}
 function wallPanel(x,w,mat){box(s,w,4.2,.22,mat,x,2,-11.15);box(s,w+.12,.07,.28,brass,x,4.14,-11.12)}
 function mannequin(x,z,scale=1){const g=new T.Group();g.position.set(x,0,z);s.add(g);tube(g,.22,.27,.12,brass,0,.08,0);tube(g,.12,.16,.95,garment,0,.65,0);tube(g,.07,.11,.5,garment,0,1.32,0);tube(g,.09,.09,.13,pale,0,1.65,0);for(let side of [-1,1]){box(g,.09,.75,.1,garment,side*.24,1.05,0);box(g,.11,.78,.12,garment,side*.1,-.28,0)}g.scale.setScalar(scale);return g}
 // 01 Fashion — warm atelier, timber rails, garment forms and soft fitting-room light.
 {const x=bayCenters[0];bayFloor(x,4.65,new T.MeshStandardMaterial({color:'#8d806e',roughness:.88}));wallPanel(x,4.35,new T.MeshStandardMaterial({color:'#786c5c',roughness:.82}));for(let side of [-1,1]){box(s,.12,3.5,.16,brass,x+side*1.88,1.8,-7.2);box(s,1.05,.09,.1,brass,x+side*1.35,3.42,-7.2)}box(s,3.3,.12,.72,pale,x,.62,-5.3);box(s,3.3,.045,.76,brass,x,.7,-5.3);box(s,2.8,.08,.16,brass,x,2.95,-7.1);for(let j=0;j<5;j++){let xx=x-1.15+j*.57;box(s,.035,.9,.035,garment,xx,2.35,-7.1);box(s,.24,.52,.08,[garment,pale,inner][j%3],xx,2.1,-7.1)}mannequin(x-1.25,-4.1,.9);mannequin(x+1.15,-4.1,.9);ceilingPendant(x, -5.2)}
 // 02 Jewellery — dark velvet salon, glass vitrines, fine brass frames and focused points of light.
 {const x=bayCenters[1];bayFloor(x,4.65,new T.MeshStandardMaterial({color:'#282521',roughness:.32}));wallPanel(x,4.35,new T.MeshStandardMaterial({color:'#292622',roughness:.48}));for(let j=0;j<3;j++){let xx=x-1.35+j*1.35;vitrine(xx,-6.1,1.05);let beam=new T.SpotLight(0xffe5bd,10,5,Math.PI/8,.65);beam.position.set(xx,3.8,-5.9);beam.target.position.set(xx,1.2,-6.1);s.add(beam,beam.target)}box(s,3.4,.18,1.0,brass,x,.35,-9.1);box(s,3.25,.65,.84,inner,x,.76,-9.1);box(s,3.4,.045,1.0,glass,x,1.12,-9.1)}
 // 03 Beauty — pale stone apothecary with a long consultation counter and backlit product niches.
 {const x=bayCenters[2];bayFloor(x,4.65,new T.MeshStandardMaterial({color:'#bcaea0',roughness:.62}));wallPanel(x,4.35,new T.MeshStandardMaterial({color:'#b79f96',roughness:.75}));box(s,3.7,.8,1.0,pale,x,.42,-5.2);box(s,3.8,.1,1.08,brass,x,.87,-5.2);for(let level=0;level<3;level++){box(s,3.5,.07,.5,pale,x,1.1+level*.85,-10.55);for(let j=0;j<6;j++){let xx=x-1.42+j*.57;let h=.28+(j%3)*.09;let bottle=new T.Mesh(new T.CylinderGeometry(.075,.09,h,20),j%2? bottleGlass:new T.MeshStandardMaterial({color:'#c5b28f',roughness:.28,metalness:.12}));bottle.position.set(xx,1.28+level*.85+h/2,-10.35);s.add(bottle);cy(s,.085,.085,.045,brass,xx,1.28+level*.85+h,-10.35)}}}
 // 04 Watches — graphite horology gallery, framed watch wall and individual illuminated plinths.
 {const x=bayCenters[3];bayFloor(x,4.65,new T.MeshStandardMaterial({color:'#333936',roughness:.38}));wallPanel(x,4.35,new T.MeshStandardMaterial({color:'#303735',metalness:.2,roughness:.38}));for(let j=0;j<3;j++){let xx=x-1.35+j*1.35;box(s,1.05,2.55,.16,darkMetal,xx,2.05,-10.85);box(s,.92,2.36,.045,glass,xx,2.05,-10.73);box(s,.72,.08,.55,brass,xx,1.0,-9.9);tube(s,.24,.24,.42,pale,xx,1.28,-9.9);let dial=new T.Mesh(new T.CylinderGeometry(.18,.18,.07,40),brass);dial.rotation.x=Math.PI/2;dial.position.set(xx,1.65,-10.55);s.add(dial);let beam=new T.SpotLight(0xffe7c9,7,4,Math.PI/9,.7);beam.position.set(xx,3.8,-9.8);beam.target.position.set(xx,1.5,-10.5);s.add(beam,beam.target)}}
 // 05 Fragrance — intimate scent library with warm timber shelves, alcoves and bottle ledges.
 {const x=bayCenters[4];bayFloor(x,4.65,new T.MeshStandardMaterial({color:'#6f5946',roughness:.72}));wallPanel(x,4.35,new T.MeshStandardMaterial({color:'#604833',roughness:.7}));for(let side of [-1,1]){box(s,.09,3.5,.18,brass,x+side*1.8,1.8,-10.85)}for(let level=0;level<4;level++){box(s,3.35,.09,.58,garment,x,.85+level*.82,-10.5);box(s,3.35,.025,.04,brass,x,.91+level*.82,-10.18);for(let j=0;j<5;j++){let xx=x-1.25+j*.62;let bottle=new T.Mesh(new T.BoxGeometry(.22,.32+(j%2)*.12,.2),new T.MeshPhysicalMaterial({color:j%2?'#b28a61':'#c8b99c',metalness:.12,roughness:.18,transmission:.22,transparent:true,opacity:.92}));bottle.position.set(xx,1.08+level*.82+(j%2)*.06,-10.45);s.add(bottle);box(s,.12,.09,.12,brass,xx,1.28+level*.82,-10.45)}}}
 // Rear wall merchandising bays with framed headers and repeated shelf modules.
 for(let x=-8;x<=8;x+=4){
   box(s,3.05,.12,.86,metal,x,2.08,-15);
   box(s,2.9,.035,.78,stone,x,2.17,-15);
   box(s,2.84,.025,.045,softGlow,x,2.2,-14.57);
   for(let xx of [x-1.42,x+1.42]){box(s,.07,2.25,.09,metal,xx,1.12,-15.1);box(s,.12,.12,.2,brass,xx,2.23,-14.95)}
   for(let level=0;level<2;level++){box(s,2.7,.055,.46,inner,x,.82+level*.82,-14.65);box(s,2.72,.025,.035,cyan,x,.86+level*.82,-14.4)}
 }
 for(let x of [-8,-4,0,4,8])ceilingPendant(x,-3);
 // discreet floor inlays define the circulation route without obstructing the open atrium
 for(let x of [-7.5,7.5]){box(s,.035,.012,15,cyan,x,.012,-5);for(let z of [-11,-7,-3,1])box(s,.16,.018,.16,metal,x,.02,z)}
}
