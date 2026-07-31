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

const addComboButtons = document.querySelectorAll(".add-combo-button");
const viewComboTemplate = document.getElementById("view-combo-template");
const editComboTemplate = document.getElementById("edit-combo-template");

/* 技一覧パネル */

const addMoveButtons = document.querySelectorAll(".add-move-button");
const moveSelectorPanel = document.getElementById("move-selector-panel");
const moveSelectorList = document.querySelector(".move-selector-list");
const closeMoveSelectorButton = document.getElementById("close-move-selector-button");
const moveCategoryButtons = document.querySelectorAll(".move-selector-tabs button");

/* =========================
   表示モード
========================= */

// 表記モードの初期表示
let commandMode = true;

// 現在編集中のコンボカード
let editingComboItem = null;

// 編集中の状態
let currentMoves = [];
let currentMemo = "";

// 編集開始時の状態
let originalMoves = [];
let originalMemo = "";

// 技一覧タブの初期表示
let currentCategory = "normal";

/* =========================
   関数
========================= */

/* ---------- details ---------- */

function syncDetailsState(source, target) {

    source.forEach((detail, index) => {

        target[index].open = detail.open;

    });

}

/* ---------- 表示切替 ---------- */

function toggleDisplayMode() {

    commandMode = !commandMode;

    const comboTexts = document.querySelectorAll(".combo-text");

    comboTexts.forEach(combo => {

        combo.textContent = commandMode
            ? combo.dataset.command
            : combo.dataset.name;

    });

}

/* ---------- メモ ---------- */

function adjustTextareaHeight(textarea) {

    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";

}

/* ---------- コンボ編集 ---------- */

// コンボ編集開始
function startComboEdit(comboItem) {

    // どのコンボへ技を追加するか覚えておく
    editingComboItem = comboItem;

    currentMoves = JSON.parse(comboItem.dataset.moves);

    originalMoves = [...currentMoves];

    currentMemo = comboItem.dataset.memo;

    originalMemo = currentMemo;

    comboItem.classList.add("editing");

    const textarea = comboItem.querySelector("textarea");

    textarea.value = currentMemo;

    adjustTextareaHeight(textarea);

}

/* カード作成 */

// 閲覧モードのコンボカードを作成
function createViewComboCard(combo) {

    const comboItem = viewComboTemplate.content.firstElementChild.cloneNode(true);

    setupComboDataset(comboItem, combo);

    setupComboTexts(comboItem, combo);

    comboItem.querySelector(".memo-text").textContent = combo.memo;

    return comboItem;

}

// 編集モードのコンボカードを作成
function createEditComboCard(combo) {

    const comboItem = editComboTemplate.content.firstElementChild.cloneNode(true);

    setupComboDataset(comboItem, combo);

    setupComboTexts(comboItem, combo);

    comboItem.querySelector("textarea").value = combo.memo;

    comboItem
        .querySelector(".memo-text")
        .textContent = combo.memo;

    return comboItem;

}

// 閲覧モードにコンボカードを追加
function addViewComboCard(newCombo) {

    const comboLists = document.querySelectorAll("#view-mode .combo-list");

    const comboList = comboLists[comboLists.length - 1];

    const comboItem = createViewComboCard(newCombo);

    comboList.appendChild(comboItem);

}

// 編集モードにコンボカードを追加
function addEditComboCard(combo) {

    const comboList = document.querySelector("#edit-mode .combo-list");

    const comboCard = createEditComboCard(combo);

    setupEditComboCardEvents(comboCard);

    const addButton = comboList.querySelector(".add-combo-button");

    comboList.insertBefore(comboCard, addButton);

    return comboCard;

}

/* カード編集 */

// Undo
function undoLastMove() {

    if (currentMoves.length === 0) return;

    currentMoves.pop();

    editingComboItem.dataset.moves = JSON.stringify(currentMoves);

    updateComboDisplay();

}

// 編集完了
function finishComboEdit() {

    const textarea = editingComboItem.querySelector("textarea");

    currentMemo = textarea.value;

    fetch(window.location.pathname, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            id: editingComboItem.dataset.comboId,

            moves: currentMoves,

            memo: currentMemo

        })

    })
    .then(response => response.json())
    .then(result => {

        // 編集モード側
        editingComboItem.dataset.memo = currentMemo;

        const editMemoText = editingComboItem.querySelector(".memo-text");

        if (editMemoText) {
            editMemoText.textContent = currentMemo;
        }

        // 閲覧モード側
        const comboId = editingComboItem.dataset.comboId;

        const viewComboItem = document.querySelector(
            `#view-mode .combo-item[data-combo-id="${comboId}"]`
        );

        if (viewComboItem) {

            viewComboItem.dataset.memo = currentMemo;

            const viewMemoText = viewComboItem.querySelector(".memo-text");

            if (viewMemoText) {
                viewMemoText.textContent = currentMemo;
            }

        }

        editingComboItem.classList.remove("editing");

        editingComboItem = null;

        closeMoveSelectorPanel();

    })
    .catch(error => {

        console.error(error);

        alert("保存に失敗しました。");

    });

}

