"use strict";


/*
==================================================
REAL LIFE QUEST
==================================================

IMPORTANT RULE:

The application NEVER creates quest or objective
content on its own.

Every quest and every objective must be written
by the user.

The application only manages:
- XP
- Levels
- Completion
- Badges
- Themes
- Saving
==================================================
*/


const STORAGE_KEY =
  "real-life-quest-liquid-v5";


/*
XP VALUES
*/

const QUEST_XP = {

  easy: 50,

  medium: 100,

  hard: 200,

  epic: 400,

  legendary: 800

};


/*
PRESET THEMES

These ONLY change appearance.

They NEVER create quests
or objectives.
*/

const PRESETS = {

  Cosmic: {

    bg: "#070b1c",

    card: "#18203a",

    text: "#f5f3ff",

    accent: "#8b7cff",

    accent2: "#61e6c1",

    font: "system"

  },


  Ocean: {

    bg: "#061a26",

    card: "#103247",

    text: "#e9fbff",

    accent: "#21b7ff",

    accent2: "#58f0d0",

    font: "system"

  },


  Forest: {

    bg: "#071b13",

    card: "#123326",

    text: "#ecfff5",

    accent: "#48d597",

    accent2: "#a8f078",

    font: "system"

  },


  Inferno: {

    bg: "#210b08",

    card: "#3a1712",

    text: "#fff4ed",

    accent: "#ff684d",

    accent2: "#ffc857",

    font: "system"

  },


  Sakura: {

    bg: "#210d1c",

    card: "#3b1930",

    text: "#fff0f7",

    accent: "#ff75b5",

    accent2: "#ffc0dc",

    font: "serif"

  },


  Arctic: {

    bg: "#081824",

    card: "#173246",

    text: "#f1fbff",

    accent: "#66cfff",

    accent2: "#c5f2ff",

    font: "system"

  },


  Desert: {

    bg: "#24170b",

    card: "#3b2916",

    text: "#fff7e7",

    accent: "#e5a84b",

    accent2: "#f4d58a",

    font: "serif"

  },


  Fantasy: {

    bg: "#140d24",

    card: "#281844",

    text: "#f8f1ff",

    accent: "#a46cff",

    accent2: "#6ce0ff",

    font: "serif"

  },


  Cyberpunk: {

    bg: "#090713",

    card: "#20102b",

    text: "#f8efff",

    accent: "#ff35d1",

    accent2: "#26e6ff",

    font: "mono"

  },


  Golden: {

    bg: "#171108",

    card: "#30230d",

    text: "#fff8df",

    accent: "#f0b84b",

    accent2: "#fff09a",

    font: "serif"

  }

};


/*
BADGES

Badges are generated from progress.

They do NOT generate quests
or objectives.
*/

const BADGES = [

  [

    "firstQuest",

    "🗺️",

    "First Quest",

    state =>
      state.quests.length > 0

  ],


  [

    "firstComplete",

    "🏆",

    "Quest Complete",

    state =>
      state.quests.some(
        quest => quest.done
      )

  ],


  [

    "fiveComplete",

    "⚔️",

    "Seasoned Adventurer",

    state =>
      state.quests.filter(
        quest => quest.done
      ).length >= 5

  ],


  [

    "tenObjectives",

    "🎯",

    "Objective Hunter",

    state =>
      state.objectivesCompleted >= 10

  ],


  [

    "levelFive",

    "⭐",

    "Rising Hero",

    state =>
      getLevelInfo(
        state.xp
      ).level >= 5

  ],


  [

    "levelTen",

    "👑",

    "Legend",

    state =>
      getLevelInfo(
        state.xp
      ).level >= 10

  ],


  [

    "sideQuest",

    "🌟",

    "Side Quest",

    state =>
      state.standalone.some(
        objective =>
          objective.done
      )

  ]

];


const $ = id =>
  document.getElementById(id);


/*
CREATE EMPTY DATA

Notice:

There are NO quests.

There are NO objectives.

*/

