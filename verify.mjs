// Optional developer checks: node verify.mjs (not needed to run the app).
import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

const read = (file) => fs.readFileSync(new URL(file, import.meta.url), "utf8");
const dataSource = read("data.js");
const appSource = read("app.js");
const i18nSource = read("i18n.js");
const html = read("index.html");
new vm.Script(appSource);
const data = vm.runInNewContext(`${dataSource}; conjugationData`);
assert.equal(Object.keys(data.tenses).length, 11);
assert.ok(data.verbs.length >= 200);
assert.equal(new Set(data.verbs.map((v) => v.infinitive)).size, data.verbs.length);
assert.equal(data.levels.length, 10);
const levelNames = data.levels.flatMap((level) => level.verbs);
assert.equal(levelNames.length, 235);
assert.equal(new Set(levelNames).size, 235);
assert.ok(levelNames.every((name) => data.verbs.some((verb) => verb.infinitive === name)));
for (const level of data.levels) {
  assert.ok([23, 24].includes(level.verbs.length));
  assert.equal(data.verbs.filter((verb) => verb.level === level.id).length, level.verbs.length);
  assert.ok(level.verbs.every((name) => data.verbs.find((verb) => verb.infinitive === name).level === level.id));
}
let formCount = 0;
for (const verb of data.verbs) {
  assert.ok(data.categories[verb.category], verb.infinitive);
  assert.ok(verb.topics.length && verb.topics.every((topic) => data.topics[topic]));
  for (const tense of Object.keys(data.tenses)) {
    const forms = verb.conjugations[tense];
    if (!forms) {
      assert.equal(tense, "imperatif");
      assert.ok(["pouvoir", "falloir", "pleuvoir"].includes(verb.infinitive));
      continue;
    }
    assert.equal(forms.length, tense === "imperatif" ? 3 : verb.impersonal ? 1 : 6);
    for (const variants of forms) {
      assert.ok(Array.isArray(variants) && variants.length);
      assert.ok(variants.every((s) => typeof s === "string" && s.trim() === s && s.length && !s.includes("undefined")));
      assert.equal(new Set(variants).size, variants.length);
      formCount++;
    }
  }
}
const forms = (verb, tense, index) => data.verbs.find((v) => v.infinitive === verb).conjugations[tense][index];
const cases = [
  ["parler", "present", 3, "parlons"], ["finir", "imparfait", 3, "finissions"],
  ["vendre", "futurSimple", 0, "vendrai"], ["manger", "imparfait", 3, "mangions"],
  ["manger", "imparfait", 0, "mangeais"], ["commencer", "present", 3, "commençons"],
  ["annoncer", "subjonctifPresent", 3, "annoncions"], ["voyager", "subjonctifPresent", 4, "voyagiez"],
  ["acheter", "present", 0, "achète"], ["appeler", "futurSimple", 0, "appellerai"],
  ["jeter", "present", 3, "jetons"], ["payer", "present", 0, "paye"],
  ["payer", "present", 0, "paie"], ["essayer", "conditionnelPresent", 0, "essayerais"],
  ["espérer", "futurSimple", 0, "espèrerai"], ["espérer", "futurSimple", 0, "espérerai"],
  ["envoyer", "futurSimple", 0, "enverrai"], ["être", "subjonctifPresent", 3, "soyons"],
  ["avoir", "imperatif", 1, "ayons"], ["faire", "subjonctifPresent", 4, "fassiez"],
  ["aller", "imperatif", 0, "va"], ["ouvrir", "imperatif", 0, "ouvre"],
  ["vouloir", "subjonctifPresent", 3, "voulions"], ["savoir", "imperatif", 0, "sache"],
  ["prendre", "subjonctifPresent", 0, "prenne"], ["comprendre", "subjonctifPresent", 3, "comprenions"],
  ["recevoir", "subjonctifPresent", 0, "reçoive"], ["boire", "subjonctifPresent", 3, "buvions"],
  ["inscrire", "passeCompose", 0, "ai inscrit"], ["découvrir", "present", 0, "découvre"],
  ["aller", "passeCompose", 2, "est allée"], ["venir", "plusQueParfait", 3, "étions venues"],
  ["aller", "futurAnterieur", 4, "serez allée"], ["aller", "futurAnterieur", 4, "serez allées"],
  ["faire", "conditionnelPasse", 0, "aurais fait"], ["aller", "subjonctifPasse", 5, "soient allées"],
  ["se lever", "imperatif", 0, "lève-toi"], ["se lever", "passeCompose", 0, "me suis levée"],
  ["s'habiller", "present", 0, "m'habille"], ["se souvenir", "subjonctifPresent", 0, "me souvienne"],
  ["se souvenir", "imperatif", 1, "souvenons-nous"], ["se parler", "passeCompose", 5, "se sont parlé"],
  ["se rappeler", "passeCompose", 5, "se sont rappelé"], ["se demander", "passeCompose", 5, "se sont demandé"],
  ["falloir", "subjonctifPasse", 0, "ait fallu"], ["pleuvoir", "conditionnelPasse", 0, "aurait plu"],
];
for (const [verb, tense, i, expected] of cases) assert.ok(forms(verb, tense, i).includes(expected), `${verb} ${tense}: ${expected}`);
assert.ok(!forms("se parler", "passeCompose", 5).includes("se sont parlées"));
assert.ok(!forms("aller", "passeCompose", 3).includes("sommes allé"));

