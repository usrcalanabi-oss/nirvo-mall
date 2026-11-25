import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.166.1/build/three.module.js';
const canvas=document.querySelector('#mallCanvas');if(canvas){try{
const scene=new THREE.Scene();scene.background=new THREE.Color('#0b0907');scene.fog=new THREE.Fog('#0b0907',18,38);
const camera=new THREE.PerspectiveCamera(43,1,.1,100);camera.position.set(8,7,12);
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
scene.add(new THREE.HemisphereLight(0xe8d5ad,0x17110a,2.0));const key=new THREE.DirectionalLight(0xffd99a,3.2);key.position.set(4,10,6);key.castShadow=true;scene.add(key);const warm=new THREE.PointLight(0xc99b52,32,18);warm.position.set(0,5,0);scene.add(warm);
const gold=new THREE.MeshStandardMaterial({color:'#b58b4c',metalness:.82,roughness:.24});const dark=new THREE.MeshStandardMaterial({color:'#17130e',metalness:.35,roughness:.35});const glass=new THREE.MeshPhysicalMaterial({color:'#8b795d',metalness:.45,roughness:.14,transparent:true,opacity:.42});
function box(w,h,d,mat,x,y,z){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;scene.add(m);return m}
box(19,.35,15,dark,0,-.35,0);const floor=new THREE.Mesh(new THREE.PlaneGeometry(19,15),new THREE.MeshStandardMaterial({color:'#30271b',metalness:.35,roughness:.28}));floor.rotation.x=-Math.PI/2;floor.position.y=-.16;floor.receiveShadow=true;scene.add(floor);
for(let x=-8;x<=8;x+=4){box(.28,6,.28,gold,x,2.7,-6.5);box(.28,6,.28,gold,x,2.7,6.5)}
box(18,.28,.35,gold,0,5.8,-6.5);box(18,.28,.35,gold,0,5.8,6.5);box(.35,.28,13,gold,-9,5.8,0);box(.35,.28,13,gold,9,5.8,0);
for(let x of [-6,0,6]){box(3.2,2.8,.28,glass,x,1.35,-6.25);box(3.5,.12,.5,gold,x,2.85,-6.15);box(3.2,2.8,.28,glass,x,1.35,6.25);box(3.5,.12,.5,gold,x,2.85,6.15)}
// central sculptural atrium and floating rings
for(let i=0;i<4;i++){const ring=new THREE.Mesh(new THREE.TorusGeometry(2.1+i*.55,.035,8,100),gold);ring.rotation.x=Math.PI/2;ring.rotation.z=i*.28;ring.position.set(0,4.1+i*.33,0);scene.add(ring)}
const orb=new THREE.Mesh(new THREE.IcosahedronGeometry(.72,2),new THREE.MeshStandardMaterial({color:'#d9bd83',metalness:.9,roughness:.12,emissive:'#493217',emissiveIntensity:.4}));orb.position.set(0,2.3,0);scene.add(orb);
for(let x of [-6,0,6]){const sign=box(2.5,.08,.1,gold,x,3.2,-6.02);sign.rotation.z=0}
for(let x of [-6,6]){for(let z of [-3,3]){const p=new THREE.Mesh(new THREE.CylinderGeometry(.12,.18,4.8,16),gold);p.position.set(x,2.2,z);p.castShadow=true;scene.add(p)}}
for(let x=-8;x<=8;x+=2){const lamp=new THREE.Mesh(new THREE.SphereGeometry(.09,12,8),new THREE.MeshBasicMaterial({color:'#f4d9a1'}));lamp.position.set(x,5.35,0);scene.add(lamp)}
let down=false,lastX=0,rotation=0,target=0;canvas.addEventListener('pointerdown',e=>{down=true;lastX=e.clientX;canvas.setPointerCapture(e.pointerId)});canvas.addEventListener('pointerup',()=>down=false);canvas.addEventListener('pointercancel',()=>down=false);canvas.addEventListener('pointermove',e=>{if(!down)return;target+=(e.clientX-lastX)*.006;lastX=e.clientX});
const resize=()=>{const r=canvas.getBoundingClientRect();renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix()};new ResizeObserver(resize).observe(canvas);resize();let raf;function animate(){raf=requestAnimationFrame(animate);rotation+=(target-rotation)*.045;scene.rotation.y=rotation+Math.sin(Date.now()*.00018)*.045;orb.rotation.y+=.003;orb.rotation.x+=.001;renderer.render(scene,camera)}animate();
}catch(e){canvas.parentElement.classList.add('3d-fallback');canvas.style.display='none';}}