function createFreshState() {

  return {

    quests: [],

    standalone: [],

    xp: 0,

    objectivesCompleted: 0,

    badges: [],

    settings: {

      bg: "#07111f",

      card: "#18243a",

      text: "#f7f9ff",

      accent: "#7c8cff",

      accent2: "#61e6c1",

      font: "system"

    }

  };

}


/*
LOAD DATA
*/

function loadState() {

  try {

    const saved =
      localStorage.getItem(
        STORAGE_KEY
      );

    if (!saved) {

      return createFreshState();

    }

    const data =
      JSON.parse(saved);

    if (

      !Array.isArray(
        data.quests
      )

      ||

      !Array.isArray(
        data.standalone
      )

    ) {

      return createFreshState();

    }

    return data;

  }

  catch {

    return createFreshState();

  }

}


let state =
  loadState();


/*
SAVE DATA
*/

function saveState() {

  localStorage.setItem(

    STORAGE_KEY,

    JSON.stringify(state)

  );

}


/*
GENERATE INTERNAL ID

This creates an ID only.

It NEVER creates quest
or objective content.
*/

function createID() {

  return (

    Date.now() +

    "-" +

    Math.random()
      .toString(36)
      .slice(2)

  );

}


/*
XP LEVEL SYSTEM
*/

function getLevelInfo(xp) {

  let level = 1;

  let currentXP = xp;

  let requiredXP = 100;


  while (

    currentXP >=
    requiredXP

  ) {

    currentXP -=
      requiredXP;

    level++;

    requiredXP =
      Math.floor(

        100 *

        Math.pow(

          1.15,

          level - 1

        )

      );

  }


  return {

    level,

    currentXP,

    requiredXP

  };

}


/*
TOAST
*/

function showToast(message) {

  const toast =
    $("toast");

  toast.textContent =
    message;

  toast.classList.add(
    "show"
  );


  clearTimeout(
    window.toastTimer
  );


  window.toastTimer =

    setTimeout(

      () => {

        toast.classList.remove(
          "show"
        );

      },

      2500

    );

}


/*
MODALS
*/

function openModal(id) {

  $(id)
    .classList
    .remove(
      "hidden"
    );

}


function closeModal(id) {

  $(id)
    .classList
    .add(
      "hidden"
    );

}


/*
APPLY THEME

Themes affect:

- Background
- Glass tiles
- Buttons
- Accent
- Progress bar
- Text
*/

function applyTheme() {

  const settings =
    state.settings;


  document.documentElement
    .style
    .setProperty(

      "--bg",

      settings.bg

    );


  document.documentElement
    .style
    .setProperty(

      "--glass",

      settings.card

    );


  document.documentElement
    .style
    .setProperty(

      "--text",

      settings.text

    );


  document.documentElement
    .style
    .setProperty(

      "--accent",

      settings.accent

    );


  document.documentElement
    .style
    .setProperty(

      "--accent2",

      settings.accent2

    );


  document.body
    .classList
    .remove(

      "serif",

      "mono"

    );


  if (

    settings.font ===
    "serif"

  ) {

    document.body
      .classList
      .add(
        "serif"
      );

  }


  if (

    settings.font ===
    "mono"

  ) {

    document.body
      .classList
      .add(
        "mono"
      );

  }


  $("bgColor").value =
    settings.bg;

  $("cardColor").value =
    settings.card;

  $("textColor").value =
    settings.text;

  $("accentColor").value =
    settings.accent;

  $("font").value =
    settings.font;

}


/*
RENDER EVERYTHING
*/

