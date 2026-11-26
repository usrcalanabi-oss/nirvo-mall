const STORAGE_KEY = 'nirvoMallCustomerReviewsV1';
const REVIEWS_API = 'https://nirvo-mall-reviews.usrcalanabi.workers.dev/reviews';
let sharedReviews = [];
const readReviews = () => { try { const v=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]'); return Array.isArray(v)?v:[]; } catch { return []; } };
const safe = (v) => String(v||'').replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
export function mountReviewBoard({data=[]}={}) {
  const style=document.createElement('style');
  style.textContent=`
  .nr-trigger{position:fixed;z-index:24;right:18px;bottom:70px;padding:12px 15px;border:1px solid #b49a72;background:#171615ed;color:#e5d5bb;font:9px 'DM Sans',sans-serif;letter-spacing:1.5px;backdrop-filter:blur(16px)}
  .nr-overlay{position:fixed;z-index:75;inset:0;display:none;overflow:auto;background:#171615;color:#f1ece3;padding:clamp(16px,4vw,48px);font-family:'DM Sans',sans-serif}
  .nr-overlay.open{display:block}.nr-head{max-width:1120px;margin:0 auto 28px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #ffffff24;padding-bottom:18px}
  .nr-brand{font:600 13px 'DM Sans';letter-spacing:3px;color:#e5d5bb}.nr-close{border:1px solid #b49a72;padding:10px 14px;color:#e5d5bb}
  .nr-layout{max-width:1120px;margin:auto;display:grid;grid-template-columns:minmax(270px,.8fr) minmax(0,1.4fr);gap:28px;align-items:start}
  .nr-panel{border:1px solid #ffffff24;background:#211f1c;padding:22px}.nr-panel h2{font:32px 'Playfair Display';font-weight:400;margin:0 0 8px}.nr-sub{font-size:11px;line-height:1.7;color:#bfb5a6}
  .nr-form{display:grid;gap:12px;margin-top:18px}.nr-form label{display:grid;gap:6px;font-size:10px;letter-spacing:.8px;color:#d6c9b6}
  .nr-form input,.nr-form select,.nr-form textarea,.nr-filter{width:100%;padding:11px;background:#151412;border:1px solid #5d5345;color:#f1ece3;font:12px 'DM Sans';border-radius:0}
  .nr-form textarea{min-height:105px;resize:vertical}.nr-form input:focus,.nr-form textarea:focus,.nr-form select:focus{outline:1px solid #b49a72}
  .nr-stars{display:flex;gap:6px}.nr-stars button{font-size:25px;color:#766c5d;padding:0 3px}.nr-stars button.selected{color:#e5c58d}
  .nr-upload{border:1px dashed #8b795e;padding:14px;text-align:center;color:#c8b89f;font-size:10px}.nr-upload input{border:0;padding:8px 0;background:transparent}
  .nr-preview{max-width:100%;max-height:150px;object-fit:cover;display:none;margin:8px auto 0}
  .nr-submit{padding:14px;background:#b49a72;color:#171615;font-size:10px;letter-spacing:1.5px;font-weight:600}
  .nr-board-head{display:flex;justify-content:space-between;gap:12px;align-items:end;margin-bottom:15px}.nr-board-head h2{font:32px 'Playfair Display';font-weight:400;margin:0}.nr-count{font-size:9px;color:#b49a72;letter-spacing:1px}
  .nr-cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.nr-card{min-width:0;border:1px solid #ffffff20;background:#211f1c;padding:14px}.nr-card img{width:100%;height:180px;object-fit:cover;margin-bottom:12px;background:#121110}.nr-card h3{font:19px 'Playfair Display';font-weight:400;margin:7px 0}.nr-card p{font-size:11px;line-height:1.7;color:#d0c7b9;white-space:pre-wrap;overflow-wrap:anywhere}.nr-card-meta{font-size:9px;color:#b49a72;letter-spacing:.6px}.nr-empty{padding:28px;border:1px dashed #665a49;color:#c5b9a8;font-size:12px;line-height:1.8}
  .nr-notice{font-size:9px;line-height:1.6;color:#b6aa98;border-top:1px solid #ffffff20;padding-top:12px;margin-top:14px}
  @media(max-width:760px){.nr-layout{grid-template-columns:1fr;gap:16px}.nr-overlay{padding:14px;padding-bottom:calc(24px + env(safe-area-inset-bottom))}.nr-panel{padding:16px}.nr-cards{grid-template-columns:1fr}.nr-card img{height:220px}.nr-trigger{right:12px;bottom:68px;padding:10px 11px;font-size:8px;max-width:48vw}}
  `;
  document.head.appendChild(style);
  const trigger=document.createElement('button');trigger.className='nr-trigger';trigger.textContent='✧ CUSTOMER REVIEWS';document.body.appendChild(trigger);
  const overlay=document.createElement('section');overlay.className='nr-overlay';overlay.innerHTML=`
    <header class="nr-head"><div class="nr-brand">NIRVO · CUSTOMER JOURNAL</div><button class="nr-close" type="button">CLOSE ×</button></header>
    <div class="nr-layout">
      <section class="nr-panel"><h2>Share your experience.</h2><p class="nr-sub">Tell the NIRVO community about your purchase. Write an honest review; a photo can be previewed on your device but cannot yet be shared publicly.</p>
        <form class="nr-form" id="nrForm">
          <label>Your display name<input name="name" maxlength="40" required placeholder="Name shown with your review"></label>
          <label>Product<select name="product" required><option value="">Choose a product</option></select></label>
          <label>Your rating <span class="nr-stars" role="group" aria-label="Choose a star rating"><button type="button" data-rating="1" aria-label="1 star">★</button><button type="button" data-rating="2" aria-label="2 stars">★</button><button type="button" data-rating="3" aria-label="3 stars">★</button><button type="button" data-rating="4" aria-label="4 stars">★</button><button type="button" data-rating="5" aria-label="5 stars">★</button></span></label>
          <label>Review title<input name="title" maxlength="70" required placeholder="What stood out?"></label>
          <label>Your review<textarea name="body" maxlength="700" required placeholder="Share details about quality, fit, delivery or your experience…"></textarea></label>
          <label class="nr-upload">LOCAL PHOTO PREVIEW (NOT SHARED)<input name="photo" type="file" accept="image/jpeg,image/png,image/webp"><img class="nr-preview" alt="Selected review photo preview"></label>
          <button class="nr-submit" type="submit">PUBLISH REVIEW ↗</button>
        </form>
        <p class="nr-notice">Privacy & trust: use a display name only; do not upload faces, addresses, receipts or personal information. Text reviews are published to the shared NIRVO community board. Photo previews stay on this device and are not uploaded. Reviews are customer-submitted and are not verified-purchase badges.</p>
      </section>
      <section><div class="nr-board-head"><div><div class="nr-count">THE COMMUNITY</div><h2>Review board.</h2></div><select class="nr-filter" aria-label="Filter reviews"><option value="all">All products</option></select></div><div class="nr-cards"></div></section>
    </div>`;
  document.body.appendChild(overlay);
  const form=overlay.querySelector('#nrForm'),productSelect=form.elements.product,filter=overlay.querySelector('.nr-filter'),cards=overlay.querySelector('.nr-cards'),stars=[...overlay.querySelectorAll('[data-rating]')],preview=overlay.querySelector('.nr-preview');
  let rating=5,photoData='';
  data.forEach(d=>(d[3]||[]).forEach(name=>{const opt=document.createElement('option');opt.value=name;opt.textContent=name;productSelect.appendChild(opt)}));
  [...productSelect.options].slice(1).forEach(o=>{const f=o.cloneNode(true);filter.appendChild(f)});
  function setRating(n){rating=n;stars.forEach(b=>b.classList.toggle('selected',Number(b.dataset.rating)<=n))}
  setRating(5);stars.forEach(b=>b.addEventListener('click',()=>setRating(Number(b.dataset.rating))));
  form.elements.photo.addEventListener('change',async e=>{
    const file=e.target.files?.[0];photoData='';preview.removeAttribute('src');preview.style.display='none';
    if(!file)return;if(!file.type.startsWith('image/')){alert('Please choose an image file.');e.target.value='';return}
    if(file.size>5*1024*1024){alert('Please choose a photo smaller than 5 MB.');e.target.value='';return}
    try{photoData=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onerror=reject;reader.onload=()=>{const img=new Image();img.onerror=reject;img.onload=()=>{const scale=Math.min(1,900/Math.max(img.width,img.height));const c=document.createElement('canvas');c.width=Math.round(img.width*scale);c.height=Math.round(img.height*scale);c.getContext('2d').drawImage(img,0,0,c.width,c.height);resolve(c.toDataURL('image/jpeg',.72))};img.src=reader.result};reader.readAsDataURL(file)});preview.src=photoData;preview.style.display='block'}catch{alert('This photo could not be opened. Try another image.');e.target.value='';photoData=''}
  });
  function render(){const all=sharedReviews,shown=filter.value==='all'?all:all.filter(r=>r.product===filter.value);cards.innerHTML='';if(!shown.length){cards.innerHTML='<div class="nr-empty">No reviews yet for this selection. Be the first to share a genuine NIRVO experience.</div>'}else shown.forEach(r=>{const card=document.createElement('article');card.className='nr-card';if(r.photo){const img=document.createElement('img');img.src=r.photo;img.alt='Customer-submitted product photo';img.loading='lazy';card.appendChild(img)}const meta=document.createElement('div');meta.className='nr-card-meta';meta.textContent='★'.repeat(r.rating)+'☆'.repeat(5-r.rating)+' · '+new Date(r.createdAt).toLocaleDateString();const title=document.createElement('h3');title.textContent=r.title;const body=document.createElement('p');body.textContent=r.body;const author=document.createElement('div');author.className='nr-card-meta';author.textContent='BY '+r.name.toUpperCase()+' · '+r.product;card.append(meta,title,body,author);cards.appendChild(card)});overlay.querySelector('.nr-count').textContent=all.length+' CUSTOMER '+(all.length===1?'NOTE':'NOTES')}
  filter.addEventListener('change',render);
  form.addEventListener('submit',async e=>{e.preventDefault();const fd=new FormData(form);const review={name:String(fd.get('name')).trim(),product:String(fd.get('product')),rating,title:String(fd.get('title')).trim(),body:String(fd.get('body')).trim()};if(!review.name||!review.product||!review.title||!review.body){alert('Please complete all required fields.');return}const submit=form.querySelector('.nr-submit');submit.disabled=true;submit.textContent='PUBLISHING…';try{const response=await fetch(REVIEWS_API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(review)});const result=await response.json();if(!response.ok)throw new Error(result.error||'Review could not be published');form.reset();photoData='';preview.removeAttribute('src');preview.style.display='none';setRating(5);filter.value='all';await loadReviews();alert('Your text review is now published on the shared NIRVO review board.');}catch(err){alert('Could not publish right now: '+err.message+'. Please try again when your connection is available.');}finally{submit.disabled=false;submit.textContent='PUBLISH REVIEW ↗';}});
  trigger.addEventListener('click',()=>{overlay.classList.add('open');render()});overlay.querySelector('.nr-close').addEventListener('click',()=>overlay.classList.remove('open'));document.addEventListener('keydown',e=>{if(e.key==='Escape')overlay.classList.remove('open')});
  async function loadReviews(){try{const response=await fetch(REVIEWS_API,{headers:{'Accept':'application/json'}});if(!response.ok)throw new Error('Reviews unavailable');const payload=await response.json();sharedReviews=Array.isArray(payload.reviews)?payload.reviews:[];render()}catch(err){cards.innerHTML='<div class="nr-empty">The shared review board is temporarily unavailable. Please try again shortly.</div>';overlay.querySelector('.nr-count').textContent='COMMUNITY BOARD';}}
  loadReviews();render();return {open:()=>{overlay.classList.add('open');loadReviews()}};
}
