import { publishToday } from './recipe-workflow.mjs';

const summary = publishToday();
console.log(JSON.stringify(summary, null, 2));