function render() {

  applyTheme();


  const info =
    getLevelInfo(
      state.xp
    );


  $("level")
    .textContent =
    info.level;


  $("levelTitle")
    .textContent =

    "Level " +

    info.level +

    " Adventurer";


  $("xpText")
    .textContent =

    info.currentXP +

    " / " +

    info.requiredXP +

    " XP to next level";


  $("xpBar")
    .style
    .width =

    (

      info.currentXP /

      info.requiredXP *

      100

    ) +

    "%";


  /*
  ONLY SHOW ACTIVE QUESTS

  Completed quests disappear.
  */

  const activeQuests =

    state.quests.filter(

      quest =>
        !quest.done

    );


  $("questTotal")
    .textContent =

    activeQuests.length;


  $("objectiveTotal")
    .textContent =

    state.standalone.filter(

      objective =>
        !objective.done

    ).length;


  $("badgeTotal")
    .textContent =

    state.badges.length;


  renderQuests(
    activeQuests
  );


  renderStandaloneObjectives();


  renderBadges();

}


/*
RENDER QUESTS
*/

function renderQuests(
  quests
) {

  const container =
    $("quests");


  container.innerHTML =
    "";


  $("questEmpty")
    .style
    .display =

    quests.length
      ? "none"
      : "block";


  quests.forEach(

    quest => {

      const card =
        document.createElement(
          "article"
        );


      card.className =
        "questCard glass";


      const content =
        document.createElement(
          "div"
        );


      content.className =
        "cardContent";


      const title =
        document.createElement(
          "h3"
        );


      /*
      USER'S QUEST NAME
      */

      title.textContent =
        quest.name;


      content.appendChild(
        title
      );


      const description =
        document.createElement(
          "p"
        );


      /*
      USER'S DESCRIPTION
      */

      description.className =
        "description";


      description.textContent =

        quest.description ||

        "No description.";


      content.appendChild(
        description
      );


      const difficulty =
        document.createElement(
          "span"
        );


      difficulty.className =
        "pill";


      difficulty.textContent =

        quest.difficulty
          .toUpperCase();


      content.appendChild(
        difficulty
      );


      const xp =
        document.createElement(
          "span"
        );


      xp.className =
        "pill xpPill";


      xp.textContent =

        QUEST_XP[
          quest.difficulty
        ] +

        " XP";


      content.appendChild(
        xp
      );


      /*
      OBJECTIVES
      */

      quest.objectives
        .forEach(

          objective => {

            const row =
              document.createElement(
                "label"
              );


            row.className =
              "objectiveRow";


            const checkbox =
              document.createElement(
                "input"
              );


            checkbox.type =
              "checkbox";


            checkbox.checked =
              objective.done;


            checkbox.addEventListener(

              "change",

              () => {

                completeQuestObjective(

                  quest.id,

                  objective.id,

                  checkbox.checked

                );

              }

            );


            const text =
              document.createElement(
                "span"
              );


            /*
            USER'S OBJECTIVE TEXT

            No generated text.
            */

            text.textContent =
              objective.text;


            row.append(

              checkbox,

              text

            );


            content.appendChild(
              row
            );

          }

        );


      /*
      DELETE QUEST
      */

      const actions =
        document.createElement(
          "div"
        );


      actions.className =
        "actions";


      const deleteButton =
        document.createElement(
          "button"
        );


      deleteButton.className =
        "bigButton danger";


      deleteButton.textContent =
        "Delete Quest";


      deleteButton.addEventListener(

        "click",

        () => {

          if (

            confirm(

              "Delete this quest?"

            )

          ) {

            state.quests =

              state.quests.filter(

                q =>
                  q.id !==
                  quest.id

              );


            saveState();

            render();

            showToast(
              "Quest deleted"
            );

          }

        }

      );


      actions.appendChild(
        deleteButton
      );


      content.appendChild(
        actions
      );


      card.appendChild(
        content
      );


      container.appendChild(
        card
      );

    }

  );

}


/*
QUEST OBJECTIVE COMPLETION
*/

function completeQuestObjective(

  questID,

  objectiveID,

  checked

) {

  const quest =

    state.quests.find(

      q =>
        q.id ===
        questID

    );


  if (!quest) {

    return;

  }


  const objective =

    quest.objectives.find(

      o =>
        o.id ===
        objectiveID

    );


  if (!objective) {

    return;

  }


  if (

    checked &&

    !objective.done

  ) {

    state.objectivesCompleted++;

  }


  objective.done =
    checked;


  /*
  ALL OBJECTIVES
  MUST BE COMPLETE
  */

  if (

    quest.objectives.every(

      o =>
        o.done

    )

    &&

    !quest.done

  ) {

    quest.done =
      true;


    state.xp +=

      QUEST_XP[
        quest.difficulty
      ];


    showToast(

      "Quest complete! +" +

      QUEST_XP[
        quest.difficulty
      ] +

      " XP"

    );

  }


  checkBadges();

  saveState();

  render();

}