// 編集キャンセル
function cancelComboEdit() {

    currentMoves = [...originalMoves];

    editingComboItem.dataset.memo = originalMemo;

    const memoText = editingComboItem.querySelector(".memo-text");
    memoText.textContent = originalMemo;

    updateComboDisplay();

    editingComboItem.classList.remove("editing");

    closeMoveSelectorPanel();

}

/* 共通処理 */

// コンボカードのデータセットを設定
function setupComboDataset(comboItem, combo) {

    comboItem.dataset.comboId = combo.id;
    comboItem.dataset.moves = JSON.stringify(combo.moves);
    comboItem.dataset.memo = combo.memo;

}

// コンボカードの表示文字列を設定
function setupComboTexts(comboItem, combo) {

    const comboTexts = comboItem.querySelectorAll(".combo-text");

    const commandText = buildComboText(combo.moves, "command");

    const nameText = buildComboText(combo.moves, "name");

    comboTexts.forEach(comboText => {

        comboText.dataset.command = commandText;
        comboText.dataset.name = nameText;

        comboText.textContent =
            commandMode
                ? commandText
                : nameText;

    });

}

// コンボ表示文字列作成
function buildComboText(moves, type) {

    return moves.map(moveId => {

        const move = moveData.find(move => move.id === moveId);

        return move[type];

    }).join(" ⏵ ");

}

/* データ更新 */

// コンボ表示更新
function updateComboDisplay() {

    editingComboItem.dataset.moves = JSON.stringify(currentMoves);

    const comboTexts = editingComboItem.querySelectorAll(".combo-text");

    const comboId = editingComboItem.dataset.comboId;

    const viewComboItem = document.querySelector(
        '#view-mode .combo-item[data-combo-id="' + comboId + '"]'
    );

    const commandText = buildComboText(currentMoves, "command");

    const nameText = buildComboText(currentMoves, "name");

    comboTexts.forEach(comboText => {

        comboText.dataset.command = commandText;

        comboText.dataset.name = nameText;

        comboText.textContent = commandMode
            ? commandText
            : nameText;

    });

    if (viewComboItem) {

        const viewComboText = viewComboItem.querySelector(".combo-text");

        viewComboText.dataset.command = commandText;
        viewComboText.dataset.name = nameText;

        viewComboText.textContent = commandMode
            ? commandText
            : nameText;

        const viewMemoText = viewComboItem.querySelector(".memo-text");

        viewMemoText.textContent = currentMemo;

        viewComboItem.dataset.memo = currentMemo;
        viewComboItem.dataset.moves = JSON.stringify(currentMoves);

    }

}


// コンボ削除
async function deleteCombo(comboItem) {

    const comboId = comboItem.dataset.comboId;

    const response = await fetch(
        window.location.pathname + "/delete-combo",
        {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                id: comboId

            })

        }
    );

    const result = await response.json();

    if (!result.success) {

        alert("削除に失敗しました。");

        return;

    }

    // 編集モード側
    comboItem.remove();

    // 閲覧モード側
    const viewComboItem = document.querySelector(
        `#view-mode .combo-item[data-combo-id="${comboId}"]`
    );

    if (viewComboItem) {

        viewComboItem.remove();

    }

}

// コンボ追加
async function createNewCombo() {

    const response = await fetch(
        window.location.pathname + "/new-combo",
        {
            method: "POST"
        }
    );

    const combo = await response.json();

    addViewComboCard(combo);

    const newComboItem = addEditComboCard(combo);

    startComboEdit(newComboItem);

    openMoveSelectorPanel();

}

// コンボの並び順を保存
function saveComboOrder(comboList) {

    const comboItems = comboList.querySelectorAll(".combo-item");

    const comboOrder = [];

    comboItems.forEach(comboItem => {

        comboOrder.push(comboItem.dataset.comboId);

    });

    fetch(window.location.pathname + "/sort-combos", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            comboOrder: comboOrder

        })

    })
    .then(response => response.json())
    .catch(error => {

        console.error(error);

    });

}

