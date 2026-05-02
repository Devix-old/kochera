import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import matter from 'gray-matter';
import { execFileSync } from 'node:child_process';

export const ROOT = process.cwd();
export const SITE_ID = 'kochira';
export const SITE_URL = 'https://kochira.de';

export const PATHS = {
  strategy: path.join(ROOT, 'strategy.json'),
  categories: path.join(ROOT, 'src', 'lib', 'categories.js'),
  todoRecipes: path.join(ROOT, 'todo', 'recipes'),
  todoImages: path.join(ROOT, 'todo', 'images'),
  liveRecipes: path.join(ROOT, 'content', 'recipes'),
  livePrompts: path.join(ROOT, 'content', 'prompts'),
  liveImages: path.join(ROOT, 'public', 'images', 'rezepte'),
};

const CATEGORY_TEMPLATES = {
  salate: {
    name: 'Salate',
    description: 'Salate fuer Alltag, Grillabend und warme Tage - frisch, knackig und schnell gemacht.',
    icon: '🥗',
    color: 'from-green-400 to-lime-500',
    image: '/images/rezepte/gurkensalat.webp',
    subcategories: ['Salate', 'Blattsalat', 'Nudelsalat', 'Kartoffelsalat', 'Grillsalat', 'Sommersalat'],
  },
  burger: {
    name: 'Burger',
    description: 'Burger Rezepte von Patties bis Buns - saftig, herzhaft und gut fuer Grill und Pfanne.',
    icon: '🍔',
    color: 'from-amber-400 to-red-500',
    image: '/images/rezepte/chicken-burger.webp',
    subcategories: ['Burger', 'Cheeseburger', 'Chicken Burger', 'Veggie Burger', 'Burger Buns', 'Burger Saucen'],
  },
  tiramisu: {
    name: 'Tiramisu',
    description: 'Tiramisu Rezepte von klassisch bis fruchtig - cremige Desserts fuer Besuch und Feierabend.',
    icon: '🍰',
    color: 'from-amber-300 to-yellow-500',
    image: '/images/rezepte/erdbeer-tiramisu.webp',
    subcategories: ['Tiramisu', 'Original Tiramisu', 'Tiramisu im Glas', 'Fruchtiges Tiramisu', 'Tiramisu ohne Ei'],
  },
  quiche: {
    name: 'Quiche',
    description: 'Quiche Rezepte mit knusprigem Boden und saftiger Fuellung - herzhaft, praktisch und vielseitig.',
    icon: '🥧',
    color: 'from-amber-400 to-orange-500',
    image: '/images/rezepte/gruene-spargel-quiche.webp',
    subcategories: ['Quiche', 'Quiche Lorraine', 'Gemuesequiche', 'Quiche mit Lachs', 'Quiche mit Spargel'],
  },
  focaccia: {
    name: 'Focaccia',
    description: 'Focaccia Rezepte mit luftiger Krume und goldener Kruste - ideal fuer Antipasti, Buffet und Sommer.',
    icon: '🍞',
    color: 'from-amber-400 to-orange-500',
    image: '/images/rezepte/focaccia-alla-genovese.webp',
    subcategories: ['Focaccia', 'Focaccia mit Rosmarin', 'Focaccia mit Tomaten', 'Gefuellte Focaccia', 'Focaccia Sandwich'],
  },
};

const VARIANT_TERMS = new Set([
  'mit',
  'ohne',
  'vegan',
  'vegane',
  'veganer',
  'glutenfrei',
  'glutenfreie',
  'glutenfreier',
  'klassisch',
  'original',
  'schnell',
  'saftig',
  'knusprig',
  'einfach',
  'thermomix',
  'airfryer',
  'heissluftfritteuse',
  'heissluftfritteusen',
  'im',
  'in',
  'der',
  'vom',
  'von',
  'alla',
  'al',
  'di',
  'del',
  'de',
  'zum',
  'zur',
  'auf',
  'ei',
  'glas',
  'wuerzen',
  'gewuerzt',
  'broetchen',
  'buns',
]);

const STOP_WORDS = new Set([
  'der',
  'die',
  'das',
  'und',
  'oder',
  'mit',
  'ohne',
  'im',
  'in',
  'am',
  'an',
  'auf',
  'fuer',
  'fur',
  'vom',
  'von',
  'zum',
  'zur',
  'rezept',
  'selber',
  'machen',
  'machen',
  'einfach',
  'klassisch',
  'original',
  'schnell',
  'saftig',
  'knusprig',
  'gut',
  'warme',
  'tage',
  'selbst',
]);

const TITLE_SUFFIXES = {
  salat: [
    'frisch und schnell fuer warme Tage',
    'frisch und gut zum Grillen',
    'frisch, knackig und alltagstauglich',
  ],
  airfryer: [
    'knusprig und einfach gemacht',
    'knusprig mit wenig Aufwand',
    'einfach und rundum gelungen',
  ],
  burger: [
    'saftig und einfach zuhause',
    'saftig mit guter Kruste',
    'herzhaft und gut erklaert',
  ],
  kuchen: [
    'saftig und einfach gebacken',
    'locker und gut vorzubereiten',
    'saftig fuer Besuch und Alltag',
  ],
  dessert: [
    'cremig und gut vorzubereiten',
    'einfach und ideal fuer Besuch',
    'cremig mit klaren Schritten',
  ],
  pasta: [
    'einfach und voller Aroma',
    'schnell gekocht fuer zuhause',
    'wuerzig und alltagstauglich',
  ],
  default: [
    'einfach und gut erklaert',
    'schnell und alltagstauglich',
    'gelingsicher fuer zuhause',
  ],
};

function toUtcDateString(date) {
  return new Date(date).toISOString().slice(0, 10);
}

function toUtcIso(date) {
  return new Date(date).toISOString().replace(/\.\d{3}Z$/, 'Z');
}

