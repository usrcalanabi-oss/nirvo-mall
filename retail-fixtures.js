export function addRetailFixtures(T,s,b,cy){
 const metal=new T.MeshStandardMaterial({color:'#25365e',metalness:.78,roughness:.24});
 const stone=new T.MeshStandardMaterial({color:'#c5cbd9',metalness:.12,roughness:.42});
 const glass=new T.MeshPhysicalMaterial({color:'#a9eaff',metalness:.08,roughness:.08,transparent:true,opacity:.2,transmission:.3,thickness:.12});
 const cyan=new T.MeshBasicMaterial({color:'#67e7f5'});
 // Unpopulated mall: furniture and displays only, no people or avatars.
 function counter(x,z){b(s,2.8,.82,.95,stone,x,.42,z);b(s,2.88,.09,1,metal,x,.87,z);b(s,2.6,.025,.78,cyan,x,.92,z)}
 function rack(x,z){b(s,2.4,.1,.46,metal,x,1.35,z);b(s,2.4,.1,.46,metal,x,2.35,z);b(s,.08,2.5,.12,metal,x-1.14,1.3,z);b(s,.08,2.5,.12,metal,x+1.14,1.3,z);for(let k=0;k<5;k++){let px=x-.9+k*.45;b(s,.34,.045,.34,stone,px,1.43,z+.04);b(s,.34,.045,.34,stone,px,2.43,z+.04)}b(s,2.3,.035,.06,cyan,x,2.9,z)}
 function vitrine(x,z){b(s,1.7,.14,.95,metal,x,.95,z);b(s,1.58,.72,.84,glass,x,1.39,z);b(s,1.72,.08,.98,stone,x,1.79,z);b(s,1.58,.025,.84,cyan,x,1.84,z);for(let dx of [-.78,.78])for(let dz of [-.4,.4])b(s,.035,.78,.035,metal,x+dx,1.39,z+dz)}
 function island(x,z){cy(s,.76,.82,.16,metal,x,.1,z);cy(s,.68,.68,.76,stone,x,.56,z);cy(s,.78,.78,.08,metal,x,.98,z);cy(s,.7,.7,.025,cyan,x,1.035,z)}
 counter(-10.1,-2.2);counter(10.1,-2.2);rack(-10.25,-7);rack(10.25,-7);vitrine(-5.05,-2.1);vitrine(5.05,-2.1);island(-5.1,-6.2);island(5.1,-6.2);
 for(let x=-8;x<=8;x+=4){b(s,2.8,.09,.76,metal,x,2.05,-15);b(s,2.65,.04,.66,stone,x,2.12,-15);b(s,2.65,.025,.06,cyan,x,2.16,-14.65);b(s,.06,2.2,.06,metal,x-1.3,1.05,-15);b(s,.06,2.2,.06,metal,x+1.3,1.05,-15)}
 for(let x of [-8,-4,0,4,8]){let p=new T.Group();p.position.set(x,7.7,-3);s.add(p);let wire=new T.Mesh(new T.CylinderGeometry(.012,.012,1.45,8),metal);wire.position.y=-.72;p.add(wire);let shade=new T.Mesh(new T.CylinderGeometry(.2,.48,.2,32,1,true),metal);shade.position.y=-1.5;p.add(shade);let lamp=new T.Mesh(new T.CircleGeometry(.3,32),cyan);lamp.rotation.x=-Math.PI/2;lamp.position.y=-1.61;p.add(lamp)}
}