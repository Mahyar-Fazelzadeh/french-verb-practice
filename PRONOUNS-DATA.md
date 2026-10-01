# Pronoun exercise bank — Stage 4 review

The initial bank has 40 curated sentence-rewriting exercises: eight each for COD, COI, y, en and combinations. The engine uses this bank for category practice, mixed practice and adjustable difficulty selection. Mixed sessions conceal grammatical category until checking. Each difficulty band selects exactly that metadata value; All difficulties includes all bands.

## Learner task

Rewrite the whole sentence, replacing only the marked words with pronouns. Keep the subject, tense, meaning and quantities; adjust agreement when required. The engine should highlight the exact target text. Explanations and accepted answers appear after checking, not as question hints.

## Data contract

The browser loads `pronouns-data.js`, which defines `pronounsData`. It runs without the conjugation dataset, application state, DOM, storage or network. All values are JSON-compatible; a later move to JSON does not require redesigning the records.

- `schemaVersion`: format version, currently 1.
- `instructions`: shared EN/FR instructions.
- `categories`: the five grammatical classifications.
- `exercises`: stable ID, type, category, provisional difficulty, tags, mixed eligibility, original sentence, exact target substrings, accepted full answers, and an EN/FR explanation.
- `difficulty`: provisional 1 = simple single replacement; 2 = added placement/construction or simple combination; 3 = agreement/commands or more demanding combinations. These are authoring tags, not finalized learner levels or CEFR grades.
- `mixedEligible`: permits use in mixed sessions. Mixed is a practice mode drawing from the same bank, not a duplicate category. In that mode, do not show category, tags, explanations or answer information before checking.

The first format is `rewrite`. Other exercise types can be added when their answer handling is designed. This representative set is not a complete curriculum: personal-perspective me/te/nous/vous tasks and more construction exceptions can be added with explicit context.

## Accepted answers

Store genuine grammatical alternatives in `acceptedAnswers`; do not enumerate typography variants. The Stage 5 engine normalizes case, straight/curly apostrophes, whitespace and optional final full stops, while retaining accents, internal punctuation and command hyphens. Keep all supplied subject/tense/meaning constraints. Checking is implemented separately in `pronouns.js`; the data file contains no application logic.

## Expanding safely

Copy a record, give it a new permanent ID, and review the French sentence, targets, all valid answers, explanations and tags. Target text must occur exactly once in the sentence and targets must not overlap. Add separate records for genuinely different contexts rather than mechanical noun substitutions. Run `node verify.mjs` after editing.

No conjugation data is copied or modified. It provides verb forms but not enough information about object constructions or sentence meaning to generate safe pronoun tasks automatically. Explicit reviewed answers keep the modules independent. Forty text records occupy only a few tens of kilobytes; thousands are feasible without a backend. There is no runtime AI generation.

## Review all questions

Bracketed text marks what the learner must replace. Difficulty is provisional. Each row currently has one accepted answer; the format supports more.

| ID | Difficulty | Sentence (targets in brackets) | Expected full answer |
| --- | --- | --- | --- |
| cod-001 | 1 | Je ferme [la fenêtre]. | Je la ferme. |
| cod-002 | 1 | Nous cherchons [les clés]. | Nous les cherchons. |
| cod-003 | 1 | Tu regardes [le tableau]. | Tu le regardes. |
| cod-004 | 2 | Elle invite [Alice]. | Elle l’invite. |
| cod-005 | 2 | Je ne connais pas [ces voisins]. | Je ne les connais pas. |
| cod-006 | 2 | Vous voulez lire [ce roman]. | Vous voulez le lire. |
| cod-007 | 3 | Paul a écrit [les lettres]. | Paul les a écrites. |
| cod-008 | 3 | Ferme [la porte]. | Ferme-la. |
| coi-001 | 1 | Je téléphone [à ma sœur]. | Je lui téléphone. |
| coi-002 | 1 | Nous répondons [aux clients]. | Nous leur répondons. |
| coi-003 | 1 | Tu parles [à ton frère]. | Tu lui parles. |
| coi-004 | 2 | Elle ne répond pas [à ses collègues]. | Elle ne leur répond pas. |
| coi-005 | 2 | Je vais écrire [à mes parents]. | Je vais leur écrire. |
| coi-006 | 2 | Nous avons parlé [à la directrice]. | Nous lui avons parlé. |
| coi-007 | 3 | Répondez [aux visiteurs]. | Répondez-leur. |
| coi-008 | 3 | Ne téléphone pas [à Paul]. | Ne lui téléphone pas. |
| y-001 | 1 | Nous allons [au musée]. | Nous y allons. |
| y-002 | 1 | Les enfants jouent [dans le jardin]. | Les enfants y jouent. |
| y-003 | 2 | Tu réfléchis [à cette solution]. | Tu y réfléchis. |
| y-004 | 2 | Je ne pense pas [à ce problème]. | Je n’y pense pas. |
| y-005 | 2 | Elle veut rester [à Lyon]. | Elle veut y rester. |
| y-006 | 2 | Nous avons travaillé [dans cette salle]. | Nous y avons travaillé. |
| y-007 | 3 | Va [à la bibliothèque]. | Vas-y. |
| y-008 | 3 | Ne va pas [dans cette pièce]. | N’y va pas. |
| en-001 | 1 | Elle boit [du thé]. | Elle en boit. |
| en-002 | 1 | Tu achètes [trois billets]. | Tu en achètes trois. |
| en-003 | 2 | Nous achetons [beaucoup de légumes]. | Nous en achetons beaucoup. |
| en-004 | 2 | Je parle [de ce projet]. | J’en parle. |
| en-005 | 2 | Vous revenez [du marché]. | Vous en revenez. |
| en-006 | 2 | Je ne veux pas [de sucre]. | Je n’en veux pas. |
| en-007 | 3 | Elle a acheté [des pommes]. | Elle en a acheté. |
| en-008 | 3 | Prends [deux biscuits]. | Prends-en deux. |
| combined-001 | 2 | Je donne [le dossier] [à Léa]. | Je le lui donne. |
| combined-002 | 2 | Nous envoyons [les invitations] [aux voisins]. | Nous les leur envoyons. |
| combined-003 | 2 | Tu parles [du voyage] [à Paul]. | Tu lui en parles. |
| combined-004 | 3 | Je ne prête pas [ma voiture] [à Luc]. | Je ne la lui prête pas. |
| combined-005 | 3 | Elle va donner [les clés] [à ses parents]. | Elle va les leur donner. |
| combined-006 | 3 | Il a envoyé [la lettre] [à Marie]. | Il la lui a envoyée. |
| combined-007 | 3 | Donne [le livre] [à ton frère]. | Donne-le-lui. |
| combined-008 | 3 | Ne donne pas [les bonbons] [aux enfants]. | Ne les leur donne pas. |

## Reference checks

Sentences are original practice examples, not copied exercises. The existing grammar reference supplies the general rules. Command placement was checked against [Académie française: pronouns and imperative](https://www.dictionnaire-academie.fr/article/QDL040); the invariable participle in en-007 follows [OQLF: agreement with en](https://vitrinelinguistique.oqlf.gouv.qc.ca/21037/la-grammaire/le-verbe/accord-du-participe-passe/cas-particuliers-daccord-du-participe-passe/accord-du-participe-passe-avec-le-pronom-en).

Automated validation checks structure, unique IDs/prompts, unambiguous targets, bilingual explanations, category coverage and difficulty/tag metadata. It cannot prove every sentence is linguistically correct; content review remains necessary.
