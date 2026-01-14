'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import {
  ArrowRight,
  BookOpen,
  ChefHat,
  Clock,
  Grid,
  Heart,
  Search,
  Sparkles,
  Star,
  Timer,
  TrendingUp,
  X,
} from 'lucide-react';
import RecipeCard from '@/components/recipe/RecipeCard';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ShareButton from '@/components/recipe/ShareButton';

/**
 * EnhancedCategoryClient
 * - Supports:
 *   1) "All categories" directory view (showAllCategories=true)
 *   2) Single category pillar view with recipe grid and smart filters
 *
 * Notes:
 * - All UI texts are German (Kochera = DE).
 * - Design: modern, clean, strong hero, sticky controls, better spacing, glass overlays.
 */
export default function EnhancedCategoryClient({
  category,
  recipes = [],
  allCategories,
  categoryStats = {},
  totalRecipes = 0,
  showAllCategories = false,
}) {
  // Shared UI state
  const [sortBy] = useState('popular'); // popular | newest | time | rating | alpha

  // Single-category states
  const [displayCount, setDisplayCount] = useState(12);

  // All-categories states
  const [categorySort] = useState('popular'); // popular | alphabetical

  // Get current URL for sharing
  const pathname = usePathname();
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL || 'https://kochera.de');
  const currentUrl = `${siteUrl}${pathname}`;

  // ---------- Helpers ----------
  const heroImage =
    (showAllCategories ? '/images/kategorien/alle-kategorien.webp' : category?.image) ||
    '/images/kategorien/alle-kategorien.webp';

  const heroTitle = showAllCategories
    ? 'Alle Kategorien'
    : category?.name || 'Kategorie';

  const heroDescription = showAllCategories
    ? `Entdecke ${totalRecipes}+ Rezepte in ${allCategories?.length || 0} Kategorien – schnell, lecker und alltagstauglich.`
    : category?.description ||
      'Entdecke Rezepte, Tipps und Inspiration – perfekt für Alltag & Genuss.';

  // Normalize “difficulty”
  const normalizeDifficulty = (val) => {
    if (!val) return '';
    const v = String(val).toLowerCase();
    if (v.includes('lätt') || v.includes('leicht') || v.includes('easy')) return 'leicht';
    if (v.includes('medel') || v.includes('mittel') || v.includes('medium')) return 'mittel';
    if (v.includes('svår') || v.includes('schwer') || v.includes('hard')) return 'schwer';
    return v;
  };

  // Normalize “time”
  const getTotalMinutes = (r) => {
    // Support common patterns: totalTimeMinutes, totalTime, totalTimeMinutes, or derived
    const t =
      r?.totalTimeMinutes ??
      r?.totalTime ??
      r?.timeMinutes ??
      r?.cookTimeMinutes ??
      r?.cookTime ??
      null;

    if (typeof t === 'number' && Number.isFinite(t)) return t;

    // ISO 8601 duration e.g. PT20M
    if (typeof t === 'string') {
      const m = t.match(/PT(?:(\d+)H)?(?:(\d+)M)?/i);
      if (m) {
        const hours = m[1] ? parseInt(m[1], 10) : 0;
        const mins = m[2] ? parseInt(m[2], 10) : 0;
        return hours * 60 + mins;
      }
      // "20 min" etc.
      const m2 = t.match(/(\d+)\s*(min|m)/i);
      if (m2) return parseInt(m2[1], 10);
    }
    return null;
  };

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  // ---------- ALL CATEGORIES VIEW ----------
  const categoriesDisplayed = useMemo(() => {
    if (!showAllCategories || !allCategories) return [];

    const sorted = [...allCategories].sort((a, b) => {
      if (categorySort === 'alphabetical') {
        return (a?.name || '').localeCompare(b?.name || '', 'de');
      }
      // popular = by count desc
      return (b?.count || 0) - (a?.count || 0);
    });

    return sorted;
  }, [showAllCategories, allCategories, categorySort]);

  // ---------- SINGLE CATEGORY VIEW ----------
  const filteredSortedRecipes = useMemo(() => {
    if (showAllCategories) return [];

    // No filtering, just sort
    let list = [...(recipes || [])];

    // Sort
    list.sort((a, b) => {
      switch (sortBy) {
        case 'alpha': {
          const an = a?.title || a?.recipeName || a?.name || '';
          const bn = b?.title || b?.recipeName || b?.name || '';
          return an.localeCompare(bn, 'de');
        }
        case 'time': {
          const at = getTotalMinutes(a) ?? 999999;
          const bt = getTotalMinutes(b) ?? 999999;
          return at - bt;
        }
        case 'rating': {
          const ar = a?.rating ?? a?.avgRating ?? 0;
          const br = b?.rating ?? b?.avgRating ?? 0;
          return br - ar;
        }
        case 'newest': {
          const ad = Date.parse(a?.updatedAt || a?.date || a?.publishedAt || '') || 0;
          const bd = Date.parse(b?.updatedAt || b?.date || b?.publishedAt || '') || 0;
          return bd - ad;
        }
        case 'popular':
        default: {
          // if you have views/likes/popularity use it; fallback ratingCount; else keep stable
          const ap = a?.popularity ?? a?.views ?? a?.ratingCount ?? 0;
          const bp = b?.popularity ?? b?.views ?? b?.ratingCount ?? 0;
          return bp - ap;
        }
      }
    });

    return list;
  }, [recipes, showAllCategories, sortBy]);

  const displayedRecipes = useMemo(() => {
    return filteredSortedRecipes.slice(0, displayCount);
  }, [filteredSortedRecipes, displayCount]);

  const hasMore = displayedRecipes.length < filteredSortedRecipes.length;

  const relatedCategories = useMemo(() => {
    if (!allCategories || !category?.slug) return [];
    return allCategories.filter((c) => c.slug !== category.slug).slice(0, 6);
  }, [allCategories, category?.slug]);

  // ---------- Animations ----------
  const fadeUp = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05 } },
  };

  // ---------- Layout wrappers ----------
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F3] via-white to-white dark:from-gray-950 dark:via-gray-950 dark:to-gray-900">
      {/* 🧭 BREADCRUMB SECTION */}
      <section className="bg-gray-50 dark:bg-gray-950 dark:border-gray-800 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              ...(showAllCategories ? [] : [{ name: 'Kategorien', url: '/kategorien' }]),
              { name: showAllCategories ? 'Kategorien' : heroTitle },
            ]}
          />
        </div>
      </section>

      {/* HERO */}
      <section className="relative bg-white">
  {/* HERO IMAGE */}
  <div className="px-0 sm:px-8 lg:px-16 relative h-[420px] sm:h-[380px] md:h-[460px] overflow-hidden">
    <img
      src={heroImage}
      alt={showAllCategories ? 'Kategorien – Kochera' : `${category?.name || 'Kategorie'} – Kochera`}
      className="w-full h-full object-cover"
    />

    {/* VERY subtle image fade (not dark) */}
    <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/10 to-white/60" />
  </div>

  {/* CONTENT CARD */}
  <div className="relative -mt-24 md:-mt-28">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="
          bg-gradient-to-b
  from-white/50
  via-white/9
  to-white
  shadow-[0_20px_40px_-20px_rgba(0,0,0,0.25)]
        "
      >
        <div className="p-6 md:p-10 text-gray-900">
          <div className="flex flex-col items-center gap-8">
            {/* CONTENT */}
            <div className="w-full max-w-3xl text-center">
              <div className="flex items-center gap-3 mb-4">

              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                {heroTitle}
              </h1>

              <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
                {heroDescription}
              </p>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-center w-full max-w-3xl">
              <ShareButton
                title={heroTitle}
                excerpt={heroDescription}
                url={currentUrl}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </div>