// Minimal DOM double exercises application events; it does not test rendering.
const nodes = new Map();
class Element {
  constructor(tag = "div") { this.tag = tag; this.children = []; this.listeners = {}; this.hidden = false; this.value = ""; this._text = ""; this.attributes = {}; this.classList = { add() {} }; }
  set id(id) { this._id = id; nodes.set(id, this); }
  get id() { return this._id; }
  set textContent(text) { this._text = text; this.children = []; }
  get textContent() { return this._text + this.children.map((node) => node.textContent).join(""); }
  append(...children) { for (let node of children) { if (typeof node === "string") { const text = new Element("text"); text.textContent = node; node = text; } node.parentElement = this; this.children.push(node); } }
  replaceChildren(...children) { this.children = []; this.append(...children); }
  setAttribute(name, value) { this.attributes[name] = value; }
  getAttribute(name) { return this.attributes[name]; }
  addEventListener(type, fn) { this.listeners[type] = fn; }
  fire(type) { this.listeners[type]?.({ preventDefault() {} }); if (type === "change") this.parentElement?.fire(type); }
  dispatchEvent(event) { this.fire(event.type); }
  focus() { this.focused = true; }
  setSelectionRange(start, end) { this.selectionStart = start; this.selectionEnd = end; }
  closest() { let node = this; while (node && node.className !== "answer-row") node = node.parentElement; return node; }
  querySelectorAll(selector) { return this.children.flatMap((child) => [...(child.tag === selector ? [child] : []), ...child.querySelectorAll(selector)]); }
  querySelector(selector) { return this.querySelectorAll(selector === 'button[type="submit"]' ? "button" : selector)[0]; }
}
for (const match of html.matchAll(/id="([^"]+)"/g)) { const node = new Element(); node.id = match[1]; }
const node = (id) => nodes.get(id);
const translatedNodes = [];
for (const match of html.matchAll(/<[^>]+data-i18n="([^"]+)"[^>]*>/g)) {
  const id = match[0].match(/\bid="([^"]+)"/);
  const element = id ? node(id[1]) : new Element();
  element.setAttribute("data-i18n", match[1]);
  translatedNodes.push(element);
}
const settings = node("settings-form");
assert.ok(html.includes('<option value="5" selected>5</option>'));
node("exercise-count").value = "5"; // Simulate the HTML-selected option.
settings.append(node("tense-options"), node("verb-options"), new Element("button"));
let testNow = 1800000000000;
const storage = new Map();
let storageBlocked = false;
const context = vm.createContext({
  Date: class extends Date { static now() { return testNow; } },
  localStorage: {
    getItem(key) { if (storageBlocked) throw new Error("Blocked"); return storage.get(key) ?? null; },
    setItem(key, value) { if (storageBlocked) throw new Error("Blocked"); storage.set(key, value); },
    removeItem(key) { if (storageBlocked) throw new Error("Blocked"); storage.delete(key); },
  },
  Event: class { constructor(type) { this.type = type; } },
  document: { documentElement: {}, querySelectorAll: () => translatedNodes, getElementById: node, createElement: (tag) => new Element(tag), createTextNode: (text) => { const n = new Element("text"); n.textContent = text; return n; } },
  FormData: class { constructor(form) { this.form = form; } getAll(name) { return this.form.querySelectorAll("input").filter((input) => input.name === name && input.checked).map((input) => input.value); } },
});
vm.runInContext(dataSource + "\n" + i18nSource + "\n" + appSource, context);
const run = (code) => vm.runInContext(code, context);
assert.equal(settings.querySelectorAll("input").filter((i) => i.name === "verb").length, data.verbs.length);
assert.equal(node("practice-level").value, "1");
assert.equal(run("verbChoices.filter(({checkbox}) => !checkbox.parentElement.hidden).length"), 24);
settings.fire("submit");
assert.equal(run("session.exercises.length"), 5);
assert.ok(run("session.exercises.every(e => e.verb.level === 1)"));
node("leave-practice").fire("click");
// Every level and each session size must stay within the chosen level.
for (const level of data.levels) {
  node("practice-level").value = String(level.id); node("practice-level").fire("change");
  for (const length of [3, 5, 10]) {
    node("exercise-count").value = String(length);
    run("clearRecentHistory()");
    settings.fire("submit");
    assert.equal(run("session.exercises.length"), length);
    assert.ok(run(`session.exercises.every(e => e.verb.level === ${level.id})`));
    assert.equal(run("new Set(session.exercises.map(e => e.verb.infinitive)).size"), length);
    node("leave-practice").fire("click");
  }
}
node("clear-all").fire("click");
node("practice-level").value = "1"; node("practice-level").fire("change");
run("verbGroups[0].toggle.checked = true; verbGroups[0].toggle.fire('change')");
assert.ok(run("verbChoices.filter(({checkbox}) => checkbox.checked).every(({verb}) => verb.level === 1 && verb.category === 'er')"));
node("practice-level").value = "2"; node("practice-level").fire("change");
settings.fire("submit");
assert.ok(node("settings-error").textContent.includes("chosen level"));
run("clearRecentHistory()");
// A shorter eligible pool must not be padded with duplicates or outside verbs.
node("select-shown").fire("click");
run("verbChoices.forEach(({checkbox,verb}) => { checkbox.checked = ['laver','porter'].includes(verb.infinitive); })");
settings.fire("submit");
assert.equal(run("session.exercises.length"), 2);
node("leave-practice").fire("click");
node("practice-level").value = ""; node("practice-level").fire("change");
node("exercise-count").value = "5";
node("clear-all").fire("click");
node("verb-search").value = "etre"; node("verb-search").fire("input");
assert.equal(run("verbChoices.filter(({checkbox}) => !checkbox.parentElement.hidden).length"), 1);
node("select-shown").fire("click");
assert.equal(run("verbChoices.filter(({checkbox}) => checkbox.checked).length"), 1);
node("verb-search").value = "zzzzzz"; node("verb-search").fire("input");
assert.equal(run("verbChoices.filter(({checkbox}) => checkbox.checked).length"), 1);
assert.ok(node("selection-status").textContent.includes("no matches"));
node("verb-search").value = ""; node("topic-filter").value = "travel"; node("topic-filter").fire("change");
assert.ok(run("verbChoices.filter(({checkbox}) => !checkbox.parentElement.hidden).every(({verb}) => verb.topics.includes('travel'))"));
run("verbGroups[0].toggle.checked = true; verbGroups[0].toggle.fire('change')");
assert.ok(run("verbGroups[0].checkboxes.every(c => c.checked)"));
run("verbGroups[0].checkboxes[0].checked = false; updateSelection()");
assert.ok(run("verbGroups[0].toggle.indeterminate"));
node("clear-all").fire("click"); settings.fire("submit");
assert.ok(node("settings-error").textContent.includes("Select at least"));
run("clearRecentHistory(); startSession({verbs:['falloir','pouvoir'],tenseIds:['imperatif'],exerciseCount:10})");
assert.ok(node("settings-error").textContent.includes("do not have forms"));
const orders = new Set();
for (let i = 0; i < 50; i++) {
  run("clearRecentHistory(); startSession({verbs:conjugationData.verbs.map(v=>v.infinitive),tenseIds:['imperatif','present'],exerciseCount:10})");
  assert.equal(run("session.exercises.length"), 10);
  assert.equal(run("new Set(session.exercises.map(e=>e.verb.infinitive)).size"), 10);
  assert.ok(run("session.exercises.every(e=>e.verb.conjugations[e.tenseId])"));
  orders.add(run("session.exercises.map(e=>e.verb.infinitive).join(',')"));
}
assert.ok(orders.size > 1);
// Mixed 6/3/1-field session; each checked retry retains its own score.
run("clearRecentHistory(); startSession({verbs:['être','aller','falloir'],tenseIds:['present'],exerciseCount:10}); session.exercises = [{verb:conjugationData.verbs.find(v=>v.infinitive==='être'),tenseId:'imparfait',correctCount:0},{verb:conjugationData.verbs.find(v=>v.infinitive==='aller'),tenseId:'imperatif',correctCount:0},{verb:conjugationData.verbs.find(v=>v.infinitive==='falloir'),tenseId:'present',correctCount:0}]; renderExercise()");
node("answer-0").value = "etais"; node("answer-1").value = "étais";
node("answer-form").fire("submit");
assert.equal(run("session.exercises[0].correctCount"), 1);
assert.equal(node("feedback-0").textContent, "X étais");
node("try-again").fire("click");
assert.equal(run("session.index"), 0);
for (const [i, answer] of ["étais", "étais", "était", "étions", "étiez", "étaient"].entries()) node(`answer-${i}`).value = answer;
node("answer-form").fire("submit"); node("next-question").fire("click");
assert.equal(node("answer-fields").querySelectorAll("input").length, 3);
node("answer-0").value = "va";
node("answer-form").fire("submit"); node("next-question").fire("click");
assert.equal(node("answer-fields").querySelectorAll("input").length, 1);
node("answer-0").value = "faut";
node("answer-form").fire("submit"); node("next-question").fire("click");
assert.equal(node("correct-total").textContent, "9");
assert.equal(node("incorrect-total").textContent, "7");
assert.ok(node("session-results").textContent.includes("Checked attempts: 4. Answers checked: 16."));
assert.equal(run("session"), null);
run("clearRecentHistory(); startSession({verbs:['se lever'],tenseIds:['passeCompose'],exerciseCount:10})");
node("answer-0").value = "me suis levée";
node("answer-1").value = "t’es levé";
node("answer-form").fire("submit");
assert.equal(run("session.exercises[0].correctCount"), 2);
assert.equal(run("normalizeAnswer('etais') === normalizeAnswer('étais')"), false);
assert.equal(run("normalizeAnswer('e\\u0301tais') === normalizeAnswer('étais')"), true);
// Copy preserves the exact text, replaces only the next field, and never submits.
run("clearRecentHistory(); startSession({verbs:['parler'],tenseIds:['present'],exerciseCount:5})");
let copies = node("answer-fields").querySelectorAll("button");
assert.equal(copies.length, 5); // No button after the last subject.
assert.ok(copies.every((button) => button.disabled && button.type === "button"));
node("answer-1").value = "existing answer";
copies[0].fire("click");
assert.equal(node("answer-1").value, "existing answer"); // Empty source is a no-op.
node("answer-0").value = "parle"; node("answer-0").fire("input");
assert.equal(copies[0].disabled, false);
copies[0].fire("click");
assert.equal(node("answer-0").value, "parle");
assert.equal(node("answer-1").value, "parle");
assert.equal(node("answer-2").value, "");
assert.ok(node("answer-1").focused);
assert.equal(node("answer-1").selectionStart, 5);
assert.equal(copies[1].disabled, false); // Can copy onward without typing again.
assert.equal(run("session.checked"), false);
node("answer-1").value = "parles"; node("answer-1").fire("input");
copies[1].fire("click");
assert.equal(node("answer-2").value, "parles");
node("answer-form").fire("submit");
assert.ok(copies.every((button) => button.hidden && button.disabled));
node("answer-0").value = "changed"; copies[0].fire("click");
assert.equal(node("answer-1").value, "parles");
node("try-again").fire("click");
copies = node("answer-fields").querySelectorAll("button");
assert.equal(copies.length, 5);
assert.ok(copies.every((button) => !button.hidden && button.disabled));
node("answer-0").value = "m’étais levée"; node("answer-0").fire("input"); copies[0].fire("click");
assert.equal(node("answer-1").value, "m’étais levée");
run("clearRecentHistory(); startSession({verbs:['aller'],tenseIds:['imperatif'],exerciseCount:3})");
assert.equal(node("answer-fields").querySelectorAll("button").length, 2);
run("clearRecentHistory(); startSession({verbs:['falloir'],tenseIds:['present'],exerciseCount:3})");
assert.equal(node("answer-fields").querySelectorAll("button").length, 0);
// Enter navigates fields without submitting, including 3- and 1-field exercises.
for (const [verb, tense, length] of [['parler', 'present', 6], ['aller', 'imperatif', 3], ['falloir', 'present', 1]]) {
  run(`clearRecentHistory(); startSession({verbs:[${JSON.stringify(verb)}],tenseIds:[${JSON.stringify(tense)}],exerciseCount:3})`);
  for (let i = 0; i < length; i++) {
    const target = i < length - 1 ? node(`answer-${i + 1}`) : node('check-answers');
    target.focused = false;
    let prevented = false;
    node(`answer-${i}`).listeners.keydown({ key: 'Enter', preventDefault() { prevented = true; } });
    assert.ok(prevented);
    assert.ok(target.focused);
    assert.equal(run('session.checked'), false);
  }
}
// Both languages cover every static key and every stored usage note.
assert.ok(run("Object.values(messages).every(pair => pair.length === 2 && pair.every(text => typeof text === 'string' && text.length))"));
assert.ok(run("conjugationData.verbs.every(verb => !verb.note || frenchNotes[verb.note])"));
for (const element of translatedNodes) assert.ok(run(`messages[${JSON.stringify(element.getAttribute('data-i18n'))}]`));
node('leave-practice').fire('click');
const savedSelection = run("verbChoices.map(({checkbox})=>checkbox.checked).join(',')");
run("setSettingsError('chooseRequired')");
node('language-toggle').fire('click');
assert.equal(run('language'), 'fr');
assert.equal(run('document.documentElement.lang'), 'fr');
assert.equal(node('check-answers').textContent, 'Vérifier les réponses');
assert.ok(node('settings-error').textContent.includes('Sélectionnez'));
assert.ok(run("levelOptions[0].option.textContent.includes('Niveau 1')"));
assert.ok(run("topicOptions[0].option.textContent.includes('Vie quotidienne')"));
assert.equal(run("verbChoices.map(({checkbox})=>checkbox.checked).join(',')"), savedSelection);
node('language-toggle').fire('click');
assert.ok(node('settings-error').textContent.includes('Select at least'));
run("clearRecentHistory(); startSession({verbs:['se lever'],tenseIds:['passeCompose'],exerciseCount:3})");
const savedField = node('answer-0');
savedField.value = 'me suis levée'; savedField.fire('input');
node('language-toggle').fire('click');
assert.equal(node('answer-0'), savedField);
assert.equal(savedField.value, 'me suis levée');
assert.ok(node('verb-note').textContent.includes('Emploi pronominal'));
assert.equal(node('answer-fields').querySelectorAll('button')[0].textContent, 'Copier ↓');
assert.equal(run('session.checked'), false);
node('answer-form').fire('submit');
const savedFeedback = node('feedback-0').textContent;
assert.ok(node('answer-summary').textContent.startsWith('1 réponse(s) correcte(s) sur 6'));
assert.equal(node('next-question').textContent, 'Terminer la séance');
node('language-toggle').fire('click');
assert.equal(node('answer-0'), savedField);
assert.equal(savedField.readOnly, true);
assert.equal(node('feedback-0').textContent, savedFeedback);
assert.equal(run('session.exercises[0].correctCount'), 1);
assert.equal(node('next-question').textContent, 'Finish Session');
assert.ok(node('answer-fields').querySelectorAll('button').every(button=>button.hidden));
node('next-question').fire('click');
node('language-toggle').fire('click');
assert.equal(node('complete-heading').textContent, 'Séance terminée');
assert.equal(node('session-results').textContent, 'Exercices terminés : 1. Tentatives vérifiées : 1. Réponses vérifiées : 6.');
assert.equal(node('correct-total').textContent, '1');
assert.equal(node('incorrect-total').textContent, '5');
node('language-toggle').fire('click');
assert.equal(node('complete-heading').textContent, 'Session complete');
// Reproduce the reported bug: six mistakes followed by a perfect retry and
// two perfect exercises must remain 18 correct + 6 incorrect, not 18 + 0.
run("clearRecentHistory(); startSession({verbs:['parler','aimer','habiter'],tenseIds:['present'],exerciseCount:3})");
assert.equal(run('session.attempts.length'), 0);
node('answer-form').fire('submit');
assert.equal(run('session.attempts.length'), 1);
node('answer-form').fire('submit'); // Repeated submit after checking is ignored.
assert.equal(run('session.attempts.length'), 1);
node('try-again').fire('click');
assert.equal(run('session.attempts.length'), 1);
for (let i = 0; i < 3; i++) {
  const expected = run('session.exercises[session.index].verb.conjugations.present');
  expected.forEach((variants, j) => { node(`answer-${j}`).value = variants[0]; });
  node('answer-form').fire('submit'); node('next-question').fire('click');
}
assert.equal(node('correct-total').textContent, '18');
assert.equal(node('incorrect-total').textContent, '6');
assert.equal(node('session-results').textContent, 'Exercises completed: 3. Checked attempts: 4. Answers checked: 24.');
node('language-toggle').fire('click');
assert.ok(node('session-results').textContent.includes('Tentatives vérifiées : 4. Réponses vérifiées : 24.'));
assert.equal(node('incorrect-total').textContent, '6');
run("clearRecentHistory(); startSession({verbs:['parler'],tenseIds:['present'],exerciseCount:3})");
assert.equal(run('session.attempts.length'), 0);
console.log(`Passed: ${data.verbs.length} verbs in 10 balanced levels, session lengths, ${formCount} answer slots, ${cases.length} reference forms, filters, scoring, copying, Enter navigation, and EN/FR switching without losing selections, answers, feedback, or results. Rendering is not covered.`);

