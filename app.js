"use strict";

const settingsForm = document.getElementById("settings-form");
const settingsError = document.getElementById("settings-error");
const tenseOptions = document.getElementById("tense-options");
const verbOptions = document.getElementById("verb-options");
const verbGroups = [];
const tenseGroups = [];
const verbChoices = [];
const verbSearch = document.getElementById("verb-search");
const topicFilter = document.getElementById("topic-filter");
const practiceLevel = document.getElementById("practice-level");
const exerciseCountSelect = document.getElementById("exercise-count");
let session = null;
let lastResults = null;
let settingsErrorKey = "";
const topicOptions = [];
const levelOptions = [];
const settingsScreen = document.getElementById("settings-screen");
const practiceScreen = document.getElementById("practice-screen");
const completeScreen = document.getElementById("complete-screen");
const exerciseHeading = document.getElementById("exercise-heading");
const exerciseProgress = document.getElementById("exercise-progress");
const answerFields = document.getElementById("answer-fields");
const nextQuestion = document.getElementById("next-question");
const answerForm = document.getElementById("answer-form");
const checkAnswers = document.getElementById("check-answers");
const tryAgain = document.getElementById("try-again");
const answerSummary = document.getElementById("answer-summary");

const recentHistoryKey = "french-verb-practice.recent-verbs.v1";
const recentHistoryLifetime = 60 * 60 * 1000;
let recentVerbs = {};
let historyStorageAvailable = true;

function readRecentVerbs() {
  const now = Date.now();
  if (historyStorageAvailable) {
    try {
      const raw = localStorage.getItem(recentHistoryKey);
      try { recentVerbs = JSON.parse(raw || "{}"); }
      catch { recentVerbs = {}; }
    } catch { historyStorageAvailable = false; }
  }
  if (!recentVerbs || typeof recentVerbs !== "object" || Array.isArray(recentVerbs)) recentVerbs = {};
  const known = new Set(conjugationData.verbs.map(verb => verb.infinitive));
  recentVerbs = Object.fromEntries(Object.entries(recentVerbs).filter(([verb, time]) =>
    known.has(verb) && typeof time === "number" && Number.isFinite(time)
    && time <= now && now - time < recentHistoryLifetime));
  return recentVerbs;
}

function refreshRecentHistory() {
  const count = Object.keys(readRecentVerbs()).length;
  document.getElementById("recent-history-status").textContent = t(
    historyStorageAvailable ? "recentStatus" : "recentFallback", { count });
  document.getElementById("clear-recent-history").disabled = count === 0;
}

function rememberVerb(verb) {
  readRecentVerbs();
  recentVerbs[verb] = Date.now();
  if (historyStorageAvailable) {
    try { localStorage.setItem(recentHistoryKey, JSON.stringify(recentVerbs)); }
    catch { historyStorageAvailable = false; }
  }
}

function clearRecentHistory() {
  recentVerbs = {};
  if (historyStorageAvailable) {
    try { localStorage.removeItem(recentHistoryKey); }
    catch { historyStorageAvailable = false; }
  }
  setSettingsError();
  refreshRecentHistory();
}

document.getElementById("clear-recent-history").addEventListener("click", clearRecentHistory);

function setSettingsError(key = "") {
  settingsErrorKey = key;
  settingsError.textContent = key ? t(key) : "";
}

function refreshExerciseText() {
  if (!session) return;
  const exercise = session.exercises[session.index];
  exerciseProgress.textContent = t("progress", { current: session.index + 1, total: session.exercises.length })
    + (session.level ? t("levelSuffix", { level: session.level }) : "");
  exerciseHeading.textContent = `${exercise.verb.infinitive} — ${conjugationData.tenses[exercise.tenseId]}`;
  document.getElementById("answer-instructions").textContent = t(exercise.tenseId === "imperatif" ? "imperativeHelp" : "answerHelp");
  document.getElementById("verb-note").textContent = language === "fr" ? frenchNotes[exercise.verb.note] || "" : exercise.verb.note;
  const isLast = session.index === session.exercises.length - 1;
  nextQuestion.textContent = t(isLast ? "finish" : "next");
  if (session.checked) answerSummary.textContent = t("checked", {
    correct: exercise.correctCount, total: exerciseSubjects(exercise).length,
    action: t(isLast ? "finishAction" : "nextAction"),
  });
  const subjects = exerciseSubjects(exercise);
  answerFields.querySelectorAll("button").forEach((button, i) => {
    button.textContent = t("copy");
    button.setAttribute("aria-label", t("copyLabel", { from: subjects[i], to: subjects[i + 1] }));
  });
}

