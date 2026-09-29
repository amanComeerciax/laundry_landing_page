export interface ServiceItem {
  id: string;
  name: string;
  category: 'men' | 'women' | 'household' | 'specialty';
  price: number;
  unit: string;
  popular?: boolean;
}

export interface ServiceCategory {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  image: string;
  startingPrice: string;
  features: string[];
}

export const SERVICES: ServiceCategory[] = [
  {
    id: 'dry-cleaning',
    title: 'Organic Dry Cleaning',
    tagline: '100% PERC-Free & Gentle',
    description: 'Bespoke hydrocarbon dry cleaning technology that protects delicate fibers, enhances color brilliance, and leaves zero chemical odor.',
    icon: 'Sparkles',
    image: '/images/dry-cleaning.jpg',
    startingPrice: '₹89/pc',
    features: ['German non-toxic solvents', 'Zero fabric discoloration', 'Hand-finished steam press', 'Stain-specific pre-treatment'],
  },
  {
    id: 'wash-iron',
    title: 'Premium Wash & Steam Iron',
    tagline: 'Crisp, Hygienic Everyday Wear',
    description: 'Everyday garments washed with gentle bio-enzymatic detergents, treated with fabric softeners, and razor-pressed on vacuum tables.',
    icon: 'Shirt',
    image: '/images/hero-couple.jpg',
    startingPrice: '₹149/kg',
    features: ['Antiseptic hygiene rinse', 'Fabric conditioner infusion', 'Collars & cuffs precision press', 'Delivered on hangers or crisp fold'],
  },
  {
    id: 'steam-press',
    title: 'Industrial Steam Pressing',
    tagline: 'Razor Sharp Creases',
    description: 'High-temperature industrial steam press removes micro-wrinkles and restores original garment silhouette without fabric shine.',
    icon: 'Flame',
    image: '/images/dry-cleaning.jpg',
    startingPrice: '₹25/pc',
    features: ['Zero iron-shine marks', 'Vacuum extraction table', 'Kills 99.9% of bacteria', 'Cuffs & pleats perfection'],
  },
  {
    id: 'shoe-spa',
    title: 'Sneaker & Leather Spa',
    tagline: 'Deep Restoration & Deodorization',
    description: 'Artisanal cleaning, midsole scrub, suede rejuvenation, leather nourishing, and antimicrobial UV treatment for prized footwear.',
    icon: 'Footprints',
    image: '/images/doorstep-delivery.jpg',
    startingPrice: '₹299/pair',
    features: ['Ultrasonic deep stain lift', 'Crep & suede conditioning', 'Midsole unyellowing', 'Anti-fungal UV ozone chamber'],
  },
  {
    id: 'bridal-wear',
    title: 'Bridal & Designer Wear Care',
    tagline: 'Heirloom Fabric Protection',
    description: 'White-glove care for heavy zardozi, raw silk sarees, designer gowns, lehengas, and sherwanis with acid-free storage packing.',
    icon: 'Crown',
    image: '/images/dry-cleaning.jpg',
    startingPrice: '₹499/pc',
    features: ['Hand spotting of delicate zari', 'Micro-mesh net protection', 'Museum-grade preservation', 'Color vibrancy lock'],
  },
  {
    id: 'home-linen',
    title: 'Curtains, Quilts & Linen Spa',
    tagline: 'Deep Allergen Removal',
    description: 'Large-capacity gentle washing and thermal steaming for blackout curtains, down duvets, blankets, and luxury bedspreads.',
    icon: 'Layers',
    image: '/images/hero-couple.jpg',
    startingPrice: '₹189/panel',
    features: ['Dust mite & allergen flush', 'Eco down-feather drying', 'Crease-free curtain hanging', 'Natural lavender freshness'],
  },
];

