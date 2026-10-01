"use strict";

// Interface translations only. Verb forms and tense names remain in French.
let language = "en";
const messages = {
  title: ["French Verb Practice", "Pratique de la conjugaison française"],
  intro: ["Practise French conjugations, one verb at a time.", "Entraînez-vous à conjuguer en français, un verbe à la fois."],
  settings: ["Practice settings", "Paramètres de l’entraînement"],
  choose: ["Choose a practice level, session length, and at least one tense and verb.", "Choisissez un niveau, la durée de la séance, au moins un temps et un verbe."],
  randomHint: ["Verbs are shuffled with no repeats. Each exercise uses one of your selected tenses: six subjects, three for the imperative, or just il for impersonal verbs. Unavailable verb/tense combinations are skipped.", "Les verbes sont tirés au hasard, sans répétition, dans les temps sélectionnés : six sujets, trois à l’impératif ou seulement il pour les verbes impersonnels. Les combinaisons indisponibles sont exclues."],
  session: ["Session", "Séance"], level: ["Practice level", "Niveau"], allLevels: ["All levels", "Tous les niveaux"],
  length: ["Questions per session", "Questions par séance"],
  recentHint: ["Verbs shown in this browser are skipped for one hour, across levels and tenses. Try Again still repeats the current exercise.", "Les verbes affichés dans ce navigateur sont exclus des nouvelles séances pendant une heure, quels que soient le niveau et le temps. Réessayer reprend toujours l’exercice en cours."],
  recentStatus: ["{count} recently shown verb(s) remembered in this browser, including after a refresh.", "{count} verbe(s) récent(s) mémorisé(s) dans ce navigateur, même après actualisation."],
  recentFallback: ["{count} recently shown verb(s) remembered for this page only. Browser storage is unavailable; refreshing clears this history.", "{count} verbe(s) récent(s) mémorisé(s) uniquement sur cette page. Le stockage du navigateur est indisponible ; une actualisation efface cet historique."],
  clearRecent: ["Clear recent verb history", "Effacer l’historique récent des verbes"],
  recentExhausted: ["All eligible selected verbs were shown in the past hour. Choose more verbs or another level, wait for them to expire, or clear recent verb history.", "Tous les verbes sélectionnés disponibles ont été affichés au cours de la dernière heure. Choisissez d’autres verbes ou un autre niveau, attendez leur expiration ou effacez l’historique récent."],
  sessionHint: ["A question is one verb with its subject fields. Only verbs from the chosen level can appear. Fewer eligible verbs means a shorter session without repeats.", "Une question correspond à un verbe et à ses sujets. Seuls les verbes du niveau choisi peuvent apparaître. Si le nombre de verbes disponibles est insuffisant, la séance sera plus courte, sans répétition."],
  levelHint: ["These are practice levels, not CEFR grades. Start with Level 1 and move on when ready. Tenses are chosen separately; no levels are locked.", "Ces niveaux d’entraînement ne correspondent pas aux niveaux du CECR. Commencez au niveau 1 et avancez à votre rythme. Les temps se choisissent séparément et tous les niveaux sont accessibles."],
  tenses: ["Tenses", "Temps"], verbs: ["Verbs", "Verbes"],
  groupHint: ["Group checkboxes affect verbs in the chosen level, including those hidden by search or topic. Search and topic filters only change what you see; hidden selections within the level can still appear in practice.", "Les cases de groupe sélectionnent les verbes du niveau choisi, même ceux masqués par la recherche ou le thème. Ces filtres changent seulement l’affichage : les verbes sélectionnés mais masqués peuvent apparaître dans la séance."],
  search: ["Search verbs", "Rechercher un verbe"], searchPlaceholder: ["e.g. être, prendre, se…", "ex. : être, prendre, se…"],
  topic: ["Topic", "Thème"], allTopics: ["All topics", "Tous les thèmes"],
  selectShown: ["Select shown", "Sélectionner les verbes affichés"], clearShown: ["Clear shown", "Désélectionner les verbes affichés"], clearAll: ["Clear all verbs", "Désélectionner tous les verbes"],
  start: ["Start Practice", "Commencer"],
  accents: ["Accents and spelling matter. Capitalization and spaces at the beginning or end are ignored.", "Les accents et l’orthographe comptent. Les majuscules et les espaces au début ou à la fin sont ignorés."],
  copyHint: ["Copy to next replaces the next subject’s answer with your text. Edit it as needed for that subject.", "Copier à la ligne suivante remplace la réponse du sujet suivant par votre texte. Adaptez ensuite la conjugaison à ce sujet."],
  check: ["Check Answers", "Vérifier les réponses"], retry: ["Try Again", "Réessayer"], next: ["Next Question", "Question suivante"], finish: ["Finish Session", "Terminer la séance"], back: ["Back to settings", "Retour aux paramètres"],
  complete: ["Session complete", "Séance terminée"], correct: ["✓ Correct answers: ", "✓ Réponses correctes : "], incorrect: ["✗ Incorrect answers: ", "✗ Réponses incorrectes : "],
  scoreHint: ["Every checked attempt counts, including retries. Each subject counts as one answer; blank answers count as incorrect. Earlier mistakes remain in your results.", "Toutes les tentatives vérifiées comptent, y compris les nouvelles tentatives. Chaque sujet compte pour une réponse ; les réponses vides sont incorrectes. Les erreurs précédentes restent dans le bilan."],
  footer: ["Works offline. Session progress is not saved when you close or refresh the page.", "Fonctionne hors ligne. La progression de la séance n’est pas enregistrée si vous fermez ou actualisez la page."],
  noForms: ["These verbs do not have forms in the selected tense(s). Choose another verb or tense. For example, pouvoir and falloir have no imperative.", "Ces verbes ne se conjuguent pas aux temps sélectionnés. Choisissez un autre verbe ou temps. Par exemple, pouvoir et falloir n’ont pas d’impératif."],
  chooseRequired: ["Select at least one tense and one verb in the chosen level before starting.", "Sélectionnez au moins un temps et un verbe du niveau choisi avant de commencer."],
  chooseLength: ["Choose 3, 5, or 10 questions per session.", "Choisissez 3, 5 ou 10 questions par séance."],
  progress: ["Exercise {current} of {total}", "Exercice {current} sur {total}"], levelSuffix: [" · Level {level}", " · Niveau {level}"],
  imperativeHelp: ["Write the affirmative command without the subject. Include attached reflexive pronouns, for example lève-toi.", "Écrivez l’ordre affirmatif sans le sujet. Ajoutez les pronoms réfléchis avec un trait d’union, par exemple lève-toi."],
  answerHelp: ["Write the verb form without the subject or que/qu’. Include auxiliaries and reflexive pronouns, for example ai parlé or me suis levée. Where the subject allows it, masculine/feminine forms are accepted; vous may be singular or plural.", "Écrivez la forme verbale sans le sujet ni que/qu’. Incluez les auxiliaires et les pronoms réfléchis, par exemple ai parlé ou me suis levée. Les formes masculines et féminines sont acceptées selon le sujet ; vous peut être singulier ou pluriel."],
  copy: ["Copy to next", "Copier ↓"], copyLabel: ["Copy {from} answer to {to}", "Copier la réponse de {from} vers {to}"],
  checked: ["{correct} of {total} correct. Try again or {action}.", "{correct} réponse(s) correcte(s) sur {total}. Réessayez ou {action}."],
  finishAction: ["finish the session", "terminez la séance"], nextAction: ["move to the next exercise", "passez à l’exercice suivant"],
  results: ["Exercises completed: {count}. Checked attempts: {attempts}. Answers checked: {total}.", "Exercices terminés : {count}. Tentatives vérifiées : {attempts}. Réponses vérifiées : {total}."],
  selection: ["{selected} of {total} verbs selected{scope} · {shown} shown{empty}.", "{selected} verbes sélectionnés sur {total}{scope} · {shown} affichés{empty}."],
  levelScope: [" in Level {level}", " au niveau {level}"], allScope: [" across all levels", " tous niveaux confondus"], noMatches: [" — no matches", " — aucun résultat"],
  levelOption: ["Level {level} — {title} ({count} verbs)", "Niveau {level} — {title} ({count} verbes)"],
  er: ["Regular -er", "Verbes réguliers en -er"], ir: ["Regular -ir (finir)", "Verbes réguliers en -ir (finir)"], re: ["Regular -re (vendre)", "Verbes réguliers en -re (vendre)"], irregular: ["Irregular verbs", "Verbes irréguliers"], pronominal: ["Pronominal verbs", "Verbes pronominaux"],
  daily: ["Daily life", "Vie quotidienne"], work: ["Work & studies", "Travail et études"], travel: ["Travel & movement", "Voyages et déplacements"], feelings: ["Feelings & opinions", "Sentiments et opinions"], communication: ["Communication", "Communication"],
  level1: ["Essentials", "Les essentiels"], level2: ["Everyday actions", "Actions du quotidien"], level3: ["Regular -ir and -re", "Verbes réguliers en -ir et -re"], level4: ["Communication and plans", "Communication et projets"], level5: ["Spelling and stem changes", "Orthographe et changements de radical"], level6: ["Core irregular families", "Principales familles irrégulières"], level7: ["Reflexive routines", "Habitudes et verbes pronominaux"], level8: ["More irregular families", "Autres familles irrégulières"], level9: ["Abstract and professional verbs", "Verbes abstraits et professionnels"], level10: ["Advanced patterns and nuance", "Formes avancées et nuances"],
};
const frenchNotes = {
  "Movement sense: go out, without a direct object.": "Sens de déplacement : sortir, sans complément d’objet direct.",
  "Intransitive movement/state sense, without a direct object; use être in compound tenses.": "Sens intransitif de déplacement ou d’état, sans complément d’objet direct : utilisez être aux temps composés.",
  "The reflexive pronoun is indirect here: the past participle does not agree.": "Le pronom réfléchi est indirect ici : le participe passé ne s’accorde pas.",
  "Reflexive use without a following direct object. Include the reflexive pronoun.": "Emploi pronominal sans complément d’objet direct après le verbe. Incluez le pronom réfléchi.",
  "Impersonal use: only il. No imperative.": "Emploi impersonnel : seulement il. Pas d’impératif.",
};
function t(key, values = {}) {
  return messages[key][language === "fr" ? 1 : 0].replace(/\{(\w+)\}/g, (_, name) => String(values[name]));
}