function applyLanguage() {
  document.documentElement.lang = language;
  document.title = t("title");
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.getAttribute("data-i18n"));
  });
  verbSearch.placeholder = t("searchPlaceholder");
  topicOptions.forEach(({ option, id }) => { option.textContent = t(id); });
  levelOptions.forEach(({ option, level }) => {
    option.textContent = t("levelOption", { level: level.id, title: t(`level${level.id}`), count: level.verbs.length });
  });
  const toggle = document.getElementById("language-toggle");
  const switchLabel = language === "en" ? "Passer en français" : "Switch to English";
  toggle.setAttribute("aria-label", switchLabel);
  toggle.setAttribute("title", switchLabel);
  toggle.setAttribute("aria-pressed", String(language === "fr"));
  document.getElementById("language-en").className = language === "en" ? "active-language" : "";
  document.getElementById("language-fr").className = language === "fr" ? "active-language" : "";
  updateSelection(false);
  setSettingsError(settingsErrorKey);
  refreshExerciseText();
  refreshRecentHistory();
  if (lastResults) renderResultsText();
}

document.getElementById("language-toggle").addEventListener("click", () => {
  language = language === "en" ? "fr" : "en";
  applyLanguage();
});

function normalizeAnswer(answer) {
  // NFC treats equivalent Unicode accents alike without removing accents.
  return answer.trim().normalize("NFC").toLowerCase().replaceAll("’", "'");
}

function exerciseSubjects(exercise) {
  if (exercise.tenseId === "imperatif") return conjugationData.imperativeSubjects;
  return exercise.verb.impersonal ? ["Il"] : conjugationData.subjects;
}

function matchesLevel(verb, level) {
  return !level || verb.level === Number(level);
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function startSession(settings) {
  const selectedVerbs = conjugationData.verbs.filter((verb) => settings.verbs.includes(verb.infinitive)
    && matchesLevel(verb, settings.level)
    && settings.tenseIds.some((tense) => verb.conjugations[tense]));
  if (!selectedVerbs.length) {
    setSettingsError("noForms");
    return;
  }
  const recent = readRecentVerbs();
  const availableVerbs = selectedVerbs.filter(verb => !Object.hasOwn(recent, verb.infinitive));
  refreshRecentHistory();
  if (!availableVerbs.length) {
    setSettingsError("recentExhausted");
    return;
  }
  setSettingsError();
  // Shuffle before taking the session limit so every selected verb has a chance.
  lastResults = null;
  session = {
    level: settings.level || "",
    attempts: [],
    exercises: shuffle(availableVerbs).slice(0, settings.exerciseCount).map((verb) => ({
      verb,
      tenseId: randomItem(settings.tenseIds.filter((tense) => verb.conjugations[tense])),
      correctCount: 0,
    })),
    index: 0,
  };
  settingsScreen.hidden = true;
  completeScreen.hidden = true;
  practiceScreen.hidden = false;
  renderExercise();
}

function showResults() {
  const exerciseCount = session.exercises.length;
  const total = session.attempts.reduce((sum, attempt) => sum + attempt.total, 0);
  const correct = session.attempts.reduce((sum, attempt) => sum + attempt.correct, 0);
  lastResults = { count: exerciseCount, attempts: session.attempts.length, total };
  renderResultsText();
  document.getElementById("correct-total").textContent = String(correct);
  document.getElementById("incorrect-total").textContent = String(total - correct);
}

function renderResultsText() {
  document.getElementById("session-results").textContent = t("results", lastResults);
}

function renderExercise() {
  session.checked = false;
  checkAnswers.hidden = false;
  tryAgain.hidden = true;
  nextQuestion.hidden = true;
  answerSummary.textContent = "";
  const exercise = session.exercises[session.index];
  rememberVerb(exercise.verb.infinitive);
  answerFields.replaceChildren();

  const subjects = exerciseSubjects(exercise);
  subjects.forEach((subject, index) => {
    const row = document.createElement("div");
    row.className = "answer-row";
    const label = document.createElement("label");
    label.htmlFor = `answer-${index}`;
    label.textContent = subject;
    label.lang = "fr";
    const input = document.createElement("input");
    input.id = label.htmlFor;
    input.type = "text";
    input.lang = "fr";
    input.autocomplete = "off";
    input.spellcheck = false;
    input.setAttribute("autocapitalize", "none");
    input.setAttribute("autocorrect", "off");
    input.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" || event.isComposing) return;
      event.preventDefault();
      if (!session || session.checked || event.repeat) return;
      const target = index < subjects.length - 1
        ? document.getElementById(`answer-${index + 1}`) : checkAnswers;
      target.focus();
    });
    const feedback = document.createElement("p");
    feedback.id = `feedback-${index}`;
    feedback.className = "answer-feedback";
    input.setAttribute("aria-describedby", `answer-instructions ${feedback.id}`);
    const answerContent = document.createElement("div");
    answerContent.className = "answer-content";
    answerContent.append(input);
    if (index < subjects.length - 1) {
      const copyButton = document.createElement("button");
      copyButton.type = "button";
      copyButton.className = "secondary copy-next";
      copyButton.textContent = t("copy");
      copyButton.disabled = true;
      copyButton.setAttribute("aria-label", t("copyLabel", { from: subject, to: subjects[index + 1] }));
      input.addEventListener("input", () => { copyButton.disabled = !input.value.trim(); });
      copyButton.addEventListener("click", () => {
        if (!session || session.checked || !input.value.trim()) return;
        const nextInput = document.getElementById(`answer-${index + 1}`);
        nextInput.value = input.value;
        nextInput.dispatchEvent(new Event("input", { bubbles: true }));
        nextInput.focus();
        nextInput.setSelectionRange(nextInput.value.length, nextInput.value.length);
      });
      answerContent.append(copyButton);
    }
    answerContent.append(feedback);
    row.append(label, answerContent);
    answerFields.append(row);
  });

  refreshExerciseText();
  exerciseHeading.focus();
}

