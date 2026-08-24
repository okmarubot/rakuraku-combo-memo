/* =========================
   要素の取得
========================= */

/* 閲覧/編集モード */

const viewMode = document.getElementById("view-mode");
const editMode = document.getElementById("edit-mode");

const editModeButton = document.getElementById("edit-mode-button");
const completeModeButton = document.getElementById("complete-mode-button");

/* 表記モード切替 */

const viewDisplayButton = document.getElementById("view-display-button");
const editDisplayButton = document.getElementById("edit-display-button");

/* 操作モード切替 */

const modeSelectors = document.querySelectorAll(".mode-selector-select");

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
const moveTabIndicator = document.querySelector(".move-tab-indicator");

/* 見出し編集 */
const viewMainGroupTemplate = document.getElementById("view-main-group-template");
const editMainGroupTemplate = document.getElementById("edit-main-group-template");

const viewSubGroupTemplate = document.getElementById("view-sub-group-template");
const editSubGroupTemplate = document.getElementById("edit-sub-group-template");

/* =========================
   表示モード
========================= */

// 表記モードの初期表示
let commandMode = true;

// 現在の操作モード
const currentMode = document.body.dataset.mode;

// 現在編集中のコンボカード
let editingComboItem = null;

// コンボカード編集中の状態
let currentMoves = [];
let currentMemo = "";

// コンボカード編集開始時の状態
let originalMoves = [];
let originalMemo = "";

// 技一覧タブの初期表示
let currentCategory = "normal";

// 現在編集中の大見出し
let editingMainGroup = null;

// 大見出し編集開始時の状態
let originalMainGroupTitle = "";

// 現在編集中の中見出し
let editingSubGroup = null;

// 中見出し編集開始時の状態
let originalSubGroupTitle = "";

/* =========================
   関数
========================= */

/* ---------- URL取得 ---------- */

// 現在のページURLにmodeを維持したパスを作る
function getModeUrl(path) {

    return path + window.location.search;

}

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

    if (moveSelectorPanel.style.display !== "none") {
        renderMoveSelectorList();
    }

}

/* ---------- 操作モード管理 ---------- */

// Classic / Modernを切り替える
function switchMode(mode) {

    const url = new URL(window.location.href);

    if (mode === "modern") {

        url.searchParams.set("mode", "modern");

    } else {

        url.searchParams.delete("mode");

    }

    window.location.href = url.toString();

}

/* ---------- メモ ---------- */

function adjustTextareaHeight(textarea) {

    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";

}

/* ---------- コンボ編集 ---------- */

// コンボ編集開始
async function startComboEdit(comboItem) {

    // 別のコンボカードが編集中なら、先に編集完了する
    if (editingComboItem && editingComboItem !== comboItem) {

        const success = await finishComboEdit();

        if (!success) {
            return;
        }

    }

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
function addViewComboCard(newCombo, subGroup) {

    const subgroupId = subGroup.dataset.subgroupId;

    const viewSubGroup = document.querySelector(`#view-mode .sub-group[data-subgroup-id="${subgroupId}"]`);

    const comboList = viewSubGroup.querySelector(".combo-list");

    const comboItem = createViewComboCard(newCombo);

    comboList.appendChild(comboItem);

}

// 編集モードにコンボカードを追加
function addEditComboCard(combo, subGroup) {

    const comboList = subGroup.querySelector(".combo-list");

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
async function finishComboEdit() {

    const textarea = editingComboItem.querySelector("textarea");

    currentMemo = textarea.value;

    try {

        const response = await fetch(getModeUrl(window.location.pathname), {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                id: editingComboItem.dataset.comboId,

                moves: currentMoves,

                memo: currentMemo

            })

        });

        const result = await response.json();

        if (!result.success) {

            throw new Error("保存に失敗しました。");

        }

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

        return true;

    }
    catch (error) {

        console.error(error);

        alert("保存に失敗しました。");

        return false;

    }

}