/*
RENDER STANDALONE OBJECTIVES
*/

function renderStandaloneObjectives() {

  const container =
    $("standaloneObjectives");


  container.innerHTML =
    "";


  const active =

    state.standalone.filter(

      objective =>
        !objective.done

    );


  $("objectiveEmpty")
    .style
    .display =

    active.length
      ? "none"
      : "block";


  active.forEach(

    objective => {

      const card =
        document.createElement(
          "article"
        );


      card.className =
        "objectiveCard glass";


      const content =
        document.createElement(
          "div"
        );


      content.className =
        "cardContent";


      const title =
        document.createElement(
          "h3"
        );


      /*
      USER'S OBJECTIVE
      */

      title.textContent =
        objective.text;


      content.appendChild(
        title
      );


      const xp =
        document.createElement(
          "span"
        );


      xp.className =
        "pill xpPill";


      xp.textContent =

        objective.xp +

        " XP";


      content.appendChild(
        xp
      );


      const actions =
        document.createElement(
          "div"
        );


      actions.className =
        "actions";


      /*
      COMPLETE BUTTON
      */

      const completeButton =
        document.createElement(
          "button"
        );


      completeButton.className =
        "bigButton primary";


      completeButton.textContent =
        "Complete Objective";


      completeButton.addEventListener(

        "click",

        () => {

          completeStandaloneObjective(

            objective.id

          );

        }

      );


      /*
      DELETE BUTTON
      */

      const deleteButton =
        document.createElement(
          "button"
        );


      deleteButton.className =
        "bigButton danger";


      deleteButton.textContent =
        "Delete";


      deleteButton.addEventListener(

        "click",

        () => {

          if (

            confirm(

              "Delete this objective?"

            )

          ) {

            state.standalone =

              state.standalone.filter(

                o =>
                  o.id !==
                  objective.id

              );


            saveState();

            render();

          }

        }

      );


      actions.append(

        completeButton,

        deleteButton

      );


      content.appendChild(
        actions
      );


      card.appendChild(
        content
      );


      container.appendChild(
        card
      );

    }

  );

}


/*
COMPLETE STANDALONE OBJECTIVE
*/

function completeStandaloneObjective(

  objectiveID

) {

  const objective =

    state.standalone.find(

      o =>
        o.id ===
        objectiveID

    );


  if (

    !objective ||

    objective.done

  ) {

    return;

  }


  objective.done =
    true;


  state.xp +=
    objective.xp;


  state.objectivesCompleted++;


  checkBadges();

  saveState();

  render();


  showToast(

    "Objective complete! +" +

    objective.xp +

    " XP"

  );

}


/*
BADGES
*/

function checkBadges() {

  BADGES.forEach(

    badge => {

      const [

        id,

        icon,

        name,

        condition

      ] = badge;


      if (

        !state.badges.includes(
          id
        )

        &&

        condition(
          state
        )

      ) {

        state.badges.push(
          id
        );


        showToast(

          "Badge earned: " +

          icon +

          " " +

          name

        );

      }

    }

  );

}


/*
BADGE DISPLAY
*/

function renderBadges() {

  const container =
    $("badges");


  container.innerHTML =
    "";


  BADGES.forEach(

    badge => {

      const [

        id,

        icon,

        name

      ] = badge;


      const earned =

        state.badges.includes(
          id
        );


      const element =
        document.createElement(
          "div"
        );


      element.className =

        earned

          ? "badge earned"

          : "badge";


      element.innerHTML =

        "<div class='badgeIcon'>" +

        (

          earned
            ? icon
            : "🔒"

        ) +

        "</div>" +

        "<b>" +

        name +

        "</b>";


      container.appendChild(
        element
      );

    }

  );

}


