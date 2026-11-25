export function addRetailFixtures(T,s,b,cy){
 const metal=new T.MeshStandardMaterial({color:'#26385f',metalness:.86,roughness:.2});
 const darkMetal=new T.MeshStandardMaterial({color:'#101a31',metalness:.72,roughness:.27});
 const stone=new T.MeshStandardMaterial({color:'#cbd3e4',metalness:.16,roughness:.31});
 const inner=new T.MeshStandardMaterial({color:'#17243e',metalness:.42,roughness:.3});
 const glass=new T.MeshPhysicalMaterial({color:'#b9efff',metalness:.04,roughness:.055,transparent:true,opacity:.16,transmission:.72,thickness:.18,ior:1.45,depthWrite:false});
 const cyan=new T.MeshBasicMaterial({color:'#67e7f5'});
 const softGlow=new T.MeshStandardMaterial({color:'#67e7f5',emissive:'#2acbe4',emissiveIntensity:1.6,roughness:.22});
 const brass=new T.MeshStandardMaterial({color:'#8c9bc0',metalness:.9,roughness:.19});
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
   const ring=new T.Mesh(new T.TorusGeometry(.52,.018,10,72),cyan);ring.rotation.x=Math.PI/2;ring.position.y=1.18;g.add(ring);
 }
 function ceilingPendant(x,z){
   const g=new T.Group();g.position.set(x,7.65,z);s.add(g);
   tube(g,.012,.012,1.25,metal,0,-.62,0);
   tube(g,.17,.42,.18,metal,0,-1.34,0);
   tube(g,.34,.34,.025,softGlow,0,-1.45,0);
   const light=new T.PointLight(0x67e7f5,5.5,7);light.position.set(0,-1.5,0);g.add(light);
 }
 // Main retail islands and service counters, placed around a wide central promenade.
 counter(-10.1,-2.2,3.35);counter(10.1,-2.2,3.35);
 wallRack(-10.2,-7,1);wallRack(10.2,-7,-1);
 vitrine(-5.05,-2.1,1.95);vitrine(5.05,-2.1,1.95);
 island(-5.1,-6.2);island(5.1,-6.2);
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
