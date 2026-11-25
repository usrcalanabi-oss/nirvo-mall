export function initLuxuryLayer({ THREE, scene, camera, renderer, onDepartment, onHome, onBag }) {
  const $ = (id) => document.getElementById(id);
  const saved = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; } };
  let audio = null, soundOn = false, tilt = { x: 0, y: 0 }, tiltEnabled = false;
  const store = { wing: saved('nirvoPreferredWing', 'atrium'), wishlist: saved('nirvoWishlist', []), giftName: saved('nirvoGiftName', '') };

  // Procedural drifting gold/cyan dust: no downloaded textures or models.
  const count = 520, positions = new Float32Array(count * 3), speeds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    positions[i*3] = (Math.random() - .5) * 30;
    positions[i*3+1] = Math.random() * 9 + .1;
    positions[i*3+2] = (Math.random() - .5) * 30 - 5;
    speeds[i] = .12 + Math.random() * .38;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0x8fefff, size: .025, transparent: true, opacity: .48, depthWrite: false }));
  scene.add(dust);

  // Subtle procedural marble modulation on the atrium floor.
  scene.traverse((obj) => {
    if (!obj.isMesh || !obj.geometry?.type?.includes('Plane')) return;
    const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
    materials.forEach((mat) => {
      if (!mat || mat.userData.nirvoMarble) return;
      mat.userData.nirvoMarble = true;
      mat.onBeforeCompile = (shader) => {
        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <color_fragment>',
          `#include <color_fragment>
          float marbleWave = sin((vUv.x * 13.0 + sin(vUv.y * 9.0) * 0.7) * 6.2831);
          float marbleVein = smoothstep(0.965, 1.0, abs(marbleWave + sin(vUv.y * 41.0) * 0.035));
          diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * 1.22 + vec3(0.018,0.025,0.055), marbleVein * 0.22);`
        );
      };
      mat.needsUpdate = true;
    });
  });

  function chime(freq = 880) {
    if (!soundOn || !audio) return;
    const now = audio.currentTime, osc = audio.createOscillator(), gain = audio.createGain();
    osc.type = 'sine'; osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.42, now + .16);
    gain.gain.setValueAtTime(.0001, now); gain.gain.exponentialRampToValueAtTime(.045, now + .012);
    gain.gain.exponentialRampToValueAtTime(.0001, now + .75);
    osc.connect(gain); gain.connect(audio.destination); osc.start(now); osc.stop(now + .78);
  }
  function startSound() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) { toast('Web Audio is not supported in this browser.'); return; }
    audio ||= new AC(); audio.resume();
    if (!soundOn) {
      soundOn = true;
      const master = audio.createGain(); master.gain.value = .055; master.connect(audio.destination);
      const filter = audio.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 520; filter.connect(master);
      [55, 82.41, 110].forEach((hz, i) => {
        const o = audio.createOscillator(), g = audio.createGain();
        o.type = 'sine'; o.frequency.value = hz; g.gain.value = i === 0 ? .34 : .12;
        o.connect(g); g.connect(filter); o.start();
      });
      audio._nirvoMaster = master;
    }
    soundBtn.textContent = 'SOUND ON'; soundBtn.classList.add('enabled'); chime(660);
  }
  function stopSound() {
    soundOn = false;
    if (audio?._nirvoMaster) { audio._nirvoMaster.gain.setTargetAtTime(.0001, audio.currentTime, .22); audio._nirvoMaster = null; }
    soundBtn.textContent = 'SOUND OFF'; soundBtn.classList.remove('enabled');
  }
  function toast(msg) {
    let el = $('nirvoToast');
    if (!el) { el = document.createElement('div'); el.id = 'nirvoToast'; document.body.append(el); }
    el.textContent = msg; el.classList.add('show'); clearTimeout(el._timer); el._timer = setTimeout(() => el.classList.remove('show'), 2200);
  }

  const dock = document.createElement('nav'); dock.className = 'nirvo-dock'; dock.setAttribute('aria-label', 'Quick destinations');
  dock.innerHTML = '<button data-wing="atrium">ATRIUM</button><button data-wing="fashion">FASHION</button><button data-wing="jewellery">JEWELLERY</button><button data-wing="beauty">BEAUTY</button><button data-wing="concierge">CONCIERGE</button>';
  document.getElementById('world').append(dock);
  const soundBtn = document.createElement('button'); soundBtn.className = 'nirvo-sound'; soundBtn.textContent = 'SOUND OFF'; soundBtn.setAttribute('aria-label','Toggle ambient sound'); document.getElementById('world').append(soundBtn);
  soundBtn.addEventListener('click', () => soundOn ? stopSound() : startSound());
  dock.querySelectorAll('[data-wing]').forEach(btn => btn.addEventListener('click', () => {
    const wing = btn.dataset.wing; store.wing = wing; localStorage.setItem('nirvoPreferredWing', JSON.stringify(wing));
    if (wing === 'atrium') onHome(); else if (wing === 'concierge') $('menuPanel')?.classList.add('open'); else onDepartment(['fashion','jewellery','beauty'].indexOf(wing));
    dock.querySelectorAll('button').forEach(b => b.classList.toggle('active', b === btn)); chime(wing === 'jewellery' ? 1046 : wing === 'beauty' ? 784 : 880);
  }));

  // Wishlist + gift-card download are fully local.
  const productActions = document.querySelector('.product-actions');
  if (productActions && !$('nirvoSave')) {
    const save = document.createElement('button'); save.id = 'nirvoSave'; save.textContent = '♡ SAVE TO WISHLIST';
    const gift = document.createElement('button'); gift.id = 'nirvoGift'; gift.textContent = 'CREATE GIFT PASS ↓';
    productActions.prepend(save); productActions.append(gift);
    save.addEventListener('click', () => {
      const name = $('productName')?.textContent || 'NIRVO selection';
      store.wishlist = store.wishlist.includes(name) ? store.wishlist.filter(x => x !== name) : [...store.wishlist, name];
      localStorage.setItem('nirvoWishlist', JSON.stringify(store.wishlist)); save.textContent = store.wishlist.includes(name) ? '♥ SAVED TO WISHLIST' : '♡ SAVE TO WISHLIST'; chime(990);
    });
    gift.addEventListener('click', () => {
      const name = $('productName')?.textContent || 'NIRVO Selection';
      const initials = (prompt('Add initials to your NIRVO gift pass', store.giftName) || '').slice(0, 5);
      store.giftName = initials; localStorage.setItem('nirvoGiftName', JSON.stringify(initials));
      const cv = document.createElement('canvas'); cv.width = 1400; cv.height = 900;
      const ctx = cv.getContext('2d'); const grad = ctx.createLinearGradient(0,0,1400,900); grad.addColorStop(0,'#080d1d'); grad.addColorStop(1,'#17264a');
      ctx.fillStyle = grad; ctx.fillRect(0,0,1400,900); ctx.strokeStyle='#67e7f5'; ctx.lineWidth=3; ctx.strokeRect(48,48,1304,804);
      ctx.textAlign='center'; ctx.fillStyle='#8fefff'; ctx.font='500 42px Georgia'; ctx.fillText('N I R V O   M A L L',700,210);
      ctx.fillStyle='#f5f0e6'; ctx.font='italic 76px Georgia'; ctx.fillText('A considered selection',700,390);
      ctx.fillStyle='#b8c9ed'; ctx.font='32px Arial'; ctx.fillText(name,700,500);
      ctx.fillStyle='#67e7f5'; ctx.font='54px Georgia'; ctx.fillText(initials || 'VIP',700,660);
      ctx.font='20px Arial'; ctx.fillText('PRIVATE LOOKBOOK PASS  ·  '+new Date().getFullYear(),700,780);
      const a=document.createElement('a'); a.download='nirvo-lookbook-pass.png'; a.href=cv.toDataURL('image/png'); a.click(); toast('Your NIRVO gift pass is ready.');
    });
  }

  // URL hash carries a shareable, non-sensitive lookbook selection.
  window.addEventListener('hashchange', () => {
    try { const data = JSON.parse(decodeURIComponent(location.hash.slice(5))); if (data.wing) { store.wing=data.wing; if (data.wing!=='atrium' && ['fashion','jewellery','beauty'].includes(data.wing)) onDepartment(['fashion','jewellery','beauty'].indexOf(data.wing)); } } catch {}
  });
  const share = document.createElement('button'); share.className='nirvo-share'; share.textContent='SHARE LOOKBOOK ↗'; document.getElementById('world').append(share);
  share.addEventListener('click', async () => {
    const payload = { wing: store.wing, wishlist: store.wishlist };
    const hash = '#bag='+encodeURIComponent(JSON.stringify(payload)); history.replaceState(null,'',location.pathname+location.search+hash);
    try { await navigator.clipboard.writeText(location.href); toast('Shareable lookbook link copied.'); } catch { toast('Lookbook link created in the address bar.'); }
  });

  // Optional device tilt; only activated after a deliberate tap.
  const tiltBtn = document.createElement('button'); tiltBtn.className='nirvo-tilt'; tiltBtn.textContent='TILT'; document.getElementById('world').append(tiltBtn);
  tiltBtn.addEventListener('click', async () => {
    try {
      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        const permission = await DeviceOrientationEvent.requestPermission(); if (permission !== 'granted') return;
      }
      tiltEnabled = !tiltEnabled; tiltBtn.classList.toggle('enabled', tiltEnabled); tiltBtn.textContent = tiltEnabled ? 'TILT ON' : 'TILT';
      if (tiltEnabled) window.addEventListener('deviceorientation', onTilt);
      else window.removeEventListener('deviceorientation', onTilt);
    } catch { toast('Motion access is unavailable on this device.'); }
  });
  function onTilt(e) { tilt.x = Math.max(-1, Math.min(1, (e.gamma || 0) / 35)); tilt.y = Math.max(-1, Math.min(1, ((e.beta || 0) - 35) / 45)); }

  const baseRender = renderer.render.bind(renderer);
  renderer.render = function (sc, ca) {
    const t = performance.now() * .001;
    const a = dustGeo.attributes.position.array;
    for (let i=0;i<count;i++) { a[i*3+1] += Math.sin(t*speeds[i]+i)*.0009; a[i*3] += Math.cos(t*.4+i)*.00025; if(a[i*3+1]>10) a[i*3+1]=.15; }
    dustGeo.attributes.position.needsUpdate = true;
    if (tiltEnabled) { ca.position.x += (tilt.x*.32 - (ca.userData.tiltX||0))*.04; ca.position.y += (tilt.y*.2 - (ca.userData.tiltY||0))*.04; ca.userData.tiltX=tilt.x*.32; ca.userData.tiltY=tilt.y*.2; }
    baseRender(sc,ca);
  };
  const preferred = store.wing;
  dock.querySelectorAll('button').forEach(b => b.classList.toggle('active', b.dataset.wing === preferred));
  if (location.hash.startsWith('#bag=')) { try { const data=JSON.parse(decodeURIComponent(location.hash.slice(5))); if(data.wing && ['fashion','jewellery','beauty'].includes(data.wing)) onDepartment(['fashion','jewellery','beauty'].indexOf(data.wing)); } catch {} }
  return { chime, toast };
}