// 編集キャンセル
function cancelComboEdit() {

    // 編集開始前の状態に戻す
    currentMoves = [...originalMoves];
    currentMemo = originalMemo;

    // 編集モード側のデータを元に戻す
    editingComboItem.dataset.memo = originalMemo;

    // 編集モード側の表示を元に戻す
    const memoText = editingComboItem.querySelector(".memo-text");

    if (memoText) {
        memoText.textContent = originalMemo;
    }

    // textareaのメモを元に戻す
    const textarea = editingComboItem.querySelector("textarea");

    if (textarea) {
        textarea.value = originalMemo;
        adjustTextareaHeight(textarea);
    }

    // コンボ表示を元に戻す
    updateComboDisplay();

    // 編集中状態を解除
    editingComboItem.classList.remove("editing");

    // 編集対象を解除
    editingComboItem = null;

    // 技一覧パネルを閉じる
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

// 技IDから技データを取得する
function findMoveById(moveId) {

    // 通常の技を検索
    const normalMove = moveData.find(move => move.id === moveId);

    if (normalMove) {
        return normalMove;
    }

    // variants内を検索
    for (const move of moveData) {

        if (!move.variants) {
            continue;
        }

        const variant = move.variants.find(variant => variant.id === moveId);

        if (variant) {
            return variant;
        }
    }

    return undefined;
}

function buildComboText(moves, displayType) {

    return moves
        .map(moveId => {

            const move = findMoveById(moveId);

            if (!move) {
                console.warn("技データが見つかりません:", moveId)
                return "";
            }

            return move[displayType];

        })
        .filter(text => text !== "")
        .join(" ⏵ ")
}

/* コンボデータ更新 */

// コンボ表示更新
function updateComboDisplay() {

    editingComboItem.dataset.moves = JSON.stringify(currentMoves);

    const comboTexts = editingComboItem.querySelectorAll(".combo-text");

    const comboId = editingComboItem.dataset.comboId;

    const viewComboItem = document.querySelector('#view-mode .combo-item[data-combo-id="' + comboId + '"]');

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
        getModeUrl(window.location.pathname + "/delete-combo"),
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
async function createNewCombo(subGroup) {

    const groupId = subGroup.closest(".main-group").dataset.groupId;
    const subgroupId = subGroup.dataset.subgroupId;

    const response = await fetch(
        getModeUrl(window.location.pathname + "/new-combo"),
        {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                groupId: groupId,
                subgroupId: subgroupId

            })

        }
    );

    const combo = await response.json();

    addViewComboCard(combo, subGroup);

    const newComboItem = addEditComboCard(combo, subGroup);

    await startComboEdit(newComboItem);

    openMoveSelectorPanel(newComboItem);

}

// コンボの並び順を保存
function saveComboOrder(comboList) {

    const comboItems = comboList.querySelectorAll(".combo-item");

    const comboOrder = [];

    comboItems.forEach(comboItem => {

        comboOrder.push(comboItem.dataset.comboId);

    });

    const subGroup = comboList.closest(".sub-group");
    const mainGroup = subGroup.closest(".main-group");

    const groupId = mainGroup.dataset.groupId;
    const subgroupId = subGroup.dataset.subgroupId;

    fetch(getModeUrl(window.location.pathname + "/sort-combos"), {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            groupId: groupId,
            subgroupId: subgroupId,
            comboOrder: comboOrder

        })

    })
    .then(response => response.json())
    .then(result => {

        if (!result.success) {

            alert("コンボの並び順保存に失敗しました。");

        }

    })
    .catch(error => {

        console.error(error);

    });

}

// コンボの並び順を同期
function syncViewComboOrder(comboList) {

    // 並び替えたコンボが所属している中見出しを取得
    const subGroup = comboList.closest(".sub-group");

    if (!subGroup) {
        return;
    }

    // 中見出しのIDを取得
    const subgroupId = subGroup.dataset.subgroupId;

    // 閲覧モード側の同じ中見出しを取得
    const viewSubGroup = document.querySelector(
        `#view-mode .sub-group[data-subgroup-id="${subgroupId}"]`
    );

    if (!viewSubGroup) {
        return;
    }

    // 閲覧モード側のコンボ一覧を取得
    const viewComboList = viewSubGroup.querySelector(".combo-list");

    if (!viewComboList) {
        return;
    }

    // 編集モード側のコンボの並び順を取得
    const comboItems = comboList.querySelectorAll(".combo-item");

    const comboOrder = [];

    comboItems.forEach(comboItem => {

        comboOrder.push(comboItem.dataset.comboId);

    });

    // 閲覧モード側の同じ中見出し内で並び替える
    comboOrder.forEach(comboId => {

        const viewComboItem = viewSubGroup.querySelector(
            `.combo-item[data-combo-id="${comboId}"]`
        );

        if (viewComboItem) {

            viewComboList.appendChild(viewComboItem);

        }

    });

}

