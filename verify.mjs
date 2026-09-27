// Optional developer checks: node verify.mjs (not needed to run the app).
import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

const read = (file) => fs.readFileSync(new URL(file, import.meta.url), "utf8");
const dataSource = read("data.js");
const appSource = read("app.js");
const html = read("index.html");
new vm.Script(appSource);
const data = vm.runInNewContext(`${dataSource}; conjugationData`);
assert.equal(Object.keys(data.tenses).length, 11);
assert.ok(data.verbs.length >= 200);
assert.equal(new Set(data.verbs.map((v) => v.infinitive)).size, data.verbs.length);
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
  addEventListener(type, fn) { this.listeners[type] = fn; }
  fire(type) { this.listeners[type]?.({ preventDefault() {} }); if (type === "change") this.parentElement?.fire(type); }
  focus() {}
  closest() { let node = this; while (node && node.className !== "answer-row") node = node.parentElement; return node; }
  querySelectorAll(selector) { return this.children.flatMap((child) => [...(child.tag === selector ? [child] : []), ...child.querySelectorAll(selector)]); }
  querySelector(selector) { return this.querySelectorAll(selector === 'button[type="submit"]' ? "button" : selector)[0]; }
}
for (const match of html.matchAll(/id="([^"]+)"/g)) { const node = new Element(); node.id = match[1]; }
const node = (id) => nodes.get(id);
const settings = node("settings-form");
settings.append(node("tense-options"), node("verb-options"), new Element("button"));
const context = vm.createContext({
  document: { getElementById: node, createElement: (tag) => new Element(tag), createTextNode: (text) => { const n = new Element("text"); n.textContent = text; return n; } },
  FormData: class { constructor(form) { this.form = form; } getAll(name) { return this.form.querySelectorAll("input").filter((input) => input.name === name && input.checked).map((input) => input.value); } },
});
vm.runInContext(dataSource + "\n" + appSource, context);
const run = (code) => vm.runInContext(code, context);
assert.equal(settings.querySelectorAll("input").filter((i) => i.name === "verb").length, data.verbs.length);
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
run("startSession({verbs:['falloir','pouvoir'],tenseIds:['imperatif'],exerciseCount:10})");
assert.ok(node("settings-error").textContent.includes("do not have forms"));
const orders = new Set();
for (let i = 0; i < 50; i++) {
  run("startSession({verbs:conjugationData.verbs.map(v=>v.infinitive),tenseIds:['imperatif','present'],exerciseCount:10})");
  assert.equal(run("session.exercises.length"), 10);
  assert.equal(run("new Set(session.exercises.map(e=>e.verb.infinitive)).size"), 10);
  assert.ok(run("session.exercises.every(e=>e.verb.conjugations[e.tenseId])"));
  orders.add(run("session.exercises.map(e=>e.verb.infinitive).join(',')"));
}
assert.ok(orders.size > 1);
// Mixed 6/3/1-field session; retry replaces the prior score.
run("startSession({verbs:['être','aller','falloir'],tenseIds:['present'],exerciseCount:10}); session.exercises = [{verb:conjugationData.verbs.find(v=>v.infinitive==='être'),tenseId:'imparfait',correctCount:0},{verb:conjugationData.verbs.find(v=>v.infinitive==='aller'),tenseId:'imperatif',correctCount:0},{verb:conjugationData.verbs.find(v=>v.infinitive==='falloir'),tenseId:'present',correctCount:0}]; renderExercise()");
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
assert.equal(node("correct-total").textContent, "8");
assert.equal(node("incorrect-total").textContent, "2");
assert.equal(run("session"), null);
run("startSession({verbs:['se lever'],tenseIds:['passeCompose'],exerciseCount:10})");
node("answer-0").value = "me suis levée";
node("answer-1").value = "t’es levé";
node("answer-form").fire("submit");
assert.equal(run("session.exercises[0].correctCount"), 2);
assert.equal(run("normalizeAnswer('etais') === normalizeAnswer('étais')"), false);
assert.equal(run("normalizeAnswer('e\\u0301tais') === normalizeAnswer('étais')"), true);
console.log(`Passed: ${data.verbs.length} verbs, ${formCount} answer slots, ${cases.length} reference forms, filters, selection, random sessions, agreement, retries, and mixed-length scoring. Rendering is not covered.`);
