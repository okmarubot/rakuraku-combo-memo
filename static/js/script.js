/* テストコード */
console.log("script.js が読み込まれました");

/* =========================
   要素の取得
========================= */

/* モード */

const viewMode = document.getElementById("view-mode");
const editMode = document.getElementById("edit-mode");

const editModeButton = document.getElementById("edit-mode-button");
const completeModeButton = document.getElementById("complete-mode-button");

/* 表示切替 */

const viewDisplayButton = document.getElementById("view-display-button");
const editDisplayButton = document.getElementById("edit-display-button");

/* details */

const viewDetails = document.querySelectorAll("#view-mode details");
const editDetails = document.querySelectorAll("#edit-mode details");

/* メモ */

const memoTextareas = document.querySelectorAll(".combo-edit textarea");
const memoTexts = document.querySelectorAll(".memo-text");

/* コンボ編集 */

const comboItems = document.querySelectorAll(".combo-item");

const comboEditButtons = document.querySelectorAll(".combo-edit-button");
const comboCompleteButtons = document.querySelectorAll(".combo-complete-button");
const comboUndoButtons = document.querySelectorAll(".combo-undo-button");

/* =========================
   表示モード
========================= */

let commandMode = true;

/* =========================
   関数
========================= */

/* details */

function syncDetailsState(source, target) {

    source.forEach((detail, index) => {

        target[index].open = detail.open;

    });

}

/* 表示切替 */

function toggleDisplayMode() {

    commandMode = !commandMode;

    const comboTexts = document.querySelectorAll(".combo-text");

    comboTexts.forEach(combo => {

        combo.textContent = commandMode
            ? combo.dataset.command
            : combo.dataset.name;

    });

}

/* メモ */

function adjustTextareaHeight(textarea) {

    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";

}

/* コンボ編集 */

function startComboEdit(comboItem) {

    comboItem.classList.add("editing");

    const textarea = comboItem.querySelector("textarea");

    adjustTextareaHeight(textarea);

}

function finishComboEdit(comboItem) {

    comboItem.classList.remove("editing");

}

function undoLastMove(comboItem) {

    console.log("Undo");

}

/* =========================
   モード切替
========================= */

editModeButton.addEventListener("click", function () {

    syncDetailsState(viewDetails, editDetails);

    viewMode.style.display = "none";
    editMode.style.display = "block";
    
    memoTextareas.forEach(adjustTextareaHeight);

});

completeModeButton.addEventListener("click", function () {

    syncDetailsState(editDetails, viewDetails);

    editMode.style.display = "none";
    viewMode.style.display = "block";

});

/* =========================
   表示切替
========================= */

viewDisplayButton.addEventListener(
    "click",
    toggleDisplayMode
);

editDisplayButton.addEventListener(
    "click",
    toggleDisplayMode
);

/* =========================
   メモ欄
========================= */

memoTextareas.forEach((textarea, index) => {

    textarea.addEventListener("input", function () {

        adjustTextareaHeight(this);

        memoTexts[index].textContent = this.value;

    });

});

/* =========================
   コンボ編集
========================= */

/* 編集開始 */

comboEditButtons.forEach(button => {

    button.addEventListener("click", function () {

        const comboItem = this.closest(".combo-item");

        startComboEdit(comboItem);

    });

});

/* 編集完了 */

comboCompleteButtons.forEach(button => {

    button.addEventListener("click", function () {

        const comboItem = this.closest(".combo-item");

        finishComboEdit(comboItem);

    });

});

/* Undo */

comboUndoButtons.forEach(button => {

    button.addEventListener("click", function () {

        const comboItem = this.closest(".combo-item");

        undoLastMove(comboItem);

    });

});