/* ---------- 技一覧パネル ---------- */

// 技一覧パネルを開く
function openMoveSelectorPanel(targetComboItem) {

    renderMoveSelectorList();

    // 技一覧のスクロール位置を先頭に戻す
    moveSelectorList.scrollTop = 0;

    document.body.classList.add("move-selector-open");

    updateMoveTabIndicator();

    if (targetComboItem) {

        const panelHeight = moveSelectorPanel.offsetHeight;
        const extraSpace = 20;

        const panelTop = window.innerHeight - panelHeight;

        const targetBottom = targetComboItem.getBoundingClientRect().bottom;

        const scrollAmount = targetBottom - (panelTop - extraSpace);

        window.scrollBy({
            top: scrollAmount,
            behavior: "smooth"
        });

    }

}

// 技一覧パネルを閉じる
function closeMoveSelectorPanel() {

    document.body.classList.remove("move-selector-open");

}

// 技一覧表示
function renderMoveSelectorList() {

    moveSelectorList.innerHTML = "";

    moveSelectorList.className = "move-selector-list " + `category-${currentCategory}`;

    const categoryMoves = moveData.filter(move => move.category === currentCategory);

    categoryMoves.forEach(move => {

        // variantsを持つ技
        if (move.variants && move.variants.length > 0) {

            const variantGroup = document.createElement("div");

            variantGroup.className = "move-variant-group";

            // 親技
            const parentButton = document.createElement("button");

            parentButton.className = "move-variant-parent";

            if (move.str) {
                parentButton.classList.add(`str-${move.str}`);
            }

            parentButton.textContent = commandMode
                ? move.command
                : move.name;

            // 開閉用
            const variantList = document.createElement("div");

            variantList.className = "move-variant-list";

            parentButton.addEventListener("click", function () {

                variantGroup.classList.toggle("open");

            });

            variantGroup.appendChild(parentButton);

            // 子技
            move.variants.forEach(variant => {

                const variantButton = document.createElement("button");

                variantButton.className = "move-variant-button";

                if (variant.str) {
                    variantButton.classList.add(`str-${variant.str}`);
                }

                variantButton.textContent = commandMode
                    ? variant.command
                    : variant.name;

                variantButton.addEventListener("click", function () {

                    addMove(variant.id);

                });

                variantList.appendChild(variantButton);

            });

            variantGroup.appendChild(variantList);

            moveSelectorList.appendChild(variantGroup);

            return;

        }

        // 通常の技
        const button = document.createElement("button");

        button.className = "move-selector-button";

        if (move.str) {
            button.classList.add(`str-${move.str}`);
        }

        button.textContent = commandMode
            ? move.command
            : move.name;

        button.addEventListener("click", function () {

            addMove(move.id);

        });

        moveSelectorList.appendChild(button);

    });

}

// 技一覧タブの下線を移動
function updateMoveTabIndicator() {

    const activeButton = document.querySelector(
        `.move-selector-tabs button[data-category="${currentCategory}"]`
    );

    if (!activeButton || !moveTabIndicator) {
        return;
    }

    moveTabIndicator.style.width = `${activeButton.offsetWidth}px`;
    moveTabIndicator.style.left = `${activeButton.offsetLeft}px`;

}

// 技追加
function addMove(moveId) {

    currentMoves.push(moveId);

    updateComboDisplay();

}

/* ---------- 大見出し編集 ---------- */