function addDays(date, days) {
  const copy = new Date(date);
  copy.setUTCDate(copy.getUTCDate() + days);
  return copy;
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function commandFor(command) {
  if (process.platform === 'win32' && command === 'npm') return 'npm.cmd';
  return command;
}

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function deToAscii(value) {
  return String(value || '')
    .replace(/\u00c4/g, 'Ae')
    .replace(/\u00d6/g, 'Oe')
    .replace(/\u00dc/g, 'Ue')
    .replace(/\u00e4/g, 'ae')
    .replace(/\u00f6/g, 'oe')
    .replace(/\u00fc/g, 'ue')
    .replace(/\u00df/g, 'ss');
}

export function slugifyGerman(value) {
  return deToAscii(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

function normalizeText(value) {
  return deToAscii(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function titleizeSlug(slug) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function tokenize(value) {
  return new Set(
    normalizeText(value)
      .split(' ')
      .map((token) => token.trim())
      .filter((token) => token && !STOP_WORDS.has(token))
  );
}

function setIntersectionSize(a, b) {
  let count = 0;
  for (const item of a) {
    if (b.has(item)) count += 1;
  }
  return count;
}

function familyKey(recipe) {
  return normalizeText(recipe.recipeName || recipe.title || recipe.slug);
}

function categoryKey(recipe) {
  return recipe.primaryCategory || slugifyGerman(recipe.category || '');
}

function canonicalUrl(slug) {
  return `${SITE_URL}/${slug}`;
}

function categoryStatus(recipe, existingCategories) {
  return existingCategories.has(categoryKey(recipe)) ? 'existing' : 'create_on_publish';
}

function getMealBucket(recipe) {
  const combined = normalizeText(
    [recipe.primaryCategory, recipe.category, recipe.recipeName, recipe.slug, recipe.mealType].join(' ')
  );
  if (combined.includes('salat')) return 'salat';
  if (combined.includes('burger')) return 'burger';
  if (combined.includes('airfryer') || combined.includes('heissluftfritteuse')) return 'airfryer';
  if (combined.includes('pasta')) return 'pasta';
  if (combined.includes('tiramisu') || recipe.mealType === 'dessert') return 'dessert';
  if (combined.includes('kuchen') || combined.includes('muffin')) return 'kuchen';
  return 'default';
}

function seasonalSignals(recipe, month) {
  const text = normalizeText(
    [recipe.slug, recipe.recipeName, recipe.title, recipe.primaryCategory, recipe.subcategory, recipe.tags.join(' ')].join(' ')
  );
  const signals = [];

  if ([4, 5, 6].includes(month)) {
    if (text.includes('spargel')) signals.push({ label: 'spargelzeit', score: 18 });
    if (text.includes('rhabarber')) signals.push({ label: 'fruehsommer', score: 20 });
    if (text.includes('erdbeer')) signals.push({ label: 'erdbeersaison', score: 20 });
    if (text.includes('salat') || categoryKey(recipe) === 'salate') signals.push({ label: 'sommerkueche', score: 16 });
    if (text.includes('grill') || text.includes('burger')) signals.push({ label: 'grillsaison', score: 15 });
    if (text.includes('focaccia')) signals.push({ label: 'buffet und picknick', score: 12 });
    if (text.includes('quiche')) signals.push({ label: 'spargel und brunch', score: 10 });
    if (text.includes('tiramisu')) signals.push({ label: 'kuehles dessert', score: 9 });
  }

  if (text.includes('alltag')) signals.push({ label: 'alltagstauglich', score: 4 });
  if (recipe.lifestyleTags.includes('schnell') || (recipe.totalTimeMinutes || 0) <= 35) {
    signals.push({ label: 'schnelle suche', score: 5 });
  }

  return signals;
}

function baseIntentScore(recipe) {
  const mainName = normalizeText(recipe.recipeName || recipe.slug);
  const tokens = mainName.split(' ').filter(Boolean);
  const variantCount = tokens.filter((token) => VARIANT_TERMS.has(token)).length;

  let score = 0;
  if (recipe.slug === categoryKey(recipe)) score += 15;
  if (tokens.length <= 2) score += 10;
  else if (tokens.length === 3) score += 7;
  else score += 4;
  score -= Math.min(variantCount * 2, 6);

  if (recipe.ratingAverage) score += 1;
  if (recipe.mealType === 'abendessen') score += 3;
  if (recipe.mealType === 'dessert') score += 2;
  if (recipe.cookingMethod === 'grillen') score += 6;
  if (recipe.cookingMethod === 'airfryer') score += 3;

  return score;
}

function recipeSeoScore(recipe, context) {
  const todoCount = context.todoCategoryCounts.get(categoryKey(recipe)) || 0;
  const liveCount = context.liveCategoryCounts.get(categoryKey(recipe)) || 0;
  const categoryExists = context.existingCategories.has(categoryKey(recipe));
  const seasonal = seasonalSignals(recipe, context.month);
  const seasonalScoreTotal = seasonal.reduce((sum, item) => sum + item.score, 0);

  let score = 0;
  score += Math.min(todoCount * 1.6, 26);
  score += Math.min(liveCount * 0.7, 12);
  score += categoryExists ? 8 : todoCount >= 10 ? 6 : 2;
  score += seasonalScoreTotal;
  score += baseIntentScore(recipe);

  return {
    score: Math.round(score),
    reasons: [
      `category cluster ${todoCount}`,
      categoryExists ? 'existing category page' : 'category created on publish',
      ...seasonal.map((item) => item.label),
    ],
  };
}

function parseRecipeFile(filePath, source) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = matter(raw);
  const fileName = path.basename(filePath);
  const slugFromFile = fileName.replace(/\.mdx$/, '');
  const data = parsed.data || {};
  const slug = slugifyGerman(data.slug || slugFromFile);

  return {
    source,
    filePath,
    fileName,
    slug,
    title: String(data.title || ''),
    recipeName: String(data.recipeName || data.title || slug),
    excerpt: String(data.excerpt || ''),
    description: String(data.description || ''),
    category: String(data.category || titleizeSlug(data.primaryCategory || '')),
    primaryCategory: String(data.primaryCategory || slugifyGerman(data.category || '')),
    subcategory: String(data.subcategory || ''),
    mealType: String(data.mealType || ''),
    cookingMethod: String(data.cookingMethod || ''),
    dietaryTags: Array.isArray(data.dietaryTags) ? data.dietaryTags : [],
    lifestyleTags: Array.isArray(data.lifestyleTags) ? data.lifestyleTags : [],
    tags: Array.isArray(data.tags) ? data.tags : [],
    totalTimeMinutes: Number(data.totalTimeMinutes || 0),
    imageSrc: String(data?.image?.src || `/images/rezepte/${slug}.webp`),
    imageAlt: String(data?.image?.alt || ''),
    canonicalUrl: canonicalUrl(slug),
    rawBody: parsed.content || '',
    data,
  };
}

export function loadRecipes(dirPath, source) {
  if (!fileExists(dirPath)) return [];
  return fs
    .readdirSync(dirPath)
    .filter((file) => file.endsWith('.mdx'))
    .sort((a, b) => a.localeCompare(b))
    .map((file) => parseRecipeFile(path.join(dirPath, file), source));
}

export function loadLiveRecipes() {
  return loadRecipes(PATHS.liveRecipes, 'live');
}

export function loadTodoRecipes() {
  return loadRecipes(PATHS.todoRecipes, 'todo');
}

export function loadCategoriesState() {
  const source = fs.readFileSync(PATHS.categories, 'utf8');
  let executable = source
    .replace(/export const /g, 'const ')
    .replace(/export function /g, 'function ')
    .replace(/if \(process\.env\.NODE_ENV !== 'production'\) \{[\s\S]*?\n\}/, '');

  executable += '\nmodule.exports = { PRIMARY_CATEGORIES };';
  const sandbox = {
    module: { exports: {} },
    exports: {},
    process: { env: { NODE_ENV: 'production' } },
    console,
  };
  vm.runInNewContext(executable, sandbox, { filename: 'categories.js' });

  return {
    source,
    categories: sandbox.module.exports.PRIMARY_CATEGORIES || {},
  };
}

function buildCategoryDefinition(recipe) {
  const slug = categoryKey(recipe);
  const template = CATEGORY_TEMPLATES[slug];
  const name = recipe.category || template?.name || titleizeSlug(slug);
  const baseSubcategories = [
    name,
    recipe.subcategory || '',
    recipe.recipeName || '',
  ]
    .filter(Boolean)
    .filter((value, index, arr) => arr.indexOf(value) === index);

  return {
    name,
    slug,
    description:
      template?.description ||
      `${name} Rezepte fuer Alltag, Wochenende und besondere Gelegenheiten.`,
    icon: template?.icon || '🍽️',
    color: template?.color || 'from-amber-400 to-orange-500',
    image: template?.image || recipe.imageSrc || `/images/rezepte/${recipe.slug}.webp`,
    subcategories: template?.subcategories || baseSubcategories,
  };
}

export function ensureCategoryExists(recipe) {
  const { source, categories } = loadCategoriesState();
  const slug = categoryKey(recipe);
  if (!slug || categories[slug]) return false;

  const definition = buildCategoryDefinition(recipe);
  const block = [
    `  ${JSON.stringify(slug)}: {`,
    `    name: ${JSON.stringify(definition.name)},`,
    `    slug: ${JSON.stringify(definition.slug)},`,
    `    description: ${JSON.stringify(definition.description)},`,
    `    icon: ${JSON.stringify(definition.icon)},`,
    `    color: ${JSON.stringify(definition.color)},`,
    `    image: ${JSON.stringify(definition.image)},`,
    `    subcategories: ${JSON.stringify(definition.subcategories)}`,
    '  },',
  ].join('\n');

  const marker = '\n};\n\nif (process.env.NODE_ENV';
  const markerIndex = source.indexOf(marker);
  if (markerIndex === -1) {
    throw new Error('Could not locate PRIMARY_CATEGORIES closing marker.');
  }

  const prefix = source.slice(0, markerIndex).replace(/\s*$/, '\n');
  const updated = `${prefix}${block}\n${source.slice(markerIndex)}`;
  fs.writeFileSync(PATHS.categories, updated, 'utf8');
  return true;
}

function exactDuplicateCheck(candidate, others, scopeLabel) {
  const candidateNames = [
    candidate.slug,
    candidate.fileName,
    candidate.recipeName,
    candidate.title,
    candidate.canonicalUrl,
  ]
    .filter(Boolean)
    .map((value) => normalizeText(value));

  for (const other of others) {
    if (candidate.slug === other.slug) {
      return { reason: 'same slug already exists', conflictSlug: other.slug, scope: scopeLabel };
    }
    if (candidate.fileName === other.fileName) {
      return { reason: 'same file name already exists', conflictSlug: other.slug, scope: scopeLabel };
    }
    if (candidate.canonicalUrl === other.canonicalUrl) {
      return { reason: 'same canonical URL already exists', conflictSlug: other.slug, scope: scopeLabel };
    }

    const otherNames = [
      other.slug,
      other.fileName,
      other.recipeName,
      other.title,
      other.canonicalUrl,
    ]
      .filter(Boolean)
      .map((value) => normalizeText(value));

    if (candidateNames.some((name) => name && otherNames.includes(name))) {
      return {
        reason: scopeLabel === 'live' ? 'same keyword already published' : 'same keyword already planned',
        conflictSlug: other.slug,
        scope: scopeLabel,
      };
    }
  }

  return null;
}

function similarDuplicateCheck(candidate, others, scopeLabel) {
  const candidateTokens = tokenize(candidate.recipeName || candidate.title || candidate.slug);
  if (candidateTokens.size < 2) return null;

  for (const other of others) {
    const otherTokens = tokenize(other.recipeName || other.title || other.slug);
    if (otherTokens.size < 2) continue;

    const overlap = setIntersectionSize(candidateTokens, otherTokens);
    if (!overlap) continue;

    const smaller = Math.min(candidateTokens.size, otherTokens.size);
    const union = new Set([...candidateTokens, ...otherTokens]).size;
    const overlapRatio = overlap / smaller;
    const jaccard = overlap / union;
    const sameCategory = categoryKey(candidate) === categoryKey(other);
    const largerTokens = candidateTokens.size >= otherTokens.size ? candidateTokens : otherTokens;
    const smallerTokens = candidateTokens.size >= otherTokens.size ? otherTokens : candidateTokens;
    const distinguishingTokens = [...largerTokens].filter((token) => !smallerTokens.has(token));
    const onlyVariantDiff =
      distinguishingTokens.length > 0 && distinguishingTokens.every((token) => VARIANT_TERMS.has(token));

    if (jaccard >= 0.85 && overlap >= 2) {
      return {
        reason: scopeLabel === 'live' ? 'too similar to existing recipe' : 'too similar to planned recipe',
        conflictSlug: other.slug,
        scope: scopeLabel,
      };
    }

    if (sameCategory && overlapRatio >= 1 && smaller >= 2 && onlyVariantDiff) {
      return {
        reason: scopeLabel === 'live' ? 'same intent with different wording' : 'same intent already planned',
        conflictSlug: other.slug,
        scope: scopeLabel,
      };
    }

    if (sameCategory && overlapRatio >= 0.8 && overlap >= 2 && onlyVariantDiff) {
      return {
        reason: scopeLabel === 'live' ? 'same intent with different wording' : 'same intent already planned',
        conflictSlug: other.slug,
        scope: scopeLabel,
      };
    }
  }

  return null;
}

export function findDuplicate(candidate, pools) {
  for (const pool of pools) {
    const exact = exactDuplicateCheck(candidate, pool.recipes, pool.label);
    if (exact) return exact;
    const similar = similarDuplicateCheck(candidate, pool.recipes, pool.label);
    if (similar) return similar;
  }
  return null;
}

function countByCategory(recipes) {
  const counts = new Map();
  for (const recipe of recipes) {
    const key = categoryKey(recipe);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return counts;
}

function buildAlternativeSuggestion(skippedRecipe, availableRecipes) {
  const sameCategory = availableRecipes.find(
    (recipe) =>
      recipe.slug !== skippedRecipe.slug &&
      categoryKey(recipe) === categoryKey(skippedRecipe) &&
      !similarDuplicateCheck(skippedRecipe, [recipe], 'planned')
  );

  if (sameCategory) {
    return {
      slug: sameCategory.slug,
      recipeName: sameCategory.recipeName,
      reason: 'same category, lower cannibalization risk',
    };
  }

  const fallback = availableRecipes.find((recipe) => recipe.slug !== skippedRecipe.slug);
  if (!fallback) return null;
  return {
    slug: fallback.slug,
    recipeName: fallback.recipeName,
    reason: 'next best non-duplicate from todo',
  };
}

function computeFullDayCount(selectedCount) {
  return Math.floor(selectedCount / 10);
}

function toDayLabel(index) {
  return `day${index}`;
}

function buildDayRecipeEntry(recipe, analysis, existingCategories) {
  return {
    slug: recipe.slug,
    recipeName: recipe.recipeName,
    title: recipe.title,
    category: recipe.category,
    primaryCategory: recipe.primaryCategory,
    categoryStatus: categoryStatus(recipe, existingCategories),
    subcategory: recipe.subcategory,
    canonicalUrl: recipe.canonicalUrl,
    sourceRecipePath: path.relative(ROOT, recipe.filePath).replace(/\\/g, '/'),
    sourceImagePath: `todo/images/${path.basename(recipe.imageSrc || `${recipe.slug}.webp`)}`,
    strategyScore: analysis.score,
    seoReasons: analysis.reasons,
    status: 'planned',
    duplicateCheck: 'passed',
  };
}

export function generateStrategy({ startDate = new Date() } = {}) {
  const liveRecipes = loadLiveRecipes();
  const todoRecipes = loadTodoRecipes();
  const categoriesState = loadCategoriesState();
  const existingCategories = new Set(Object.keys(categoriesState.categories));
  const context = {
    month: new Date(startDate).getUTCMonth() + 1,
    todoCategoryCounts: countByCategory(todoRecipes),
    liveCategoryCounts: countByCategory(liveRecipes),
    existingCategories,
  };

  const scoredTodo = todoRecipes
    .map((recipe) => {
      const analysis = recipeSeoScore(recipe, context);
      return {
        recipe,
        analysis,
      };
    })
    .sort((a, b) => b.analysis.score - a.analysis.score || a.recipe.slug.localeCompare(b.recipe.slug));

  const accepted = [];
  const skippedDuplicates = [];

  for (const item of scoredTodo) {
    const duplicate = findDuplicate(item.recipe, [
      { label: 'live', recipes: liveRecipes },
      { label: 'planned', recipes: accepted.map((entry) => entry.recipe) },
    ]);

    if (duplicate) {
      skippedDuplicates.push({
        slug: item.recipe.slug,
        recipeName: item.recipe.recipeName,
        category: item.recipe.category,
        primaryCategory: item.recipe.primaryCategory,
        status: 'skipped_duplicate',
        reason: duplicate.reason,
        conflictSlug: duplicate.conflictSlug,
      });
      continue;
    }

    accepted.push(item);
  }

  const alternativesPool = accepted.map((item) => item.recipe);
  for (const skipped of skippedDuplicates) {
    skipped.alternativeSuggestion = buildAlternativeSuggestion(skipped, alternativesPool);
  }

  const fullDayCount = computeFullDayCount(accepted.length);
  const scheduledCount = fullDayCount * 10;
  const scheduledPool = accepted.slice(0, scheduledCount);
  const overflowPool = accepted.slice(scheduledCount);

  const remaining = [...scheduledPool];
  const days = {};
  const recentCategories = [];

  for (let dayIndex = 1; dayIndex <= fullDayCount; dayIndex += 1) {
    const dayRecipes = [];
    const perDayCategories = new Map();

    while (dayRecipes.length < 10 && remaining.length) {
      let bestIndex = -1;
      let bestFit = Number.NEGATIVE_INFINITY;

      for (let i = 0; i < remaining.length; i += 1) {
        const item = remaining[i];
        const dayCategoryCount = perDayCategories.get(categoryKey(item.recipe)) || 0;
        if (dayCategoryCount >= 2) continue;
        if (dayRecipes.some((entry) => similarDuplicateCheck(item.recipe, [entry.recipe], 'planned'))) continue;

        const recentPenalty = recentCategories.filter((category) => category === categoryKey(item.recipe)).length * 6;
        const dayPenalty = dayCategoryCount * 20;
        const fit = item.analysis.score - recentPenalty - dayPenalty;

        if (fit > bestFit) {
          bestFit = fit;
          bestIndex = i;
        }
      }

      if (bestIndex === -1) bestIndex = 0;
      const [chosen] = remaining.splice(bestIndex, 1);
      dayRecipes.push(chosen);
      perDayCategories.set(categoryKey(chosen.recipe), (perDayCategories.get(categoryKey(chosen.recipe)) || 0) + 1);
    }

    const dayDate = addDays(new Date(startDate), dayIndex - 1);
    const primaryCategories = [...new Set(dayRecipes.map((item) => item.recipe.primaryCategory))];
    recentCategories.splice(0, recentCategories.length, ...primaryCategories.slice(-4));

    days[toDayLabel(dayIndex)] = {
      day: toDayLabel(dayIndex),
      ordinal: dayIndex,
      targetDate: toUtcDateString(dayDate),
      status: 'planned',
      notes: [
        'balanced for category strength and internal linking',
        'spread to reduce same-intent cannibalization inside one day',
      ],
      recipes: dayRecipes.map((item) => buildDayRecipeEntry(item.recipe, item.analysis, existingCategories)),
    };
  }

  return {
    siteId: SITE_ID,
    generatedAt: toUtcIso(new Date()),
    startDate: toUtcDateString(startDate),
    summary: {
      liveRecipeCount: liveRecipes.length,
      todoRecipeCount: todoRecipes.length,
      plannedRecipeCount: scheduledCount,
      fullDayCount,
      overflowCount: overflowPool.length,
      skippedDuplicateCount: skippedDuplicates.length,
      missingCategoryCount: [...context.todoCategoryCounts.keys()].filter((key) => !existingCategories.has(key)).length,
    },
    rules: {
      publishBatchSize: 10,
      duplicateChecks: ['slug', 'file name', 'recipe title', 'main keyword', 'canonical URL', 'similar intent'],
      strategyVersion: 1,
    },
    missingCategories: [...context.todoCategoryCounts.keys()]
      .filter((key) => !existingCategories.has(key))
      .sort()
      .map((key) => ({
        slug: key,
        name: CATEGORY_TEMPLATES[key]?.name || titleizeSlug(key),
        todoCount: context.todoCategoryCounts.get(key) || 0,
      })),
    skippedDuplicates,
    overflowCandidates: overflowPool.map((item) => ({
      slug: item.recipe.slug,
      recipeName: item.recipe.recipeName,
      category: item.recipe.category,
      primaryCategory: item.recipe.primaryCategory,
      canonicalUrl: item.recipe.canonicalUrl,
      sourceRecipePath: path.relative(ROOT, item.recipe.filePath).replace(/\\/g, '/'),
      strategyScore: item.analysis.score,
      seoReasons: item.analysis.reasons,
      status: 'planned',
    })),
    days,
  };
}

export function writeStrategy(strategy, filePath = PATHS.strategy) {
  fs.writeFileSync(filePath, `${JSON.stringify(strategy, null, 2)}\n`, 'utf8');
}

function imageCandidatesForSlug(slug) {
  if (!fileExists(PATHS.todoImages)) return [];
  return fs
    .readdirSync(PATHS.todoImages)
    .filter((file) => file.toLowerCase().startsWith(slug.toLowerCase()) && /\.(webp|png|jpg|jpeg)$/i.test(file))
    .sort((a, b) => a.localeCompare(b));
}

function firstVisibleIngredients(recipeData) {
  const seen = new Set();
  const values = [];
  for (const section of recipeData.ingredients || []) {
    for (const item of section.items || []) {
      const cleaned = String(item)
        .replace(/^[0-9/.,\s]+/g, '')
        .replace(/\b(g|kg|ml|l|el|tl|prise|stück|stueck)\b/gi, '')
        .replace(/\s+/g, ' ')
        .trim();
      if (!cleaned) continue;
      const shortName = cleaned.split(',')[0].trim();
      if (!seen.has(shortName.toLowerCase())) {
        seen.add(shortName.toLowerCase());
        values.push(shortName);
      }
      if (values.length === 4) return values;
    }
  }
  return values;
}

function seededImageId(slug) {
  const digits = String(
    Array.from(slug).reduce((sum, char) => sum + char.charCodeAt(0), 0) % 9000
  ).padStart(4, '0');
  return digits;
}

export function buildPromptText(recipeData) {
  const visible = firstVisibleIngredients(recipeData);
  const mainIngredient = visible[0] || recipeData.recipeName || recipeData.slug;
  const extraIngredients = visible.slice(1).join(', ');
  const lead = `IMG_${seededImageId(recipeData.slug)}.HEIC homemade ${recipeData.recipeName}, clearly homemade and not styled, only the finished dish visible, realistic texture and true-to-life color on a simple plate in a home setting.`;
  const composition = `composition: the food fills most of the frame with believable, uneven plating, visible ${mainIngredient}${extraIngredients ? `, ${extraIngredients}` : ''}, natural surface detail, moist interior, browned edges, and a finished look that matches the cooked recipe.`;
  const light = 'light & setting: natural window light from the side, simple home table, no styling props, no extra hands or utensils in frame, honest homemade atmosphere, realistic shadows, everyday plate or bowl.';
  const sharpness = `sharpness: SHARP FOCUS, tack sharp texture on ${mainIngredient.toLowerCase()}, detailed surface, crisp edges, natural highlights, no artificial gloss.`;
  const negative = 'negative: no blur, no soft focus, no bokeh, no HDR, no filters, no studio lighting, no over-styling, no perfect symmetry, no artificial gloss, no high saturation, no commercial food photography look, no plastic texture, no overprocessed sharpness';
  return [lead, composition, light, sharpness, negative].join('\n');
}

function trimSentence(text, maxLength) {
  if (text.length <= maxLength) return text;
  const shortened = text.slice(0, maxLength);
  const lastSpace = shortened.lastIndexOf(' ');
  return `${shortened.slice(0, lastSpace > 0 ? lastSpace : maxLength).trim()}.`;
}

function normalizeSeoText(text) {
  return String(text || '')
    .replace(/\b([A-Za-zÀ-ÿ]+)(\s+\1\b)+/gi, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function hasClippedEnding(text) {
  return /(?:fuer|für|mit|und|oder|ohne|von|vom|im|am|an|auf)\.$/i.test(String(text || '').trim());
}

function needsSeoRewrite(text) {
  const value = normalizeSeoText(text);
  return (
    !value ||
    /stimmige version/i.test(value) ||
    /zuhause zuhause/i.test(value) ||
    hasClippedEnding(value)
  );
}

function fitLength(base, parts, minLength, maxLength) {
  for (const part of parts) {
    const value = normalizeSeoText(`${base}${part}`);
    if (value.length >= minLength && value.length <= maxLength) return value;
  }

  const fallback = normalizeSeoText(`${base}${parts[0] || ''}`);
  if (fallback.length < minLength) {
    const extended = normalizeSeoText(`${fallback} zuhause`);
    return extended.length <= maxLength ? extended : trimSentence(extended, maxLength);
  }

  return trimSentence(fallback, maxLength);
}

function ensureTitle(recipeData) {
  const currentTitle = normalizeSeoText(recipeData.title);
  if (
    currentTitle &&
    currentTitle.length >= 50 &&
    currentTitle.length <= 60 &&
    !needsSeoRewrite(currentTitle)
  ) {
    return currentTitle;
  }

  const bucket = getMealBucket(recipeData);
  const suffixes = TITLE_SUFFIXES[bucket] || TITLE_SUFFIXES.default;
  const base = `${recipeData.recipeName}: `;
  return fitLength(
    base,
    suffixes,
    50,
    60
  );
}

function descriptionTemplate(recipeData) {
  const bucket = getMealBucket(recipeData);
  const ingredientA = firstVisibleIngredients(recipeData)[0] || 'guten Zutaten';
  const phraseByBucket = {
    salat: `${recipeData.recipeName} gelingt dir frisch und ausgewogen mit ${ingredientA} und einem klaren Dressing. Ideal fuer Grillabend, warme Tage oder ein schnelles Mittagessen zuhause.`,
    airfryer: `${recipeData.recipeName} gelingt dir einfach und gleichmaessig mit zartem Biss und wenig Aufwand. So sparst du Zeit und bekommst ein rundes Ergebnis ohne grossen Topf.`,
    burger: `${recipeData.recipeName} gelingt dir saftig und gut gewuerzt, damit beim Braten eine dunkle Kruste entsteht und der Kern locker bleibt. Ideal fuer Burgerabende zuhause.`,
    kuchen: `${recipeData.recipeName} gelingt dir saftig und schnittfest mit klaren Schritten und einer ruhigen Krume. Ideal fuer Besuch, Kaffeetisch oder spontanes Backen zuhause.`,
    dessert: `${recipeData.recipeName} gelingt dir cremig und frisch mit feiner Suesse und klarer Struktur. Du bereitest das Dessert gut vor und servierst es entspannt fuer Besuch oder Wochenende.`,
    pasta: `${recipeData.recipeName} gelingt dir aromatisch und ausgewogen mit Sauce, die sich sauber an die Pasta legt. Ideal fuer Feierabend, Spargelzeit und ein schnelles Abendessen zuhause.`,
    default: `${recipeData.recipeName} gelingt dir alltagstauglich und klar erklaert mit einem Ergebnis, das in Textur und Aroma stimmig bleibt. Gut fuer zuhause und ohne Umwege nachgekocht.`,
  };

  return normalizeSeoText(phraseByBucket[bucket] || phraseByBucket.default);
}

function ensureDescription(recipeData) {
  const currentDescription = normalizeSeoText(recipeData.description);
  if (
    currentDescription &&
    currentDescription.length >= 150 &&
    currentDescription.length <= 160 &&
    !needsSeoRewrite(currentDescription)
  ) {
    return currentDescription;
  }

  const description = normalizeSeoText(descriptionTemplate(recipeData));
  if (description.length >= 150 && description.length <= 160) return description;
  if (description.length > 160) return trimSentence(description, 160);
  return fitLength(description, [' zuhause.', ' im Alltag.', ' fuer Besuch.'], 150, 160);
}

function ensureExcerpt(recipeData) {
  if (recipeData.excerpt) return recipeData.excerpt;
  return `${recipeData.recipeName} gelingt dir mit klaren Schritten und Zutaten, die du gut bekommst. So landet ein stimmiges Rezept fuer zuhause schnell auf dem Tisch.`;
}

function normalizeYieldOrServings(recipeData) {
  const next = { ...recipeData };
  if (next.yield && next.servings) {
    delete next.servings;
  }
  return next;
}

function orderedFrontmatter(data) {
  const ordered = {};
  const baseOrder = [
    'title',
    'recipeName',
    'slug',
    'date',
    'publishedAt',
    'updatedAt',
    'excerpt',
    'description',
    'category',
    'cuisine',
    'primaryCategory',
    'subcategory',
    'mealType',
    'cookingMethod',
    'dietaryTags',
    'lifestyleTags',
    'difficulty',
    'prepTimeMinutes',
    'cookTimeMinutes',
    'totalTimeMinutes',
    'servings',
    'yield',
    'author',
    'image',
    'tags',
    'ratingAverage',
    'ratingCount',
    'caloriesPerServing',
    'homepageFeatured',
    'tips',
    'faqs',
    'ingredients',
    'steps',
    'nutrition',
  ];

  for (const key of baseOrder) {
    if (data[key] !== undefined) ordered[key] = data[key];
  }

  for (const [key, value] of Object.entries(data)) {
    if (!(key in ordered)) ordered[key] = value;
  }

  return ordered;
}

function finalizeRecipeData(recipeFile, publishDate, slotIndex) {
  let data = { ...recipeFile.data };
  const baseDate = new Date(`${publishDate}T08:${String(slotIndex).padStart(2, '0')}:00Z`);
  data.slug = recipeFile.slug;
  data.recipeName = data.recipeName || recipeFile.recipeName;
  data.title = ensureTitle({ ...recipeFile, ...data });
  data.description = ensureDescription({ ...recipeFile, ...data });
  data.excerpt = ensureExcerpt({ ...recipeFile, ...data });
  data.date = publishDate;
  data.publishedAt = toUtcIso(baseDate);
  data.updatedAt = toUtcIso(baseDate);
  data.category = data.category || recipeFile.category;
  data.primaryCategory = data.primaryCategory || recipeFile.primaryCategory;
  data.subcategory = data.subcategory || recipeFile.subcategory || recipeFile.category;
  data.author = data.author || 'Kochira';
  data.homepageFeatured = Boolean(data.homepageFeatured);
  data.image = {
    ...(data.image || {}),
    src: `/images/rezepte/${recipeFile.slug}.webp`,
    alt:
      data?.image?.alt ||
      `${data.recipeName} fertig serviert auf einem Teller mit natuerlicher Farbe und gut sichtbarer Struktur`,
  };
  data.totalTimeMinutes = Math.max(
    Number(data.totalTimeMinutes || 0),
    Math.ceil((Number(data.prepTimeMinutes || 0) + Number(data.cookTimeMinutes || 0)) / 5) * 5
  );

  data = normalizeYieldOrServings(data);

  return orderedFrontmatter(data);
}

function serializeRecipe(body, data) {
  return matter.stringify(body || '', data).trimEnd() + '\n';
}

function copyFileAbsolute(fromPath, toPath) {
  ensureDir(path.dirname(toPath));
  fs.copyFileSync(fromPath, toPath);
}

function resolveTodoRecipe(slug) {
  const recipePath = path.join(PATHS.todoRecipes, `${slug}.mdx`);
  if (!fileExists(recipePath)) {
    throw new Error(`Missing todo recipe file for ${slug}`);
  }
  return parseRecipeFile(recipePath, 'todo');
}

function resolveTodoImage(slug) {
  const exact = path.join(PATHS.todoImages, `${slug}.webp`);
  if (fileExists(exact)) return exact;
  const matches = imageCandidatesForSlug(slug);
  if (!matches.length) return null;
  return path.join(PATHS.todoImages, matches[0]);
}

function loadStrategy(strategyPath = PATHS.strategy) {
  return JSON.parse(fs.readFileSync(strategyPath, 'utf8'));
}

function saveStrategy(strategy, strategyPath = PATHS.strategy) {
  fs.writeFileSync(strategyPath, `${JSON.stringify(strategy, null, 2)}\n`, 'utf8');
}

function nextUnpublishedDay(strategy) {
  return Object.values(strategy.days)
    .sort((a, b) => a.ordinal - b.ordinal)
    .find((day) => day.status !== 'published');
}

function candidateFromEntry(entry) {
  return {
    slug: entry.slug,
    fileName: `${entry.slug}.mdx`,
    recipeName: entry.recipeName,
    title: entry.title,
    category: entry.category,
    primaryCategory: entry.primaryCategory,
    canonicalUrl: entry.canonicalUrl || canonicalUrl(entry.slug),
  };
}

function allFutureEntries(strategy, fromOrdinal) {
  const futureDays = Object.values(strategy.days)
    .filter((day) => day.ordinal > fromOrdinal)
    .sort((a, b) => a.ordinal - b.ordinal);

  const entries = [];
  for (const day of futureDays) {
    for (const recipe of day.recipes) {
      if (recipe.status === 'planned') {
        entries.push({ source: 'day', day, recipe });
      }
    }
  }

  for (const recipe of strategy.overflowCandidates || []) {
    if (recipe.status === 'planned') {
      entries.push({ source: 'overflow', day: null, recipe });
    }
  }

  return entries;
}

function selectReplacement(strategy, currentDay, publishedPool) {
  const futureEntries = allFutureEntries(strategy, currentDay.ordinal);

  for (const entry of futureEntries) {
    const duplicate = findDuplicate(candidateFromEntry(entry.recipe), [
      { label: 'live', recipes: publishedPool },
    ]);
    if (duplicate) continue;

    entry.recipe.status = 'moved_forward';
    entry.recipe.movedToDay = currentDay.day;
    return {
      slug: entry.recipe.slug,
      recipeName: entry.recipe.recipeName,
      sourceDay: entry.day?.day || 'overflow',
    };
  }

  return null;
}

function writePromptFile(slug, promptText) {
  ensureDir(PATHS.livePrompts);
  fs.writeFileSync(path.join(PATHS.livePrompts, `${slug}.mdx`), `${promptText.trim()}\n`, 'utf8');
}

function runPackageScript(scriptName) {
  const packageJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  if (!packageJson.scripts || !packageJson.scripts[scriptName]) {
    return { ran: false, scriptName, ok: true };
  }

  try {
    if (process.platform === 'win32') {
      execFileSync('cmd.exe', ['/d', '/s', '/c', `npm run ${scriptName}`], {
        cwd: ROOT,
        stdio: 'pipe',
        encoding: 'utf8',
      });
    } else {
      execFileSync('npm', ['run', scriptName], {
        cwd: ROOT,
        stdio: 'pipe',
        encoding: 'utf8',
      });
    }
    return { ran: true, scriptName, ok: true };
  } catch (error) {
    return {
      ran: true,
      scriptName,
      ok: false,
      output: `${error.stdout || ''}${error.stderr || ''}`.trim(),
    };
  }
}

function updateKeywordsInDb(keywords) {
  const externalRoot = 'C:/Users/PCPACK/Documents/projects/recipe-console';
  if (!fileExists(externalRoot)) {
    return { ran: false, updated: 0, missing: keywords };
  }

  const code = `
    const db = require('better-sqlite3')('data/console.db');
    const stmt = db.prepare('UPDATE keywords SET status = ?, updated_at = ? WHERE site_id = ? AND phrase = ?');
    const now = new Date().toISOString();
    const keywords = ${JSON.stringify(keywords)};
    const siteId = ${JSON.stringify(SITE_ID)};
    let updated = 0;
    const missing = [];
    for (const kw of keywords) {
      const result = stmt.run('Published', now, siteId, kw);
      if (result.changes > 0) updated += 1;
      else missing.push(kw);
    }
    console.log(JSON.stringify({ updated, missing }));
    db.close();
  `;

  try {
    const output = execFileSync('node', ['-e', code], {
      cwd: externalRoot,
      stdio: 'pipe',
      encoding: 'utf8',
    }).trim();
    return { ran: true, ...JSON.parse(output || '{"updated":0,"missing":[] }') };
  } catch (error) {
    return {
      ran: true,
      updated: 0,
      missing: keywords,
      error: `${error.stdout || ''}${error.stderr || ''}`.trim(),
    };
  }
}

function gitAddAndCommit(files, message) {
  execFileSync(commandFor('git'), ['add', '--', ...files], {
    cwd: ROOT,
    stdio: 'pipe',
    encoding: 'utf8',
  });

  execFileSync(commandFor('git'), ['commit', '-m', message], {
    cwd: ROOT,
    stdio: 'pipe',
    encoding: 'utf8',
  });
}

export function publishToday({ strategyPath = PATHS.strategy } = {}) {
  const strategy = loadStrategy(strategyPath);
  const day = nextUnpublishedDay(strategy);
  if (!day) {
    throw new Error('No unpublished day found in strategy.json');
  }

  ensureDir(PATHS.liveRecipes);
  ensureDir(PATHS.liveImages);
  ensureDir(PATHS.livePrompts);

  const liveRecipes = loadLiveRecipes();
  const publishedPool = [...liveRecipes];
  const publishedToday = [];
  const skippedToday = [];
  const touchedFiles = ['strategy.json'];
  let categoriesTouched = false;

  for (const entry of day.recipes) {
    if (publishedToday.length >= 10) break;
    if (entry.status !== 'planned') continue;

    const candidate = candidateFromEntry(entry);
    const duplicate = findDuplicate(candidate, [{ label: 'live', recipes: publishedPool }]);

    let selectedEntry = entry;
    let replacementMeta = null;

    if (duplicate) {
      entry.status = 'skipped_duplicate';
      entry.skipReason = `${duplicate.reason}${duplicate.conflictSlug ? ` (${duplicate.conflictSlug})` : ''}`;
      skippedToday.push({ slug: entry.slug, reason: entry.skipReason });
      const replacement = selectReplacement(strategy, day, publishedPool);
      if (!replacement) continue;

      selectedEntry = {
        ...entry,
        slug: replacement.slug,
        recipeName: replacement.recipeName,
        title: replacement.recipeName,
        category: entry.category,
        primaryCategory: entry.primaryCategory,
      };
      replacementMeta = replacement;
    }

    const recipeFile = resolveTodoRecipe(selectedEntry.slug);
    const imagePath = resolveTodoImage(selectedEntry.slug);
    if (!imagePath) {
      if (selectedEntry === entry) {
        entry.status = 'skipped_duplicate';
        entry.skipReason = 'missing related image in todo/images';
        skippedToday.push({ slug: entry.slug, reason: entry.skipReason });
      }
      continue;
    }

    if (findDuplicate(recipeFile, [{ label: 'live', recipes: publishedPool }])) {
      if (selectedEntry === entry) {
        entry.status = 'skipped_duplicate';
        entry.skipReason = 'duplicate detected during final pre-publish check';
        skippedToday.push({ slug: entry.slug, reason: entry.skipReason });
      }
      continue;
    }

    if (ensureCategoryExists(recipeFile)) {
      categoriesTouched = true;
    }

    const finalized = finalizeRecipeData(recipeFile, day.targetDate, publishedToday.length);
    const recipeContent = serializeRecipe(recipeFile.rawBody, finalized);
    const promptText = buildPromptText(finalized);
    const liveRecipePath = path.join(PATHS.liveRecipes, `${recipeFile.slug}.mdx`);
    const liveImagePath = path.join(PATHS.liveImages, `${recipeFile.slug}.webp`);
    const livePromptPath = path.join(PATHS.livePrompts, `${recipeFile.slug}.mdx`);

    fs.writeFileSync(liveRecipePath, recipeContent, 'utf8');
    writePromptFile(recipeFile.slug, promptText);
    copyFileAbsolute(imagePath, liveImagePath);

    touchedFiles.push(
      path.relative(ROOT, liveRecipePath).replace(/\\/g, '/'),
      path.relative(ROOT, livePromptPath).replace(/\\/g, '/'),
      path.relative(ROOT, liveImagePath).replace(/\\/g, '/')
    );

    if (selectedEntry === entry) {
      entry.status = 'published';
      entry.publishedUrl = canonicalUrl(recipeFile.slug);
    }

    publishedPool.push(recipeFile);
    publishedToday.push({
      slug: recipeFile.slug,
      recipeName: finalized.recipeName,
      url: canonicalUrl(recipeFile.slug),
      sourceDay: replacementMeta?.sourceDay || day.day,
      replacementFor: replacementMeta ? entry.slug : null,
    });
  }

  day.status = 'published';
  day.publishedAt = toUtcIso(new Date());
  day.publishedRecipes = publishedToday;
  day.skippedRecipes = skippedToday;

  const validations = [runPackageScript('lint'), runPackageScript('build')];
  const failedValidation = validations.find((result) => result.ran && !result.ok);
  if (failedValidation) {
    throw new Error(`Validation failed for ${failedValidation.scriptName}: ${failedValidation.output}`);
  }

  const keywordUpdate = updateKeywordsInDb(
    publishedToday.map((item) => item.recipeName)
  );

  const commitMessage = [
    `Publish ${publishedToday.length} recipes for Day ${day.ordinal}`,
    '',
    'URLs:',
    ...publishedToday.map((item) => `- ${item.url}`),
  ].join('\n');

  saveStrategy(strategy, strategyPath);

  if (categoriesTouched) {
    touchedFiles.push('src/lib/categories.js');
  }

  const uniqueFiles = [...new Set(touchedFiles)];
  gitAddAndCommit(uniqueFiles, commitMessage);

  return {
    day: day.day,
    ordinal: day.ordinal,
    publishedToday,
    skippedToday,
    validations,
    keywordUpdate,
    categoriesTouched,
  };
}
