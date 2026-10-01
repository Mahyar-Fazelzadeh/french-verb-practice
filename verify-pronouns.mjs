// Static-bank checks run independently of the conjugation data and browser.
import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";
const source = fs.readFileSync(new URL("pronouns-data.js", import.meta.url), "utf8");
const bank = vm.runInNewContext(source + "\npronounsData", {});
assert.equal(bank.schemaVersion, 1);
assert.deepEqual(Array.from(bank.categories), ["cod", "coi", "y", "en", "combined"]);
for (const lang of ["en", "fr"]) assert.ok(bank.instructions[lang]?.trim());
assert.ok(bank.exercises.length >= 40);
const ids = new Set();
const prompts = new Set();
const validTags = new Set(["present", "elision", "negation", "infinitive", "agreement", "imperative", "compound", "negative-imperative", "place", "idea", "quantity", "partitive", "origin", "order"]);
const coverage = new Map(bank.categories.map(category => [category, 0]));
const normalize = text => text.normalize("NFC").toLowerCase().replaceAll("’", "'").replace(/\s+/g, " ").trim().replace(/\.$/, "");
for (const exercise of bank.exercises) {
  const label = exercise.id;
  assert.match(label, /^(cod|coi|y|en|combined)-\d{3}$/);
  assert.ok(!ids.has(label), "Duplicate ID: " + label);
  ids.add(label);
  assert.equal(exercise.type, "rewrite", label);
  assert.ok(coverage.has(exercise.category), label);
  coverage.set(exercise.category, coverage.get(exercise.category) + 1);
  assert.ok([1, 2, 3].includes(exercise.difficulty), label);
  assert.equal(typeof exercise.mixedEligible, "boolean", label);
  assert.ok(exercise.tags.length > 0 && exercise.tags.every(tag => validTags.has(tag)), label);
  assert.equal(typeof exercise.sentence, "string", label);
  const prompt = normalize(exercise.sentence) + JSON.stringify(exercise.targets);
  assert.ok(!prompts.has(prompt), "Duplicate prompt: " + label);
  prompts.add(prompt);
  assert.equal(exercise.targets.length, exercise.category === "combined" ? 2 : 1, label);
  const spans = [];
  for (const target of exercise.targets) {
    assert.ok(typeof target === "string" && target.trim(), label);
    const start = exercise.sentence.indexOf(target);
    assert.ok(start >= 0, "Missing target: " + label);
    assert.equal(exercise.sentence.indexOf(target, start + 1), -1, "Ambiguous target: " + label);
    const end = start + target.length;
    assert.ok(spans.every(([a, b]) => end <= a || start >= b), "Overlapping targets: " + label);
    spans.push([start, end]);
  }
  assert.ok(Array.isArray(exercise.acceptedAnswers) && exercise.acceptedAnswers.length, label);
  const answers = new Set();
  for (const answer of exercise.acceptedAnswers) {
    assert.ok(typeof answer === "string" && answer.trim(), label);
    const normalized = normalize(answer);
    assert.notEqual(normalized, normalize(exercise.sentence), label);
    assert.ok(!answers.has(normalized), "Duplicate answer variant: " + label);
    answers.add(normalized);
  }
  for (const lang of ["en", "fr"]) assert.ok(exercise.explanation[lang]?.trim(), label);
}
for (const [category, count] of coverage) {
  assert.ok(count >= 8, "Insufficient category coverage: " + category);
  assert.ok(bank.exercises.some(e => e.category === category && e.mixedEligible), category);
}
for (const tag of ["negation", "infinitive", "agreement", "imperative", "quantity"]) {
  assert.ok(bank.exercises.some(e => e.tags.includes(tag)), tag);
}
console.log("Passed: " + bank.exercises.length + " independent pronoun records, unique IDs/prompts, targets, accepted answers, bilingual explanations, category coverage, and adjustable difficulty metadata.");
