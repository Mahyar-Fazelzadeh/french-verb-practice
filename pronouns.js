"use strict";

// Own session and DOM: never reads or changes the conjugation session/history.
(() => {
  const el = id => document.getElementById("pronouns-" + id);
  const categoryKeys = { cod: "pronounsCod", coi: "pronounsCoi", y: "pronounsY", en: "pronounsEn", combined: "pronounsCombined" };
  let practice = null;
  let results = null;
  let errorKey = "";
  const normalize = text => text.normalize("NFC").toLowerCase().replaceAll("’", "'")
    .replace(/\s+/g, " ").trim().replace(/\.$/, "").trim();

  function eligibleQuestions(category, difficulty) {
    return pronounsData.exercises.filter(question =>
      (category === "mixed" ? question.mixedEligible : question.category === category)
      && (difficulty === "all" || question.difficulty === Number(difficulty)));
  }

  function refreshAvailability() {
    const count = eligibleQuestions(el("category").value, el("difficulty").value).length;
    el("available").textContent = count
      ? t("pAvailable", { count, total: Math.min(count, Number(el("length").value)) })
      : t("pNoAvailable");
  }

  function refreshText() {
    refreshAvailability();
    el("error").textContent = errorKey ? t(errorKey) : "";
    if (results) el("results").textContent = t("pResults", results);
    if (!practice) return;
    const question = practice.questions[practice.index];
    el("question-heading").textContent = t("pQuestion", { current: practice.index + 1, total: practice.questions.length });
    el("active-category").textContent = practice.category === "mixed"
      ? t("pMixed") + (practice.checked ? " · " + t(categoryKeys[question.category]) : "")
      : t(categoryKeys[question.category]);
    el("active-difficulty").textContent = t(practice.difficulty === "all" ? "pAllDifficulties" : "pDifficulty" + practice.difficulty);
    el("instructions").textContent = pronounsData.instructions[language];
    el("targets").textContent = t("pTargets", { targets: question.targets.join(" · ") });
    el("next").textContent = t(practice.index === practice.questions.length - 1 ? "pFinish" : "next");
    el("check-status").textContent = practice.checked ? t(practice.correct ? "pCheckedCorrect" : "pCheckedIncorrect") : "";
    el("explanation").textContent = practice.checked ? question.explanation[language] : "";
  }

  function renderQuestion() {
    practice.checked = false;
    const question = practice.questions[practice.index];
    el("sentence").replaceChildren();
    const spans = question.targets.map(text => ({ text, start: question.sentence.indexOf(text) })).sort((a, b) => a.start - b.start);
    let cursor = 0;
    for (const span of spans) {
      el("sentence").append(document.createTextNode(question.sentence.slice(cursor, span.start)));
      const mark = document.createElement("mark");
      mark.textContent = span.text;
      el("sentence").append(mark);
      cursor = span.start + span.text.length;
    }
    el("sentence").append(document.createTextNode(question.sentence.slice(cursor)));
    el("answer").value = "";
    el("answer").readOnly = false;
    el("answer").className = "";
    el("answer").setAttribute("aria-invalid", "false");
    el("feedback").textContent = "";
    el("feedback").className = "";
    el("check").hidden = false;
    el("retry").hidden = true;
    el("next").hidden = true;
    el("explanation").hidden = true;
    refreshText();
    el("question-heading").focus();
  }

  el("settings-form").addEventListener("submit", event => {
    event.preventDefault();
    const category = el("category").value;
    const length = Number(el("length").value);
    const difficulty = el("difficulty").value;
    errorKey = "";
    if ((!Object.hasOwn(categoryKeys, category) && category !== "mixed")
      || !["all", "1", "2", "3"].includes(difficulty) || ![3, 5, 10].includes(length)) {
      errorKey = "pInvalid";
      refreshText();
      return;
    }
    const pool = eligibleQuestions(category, difficulty);
    if (!pool.length) { errorKey = "pEmpty"; refreshText(); return; }
    // Shuffle a copy; the shared static bank retains its original order.
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    practice = { category, difficulty, questions: pool.slice(0, length), index: 0, attempts: [], checked: false };
    results = null;
    el("results").textContent = "";
    el("settings").hidden = true;
    el("reference").hidden = true;
    el("complete").hidden = true;
    el("practice").hidden = false;
    renderQuestion();
  });

  el("answer-form").addEventListener("submit", event => {
    event.preventDefault();
    if (!practice || practice.checked) return;
    const question = practice.questions[practice.index];
    const correct = question.acceptedAnswers.some(answer => normalize(answer) === normalize(el("answer").value));
    practice.attempts.push(correct);
    practice.correct = correct;
    practice.checked = true;
    el("answer").readOnly = true;
    el("answer").setAttribute("aria-invalid", String(!correct));
    el("answer").className = correct ? "pronoun-correct" : "pronoun-incorrect";
    el("feedback").className = el("answer").className;
    el("feedback").textContent = correct ? "✓" : "X " + question.acceptedAnswers.join(" / ");
    el("check").hidden = true;
    el("retry").hidden = false;
    el("next").hidden = false;
    el("explanation").hidden = false;
    refreshText();
    el("check-status").focus();
  });

  el("retry").addEventListener("click", () => {
    if (!practice || !practice.checked) return;
    renderQuestion();
    el("answer").focus();
  });
  el("next").addEventListener("click", () => {
    if (!practice || !practice.checked) return;
    practice.index++;
    if (practice.index < practice.questions.length) { renderQuestion(); return; }
    const correct = practice.attempts.filter(Boolean).length;
    results = { questions: practice.questions.length, attempts: practice.attempts.length, correct, incorrect: practice.attempts.length - correct };
    practice = null;
    el("practice").hidden = true;
    el("complete").hidden = false;
    refreshText();
    el("complete-heading").focus();
  });
  function backToSettings() {
    practice = null;
    results = null;
    errorKey = "";
    el("practice").hidden = true;
    el("complete").hidden = true;
    el("settings").hidden = false;
    el("reference").hidden = false;
    refreshText();
    el("exercises-heading").focus();
  }
  el("leave").addEventListener("click", backToSettings);
  el("return").addEventListener("click", backToSettings);
  ["category", "difficulty", "length"].forEach(id => {
    el(id).addEventListener("change", () => { errorKey = ""; refreshText(); });
  });
  document.getElementById("language-toggle").addEventListener("click", refreshText);
  refreshText();
})();