// 大見出し編集開始
async function startGroupEdit(mainGroup) {

    // 編集中の大見出しがある場合は完了
    if (editingMainGroup && editingMainGroup !== mainGroup) {

        const success = await finishGroupEdit();
    
        if (!success) {
            return;
        }

    }

    // どの大見出しを編集しているか覚えておく
    editingMainGroup = mainGroup;

    // 現在の見出しタイトルを取得
    const titleText = mainGroup.querySelector(".main-group-title-text");

    // 編集用inputを取得
    const titleInput = mainGroup.querySelector(".main-group-title-input");

    // 編集開始前のタイトルを保存
    originalMainGroupTitle = titleText.textContent;

    // 現在のタイトルをinputに入れる
    titleInput.value = titleText.textContent;

    // 編集中状態にする
    mainGroup.classList.add("editing");

}

/* 共通処理 */

// 編集モードの最後の大見出しを取得
function getLastMainGroup() {

    const groups = document.querySelectorAll("#edit-mode .main-group");

    return groups[groups.length - 1];

}

/* 大見出し編集 */

// 大見出し編集完了
async function finishGroupEdit() {

    const titleInput = editingMainGroup.querySelector(".main-group-title-input");

    const title = titleInput.value;

    const groupId = editingMainGroup.dataset.groupId;

    try {

        const response = await fetch(getModeUrl(window.location.pathname), {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                type: "main-group",
                id: groupId,
                title: title

            })

        });

        const result = await response.json();

        if (!result.success) {

            alert("保存に失敗しました。");

            return false;

        }

        // 編集モード側
        const editTitleText = editingMainGroup.querySelector(
            ".main-group-title-text"
        );

        editTitleText.textContent = title;

        // 閲覧モード側
        const viewMainGroup = document.querySelector(
            `#view-mode .main-group[data-group-id="${groupId}"]`
        );

        if (viewMainGroup) {

            const viewTitleText = viewMainGroup.querySelector(
                ".main-group-title-text"
            );

            viewTitleText.textContent = title;

        }

        // 編集中状態を解除
        editingMainGroup.classList.remove("editing");

        editingMainGroup = null;

        return true;

    }
    catch (error) {

        console.error(error);

        alert("保存に失敗しました。");

        return false;

    }

}

// 大見出し編集キャンセル
function cancelGroupEdit() {

    // 編集中の大見出しを元のタイトルに戻す
    const titleText = editingMainGroup.querySelector(".main-group-title-text");

    titleText.textContent = originalMainGroupTitle;

    // inputも元のタイトルに戻す
    const titleInput = editingMainGroup.querySelector(".main-group-title-input");

    titleInput.value = originalMainGroupTitle;

    // 編集中状態を解除
    editingMainGroup.classList.remove("editing");

    // 編集対象を解除
    editingMainGroup = null;

}

/* 大見出し作成 */

// 閲覧モードの大見出しを作成
function createViewMainGroup(group) {

    const mainGroup = viewMainGroupTemplate.content.firstElementChild.cloneNode(true);

    mainGroup.dataset.groupId = group.id;

    mainGroup.querySelector(".main-group-title-text").textContent = group.title;

    return mainGroup;

}

// 編集モードの大見出しを作成
function createEditMainGroup(group) {

    const mainGroup = editMainGroupTemplate.content.firstElementChild.cloneNode(true);

    mainGroup.dataset.groupId = group.id;
    
    mainGroup.querySelector(".main-group-title-text").textContent = group.title;

    setupEditMainGroupEvents(mainGroup);

    setupAddSubGroupButton(mainGroup);

    setupSubGroupSortable(mainGroup);

    return mainGroup;

}

// 閲覧モードに大見出しを追加
function addViewMainGroup(group) {

    const container = document.querySelector("#view-mode .combo-container");

    const mainGroup = createViewMainGroup(group);

    const divider = container.querySelector(".mode-divider");

    container.insertBefore(mainGroup, divider);

}

// 編集モードに大見出しを追加
function addEditMainGroup(group) {

    const container = document.querySelector("#edit-mode .combo-container");

    const mainGroup = createEditMainGroup(group);

    const addButton = container.querySelector(".add-heading-button");

    container.insertBefore(mainGroup, addButton);

    return mainGroup;

}

/* 大見出しデータ更新 */

