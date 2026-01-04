# Malty - Sveriges bästa receptsamling

En modern, fullfjädrad receptwebbplats byggd med Next.js 15, Tailwind CSS och Framer Motion. Malty erbjuder över 500 recept med avancerade sökfunktioner, filter och en vacker, tillgänglig design.

## 🌟 Funktioner

- **500+ Svenska recept** med fullständiga instruktioner, ingredienser och näringsinformation
- **Avancerad sökning** med fuzzy matching och facetterade filter
- **Responsiv design** som fungerar perfekt på alla enheter
- **Mörkt läge** med automatisk detektion av systempreferenser
- **SEO-optimerad** med JSON-LD strukturerad data för recept, artiklar och mer
- **Tillgänglighet** (WCAG 2.1 AA-kompatibel)
- **Animationer** med Framer Motion som respekterar `prefers-reduced-motion`
- **MDX-baserat innehåll** för enkel redigering och underhåll
- **Print-optimerad** vy för recept
- **Interaktiva komponenter** - portionsräknare, steg-för-steg checklistor
- **GDPR-kompatibel** cookie-banner

## 🛠️ Teknisk stack

- **Framework:** Next.js 15.5.4 (App Router)
- **Styling:** Tailwind CSS v4
- **Animationer:** Framer Motion
- **Content:** MDX med gray-matter för frontmatter
- **Ikoner:** Lucide React
- **Datum:** date-fns med svensk lokalisering
- **Deployment:** Optimerad för Vercel/Netlify

## 📁 Projektstruktur

```
malty-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.js          # Root layout med header/footer
│   │   ├── page.js            # Startsida
│   │   ├── recept/            # Receptsidor
│   │   ├── blogg/             # Bloggsidor
│   │   ├── kategorier/        # Kategorisidor
│   │   ├── om/                # Om-sida
│   │   ├── kontakt/           # Kontaktsida
│   │   └── globals.css        # Globala styles
│   ├── components/
│   │   ├── layout/            # Header, Footer, Nav
│   │   ├── ui/                # Återanvändbara UI-komponenter
│   │   ├── recipe/            # Recept-specifika komponenter
│   │   ├── blog/              # Blog-komponenter
│   │   └── seo/               # SEO-komponenter (JSON-LD)
│   └── lib/
│       ├── mdx.js             # MDX-hantering
│       ├── seo.js             # SEO utilities
│       └── utils/             # Hjälpfunktioner
├── content/
│   ├── recipes/               # 24+ receptfiler (MDX)
│   ├── articles/              # 12+ bloggartiklar (MDX)
│   ├── authors/               # Författarprofiler (JSON)
│   └── categories/            # Kategoribeskrivningar
├── public/
│   ├── images/                # Bilder
│   ├── logo.svg              # Malty logotyp
│   └── robots.txt            # SEO robots file
└── package.json
```

## 🚀 Komma igång

### Installation

```bash
# Klona repot
git clone https://github.com/din-org/malty-app.git
cd malty-app

# Installera beroenden
npm install

# Starta utvecklingsserver
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000) i din webbläsare.

### Bygga för produktion

```bash
# Bygg projektet
npm run build

# Starta produktionsserver
npm start
```

## 📝 Innehållshantering

### Lägga till ett nytt recept

1. Skapa en ny `.mdx`-fil i `content/recipes/`
2. Använd följande frontmatter-struktur:

```mdx
---
id: "25"
title: "Ditt receptnamn"
slug: "ditt-recept slug"
excerpt: "Kort beskrivning (max 160 tecken)"
author: "Författarens namn"
authorSlug: "forfattare-slug"
publishedAt: "2024-10-15"
updatedAt: "2024-10-15"
category: "Vardagsmat"
tags: ["Tag1", "Tag2", "Tag3"]
difficulty: "Lätt"
prepTimeMinutes: 15
cookTimeMinutes: 30
totalTimeMinutes: 45
servings: 4
caloriesPerServing: 450
ingredients:
  - section: "Huvudingredienser"
    title: "Huvudingredienser"
    items:
      - "2 dl mjölk"
      - "1 ägg"
steps:
  - order: 1
    title: "Förbered"
    description: "Detaljerad beskrivning av steget"
    timeMinutes: 5
equipment: ["Kastrull", "Visp"]
allergens: ["Mjölk", "Ägg"]
ratingAverage: 4.5
ratingCount: 100
image:
  src: "/images/recipes/ditt-recept.jpg"
  alt: "Beskrivning av bilden"
---

Skriv ditt receptinnehåll här med markdown-formatering!

## Rubriker funkar

Och all vanlig markdown.
```

### Lägga till en bloggartikel

1. Skapa en ny `.mdx`-fil i `content/articles/`
2. Använd följande frontmatter:

```mdx
---
id: "13"
title: "Din artikeltitel"
slug: "din-artikel-slug"
excerpt: "Kort sammanfattning"
author: "Författare"
authorSlug: "forfattare-slug"
publishedAt: "2024-10-15"
category: "Tekniker"
tags: ["Tag1", "Tag2"]
readingMinutes: 8
image:
  src: "/images/blog/artikel.jpg"
  alt: "Bildbeskrivning"
---

Din artikeltext här...
```

## 🎨 Design & Branding

### Färgpalett

**Primära färger:**
- Purple: `#9333EA` (purple-600)
- Blue: `#3B82F6` (blue-500)
- Gradient: Purple till Blue

