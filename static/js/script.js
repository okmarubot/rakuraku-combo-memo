/* テストコード */
console.log("script.js が読み込まれました");

/* =========================
   要素の取得
========================= */

const viewMode = document.getElementById("view-mode");
const editMode = document.getElementById("edit-mode");

const editModeButton = document.getElementById("edit-mode-button");
const completeModeButton = document.getElementById("complete-mode-button");

const viewDisplayButton = document.getElementById("view-display-button");
const editDisplayButton = document.getElementById("edit-display-button");

const viewDetails = document.querySelectorAll("#view-mode details");
const editDetails = document.querySelectorAll("#edit-mode details");

const memoTextareas = document.querySelectorAll(".combo-memo-edit textarea");

/* =========================
   表示モード
========================= */

let commandMode = true;

/* =========================
   関数
========================= */

function syncDetailsState(source, target) {

    source.forEach((detail, index) => {

        target[index].open = detail.open;

    });

}

function toggleDisplayMode() {

    commandMode = !commandMode;

    const comboTexts =
        document.querySelectorAll(".combo-text");

    comboTexts.forEach(combo => {

        combo.textContent = commandMode
            ? combo.dataset.command
            : combo.dataset.name;

    });

}

function adjustTextareaHeight(textarea) {

    textarea.style.height = "auto";

    textarea.style.height = textarea.scrollHeight + "px";

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

memoTextareas.forEach(textarea => {

    textarea.addEventListener("input", function () {

        adjustTextareaHeight(this);

    });

});