// 大見出し追加
async function createNewMainGroup() {

    const response = await fetch(
        getModeUrl(window.location.pathname + "/new-main-group"),
        {
            method: "POST"
        }
    );

    const group = await response.json();

    addViewMainGroup(group);
    
    addEditMainGroup(group);

}

// 大見出し削除
async function deleteMainGroup(mainGroup) {

    const groupId = mainGroup.dataset.groupId;

    const response = await fetch(
        getModeUrl(window.location.pathname + "/delete-main-group"),
        {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                id: groupId

            })

        }
    );

    const result = await response.json();

    if (!result.success) {

        alert("削除に失敗しました。");

        return;

    }

    // 編集モード側
    mainGroup.remove();

    // 閲覧モード側
    const viewMainGroup = document.querySelector(
        `#view-mode .main-group[data-group-id="${groupId}"]`
    );

    if (viewMainGroup) {

        viewMainGroup.remove();

    }

}

// 大見出しの並び順を保存
function saveMainGroupOrder() {

    const mainGroups = document.querySelectorAll("#edit-mode .main-group");

    const groupOrder = [];

    mainGroups.forEach(mainGroup => {

        groupOrder.push(mainGroup.dataset.groupId);

    });

    fetch(getModeUrl(window.location.pathname + "/sort-main-groups"), {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            groupOrder: groupOrder

        })

    })
    .then(response => response.json())
    .then(result => {

        if (!result.success) {

            alert("大見出しの並び順保存に失敗しました。");

        }

    })
    .catch(error => {

        console.error(error);

    });

}


// 大見出しの並び順を同期
function syncViewMainGroupOrder() {

    const mainGroups = document.querySelectorAll("#edit-mode .main-group");

    const groupOrder = [];

    mainGroups.forEach(mainGroup => {

        groupOrder.push(mainGroup.dataset.groupId);

    });

    const viewContainer = document.querySelector("#view-mode .combo-container");

    groupOrder.forEach(groupId => {

        const viewMainGroup = viewContainer.querySelector(
            `.main-group[data-group-id="${groupId}"]`
        );

        if (viewMainGroup) {

            viewContainer.appendChild(viewMainGroup);

        }

    });

}

/* ---------- 中見出し編集 ---------- */

// 中見出し編集開始
async function startSubGroupEdit(subGroup) {

    // 別の中見出しが編集中なら、先に編集完了する
    if (editingSubGroup && editingSubGroup !== subGroup) {

        const success = await finishSubGroupEdit();

        if (!success) {
            return;
        }

    }

    // どの中見出しを編集しているか覚えておく
    editingSubGroup = subGroup;

    // 現在の中見出しタイトルを取得
    const titleText = subGroup.querySelector(".sub-group-title-text");

    // 編集用inputを取得
    const titleInput = subGroup.querySelector(".sub-group-title-input");

    // 編集開始前のタイトルを保存
    originalSubGroupTitle = titleText.textContent;

    // 現在のタイトルをinputに入れる
    titleInput.value = titleText.textContent;

    // 編集中状態にする
    subGroup.classList.add("editing");

}

/* 中見出し編集 */

// 中見出し編集完了
async function finishSubGroupEdit() {

    const titleInput = editingSubGroup.querySelector(".sub-group-title-input");

    const title = titleInput.value;

    const subgroupId = editingSubGroup.dataset.subgroupId;

    try {

        const response = await fetch(getModeUrl(window.location.pathname), {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                type: "sub-group",
                id: subgroupId,
                title: title

            })

        });

        const result = await response.json();

        if (!result.success) {

            alert("保存に失敗しました。");

            return false;

        }

        // 編集モード側
        const editTitleText = editingSubGroup.querySelector(".sub-group-title-text");

        editTitleText.textContent = title;

        // 閲覧モード側
        const mainGroup = editingSubGroup.closest(".main-group");
        const groupId = mainGroup.dataset.groupId;

        const viewMainGroup = document.querySelector(`#view-mode .main-group[data-group-id="${groupId}"]`);

        if (viewMainGroup) {

            const viewSubGroup = viewMainGroup.querySelector(`.sub-group[data-subgroup-id="${subgroupId}"]`);

            if (viewSubGroup) {

                const viewTitleText = viewSubGroup.querySelector(".sub-group-title-text");

                viewTitleText.textContent = title;

            }

        }

        // 編集中状態を解除
        editingSubGroup.classList.remove("editing");

        editingSubGroup = null;

        return true;

    }
    catch (error) {

        console.error(error);

        alert("保存に失敗しました。");

        return false;

    }

}