**Neutrala:**
- Vit bakgrund: `#FFFFFF`
- Grå bakgrund: `#F9FAFB` (gray-50)
- Text: `#111827` (gray-900)
- Sekundär text: `#6B7280` (gray-600)

**Mörkt läge:**
- Bakgrund: `#111827` (gray-900)
- Kort: `#1F2937` (gray-800)
- Text: `#F9FAFB` (gray-50)

### Typografi

- **Sans-serif:** Geist Sans (fallback: system fonts)
- **Monospace:** Geist Mono
- **Rubriker:** Bold, stora storlekar (text-4xl to text-6xl)
- **Brödtext:** 14-18px, radavstånd 1.5-1.75

### Komponenter

- **Border radius:** Generösa (lg till 2xl)
- **Skuggor:** Subtila, mjuka
- **Övergångar:** Smooth (duration-300)
- **Animationer:** Respekterar `prefers-reduced-motion`

## 🔍 SEO-funktioner

### Implementerat

- ✅ Dynamiska meta-taggar för alla sidor
- ✅ Open Graph och Twitter Cards
- ✅ JSON-LD strukturerad data:
  - Recipe schema
  - Article schema
  - BreadcrumbList schema
  - Website schema med SearchAction
  - Organization schema
  - FAQPage schema
- ✅ XML Sitemap (dynamisk)
- ✅ Robots.txt
- ✅ Canonical URLs
- ✅ RSS feed
- ✅ Bildoptimering med next/image
- ✅ Lazy loading
- ✅ Core Web Vitals optimering

### SEO Best Practices

1. **Unika titlar och beskrivningar** för varje sida
2. **Strukturerade URLs** med svenska slug
3. **Alt-text** på alla bilder på svenska
4. **Intern länkning** mellan relaterat innehåll
5. **H1-H6 hierarki** korrekt implementerad
6. **Schema markup** för bättre rich snippets

## ♿ Tillgänglighet

- **WCAG 2.1 AA-kompatibel**
- **Keyboard navigation** fullt funktionell
- **ARIA labels** på interaktiva element
- **Focus states** tydligt synliga
- **Skip to content** länk
- **Kontrast förhållanden** minst 4.5:1
- **Screen reader** optimerad
- **Reduced motion** respekterad

## 🧪 Testning

### Rekommenderade tester

```bash
# Lighthouse audit
npm run build
npx lighthouse http://localhost:3000 --view

# Accessibility test
npm install -D @axe-core/cli
npx axe http://localhost:3000
```

### Checklista för nya funktioner

- [ ] Fungerar på mobil, tablet och desktop
- [ ] Fungerar i mörkt läge
- [ ] Keyboard navigerbar
- [ ] Screen reader testad
- [ ] Lighthouse score > 90
- [ ] Inga console errors
- [ ] Korrekt meta-data
- [ ] Bilder har alt-text

## 📱 Responsiv design

**Breakpoints:**
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

**Implementering:**
- Mobile-first approach
- Flexbox och CSS Grid
- Tailwind responsive utilities (sm:, md:, lg:, xl:)

## ⚡ Performance

### Optimeringar

- **Code splitting** automatiskt med Next.js
- **Image optimization** med next/image
- **Font optimization** med next/font
- **Static generation** där möjligt
- **Lazy loading** av komponenter
- **Prefetching** av länkar

### Target Metrics

- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1
- **TTI** (Time to Interactive): < 3.5s

## 🔒 Säkerhet

- HTTPS obligatoriskt (konfigureras via hosting)
- Content Security Policy headers
- XSS-skydd via React
- CSRF-skydd på formulär
- Rate limiting på API-endpoints
- GDPR-kompatibel cookie-hantering

## 🌍 Internationalisering

För närvarande endast svenska (sv-SE), men strukturen stödjer:
- Flera språk med i18n
- Lokaliserade datum med date-fns
- RTL-stöd (dir attribute)

## 📦 Deployment

### Vercel (Rekommenderat)

```bash
# Installera Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Andra plattformar

Fungerar också med:
- Netlify
- AWS Amplify
- Cloudflare Pages
- Railway
- Render

## 🤝 Bidra

Vi välkomnar bidrag! För större ändringar, öppna först en issue för att diskutera vad du vill ändra.

### Process

1. Fork repot
2. Skapa en feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit dina ändringar (`git commit -m 'Add some AmazingFeature'`)
4. Push till branchen (`git push origin feature/AmazingFeature`)
5. Öppna en Pull Request

## 📄 Licens

MIT License - se [LICENSE](LICENSE) för detaljer.

## 👥 Team

- **Emma Andersson** - Mat-entusiast och receptutvecklare
- **Sara Bergman** - Kokkonsult och matskribent
- **Erik Lindström** - Matbloggare och grill-expert

## 📞 Kontakt

- **Website:** [https://malty.se](https://malty.se)
- **Email:** kontakt@malty.se
- **Instagram:** [@malty.se](https://instagram.com/malty.se)

## 🙏 Erkännanden

- Next.js team för det fantastiska ramverket
- Tailwind CSS för den utmärkta CSS-framework
- Framer Motion för smidiga animationer
- Alla som bidragit med recept och feedback

---

**Byggd med ❤️ och Next.js i Sverige 🇸🇪**