</section>



      {/* CONTENT */}
      {showAllCategories ? (
        <AllCategoriesSection categories={categoriesDisplayed} />
      ) : (
        <>
          {/* Recipes */}
          <section id="kochera-recipes" className="py-10 md:py-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8"
              >

                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Angezeigt: <span className="font-semibold">{displayedRecipes.length}</span> /{' '}
                  <span className="font-semibold">{filteredSortedRecipes.length}</span>
                </div>
              </motion.div>

              {filteredSortedRecipes.length === 0 ? (
                <EmptyState
                  title="Keine Rezepte"
                  description="Es sind derzeit keine Rezepte in dieser Kategorie verfügbar."
                />
              ) : (
                <motion.div
                  variants={stagger}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {displayedRecipes.map((recipe) => (
                    <motion.div key={recipe.slug} variants={fadeUp}>
                      <RecipeCard recipe={recipe} />
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Load more */}
              {hasMore && (
                <div className="mt-10 flex justify-center">
                  <button
                    onClick={() => setDisplayCount((p) => p + 12)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition"
                  >
                    Mehr anzeigen
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Tips */}
          <section className="py-12 md:py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-900/10 dark:via-pink-900/10 dark:to-orange-900/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-10">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-gray-200 shadow-sm dark:bg-gray-900 dark:border-gray-800">
                    <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </span>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
                      Tipps für bessere Ergebnisse
                    </h2>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">
                      Kleine Details, die Geschmack & Konsistenz sofort verbessern.
                    </p>
                  </div>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {getCategoryTipsDE(category?.name).map((tip, idx) => (
                  <motion.div
                    key={idx}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6 dark:bg-gray-900 dark:border-gray-800"
                  >
                    <div className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-200">
                        {tip.icon}
                      </span>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{tip.title}</h3>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                          {tip.content}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Related categories */}
          {!!relatedCategories.length && (
            <section className="py-12 md:py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-10">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
                    Weitere Kategorien entdecken
                  </h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    Mehr Inspiration für deinen Koch-Alltag.
                  </p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {relatedCategories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/${cat.slug}`}
                      className="group rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition dark:bg-gray-900 dark:border-gray-800"
                    >
                      <div className="relative aspect-square">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <div className="text-xl">{cat.icon}</div>
                          <div className="mt-1 text-sm font-bold leading-tight">{cat.name}</div>
                          <div className="text-xs text-white/85">{cat.count} Rezepte</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* FAQ (Category) */}
          <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-950/40">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6 md:p-8 dark:bg-gray-900 dark:border-gray-800"
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-200">
                    <BookOpen className="w-5 h-5" />
                  </span>
                  <div>
                    <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white">
                      Häufige Fragen zu {category?.name || 'dieser Kategorie'}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Kurz & hilfreich – damit deine Rezepte sicher gelingen.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {getCategoryFAQsDE(category?.name, category?.slug, recipes?.length).map((faq, idx) => (
                    <details
                      key={idx}
                      className="group rounded-xl border border-gray-200 bg-gray-50 p-4 open:bg-white open:shadow-sm transition dark:border-gray-800 dark:bg-gray-950 dark:open:bg-gray-900"
                    >
                      <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {faq.question}
                        </span>
                        <span className="text-purple-600 dark:text-purple-400 group-open:rotate-180 transition-transform">
                          ▼
                        </span>
                      </summary>
                      <div className="mt-3 text-sm text-gray-600 dark:text-gray-300 prose prose-sm max-w-none dark:prose-invert">
                        <ReactMarkdown
                          components={{
                            a: ({ node, ...props }) => (
                              <Link
                                {...props}
                                href={props.href || '#'}
                                className="text-purple-600 dark:text-purple-400 underline hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
                              />
                            ),
                          }}
                        >
                          {faq.answer}
                        </ReactMarkdown>
                      </div>
                    </details>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-12 md:py-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="rounded-3xl overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl"
              >
<div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 md:p-8 dark:border-white/10 dark:bg-white/5">
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
    <div className="max-w-2xl">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
        Lust auf mehr Inspiration?
      </h2>
      <p className="mt-1.5 text-sm md:text-base text-gray-600 dark:text-gray-300">
        Entdecke alle Rezepte oder stöbere durch Kategorien.
      </p>
    </div>

    <div className="flex flex-col sm:flex-row gap-3">
      <Link
        href="/rezepte"
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-gray-900 font-medium border border-gray-200 hover:bg-gray-50 transition dark:bg-white/10 dark:text-white dark:border-white/15 dark:hover:bg-white/15"
      >
        Alle Rezepte
        <ArrowRight className="w-5 h-5" />
      </Link>

      <Link
        href="/kategorien"
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-transparent text-gray-700 font-medium hover:text-gray-900 transition dark:text-gray-300 dark:hover:text-white"
      >
        Kategorien
        <ArrowRight className="w-5 h-5" />
      </Link>
    </div>
  </div>
</div>


              </motion.div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

/* ----------------------------- UI Components ----------------------------- */

function AllCategoriesSection({ categories }) {
  return (
    <section className="py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
            Kategorien
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Wähle eine Kategorie und entdecke passende Rezepte.
          </p>
        </motion.div>

        {categories.length === 0 ? (
          <EmptyState
            title="Keine Kategorien gefunden"
            description="Es sind derzeit keine Kategorien verfügbar."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <motion.div key={cat.slug} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.03 }}>
                <Link href={`/${cat.slug}`} className="group block rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition dark:bg-gray-900 dark:border-gray-800">
                  <div className="relative h-36">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <div className="absolute top-3 right-3 text-2xl">{cat.icon}</div>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="text-lg font-bold">{cat.name}</div>
                      <div className="text-xs text-white/85">{cat.count} Rezepte</div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {cat.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}


function EmptyState({ title, description, onReset }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:bg-gray-900 dark:border-gray-800">
      <div className="mx-auto w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center dark:bg-purple-900/30 dark:text-purple-200">
        <Search className="w-6 h-6" />
      </div>
      <h3 className="mt-4 text-lg font-extrabold text-gray-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{description}</p>
      {onReset && (
        <button
          onClick={onReset}
          className="mt-5 inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-900 font-semibold transition dark:bg-gray-900 dark:border-gray-800 dark:hover:bg-gray-800 dark:text-white"
        >
          <X className="w-4 h-4" />
          Zurücksetzen
        </button>
      )}
    </div>
  );
}

/* ----------------------------- Tips + FAQ (DE) ---------------------------- */

function getCategoryTipsDE(categoryName = '') {
  // You can expand category-specific logic later.
  return [
    {
      icon: <Timer className="w-5 h-5" />,
      title: 'Mise en Place spart Zeit',
      content:
        'Zutaten abwiegen, Schüssel & Tools bereitstellen – so kochst du schneller und ohne Stress.',
    },
    {
      icon: <ChefHat className="w-5 h-5" />,
      title: 'Temperatur ist alles',
      content:
        'Mittlere Hitze + Geduld: Viele Gerichte werden besser, wenn die Pfanne/der Ofen wirklich vorgeheizt ist.',
    },
    {
      icon: <Star className="w-5 h-5" />,
      title: 'Kleine Anpassungen, großer Effekt',
      content:
        'Mit Salz, Säure (Zitrone/Essig) und Kräutern kannst du Geschmack sauber ausbalancieren – ohne kompliziert zu werden.',
    },
  ];
}

function getCategoryFAQsDE(categoryName = '', categorySlug = '', recipeCount = 0) {
  // Keep it clean, helpful, and always true.
  // (Google: FAQs should be visible in UI if you also output FAQPage schema.)
  const base = [
    {
      question: `Wie viele Rezepte gibt es in „${categoryName || 'dieser Kategorie'}“?`,
      answer: `Aktuell findest du hier **${recipeCount}** Rezepte. Wir erweitern die Sammlung laufend.`,
    },
    {
      question: 'Kann ich Rezepte nach Zeit und Schwierigkeit filtern?',
      answer:
        'Ja. Nutze oben **Filter** (Schwierigkeit & Zeit) und die **Sortierung**, um schnell passende Rezepte zu finden.',
    },
    {
      question: 'Sind die Rezepte für Anfänger geeignet?',
      answer:
        'Viele Rezepte sind **leicht** und Schritt-für-Schritt erklärt. Wenn du neu startest, wähle „Leicht“ in den Filtern.',
    },
  ];

  // Optional small category-specific additions
  if ((categorySlug || '').includes('pfannkuchen')) {
    base.unshift({
      question: 'Wie werden Pfannkuchen besonders fluffig?',
      answer:
        'Teig nicht überrühren, kurz ruhen lassen und bei **mittlerer Hitze** backen. So bleiben sie weich und locker.',
    });
  }

  return base.slice(0, 6);
}