// One-hour history uses actual displayed verbs, survives page reload, and expires.
run("language = 'en'; clearRecentHistory(); returnToSettings()");
const allSettings = "({verbs:conjugationData.verbs.map(v=>v.infinitive),tenseIds:['present'],exerciseCount:3})";
run("startSession" + allSettings);
const firstRound = Array.from(run("session.exercises.map(e=>e.verb.infinitive)"));
assert.equal(run("Object.keys(readRecentVerbs()).length"), 1); // Future questions aren't remembered.
for (let i = 0; i < 3; i++) {
  node("answer-form").fire("submit");
  node("next-question").fire("click");
}
assert.equal(run("Object.keys(readRecentVerbs()).length"), 3);
run("returnToSettings(); startSession" + allSettings);
assert.ok(run("session.exercises").every(e => !firstRound.includes(e.verb.infinitive)));
run("returnToSettings(); recentVerbs = {}"); // Reload discards the in-memory cache.
assert.equal(run("Object.keys(readRecentVerbs()).length"), 4);
const freshContext = vm.createContext({
  document: context.document, Event: context.Event, FormData: context.FormData,
  Date: context.Date, localStorage: context.localStorage,
});
vm.runInContext(dataSource + "\n" + i18nSource + "\n" + appSource, freshContext);
assert.equal(vm.runInContext("Object.keys(readRecentVerbs()).length", freshContext), 4);
// Restore event handlers to the main context after the reload test.
vm.runInContext("document.getElementById('clear-recent-history').addEventListener('click', clearRecentHistory)", context);
run("clearRecentHistory(); rememberVerb('parler')");
testNow += 60 * 60 * 1000 - 1;
assert.ok(run("Object.hasOwn(readRecentVerbs(), 'parler')"));
testNow += 1;
assert.equal(run("Object.keys(readRecentVerbs()).length"), 0);
run("rememberVerb('parler'); returnToSettings(); startSession({verbs:['parler'],tenseIds:['imparfait'],exerciseCount:3})");
assert.equal(run("session"), null);
assert.equal(run("settingsErrorKey"), "recentExhausted");
run("startSession({verbs:['parler','aimer'],tenseIds:['present'],exerciseCount:3})");
assert.equal(run("session.exercises.length"), 1);
assert.equal(run("session.exercises[0].verb.infinitive"), "aimer");
node("clear-recent-history").fire("click");
assert.equal(run("Object.keys(readRecentVerbs()).length"), 0);
const historyKey = run("recentHistoryKey");
storage.set(historyKey, "{bad json");
assert.equal(run("Object.keys(readRecentVerbs()).length"), 0);
storage.set(historyKey, JSON.stringify({parler:testNow + 1, aimer:"invalid", unknown:testNow}));
assert.equal(run("Object.keys(readRecentVerbs()).length"), 0);
storageBlocked = true;
run("rememberVerb('parler'); refreshRecentHistory()");
assert.equal(run("historyStorageAvailable"), false);
assert.ok(run("Object.hasOwn(readRecentVerbs(), 'parler')"));
assert.ok(node("recent-history-status").textContent.includes("storage is unavailable"));
run("returnToSettings(); startSession({verbs:['parler'],tenseIds:['present'],exerciseCount:3})");
assert.equal(run("session"), null);
run("clearRecentHistory()");
assert.equal(run("Object.keys(readRecentVerbs()).length"), 0);
console.log("Passed: history excludes previous rounds across tenses, records only shown verbs, survives reload, expires at one hour, shortens/exhausts pools, clears, and handles corrupt or blocked storage.");