export const CALCULATOR_ITEMS: ServiceItem[] = [
  // Men
  { id: 'm-shirt', name: 'Men Shirt / T-Shirt', category: 'men', price: 89, unit: 'piece', popular: true },
  { id: 'm-trouser', name: 'Trousers / Chinos / Jeans', category: 'men', price: 99, unit: 'piece', popular: true },
  { id: 'm-suit', name: 'Men 2-Piece Suit', category: 'men', price: 349, unit: 'set', popular: true },
  { id: 'm-blazer', name: 'Blazer / Sports Jacket', category: 'men', price: 249, unit: 'piece' },
  { id: 'm-kurta', name: 'Kurta / Pyjama Set', category: 'men', price: 169, unit: 'set' },
  
  // Women
  { id: 'w-kurti', name: 'Kurti / Tunic', category: 'women', price: 99, unit: 'piece', popular: true },
  { id: 'w-saree', name: 'Silk / Georgette Saree', category: 'women', price: 199, unit: 'piece', popular: true },
  { id: 'w-lehenga', name: 'Designer Lehenga (3-Pc)', category: 'women', price: 599, unit: 'set', popular: true },
  { id: 'w-dress', name: 'Evening Gown / Dress', category: 'women', price: 289, unit: 'piece' },
  { id: 'w-salwar', name: 'Salwar Kameez Suit', category: 'women', price: 189, unit: 'set' },

  // Household
  { id: 'h-bedsheet', name: 'Double Bedsheet & Pillows', category: 'household', price: 149, unit: 'set', popular: true },
  { id: 'h-blanket', name: 'Duvet / Heavy Blanket', category: 'household', price: 299, unit: 'piece', popular: true },
  { id: 'h-curtain', name: 'Curtain Panel (per panel)', category: 'household', price: 179, unit: 'panel' },
  { id: 'h-towel', name: 'Bath Towels (Pack of 2)', category: 'household', price: 79, unit: 'pack' },

  // Specialty
  { id: 's-sneakers', name: 'Sneaker Deep Spa', category: 'specialty', price: 299, unit: 'pair', popular: true },
  { id: 's-leather', name: 'Leather Jacket Cleaning', category: 'specialty', price: 699, unit: 'piece' },
  { id: 's-handbag', name: 'Luxury Handbag Spa', category: 'specialty', price: 499, unit: 'piece' },
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Schedule Your Pickup',
    subtitle: 'Takes 30 seconds online',
    description: 'Select your preferred 2-hour doorstep pickup slot or message us on WhatsApp. No payment needed upfront.',
    icon: 'CalendarClock',
    badge: 'Instant Confirmation',
  },
  {
    step: '02',
    title: 'Contactless Doorstep Collection',
    subtitle: 'Free pickup above ₹350',
    description: 'Our trained EcoDry captain arrives with sterile reusable hampers to safely weigh or itemize your garments.',
    icon: 'Truck',
    badge: 'RFID Tagging',
  },
  {
    step: '03',
    title: 'Eco-Pure Organic Treatment',
    subtitle: 'German non-toxic solvents',
    description: 'Fabrics are sorted by weave and color, treated with bio-safe enzymes, and processed in closed-loop eco machines.',
    icon: 'Droplets',
    badge: '100% PERC-Free',
  },
  {
    step: '04',
    title: 'Steam Finishing & Quality Audit',
    subtitle: 'Razor creases & hygiene pack',
    description: 'Garments are pressed on vacuum tables, checked against a 6-point quality checklist, and packed in breathable bags.',
    icon: 'CheckCircle2',
    badge: 'Zero-Shine Finish',
  },
  {
    step: '05',
    title: 'Prompt Doorstep Delivery',
    subtitle: 'Within 24 to 48 hours',
    description: 'Your crisp, fresh-smelling clothes are returned on custom hangers or origami folds, ready to wear.',
    icon: 'PackageCheck',
    badge: 'Express Available',
  },
];

