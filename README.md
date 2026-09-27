# French Verb Practice

Open `index.html` in a modern browser. No installation, server, or internet connection is needed. Keep the four app files in the same folder.

## How to practise

1. Select at least one tense and one verb. Five group checkboxes select or clear regular -er, regular -ir, regular -re, irregular, and pronominal verbs. Individual choices are also available. Groups are practical practice categories, not a replacement for the traditional three French verb groups.
2. Search or filter by topic to find verbs. Filters do not change selection. **Select shown** and **Clear shown** affect visible verbs; **Clear all verbs** clears everything. A group checkbox always affects its entire group, including hidden verbs. To practise only one topic, clear all, choose the topic, then select shown.
3. Click **Start Practice** for up to 10 exercises using only your selections. Verbs are shuffled with no repeats. Fewer eligible verbs give a shorter session. Only available tenses are used: pouvoir, falloir, and pleuvoir have no imperative in the dataset.
4. Enter verb forms without subject pronouns or `que/qu’`. Include auxiliaries and reflexive pronouns, such as `ai parlé`, `me suis levée`, or `lève-toi`. Ordinary exercises have six fields; imperative exercises have tu/nous/vous; impersonal verbs have only il.
5. Click **Check Answers** (or press Enter in an answer field). Accents and spelling matter. Capitalization, surrounding whitespace, equivalent Unicode accents, and straight/curly apostrophes are normalized. Explicitly stored spelling variants are accepted; accents are never removed generally. Blank answers are incorrect.
6. Review the feedback: green answer text and ✓, or red text followed by X and accepted corrections. **Try Again** clears the same exercise; **Next Question** advances. **Finish Session** shows correct/incorrect totals. Each displayed subject counts once, using the latest checked attempt. Retries replace the previous result. Totals account for mixed six-, three-, and one-field exercises.
7. **Back to settings** ends the session and keeps your selections while the page remains open. Refreshing or closing the page resets everything.

## Scope and agreement

The local collection contains 235 verbs and 11 tense/mood choices, intended for practice through B2. It is a practical selection, not an exhaustive or officially prescribed CEFR verb inventory.

- Indicatif: présent, passé composé, imparfait, plus-que-parfait, futur simple, futur antérieur.
- Conditionnel: présent, passé.
- Subjonctif: présent, passé.
- Impératif: présent (affirmative).

Literary tenses, imperative past, non-finite forms, passive voice, negative commands, and contextual preceding-object agreement are outside this collection.

Gender is unspecified, so valid masculine/feminine agreement is accepted. Nous and ils/elles require plural agreement; vous allows singular or plural. Exercises without a preceding direct object use invariable participles with avoir. Movement verbs such as sortir/passer/monter use their intransitive être sense, identified by an exercise note. Reflexive exercises use the stated sense: se parler, se demander, and se rappeler use invariable participles in this context. They do not use a blanket agreement rule for every reflexive verb.

## Files

- `index.html`: settings, exercise, and completion screens.
- `styles.css`: layout and feedback styling, including small screens.
- `data.js`: local principal parts, deterministic conjugation patterns, exceptions, agreement variants, and category/topic labels.
- `app.js`: selection, random sessions, answer checking, and navigation.
- `verify.mjs`: optional developer regression checks. With Node.js installed, run `node verify.mjs`; Node is not needed to use the app.

## Editing the data

Use a regular batch for a verb that follows an existing pattern. Irregular seeds specify six present forms, the past participle, the future stem, and any overrides for the subjunctive, imperfect, imperative, or auxiliary. `changing` handles explicitly listed stem-changing -er verbs. Add reference cases to `verify.mjs` for each new pattern.

At load time the local rules produce `conjugationData.verbs`. Each entry has an infinitive, one category, topic tags, an optional usage note, and conjugations. Each tense is an array of subject slots, and each slot is an array of accepted strings. Normal slot order is je, tu, il/elle, nous, vous, ils/elles; imperative order is tu, nous, vous; impersonal verbs have one il slot. An absent tense is unavailable and will not be generated.

Check new derivatives carefully: prefixes can change the auxiliary, participle, or imperative. New reflexives may require different agreement rules or elision. The helper currently handles mute h for habiller, not arbitrary aspirated-h verbs.

## Grammar references

- [OQLF: reflexive verbs and direct-object agreement](https://vitrinelinguistique.oqlf.gouv.qc.ca/22954/la-grammaire/le-verbe/verbes-pronominaux/verbe-pronominal-de-sens-reflechi).
- [OQLF: pronouns and hyphens in imperative forms](https://vitrinelinguistique.oqlf.gouv.qc.ca/24206/la-grammaire/les-pronoms/pronoms-personnels/pronoms-personnels-employes-avec-un-verbe-a-limperatif).
- [Académie française: se souvenir](https://www.dictionnaire-academie.fr/conjuguer/A9S2476) and [vouloir](https://www.dictionnaire-academie.fr/conjuguer/A9V1230).
- [OQLF: accepted spelling rectifications](https://vitrinelinguistique.oqlf.gouv.qc.ca/23190/lorthographe/rectifications-de-lorthographe/recommandations-generales-liees-aux-rectifications-de-lorthographe/liste-alphabetique-de-mots-touches-par-les-rectifications-de-lorthographe).

## Final manual check

- Clear all tenses or verbs: Start Practice should show a validation message.
- Select only être and Imparfait: the session should contain one exercise with that combination.
- Check `etais` versus `étais`, a blank answer, and a correct answer: feedback should distinguish them and retain what you typed.
- Try Again should keep the exercise number, verb, and tense while clearing answers and feedback.
- Check and advance through the session, verify the final correct/incorrect totals, then return and start a fresh session with no old results.
- Select more than ten verbs: the session should contain ten different verbs in shuffled order. Try Again should not add an extra exercise or double-count answers.
- Select multiple tenses and verbs: questions must stay within the selection.
- At a narrow browser width, check that inputs and feedback fit without horizontal scrolling. Use Tab and Enter to verify keyboard access.
- Try se lever in the imperative (three fields), aller in passé composé (agreement variants), and falloir in the present (one field). Check final totals for each.
- Filter/search and verify hidden selections remain selected. Try selecting only pouvoir plus imperative: the app should explain that this combination is unavailable.
