const ROOT='/products/imported/images/';
const PHOTOS={
  '0-0':'men/02-ombre-blue-full-sleeve-shirt.jpg',
  '0-1':'men/38-black-graphic-sleeveless-tee.jpg',
  '0-2':'men/41-oversized-black-half-zip-hoodie.jpg',
  '1-0':'jewellery/21-rose-cross-pendant-necklace.jpg',
  '1-1':'jewellery/12-silver-twist-crystal-bracelet.jpg',
  '1-2':'jewellery/05-gold-tone-band-ring.jpg',
  '2-0':'beauty/08-derma-co-sali-cinamide-face-wash.jpg',
  '2-1':'beauty/11-dermatouch-pigmentation-care-trio.jpg',
  '2-2':'beauty/07-manicure-grooming-kit.jpg'
};
export function getProductPhoto(zone,index){const file=PHOTOS[zone+'-'+index];return file?ROOT+file:null}
