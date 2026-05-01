import { generateStrategy, writeStrategy, PATHS } from './recipe-workflow.mjs';

function readStartDate() {
  const arg = process.argv.find((value) => value.startsWith('--start-date='));
  if (!arg) return new Date();
  const value = arg.slice('--start-date='.length);
  return new Date(`${value}T00:00:00Z`);
}

const strategy = generateStrategy({ startDate: readStartDate() });
writeStrategy(strategy, PATHS.strategy);

console.log(
  JSON.stringify(
    {
      strategyPath: PATHS.strategy,
      days: Object.keys(strategy.days).length,
      plannedRecipes: strategy.summary.plannedRecipeCount,
      overflow: strategy.summary.overflowCount,
      skippedDuplicates: strategy.summary.skippedDuplicateCount,
    },
    null,
    2
  )
);