nextQuestion.addEventListener("click", () => {
  if (!session || !session.checked) return;
  session.index += 1;
  if (session.index === session.exercises.length) {
    showResults();
    practiceScreen.hidden = true;
    completeScreen.hidden = false;
    document.getElementById("complete-heading").focus();
    session = null;
    return;
  }
  renderExercise();
});

answerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!session || session.checked) return;
  const exercise = session.exercises[session.index];
  const correctForms = exercise.verb.conjugations[exercise.tenseId];
  let correctCount = 0;

  answerFields.querySelectorAll("input").forEach((input, index) => {
    const correct = correctForms[index].some((form) => normalizeAnswer(input.value) === normalizeAnswer(form));
    const feedback = document.getElementById(`feedback-${index}`);
    input.readOnly = true;
    input.setAttribute("aria-invalid", String(!correct));
    input.closest(".answer-row").classList.add(correct ? "correct" : "incorrect");
    if (correct) {
      correctCount += 1;
      feedback.textContent = "✓";
    } else {
      feedback.textContent = "X ";
      const correction = document.createElement("strong");
      correction.lang = "fr";
      correction.textContent = correctForms[index].join(" / ");
      feedback.append(correction);
    }
  });

  // Preserve every checked attempt; the latest score is used for row feedback.
  session.attempts.push({ correct: correctCount, total: correctForms.length });
  exercise.correctCount = correctCount;
  session.checked = true;
  answerFields.querySelectorAll("button").forEach((button) => {
    button.hidden = true;
    button.disabled = true;
  });
  checkAnswers.hidden = true;
  tryAgain.hidden = false;
  nextQuestion.hidden = false;
  refreshExerciseText();
  answerSummary.focus();
});

tryAgain.addEventListener("click", () => {
  if (!session || !session.checked) return;
  renderExercise();
  answerFields.querySelector("input").focus();
});

function returnToSettings() {
  session = null;
  answerFields.replaceChildren();
  practiceScreen.hidden = true;
  completeScreen.hidden = true;
  settingsScreen.hidden = false;
  refreshRecentHistory();
  settingsForm.querySelector('button[type="submit"]').focus();
}

document.getElementById("leave-practice").addEventListener("click", returnToSettings);
document.getElementById("return-settings").addEventListener("click", returnToSettings);

function addCheckbox(container, name, value, text, checked) {
  const label = document.createElement("label");
  label.className = "checkbox-option";
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.name = name;
  checkbox.value = value;
  checkbox.checked = checked;
  label.append(checkbox, document.createTextNode(text));
  container.append(label);
  return checkbox;
}

const moods = new Map();
Object.entries(conjugationData.tenses).forEach(([id, label]) => {
  const [mood, tense] = label.split(" — ");
  if (!moods.has(mood)) moods.set(mood, []);
  moods.get(mood).push({ id, label: tense });
});
moods.forEach((tenses, mood) => {
  const group = document.createElement("div");
  group.className = "tense-group";
  const toggle = addCheckbox(group, "mood", mood, mood, false);
  toggle.parentElement.classList.add("group-label");
  const options = document.createElement("div");
  options.className = "options";
  const checkboxes = tenses.map(({ id, label }) => addCheckbox(options, "tense", id, label, id === "present"));
  group.append(options);
  tenseOptions.append(group);
  tenseGroups.push({ toggle, checkboxes });
  toggle.addEventListener("change", () => {
    checkboxes.forEach((checkbox) => { checkbox.checked = toggle.checked; });
  });
});

