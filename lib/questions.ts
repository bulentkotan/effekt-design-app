import { Question } from '@/types'

export const questions: Question[] = [
  {
    id: 1,
    title: 'What feeling should your outdoor space evoke?',
    subtitle: 'Select 1–3 images that speak to you. These set the tone for your entire design.',
    maxSelections: 3,
    options: [
      {
        id: 'serene-retreat',
        label: 'Serene Retreat',
        description: 'Zen garden, water feature, minimal planting, calm tones',
        imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80',
      },
      {
        id: 'tropical-paradise',
        label: 'Tropical Paradise',
        description: 'Lush dense planting, palms, vibrant flowers, resort feel',
        imageUrl: 'https://images.unsplash.com/photo-1600066979478-0d94d8fed1f7?w=800&q=80',
      },
      {
        id: 'contemporary-elegance',
        label: 'Contemporary Elegance',
        description: 'Clean lines, architectural plants, modern materials',
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      },
      {
        id: 'desert-luxe',
        label: 'Desert Luxe',
        description: 'Native plants, sand tones, modern desert aesthetic',
        imageUrl: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80',
      },
      {
        id: 'mediterranean-warmth',
        label: 'Mediterranean Warmth',
        description: 'Terracotta, olive trees, lavender, warm stone',
        imageUrl: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=800&q=80',
      },
      {
        id: 'family-oasis',
        label: 'Family Oasis',
        description: 'Lawn, shade trees, play areas, practical but beautiful',
        imageUrl: 'https://images.unsplash.com/photo-1592012428012-ba9d1cf9ad98?w=800&q=80',
      },
    ],
  },
  {
    id: 2,
    title: 'Which colour palette draws you in?',
    subtitle: 'Colour sets the emotional tone. Pick the palette that feels most like home.',
    maxSelections: 3,
    options: [
      {
        id: 'lush-greens',
        label: 'Lush Greens',
        description: 'All-green garden, varied textures and shades',
        imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
      },
      {
        id: 'whites-creams',
        label: 'Whites & Creams',
        description: 'White flowering garden, pale stone, clean and bright',
        imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=800&q=80',
      },
      {
        id: 'bold-vibrant',
        label: 'Bold & Vibrant',
        description: 'Bougainvillea magenta, tropical reds, statement colour',
        imageUrl: 'https://images.unsplash.com/photo-1724088684122-0eff7380c62b?w=800&q=80',
      },
      {
        id: 'earth-sand',
        label: 'Earth & Sand',
        description: 'Warm neutrals, terracotta, golden grasses, desert tones',
        imageUrl: 'https://images.unsplash.com/photo-1504198266287-1659872e6590?w=800&q=80',
      },
      {
        id: 'blues-silvers',
        label: 'Blues & Silvers',
        description: 'Silvery foliage, blue agave, cool tones',
        imageUrl: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&q=80',
      },
      {
        id: 'mixed-seasonal',
        label: 'Mixed Seasonal',
        description: 'Varied flowering through the year, dynamic colour',
        imageUrl: 'https://images.unsplash.com/photo-1559563362-c667ba5f5480?w=800&q=80',
      },
    ],
  },
  {
    id: 3,
    title: 'How planted should your space feel?',
    subtitle: 'From dense jungle to minimal sculpture garden — how much green do you want?',
    maxSelections: 3,
    options: [
      {
        id: 'maximalist-jungle',
        label: 'Maximalist Jungle',
        description: 'Dense, layered, immersive tropical planting',
        imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&q=80',
      },
      {
        id: 'structured-manicured',
        label: 'Structured & Manicured',
        description: 'Formal hedges, topiaries, geometric shapes',
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80',
      },
      {
        id: 'naturalistic-flow',
        label: 'Naturalistic Flow',
        description: 'Soft, organic drifts of grasses and perennials',
        imageUrl: 'https://images.unsplash.com/photo-1501004318855-ee2d3aeb391d?w=800&q=80',
      },
      {
        id: 'minimal-architectural',
        label: 'Minimal & Architectural',
        description: 'Few dramatic specimens, lots of hardscape',
        imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      },
      {
        id: 'edible-garden',
        label: 'Edible Garden',
        description: 'Fruit trees, herbs, vegetables integrated beautifully',
        imageUrl: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80',
      },
      {
        id: 'mixed-zones',
        label: 'Mixed Zones',
        description: 'Different areas with different planting densities',
        imageUrl: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&q=80',
      },
    ],
  },
  {
    id: 4,
    title: 'Which materials and surfaces appeal to you?',
    subtitle: 'Hardscape forms the bones of your garden. What textures and materials resonate?',
    maxSelections: 3,
    options: [
      {
        id: 'natural-stone',
        label: 'Natural Stone',
        description: 'Limestone, travertine, organic textures',
        imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      },
      {
        id: 'polished-concrete',
        label: 'Polished Concrete',
        description: 'Smooth, modern, grey tones',
        imageUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
      },
      {
        id: 'warm-wood',
        label: 'Warm Wood Decking',
        description: 'Timber or composite, warm and inviting',
        imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
      },
      {
        id: 'porcelain-tiles',
        label: 'Porcelain Tiles',
        description: 'Large-format, contemporary, low maintenance',
        imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',
      },
      {
        id: 'pebbles-gravel',
        label: 'Pebbles & Gravel',
        description: 'Loose aggregate, zen gardens, drainage-friendly',
        imageUrl: 'https://images.unsplash.com/photo-1671379483053-c161929f3a08?w=800&q=80',
      },
      {
        id: 'mixed-materials',
        label: 'Mixed Materials',
        description: 'Stone, wood, and modern elements combined',
        imageUrl: 'https://images.unsplash.com/photo-1685067619355-f33d1622f5b4?w=800&q=80',
      },
    ],
  },
  {
    id: 5,
    title: 'Does water play a role in your dream garden?',
    subtitle: 'Water brings life, sound, and movement. What calls to you?',
    maxSelections: 3,
    options: [
      {
        id: 'swimming-pool',
        label: 'Swimming Pool',
        description: 'Infinity edge, geometric, resort-style',
        imageUrl: 'https://images.unsplash.com/photo-1572331165267-854da2b021b1?w=800&q=80',
      },
      {
        id: 'reflecting-pool',
        label: 'Reflecting Pool',
        description: 'Shallow, architectural, mirror-like calm',
        imageUrl: 'https://images.unsplash.com/photo-1738099067683-d1a020a3988a?w=800&q=80',
      },
      {
        id: 'fountain',
        label: 'Fountain / Bubbler',
        description: 'Vertical water feature, courtyard fountain',
        imageUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80',
      },
      {
        id: 'natural-stream',
        label: 'Natural Stream',
        description: 'Organic flowing water, stepping stones',
        imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
      },
      {
        id: 'plunge-pool',
        label: 'Plunge Pool / Jacuzzi',
        description: 'Small, intimate water for cooling',
        imageUrl: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80',
      },
      {
        id: 'no-water',
        label: 'No Water Feature',
        description: 'Prefer dry landscape',
        imageUrl: 'https://images.unsplash.com/photo-1723830304835-74bf8c479c6d?w=800&q=80',
      },
    ],
  },
  {
    id: 6,
    title: 'How will you use your outdoor space?',
    subtitle: 'Function shapes form. Tell us how you live outdoors.',
    maxSelections: 3,
    options: [
      {
        id: 'al-fresco-dining',
        label: 'Al Fresco Dining',
        description: 'Outdoor kitchen, BBQ, large dining table, pergola',
        imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',
      },
      {
        id: 'lounge-relax',
        label: 'Lounge & Relax',
        description: 'Daybed, fire pit, conversation seating',
        imageUrl: 'https://images.unsplash.com/photo-1686167990035-f0f53eda0408?w=800&q=80',
      },
      {
        id: 'active-family',
        label: 'Active Family',
        description: 'Lawn, play area, sport features with clever screening',
        imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
      },
      {
        id: 'entertain-host',
        label: 'Entertain & Host',
        description: 'Bar area, multiple seating zones, statement lighting',
        imageUrl: 'https://images.unsplash.com/photo-1661368011571-18e5f7c2801d?w=800&q=80',
      },
      {
        id: 'quiet-contemplation',
        label: 'Quiet Contemplation',
        description: 'Reading nook, hammock, intimate garden room',
        imageUrl: 'https://images.unsplash.com/photo-1596908439454-a183bdad0213?w=800&q=80',
      },
      {
        id: 'multi-functional',
        label: 'Multi-functional',
        description: 'Flexible spaces that serve many purposes',
        imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
      },
    ],
  },
  {
    id: 7,
    title: 'What overhead elements interest you?',
    subtitle: 'In Dubai, shade is everything. How would you like to create it?',
    maxSelections: 3,
    options: [
      {
        id: 'pergola-climbers',
        label: 'Pergola with Climbers',
        description: 'Wooden or metal, covered in jasmine or bougainvillea',
        imageUrl: 'https://images.unsplash.com/photo-1651469322192-32acbc41a367?w=800&q=80',
      },
      {
        id: 'shade-sail',
        label: 'Shade Sail / Tensile',
        description: 'Modern fabric structures, geometric tension',
        imageUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
      },
      {
        id: 'tree-canopy',
        label: 'Natural Tree Canopy',
        description: 'Large shade trees creating dappled light',
        imageUrl: 'https://images.unsplash.com/photo-1602432942083-569d54aa1aab?w=800&q=80',
      },
      {
        id: 'covered-terrace',
        label: 'Covered Terrace / Cabana',
        description: 'Solid roof extension, outdoor room',
        imageUrl: 'https://images.unsplash.com/photo-1585549072022-f963f3b1b2e6?w=800&q=80',
      },
      {
        id: 'retractable-awning',
        label: 'Retractable Awning',
        description: 'Flexible, modern, tech-enabled',
        imageUrl: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&q=80',
      },
      {
        id: 'open-sky',
        label: 'Minimal / Open Sky',
        description: 'Prefer open, unobstructed outdoor feeling',
        imageUrl: 'https://images.unsplash.com/photo-1603288814992-fea3cac06b2d?w=800&q=80',
      },
    ],
  },
  {
    id: 8,
    title: 'How should your garden feel after dark?',
    subtitle: 'Lighting transforms a garden into a completely different world at night.',
    maxSelections: 3,
    options: [
      {
        id: 'dramatic-sculptural',
        label: 'Dramatic & Sculptural',
        description: 'Uplighting on trees, shadow play on walls',
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80',
      },
      {
        id: 'warm-intimate',
        label: 'Warm & Intimate',
        description: 'String lights, lanterns, candles, golden glow',
        imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80',
      },
      {
        id: 'modern-sleek',
        label: 'Modern & Sleek',
        description: 'Recessed LED, linear strips, architectural precision',
        imageUrl: 'https://images.unsplash.com/photo-1724220635456-e6ad3fc8478c?w=800&q=80',
      },
      {
        id: 'moonlit',
        label: 'Moonlit Garden',
        description: 'Subtle, barely there, gentle highlights',
        imageUrl: 'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=800&q=80',
      },
      {
        id: 'colourful-festive',
        label: 'Colourful & Festive',
        description: 'RGB-capable, party mode, dynamic',
        imageUrl: 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=800&q=80',
      },
      {
        id: 'functional-practical',
        label: 'Functional & Practical',
        description: 'Good visibility for pathways, security focus',
        imageUrl: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80',
      },
    ],
  },
  {
    id: 9,
    title: 'How important is screening from neighbours?',
    subtitle: 'Privacy shapes how freely you use your outdoor space.',
    maxSelections: 3,
    options: [
      {
        id: 'green-wall',
        label: 'Green Wall',
        description: 'Dense hedge or vertical garden for total privacy',
        imageUrl: 'https://images.unsplash.com/photo-1686303947209-e4c2af7090c3?w=800&q=80',
      },
      {
        id: 'layered-planting',
        label: 'Layered Planting',
        description: 'Trees, shrubs, groundcover creating depth',
        imageUrl: 'https://images.unsplash.com/photo-1590314900766-2977a0abcd28?w=800&q=80',
      },
      {
        id: 'modern-screen',
        label: 'Modern Screen Panels',
        description: 'Slatted wood, metal, or composite panels',
        imageUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
      },
      {
        id: 'combination',
        label: 'Combination',
        description: 'Mix of hard and soft screening',
        imageUrl: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&q=80',
      },
      {
        id: 'open-connected',
        label: 'Open & Connected',
        description: 'Not concerned about privacy',
        imageUrl: 'https://images.unsplash.com/photo-1687996107540-699b60c5d5aa?w=800&q=80',
      },
      {
        id: 'feature-wall',
        label: 'Feature Wall',
        description: 'Decorative boundary wall as a design element',
        imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      },
    ],
  },
  {
    id: 10,
    title: 'Select any spaces that inspire you',
    subtitle: 'Pick as many as you like. These help us understand your taste beyond categories.',
    maxSelections: 12,
    options: [
      {
        id: 'insp-minimal-pool',
        label: 'Minimal Pool Garden',
        imageUrl: 'https://images.unsplash.com/photo-1572331165267-854da2b021b1?w=800&q=80',
      },
      {
        id: 'insp-lush-courtyard',
        label: 'Lush Courtyard',
        imageUrl: 'https://images.unsplash.com/photo-1673141390222-2bd01b623bf3?w=800&q=80',
      },
      {
        id: 'insp-desert-modern',
        label: 'Desert Modern',
        imageUrl: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80',
      },
      {
        id: 'insp-tropical-villa',
        label: 'Tropical Villa',
        imageUrl: 'https://images.unsplash.com/photo-1636484807510-bc2ffbaf3241?w=800&q=80',
      },
      {
        id: 'insp-rooftop-garden',
        label: 'Rooftop Garden',
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80',
      },
      {
        id: 'insp-water-garden',
        label: 'Water Garden',
        imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
      },
      {
        id: 'insp-outdoor-kitchen',
        label: 'Outdoor Kitchen',
        imageUrl: 'https://images.unsplash.com/photo-1685291511970-3b96dc92f38c?w=800&q=80',
      },
      {
        id: 'insp-night-garden',
        label: 'Illuminated Night Garden',
        imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80',
      },
      {
        id: 'insp-med-terrace',
        label: 'Mediterranean Terrace',
        imageUrl: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=800&q=80',
      },
      {
        id: 'insp-zen-space',
        label: 'Zen Garden Space',
        imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80',
      },
      {
        id: 'insp-palm-avenue',
        label: 'Palm-Lined Avenue',
        imageUrl: 'https://images.unsplash.com/photo-1712150016582-06ba8020fcce?w=800&q=80',
      },
      {
        id: 'insp-contemporary-courtyard',
        label: 'Contemporary Courtyard',
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      },
    ],
  },
]

export const TOTAL_STEPS = 12
export const QUESTION_START_STEP = 3
export const QUESTION_END_STEP = 12

export function getStepForQuestion(questionId: number): number {
  return questionId + 2
}

export function getQuestionForStep(step: number): number {
  return step - 2
}
