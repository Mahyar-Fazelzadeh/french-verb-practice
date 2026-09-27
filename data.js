"use strict";

// Local principal parts + deterministic rules. Each answer is an array of
// accepted forms. No network, database, or AI is involved at runtime.
const conjugationData = (() => {
  const subjects = ["Je / J’", "Tu", "Il / Elle", "Nous", "Vous", "Ils / Elles"];
  const tenses = {
    present: "Indicatif — Présent", passeCompose: "Indicatif — Passé composé",
    imparfait: "Indicatif — Imparfait", plusQueParfait: "Indicatif — Plus-que-parfait",
    futurSimple: "Indicatif — Futur simple", futurAnterieur: "Indicatif — Futur antérieur",
    conditionnelPresent: "Conditionnel — Présent", conditionnelPasse: "Conditionnel — Passé",
    subjonctifPresent: "Subjonctif — Présent", subjonctifPasse: "Subjonctif — Passé",
    imperatif: "Impératif — Présent",
  };
  const categories = { er: "Regular -er", ir: "Regular -ir (finir)", re: "Regular -re (vendre)", irregular: "Irregular verbs", pronominal: "Pronominal verbs" };
  const topics = { daily: "Daily life", work: "Work & studies", travel: "Travel & movement", feelings: "Feelings & opinions", communication: "Communication" };
  const seeds = [];
  const split = (text) => text.split("|");
  const endings = (stem, tails) => tails.map((tail) => stem + tail);
  const imperfectEndings = ["ais", "ais", "ait", "ions", "iez", "aient"];
  const futureEndings = ["ai", "as", "a", "ons", "ez", "ont"];
  const subjEndings = ["e", "es", "e", "ions", "iez", "ent"];

  function regular(infinitive, category, topic) {
    const stem = infinitive.slice(0, -2);
    const tails = category === "er" ? ["e", "es", "e", "ons", "ez", "ent"]
      : category === "ir" ? ["is", "is", "it", "issons", "issez", "issent"] : ["s", "s", "", "ons", "ez", "ent"];
    const seed = { infinitive, category, topics: [topic], present: endings(stem, tails),
      pp: stem + ({ er: "é", ir: "i", re: "u" })[category], future: category === "re" ? infinitive.slice(0, -1) : infinitive };
    seeds.push(seed);
    return seed;
  }
  function batch(category, topic, words) { words.split(" ").forEach((word) => regular(word, category, topic)); }
  batch("er", "daily", "aimer habiter travailler jouer regarder écouter préparer cuisiner laver porter fermer donner demander trouver chercher laisser rester arriver tomber entrer rentrer retourner passer monter visiter aider garder apporter allumer couper coûter fonctionner marcher montrer nettoyer occuper poser prêter quitter réparer réserver souhaiter terminer utiliser éviter inviter");
  batch("er", "work", "étudier expliquer présenter organiser participer proposer accepter refuser décider développer améliorer analyser comparer considérer créer discuter effectuer imaginer informer noter observer publier réaliser respecter");
  batch("er", "communication", "parler téléphoner contacter exprimer annoncer remercier répéter déclarer confirmer communiquer préciser partager");
  batch("er", "travel", "voyager traverser tourner rouler voler louer");
  batch("er", "feelings", "adorer détester espérer préférer penser rêver apprécier regretter supporter hésiter");
  batch("ir", "work", "finir choisir réussir remplir établir réfléchir agir réagir définir garantir accomplir fournir investir");
  batch("ir", "daily", "grandir grossir maigrir vieillir nourrir punir ralentir rougir obéir guérir réunir");
  batch("re", "daily", "vendre attendre entendre répondre perdre rendre descendre défendre dépendre prétendre étendre confondre fondre");

  const find = (name) => seeds.find((seed) => seed.infinitive === name);
  const patch = (name, values) => Object.assign(find(name), values);
  function changing(name, strongStem, futureStem = name) {
    const seed = find(name), weak = name.slice(0, -2);
    seed.category = "irregular";
    seed.present = [strongStem + "e", strongStem + "es", strongStem + "e", weak + "ons", weak + "ez", strongStem + "ent"];
    seed.subj = [strongStem + "e", strongStem + "es", strongStem + "e", weak + "ions", weak + "iez", strongStem + "ent"];
    seed.future = futureStem;
  }
  changing("nettoyer", "nettoi", "nettoier");
  for (const [name, stem] of [["considérer", "considèr"], ["répéter", "répèt"], ["espérer", "espèr"], ["préférer", "préfèr"]]) {
    changing(name, stem); find(name).futureAlternative = stem + "er";
  }
  for (const name of ["acheter", "lever", "appeler", "rappeler", "jeter", "payer", "essayer", "employer", "envoyer", "manger", "commencer"]) regular(name, "er", "daily");
  changing("acheter", "achèt", "achèter"); changing("lever", "lèv", "lèver");
  changing("appeler", "appell", "appeller"); changing("rappeler", "rappell", "rappeller");
  changing("jeter", "jett", "jetter"); changing("payer", "pai", "paier");
  changing("essayer", "essai", "essaier"); changing("employer", "emploi", "emploier");
  changing("envoyer", "envoi", "enverr");
  for (const name of ["annoncer", "commencer", "manger", "partager", "voyager"]) {
    const seed = find(name), stem = name.slice(0, -2);
    const adjusted = name.endsWith("cer") ? stem.slice(0, -1) + "ç" : stem + "e";
    seed.present[3] = adjusted + "ons";
    seed.imperfect = imperfectEndings.map((end, i) => (i === 3 || i === 4 ? stem : adjusted) + end);
    seed.subj = endings(stem, subjEndings);
  }

  function irregular(infinitive, present, pp, future, topic, extra = {}) {
    seeds.push({ infinitive, category: "irregular", topics: [topic], present: split(present), pp, future, ...extra });
  }
  irregular("être", "suis|es|est|sommes|êtes|sont", "été", "ser", "daily", { imperfect: endings("ét", imperfectEndings), subj: split("sois|sois|soit|soyons|soyez|soient"), imperative: split("sois|soyons|soyez") });
  irregular("avoir", "ai|as|a|avons|avez|ont", "eu", "aur", "daily", { subj: split("aie|aies|ait|ayons|ayez|aient"), imperative: split("aie|ayons|ayez") });
  irregular("aller", "vais|vas|va|allons|allez|vont", "allé", "ir", "travel", { aux: "être", subj: split("aille|ailles|aille|allions|alliez|aillent"), imperative: split("va|allons|allez") });
  irregular("faire", "fais|fais|fait|faisons|faites|font", "fait", "fer", "daily", { subj: endings("fass", subjEndings) });
  irregular("pouvoir", "peux|peux|peut|pouvons|pouvez|peuvent", "pu", "pourr", "daily", { subj: endings("puiss", subjEndings), imperative: null });
  irregular("vouloir", "veux|veux|veut|voulons|voulez|veulent", "voulu", "voudr", "feelings", { subj: split("veuille|veuilles|veuille|voulions|vouliez|veuillent"), imperative: split("veuille|veuillons|veuillez") });
  irregular("devoir", "dois|dois|doit|devons|devez|doivent", "dû", "devr", "work");
  irregular("savoir", "sais|sais|sait|savons|savez|savent", "su", "saur", "work", { subj: endings("sach", subjEndings), imperative: split("sache|sachons|sachez") });
  irregular("voir", "vois|vois|voit|voyons|voyez|voient", "vu", "verr", "daily");
  irregular("croire", "crois|crois|croit|croyons|croyez|croient", "cru", "croir", "feelings");
  irregular("boire", "bois|bois|boit|buvons|buvez|boivent", "bu", "boir", "daily");
  irregular("prendre", "prends|prends|prend|prenons|prenez|prennent", "pris", "prendr", "daily");
  irregular("venir", "viens|viens|vient|venons|venez|viennent", "venu", "viendr", "travel", { aux: "être" });
  irregular("tenir", "tiens|tiens|tient|tenons|tenez|tiennent", "tenu", "tiendr", "daily");
  irregular("mettre", "mets|mets|met|mettons|mettez|mettent", "mis", "mettr", "daily");
  irregular("dire", "dis|dis|dit|disons|dites|disent", "dit", "dir", "communication");
  irregular("lire", "lis|lis|lit|lisons|lisez|lisent", "lu", "lir", "work");
  irregular("écrire", "écris|écris|écrit|écrivons|écrivez|écrivent", "écrit", "écrir", "communication");
  irregular("vivre", "vis|vis|vit|vivons|vivez|vivent", "vécu", "vivr", "daily");
  irregular("suivre", "suis|suis|suit|suivons|suivez|suivent", "suivi", "suivr", "travel");
  irregular("connaître", "connais|connais|connaît|connaissons|connaissez|connaissent", "connu", "connaîtr", "work");
  irregular("paraître", "parais|parais|paraît|paraissons|paraissez|paraissent", "paru", "paraîtr", "feelings");
  irregular("naître", "nais|nais|naît|naissons|naissez|naissent", "né", "naîtr", "daily", { aux: "être" });
  irregular("mourir", "meurs|meurs|meurt|mourons|mourez|meurent", "mort", "mourr", "daily", { aux: "être" });
  irregular("courir", "cours|cours|court|courons|courez|courent", "couru", "courr", "travel");
  irregular("ouvrir", "ouvre|ouvres|ouvre|ouvrons|ouvrez|ouvrent", "ouvert", "ouvrir", "daily");
  irregular("offrir", "offre|offres|offre|offrons|offrez|offrent", "offert", "offrir", "daily");
  irregular("souffrir", "souffre|souffres|souffre|souffrons|souffrez|souffrent", "souffert", "souffrir", "feelings");
  irregular("dormir", "dors|dors|dort|dormons|dormez|dorment", "dormi", "dormir", "daily");
  irregular("partir", "pars|pars|part|partons|partez|partent", "parti", "partir", "travel", { aux: "être" });
  irregular("sortir", "sors|sors|sort|sortons|sortez|sortent", "sorti", "sortir", "travel", { aux: "être", note: "Movement sense: go out, without a direct object." });
  irregular("servir", "sers|sers|sert|servons|servez|servent", "servi", "servir", "work");
  irregular("sentir", "sens|sens|sent|sentons|sentez|sentent", "senti", "sentir", "feelings");
  irregular("recevoir", "reçois|reçois|reçoit|recevons|recevez|reçoivent", "reçu", "recevr", "communication");
  irregular("conduire", "conduis|conduis|conduit|conduisons|conduisez|conduisent", "conduit", "conduir", "travel");
  irregular("construire", "construis|construis|construit|construisons|construisez|construisent", "construit", "construir", "work");
  irregular("résoudre", "résous|résous|résout|résolvons|résolvez|résolvent", "résolu", "résoudr", "work");
  irregular("craindre", "crains|crains|craint|craignons|craignez|craignent", "craint", "craindr", "feelings");
  irregular("peindre", "peins|peins|peint|peignons|peignez|peignent", "peint", "peindr", "work");
  irregular("rejoindre", "rejoins|rejoins|rejoint|rejoignons|rejoignez|rejoignent", "rejoint", "rejoindr", "travel");
  irregular("rire", "ris|ris|rit|rions|riez|rient", "ri", "rir", "feelings");
  irregular("plaire", "plais|plais|plaît|plaisons|plaisez|plaisent", "plu", "plair", "feelings");
  irregular("valoir", "vaux|vaux|vaut|valons|valez|valent", "valu", "vaudr", "daily", { subj: split("vaille|vailles|vaille|valions|valiez|vaillent") });

  function derived(name, base, prefix, topic) {
    const parent = find(base);
    seeds.push({ ...parent, infinitive: name, topics: [topic], present: parent.present.map((form) => prefix + form), pp: prefix + parent.pp, future: prefix + parent.future });
  }
  derived("apprendre", "prendre", "ap", "work"); derived("comprendre", "prendre", "com", "work");
  derived("surprendre", "prendre", "sur", "feelings"); derived("revenir", "venir", "re", "travel");
  derived("devenir", "venir", "de", "daily"); derived("obtenir", "tenir", "ob", "work");
  derived("retenir", "tenir", "re", "work"); derived("permettre", "mettre", "per", "communication");
  derived("promettre", "mettre", "pro", "communication"); derived("remettre", "mettre", "re", "daily");
  derived("décrire", "écrire", "d", "communication");
  irregular("inscrire", "inscris|inscris|inscrit|inscrivons|inscrivez|inscrivent", "inscrit", "inscrir", "work");
  derived("découvrir", "ouvrir", "déc", "travel"); derived("reconnaître", "connaître", "re", "communication");
  for (const name of ["rester", "arriver", "tomber", "entrer", "rentrer", "retourner", "passer", "monter", "descendre"]) {
    patch(name, { aux: "être", topics: ["travel"], note: "Intransitive movement/state sense, without a direct object; use être in compound tenses." });
  }

  function simple(seed) {
    const nousStem = seed.present[3].slice(0, -3), ilsStem = seed.present[5].slice(0, -3);
    const forms = {
      present: [...seed.present], imparfait: seed.imperfect || endings(nousStem, imperfectEndings),
      futurSimple: endings(seed.future, futureEndings), conditionnelPresent: endings(seed.future, imperfectEndings),
      subjonctifPresent: seed.subj || subjEndings.map((end, i) => (i === 3 || i === 4 ? nousStem : ilsStem) + end),
    };
    if (seed.imperative !== null) forms.imperatif = seed.imperative || [seed.present[1].replace(/es$/, "e"), seed.present[3], seed.present[4]];
    return forms;
  }
  const auxiliaries = { avoir: simple(find("avoir")), être: simple(find("être")) };
  const compounds = { passeCompose: "present", plusQueParfait: "imparfait", futurAnterieur: "futurSimple", conditionnelPasse: "conditionnelPresent", subjonctifPasse: "subjonctifPresent" };
  function participles(pp, index) {
    const plural = pp.endsWith("s") ? pp : pp + "s";
    if (index === 3 || index === 5) return [plural, pp + "es"];
    if (index === 4) return [pp, pp + "e", plural, pp + "es"];
    return [pp, pp + "e"];
  }
  function reflexivePrefix(form, index) {
    const pronoun = ["me", "te", "se", "nous", "vous", "se"][index];
    // The only h-initial reflexive in this collection is habiller (mute h).
    return (/^[aeiouyhàâéèêëîïôûùœ]/i.test(form) && index !== 3 && index !== 4 ? pronoun[0] + "'" : pronoun + " ") + form;
  }
  function build(seed) {
    const forms = simple(seed), aux = auxiliaries[seed.reflexive ? "être" : seed.aux || "avoir"];
    for (const [tense, base] of Object.entries(compounds)) {
      forms[tense] = aux[base].map((form, i) => {
        const variants = (seed.aux === "être" || seed.reflexive) && !seed.invariable ? participles(seed.pp, i) : [seed.pp];
        return [...new Set(variants.map((pp) => form + " " + pp))];
      });
    }
    if (seed.futureAlternative) {
      for (const [tense, tails] of [["futurSimple", futureEndings], ["conditionnelPresent", imperfectEndings]]) forms[tense] = forms[tense].map((form, i) => [form, seed.futureAlternative + tails[i]]);
    }
    if (["payer", "essayer"].includes(seed.infinitive)) {
      for (const tense of ["present", "subjonctifPresent", "futurSimple", "conditionnelPresent", "imperatif"]) forms[tense] = forms[tense].map((form) => form.includes("ai") ? [form, form.replace("ai", "ay")] : form);
    }
    for (const tense of Object.keys(forms)) forms[tense] = forms[tense].map((value) => {
      const variants = Array.isArray(value) ? value : [value];
      return [...new Set(variants.flatMap((form) => form.includes("î") ? [form, form.replaceAll("î", "i")] : [form]))];
    });
    if (seed.infinitive === "pouvoir") forms.present[0].push("puis");
    if (seed.infinitive === "vouloir") {
      ["veux", "voulons", "voulez"].forEach((form, i) => forms.imperatif[i].push(form));
    }
    if (seed.reflexive) {
      for (const tense of Object.keys(forms)) forms[tense] = forms[tense].map((variants, i) => variants.map((form) => tense === "imperatif" ? form + ["-toi", "-nous", "-vous"][i] : reflexivePrefix(form, i)));
    }
    return { infinitive: seed.infinitive, category: seed.category, topics: seed.topics, note: seed.note || "", conjugations: forms };
  }

  for (const [name, base, topic, invariable] of [
    ["se lever", "lever", "daily"], ["se laver", "laver", "daily"], ["s'habiller", "habiller", "daily"],
    ["se coucher", "coucher", "daily"], ["se réveiller", "réveiller", "daily"], ["se reposer", "reposer", "daily"],
    ["se préparer", "préparer", "daily"], ["se promener", "promener", "travel"], ["s'appeler", "appeler", "communication"],
    ["se rappeler", "rappeler", "work", true], ["se souvenir", "venir", "work"], ["se sentir", "sentir", "feelings"],
    ["s'intéresser", "intéresser", "feelings"], ["s'occuper", "occuper", "daily"], ["se demander", "demander", "feelings", true],
    ["se parler", "parler", "communication", true], ["se rencontrer", "rencontrer", "communication"],
    ["se dépêcher", "dépêcher", "travel"], ["s'amuser", "amuser", "feelings"], ["se tromper", "tromper", "work"],
  ]) {
    let baseSeed = find(base);
    if (!baseSeed) {
      baseSeed = regular(base, "er", topic);
      if (base === "promener") changing(base, "promèn", "promèner");
    }
    const seed = { ...baseSeed, infinitive: name, category: "pronominal", topics: [topic], reflexive: true, invariable,
      note: invariable ? "The reflexive pronoun is indirect here: the past participle does not agree." : "Reflexive use without a following direct object. Include the reflexive pronoun." };
    if (name === "se souvenir") {
      seed.present = baseSeed.present.map((form) => "sou" + form);
      seed.pp = "souvenu"; seed.future = "souviendr";
    }
    seeds.push(seed);
  }
  const verbs = seeds.map(build);
  for (const [infinitive, present, imperfect, future, conditional, subj, pp, topic] of [
    ["falloir", "faut", "fallait", "faudra", "faudrait", "faille", "fallu", "daily"],
    ["pleuvoir", "pleut", "pleuvait", "pleuvra", "pleuvrait", "pleuve", "plu", "travel"],
  ]) {
    const forms = { present: [[present]], imparfait: [[imperfect]], futurSimple: [[future]], conditionnelPresent: [[conditional]], subjonctifPresent: [[subj]] };
    for (const [tense, base] of Object.entries(compounds)) forms[tense] = [[auxiliaries.avoir[base][2] + " " + pp]];
    verbs.push({ infinitive, category: "irregular", topics: [topic], impersonal: true, note: "Impersonal use: only il. No imperative.", conjugations: forms });
  }
  verbs.sort((a, b) => a.infinitive.localeCompare(b.infinitive, "fr"));
  return { subjects, imperativeSubjects: ["Tu", "Nous", "Vous"], tenses, categories, topics, verbs };
})();
