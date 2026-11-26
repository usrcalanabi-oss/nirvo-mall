export function createProductModel(T, category, variant=0) {
 const root=new T.Group();
 const mat=(color,metalness=.1,roughness=.38,extra={})=>new T.MeshStandardMaterial({color,metalness,roughness,...extra});
 const silver=mat('#b8bec2',.88,.2),gold=mat('#c5a36d',.86,.22),dark=mat('#20242a',.35,.28),ivory=mat('#e4ded3',.04,.72),glass=new T.MeshPhysicalMaterial({color:'#c8d9d8',metalness:.04,roughness:.12,transmission:.72,transparent:true,opacity:.9,thickness:.25});
 const add=(geo,m,x,y,z,rx=0,ry=0,rz=0)=>{const o=new T.Mesh(geo,m);o.position.set(x,y,z);o.rotation.set(rx,ry,rz);o.castShadow=true;o.receiveShadow=true;root.add(o);return o};
 const cyl=(r1,r2,h,m,x,y,z,n=48)=>add(new T.CylinderGeometry(r1,r2,h,n),m,x,y,z);
 if(category==='fashion'){
   const fabric=[mat('#d9d2c7',0,.88),mat('#34383b',0,.82),mat('#8c7865',0,.9)][variant%3];
   cyl(.24,.31,.16,gold,0,.08,0);add(new T.CylinderGeometry(.34,.23,.72,8),fabric,0,.52,0);
   add(new T.SphereGeometry(.115,24,18),ivory,0,1.02,0);
   add(new T.CylinderGeometry(.075,.09,.16,20),ivory,0,.96,0);
   for(const side of [-1,1]){add(new T.CylinderGeometry(.055,.075,.62,16),fabric,side*.32,.55,0,0,0,side*.18);add(new T.CylinderGeometry(.07,.055,.72,12),fabric,side*.12,-.18,0)}
   add(new T.CylinderGeometry(.045,.045,.14,16),gold,0,.58,.13,Math.PI/2);
   for(let j=0;j<4;j++)add(new T.SphereGeometry(.018,10,8),gold,0,.76-j*.12,.19);
   add(new T.TorusGeometry(.25,.012,8,40),gold,0,.18,0,Math.PI/2);
 }else if(category==='jewellery'){
   if(variant===0){add(new T.TorusGeometry(.42,.025,12,80),gold,0,.62,0,Math.PI/2);add(new T.OctahedronGeometry(.13,1),glass,0,.18,.02);add(new T.SphereGeometry(.055,18,12),gold,0,.34,.02)}
   else if(variant===1){for(const side of [-1,1]){add(new T.TorusGeometry(.19,.025,12,48),gold,side*.22,.72,0,0,0,side*.1);add(new T.SphereGeometry(.055,18,12),glass,side*.22,.45,0)}}
   else {add(new T.TorusGeometry(.28,.055,16,64),gold,0,.52,0,Math.PI/2);add(new T.BoxGeometry(.16,.12,.13),glass,0,.82,0);add(new T.OctahedronGeometry(.12,1),silver,0,.91,0)}
 }else if(category==='beauty'){
   if(variant===0){cyl(.18,.22,.68,glass,0,.48,0);cyl(.12,.12,.16,gold,0,.9,0);cyl(.035,.035,.2,dark,0,1.08,0);add(new T.SphereGeometry(.04,16,12),gold,0,1.2,0)}
   else if(variant===1){cyl(.28,.32,.38,ivory,0,.3,0);cyl(.29,.29,.07,gold,0,.53,0);cyl(.27,.27,.1,ivory,0,.61,0);cyl(.12,.12,.05,gold,0,.69,0)}
   else {cyl(.19,.22,.55,glass,0,.42,0);cyl(.21,.21,.09,gold,0,.74,0);cyl(.07,.07,.22,dark,0,.88,0);cyl(.12,.12,.09,gold,0,1.03,0)}
   add(new T.BoxGeometry(.23,.18,.012),ivory,0,.38,.2);
 }else if(category==='watches'){
   add(new T.BoxGeometry(.25,.72,.09),dark,0,.55,0);
   add(new T.BoxGeometry(.32,.42,.12),gold,0,.58,.015);
   add(new T.CylinderGeometry(.205,.205,.07,64),silver,0,.61,.09,Math.PI/2);
   add(new T.CylinderGeometry(.17,.17,.018,64),dark,0,.61,.132,Math.PI/2);
   add(new T.CircleGeometry(.145,48),mat(variant===2?'#172331':'#d0c4ad',.25,.24),0,.61,.145,0,0,0);
   for(let j=0;j<12;j++){const a=j*Math.PI/6;add(new T.BoxGeometry(.012,.035,.012),gold,Math.sin(a)*.115,.61+Math.cos(a)*.115,.16)}
   add(new T.BoxGeometry(.008,.09,.008),ivory,0,.65,.17);add(new T.BoxGeometry(.007,.065,.008),gold,.025,.59,.175);
   for(let y of [.12,1.02]){add(new T.BoxGeometry(.22,.25,.08),dark,0,y,0);for(let j=0;j<3;j++)add(new T.BoxGeometry(.18,.018,.09),silver,0,y-.06+j*.06,0)}
   cyl(.035,.035,.08,gold,.2,.61,.08,16);
 }else{
   const body=variant===1?new T.CylinderGeometry(.24,.32,.66,6):new T.BoxGeometry(.48,.68,.28);
   add(body,glass,0,.47,0);add(new T.BoxGeometry(.32,.23,.012),gold,0,.47,.15);add(new T.BoxGeometry(.26,.16,.014),ivory,0,.47,.16);
   cyl(.12,.12,.12,gold,0,.86,0);cyl(.075,.075,.22,gold,0,1.02,0);add(new T.BoxGeometry(.18,.08,.16),dark,0,1.17,0);
   for(let side of [-1,1])add(new T.BoxGeometry(.025,.42,.025),gold,side*.255,.46,0);
 }
 return root;
}