// コンボの並び順を同期
function syncViewComboOrder(comboList) {

    const comboItems = comboList.querySelectorAll(".combo-item");

    const comboOrder = [];

    comboItems.forEach(comboItem => {

        comboOrder.push(comboItem.dataset.comboId);

    });

    const viewComboList = document.querySelector("#view-mode .combo-list");

    comboOrder.forEach(comboId => {

        const viewComboItem = viewComboList.querySelector(

            `.combo-item[data-combo-id="${comboId}"]`

        );

        if (viewComboItem) {

            viewComboList.appendChild(viewComboItem);

        }

    });

}

/* ---------- 技一覧パネル ---------- */

// 技一覧パネルを開く
function openMoveSelectorPanel() {

    renderMoveSelectorList();

    moveSelectorPanel.style.display = "block";

}

// 技一覧パネルを閉じる
function closeMoveSelectorPanel() {

    moveSelectorPanel.style.display = "none";

}

// 技一覧表示
function renderMoveSelectorList() {

    moveSelectorList.innerHTML = "";

    moveData
        .filter(move => move.category === currentCategory)
        .forEach(move => {

        const button = document.createElement("button");

        button.textContent = move.command;

        button.addEventListener("click", function () {

            addMove(move.id);

        });

        moveSelectorList.appendChild(button);

    });

}

// 技追加
function addMove(moveId) {

    currentMoves.push(moveId);

    updateComboDisplay();

}

/* ---------- 見出し編集 ---------- */

/* 共通処理 */

// 編集モードの最後の大見出しを取得
function getLastMainGroup() {

    const groups = document.querySelectorAll(
        "#edit-mode .main-group"
    );

    return groups[groups.length - 1];

}

/* ---------- イベント登録 ---------- */

// コンボカードイベント設定
function setupEditComboCardEvents(comboItem) {

    comboItem
        .querySelector(".combo-edit-button")
        .addEventListener("click", function () {

            startComboEdit(comboItem);

        });

    comboItem
        .querySelector(".add-move-button")
        .addEventListener("click", function () {

            openMoveSelectorPanel();

        });

    comboItem
        .querySelector(".combo-undo-button")
        .addEventListener("click", function () {

            undoLastMove();

        });

    comboItem
        .querySelector(".combo-complete-button")
        .addEventListener("click", function () {

            finishComboEdit();

        });

    comboItem
        .querySelector(".combo-cancel-button")
        .addEventListener("click", function () {

            cancelComboEdit();

        });

    comboItem
        .querySelector(".delete-button")
        .addEventListener("click", function () {

            if (!confirm("このコンボを削除しますか？")) {
                return;
            }

            deleteCombo(comboItem);

        });
    // メモ自動伸縮
    const textarea = comboItem.querySelector("textarea");

    textarea.addEventListener("input", function () {

        adjustTextareaHeight(this);

        comboItem.querySelector(".memo-text").textContent = this.value;

    });

}

// イベント登録
function registerEvents() {

    /* モード切替 */

    editModeButton.addEventListener("click", function () {

        syncDetailsState(viewDetails, editDetails);

        viewMode.style.display = "none";
        editMode.style.display = "block";

        memoTextareas.forEach(adjustTextareaHeight);

    });

    completeModeButton.addEventListener("click", function () {

        if (editingComboItem) {

            finishComboEdit();

        }

        syncDetailsState(editDetails, viewDetails);

        editMode.style.display = "none";
        viewMode.style.display = "block";

    });

    /* 表示切替 */

    viewDisplayButton.addEventListener(
        "click",
        toggleDisplayMode
    );

    editDisplayButton.addEventListener(
        "click",
        toggleDisplayMode
    );

    /* コンボ編集 */

    //コンボカードイベント登録
    document.querySelectorAll("#edit-mode .combo-item").forEach(comboItem => {

        setupEditComboCardEvents(comboItem);

    });

    //コンボ追加
    addComboButtons.forEach(button => {

        button.addEventListener("click", function () {

            createNewCombo();

        });

    });

    //コンボ並び替え
    const comboLists = document.querySelectorAll("#edit-mode .combo-list");

    comboLists.forEach(comboList => {

        new Sortable(comboList, {

            animation: 150,

            draggable: ".combo-item",

            onEnd: function () {

                saveComboOrder(comboList);

                syncViewComboOrder(comboList);

            }

        });

    });

    /* 技一覧パネル */

    //パネルを閉じる
    closeMoveSelectorButton.addEventListener(
        "click",
        closeMoveSelectorPanel
    );

    //技一覧タブ
    moveCategoryButtons.forEach(button => {

        button.addEventListener("click", function () {

            currentCategory = this.dataset.category;

            renderMoveSelectorList();

        });

    });

}

/* =========================
   イベント登録
========================= */

registerEvents();