// 中見出し編集キャンセル
function cancelSubGroupEdit() {

    // 編集中の中見出しを元のタイトルに戻す
    const titleText =
        editingSubGroup.querySelector(".sub-group-title-text");

    titleText.textContent = originalSubGroupTitle;

    // inputも元のタイトルに戻す
    const titleInput =
        editingSubGroup.querySelector(".sub-group-title-input");

    titleInput.value = originalSubGroupTitle;

    // 編集中状態を解除
    editingSubGroup.classList.remove("editing");

    // 編集対象を解除
    editingSubGroup = null;

}

/* 中見出し作成 */

// 閲覧モードの中見出しを作成
function createViewSubGroup(subGroup) {

    const subGroupElement = viewSubGroupTemplate.content.firstElementChild.cloneNode(true);

    subGroupElement.dataset.subgroupId = subGroup.id;

    subGroupElement.querySelector(".sub-group-title-text").textContent = subGroup.title;

    return subGroupElement;

}

// 編集モードの中見出しを作成
function createEditSubGroup(subGroup) {

    const subGroupElement = editSubGroupTemplate.content.firstElementChild.cloneNode(true);

    subGroupElement.dataset.subgroupId = subGroup.id;

    subGroupElement.querySelector(".sub-group-title-text").textContent = subGroup.title;

    setupEditSubGroupEvents(subGroupElement);

    setupAddComboButton(subGroupElement);

    setupComboSortable(subGroupElement);

    return subGroupElement;

}

// 閲覧モードに中見出しを追加
function addViewSubGroup(subGroup, mainGroup) {

    const subGroupElement = createViewSubGroup(subGroup);

    mainGroup.appendChild(subGroupElement);

}

// 編集モードに中見出しを追加
function addEditSubGroup(subGroup, mainGroup) {

    const subGroupElement = createEditSubGroup(subGroup);

    const addButton = mainGroup.querySelector(".add-subheading-button");

    addButton.parentElement.insertBefore(subGroupElement,addButton);

    return subGroupElement;

}

/* 中見出しデータ更新 */

// 中見出し追加
async function createNewSubGroup(mainGroup) {

    const groupId = mainGroup.dataset.groupId;

    const response = await fetch(
        getModeUrl(window.location.pathname + "/new-subgroup"),
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                groupId: groupId
            })
        }
    );

    const subGroup = await response.json();

    const viewMainGroup = document.querySelector(`#view-mode .main-group[data-group-id="${groupId}"]`);

    addViewSubGroup(subGroup,viewMainGroup);

    const newSubGroup = addEditSubGroup(subGroup,mainGroup);

    return newSubGroup;

}

// 中見出し削除
async function deleteSubGroup(subGroup) {

    const subgroupId = subGroup.dataset.subgroupId;

    const mainGroup = subGroup.closest(".main-group");
    const groupId = mainGroup.dataset.groupId;

    const response = await fetch(
        getModeUrl(window.location.pathname + "/delete-sub-group"),
        {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                id: subgroupId

            })

        }
    );

    const result = await response.json();

    if (!result.success) {

        alert("削除に失敗しました。");

        return;

    }

    // 編集モード側
    subGroup.remove();

    // 閲覧モード側
    const viewMainGroup = document.querySelector(
        `#view-mode .main-group[data-group-id="${groupId}"]`
    );

    if (viewMainGroup) {

        const viewSubGroup = viewMainGroup.querySelector(
            `.sub-group[data-subgroup-id="${subgroupId}"]`
        );

        if (viewSubGroup) {

            viewSubGroup.remove();

        }

    }

}

