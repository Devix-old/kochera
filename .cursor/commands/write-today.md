# write-today

Use this workflow when you want to publish the next planned batch from `strategy.json`.

If the user says `write-today` here in chat, treat that as the instruction to run this workflow yourself. Do not send the user back to the command line.

## What it does

1. Reads `strategy.json`
2. Finds the next unpublished day
3. Re-checks duplicates against `content/recipes`
4. Pulls replacements forward from later planned recipes when needed
5. Updates `date`, `publishedAt`, and `updatedAt`
6. Creates missing categories in `src/lib/categories.js` if required
7. Validates title and description lengths and rewrites awkward fallback SEO copy when needed
8. Copies recipe MDX to `content/recipes`
9. Copies prompt files to `content/prompts`
10. Copies images to `public/images/rezepte`
11. Marks the day as published in `strategy.json`
12. Runs `npm run lint` and `npm run build`
13. Stages only touched files and creates a local git commit with the published recipe URLs

## Run

```bash
npm run write-today
```
