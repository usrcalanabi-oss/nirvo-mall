const ROOT='/products/imported/images/';
const PHOTO_PRODUCTS={
  0:[
    ['Maroon Ruched Fishtail Gown','women/01-maroon-ruched-fishtail-gown.jpg'],
    ['Ombre Blue Full-Sleeve Shirt','men/02-ombre-blue-full-sleeve-shirt.jpg'],
    ['Textured Contrast-Collar Polo — Grey','men/03-textured-contrast-collar-polo-grey.jpg'],
    ['Black Contrast-Collar Polo Sweatshirt','men/04-black-contrast-collar-polo-sweatshirt.jpg'],
    ['Brown Ribbed Henley Tee','men/14-brown-ribbed-henley-tee.jpg'],
    ['Navy & Teal Plaid Shirt','men/15-navy-teal-plaid-shirt.jpg'],
    ['Navy Windowpane-Check Shirt','men/16-navy-windowpane-check-shirt.jpg'],
    ['Navy & Brown Check Shirt','men/17-navy-brown-check-shirt.jpg'],
    ['Black Chelsea Boots','men/18-black-chelsea-boots.jpg'],
    ['Blue Corduroy Co-ord Set — Kids','kids/19-blue-corduroy-co-ord-set.jpg'],
    ['Black Flared Trousers','men/20-black-flared-trousers.jpg'],
    ['Black Graphic Sleeveless Tee','men/38-black-graphic-sleeveless-tee.jpg'],
    ['Grey & Black Sleeveless Half-Zip Hoodie','men/39-sleeveless-half-zip-hoodie-grey-black.jpg'],
    ['Black & Grey Raglan Colour-Block Sweatshirt','men/40-raglan-colour-block-sweatshirt.jpg'],
    ['Oversized Black Half-Zip Hoodie','men/41-oversized-black-half-zip-hoodie.jpg'],
    ['Navy Striped-Sleeve Half-Zip Sweatshirt','men/42-navy-striped-sleeve-half-zip-sweatshirt.jpg'],
    ['Black Oversized Half-Zip Pullover','men/43-black-oversized-half-zip-pullover.jpg'],
    ['Beige Drawstring Wide-Leg Pants','men/44-beige-drawstring-wide-leg-pants.jpg'],
    ['Off-White Drawstring Wide-Leg Pants','men/45-off-white-drawstring-wide-leg-pants.jpg'],
    ['Brown & Black Striped Half-Zip Sweatshirt','men/46-brown-black-striped-half-zip-sweatshirt.jpg'],
    ['Grey & Black Striped Half-Zip Sweatshirt','men/47-grey-black-striped-half-zip-sweatshirt.jpg'],
    ['Black Wide-Leg Joggers','men/48-black-wide-leg-joggers.jpg'],
    ['Washed Baggy Denim Jeans','men/49-washed-baggy-denim-jeans.jpg'],
    ['Graphic Sleeveless Hoodie & Jogger Set','men/50-graphic-sleeveless-hoodie-jogger-set.jpg']
  ],
  1:[
    ['Gold-Tone Band Ring','jewellery/05-gold-tone-band-ring.jpg'],
    ['Adjustable Silver Ring Set','jewellery/06-adjustable-silver-ring-set.jpg'],
    ['Blue Crystal Wave Bracelet','jewellery/09-blue-crystal-wave-bracelet.jpg'],
    ['Blue Crystal Heart Bracelet','jewellery/10-blue-crystal-heart-bracelet.jpg'],
    ['Silver Twist Crystal Bracelet','jewellery/12-silver-twist-crystal-bracelet.jpg'],
    ['Pink Crystal Vine Bracelet','jewellery/13-pink-crystal-vine-bracelet.jpg'],
    ['Rose Cross Pendant Necklace','jewellery/21-rose-cross-pendant-necklace.jpg'],
    ['Hexagram Star Pendant Necklace','jewellery/22-hexagram-star-pendant-necklace.jpg'],
    ['Glow Dragon Sword Pendant','jewellery/23-glow-dragon-sword-pendant.jpg'],
    ['Winged Cross Pendant Necklace','jewellery/24-winged-cross-pendant-necklace.jpg'],
    ['Layered Pearl Necklace','jewellery/25-layered-pearl-necklace.jpg'],
    ['Glow Cross Pendant','jewellery/26-glow-cross-pendant.jpg'],
    ['Pink Crystal Bow Necklace','jewellery/27-pink-crystal-bow-necklace.jpg'],
    ['Double Butterfly Necklace','jewellery/28-double-butterfly-necklace.jpg'],
    ['Moonstone Star Crescent Necklace','jewellery/29-moonstone-star-crescent-necklace.jpg'],
    ['Moonstone Whale Tail Necklace','jewellery/30-moonstone-whale-tail-necklace.jpg'],
    ['Dainty Gold Pendant Necklace Set','jewellery/31-dainty-gold-pendant-necklace-set.jpg'],
    ['Infinity Adjustable Bracelet','jewellery/32-infinity-adjustable-bracelet.jpg'],
    ['Opal Heart Necklace','jewellery/33-opal-heart-necklace.jpg'],
    ['Rose Gold Pendant Necklace Set','jewellery/34-rose-gold-pendant-necklace-set.jpg'],
    ['Silver Charm Necklace Set','jewellery/35-silver-charm-necklace-set.jpg'],
    ['Enamel Charm Necklace Collection','jewellery/36-enamel-charm-necklace-collection.jpg'],
    ['Silver Pendant Necklace Collection','jewellery/37-silver-pendant-necklace-collection.jpg']
  ],
  2:[
    ['Manicure & Grooming Kit','beauty/07-manicure-grooming-kit.jpg'],
    ['Derma Co Salicylic Face Wash','beauty/08-derma-co-sali-cinamide-face-wash.jpg'],
    ['Dermatouch Pigmentation Care Trio','beauty/11-dermatouch-pigmentation-care-trio.jpg']
  ]
};
export function getProductPhoto(zone,index){const item=PHOTO_PRODUCTS[zone]?.[index];return item?ROOT+item[1]:null}
export function getPhotoProducts(zone){return (PHOTO_PRODUCTS[zone]||[]).map(x=>({name:x[0],photo:ROOT+x[1]}))}