// 中見出しの並び順を保存
function saveSubGroupOrder(mainGroup) {

    const subGroups = mainGroup.querySelectorAll(".sub-group");

    const subGroupOrder = [];

    subGroups.forEach(subGroup => {

        subGroupOrder.push(subGroup.dataset.subgroupId);

    });

    const groupId = mainGroup.dataset.groupId;

    fetch(getModeUrl(window.location.pathname + "/sort-subgroups"), {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            groupId: groupId,
            subGroupOrder: subGroupOrder

        })

    })
    .then(response => response.json())
    .then(result => {

        if (!result.success) {

            alert("中見出しの並び順保存に失敗しました。");

        }

    })
    .catch(error => {

        console.error(error);

    });

}

// 中見出しの並び順を同期
function syncViewSubGroupOrder(mainGroup) {

    const subGroups = mainGroup.querySelectorAll(".sub-group");

    const subGroupOrder = [];

    subGroups.forEach(subGroup => {

        subGroupOrder.push(
            subGroup.dataset.subgroupId
        );

    });

    const groupId = mainGroup.dataset.groupId;

    const viewMainGroup = document.querySelector(
        `#view-mode .main-group[data-group-id="${groupId}"]`
    );

    if (!viewMainGroup) {
        return;
    }

    const viewSubGroupContainer = viewMainGroup;

    subGroupOrder.forEach(subGroupId => {

        const viewSubGroup = viewSubGroupContainer.querySelector(
            `.sub-group[data-subgroup-id="${subGroupId}"]`
        );

        if (viewSubGroup) {

            viewSubGroupContainer.appendChild(viewSubGroup);

        }

    });

}

/* ---------- イベント登録 ---------- */

// 操作モード切替UIのイベント設定
function setupModeSelector() {

    if (!modeSelectors.length) {
        return;
    }

    // mode変更時
    modeSelectors.forEach(selector => {

        selector.value = currentMode;

        selector.addEventListener("change", function () {

            switchMode(this.value)

        });

    });

}