/*
ADD QUEST OBJECTIVE INPUT

The text is entered by
the USER.
*/

function addQuestObjectiveInput() {

  const row =
    document.createElement(
      "div"
    );


  row.className =
    "objectiveInput";


  const input =
    document.createElement(
      "input"
    );


  input.maxLength =
    200;


  input.placeholder =
    "Write your objective";


  const remove =
    document.createElement(
      "button"
    );


  remove.type =
    "button";


  remove.textContent =
    "×";


  remove.addEventListener(

    "click",

    () => {

      row.remove();

    }

  );


  row.append(

    input,

    remove

  );


  $("questObjectiveList")
    .appendChild(
      row
    );

}


/*
RESET QUEST FORM

This DOES NOT create
a quest.

It only clears the
input form.
*/

function resetQuestForm() {

  $("questName")
    .value = "";


  $("questDescription")
    .value = "";


  $("difficulty")
    .value =
    "medium";


  $("questObjectiveList")
    .innerHTML =
    "";

}


/*
CREATE QUEST
*/

$("saveQuest")
  .addEventListener(

    "click",

    () => {

      const name =

        $("questName")
          .value
          .trim();


      const description =

        $("questDescription")
          .value
          .trim();


      const inputs =

        Array.from(

          $("questObjectiveList")
            .querySelectorAll(
              "input"
            )

        );


      /*
      ONLY USER-WRITTEN OBJECTIVES
      */

      const objectives =

        inputs

          .map(

            input =>
              input.value.trim()

          )

          .filter(

            text =>
              text.length > 0

          )

          .map(

            text => ({

              id:
                createID(),

              text,

              done:
                false

            })

          );


      if (

        !name ||

        objectives.length === 0

      ) {

        showToast(

          "Enter your quest name and at least one objective."

        );


        return;

      }


      state.quests.push({

        id:
          createID(),

        /*
        USER-WRITTEN
        */

        name,

        /*
        USER-WRITTEN
        */

        description,

        difficulty:

          $("difficulty")
            .value,

        objectives,

        done:
          false

      });


      saveState();

      render();

      closeModal(
        "questModal"
      );


      showToast(
        "Quest created"
      );

    }

  );


/*
CREATE STANDALONE OBJECTIVE
*/

$("saveObjective")
  .addEventListener(

    "click",

    () => {

      const text =

        $("standaloneText")
          .value
          .trim();


      if (!text) {

        showToast(

          "Enter your objective."

        );


        return;

      }


      state.standalone.push({

        id:
          createID(),

        /*
        USER-WRITTEN
        */

        text,

        xp:

          Number(

            $("objectiveXP")
              .value

          ),

        done:
          false

      });


      saveState();

      render();

      closeModal(
        "objectiveModal"
      );


      showToast(
        "Objective created"
      );

    }

  );


/*
OPEN QUEST MODAL
*/

function openQuestCreator() {

  resetQuestForm();

  openModal(
    "questModal"
  );

}


/*
OPEN OBJECTIVE MODAL
*/

function openObjectiveCreator() {

  $("standaloneText")
    .value = "";


  $("objectiveXP")
    .value =
    "50";


  openModal(
    "objectiveModal"
  );

}


$("newQuestButton")
  .addEventListener(

    "click",

    openQuestCreator

  );


$("firstQuestButton")
  .addEventListener(

    "click",

    openQuestCreator

  );


$("newObjectiveButton")
  .addEventListener(

    "click",

    openObjectiveCreator

  );


$("firstObjectiveButton")
  .addEventListener(

    "click",

    openObjectiveCreator

  );


/*
MODAL BUTTONS
*/

$("settingsButton")
  .addEventListener(

    "click",

    () =>
      openModal(
        "settingsModal"
      )

  );


$("closeSettings")
  .addEventListener(

    "click",

    () =>
      closeModal(
        "settingsModal"
      )

  );


