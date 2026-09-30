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
    settingsError.textContent = "These verbs do not have forms in the selected tense(s). Choose another verb or tense. For example, pouvoir and falloir have no imperative.";
    return;
  }
  // Shuffle before taking the session limit so every selected verb has a chance.
  session = {
    level: settings.level || "",
    exercises: shuffle(selectedVerbs).slice(0, settings.exerciseCount).map((verb) => ({
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
  const total = session.exercises.reduce((sum, exercise) => sum + exerciseSubjects(exercise).length, 0);
  const correct = session.exercises.reduce((sum, exercise) => sum + exercise.correctCount, 0);
  document.getElementById("session-results").textContent = `You completed ${exerciseCount} ${exerciseCount === 1 ? "exercise" : "exercises"} and answered ${total} conjugations.`;
  document.getElementById("correct-total").textContent = String(correct);
  document.getElementById("incorrect-total").textContent = String(total - correct);
}

function renderExercise() {
  session.checked = false;
  checkAnswers.hidden = false;
  tryAgain.hidden = true;
  nextQuestion.hidden = true;
  answerSummary.textContent = "";
  const exercise = session.exercises[session.index];
  exerciseProgress.textContent = `Exercise ${session.index + 1} of ${session.exercises.length}`;
  if (session.level) exerciseProgress.textContent += ` · Level ${session.level}`;
  exerciseHeading.textContent = `${exercise.verb.infinitive} — ${conjugationData.tenses[exercise.tenseId]}`;
  const instructions = exercise.tenseId === "imperatif"
    ? "Write the affirmative command without the subject. Include attached reflexive pronouns, for example lève-toi."
    : "Write the verb form without the subject or que/qu’. Include auxiliaries and reflexive pronouns, for example ai parlé or me suis levée. Where the subject allows it, masculine/feminine forms are accepted; vous may be singular or plural.";
  document.getElementById("answer-instructions").textContent = instructions;
  document.getElementById("verb-note").textContent = exercise.verb.note;
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
      copyButton.textContent = "Copy to next";
      copyButton.disabled = true;
      copyButton.setAttribute("aria-label", `Copy ${subject} answer to ${subjects[index + 1]}`);
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

  nextQuestion.textContent = session.index === session.exercises.length - 1 ? "Finish Session" : "Next Question";
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

  // Replace the previous attempt's result instead of counting retries twice.
  exercise.correctCount = correctCount;
  session.checked = true;
  answerFields.querySelectorAll("button").forEach((button) => {
    button.hidden = true;
    button.disabled = true;
  });
  checkAnswers.hidden = true;
  tryAgain.hidden = false;
  nextQuestion.hidden = false;
  const nextAction = session.index === session.exercises.length - 1 ? "finish the session" : "move to the next exercise";
  answerSummary.textContent = `${correctCount} of ${correctForms.length} correct. Try again or ${nextAction}.`;
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

function updateSelection() {
  const inLevel = verbChoices.filter(({ verb }) => matchesLevel(verb, practiceLevel.value));
  const activeGroups = verbGroups.map(({ toggle, category, title, titleNode }) => {
    const checkboxes = inLevel.filter(({ verb }) => verb.category === category).map(({ checkbox }) => checkbox);
    titleNode.textContent = `${title} (${checkboxes.length})`;
    return { toggle, checkboxes };
  });
  [...activeGroups, ...tenseGroups].forEach(({ toggle, checkboxes }) => {
    const count = checkboxes.filter((checkbox) => checkbox.checked).length;
    toggle.checked = checkboxes.length > 0 && count === checkboxes.length;
    toggle.indeterminate = count > 0 && count < checkboxes.length;
  });
  settingsError.textContent = "";
  const selected = inLevel.filter(({ checkbox }) => checkbox.checked).length;
  const shown = verbChoices.filter(({ checkbox }) => !checkbox.parentElement.hidden).length;
  const scope = practiceLevel.value ? ` in Level ${practiceLevel.value}` : " across all levels";
  document.getElementById("selection-status").textContent = `${selected} of ${inLevel.length} verbs selected${scope} · ${shown} shown${shown ? "" : " — no matches"}.`;
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
});
conjugationData.levels.forEach((level) => {
  const option = document.createElement("option");
  option.value = String(level.id);
  option.textContent = `Level ${level.id} — ${level.title} (${level.verbs.length} verbs)`;
  practiceLevel.append(option);
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
  settingsError.textContent = "";

  if (!tenseIds.length || !verbs.length) {
    settingsError.textContent = "Select at least one tense and one verb in the chosen level before starting.";
    return;
  }

  if (![3, 5, 10].includes(exerciseCount)) {
    settingsError.textContent = "Choose 3, 5, or 10 questions per session.";
    return;
  }
  startSession({ tenseIds, verbs, exerciseCount, level: practiceLevel.value });
});