export const COMPARISON_DATA = [
  {
    feature: 'Cleaning Solvent',
    ecodry: 'Organic Biodegradable & Hydrocarbon (Safe for baby clothes)',
    traditional: 'Perchloroethylene (PERC) - Toxic carcinogen',
    highlight: true,
  },
  {
    feature: 'Water Conservation',
    ecodry: 'Closed-loop multi-stage water filtration (Saves 80% water)',
    traditional: 'Heavy water discharge and untreated drainage',
    highlight: true,
  },
  {
    feature: 'Garment Smell',
    ecodry: 'Crisp, natural botanical fresh breeze',
    traditional: 'Pungent chemical and petroleum dry-cleaning stench',
    highlight: false,
  },
  {
    feature: 'Fabric Lifespan',
    ecodry: 'Gentle temperature cycles preserve fiber elasticity (3x longer)',
    traditional: 'High thermal agitation causes color fade and fiber brittleness',
    highlight: false,
  },
  {
    feature: 'Tracking & Care',
    ecodry: 'Individual barcode RFID scan from pickup to delivery',
    traditional: 'Paper staple tags that punch holes in delicate fabrics',
    highlight: true,
  },
  {
    feature: 'Pickup & Delivery',
    ecodry: 'Free doorstep pickup & delivery on orders above ₹350',
    traditional: 'Requires personal store visits & carrying heavy bags',
    highlight: false,
  },
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Priya Narayanan',
    role: 'Fashion Designer, Indiranagar',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    service: 'Bridal & Silk Saree Care',
    text: 'I entrusted my heirloom Kanjeevaram wedding saree to EcoDry after a bad experience elsewhere. They returned it in pristine condition without any chemical smell. The gold zari sparkled like day one!',
    verified: true,
  },
  {
    id: 2,
    name: 'Rohit Malhotra',
    role: 'Tech Executive, Whitefield',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    service: 'Weekly Wash & Steam Iron',
    text: 'The pickup is always right on time. My shirts are crisply ironed with zero collar shine. Plus knowing they use recycled water and non-toxic solvents gives immense peace of mind.',
    verified: true,
  },
  {
    id: 3,
    name: 'Ananya Deshmukh',
    role: 'Doctor & Mother, Koramangala',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    service: 'Quilts & Hypoallergenic Laundry',
    text: 'My children have sensitive skin, so traditional dry cleaning chemical residues were always a worry. EcoDry’s bio-friendly process leaves zero harsh odor. Absolutely the best laundry service in town.',
    verified: true,
  },
  {
    id: 4,
    name: 'Vikram Sengupta',
    role: 'Corporate Consultant, HSR Layout',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    service: 'Bespoke Suits & Sneaker Spa',
    text: 'Revived my muddy white designer sneakers back to showroom quality! Their suit pressing is top tier. The live tracking and automated WhatsApp updates make the entire experience frictionless.',
    verified: true,
  },
];

export const FAQS = [
  {
    question: 'What is the difference between EcoDry organic cleaning and regular dry cleaning?',
    answer: 'Traditional dry cleaners use Perchloroethylene (PERC), a harsh petroleum-derived chemical that leaves an oily residue and odor, damages fibers, and is harmful to skin. EcoDry uses organic, biodegradable hydrocarbon solvents and gentle steam technology that leaves your garments smelling naturally fresh and extends fabric life by up to 3x.',
  },
  {
    question: 'How do I avail free pickup and delivery?',
    answer: 'Any order with a total value of ₹350 or more is automatically eligible for 100% Free Doorstep Pickup and Delivery. For orders below ₹350, a nominal doorstep convenience charge of ₹49 applies.',
  },
  {
    question: 'What is your standard turnaround time?',
    answer: 'Our standard turnaround is 24 to 48 hours depending on the fabric and service type. For urgent needs, we provide a 12-hour Express Delivery option upon request at a small convenience fee.',
  },
  {
    question: 'How do you guarantee my clothes won’t get lost or mixed up?',
    answer: 'Every single garment is assigned a unique digital barcode and scanned at 4 distinct checkpoints: at pickup, at solvent sorting, during pressing, and before final bagging. You can track your bag status live via WhatsApp.',
  },
  {
    question: 'Can you handle delicate designer wear, lehengas, and silk sarees?',
    answer: 'Yes! We specialize in designer wear. Each luxury garment undergoes individual fabric analysis, colorfastness testing, and manual stain spotting using specialized European spotting guns before gentle organic cleaning.',
  },
  {
    question: 'What areas do you currently serve for doorstep pickup?',
    answer: 'We currently cover all major sectors including Indiranagar, Koramangala, Whitefield, HSR Layout, Bellandur, JP Nagar, Malleshwaram, and surrounding residential hubs with scheduled morning and evening slots.',
  },
];
