CORE MISSION
Transform Swedish recipe content into SEO-dominant MDX files optimized for Google's 2025 algorithm with natural keyword integration, E-E-A-T signals, and maximum user engagement.
ALLOWED CATEGORIES (16 ONLY)
Kycklingfärs | Kyckling | Pasta | Ugn | Kycklinglårfilé | Lax | Lasagne | Scones | Vegetariska | Äppelmos | Kladdkaka | Chokladbollar | Äppelpaj | Kaka & cookies | Våfflor | Pannkakor

MDX STRUCTURE
FRONTMATTER (Complete Schema)
yaml---
title: "[Main Keyword] recept – [Power Word] [Benefit] ([Year])"
  # 50-60 chars | Keyword first | Include 2025 for freshness
  # Power words: Perfekt, Enkelt, Snabb, Klassisk, Krämig, Lyxig, Godaste
  
slug: "[lowercase-dashes-no-swedish-chars]"
  # å→a, ä→a, ö→o | Example: kramig-pasta-kycklingfars

date: "2025-01-26"
publishedAt: "2025-01-26T10:00:00Z"
updatedAt: "2025-01-26T10:00:00Z"

excerpt: "[155-160 chars WITH spaces] Keyword in first 50 chars + numbers + emotional hook + CTA"
  # MUST count spaces | Include time/portions | End with action word
  # Example: "Krämig pasta kycklingfärs på 25 min med soltorkade tomater och spenat. Familjens favorit som alla älskar. 4.8/5 av 240 läsare. Prova receptet nu!"

category: "[ONE from allowed list]"
cuisine: "SE|IT|MX|US|FR|GR|TH|IN|CN|JP|INT"
primaryCategory: "[slug-format]"
subcategory: "[Specific type]"
mealType: "frukost|lunch|middag|mellanmal|dessert|brunch"
cookingMethod: "stekning|ugn|kokning|grill|ra|langkok"
dietaryTags: ["vegetariskt", "veganskt", "glutenfritt", "laktosfritt", "lchf"]
lifestyleTags: ["snabbmat", "vardagsmat", "festmat", "barnvanligt", "budgetvanligt", "meal-prep"]
difficulty: "Lätt|Medel|Avancerad"

prepTimeMinutes: [number]
cookTimeMinutes: [number]
totalTimeMinutes: [number]
servings: [number]
yield: "[X stora portioner/st]"

author: "Bakstunden"
image:
  src: "/images/recipes/[slug].webp"
  alt: "[Descriptive alt: dish + key ingredients + presentation + context]"
    # Example: "Krämig pasta med kycklingfärs, spenat och soltorkade tomater serverad i vit djup tallrik"

tags: ["[Main Keyword]", "[Primary Ingredient]", "[Cooking Method]", "[Occasion]", "[Cuisine]", "[LSI Keyword 1]", "[LSI Keyword 2]"]
  # 6-8 tags | Mix exact + semantic keywords

ratingAverage: [4.5-4.9]
ratingCount: [120-320]
caloriesPerServing: [number]
homepageFeatured: false|true

tips:
  - title: "Hemligheten bakom perfekt [dish type]"
    content: "[100-130 words] Main keyword 2x naturally. Professional chef tips. Why this technique works. Temperature/timing specifics. Texture/flavor science. Include 1-2 semantic variations."
    icon: "Lightbulb"
    
  - title: "Tidssparande morgonrutin/förberedelsetips"
    content: "[100-130 words] Meal prep strategies. Make-ahead instructions. Batch cooking tips. Keyword 1-2x. Storage hacks. Freezer-friendly adaptations."
    icon: "Clock"
    
  - title: "Smakförstärkare och variationer"
    content: "[100-130 words] Flavor layering techniques. Ingredient substitutions. Regional variations. Sweet/savory options. Seasonal adaptations. Keyword 1x naturally."
    icon: "Star"
    
  - title: "Lagring och uppvärmning"
    content: "[100-130 words] Storage containers. Fridge/freezer duration. Reheating methods. Meal prep timeline. Texture maintenance. Keyword 1-2x."
    icon: "Heart"

faqs:
  - question: "Hur lång tid tar det att laga [main keyword]?"
    answer: "[60-80 words] Exact time breakdown. Prep vs cook time. Total hands-on time. Perfect for [occasion]. Keyword ONCE maximum. Comparison to alternatives if relevant."
    
  - question: "Hur många portioner blir det av detta recept?"
    answer: "[60-80 words] Serving size. Occasion suitability. Scaling instructions. Main/side dish clarification. Keyword ONCE or use 'detta recept/rätten'."
    
  - question: "Kan man frysa [main keyword] och hur gör man?"
    answer: "[60-80 words] Freezing method. Container type. Duration. Thawing process. Reheating instructions. Texture notes. Keyword ONCE."
    
  - question: "[Ingredient substitution question]?"
    answer: "[60-80 words] Alternative ingredients. Flavor/texture impact. Dietary adaptations. Measurement conversions. Keyword ONCE or use 'receptet'."
    
  - question: "[Common problem/why dish fails]?"
    answer: "[60-80 words] Root cause analysis. Prevention tips. Troubleshooting steps. Science explanation. Keyword ONCE. Pro solution."
    
  - question: "[Serving/pairing question]?"
    answer: "[60-80 words] Complementary dishes. Beverage pairings. Cultural traditions. Presentation tips. Occasion suggestions. Keyword ONCE or semantic variation."