// コンボカード編集イベント設定
function setupEditComboCardEvents(comboItem) {

    comboItem
        .querySelector(".combo-edit-button")
        .addEventListener("click", async function () {

            await startComboEdit(comboItem);

        });

    comboItem
        .querySelector(".add-move-button")
        .addEventListener("click", function () {

            openMoveSelectorPanel(comboItem);

        });

    comboItem
        .querySelector(".combo-undo-button")
        .addEventListener("click", function () {

            undoLastMove();

        });

    comboItem
        .querySelector(".combo-complete-button")
        .addEventListener("click", async function () {

            await finishComboEdit();

        });

    comboItem
        .querySelector(".combo-cancel-button")
        .addEventListener("click", function () {

            cancelComboEdit();

        });

    comboItem
        .querySelector(".combo-delete-button")
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

// 大見出し編集イベント設定
function setupEditMainGroupEvents(mainGroup) {

    mainGroup
        .querySelector(".group-edit-button")
        .addEventListener("click", async function () {

            await startGroupEdit(mainGroup);

        });
    mainGroup
        .querySelector(".group-complete-button")
        .addEventListener("click", async function () {

            await finishGroupEdit();

        });
    mainGroup
        .querySelector(".group-cancel-button")
        .addEventListener("click", function () {

            cancelGroupEdit();

        });

    mainGroup
        .querySelector(".group-delete-button")
        .addEventListener("click", function () {

            if (!confirm("この大見出しを削除しますか？")) {
                return;
            }   

            deleteMainGroup(mainGroup);

        });
}

// 中見出し編集イベント設定
function setupEditSubGroupEvents(subGroup) {

    subGroup
        .querySelector(".sub-group-edit-button")
        .addEventListener("click", async function () {

            await startSubGroupEdit(subGroup);

        });

    subGroup
        .querySelector(".sub-group-complete-button")
        .addEventListener("click", async function () {

            await finishSubGroupEdit();

        });

    subGroup
        .querySelector(".sub-group-cancel-button")
        .addEventListener("click", function () {

            cancelSubGroupEdit();

        });

    subGroup
        .querySelector(".sub-group-delete-button")
        .addEventListener("click", function () {

            if (!confirm("この中見出しを削除しますか？")) {

                return;

            }

            deleteSubGroup(subGroup);

        });

}

// 中見出し追加ボタンのイベント設定
function setupAddSubGroupButton(mainGroup) {

    mainGroup
        .querySelector(".add-subheading-button")
        .addEventListener("click", async function () {

            await createNewSubGroup(mainGroup);

        });

}

// コンボ追加ボタンのイベント設定
function setupAddComboButton(subGroup) {

    subGroup
        .querySelector(".add-combo-button")
        .addEventListener("click", async function () {

            await createNewCombo(subGroup);

        });

}

// 中見出し並び替えイベント設定
function setupSubGroupSortable(mainGroup) {

    const mainGroupContent = mainGroup.querySelector(".main-group-content");

    new Sortable(mainGroupContent, {

        animation: 150,

        draggable: ".sub-group",

        onEnd: function () {

            saveSubGroupOrder(mainGroup);

            syncViewSubGroupOrder(mainGroup);

        }

    });

}

// コンボ並び替えイベント設定
function setupComboSortable(subGroup) {

    const comboList = subGroup.querySelector(".combo-list");

    new Sortable(comboList, {

        animation: 150,

        draggable: ".combo-item",

        onEnd: function () {

            saveComboOrder(comboList);

            syncViewComboOrder(comboList);

        }

    });

}

// イベント登録
function registerEvents() {

    /* 閲覧/編集モード切替 */

    editModeButton.addEventListener("click", function () {

        syncDetailsState(viewDetails, editDetails);

        viewMode.style.display = "none";
        editMode.style.display = "block";

        memoTextareas.forEach(adjustTextareaHeight);

    });

    completeModeButton.addEventListener("click", async function () {

        if (editingComboItem) {

            const success = await finishComboEdit();

            if (!success) {
                return;
            }

        }

        if (editingMainGroup) {

            const success = await finishGroupEdit();

            if (!success) {
                return;
            }

        }

        if (editingSubGroup) {

            const success = await finishSubGroupEdit();

            if (!success) {
                return;
            }

        }

        syncDetailsState(editDetails, viewDetails);

        editMode.style.display = "none";
        viewMode.style.display = "block";

    });

    /* 表記モード切替 */

    viewDisplayButton.addEventListener(
        "click",
        toggleDisplayMode
    );

    editDisplayButton.addEventListener(
        "click",
        toggleDisplayMode
    );

    /* 操作モード切替 */

    setupModeSelector();

    /* コンボ編集 */

    //コンボカードイベント登録
    document.querySelectorAll("#edit-mode .combo-item").forEach(comboItem => {

        setupEditComboCardEvents(comboItem);

    });

    // コンボ追加ボタンのイベント登録
    document.querySelectorAll("#edit-mode .sub-group").forEach(subGroup => {

        setupAddComboButton(subGroup);

    });

    // コンボ並び替え
    document.querySelectorAll("#edit-mode .sub-group").forEach(subGroup => {

        setupComboSortable(subGroup);

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

            updateMoveTabIndicator();

        });

    });

    /* 大見出し編集 */

    // 大見出しイベント登録
    document.querySelectorAll("#edit-mode .main-group").forEach(mainGroup => {

        setupEditMainGroupEvents(mainGroup);
        setupAddSubGroupButton(mainGroup);

    });

    // 大見出し追加
    const addHeadingButton = document.querySelector(".add-heading-button");

    addHeadingButton.addEventListener("click", async function () {

        await createNewMainGroup();

    });

    // 大見出し並び替え
    const mainGroupContainer = document.querySelector("#edit-mode .combo-container");

    new Sortable(mainGroupContainer, {

        animation: 150,

        draggable: ".main-group",

        onEnd: function () {

            saveMainGroupOrder();

            syncViewMainGroupOrder();

        }

    });

    /* 中見出し編集 */

    // 中見出しイベント登録
    document.querySelectorAll("#edit-mode .sub-group").forEach(subGroup => {

        setupEditSubGroupEvents(subGroup);

    });

    // 中見出し並び替え
    document.querySelectorAll("#edit-mode .main-group").forEach(mainGroup => {

        setupSubGroupSortable(mainGroup);

    });

}

/* =========================
   イベント登録
========================= */

registerEvents();