$("closeQuest")
  .addEventListener(

    "click",

    () =>
      closeModal(
        "questModal"
      )

  );


$("cancelQuest")
  .addEventListener(

    "click",

    () =>
      closeModal(
        "questModal"
      )

  );


$("closeObjective")
  .addEventListener(

    "click",

    () =>
      closeModal(
        "objectiveModal"
      )

  );


$("cancelObjective")
  .addEventListener(

    "click",

    () =>
      closeModal(
        "objectiveModal"
      )

  );


$("addQuestObjective")
  .addEventListener(

    "click",

    addQuestObjectiveInput

  );


/*
PRESET THEMES
*/

const presetContainer =
  $("presets");


Object.entries(
  PRESETS
)
.forEach(

  ([name, theme]) => {

    const button =
      document.createElement(
        "button"
      );


    button.type =
      "button";


    button.textContent =
      name;


    button.addEventListener(

      "click",

      () => {

        state.settings = {

          ...theme

        };


        saveState();

        render();


        showToast(

          name +

          " theme applied"

        );

      }

    );


    presetContainer.appendChild(
      button
    );

  }

);


/*
CUSTOM COLORS
*/

const colorMap = {

  bgColor:
    "bg",

  cardColor:
    "card",

  textColor:
    "text",

  accentColor:
    "accent"

};


Object.entries(
  colorMap
)
.forEach(

  ([elementID, setting]) => {

    $(elementID)
      .addEventListener(

        "input",

        event => {

          state.settings[
            setting
          ] =
            event.target.value;


          saveState();

          applyTheme();

        }

      );

  }

);


/*
FONT
*/

$("font")
  .addEventListener(

    "change",

    event => {

      state.settings.font =

        event.target.value;


      saveState();

      applyTheme();

    }

  );


/*
EXPORT SAVE
*/

$("exportData")
  .addEventListener(

    "click",

    () => {

      const data =

        JSON.stringify(

          state,

          null,

          2

        );


      const blob =

        new Blob(

          [data],

          {

            type:
              "application/json"

          }

        );


      const url =

        URL.createObjectURL(
          blob
        );


      const link =
        document.createElement(
          "a"
        );


      link.href =
        url;


      link.download =

        "real-life-quest-save.json";


      link.click();


      URL.revokeObjectURL(
        url
      );

    }

  );


/*
IMPORT SAVE
*/

$("importData")
  .addEventListener(

    "click",

    () => {

      $("importFile")
        .click();

    }

  );


$("importFile")
  .addEventListener(

    "change",

    event => {

      const file =
        event.target.files[0];


      if (!file) {

        return;

      }


      const reader =
        new FileReader();


      reader.onload =

        () => {

          try {

            const imported =

              JSON.parse(

                reader.result

              );


            if (

              !Array.isArray(
                imported.quests
              )

              ||

              !Array.isArray(
                imported.standalone
              )

            ) {

              throw new Error(
                "Invalid save"
              );

            }


            state =
              imported;


            saveState();

            render();


            showToast(
              "Save imported"
            );

          }

          catch {

            showToast(

              "Invalid save file"

            );

          }

        };


      reader.readAsText(
        file
      );


      event.target.value =
        "";

    }

  );


/*
DELETE EVERYTHING
*/

$("resetData")
  .addEventListener(

    "click",

    () => {

      if (

        confirm(

          "Delete ALL quests, objectives, XP, badges and settings?"

        )

      ) {

        state =
          createFreshState();


        saveState();

        render();


        showToast(

          "All data deleted"

        );

      }

    }

  );


/*
ESCAPE CLOSES MODALS
*/

document.addEventListener(

  "keydown",

  event => {

    if (

      event.key ===
      "Escape"

    ) {

      closeModal(
        "questModal"
      );

      closeModal(
        "objectiveModal"
      );

      closeModal(
        "settingsModal"
      );

    }

  }

);


/*
INITIALIZE

IMPORTANT:

This creates ZERO quests
and ZERO objectives.
*/

render();