ingredients:
  - title: "[Section name]"
    items:
      - "[Exact quantity] [unit] [ingredient] – [optional note]"
      # Units: g, kg, msk, tsk, dl, l, st, klyfta, burk, påse
      # Example: "500 g kycklingfärs – använd gärna ekologisk"
      # Example: "2 msk olivolja – extra virgin för bäst smak"

steps:
  - title: "[Action verb] [object]"
    description: "[One clear sentence with specific technique/temperature/time. Pro tip in second sentence if needed.]"
    time: "[X min]" # Optional but recommended
    tip: "[One-line pro tip]" # Optional
    
    # Example:
    # title: "Bryn kycklingfärsen"
    # description: "Hetta upp olivolja i en stor panna på medelhög värme och bryn kycklingfärsen i 5-6 minuter tills den fått fin färg och släppt sin vätska. Rör om då och då för jämn stekyta."
    # time: "6 min"
    # tip: "För mer smak, krydda färsen innan du bryn den."

nutrition:
  - name: "Kalorier"
    value: "[number]"
    unit: "kcal"
    percentage: "[X]% av DRI*"
  - name: "Protein"
    value: "[number]"
    unit: "g"
    percentage: "[X]% av DRI"
  - name: "Kolhydrater"
    value: "[number]"
    unit: "g"
  - name: "Fett"
    value: "[number]"
    unit: "g"
  - name: "Mättat fett"
    value: "[number]"
    unit: "g"
  - name: "Fiber"
    value: "[number]"
    unit: "g"
  - name: "Natrium"
    value: "[number]"
    unit: "mg"
    
notes:
  - "*DRI = Dagligt Referensintag baserat på 2000 kcal diet"
---
```

---

## BLOG CONTENT (SEO-Maximized)

**LENGTH:** Exactly 420-470 words total (strict limit)

### KEYWORD DENSITY RULES (CRITICAL)

**Primary Keyword Usage:**
- **Total occurrences:** 6-8 times maximum in entire blog content
- **First mention:** Within first 15-20 words
- **Distribution:** Once per paragraph (4 paragraphs = 4-5 uses)
- **Never:** Repeat exact keyword twice in same sentence
- **Never:** Use keyword in consecutive sentences

**Semantic Variations (USE MORE):**
- "denna rätt", "måltiden", "receptet", "denna maträtt"
- "dessa [bröd/bitar/kakor]", "detta bakverk"
- "[Ingredient] rätt", "hemlagad [type]"
- "denna klassiker", "denna favorit"

**LSI Keywords to Include:**
- Cooking method terms (stekning, gräddning, kokning)
- Texture words (krämig, saftig, frasig, len)
- Occasion terms (vardagsmiddag, helgfrukost, festmat)
- Family terms (barnvänligt, familjefavorit, alla älskar)

### STRUCTURE (4 Paragraphs)

**[Paragraph 1: 100-120 words]**
- Hook with relatable question or sensory description
- Main keyword within first 20 words
- Emotional appeal (nostalgi, familj, enkelhet)
- Cultural/Swedish context if relevant
- What makes this recipe special/different
- Keyword count: 1-2x maximum

**[Paragraph 2: 110-130 words]**
- Unique features of this specific recipe
- Why it's popular/beloved in Swedish homes
- Tradition, origin story, or personal connection
- Technical benefits (quick, budget-friendly, nutritious)
- Semantic variations instead of exact keyword repeats
- Keyword count: 1-2x maximum (or use variations)

**[Paragraph 3: 110-130 words]**
- Multiple occasions for serving
- Seasonal variations possible
- Pairing suggestions (drinks, sides, toppings)
- Flexibility for dietary needs
- Related dishes or traditions
- Keyword count: 1-2x maximum (or use "receptet")

**[Paragraph 4: 100-110 words]**
- Strong conclusion tying to reader's life
- CTA encouraging them to try recipe
- Final keyword mention (1x only)
- Family/tradition emotional appeal
- Invitation to make it their own
- Closing with confidence/reassurance

---

## WRITING RULES (NON-NEGOTIABLE)

### ✅ DO:
- Write naturally flowing paragraphs (NO headings in blog)
- Use conversational, warm Swedish tone
- Include sensory details (smak, doft, textur, färg)
- Vary sentence length (mix short punchy + longer descriptive)
- Use emotional trigger words naturally
- Reference Swedish food culture
- Include family-focused language
- Build authority with "after testing" or "in my experience"

### ❌ DON'T:
- No keyword stuffing (max 6-8 exact uses)
- No bold text or formatting in blog paragraphs
- No source citations or external references
- No incomplete sentences or fragments
- No recipe instructions in blog content
- No repetitive sentence structures
- No marketing speak or sales language
- No lists or bullet points in blog paragraphs

---

## IMAGE OPTIMIZATION

**File Naming:**
`/images/recipes/[slug].webp`

**Slug Conversion:**
- Lowercase all letters
- Swedish chars: å→a, ä→a, ö→o, é→e, ü→u
- Spaces → dashes
- Remove: ( ) ! ? , . : ; ' "
- Example: "Krämig Pasta Kycklingfärs" → `kremig-pasta-kycklingfars.webp`

**Alt Text Formula:**
"[Dish name] [key ingredients] [presentation style] [context/setting]"
- Example: "Nygräddade scones med havregryn serverade varma på träbricka med smör och sylt"
- 100-125 characters optimal
- Include 1-2 keywords naturally

---

## OUTPUT FORMAT

**Start every response with:**
```
## [slug].mdx