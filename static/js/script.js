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
const comboCancelButtons = document.querySelectorAll(".combo-cancel-button");

/* 技一覧パネル */

const addMoveButtons = document.querySelectorAll(".add-move-button");
const moveSelectorPanel = document.getElementById("move-selector-panel");
const moveSelectorList = document.querySelector(".move-selector-list");
const closeMoveSelectorButton = document.getElementById("close-move-selector-button");


/* =========================
   表示モード
========================= */

let commandMode = true;

// 現在編集中のコンボカード
let currentComboItem = null;

// 編集中の状態
let currentMoves = [];

// 編集開始時の状態
let originalMoves = [];

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

    // どのコンボへ技を追加するか覚えておく
    currentComboItem = comboItem

    currentMoves = JSON.parse(comboItem.dataset.moves);

    originalMoves = [...currentMoves];

    comboItem.classList.add("editing");

    const textarea = comboItem.querySelector("textarea");

    adjustTextareaHeight(textarea);

}

function undoLastMove() {

    currentMoves.pop();

    currentComboItem.dataset.moves = JSON.stringify(currentMoves);

    updateComboDisplay();

}

function finishComboEdit(comboItem) {

    originalMoves = [...currentMoves];

    comboItem.classList.remove("editing");

    closeMoveSelectorPanel();

}

function cancelComboEdit(comboItem) {

    currentMoves = [...originalMoves];

    updateComboDisplay();

    comboItem.classList.remove("editing");

    closeMoveSelectorPanel();

}

/* 技一覧パネル */

function openMoveSelectorPanel(comboItem) {

    renderMoveSelectorList();

    moveSelectorPanel.style.display = "block";

}

function closeMoveSelectorPanel() {

    currentComboItem = null;

    moveSelectorPanel.style.display = "none";

}

function addMove(moveId) {

    currentMoves.push(moveId);

    updateComboDisplay();

}

function renderMoveSelectorList() {

    moveSelectorList.innerHTML = "";

    moveData.forEach(move => {

        const button = document.createElement("button");

        button.textContent = move.command;

        button.addEventListener("click", function () {

            addMove(move.id);

        });

        moveSelectorList.appendChild(button);

    });

}

function updateComboDisplay() {

    currentComboItem.dataset.moves = JSON.stringify(currentMoves);

    const comboTexts = currentComboItem.querySelectorAll(".combo-text");

    const displayText = currentMoves.map(moveId => {

        const move = moveData.find(move => move.id === moveId);

        return commandMode
            ? move.command
            : move.name;

    });

    comboTexts.forEach(comboText => {

        comboText.textContent = displayText.join(" ⏵ ");

    });

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

/* Undo */

comboUndoButtons.forEach(button => {

    button.addEventListener("click", function () {

        undoLastMove();

    });

});

/* 編集完了 */

comboCompleteButtons.forEach(button => {

    button.addEventListener("click", function () {

        const comboItem = this.closest(".combo-item");

        finishComboEdit(comboItem);

    });

});

/* 編集キャンセル */

comboCancelButtons.forEach(button => {

    button.addEventListener("click", function () {

        const comboItem = this.closest(".combo-item");

        cancelComboEdit(comboItem);

    });

});

/* =========================
   技一覧パネル
========================= */

/* パネルを開く */

addMoveButtons.forEach(button => {

    button.addEventListener("click", function () {

        const comboItem = this.closest(".combo-item");

        openMoveSelectorPanel(comboItem);

    });

});

/* パネルを閉じる */

closeMoveSelectorButton.addEventListener(
    "click",
    closeMoveSelectorPanel
);