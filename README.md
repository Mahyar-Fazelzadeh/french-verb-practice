# French Verb Practice

Open `index.html` in a modern browser. No installation, server, or internet connection is needed. Keep the app files (`index.html`, `styles.css`, `data.js`, `pronouns-data.js`, `i18n.js`, `app.js`, `navigation.js`, and `pronouns.js`) in the same folder.

Use the globe **EN / FR** button at the top right to switch the interface between English and French. All instructions, settings, categories, level titles, validation, and results switch languages. Current selections, answers, and scores are preserved. Verb forms and tense names always stay in French. A refresh returns the interface to English.

The home screen offers **Conjugaison** and **Pronoms compléments**. Pronoun grammar and category practice are available in EN/FR. The initial static bank and expansion contract are documented in [PRONOUNS-DATA.md](PRONOUNS-DATA.md).

## Pronoun practice

Open **Pronoms compléments**, read the reference or choose **Go to exercises**, then select COD, COI, y, en, combinations or **Mixed practice**, a difficulty, and 3, 5 or 10 questions (default 5). All difficulties is the default. Each individual category currently contains eight questions across the difficulty bands; mixed practice draws from all eligible categories. The live count shows how many questions match and the actual session length. Sentences are shuffled without duplicates within a session; later sessions can reuse questions. Pronoun practice does not use or change conjugation verb history.

Rewrite the full sentence, replacing only the highlighted words (also listed below the sentence). Keep the subject, tense, meaning and quantities. Checking locks the answer and shows green text with ✓ or red text with X and the accepted correction, followed by an explanation. **Try Again** clears the same question; every checked attempt remains in the totals. **Next Question** advances; **Finish session** shows sentence-level correct/incorrect counts.

Case, whitespace, curly/straight apostrophes and an optional final full stop are normalized. Accents, internal punctuation and command hyphens remain significant. Blank answers are incorrect. EN/FR switching and home/module navigation preserve the current session. **Back to pronoun settings** ends it; refreshing also resets it. The grammar reference returns when you return to settings. Choose **1 · Basic replacements**, **2 · Placement and combinations**, **3 · Agreement and commands**, or **All difficulties**. Each numbered band selects exactly that difficulty, rather than including easier questions. These are adjustable practice bands, not CEFR levels, and none is locked. An empty selection (currently combinations at difficulty 1) explains how to choose another pool. Mixed mode hides the required grammatical category before checking, reveals it with feedback, and hides it again on retry. Mixed sessions are randomly sampled from the eligible pool; not every session necessarily contains every category. No mastery score or automatic level advancement is implied.

## How to practise

1. Choose a practice level (Level 1 by default) or All levels, and a session length of **3, 5, or 10 questions** (default **5**). A question means one verb with its subject fields. Select at least one tense and one verb. The regular -er, regular -ir, regular -re, irregular, and pronominal group checkboxes affect verbs within the chosen level.
2. Search or filter by topic to find verbs within the level. These display filters do not change selection. **Select shown** and **Clear shown** affect visible verbs; **Clear all verbs** clears every level. Group checkboxes include search/topic-hidden verbs within the chosen level. To practise only one topic, clear all, choose the topic, then select shown. Selections in other levels are remembered while the page remains open, but cannot appear unless that level (or All levels) is chosen.
3. Click **Start Practice** for the chosen session length using only selected verbs from the chosen level. Verbs are shuffled with no repeats. Fewer eligible verbs give a shorter session. Only available tenses are used: pouvoir, falloir, and pleuvoir have no imperative in the dataset.
4. Enter verb forms without subject pronouns or `que/qu’`. Include auxiliaries and reflexive pronouns, such as `ai parlé`, `me suis levée`, or `lève-toi`. Ordinary exercises have six fields; imperative exercises have tu/nous/vous; impersonal verbs have only il.
5. Press **Enter** in an answer field to move to the next subject without copying or checking. Enter on the last subject focuses **Check Answers**; click it or press Enter again to check. Accents and spelling matter. Capitalization, surrounding whitespace, equivalent Unicode accents, and straight/curly apostrophes are normalized. Explicitly stored spelling variants are accepted; accents are never removed generally. Blank answers are incorrect.
6. Review the feedback: green answer text and ✓, or red text followed by X and accepted corrections. **Try Again** clears the same exercise; **Next Question** advances. **Finish Session** shows completed exercises, checked attempts, and correct/incorrect answer totals. Every checked attempt counts, including retries, so earlier mistakes remain. Clicking Try Again without checking does not add an attempt. Three six-subject exercises plus one checked retry total four attempts and 24 answers. Totals account for mixed six-, three-, and one-field exercises.
7. **Back to settings** ends the session and keeps your selections while the page remains open. Refreshing or closing the page resets the session and settings, but recent verb history remains in this browser.

