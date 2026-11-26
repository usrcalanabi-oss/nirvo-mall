export function mountProductCatalog({ data, onSelect }) {
  const style=document.createElement('style');
  style.textContent=`
  .catalog-overlay{position:absolute;inset:0;z-index:18;background:rgba(8,9,10,.96);backdrop-filter:blur(22px);color:#f1eee8;display:none;flex-direction:column;padding:clamp(18px,4vw,42px);overflow:auto}
  .catalog-overlay.open{display:flex}.catalog-head{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:18px}
  .catalog-kicker{font-size:9px;letter-spacing:2.4px;color:#c5ad86}.catalog-title{font:clamp(30px,5vw,52px) 'Playfair Display',serif;margin:8px 0}
  .catalog-close{border:1px solid #aa9675;background:transparent;color:#f1eee8;width:42px;height:42px;border-radius:50%;font-size:24px}
  .catalog-tools{display:flex;gap:10px;flex-wrap:wrap;margin:12px 0 18px}.catalog-search{flex:1;min-width:180px;background:#17191b;border:1px solid #49443c;color:#fff;padding:13px 15px;outline:none}
  .catalog-filter{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:18px}.catalog-filter button{border:1px solid #514a40;background:transparent;color:#d8d0c3;padding:9px 12px;font-size:9px;letter-spacing:1px}
  .catalog-filter button.active{background:#c3a77c;color:#171513;border-color:#c3a77c}.catalog-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:13px}
  .catalog-card{background:#151719;border:1px solid #383a3b;min-width:0;text-align:left;color:#f4f0e8;padding:0;overflow:hidden}
  .catalog-art{height:clamp(112px,16vw,190px);display:flex;align-items:center;justify-content:center;position:relative;background:radial-gradient(ellipse at 50% 38%,#a99b8466,transparent 57%),linear-gradient(145deg,#323638,#151719)}
  .catalog-art:after{content:'';position:absolute;inset:12% 18%;border:1px solid #c8b18b33}.catalog-symbol{font:clamp(36px,5vw,58px) 'Playfair Display',serif;color:#d4bd98;text-shadow:0 8px 25px #000}
  .catalog-meta{padding:12px}.catalog-meta small{display:block;color:#bda77f;font-size:8px;letter-spacing:1.4px;margin-bottom:7px}
  .catalog-meta strong{display:block;font:16px 'Playfair Display',serif;line-height:1.2}.catalog-meta span{display:block;color:#aaa59d;font-size:9px;margin-top:8px;letter-spacing:.6px}
  .catalog-open{display:block;width:100%;margin-top:12px;padding:12px;background:#b9a17b;color:#171513;border:0;font-size:9px;letter-spacing:1.5px}
  .catalog-empty{color:#aaa;padding:30px 0}.catalog-card:active{transform:scale(.985)}
  @media(max-width:850px){.catalog-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.catalog-overlay{padding:16px}.catalog-art{height:130px}}
  @media(max-width:390px){.catalog-grid{gap:8px}.catalog-meta{padding:9px}.catalog-meta strong{font-size:14px}}
  `;
  document.head.appendChild(style);
  const root=document.createElement('section');root.className='catalog-overlay';root.id='productCatalog';
  root.innerHTML='<div class="catalog-head"><div><div class="catalog-kicker">NIRVO MALL · COMPLETE COLLECTION</div><h2 class="catalog-title">Discover every object.</h2><div class="catalog-kicker" id="catalogCount"></div></div><button class="catalog-close" aria-label="Close catalogue">×</button></div><div class="catalog-tools"><input class="catalog-search" id="catalogSearch" placeholder="Search products or collections…" autocomplete="off"></div><div class="catalog-filter" id="catalogFilters"></div><div class="catalog-grid" id="catalogGrid"></div><div class="catalog-empty" id="catalogEmpty" hidden>No products match your search.</div>';
  document.getElementById('world').appendChild(root);
  const filters=root.querySelector('#catalogFilters'),grid=root.querySelector('#catalogGrid'),search=root.querySelector('#catalogSearch'),count=root.querySelector('#catalogCount'),empty=root.querySelector('#catalogEmpty');
  let selected='ALL';const symbols=['F','◇','B','◷','✧'];const cats=['ALL',...data.map(d=>d[1].toUpperCase())];
  filters.innerHTML=cats.map(c=>'<button type="button" data-filter="'+c+'">'+c+'</button>').join('');
  function render(){const q=search.value.trim().toLowerCase();let total=0;grid.innerHTML='';
    data.forEach((d,z)=>d[3].forEach((name,i)=>{if(selected!=='ALL'&&selected!==d[1].toUpperCase())return;if(q&&!(`${name} ${d[1]} ${d[2]}`.toLowerCase().includes(q)))return;total++;
      const card=document.createElement('button');card.type='button';card.className='catalog-card';
      card.innerHTML='<div class="catalog-art"><div class="catalog-symbol">'+symbols[z]+'</div></div><div class="catalog-meta"><small>'+d[1].toUpperCase()+' · OBJECT 0'+(i+1)+'</small><strong>'+name+'</strong><span>PRICE ON ENQUIRY</span><span class="catalog-open">VIEW DETAILS ↗</span></div>';
      card.addEventListener('click',()=>{root.classList.remove('open');onSelect(z,i)});grid.appendChild(card);
    }));count.textContent=total+' PRODUCTS AVAILABLE';empty.hidden=total!==0;
  }
  filters.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{selected=b.dataset.filter;filters.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));render()}));
  filters.querySelector('[data-filter="ALL"]').classList.add('active');search.addEventListener('input',render);
  root.querySelector('.catalog-close').addEventListener('click',()=>root.classList.remove('open'));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&root.classList.contains('open'))root.classList.remove('open')});
  render();return {open(){root.classList.add('open');search.value='';selected='ALL';filters.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b.dataset.filter==='ALL'));render()},close(){root.classList.remove('open')}};
}
