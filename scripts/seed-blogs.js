const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/storeData.json');
const storeData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const blogs = [
  {
    id: "blog_authentic_maheshwari_guide_01",
    title: "How to Identify an Authentic Maheshwari Handloom Saree vs Fake Powerloom",
    slug: "how-to-identify-authentic-maheshwari-handloom-saree",
    category: "Buyer Guide",
    excerpt: "Learn the 5 definitive hallmarks of genuine Maheshwari pit-loom sarees — from the reversible Bugdi border to the unique zari weave and GI tag authenticity.",
    content: `## The Timeless Grace of Maheshwar's Handloom

In an era flooded with synthetic machine-made replicas, discerning an authentic **Maheshwari Handloom Saree** is both an art and a tribute to India's rich artisanal heritage. Woven on traditional pit looms along the sacred banks of River Narmada, genuine Maheshwari sarees possess distinctive traits that powerlooms simply cannot replicate.

---

### 1. The Signature Reversible Border (Bugdi & Chokha)
One of the most authentic signatures of a genuine Maheshwari saree is its **reversible border**. Known locally as *Bugdi* or *Chokha*, the intricate border pattern looks identical and equally neat on both sides of the saree. 
- In handloom weaving, the master weaver uses two shuttles simultaneously to weave the border seamlessly with the body.
- Powerloom fakes often show loose threads, synthetic glueing, or uneven tension on the reverse side.

---

### 2. Feather-Light Drape: The Silk-Cotton Symphony
Authentic Maheshwari sarees typically blend **fine Mulberry Silk in the warp (tana)** and **Mercerised Cotton in the weft (bana)**. 
- This gives the fabric a gentle natural sheen from silk combined with the airy, breathable comfort of cotton.
- Pure handloom feels soft, lightweight (often under 400–500 grams), and drapes effortlessly around the body without feeling stiff.

---

### 3. Fort Architecture-Inspired Motifs
Every motif in a genuine Maheshwari saree has deep historical roots inspired by the carvings of the **Maheshwar Ahilya Fort** and the flowing ripples of the **Narmada River**:
- *Leheriya* (wave pattern of the holy Narmada)
- *Chatai* (mat weave pattern)
- *Chameli ka Phool* (Jasmine blossom butti)
- *Eent* (brick design from fort walls)

In handloom weaving, each butti is hand-placed by the weaver, resulting in subtle organic variations that celebrate human craftsmanship.

---

### 4. Natural Luster vs Plastic Shine
Real Zari used in authentic handloom weaves features silver and gold threads wrapped over natural silk cores, giving off a dignified, rich metallic shimmer. Imitation powerlooms use polyester metallic films that shine harsh and artificial under light.

---

### 5. Direct from Weavers: Reoti Handloom Legacy
At **Reoti Handloom (Estd. 1960)**, our master weavers have preserved this sacred pit-loom tradition across three generations. Every saree is woven by hand with certified natural threads and inspected for flawless craftsmanship before reaching your wardrobe.

> **Tip for Buyers:** Always look for the GI (Geographical Indication) tag and purchase directly from recognized weaver families in Maheshwar to ensure you are supporting genuine artisans.`,
    author: "Master Weaver Mohanlal Ji (Reoti Handloom)",
    mediaType: "image",
    mediaUrl: "/uploads/saree_1789240597301_iy1ww.jpeg",
    readingTime: "4 min read",
    isFeatured: true,
    publishedAt: "2026-09-20T10:00:00.000Z",
    createdAt: "2026-09-20T10:00:00.000Z",
    updatedAt: "2026-09-20T10:00:00.000Z"
  },
  {
    id: "blog_heritage_legacy_ahilyabai_02",
    title: "The Royal Heritage of Maheshwari Sarees — 3 Generations of Weaving Legacy Since 1960",
    slug: "royal-heritage-of-maheshwari-sarees-reoti-handloom-legacy",
    category: "Weaving Heritage",
    excerpt: "Discover how Rani Ahilyabai Holkar birthed the Maheshwari weave on the banks of holy Narmada in the 18th century, and how Reoti Handloom continues this 3-generation pit-loom tradition since 1960.",
    content: `## A Royal Symphony Born on the Banks of Narmada

The story of the Maheshwari saree is steeped in royal grandeur, devotion, and feminine leadership. In the late 18th century, the visionary queen of the Malwa region, **Rajmata Devi Ahilyabai Holkar**, made the temple town of **Maheshwar** her capital. 

Seeking to create an attire befitting visiting royal dignitaries, scholars, and queens, Devi Ahilyabai personally invited master weavers from Surat, Mandu, and Hyderabad to craft a unique fabric that was regal, lightweight, and versatile.

---

### The Birth of the 5-Striped Pallu
Devi Ahilyabai designed the original Maheshwari saree with a distinctive **5-stripe pallu (three colored stripes alternated with two white stripes)**. The borders were inspired by the stone engravings, jharokhas, and temple pillars of the magnificent Maheshwar Fort.

Unlike heavy royal brocades, the Maheshwari saree was created to be lightweight and comfortable in the hot central Indian climate, making it an instant favorite across royal dynasties.

---

### Three Generations of Reoti Handloom (Since 1960)
For over six decades, **Reoti Handloom** has stood at the center of Maheshwar's handloom revival:
- **Generation 1 (1960):** Established on authentic wooden pit-looms near the Narmada ghats, mastering the classical silk-cotton weaves.
- **Generation 2 (1996):** Honored with State Government Handloom Excellence recognition for pioneering fine zari borders and preserving rare heritage buttis.
- **Generation 3 (Present):** Bringing authentic Maheshwar pit-loom treasures directly to global saree connoisseurs via reotihandloom.com without middlemen.

---

### Preserving India’s Cultural Crown
Each Reoti Handloom saree takes **3 to 7 days of intense rhythmic weaving** by our artisan families. When you drape a genuine Maheshwari saree, you carry forward an unbroken 250-year royal heritage created by Devi Ahilyabai Holkar.`,
    author: "Reoti Handloom Heritage Archive",
    mediaType: "image",
    mediaUrl: "/uploads/saree_1789221965397_lf0kg.jpeg",
    readingTime: "5 min read",
    isFeatured: true,
    publishedAt: "2026-09-18T10:00:00.000Z",
    createdAt: "2026-09-18T10:00:00.000Z",
    updatedAt: "2026-09-18T10:00:00.000Z"
  },
  {
    id: "blog_saree_care_maintenance_03",
    title: "Complete Care & Maintenance Guide for Silk-Cotton Maheshwari Sarees",
    slug: "care-and-maintenance-guide-silk-cotton-maheshwari-sarees",
    category: "Care & Maintenance",
    excerpt: "Essential expert tips from master weavers to keep your pure mulberry silk and mercerised cotton Maheshwari sarees pristine for decades — storage, washing, and zari preservation.",
    content: `## Cherish Your Heirloom: Master Weaver Care Tips

A handwoven Maheshwari saree is not just a garment — it is an heirloom that can be passed down generations when cared for with love. Because genuine Maheshwari sarees feature delicate mulberry silk threads, mercerised cotton, and pure metallic zari, proper handling preserves their luster and strength.

---

### 1. Washing & Cleaning Instructions
- **First Wash:** Always opt for **Dry Clean** for the first wash to set the rich natural dyes and protect the metallic zari borders.
- **Subsequent Washes:** If hand-washing at home, use cold water and a mild liquid detergent or *reetha* (soapnut) solution. Never use harsh chemical powders or bleach.
- **Never Wring or Twist:** Gently dip and rinse the saree. Avoid scrubbing the zari border vigorously.
- **Drying:** Dry the saree in a shaded, well-ventilated area. Direct harsh sunlight can fade natural silk dyes.

---

### 2. Ironing with Care
- Always iron your Maheshwari saree on the **reverse side** using medium to low heat.
- Place a clean, thin cotton cloth over the zari border before pressing to avoid direct contact between hot iron and metallic threads.
- Steam ironing is ideal for removing gentle creases and restoring natural drape.

---

### 3. Ideal Storage for Long Life
- **Pure Cotton Bags:** Store your sarees wrapped in breathable **muslin or cotton saree covers**. Avoid synthetic plastic covers which trap humidity and can tarnish zari.
- **Refold Periodically:** Take your sarees out every 3–4 months and refold them along different crease lines to prevent permanent fabric wear along folds.
- **Natural Insect Repellents:** Use neem leaves, dried cloves, or cedar wood blocks in your wardrobe instead of direct naphthalene balls.

---

### Master Weaver's Golden Rule
Treat your handloom saree like living art. With these simple practices, your Reoti Handloom Maheshwari saree will maintain its royal grace, vibrant colors, and silken sheen for decades!`,
    author: "Master Craftsmen, Reoti Handloom",
    mediaType: "image",
    mediaUrl: "/uploads/saree_1789233209397_zszzb.jpeg",
    readingTime: "3 min read",
    isFeatured: false,
    publishedAt: "2026-09-15T10:00:00.000Z",
    createdAt: "2026-09-15T10:00:00.000Z",
    updatedAt: "2026-09-15T10:00:00.000Z"
  }
];

storeData.blogs = blogs;
fs.writeFileSync(filePath, JSON.stringify(storeData, null, 2), 'utf8');
console.log('Added 3 comprehensive SEO blogs to storeData.json successfully.');