Object.entries(conjugationData.categories).forEach(([category, title]) => {
  const group = document.createElement("div");
  group.className = "verb-group";
  const categoryVerbs = conjugationData.verbs.filter((verb) => verb.category === category);
  const toggle = addCheckbox(group, "category", category, `${title} (${categoryVerbs.length})`, true);
  toggle.parentElement.classList.add("group-label");
  const titleNode = document.createElement("span");
  toggle.parentElement.replaceChildren(toggle, titleNode);
  const options = document.createElement("div");
  options.className = "options";
  const checkboxes = categoryVerbs.map((verb) => {
    const checkbox = addCheckbox(options, "verb", verb.infinitive, verb.infinitive, true);
    verbChoices.push({ verb, checkbox });
    return checkbox;
  });
  group.append(options);
  verbOptions.append(group);
  verbGroups.push({ group, toggle, checkboxes, category, title, titleNode });

  toggle.addEventListener("change", () => {
    verbChoices.filter(({ verb }) => verb.category === category && matchesLevel(verb, practiceLevel.value))
      .forEach(({ checkbox }) => { checkbox.checked = toggle.checked; });
  });
});

function updateSelection(clearError = true) {
  const inLevel = verbChoices.filter(({ verb }) => matchesLevel(verb, practiceLevel.value));
  const activeGroups = verbGroups.map(({ toggle, category, title, titleNode }) => {
    const checkboxes = inLevel.filter(({ verb }) => verb.category === category).map(({ checkbox }) => checkbox);
    titleNode.textContent = `${t(category)} (${checkboxes.length})`;
    return { toggle, checkboxes };
  });
  [...activeGroups, ...tenseGroups].forEach(({ toggle, checkboxes }) => {
    const count = checkboxes.filter((checkbox) => checkbox.checked).length;
    toggle.checked = checkboxes.length > 0 && count === checkboxes.length;
    toggle.indeterminate = count > 0 && count < checkboxes.length;
  });
  if (clearError) setSettingsError();
  const selected = inLevel.filter(({ checkbox }) => checkbox.checked).length;
  const shown = verbChoices.filter(({ checkbox }) => !checkbox.parentElement.hidden).length;
  const scope = practiceLevel.value ? t("levelScope", { level: practiceLevel.value }) : t("allScope");
  document.getElementById("selection-status").textContent = t("selection", { selected, total: inLevel.length, scope, shown, empty: shown ? "" : t("noMatches") });
}

function filterVerbs() {
  const searchKey = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replaceAll("’", "'");
  const query = searchKey(verbSearch.value.trim());
  verbChoices.forEach(({ verb, checkbox }) => {
    checkbox.parentElement.hidden = !matchesLevel(verb, practiceLevel.value) || !searchKey(verb.infinitive).includes(query)
      || (topicFilter.value !== "" && !verb.topics.includes(topicFilter.value));
  });
  verbGroups.forEach(({ group, checkboxes }) => { group.hidden = checkboxes.every((checkbox) => checkbox.parentElement.hidden); });
  updateSelection();
}

Object.entries(conjugationData.topics).forEach(([id, label]) => {
  const option = document.createElement("option");
  option.value = id;
  option.textContent = label;
  topicFilter.append(option);
  topicOptions.push({ option, id });
});
conjugationData.levels.forEach((level) => {
  const option = document.createElement("option");
  option.value = String(level.id);
  option.textContent = `Level ${level.id} — ${level.title} (${level.verbs.length} verbs)`;
  practiceLevel.append(option);
  levelOptions.push({ option, level });
});
practiceLevel.value = "1";
practiceLevel.addEventListener("change", filterVerbs);
verbSearch.addEventListener("input", filterVerbs);
topicFilter.addEventListener("change", filterVerbs);
settingsForm.addEventListener("change", updateSelection);
for (const [id, checked, visibleOnly] of [["select-shown", true, true], ["clear-shown", false, true], ["clear-all", false, false]]) {
  document.getElementById(id).addEventListener("click", () => {
    verbChoices.forEach(({ checkbox }) => { if (!visibleOnly || !checkbox.parentElement.hidden) checkbox.checked = checked; });
    updateSelection();
  });
}
filterVerbs();

settingsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const selected = new FormData(settingsForm);
  const tenseIds = selected.getAll("tense");
  const verbs = verbChoices.filter(({ verb, checkbox }) => checkbox.checked && matchesLevel(verb, practiceLevel.value))
    .map(({ verb }) => verb.infinitive);
  const exerciseCount = Number(exerciseCountSelect.value);
  setSettingsError();

  if (!tenseIds.length || !verbs.length) {
    setSettingsError("chooseRequired");
    return;
  }

  if (![3, 5, 10].includes(exerciseCount)) {
    setSettingsError("chooseLength");
    return;
  }
  startSession({ tenseIds, verbs, exerciseCount, level: practiceLevel.value });
});

applyLanguage();
