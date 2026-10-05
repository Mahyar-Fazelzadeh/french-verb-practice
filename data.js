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
  // A hand-curated practice progression, not CEFR grades. Essential irregulars
  // appear early; later levels broaden patterns, reflexives, and abstract usage.
  // Explicit membership keeps levels stable when the list is sorted or edited.
  const levels = [
    ["Essentials", "être|avoir|aller|faire|parler|aimer|habiter|travailler|étudier|jouer|regarder|écouter|donner|demander|trouver|chercher|manger|boire|prendre|venir|vouloir|pouvoir|savoir|dire"],
    ["Everyday actions", "préparer|cuisiner|laver|porter|fermer|laisser|aider|garder|dépêcher|allumer|couper|marcher|montrer|poser|voler|quitter|inviter|visiter|téléphoner|louer|tourner|traverser|rouler|rester"],
    ["Regular -ir and -re", "finir|choisir|réussir|remplir|grandir|grossir|maigrir|vieillir|nourrir|punir|ralentir|rougir|obéir|guérir|réunir|vendre|attendre|entendre|répondre|perdre|rendre|défendre|dépendre|descendre"],
    ["Communication and plans", "expliquer|présenter|organiser|participer|proposer|accepter|refuser|décider|discuter|contacter|remercier|confirmer|communiquer|tromper|prêter|noter|informer|apporter|réparer|réserver|souhaiter|terminer|utiliser|éviter"],
    ["Spelling and stem changes", "acheter|appeler|rappeler|jeter|lever|nettoyer|payer|essayer|employer|envoyer|commencer|annoncer|partager|voyager|répéter|préférer|espérer|intéresser|créer|apprécier|penser|rêver|adorer|détester"],
    ["Core irregular families", "voir|lire|écrire|mettre|dormir|partir|sortir|ouvrir|offrir|courir|vivre|suivre|connaître|comprendre|apprendre|tenir|recevoir|revenir|devenir|entrer|rentrer|retourner|passer"],
    ["Reflexive routines", "se lever|se laver|s'habiller|se coucher|se réveiller|se reposer|se préparer|se promener|s'appeler|s'intéresser|s'occuper|s'amuser|se dépêcher|se rencontrer|se tromper|se sentir|habiller|coucher|réveiller|reposer|promener|amuser|rencontrer"],
    ["More irregular families", "devoir|croire|falloir|pleuvoir|sentir|servir|découvrir|obtenir|retenir|permettre|promettre|remettre|décrire|inscrire|reconnaître|conduire|construire|mourir|naître|monter|tomber|arriver|souffrir"],
    ["Abstract and professional verbs", "développer|améliorer|analyser|comparer|effectuer|imaginer|publier|réaliser|respecter|agir|réagir|considérer|déclarer|observer|fournir|exprimer|établir|réfléchir|préciser|fonctionner|coûter|occuper|regretter"],
    ["Advanced patterns and nuance", "confondre|craindre|étendre|fondre|hésiter|paraître|peindre|plaire|prétendre|rejoindre|résoudre|rire|se demander|se parler|se rappeler|se souvenir|supporter|surprendre|valoir|investir|accomplir|garantir|définir"],
  ].map(([title, names], index) => ({ id: index + 1, title, verbs: split(names) }));
  // Short English glosses; movement verbs match their intransitive exercise sense.
  const englishMeanings = {
    "accepter": "to accept",
    "accomplir": "to accomplish",
    "acheter": "to buy",
    "adorer": "to adore / love",
    "agir": "to act",
    "aider": "to help",
    "aimer": "to like / love",
    "aller": "to go",
    "allumer": "to turn on / light",
    "améliorer": "to improve",
    "amuser": "to amuse",
    "analyser": "to analyze",
    "annoncer": "to announce",
    "appeler": "to call",
    "apporter": "to bring",
    "apprécier": "to appreciate / enjoy",
    "apprendre": "to learn",
    "arriver": "to arrive",
    "attendre": "to wait for",
    "avoir": "to have",
    "boire": "to drink",
    "chercher": "to look for",
    "choisir": "to choose",
    "commencer": "to begin",
    "communiquer": "to communicate",
    "comparer": "to compare",
    "comprendre": "to understand",
    "conduire": "to drive / lead",
    "confirmer": "to confirm",
    "confondre": "to confuse / mix up",
    "connaître": "to know / be familiar with",
    "considérer": "to consider",
    "construire": "to build",
    "contacter": "to contact",
    "coucher": "to lay down / put to bed",
    "couper": "to cut",
    "courir": "to run",
    "coûter": "to cost",
    "craindre": "to fear",
    "créer": "to create",
    "croire": "to believe",
    "cuisiner": "to cook",
    "décider": "to decide",
    "déclarer": "to declare",
    "découvrir": "to discover",
    "décrire": "to describe",
    "défendre": "to defend / forbid",
    "définir": "to define",
    "demander": "to ask",
    "dépêcher": "to dispatch / send off",
    "dépendre": "to depend on",
    "descendre": "to go down",
    "détester": "to hate",
    "développer": "to develop",
    "devenir": "to become",
    "devoir": "to have to / owe",
    "dire": "to say / tell",
    "discuter": "to discuss",
    "donner": "to give",
    "dormir": "to sleep",
    "écouter": "to listen to",
    "écrire": "to write",
    "effectuer": "to carry out",
    "employer": "to employ / use",
    "entendre": "to hear",
    "entrer": "to go in",
    "envoyer": "to send",
    "espérer": "to hope",
    "essayer": "to try",
    "établir": "to establish",
    "étendre": "to spread / extend",
    "être": "to be",
    "étudier": "to study",
    "éviter": "to avoid",
    "expliquer": "to explain",
    "exprimer": "to express",
    "faire": "to do / make",
    "falloir": "to be necessary",
    "fermer": "to close",
    "finir": "to finish",
    "fonctionner": "to work / function",
    "fondre": "to melt",
    "fournir": "to supply",
    "garantir": "to guarantee",
    "garder": "to keep / look after",
    "grandir": "to grow",
    "grossir": "to gain weight",
    "guérir": "to heal / recover",
    "habiller": "to dress someone",
    "habiter": "to live / reside",
    "hésiter": "to hesitate",
    "imaginer": "to imagine",
    "informer": "to inform",
    "inscrire": "to register / write down",
    "intéresser": "to interest",
    "investir": "to invest",
    "inviter": "to invite",
    "jeter": "to throw",
    "jouer": "to play",
    "laisser": "to leave / let",
    "laver": "to wash",
    "lever": "to raise / lift",
    "lire": "to read",
    "louer": "to rent",
    "maigrir": "to lose weight",
    "manger": "to eat",
    "marcher": "to walk",
    "mettre": "to put",
    "monter": "to go up",
    "montrer": "to show",
    "mourir": "to die",
    "naître": "to be born",
    "nettoyer": "to clean",
    "noter": "to note down",
    "nourrir": "to feed",
    "obéir": "to obey",
    "observer": "to observe",
    "obtenir": "to obtain / get",
    "occuper": "to occupy",
    "offrir": "to offer / give",
    "organiser": "to organize",
    "ouvrir": "to open",
    "paraître": "to seem / appear",
    "parler": "to speak",
    "partager": "to share",
    "participer": "to participate",
    "partir": "to leave / depart",
    "passer": "to pass / go by",
    "payer": "to pay",
    "peindre": "to paint",
    "penser": "to think",
    "perdre": "to lose",
    "permettre": "to allow",
    "plaire": "to please / appeal to",
    "pleuvoir": "to rain",
    "porter": "to carry / wear",
    "poser": "to put down / ask a question",
    "pouvoir": "to be able to / can",
    "préciser": "to specify / clarify",
    "préférer": "to prefer",
    "prendre": "to take",
    "préparer": "to prepare",
    "présenter": "to present / introduce",
    "prétendre": "to claim",
    "prêter": "to lend",
    "promener": "to take for a walk",
    "promettre": "to promise",
    "proposer": "to suggest / offer",
    "publier": "to publish",
    "punir": "to punish",
    "quitter": "to leave",
    "ralentir": "to slow down",
    "rappeler": "to remind / call back",
    "réagir": "to react",
    "réaliser": "to achieve / realize",
    "recevoir": "to receive",
    "reconnaître": "to recognize",
    "réfléchir": "to think / reflect",
    "refuser": "to refuse",
    "regarder": "to watch / look at",
    "regretter": "to regret",
    "rejoindre": "to join / meet up with",
    "remercier": "to thank",
    "remettre": "to put back / hand over",
    "remplir": "to fill",
    "rencontrer": "to meet",
    "rendre": "to give back / return",
    "rentrer": "to go home / come back in",
    "réparer": "to repair",
    "répéter": "to repeat",
    "répondre": "to answer",
    "reposer": "to put down / rest something",
    "réserver": "to reserve / book",
    "résoudre": "to solve",
    "respecter": "to respect",
    "rester": "to stay",
    "retenir": "to retain / hold back",
    "retourner": "to go back",
    "réunir": "to bring together",
    "réussir": "to succeed",
    "réveiller": "to wake someone up",
    "revenir": "to come back",
    "rêver": "to dream",
    "rire": "to laugh",
    "rougir": "to blush",
    "rouler": "to drive / roll",
    "s'amuser": "to have fun",
    "s'appeler": "to be called",
    "s'habiller": "to get dressed",
    "s'intéresser": "to be interested in",
    "s'occuper": "to take care of",
    "savoir": "to know how / know a fact",
    "se coucher": "to go to bed",
    "se demander": "to wonder",
    "se dépêcher": "to hurry",
    "se laver": "to wash oneself",
    "se lever": "to get up",
    "se parler": "to talk to each other",
    "se préparer": "to get ready",
    "se promener": "to go for a walk",
    "se rappeler": "to remember",
    "se rencontrer": "to meet each other",
    "se reposer": "to rest",
    "se réveiller": "to wake up",
    "se sentir": "to feel",
    "se souvenir": "to remember",
    "se tromper": "to be mistaken",
    "sentir": "to feel / smell",
    "servir": "to serve",
    "sortir": "to go out",
    "souffrir": "to suffer",
    "souhaiter": "to wish",
    "suivre": "to follow",
    "supporter": "to tolerate / put up with",
    "surprendre": "to surprise",
    "téléphoner": "to phone",
    "tenir": "to hold",
    "terminer": "to finish / end",
    "tomber": "to fall",
    "tourner": "to turn",
    "travailler": "to work",
    "traverser": "to cross",
    "tromper": "to deceive",
    "trouver": "to find",
    "utiliser": "to use",
    "valoir": "to be worth",
    "vendre": "to sell",
    "venir": "to come",
    "vieillir": "to grow old",
    "visiter": "to visit",
    "vivre": "to live",
    "voir": "to see",
    "voler": "to fly / steal",
    "vouloir": "to want",
    "voyager": "to travel"
  };
  const levelByVerb = new Map(levels.flatMap((level) => level.verbs.map((name) => [name, level.id])));
  verbs.forEach((verb) => { verb.level = levelByVerb.get(verb.infinitive); verb.english = englishMeanings[verb.infinitive]; });
  return { subjects, imperativeSubjects: ["Tu", "Nous", "Vous"], tenses, categories, topics, levels, verbs };
})();
