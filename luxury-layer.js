export function initLuxuryLayer({ THREE, scene, camera, renderer, onDepartment, onHome, onGallery, onBag }) {
  // Keep the experience architectural and quiet. No floating particles, arcade dock or toy-like effects.
  const saved = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; } };
  const wishlist = saved('nirvoWishlist', []);
  const actions = document.querySelector('.product-actions');
  if (actions && !document.getElementById('nirvoSave')) {
    const save = document.createElement('button');
    save.id = 'nirvoSave';
    save.textContent = 'SAVE TO WISHLIST';
    actions.prepend(save);
    save.addEventListener('click', () => {
      const name = document.getElementById('productName')?.textContent || 'NIRVO selection';
      const next = wishlist.includes(name) ? wishlist.filter(item => item !== name) : [...wishlist, name];
      wishlist.splice(0, wishlist.length, ...next);
      localStorage.setItem('nirvoWishlist', JSON.stringify(wishlist));
      save.textContent = wishlist.includes(name) ? 'SAVED TO WISHLIST' : 'SAVE TO WISHLIST';
    });
  }
  return { toast() {} };
}