**One-hour verb history:** Each displayed verb is remembered locally in this browser for one hour after its latest display, including across refreshes. New sessions exclude these verbs across tenses and levels. Unseen questions are not recorded. Try Again still repeats the current exercise. If too few eligible verbs remain, the session is shorter; if none remain, choose more verbs, wait, or use **Clear recent verb history**. History contains only verb names and timestamps, with no account or server; it is not shared across devices or browser profiles. If browser storage is blocked, history lasts only while the page stays open. Expired entries are ignored when history is read.

**Copy to next** beside an answer copies exactly what you typed into the next subject's field, replacing its contents and placing the cursor at the end. Adjust the ending or pronoun yourself; the button does not conjugate for you or use the system clipboard. Empty fields cannot be copied. There is no button on the final subject; buttons disappear after checking and return on Try Again.

## Scope and agreement

The ten practice levels are a curated learning order, balancing familiarity, conjugation patterns, and vocabulary breadth. They are not CEFR classifications or a claim that every verb in a later level is harder. Essential irregulars such as être/avoir are intentionally introduced early. Tense difficulty is separate: choose Présent for an easier start. Levels are freely selectable with no automatic unlocking or progress storage.

| Level | Focus | Verbs |
| --- | --- | --- |
| 1 | Essentials | 24 |
| 2 | Everyday actions | 24 |
| 3 | Regular -ir and -re | 24 |
| 4 | Communication and plans | 24 |
| 5 | Spelling and stem changes | 24 |
| 6 | Core irregular families | 23 |
| 7 | Reflexive routines | 23 |
| 8 | More irregular families | 23 |
| 9 | Abstract and professional verbs | 23 |
| 10 | Advanced patterns and nuance | 23 |

Every verb belongs to exactly one level. The complete, editable assignments are in the `levels` list in `data.js`; the existing verb-family and topic categories remain available.

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
- `i18n.js`: English/French interface strings and usage-note translations; no translation service or network requests.
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
- Select more than ten verbs and choose 10 questions: the session should contain ten different verbs in shuffled order. Try Again keeps the same exercise; each checked retry adds one attempt and its answers to the totals.
- Select multiple tenses and verbs: questions must stay within the selection.
- At a narrow browser width, check that inputs and feedback fit without horizontal scrolling. Use Tab and Enter to verify keyboard access.
- Try se lever in the imperative (three fields), aller in passé composé (agreement variants), and falloir in the present (one field). Check final totals for each.
- Filter/search and verify hidden selections remain selected. Try selecting only pouvoir plus imperative: the app should explain that this combination is unavailable.
- Check the default Level 1 and 5-question session. Try 3 and 10 questions and another level: every generated verb must belong to that level. Choose All levels to practise the full collection. Deselect all verbs within the current level: selections in other levels must not bypass validation.
- Enter parle for Je and click Copy to next: Tu receives parle and is focused for editing. Change it to parles and copy onward. Check that copying does not submit, buttons disappear after checking, and Try Again restores them. Imperative exercises have two copy buttons; impersonal exercises have none.
- Switch EN/FR in settings, while typing, after checking, and on the completion screen. All interface text should translate without clearing answers, changing selections, or resetting results. Check the translated layout at a narrow width.
