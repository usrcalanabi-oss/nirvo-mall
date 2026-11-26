export function initWalkControls({ THREE, camera, canvas, onZone = () => {} }) {
  const style = document.createElement('style');
  style.textContent = `
  .walk-hud{position:absolute;z-index:7;inset:0;pointer-events:none;font:8px 'DM Sans',sans-serif;letter-spacing:1.5px;color:#eee5d8}
  .walk-status{position:absolute;left:50%;top:92px;transform:translateX(-50%);padding:9px 13px;border:1px solid #b49a7255;background:#171615cc;backdrop-filter:blur(12px);white-space:nowrap}
  .walk-joystick{position:absolute;left:22px;bottom:calc(34px + env(safe-area-inset-bottom));width:124px;height:124px;border:1px solid #e5d5bb66;border-radius:50%;background:#17161566;pointer-events:auto;touch-action:none;display:none}
  .walk-stick{position:absolute;left:50%;top:50%;width:48px;height:48px;margin:-24px;border:1px solid #e5d5bb;background:#b49a7270;border-radius:50%;box-shadow:0 3px 18px #0008}
  .walk-look{position:absolute;right:0;top:18%;width:56%;height:65%;pointer-events:auto;touch-action:none;display:none}
  .walk-tip{position:absolute;right:22px;bottom:calc(48px + env(safe-area-inset-bottom));padding:9px 12px;background:#171615b8;border:1px solid #b49a723d}
  .walk-hud.active .walk-joystick,.walk-hud.active .walk-look{display:block}
  .walk-hud.active .walk-status{opacity:.92}
  @media(min-width:701px){.walk-hud.active .walk-tip{right:24px;bottom:25px}}
  @media(max-width:700px){.walk-status{top:76px;font-size:7px}.walk-tip{right:14px;bottom:calc(42px + env(safe-area-inset-bottom));font-size:6px}.walk-joystick{width:112px;height:112px;left:16px}}
  `;
  document.head.appendChild(style);
  const hud=document.createElement('div');hud.className='walk-hud';
  hud.innerHTML='<div class="walk-status">WALK MODE · EXPLORE THE MALL</div><div class="walk-joystick"><div class="walk-stick"></div></div><div class="walk-look" aria-label="Drag to look around"></div><div class="walk-tip">WASD / ARROWS TO WALK · DRAG TO LOOK</div>';
  document.getElementById('world').appendChild(hud);
  const joy=hud.querySelector('.walk-joystick'),stick=hud.querySelector('.walk-stick'),lookArea=hud.querySelector('.walk-look');
  const state={enabled:false,paused:false,x:0,z:4.2,yaw:0,pitch:0,moveX:0,moveY:0,keys:new Set(),lookPointer:null,lastX:0,lastY:0,zone:-1};
  const centers=[-10,-5,0,5,10];
  const setStick=(x,y)=>{const max=34,len=Math.hypot(x,y)||1,k=Math.min(1,max/len);stick.style.transform='translate('+x*k+'px,'+y*k+'px)'};
  function joyStart(e){e.preventDefault();joy.setPointerCapture?.(e.pointerId);joyMove(e)}
  function joyMove(e){if(!state.enabled)return;const r=joy.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),max=42,len=Math.hypot(dx,dy)||1,k=Math.min(1,max/len);state.moveX=dx*k/max;state.moveY=-dy*k/max;setStick(dx,dy)}
  function joyEnd(e){state.moveX=0;state.moveY=0;setStick(0,0)}
  joy.addEventListener('pointerdown',joyStart);joy.addEventListener('pointermove',e=>{if(e.buttons||e.pressure)joyMove(e)});joy.addEventListener('pointerup',joyEnd);joy.addEventListener('pointercancel',joyEnd);
  lookArea.addEventListener('pointerdown',e=>{if(!state.enabled)return;state.lookPointer=e.pointerId;state.lastX=e.clientX;state.lastY=e.clientY;lookArea.setPointerCapture?.(e.pointerId)});
  lookArea.addEventListener('pointermove',e=>{if(state.lookPointer!==e.pointerId)return;const dx=e.clientX-state.lastX,dy=e.clientY-state.lastY;state.lastX=e.clientX;state.lastY=e.clientY;state.yaw-=dx*.006;state.pitch=Math.max(-.72,Math.min(.58,state.pitch-dy*.0045))});
  const releaseLook=()=>{state.lookPointer=null};lookArea.addEventListener('pointerup',releaseLook);lookArea.addEventListener('pointercancel',releaseLook);
  window.addEventListener('keydown',e=>{if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)){state.keys.add(e.code);if(state.enabled)e.preventDefault()}});
  window.addEventListener('keyup',e=>state.keys.delete(e.code));
  window.addEventListener('blur',()=>{state.keys.clear();joyEnd()});
  canvas.addEventListener('pointerdown',e=>{if(!state.enabled||e.pointerType!=='mouse')return;state.lookPointer='mouse';state.lastX=e.clientX;state.lastY=e.clientY});
  window.addEventListener('pointermove',e=>{if(state.lookPointer!=='mouse'||!state.enabled)return;const dx=e.clientX-state.lastX,dy=e.clientY-state.lastY;state.lastX=e.clientX;state.lastY=e.clientY;state.yaw-=dx*.004;state.pitch=Math.max(-.72,Math.min(.58,state.pitch-dy*.003))});
  window.addEventListener('pointerup',()=>{if(state.lookPointer==='mouse')state.lookPointer=null});
  function enable(){state.enabled=true;state.x=0;state.z=4.2;state.yaw=0;state.pitch=-.04;state.zone=-1;hud.classList.add('active');hud.querySelector('.walk-status').textContent='WALK MODE · GRAND ATRIUM';}
  function disable(){state.enabled=false;state.paused=false;state.keys.clear();state.moveX=state.moveY=0;hud.classList.remove('active')}
  function pause(){if(!state.enabled)return;state.enabled=false;state.paused=true;state.keys.clear();state.moveX=state.moveY=0;hud.classList.remove('active')}
  function resume(){if(!state.paused)return;state.paused=false;state.enabled=true;hud.classList.add('active')}
  function travelTo(i){if(i<0||i>4)return;state.x=centers[i];state.z=-1.2;state.yaw=0;state.pitch=-.04}
  function returnToAtrium(){state.x=0;state.z=4.2;state.yaw=0;state.pitch=-.04;state.zone=-1;}
  function update(dt){
    if(!state.enabled)return;
    const k=state.keys,forward=(k.has('KeyW')||k.has('ArrowUp')?1:0)-(k.has('KeyS')||k.has('ArrowDown')?1:0)+state.moveY;
    const side=(k.has('KeyD')||k.has('ArrowRight')?1:0)-(k.has('KeyA')||k.has('ArrowLeft')?1:0)+state.moveX;
    const mag=Math.hypot(forward,side),speed=(k.has('ShiftLeft')||k.has('ShiftRight')?5.1:3.15)*Math.min(1,mag);
    if(mag>.02){const f=forward/(mag||1),a=side/(mag||1),dx=(Math.sin(state.yaw)*f+Math.cos(state.yaw)*a)*speed*dt,dz=(-Math.cos(state.yaw)*f+Math.sin(state.yaw)*a)*speed*dt;let nx=state.x+dx,nz=state.z+dz;
      // Keep the visitor inside the public mall footprint and away from the structural rear/side walls.
      nx=Math.max(-14.6,Math.min(14.6,nx));nz=Math.max(-18.4,Math.min(6.8,nz));
      // Main display islands and large counters are solid; the promenade and boutique thresholds stay open.
      const blocks=[[-1.65,-.7,-6.3,-4.55],[-6.65,-5.55,-6.7,-5.5],[5.55,6.65,-6.7,-5.5],[-11.2,-8.8,-9.7,-8.9],[8.8,11.2,-9.7,-8.9]];
      const blocked=blocks.some(([x1,x2,z1,z2])=>nx>x1&&nx<x2&&nz>z1&&nz<z2);
      if(!blocked){state.x=nx;state.z=nz}
    }
    camera.position.set(state.x,1.68,state.z);
    const dir=new THREE.Vector3(Math.sin(state.yaw)*Math.cos(state.pitch),Math.sin(state.pitch),-Math.cos(state.yaw)*Math.cos(state.pitch));
    camera.lookAt(camera.position.clone().add(dir));
    let zone=-1;for(let i=0;i<centers.length;i++)if(Math.abs(state.x-centers[i])<2.5&&state.z<-2.2&&state.z>-17.8){zone=i;break}
    if(zone!==state.zone){state.zone=zone;if(zone>=0){hud.querySelector('.walk-status').textContent='NOW EXPLORING · '+['FASHION ATELIER','JEWELLERY SALON','BEAUTY HOUSE','WATCH GALLERY','SCENT LIBRARY'][zone]}else hud.querySelector('.walk-status').textContent='WALK MODE · GRAND ATRIUM';onZone(zone)}
  }
  return {enable,disable,pause,resume,update,travelTo,returnToAtrium,get enabled(){return state.enabled},get paused(){return state.paused}};
}
