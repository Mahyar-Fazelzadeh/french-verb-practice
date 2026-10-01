"use strict";

// Curated static sentences, independent of conjugationData and the DOM.
// Difficulty 1–3 is provisional metadata, not a fixed learner-level system.
// Mixed practice draws from mixedEligible entries without displaying category.
const pronounsData = {
  "schemaVersion": 1,
  "instructions": {
    "en": "Rewrite the whole sentence, replacing only the marked words with pronouns. Keep the subject, tense and meaning, including any quantity. Make any necessary agreement changes.",
    "fr": "Réécrivez toute la phrase en remplaçant uniquement les mots indiqués par des pronoms. Conservez le sujet, le temps et le sens, y compris les quantités. Faites les accords nécessaires."
  },
  "categories": [
    "cod",
    "coi",
    "y",
    "en",
    "combined"
  ],
  "exercises": [
    {
      "id": "cod-001",
      "type": "rewrite",
      "category": "cod",
      "difficulty": 1,
      "tags": [
        "present"
      ],
      "mixedEligible": true,
      "sentence": "Je ferme la fenêtre.",
      "targets": [
        "la fenêtre"
      ],
      "acceptedAnswers": [
        "Je la ferme."
      ],
      "explanation": {
        "en": "La fenêtre is a feminine singular direct object: la precedes ferme.",
        "fr": "La fenêtre est un COD féminin singulier : la précède ferme."
      }
    },
    {
      "id": "cod-002",
      "type": "rewrite",
      "category": "cod",
      "difficulty": 1,
      "tags": [
        "present"
      ],
      "mixedEligible": true,
      "sentence": "Nous cherchons les clés.",
      "targets": [
        "les clés"
      ],
      "acceptedAnswers": [
        "Nous les cherchons."
      ],
      "explanation": {
        "en": "Les replaces the plural direct object les clés.",
        "fr": "Les remplace le COD pluriel les clés."
      }
    },
    {
      "id": "cod-003",
      "type": "rewrite",
      "category": "cod",
      "difficulty": 1,
      "tags": [
        "present"
      ],
      "mixedEligible": true,
      "sentence": "Tu regardes le tableau.",
      "targets": [
        "le tableau"
      ],
      "acceptedAnswers": [
        "Tu le regardes."
      ],
      "explanation": {
        "en": "Le tableau is masculine singular and follows regarder without a preposition.",
        "fr": "Le tableau est masculin singulier et complète regarder sans préposition."
      }
    },
    {
      "id": "cod-004",
      "type": "rewrite",
      "category": "cod",
      "difficulty": 2,
      "tags": [
        "elision"
      ],
      "mixedEligible": true,
      "sentence": "Elle invite Alice.",
      "targets": [
        "Alice"
      ],
      "acceptedAnswers": [
        "Elle l’invite."
      ],
      "explanation": {
        "en": "La becomes l’ before invite, which starts with a vowel.",
        "fr": "La devient l’ devant invite, qui commence par une voyelle."
      }
    },
    {
      "id": "cod-005",
      "type": "rewrite",
      "category": "cod",
      "difficulty": 2,
      "tags": [
        "negation"
      ],
      "mixedEligible": true,
      "sentence": "Je ne connais pas ces voisins.",
      "targets": [
        "ces voisins"
      ],
      "acceptedAnswers": [
        "Je ne les connais pas."
      ],
      "explanation": {
        "en": "Put les between ne and connais; keep pas after the verb.",
        "fr": "Placez les entre ne et connais ; conservez pas après le verbe."
      }
    },
    {
      "id": "cod-006",
      "type": "rewrite",
      "category": "cod",
      "difficulty": 2,
      "tags": [
        "infinitive"
      ],
      "mixedEligible": true,
      "sentence": "Vous voulez lire ce roman.",
      "targets": [
        "ce roman"
      ],
      "acceptedAnswers": [
        "Vous voulez le lire."
      ],
      "explanation": {
        "en": "Ce roman is the object of lire, so le goes before the infinitive.",
        "fr": "Ce roman est le COD de lire : le se place donc devant cet infinitif."
      }
    },
    {
      "id": "cod-007",
      "type": "rewrite",
      "category": "cod",
      "difficulty": 3,
      "tags": [
        "agreement"
      ],
      "mixedEligible": true,
      "sentence": "Paul a écrit les lettres.",
      "targets": [
        "les lettres"
      ],
      "acceptedAnswers": [
        "Paul les a écrites."
      ],
      "explanation": {
        "en": "Les precedes avoir; écrites agrees with the feminine plural letters.",
        "fr": "Les précède avoir ; écrites s’accorde avec les lettres, féminin pluriel."
      }
    },
    {
      "id": "cod-008",
      "type": "rewrite",
      "category": "cod",
      "difficulty": 3,
      "tags": [
        "imperative"
      ],
      "mixedEligible": true,
      "sentence": "Ferme la porte.",
      "targets": [
        "la porte"
      ],
      "acceptedAnswers": [
        "Ferme-la."
      ],
      "explanation": {
        "en": "In an affirmative command, la follows the verb with a hyphen.",
        "fr": "À l’impératif affirmatif, la suit le verbe avec un trait d’union."
      }
    },
    {
      "id": "coi-001",
      "type": "rewrite",
      "category": "coi",
      "difficulty": 1,
      "tags": [
        "present"
      ],
      "mixedEligible": true,
      "sentence": "Je téléphone à ma sœur.",
      "targets": [
        "à ma sœur"
      ],
      "acceptedAnswers": [
        "Je lui téléphone."
      ],
      "explanation": {
        "en": "Téléphoner à someone takes lui for one person, including a woman.",
        "fr": "Téléphoner à quelqu’un se construit avec lui pour une personne, même une femme."
      }
    },
    {
      "id": "coi-002",
      "type": "rewrite",
      "category": "coi",
      "difficulty": 1,
      "tags": [
        "present"
      ],
      "mixedEligible": true,
      "sentence": "Nous répondons aux clients.",
      "targets": [
        "aux clients"
      ],
      "acceptedAnswers": [
        "Nous leur répondons."
      ],
      "explanation": {
        "en": "Répondre à several people takes leur, without s.",
        "fr": "Répondre à plusieurs personnes se construit avec leur, sans s."
      }
    },
    {
      "id": "coi-003",
      "type": "rewrite",
      "category": "coi",
      "difficulty": 1,
      "tags": [
        "present"
      ],
      "mixedEligible": true,
      "sentence": "Tu parles à ton frère.",
      "targets": [
        "à ton frère"
      ],
      "acceptedAnswers": [
        "Tu lui parles."
      ],
      "explanation": {
        "en": "À ton frère becomes lui before parles.",
        "fr": "À ton frère devient lui devant parles."
      }
    },
    {
      "id": "coi-004",
      "type": "rewrite",
      "category": "coi",
      "difficulty": 2,
      "tags": [
        "negation"
      ],
      "mixedEligible": true,
      "sentence": "Elle ne répond pas à ses collègues.",
      "targets": [
        "à ses collègues"
      ],
      "acceptedAnswers": [
        "Elle ne leur répond pas."
      ],
      "explanation": {
        "en": "Place leur between ne and répond.",
        "fr": "Placez leur entre ne et répond."
      }
    },
    {
      "id": "coi-005",
      "type": "rewrite",
      "category": "coi",
      "difficulty": 2,
      "tags": [
        "infinitive"
      ],
      "mixedEligible": true,
      "sentence": "Je vais écrire à mes parents.",
      "targets": [
        "à mes parents"
      ],
      "acceptedAnswers": [
        "Je vais leur écrire."
      ],
      "explanation": {
        "en": "The pronoun belongs to écrire and goes before that infinitive.",
        "fr": "Le pronom dépend d’écrire et se place devant cet infinitif."
      }
    },
    {
      "id": "coi-006",
      "type": "rewrite",
      "category": "coi",
      "difficulty": 2,
      "tags": [
        "compound"
      ],
      "mixedEligible": true,
      "sentence": "Nous avons parlé à la directrice.",
      "targets": [
        "à la directrice"
      ],
      "acceptedAnswers": [
        "Nous lui avons parlé."
      ],
      "explanation": {
        "en": "Lui precedes the auxiliary; an indirect object does not cause agreement in parlé.",
        "fr": "Lui précède l’auxiliaire ; un COI ne commande pas l’accord de parlé."
      }
    },
    {
      "id": "coi-007",
      "type": "rewrite",
      "category": "coi",
      "difficulty": 3,
      "tags": [
        "imperative"
      ],
      "mixedEligible": true,
      "sentence": "Répondez aux visiteurs.",
      "targets": [
        "aux visiteurs"
      ],
      "acceptedAnswers": [
        "Répondez-leur."
      ],
      "explanation": {
        "en": "Affirmative commands attach leur after the verb with a hyphen.",
        "fr": "À l’impératif affirmatif, leur suit le verbe avec un trait d’union."
      }
    },
    {
      "id": "coi-008",
      "type": "rewrite",
      "category": "coi",
      "difficulty": 3,
      "tags": [
        "negative-imperative"
      ],
      "mixedEligible": true,
      "sentence": "Ne téléphone pas à Paul.",
      "targets": [
        "à Paul"
      ],
      "acceptedAnswers": [
        "Ne lui téléphone pas."
      ],
      "explanation": {
        "en": "In a negative command, lui stays before the verb.",
        "fr": "À l’impératif négatif, lui reste devant le verbe."
      }
    },
    {
      "id": "y-001",
      "type": "rewrite",
      "category": "y",
      "difficulty": 1,
      "tags": [
        "place"
      ],
      "mixedEligible": true,
      "sentence": "Nous allons au musée.",
      "targets": [
        "au musée"
      ],
      "acceptedAnswers": [
        "Nous y allons."
      ],
      "explanation": {
        "en": "Y replaces the destination au musée.",
        "fr": "Y remplace la destination au musée."
      }
    },
    {
      "id": "y-002",
      "type": "rewrite",
      "category": "y",
      "difficulty": 1,
      "tags": [
        "place"
      ],
      "mixedEligible": true,
      "sentence": "Les enfants jouent dans le jardin.",
      "targets": [
        "dans le jardin"
      ],
      "acceptedAnswers": [
        "Les enfants y jouent."
      ],
      "explanation": {
        "en": "Y replaces the location dans le jardin.",
        "fr": "Y remplace le lieu dans le jardin."
      }
    },
    {
      "id": "y-003",
      "type": "rewrite",
      "category": "y",
      "difficulty": 2,
      "tags": [
        "idea"
      ],
      "mixedEligible": true,
      "sentence": "Tu réfléchis à cette solution.",
      "targets": [
        "à cette solution"
      ],
      "acceptedAnswers": [
        "Tu y réfléchis."
      ],
      "explanation": {
        "en": "Réfléchir à a thing or idea allows y.",
        "fr": "Réfléchir à une chose ou à une idée se construit avec y."
      }
    },
    {
      "id": "y-004",
      "type": "rewrite",
      "category": "y",
      "difficulty": 2,
      "tags": [
        "negation"
      ],
      "mixedEligible": true,
      "sentence": "Je ne pense pas à ce problème.",
      "targets": [
        "à ce problème"
      ],
      "acceptedAnswers": [
        "Je n’y pense pas."
      ],
      "explanation": {
        "en": "Y replaces à ce problème; ne becomes n’ before y.",
        "fr": "Y remplace à ce problème ; ne devient n’ devant y."
      }
    },
    {
      "id": "y-005",
      "type": "rewrite",
      "category": "y",
      "difficulty": 2,
      "tags": [
        "infinitive"
      ],
      "mixedEligible": true,
      "sentence": "Elle veut rester à Lyon.",
      "targets": [
        "à Lyon"
      ],
      "acceptedAnswers": [
        "Elle veut y rester."
      ],
      "explanation": {
        "en": "Y belongs to rester, so it precedes the infinitive.",
        "fr": "Y dépend de rester et se place donc devant cet infinitif."
      }
    },
    {
      "id": "y-006",
      "type": "rewrite",
      "category": "y",
      "difficulty": 2,
      "tags": [
        "compound"
      ],
      "mixedEligible": true,
      "sentence": "Nous avons travaillé dans cette salle.",
      "targets": [
        "dans cette salle"
      ],
      "acceptedAnswers": [
        "Nous y avons travaillé."
      ],
      "explanation": {
        "en": "Y goes before the auxiliary avons.",
        "fr": "Y se place devant l’auxiliaire avons."
      }
    },
    {
      "id": "y-007",
      "type": "rewrite",
      "category": "y",
      "difficulty": 3,
      "tags": [
        "imperative"
      ],
      "mixedEligible": true,
      "sentence": "Va à la bibliothèque.",
      "targets": [
        "à la bibliothèque"
      ],
      "acceptedAnswers": [
        "Vas-y."
      ],
      "explanation": {
        "en": "Add s to va before the attached pronoun y.",
        "fr": "Ajoutez un s à va devant le pronom y relié par un trait d’union."
      }
    },
    {
      "id": "y-008",
      "type": "rewrite",
      "category": "y",
      "difficulty": 3,
      "tags": [
        "negative-imperative"
      ],
      "mixedEligible": true,
      "sentence": "Ne va pas dans cette pièce.",
      "targets": [
        "dans cette pièce"
      ],
      "acceptedAnswers": [
        "N’y va pas."
      ],
      "explanation": {
        "en": "The negative command places y before va; ne becomes n’.",
        "fr": "L’impératif négatif place y devant va ; ne devient n’."
      }
    },
    {
      "id": "en-001",
      "type": "rewrite",
      "category": "en",
      "difficulty": 1,
      "tags": [
        "partitive"
      ],
      "mixedEligible": true,
      "sentence": "Elle boit du thé.",
      "targets": [
        "du thé"
      ],
      "acceptedAnswers": [
        "Elle en boit."
      ],
      "explanation": {
        "en": "En replaces the partitive group du thé.",
        "fr": "En remplace le groupe partitif du thé."
      }
    },
    {
      "id": "en-002",
      "type": "rewrite",
      "category": "en",
      "difficulty": 1,
      "tags": [
        "quantity"
      ],
      "mixedEligible": true,
      "sentence": "Tu achètes trois billets.",
      "targets": [
        "trois billets"
      ],
      "acceptedAnswers": [
        "Tu en achètes trois."
      ],
      "explanation": {
        "en": "Use en for billets and retain the quantity trois.",
        "fr": "Employez en pour billets et conservez la quantité trois."
      }
    },
    {
      "id": "en-003",
      "type": "rewrite",
      "category": "en",
      "difficulty": 2,
      "tags": [
        "quantity"
      ],
      "mixedEligible": true,
      "sentence": "Nous achetons beaucoup de légumes.",
      "targets": [
        "beaucoup de légumes"
      ],
      "acceptedAnswers": [
        "Nous en achetons beaucoup."
      ],
      "explanation": {
        "en": "En replaces the vegetables; keep the quantity beaucoup.",
        "fr": "En reprend les légumes ; conservez la quantité beaucoup."
      }
    },
    {
      "id": "en-004",
      "type": "rewrite",
      "category": "en",
      "difficulty": 2,
      "tags": [
        "idea"
      ],
      "mixedEligible": true,
      "sentence": "Je parle de ce projet.",
      "targets": [
        "de ce projet"
      ],
      "acceptedAnswers": [
        "J’en parle."
      ],
      "explanation": {
        "en": "En replaces de ce projet; je becomes j’ before en.",
        "fr": "En remplace de ce projet ; je devient j’ devant en."
      }
    },
    {
      "id": "en-005",
      "type": "rewrite",
      "category": "en",
      "difficulty": 2,
      "tags": [
        "origin"
      ],
      "mixedEligible": true,
      "sentence": "Vous revenez du marché.",
      "targets": [
        "du marché"
      ],
      "acceptedAnswers": [
        "Vous en revenez."
      ],
      "explanation": {
        "en": "En replaces the place of origin introduced by de.",
        "fr": "En remplace le lieu d’origine introduit par de."
      }
    },
    {
      "id": "en-006",
      "type": "rewrite",
      "category": "en",
      "difficulty": 2,
      "tags": [
        "negation"
      ],
      "mixedEligible": true,
      "sentence": "Je ne veux pas de sucre.",
      "targets": [
        "de sucre"
      ],
      "acceptedAnswers": [
        "Je n’en veux pas."
      ],
      "explanation": {
        "en": "Put en before veux; ne becomes n’ before en.",
        "fr": "Placez en devant veux ; ne devient n’ devant en."
      }
    },
    {
      "id": "en-007",
      "type": "rewrite",
      "category": "en",
      "difficulty": 3,
      "tags": [
        "compound"
      ],
      "mixedEligible": true,
      "sentence": "Elle a acheté des pommes.",
      "targets": [
        "des pommes"
      ],
      "acceptedAnswers": [
        "Elle en a acheté."
      ],
      "explanation": {
        "en": "With en as the direct object, acheté stays invariable in this sentence.",
        "fr": "Avec en comme COD, acheté reste invariable dans cette phrase."
      }
    },
    {
      "id": "en-008",
      "type": "rewrite",
      "category": "en",
      "difficulty": 3,
      "tags": [
        "imperative"
      ],
      "mixedEligible": true,
      "sentence": "Prends deux biscuits.",
      "targets": [
        "deux biscuits"
      ],
      "acceptedAnswers": [
        "Prends-en deux."
      ],
      "explanation": {
        "en": "En follows the affirmative command with a hyphen; keep deux.",
        "fr": "En suit l’impératif affirmatif avec un trait d’union ; conservez deux."
      }
    },
    {
      "id": "combined-001",
      "type": "rewrite",
      "category": "combined",
      "difficulty": 2,
      "tags": [
        "order"
      ],
      "mixedEligible": true,
      "sentence": "Je donne le dossier à Léa.",
      "targets": [
        "le dossier",
        "à Léa"
      ],
      "acceptedAnswers": [
        "Je le lui donne."
      ],
      "explanation": {
        "en": "Le replaces le dossier; lui replaces à Léa. Le goes before lui.",
        "fr": "Le remplace le dossier ; lui remplace à Léa. Le précède lui."
      }
    },
    {
      "id": "combined-002",
      "type": "rewrite",
      "category": "combined",
      "difficulty": 2,
      "tags": [
        "order"
      ],
      "mixedEligible": true,
      "sentence": "Nous envoyons les invitations aux voisins.",
      "targets": [
        "les invitations",
        "aux voisins"
      ],
      "acceptedAnswers": [
        "Nous les leur envoyons."
      ],
      "explanation": {
        "en": "Les precedes leur; leur remains invariable.",
        "fr": "Les précède leur ; leur reste invariable."
      }
    },
    {
      "id": "combined-003",
      "type": "rewrite",
      "category": "combined",
      "difficulty": 2,
      "tags": [
        "order"
      ],
      "mixedEligible": true,
      "sentence": "Tu parles du voyage à Paul.",
      "targets": [
        "du voyage",
        "à Paul"
      ],
      "acceptedAnswers": [
        "Tu lui en parles."
      ],
      "explanation": {
        "en": "Lui replaces à Paul and precedes en, which replaces du voyage.",
        "fr": "Lui remplace à Paul et précède en, qui remplace du voyage."
      }
    },
    {
      "id": "combined-004",
      "type": "rewrite",
      "category": "combined",
      "difficulty": 3,
      "tags": [
        "negation"
      ],
      "mixedEligible": true,
      "sentence": "Je ne prête pas ma voiture à Luc.",
      "targets": [
        "ma voiture",
        "à Luc"
      ],
      "acceptedAnswers": [
        "Je ne la lui prête pas."
      ],
      "explanation": {
        "en": "Both pronouns go between ne and prête, with la before lui.",
        "fr": "Les deux pronoms se placent entre ne et prête, avec la avant lui."
      }
    },
    {
      "id": "combined-005",
      "type": "rewrite",
      "category": "combined",
      "difficulty": 3,
      "tags": [
        "infinitive"
      ],
      "mixedEligible": true,
      "sentence": "Elle va donner les clés à ses parents.",
      "targets": [
        "les clés",
        "à ses parents"
      ],
      "acceptedAnswers": [
        "Elle va les leur donner."
      ],
      "explanation": {
        "en": "Both pronouns belong to donner and go before that infinitive.",
        "fr": "Les deux pronoms dépendent de donner et précèdent cet infinitif."
      }
    },
    {
      "id": "combined-006",
      "type": "rewrite",
      "category": "combined",
      "difficulty": 3,
      "tags": [
        "agreement"
      ],
      "mixedEligible": true,
      "sentence": "Il a envoyé la lettre à Marie.",
      "targets": [
        "la lettre",
        "à Marie"
      ],
      "acceptedAnswers": [
        "Il la lui a envoyée."
      ],
      "explanation": {
        "en": "La precedes lui and the auxiliary; envoyée agrees with la lettre, the preceding COD.",
        "fr": "La précède lui et l’auxiliaire ; envoyée s’accorde avec la lettre, COD placé avant."
      }
    },
    {
      "id": "combined-007",
      "type": "rewrite",
      "category": "combined",
      "difficulty": 3,
      "tags": [
        "imperative"
      ],
      "mixedEligible": true,
      "sentence": "Donne le livre à ton frère.",
      "targets": [
        "le livre",
        "à ton frère"
      ],
      "acceptedAnswers": [
        "Donne-le-lui."
      ],
      "explanation": {
        "en": "After the affirmative command, le precedes lui; connect both with hyphens.",
        "fr": "Après l’impératif affirmatif, le précède lui ; reliez les pronoms par des traits d’union."
      }
    },
    {
      "id": "combined-008",
      "type": "rewrite",
      "category": "combined",
      "difficulty": 3,
      "tags": [
        "negative-imperative"
      ],
      "mixedEligible": true,
      "sentence": "Ne donne pas les bonbons aux enfants.",
      "targets": [
        "les bonbons",
        "aux enfants"
      ],
      "acceptedAnswers": [
        "Ne les leur donne pas."
      ],
      "explanation": {
        "en": "A negative command uses the usual preverbal order: les then leur.",
        "fr": "L’impératif négatif reprend l’ordre habituel avant le verbe : les puis leur."
      }
    }
  ]
};
