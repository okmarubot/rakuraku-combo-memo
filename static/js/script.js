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

/* 削除確認UI */
const deleteConfirm = document.querySelector("#delete-confirm");
const deleteConfirmMessage = document.querySelector("#delete-confirm-message");
const deleteConfirmCancel = document.querySelector("#delete-confirm-cancel");
const deleteConfirmOk = document.querySelector("#delete-confirm-ok");

/* データ管理UI */

const dataManagementButton = document.querySelector("#data-management-button");

const dataManagementModal = document.querySelector("#data-management-modal");

const dataExportButton = document.querySelector("#data-export-button");
const dataImportButton = document.querySelector("#data-import-button");
const dataManagementCloseButton = document.querySelector("#data-management-close-button");

const dataExportModal = document.querySelector("#data-export-modal");
const dataExportCancelButton = document.querySelector("#data-export-cancel-button");
const dataExportExecuteButton = document.querySelector("#data-export-execute-button");

const dataExportResultModal = document.querySelector("#data-export-result-modal");
const dataExportText = document.querySelector("#data-export-text");
const dataExportCopyButton = document.querySelector("#data-export-copy-button");
const dataExportResultCloseButton = document.querySelector("#data-export-result-close-button");

const dataImportModal = document.querySelector("#data-import-modal");
const dataImportCancelButton = document.querySelector("#data-import-cancel-button");
const dataImportNextButton = document.querySelector("#data-import-next-button");

const dataImportFileModal = document.querySelector("#data-import-file-modal");
const dataImportFileInput = document.querySelector("#data-import-file-input");
const dataImportFileCancelButton = document.querySelector("#data-import-file-cancel-button");
const dataImportFileExecuteButton = document.querySelector("#data-import-file-execute-button");

const dataImportTextModal = document.querySelector("#data-import-text-modal");
const dataImportText = document.querySelector("#data-import-text");
const dataImportTextCancelButton = document.querySelector("#data-import-text-cancel-button");
const dataImportTextExecuteButton = document.querySelector("#data-import-text-execute-button");

const dataImportCheckModal = document.querySelector("#data-import-check-modal");
const dataImportCheckResult = document.querySelector("#data-import-check-result");
const dataImportCheckCancelButton = document.querySelector("#data-import-check-cancel-button");
const dataImportCheckNextButton = document.querySelector("#data-import-check-next-button");

const dataImportConfirmModal = document.querySelector("#data-import-confirm-modal");
const dataImportConfirmCancelButton = document.querySelector("#data-import-confirm-cancel-button");
const dataImportConfirmExecuteButton = document.querySelector("#data-import-confirm-execute-button");

const dataClearButton = document.querySelector("#data-clear-button");

const dataClearModal = document.querySelector("#data-clear-modal");
const dataClearModeFieldset = document.querySelector("#data-clear-mode-fieldset");
const dataClearCancelButton = document.querySelector("#data-clear-cancel-button");
const dataClearNextButton = document.querySelector("#data-clear-next-button");

const dataClearConfirmModal = document.querySelector("#data-clear-confirm-modal");
const dataClearConfirmCancelButton = document.querySelector("#data-clear-confirm-cancel-button");
const dataClearConfirmExecuteButton = document.querySelector("#data-clear-confirm-execute-button");

/* =========================
   初期状態
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

// 技一覧パネルのキーボード操作
moveSelectorPanel.inert = true;

// インポートデータ一時変数
let pendingImportData = null;
let pendingImportTarget = null;

// 削除データ一時変数
let pendingClearTarget = null;
let pendingClearMode = null;

/* =========================
   関数
========================= */

/* ---------- URL取得 ---------- */

// 現在のページURLにmodeを維持したパスを作る
function getModeUrl(path) {

    return path + window.location.search;

}

/* ---------- localStorage保存関数 ---------- */

// localStorageの保存キーを取得
function getComboStorageKey() {

    return `comboData_${characterId}_${currentMode}`;

}

// localStorageに保存データが存在するか確認
function hasSavedComboData() {

    return localStorage.getItem(
        getComboStorageKey()
    ) !== null;

}

// localStorageからコンボデータを読み込む
function loadComboData() {

    const savedData = localStorage.getItem(getComboStorageKey());

    if (savedData) {

        try {

            return JSON.parse(savedData);

        } catch (error) {

            console.error("保存されたコンボデータの読み込みに失敗しました:", error);

        }

    }

    return structuredClone(initialComboData);

}

// 初回アクセスかどうか
const isFirstLoad = !hasSavedComboData();

// 現在使用するコンボデータ
let comboData = loadComboData();

// コンボデータをlocalStorageに保存
function saveComboData() {

    try {

        localStorage.setItem(
            getComboStorageKey(),
            JSON.stringify(comboData)
        );

    } catch (error) {

        console.error("コンボデータの保存に失敗しました:", error);

    }

}

/* ---------- データ管理 ---------- */

/* データ管理UI */

// データ管理UIを開く
function openDataManagementModal() {

    dataManagementModal.classList.add("is-open");
    dataExportButton.focus();

}

// データ管理UIを閉じる
function closeDataManagementModal() {

    dataManagementModal.classList.remove("is-open");

}

/* フォーカストラップ */

// フォーカストラップ
function setupModalFocusTrap(modal, closeAction) {

    function handleKeydown(event) {

        if (!modal.classList.contains("is-open")) {
            return;
        }

        // Esc → モーダルを閉じる
        if (event.key === "Escape") {

            event.preventDefault();

            closeAction();

            return;

        }

        // Tab → モーダル内だけを移動
        if (event.key !== "Tab") {
            return;
        }

        const focusableElements = Array.from(
            modal.querySelectorAll(
                'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )
        ).filter(function (element) {

            return element.offsetParent !== null;

        });

        if (focusableElements.length === 0) {
            return;
        }

        event.preventDefault();

        const currentIndex =
            focusableElements.indexOf(document.activeElement);

        const nextIndex =
            event.shiftKey
                ? (currentIndex - 1 + focusableElements.length)
                    % focusableElements.length
                : (currentIndex + 1)
                    % focusableElements.length;

        focusableElements[nextIndex].focus();

    }

    document.addEventListener(
        "keydown",
        handleKeydown
    );

}

/* エクスポート */

// エクスポートUIを開く
function openDataExportModal() {

    dataManagementModal.classList.remove("is-open");
    dataExportModal.classList.add("is-open");
    dataExportExecuteButton.focus();

}

// エクスポートUIを閉じる
function closeDataExportModal() {

    dataExportModal.classList.remove("is-open");

}

// エクスポート結果UIを開く
function openDataExportResultModal(text) {

    dataExportText.value = text;
    dataExportModal.classList.remove("is-open");
    dataExportResultModal.classList.add("is-open");
    dataExportResultCloseButton.focus();

}

// エクスポート結果UIを閉じる
function closeDataExportResultModal() {

    dataExportResultModal.classList.remove("is-open");

}

// localStorageからエクスポート対象のデータを取得
function getExportData(target) {

    const exportData = {
        version: 1,
        game: "sf6",
        characters: {}
    };

    const prefix = "comboData_";

    if (target === "character") {

        const characterData = {};

        ["classic", "modern"].forEach(mode => {

            const key = `comboData_${characterId}_${mode}`;

            const savedData = localStorage.getItem(key);

            if (!savedData) {
                return;
            }

            try {

                characterData[mode] = JSON.parse(savedData);

            } catch (error) {

                console.error("エクスポートデータの読み込みに失敗しました:", error);

            }

        });

        exportData.characters[characterId] = characterData;

        return exportData;

    }

    // すべてのキャラクター
    Object.keys(localStorage)
        .filter(key => key.startsWith(prefix))
        .forEach(key => {

            const keyParts = key.substring(prefix.length).split("_");

            const mode = keyParts.pop();

            const exportCharacterId = keyParts.join("_");

            const savedData = localStorage.getItem(key);

            if (!savedData) {
                return;
            }

            try {

                const parsedData = JSON.parse(savedData);

                if (!exportData.characters[exportCharacterId]) {

                    exportData.characters[exportCharacterId] = {};

                }

                exportData.characters[exportCharacterId][mode] = parsedData;

            } catch (error) {

                console.error("エクスポートデータの読み込みに失敗しました:", error);

            }

        });

    return exportData;

}

// エクスポートデータを文字列に変換
function createExportText(target) {

    const exportData = getExportData(target);

    return JSON.stringify(exportData, null, 2);

}

// ファイルとしてエクスポート
async function exportDataAsFile(text) {

    // 保存場所・ファイル名をユーザーに選択してもらう
    if ("showSaveFilePicker" in window) {

        const fileHandle =
            await window.showSaveFilePicker({

                suggestedName:"らくらくコンボメモ.json",

                types: [
                    {
                        description: "JSONファイル",
                        accept: {"application/json": [".json"]}
                    }
                ]

            });

        const writable = await fileHandle.createWritable();

        await writable.write(text);

        await writable.close();

        return;

    }

    // 非対応ブラウザ用
    const blob = new Blob([text], {type: "application/json"});

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "らくらくコンボメモ.json";

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);

}

// エクスポートを実行
async function executeDataExport() {

    const target = document.querySelector('input[name="export-target"]:checked').value;

    const format = document.querySelector('input[name="export-format"]:checked').value;

    const text = createExportText(target);

    if (format === "file") {

        try {

            await exportDataAsFile(text);

        } catch (error) {

            // ユーザーが保存ダイアログをキャンセルした場合
            if (error.name === "AbortError") {
                return;
            }

            console.error("エクスポートに失敗しました:", error);

            alert("エクスポートに失敗しました。");

            return;

        }

        dataExportModal.classList.remove("is-open");

        dataExportResultModal.classList.add("is-open");

        dataExportText.value = "";

        dataExportText.style.display = "none";

        dataExportCopyButton.style.display = "none";

        dataExportResultCloseButton.focus();

        return;

    }

    // コピー用文字列
    dataExportText.style.display = "block";

    dataExportCopyButton.style.display = "block";

    openDataExportResultModal(text);

}

// エクスポート文字列をコピー
async function copyExportText() {

    try {

        await navigator.clipboard.writeText(dataExportText.value);

        dataExportCopyButton.textContent = "コピーしました";

        setTimeout(function () {

            dataExportCopyButton.textContent = "コピー";

        }, 1500);

    } catch (error) {

        console.error("コピーに失敗しました:", error);

        dataExportText.focus();

        dataExportText.select();

    }

}

/* インポート */
// データインポートUIを開く
function openDataImportModal() {

    dataManagementModal.classList.remove("is-open");
    dataImportModal.classList.add("is-open");
    dataImportNextButton.focus();

}

// データインポートUIを閉じる
function closeDataImportModal() {

    dataImportModal.classList.remove("is-open");

}

// データインポート：ファイル入力UIを開く
function openDataImportFileModal() {

    dataImportModal.classList.remove("is-open");
    dataImportFileModal.classList.add("is-open");
    dataImportFileInput.focus();

}

// データインポート：ファイル入力UIを閉じる
function closeDataImportFileModal() {

    dataImportFileModal.classList.remove("is-open");

}

// データインポート：テキスト入力UIを開く
function openDataImportTextModal() {

    dataImportModal.classList.remove("is-open");
    dataImportTextModal.classList.add("is-open");
    dataImportText.focus();

}

// データインポート：テキスト入力UIを閉じる
function closeDataImportTextModal() {

    dataImportTextModal.classList.remove("is-open");

}

// データインポート対象を取得
function getImportTarget() {

    return document.querySelector(
        'input[name="import-target"]:checked'
    ).value;

}

// データインポート対象を設定
function prepareImportData(text) {

    if (!text.trim()) {

        alert("データが入力されていません。");
        return false;

    }

    try {

        pendingImportData = JSON.parse(text);
        pendingImportTarget = getImportTarget();
        return true;

    } catch (error) {

        console.error("インポートデータの読み込みに失敗しました:", error);
        alert("正しいJSONデータを入力してください。");
        return false;

    }

}

// データインポートを実行（ファイル入力）
async function executeDataImportFile() {

    const file = dataImportFileInput.files[0];

    if (!file) {

        alert("ファイルを選択してください。");
        return;

    }

    try {

        const text = await file.text();

        if (!prepareImportData(text)) {
            return;
        }

        closeDataImportFileModal();
        openDataImportCheckModal();

    } catch (error) {

        console.error("ファイルの読み込みに失敗しました:", error);
        alert("ファイルの読み込みに失敗しました。");

    }

}

// データインポートを実行（テキスト入力）
function executeDataImportText() {

    const text = dataImportText.value;

    if (!prepareImportData(text)) {
        return;
    }

    closeDataImportFileModal();
    openDataImportCheckModal();

}

// データインポートを実行（確認後）
function proceedDataImport() {

    const format = document.querySelector('input[name="import-format"]:checked').value;

    if (format === "file") {
        openDataImportFileModal();
        return;
    }

    openDataImportTextModal();

}

// インポートデータチェック
function isObject(value) {
    return value !== null &&
        typeof value === "object" &&
        !Array.isArray(value);
}

function checkImportData() {
    const errors = [];

    if (!isObject(pendingImportData)) {
        errors.push("インポートデータが正しい形式ではありません。");
        return errors;
    }

    if (pendingImportData.version !== 1) {
        errors.push("対応していないデータバージョンです。");
    }

    if (pendingImportData.game !== "sf6") {
        errors.push("Street Fighter 6 のデータではありません。");
    }

    if (!isObject(pendingImportData.characters)) {
        errors.push("characters のデータが正しい形式ではありません。");
        return errors;
    }

    const characterIds = Object.keys(
        pendingImportData.characters
    );

    if (characterIds.length === 0) {
        errors.push("キャラクターデータがありません。");
        return errors;
    }

    if (pendingImportTarget === "character") {
        if (!pendingImportData.characters[characterId]) {
            errors.push(
                `このキャラクター（${characterId}）のデータがありません。`
            );

            return errors;
        }

        checkCharacterImportData(
            characterId,
            pendingImportData.characters[characterId],
            errors
        );

        return errors;
    }

    characterIds.forEach(function (importCharacterId) {
        checkCharacterImportData(
            importCharacterId,
            pendingImportData.characters[importCharacterId],
            errors
        );
    });

    return errors;
}

// キャラクターデータチェック
function checkCharacterImportData(
    importCharacterId,
    characterData,
    errors
) {
    if (!isObject(characterData)) {
        errors.push(
            `${importCharacterId}: キャラクターデータの形式が正しくありません。`
        );
        return;
    }

    ["classic", "modern"].forEach(function (mode) {
        if (!(mode in characterData)) {
            return;
        }

        checkModeImportData(
            importCharacterId,
            mode,
            characterData[mode],
            errors
        );
    });
}

// モードチェック
function checkModeImportData(
    importCharacterId,
    mode,
    modeData,
    errors
) {
    if (!isObject(modeData)) {
        errors.push(
            `${importCharacterId} ${mode}: データの形式が正しくありません。`
        );
        return;
    }

    if (!Array.isArray(modeData.groups)) {
        errors.push(
            `${importCharacterId} ${mode}: groups が正しい形式ではありません。`
        );
        return;
    }

    modeData.groups.forEach(function (group, groupIndex) {
        checkGroupImportData(
            importCharacterId,
            mode,
            group,
            groupIndex,
            errors
        );
    });
}

// 大見出しデータチェック
function checkGroupImportData(
    importCharacterId,
    mode,
    group,
    groupIndex,
    errors
) {
    const location =
        `${importCharacterId} ${mode} 大見出し${groupIndex + 1}`;

    if (!isObject(group)) {
        errors.push(
            `${location}: データの形式が正しくありません。`
        );
        return;
    }

    if (typeof group.id !== "string" || group.id.trim() === "") {
        errors.push(
            `${location}: id がありません。`
        );
    }

    if (typeof group.title !== "string") {
        errors.push(
            `${location}: title が正しくありません。`
        );
    }

    if (!Array.isArray(group.subgroups)) {
        errors.push(
            `${location}: subgroups が正しい形式ではありません。`
        );
        return;
    }

    group.subgroups.forEach(function (subgroup, subgroupIndex) {
        checkSubGroupImportData(
            importCharacterId,
            mode,
            subgroup,
            groupIndex,
            subgroupIndex,
            errors
        );
    });
}

// 中見出しデータチェック
function checkSubGroupImportData(
    importCharacterId,
    mode,
    subgroup,
    groupIndex,
    subgroupIndex,
    errors
) {
    const location =
        `${importCharacterId} ${mode} 大見出し${groupIndex + 1} `
        + `中見出し${subgroupIndex + 1}`;

    if (!isObject(subgroup)) {
        errors.push(
            `${location}: データの形式が正しくありません。`
        );
        return;
    }

    if (
        typeof subgroup.id !== "string" ||
        subgroup.id.trim() === ""
    ) {
        errors.push(
            `${location}: id がありません。`
        );
    }

    if (typeof subgroup.title !== "string") {
        errors.push(
            `${location}: title が正しくありません。`
        );
    }

    if (!Array.isArray(subgroup.combos)) {
        errors.push(
            `${location}: combos が正しい形式ではありません。`
        );
        return;
    }

    subgroup.combos.forEach(function (combo, comboIndex) {
        checkComboImportData(
            importCharacterId,
            mode,
            combo,
            groupIndex,
            subgroupIndex,
            comboIndex,
            errors
        );
    });
}

// コンボデータチェック
function checkComboImportData(
    importCharacterId,
    mode,
    combo,
    groupIndex,
    subgroupIndex,
    comboIndex,
    errors
) {
    const location =
        `${importCharacterId} ${mode} `
        + `大見出し${groupIndex + 1} `
        + `中見出し${subgroupIndex + 1} `
        + `コンボ${comboIndex + 1}`;

    if (!isObject(combo)) {
        errors.push(
            `${location}: データの形式が正しくありません。`
        );
        return;
    }

    if (
        typeof combo.id !== "string" ||
        combo.id.trim() === ""
    ) {
        errors.push(
            `${location}: id がありません。`
        );
    }

    if (!Array.isArray(combo.moves)) {
        errors.push(
            `${location}: moves が正しい形式ではありません。`
        );
    } else {
        combo.moves.forEach(function (moveId) {
            if (typeof moveId !== "string") {
                errors.push(
                    `${location}: 技IDが文字列ではありません。`
                );
                return;
            }

            if (!findMoveById(moveId)) {
                errors.push(
                    `${location}: 存在しない技ID「${moveId}」が含まれています。`
                );
            }
        });
    }

    if (typeof combo.memo !== "string") {
        errors.push(
            `${location}: memo が正しくありません。`
        );
    }
}

// インポートデータ確認UIを開く
function openDataImportCheckModal() {
    const errors = checkImportData();

    if (errors.length === 0) {
        dataImportCheckResult.innerHTML =
            '<p class="data-import-check-success">'
            + 'このデータはインポートできます。'
            + '</p>';

        dataImportCheckNextButton.disabled = false;
    } else {
        dataImportCheckResult.innerHTML =
            '<p>インポートできない問題があります。</p>'
            + '<ul class="data-import-check-error">'
            + errors.map(function (error) {
                return `<li>${error}</li>`;
            }).join("")
            + '</ul>';

        dataImportCheckNextButton.disabled = true;
    }

    dataImportCheckModal.classList.add("is-open");
    dataImportCheckNextButton.focus();
}

// データインポートを実行
function executeDataImport() {
    if (!pendingImportData) {
        return;
    }

    const characters = pendingImportData.characters;

    if (pendingImportTarget === "character") {
        const importedCharacterData =
            characters[characterId];

        ["classic", "modern"].forEach(function (mode) {
            if (!(mode in importedCharacterData)) {
                return;
            }

            const key =
                `comboData_${characterId}_${mode}`;

            localStorage.setItem(
                key,
                JSON.stringify(importedCharacterData[mode])
            );
        });
    } else {
        Object.keys(characters).forEach(function (importCharacterId) {
            const characterData =
                characters[importCharacterId];

            ["classic", "modern"].forEach(function (mode) {
                if (!(mode in characterData)) {
                    return;
                }

                const key =
                    `comboData_${importCharacterId}_${mode}`;

                localStorage.setItem(
                    key,
                    JSON.stringify(characterData[mode])
                );
            });
        });
    }

    pendingImportData = null;
    pendingImportTarget = null;

    dataImportConfirmModal.classList.remove("is-open");

    alert("インポートしました。");

    location.reload();
}

/* データ消去 */
// データ消去対象を取得
function getClearTarget() {
    return document.querySelector(
        'input[name="clear-target"]:checked'
    ).value;
}

function getClearMode() {
    return document.querySelector(
        'input[name="clear-mode"]:checked'
    ).value;
}

// データ消去UIを開く
function openDataClearModal() {
    dataManagementModal.classList.remove("is-open");

    dataClearModal.classList.add("is-open");

    dataClearModeFieldset.style.display = "block";

    dataClearNextButton.focus();
}

// データ消去UIを閉じる
function closeDataClearModal() {
    dataClearModal.classList.remove("is-open");
}

// データ消去のモード選択
function updateDataClearModeVisibility() {
    const target = getClearTarget();

    if (target === "character") {
        dataClearModeFieldset.style.display = "block";
    } else {
        dataClearModeFieldset.style.display = "none";
    }
}

// データ消去確認UIを開く
function openDataClearConfirmModal() {
    pendingClearTarget = getClearTarget();

    if (pendingClearTarget === "character") {
        pendingClearMode = getClearMode();
    } else {
        pendingClearMode = "all";
    }

    dataClearModal.classList.remove("is-open");
    dataClearConfirmModal.classList.add("is-open");

    dataClearConfirmExecuteButton.focus();
}

// データ消去確認UIを閉じる
function closeDataClearConfirmModal() {
    dataClearConfirmModal.classList.remove("is-open");
}

// データ消去を実行
function executeDataClear() {
    if (!pendingClearTarget) {
        return;
    }

    if (pendingClearTarget === "character") {
        if (
            pendingClearMode === "classic" ||
            pendingClearMode === "modern"
        ) {
            const key =
                `comboData_${characterId}_${pendingClearMode}`;

            localStorage.removeItem(key);
        } else if (pendingClearMode === "both") {
            ["classic", "modern"].forEach(function (mode) {
                const key =
                    `comboData_${characterId}_${mode}`;

                localStorage.removeItem(key);
            });
        }
    } else {
        Object.keys(localStorage)
            .filter(function (key) {
                return key.startsWith("comboData_");
            })
            .forEach(function (key) {
                localStorage.removeItem(key);
            });
    }

    pendingClearTarget = null;
    pendingClearMode = null;

    dataClearConfirmModal.classList.remove("is-open");

    location.reload();
}

/* ---------- DOM操作 ---------- */

function renderComboData() {

    // 編集モードのコンボコンテナを取得
    const editContainer = document.querySelector("#edit-mode .combo-container");

    // 閲覧モードのコンボコンテナを取得
    const viewContainer = document.querySelector("#view-mode .combo-container");

    // 既存の大見出しを削除
    editContainer
        .querySelectorAll(".main-group")
        .forEach(mainGroup => mainGroup.remove());

    viewContainer
        .querySelectorAll(".main-group")
        .forEach(mainGroup => mainGroup.remove());

    // comboDataからDOMを再生成
    comboData.groups.forEach(group => {

        // 大見出し
        const editMainGroup = createEditMainGroup(group);
        const viewMainGroup = createViewMainGroup(group);

        // 大見出しを追加
        const addMainGroupButton = editContainer.querySelector(".add-heading-button");

        editContainer.insertBefore(editMainGroup, addMainGroupButton);

        const modeDivider = viewContainer.querySelector(".mode-divider");

        viewContainer.insertBefore(viewMainGroup, modeDivider);

        // 中見出し
        group.subgroups.forEach(subGroup => {

            const editSubGroup = createEditSubGroup(subGroup);

            const viewSubGroup = createViewSubGroup(subGroup);

            // 中見出しを追加
            const editMainGroupContent = editMainGroup.querySelector(".main-group-content");

            const addSubGroupButton = editMainGroup.querySelector(".add-subheading-button");

            editMainGroupContent.insertBefore(
                editSubGroup,
                addSubGroupButton
            );

            const viewMainGroupContent = viewMainGroup.querySelector(".main-group-content");

            viewMainGroupContent.appendChild(viewSubGroup);

            // コンボ
            subGroup.combos.forEach(combo => {

                const editComboCard = createEditComboCard(combo);

                const viewComboCard = createViewComboCard(combo);

                // 編集モード
                const editComboList = editSubGroup.querySelector(".combo-list");

                const addComboButton = editComboList.querySelector(".add-combo-button");

                editComboList.insertBefore(editComboCard, addComboButton);

                // 閲覧モード
                const viewComboList = viewSubGroup.querySelector(".combo-list");

                viewComboList.appendChild(viewComboCard);

            });

        });

    });

}

/* ---------- details ---------- */

function syncDetailsState(sourceMode, targetMode) {

    const sourceDetails = sourceMode.querySelectorAll(".main-group, .sub-group");

    sourceDetails.forEach(sourceDetail => {

        const groupId = sourceDetail.dataset.groupId;

        const subgroupId = sourceDetail.dataset.subgroupId;

        let targetDetail = null;

        if (groupId) {

            targetDetail = targetMode.querySelector(`.main-group[data-group-id="${groupId}"]`);

        } else if (subgroupId) {

            targetDetail = targetMode.querySelector(`.sub-group[data-subgroup-id="${subgroupId}"]`);

        }

        if (targetDetail) {

            targetDetail.open = sourceDetail.open;

        }

    });

}

/* ---------- 表示切替 ---------- */

function toggleDisplayMode() {

    commandMode = !commandMode;

    const comboTexts = document.querySelectorAll(".combo-text");

    comboTexts.forEach(comboText => {

        const comboItem = comboText.closest(".combo-item");

        if (!comboItem) {
            return;
        }

        const moves = JSON.parse(comboItem.dataset.moves);

        setComboText(
            comboText,
            moves,
            commandMode ? "command" : "name"
        );

    });

    renderMoveSelectorList();

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

/* ---------- 削除確認UI ---------- */

function showDeleteConfirm(message, deleteAction) {

    deleteConfirmMessage.textContent = message;

    deleteConfirm.style.display = "flex";

    // 削除確認UI内のフォーカス可能な要素
    const focusableElements = [
        deleteConfirmCancel,
        deleteConfirmOk
    ];

    function closeDeleteConfirm() {

        deleteConfirm.style.display = "none";

        deleteConfirmOk.onclick = null;

        document.removeEventListener(
            "keydown",
            handleDeleteConfirmKeydown
        );

    }

    function handleDeleteConfirmKeydown(event) {

        // Esc → キャンセル
        if (event.key === "Escape") {

            event.preventDefault();

            deleteConfirmCancel.click();

            return;

        }

        // Tab → 確認UI内だけを移動
        if (event.key === "Tab") {

            event.preventDefault();

            const currentIndex =
                focusableElements.indexOf(document.activeElement);

            const nextIndex =
                event.shiftKey
                    ? (currentIndex - 1 + focusableElements.length)
                        % focusableElements.length
                    : (currentIndex + 1)
                        % focusableElements.length;

            focusableElements[nextIndex].focus();

        }

    }

    deleteConfirmCancel.onclick = function () {

        closeDeleteConfirm();

    };

    deleteConfirmOk.onclick = async function () {

        closeDeleteConfirm();

        await deleteAction();

    };

    document.addEventListener(
        "keydown",
        handleDeleteConfirmKeydown
    );

    // 最初は「削除する」にフォーカス
    deleteConfirmOk.focus();

}

/* ---------- コンボ編集 ---------- */

// コンボ編集開始
async function startComboEdit(comboItem) {

    // 編集中の見出し・コンボカードがある場合は完了
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

    comboItem.querySelector(".memo-text").textContent = combo.memo;

    setupEditComboCardEvents(comboItem);

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

    const comboId = editingComboItem.dataset.comboId;

    const subGroup = editingComboItem.closest(".sub-group");

    const mainGroup = subGroup.closest(".main-group");

    const groupId = mainGroup.dataset.groupId;

    const subgroupId = subGroup.dataset.subgroupId;

    // comboDataから親の大見出しを取得
    const targetGroup = comboData.groups.find(group => group.id === groupId);

    if (!targetGroup) {

        console.error("親の大見出しがcomboDataに見つかりません:", groupId);

        return false;

    }

    // comboDataから親の中見出しを取得
    const targetSubGroup = targetGroup.subgroups.find(subGroup => subGroup.id === subgroupId);

    if (!targetSubGroup) {

        console.error("親の中見出しがcomboDataに見つかりません:", subgroupId);

        return false;

    }

    // comboDataから対象コンボを取得
    const targetCombo = targetSubGroup.combos.find(combo => combo.id === comboId);

    if (!targetCombo) {

        console.error("コンボがcomboDataに見つかりません:", comboId);

        return false;

    }

    // 編集中の内容をcomboDataへ反映
    targetCombo.moves = structuredClone(currentMoves);

    targetCombo.memo = currentMemo;

    // 編集モード側
    editingComboItem.dataset.moves = JSON.stringify(targetCombo.moves);

    editingComboItem.dataset.memo = currentMemo;

    const editMemoText = editingComboItem.querySelector(".memo-text");

    if (editMemoText) {

        editMemoText.textContent = currentMemo;

    }

    // 閲覧モード側
    const viewComboItem = document.querySelector(`#view-mode .combo-item[data-combo-id="${comboId}"]`);

    if (viewComboItem) {

        viewComboItem.dataset.moves = JSON.stringify(targetCombo.moves);

        viewComboItem.dataset.memo = currentMemo;

        const viewMemoText = viewComboItem.querySelector(".memo-text");

        if (viewMemoText) {

            viewMemoText.textContent = currentMemo;

        }

    }

    // コンボ表示を最終状態へ更新
    updateComboDisplay();

    // 編集中状態を解除
    editingComboItem.classList.remove("editing");

    editingComboItem = null;

    // 技一覧パネルを閉じる
    closeMoveSelectorPanel();

    // localStorageへ保存
    saveComboData();

    return true;

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

// コンボカードの表示文字列を設定
function setComboText(comboText, moves, displayType) {

    comboText.innerHTML = "";

    moves.forEach((moveId, index) => {

        const move = findMoveById(moveId);

        if (!move) {
            return;
        }

        const moveSpan = document.createElement("span");

        moveSpan.className = "combo-move";
        moveSpan.textContent = move[displayType];

        comboText.appendChild(moveSpan);

        // 最後の技以外には矢印を追加
        if (index < moves.length - 1) {

            const separator = document.createElement("span");

            separator.className = "combo-separator";
            separator.textContent = " ⏵ ";

            comboText.appendChild(separator);

        }

    });

}

function setupComboTexts(comboItem, combo) {

    const comboTexts = comboItem.querySelectorAll(".combo-text");

    comboTexts.forEach(comboText => {

        setComboText(
            comboText,
            combo.moves,
            commandMode ? "command" : "name"
        );

    });

}

/* コンボデータ更新 */

// コンボ表示更新
function updateComboDisplay() {

    const comboTexts = editingComboItem.querySelectorAll(".combo-text");

    const comboId = editingComboItem.dataset.comboId;

    const viewComboItem = document.querySelector(`#view-mode .combo-item[data-combo-id="${comboId}"]`);

    // 編集モード側のコンボ表示を更新
    comboTexts.forEach(comboText => {

        setComboText(
            comboText,
            currentMoves,
            commandMode ? "command" : "name"
        );

    });

    // 閲覧モード側のコンボ表示を更新
    if (viewComboItem) {

        const viewComboText = viewComboItem.querySelector(".combo-text");

        setComboText(
            viewComboText,
            currentMoves,
            commandMode ? "command" : "name"
        );

        const viewMemoText = viewComboItem.querySelector(".memo-text");

        if (viewMemoText) {

            viewMemoText.textContent = currentMemo;

        }

    }

}

// コンボ追加
async function createNewCombo(subGroup) {

    const groupId = subGroup.closest(".main-group").dataset.groupId;

    const subgroupId = subGroup.dataset.subgroupId;

    // comboDataから親の大見出しを取得
    const targetGroup = comboData.groups.find(group => group.id === groupId);

    if (!targetGroup) {

        console.error("親の大見出しがcomboDataに見つかりません:", groupId);

        return;

    }

    // comboDataから親の中見出しを取得
    const targetSubGroup = targetGroup.subgroups.find(subGroup => subGroup.id === subgroupId);

    if (!targetSubGroup) {

        console.error("親の中見出しがcomboDataに見つかりません:", subgroupId);

        return;

    }

    // 新しいコンボ
    const combo = {

        id: crypto.randomUUID(),

        moves: [],

        memo: ""

    };

    // comboDataへ追加
    targetSubGroup.combos.push(combo);

    // 閲覧モードに追加
    addViewComboCard(combo, subGroup);

    // 編集モードに追加
    const newComboItem = addEditComboCard(combo, subGroup);

    // localStorageへ保存
    saveComboData();

    // 編集開始
    await startComboEdit(newComboItem);

    openMoveSelectorPanel(newComboItem);

}

// コンボ削除
function deleteCombo(comboItem) {

    const comboId = comboItem.dataset.comboId;

    const subGroup = comboItem.closest(".sub-group");

    const mainGroup = subGroup.closest(".main-group");

    const groupId = mainGroup.dataset.groupId;

    const subgroupId = subGroup.dataset.subgroupId;

    // comboDataから親の大見出しを取得
    const targetGroup = comboData.groups.find(group => group.id === groupId);

    if (!targetGroup) {

        console.error("親の大見出しがcomboDataに見つかりません:", groupId);

        return;

    }

    // comboDataから親の中見出しを取得
    const targetSubGroup = targetGroup.subgroups.find(subGroup => subGroup.id === subgroupId);

    if (!targetSubGroup) {

        console.error("親の中見出しがcomboDataに見つかりません:", subgroupId);

        return;

    }

    // comboDataから対象コンボを削除
    const comboIndex = targetSubGroup.combos.findIndex(combo => combo.id === comboId);

    if (comboIndex === -1) {

        console.error("コンボがcomboDataに見つかりません:", comboId);

        return;

    }

    targetSubGroup.combos.splice(comboIndex, 1);

    // 編集モード側
    comboItem.remove();

    // 閲覧モード側
    const viewComboItem = document.querySelector(`#view-mode .combo-item[data-combo-id="${comboId}"]`);

    if (viewComboItem) {

        viewComboItem.remove();

    }

    // localStorageへ保存
    saveComboData();

}

// コンボの並び順を保存
function saveComboOrder(comboList) {

    const comboItems = comboList.querySelectorAll(".combo-item");

    const subGroup = comboList.closest(".sub-group");

    const mainGroup = subGroup.closest(".main-group");

    const groupId = mainGroup.dataset.groupId;

    const subgroupId = subGroup.dataset.subgroupId;

    // comboDataから親の大見出しを取得
    const targetGroup = comboData.groups.find(group => group.id === groupId);

    if (!targetGroup) {

        console.error("親の大見出しがcomboDataに見つかりません:", groupId);

        return;

    }

    // comboDataから親の中見出しを取得
    const targetSubGroup = targetGroup.subgroups.find(subGroup => subGroup.id === subgroupId);

    if (!targetSubGroup) {

        console.error("親の中見出しがcomboDataに見つかりません:", subgroupId);

        return;

    }

    const comboMap = new Map(targetSubGroup.combos.map(combo => [combo.id, combo]));

    // DOMの順番をcomboDataへ反映
    targetSubGroup.combos = Array.from(comboItems)
        .map(comboItem => comboMap.get(comboItem.dataset.comboId))
        .filter(Boolean);

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

    // 技一覧パネルをキーボード操作可能にする
    moveSelectorPanel.inert = false;

    document.body.classList.add("move-selector-open");

    updateMoveTabIndicator();

    // 技一覧の最初の操作対象にフォーカス
    const firstMoveTab = document.querySelector(".move-selector-tabs button");

    if (firstMoveTab) {
        firstMoveTab.focus();
    }

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

    // 技一覧パネルをキーボード操作対象外にする
    moveSelectorPanel.inert = true;

    if (editingComboItem) {

        const addMoveButton = editingComboItem.querySelector(".add-move-button");

        if (addMoveButton) {
            addMoveButton.focus();
        }

    }

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

                // variantsを開いた場合
                if (variantGroup.classList.contains("open")) {

                    // 展開後の位置を取得する
                    const variantRect = variantList.getBoundingClientRect();
                    const listRect = moveSelectorList.getBoundingClientRect();

                    // 子要素が技一覧の表示範囲より下にはみ出している場合
                    if (variantRect.bottom > listRect.bottom) {

                        const scrollAmount =
                            variantRect.bottom - listRect.bottom;

                        moveSelectorList.scrollBy({

                            top: scrollAmount,
                            behavior: "smooth"

                        });

                    }

                }

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

    // 編集中の見出し・コンボカードがある場合は完了
    if (editingComboItem) {

        const success = await finishComboEdit();

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

    // comboDataから該当する大見出しを取得
    const targetGroup = comboData.groups.find(group => group.id === groupId);

    if (!targetGroup) {

        console.error(
            "大見出しがcomboDataに見つかりません:",
            groupId
        );

        return false;

    }

    // comboDataを更新
    targetGroup.title = title;

    // 編集モード側
    const editTitleText = editingMainGroup.querySelector(".main-group-title-text");

    editTitleText.textContent = title;

    // 閲覧モード側
    const viewMainGroup = document.querySelector(`#view-mode .main-group[data-group-id="${groupId}"]`);

    if (viewMainGroup) {

        const viewTitleText = viewMainGroup.querySelector(".main-group-title-text");

        viewTitleText.textContent = title;

    }

    // 編集中状態を解除
    editingMainGroup.classList.remove("editing");

    editingMainGroup = null;

    // localStorageへ保存
    saveComboData();

    return true;

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

    setupSubGroupKeyboardSort(mainGroup);

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
function createNewMainGroup() {

    const group = {

        id: crypto.randomUUID(),
        title: "新しい大見出し",
        subgroups: []

    };

    comboData.groups.push(group);

    addViewMainGroup(group);

    addEditMainGroup(group);

    saveComboData();

}

// 大見出し削除
function deleteMainGroup(mainGroup) {

    const groupId = mainGroup.dataset.groupId;

    const groupIndex = comboData.groups.findIndex(group => group.id === groupId);

    if (groupIndex === -1) {
        return;
    }

    comboData.groups.splice(groupIndex, 1);

    mainGroup.remove();

    const viewMainGroup = document.querySelector(`#view-mode .main-group[data-group-id="${groupId}"]`);

    if (viewMainGroup) {

        viewMainGroup.remove();

    }

    saveComboData();

}

// 大見出しの並び順を保存
function saveMainGroupOrder() {

    const mainGroups = document.querySelectorAll("#edit-mode .main-group");

    const groupMap = new Map(comboData.groups.map(group => [group.id, group]));

    comboData.groups = Array.from(mainGroups)
        .map(mainGroup => groupMap.get(mainGroup.dataset.groupId))
        .filter(Boolean);

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

        const viewMainGroup = viewContainer.querySelector(`.main-group[data-group-id="${groupId}"]`);

        if (viewMainGroup) {

            viewContainer.appendChild(viewMainGroup);

        }

    });

}

/* ---------- 中見出し編集 ---------- */

// 中見出し編集開始
async function startSubGroupEdit(subGroup) {

    // 編集中の見出し・コンボカードがある場合は完了
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

    // 親の大見出しを取得
    const mainGroup = editingSubGroup.closest(".main-group");

    const groupId = mainGroup.dataset.groupId;

    // comboDataから親の大見出しを取得
    const targetGroup = comboData.groups.find(group => group.id === groupId);

    if (!targetGroup) {

        console.error("親の大見出しがcomboDataに見つかりません:", groupId);

        return false;

    }

    // comboDataから該当する中見出しを取得
    const targetSubGroup = targetGroup.subgroups.find(subGroup => subGroup.id === subgroupId);

    if (!targetSubGroup) {

        console.error("中見出しがcomboDataに見つかりません:", subgroupId);

        return false;

    }

    // comboDataを更新
    targetSubGroup.title = title;

    // 編集モード側
    const editTitleText = editingSubGroup.querySelector(".sub-group-title-text");

    editTitleText.textContent = title;

    // 閲覧モード側
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

    // localStorageへ保存
    saveComboData();

    return true;

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

    setupComboKeyboardSort(subGroupElement);

    return subGroupElement;

}

// 閲覧モードに中見出しを追加
function addViewSubGroup(subGroup, mainGroup) {

    const subGroupElement = createViewSubGroup(subGroup);

    const mainGroupContent = mainGroup.querySelector(".main-group-content");

    mainGroupContent.appendChild(subGroupElement);

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
function createNewSubGroup(mainGroup) {

    const groupId = mainGroup.dataset.groupId;

    const targetGroup = comboData.groups.find(group => group.id === groupId);

    if (!targetGroup) {

        console.error("親の大見出しがcomboDataに見つかりません:", groupId);

        return null;

    }

    const subGroup = {

        id: crypto.randomUUID(),
        title: "新しい中見出し",
        combos: []

    };

    // comboDataを更新
    targetGroup.subgroups.push(subGroup);

    // 閲覧モードに追加
    const viewMainGroup = document.querySelector(`#view-mode .main-group[data-group-id="${groupId}"]`);

    if (viewMainGroup) {

        addViewSubGroup(subGroup, viewMainGroup);

    }

    // 編集モードに追加
    const newSubGroup = addEditSubGroup(subGroup, mainGroup);

    // localStorageへ保存
    saveComboData();

    return newSubGroup;

}

// 中見出し削除
function deleteSubGroup(subGroup) {

    const subgroupId = subGroup.dataset.subgroupId;

    const mainGroup = subGroup.closest(".main-group");

    const groupId = mainGroup.dataset.groupId;

    const targetGroup = comboData.groups.find(group => group.id === groupId);

    if (!targetGroup) {

        console.error("親の大見出しがcomboDataに見つかりません:", groupId);

        return;

    }

    const subgroupIndex = targetGroup.subgroups.findIndex(subGroup => subGroup.id === subgroupId);

    if (subgroupIndex === -1) {

        console.error("中見出しがcomboDataに見つかりません:", subgroupId);

        return;

    }

    // comboDataから削除
    targetGroup.subgroups.splice(subgroupIndex, 1);

    // 編集モード側
    subGroup.remove();

    // 閲覧モード側
    const viewMainGroup = document.querySelector(`#view-mode .main-group[data-group-id="${groupId}"]`);

    if (viewMainGroup) {

        const viewSubGroup = viewMainGroup.querySelector(`.sub-group[data-subgroup-id="${subgroupId}"]`);

        if (viewSubGroup) {

            viewSubGroup.remove();

        }

    }

    // localStorageへ保存
    saveComboData();

}

// 中見出しの並び順を保存
function saveSubGroupOrder(mainGroup) {

    const subGroups = mainGroup.querySelectorAll(".sub-group");

    const targetGroup = comboData.groups.find(group => group.id === mainGroup.dataset.groupId);

    if (!targetGroup) {

        console.error("親の大見出しがcomboDataに見つかりません:", mainGroup.dataset.groupId);

        return;

    }

    const subGroupMap = new Map(targetGroup.subgroups.map(subGroup => [subGroup.id, subGroup]));

    targetGroup.subgroups = Array.from(subGroups)
        .map(subGroup => subGroupMap.get(subGroup.dataset.subgroupId))
        .filter(Boolean);

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

/* ---------- 見出し共通編集 ---------- */

// 見出しinput幅自動調節
function adjustHeadingInputWidth(input) {

    input.style.width = "auto";

    const minWidth = 120;
    const maxWidth = input.parentElement.clientWidth - 76;

    const width = Math.min(
        Math.max(input.scrollWidth, minWidth),
        maxWidth
    );

    input.style.width = width + "px";

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

            showDeleteConfirm(
                "このコンボを削除しますか？",
                () => deleteCombo(comboItem)
            );

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

            showDeleteConfirm(
                "この大見出しを削除しますか？",
                () => deleteMainGroup(mainGroup)
            );

        });

    // input幅自動調節
    const input = mainGroup.querySelector(".main-group-title-input");

    if (input) {

        adjustHeadingInputWidth(input);

        input.addEventListener("input", function () {

            adjustHeadingInputWidth(this);

        });

    }
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

            showDeleteConfirm(
                "この中見出しを削除しますか？",
                () => deleteSubGroup(subGroup)
            );

        });

    // input幅自動調節
    const input = subGroup.querySelector(".sub-group-title-input");

    if (input) {

        adjustHeadingInputWidth(input);

        input.addEventListener("input", function () {

            adjustHeadingInputWidth(this);

        });

    }
}

// 中見出し追加ボタンのイベント設定
function setupAddSubGroupButton(mainGroup) {

    mainGroup
        .querySelector(".add-subheading-button")
        .addEventListener("click", function () {

            createNewSubGroup(mainGroup);

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

// 大見出し並び替えイベント設定
function setupMainGroupSortable() {

    const mainGroupContainer = document.querySelector("#edit-mode .combo-container");

    new Sortable(mainGroupContainer, {

        animation: 150,

        draggable: ".main-group",

        handle: ".main-group-sort-handle",

        onEnd: function () {

            saveMainGroupOrder();

            syncViewMainGroupOrder();

            saveComboData();

        }

    });

}

function setupMainGroupKeyboardSort() {

    const mainGroupContainer =
        document.querySelector("#edit-mode .combo-container");

    mainGroupContainer
        .querySelectorAll(".main-group-sort-handle")
        .forEach(handle => {

            handle.addEventListener("keydown", function (event) {

                if (event.key !== "ArrowUp" &&
                    event.key !== "ArrowDown") {

                    return;

                }

                event.preventDefault();

                const mainGroup = handle.closest(".main-group");

                if (!mainGroup) {
                    return;
                }

                if (event.key === "ArrowUp") {

                    const previousGroup =
                        mainGroup.previousElementSibling;

                    if (previousGroup) {

                        mainGroupContainer.insertBefore(
                            mainGroup,
                            previousGroup
                        );

                    }

                }

                if (event.key === "ArrowDown") {

                    const nextGroup =
                        mainGroup.nextElementSibling;

                    if (nextGroup) {

                        mainGroupContainer.insertBefore(
                            nextGroup,
                            mainGroup
                        );

                    }

                }

                saveMainGroupOrder();

                syncViewMainGroupOrder();

                saveComboData();

                handle.focus();

            });

        });

}

// 中見出し並び替えイベント設定
function setupSubGroupSortable(mainGroup) {

    const mainGroupContent = mainGroup.querySelector(".main-group-content");

    new Sortable(mainGroupContent, {

        animation: 150,

        draggable: ".sub-group",

        handle: ".sub-group-sort-handle",

        onEnd: function () {

            saveSubGroupOrder(mainGroup);

            syncViewSubGroupOrder(mainGroup);

            saveComboData();

        }

    });

}

function setupSubGroupKeyboardSort(mainGroup) {

    const mainGroupContent = mainGroup.querySelector(".main-group-content");

    mainGroupContent
        .querySelectorAll(".sub-group-sort-handle")
        .forEach(handle => {

            handle.addEventListener("keydown", function (event) {

                if (event.key !== "ArrowUp" && event.key !== "ArrowDown") {

                    return;

                }

                event.preventDefault();

                const subGroup = handle.closest(".sub-group");

                if (!subGroup) {
                    return;
                }

                if (event.key === "ArrowUp") {

                    const previousGroup = subGroup.previousElementSibling;

                    if (previousGroup) {

                        mainGroupContent.insertBefore(subGroup, previousGroup);

                    }

                }

                if (event.key === "ArrowDown") {

                    const nextGroup = subGroup.nextElementSibling;

                    if (nextGroup) {

                        mainGroupContent.insertBefore(nextGroup, subGroup);

                    }

                }

                saveSubGroupOrder(mainGroup);

                syncViewSubGroupOrder(mainGroup);

                saveComboData();

                handle.focus();

            });

        });

}

// コンボ並び替えイベント設定
function setupComboSortable(subGroup) {

    const comboList = subGroup.querySelector(".combo-list");

    new Sortable(comboList, {

        animation: 150,

        draggable: ".combo-item",

        handle: ".combo-sort-handle",

        onEnd: function () {

            saveComboOrder(comboList);

            syncViewComboOrder(comboList);

            saveComboData();

        }

    });

}

function setupComboKeyboardSort(subGroup) {

    const comboList = subGroup.querySelector(".combo-list");

    comboList.querySelectorAll(".combo-sort-handle").forEach(handle => {

        handle.addEventListener("keydown", function (event) {

            if (event.key !== "ArrowUp" && event.key !== "ArrowDown") {

                return;

            }

            event.preventDefault();

            const comboItem = handle.closest(".combo-item");

            if (!comboItem) {
                return;
            }

            if (event.key === "ArrowUp") {

                const previousItem = comboItem.previousElementSibling;

                if (previousItem) {

                    comboList.insertBefore(comboItem, previousItem);

                }

            }

            if (event.key === "ArrowDown") {

                const nextItem = comboItem.nextElementSibling;

                if (nextItem) {

                    comboList.insertBefore(nextItem, comboItem);

                }

            }

            saveComboOrder(comboList);

            syncViewComboOrder(comboList);

            saveComboData();

            handle.focus();

        });

    });

}

// イベント登録
function registerEvents() {

    /* データ管理 */

    dataManagementButton.addEventListener(
        "click",
        openDataManagementModal
    );

    dataExportButton.addEventListener(
        "click",
        openDataExportModal
    );

    dataManagementCloseButton.addEventListener(
        "click",
        closeDataManagementModal
    );

    dataExportCancelButton.addEventListener(
        "click",
        closeDataExportModal
    );

    dataExportExecuteButton.addEventListener(
        "click",
        executeDataExport
    );

    dataExportCopyButton.addEventListener(
        "click",
        copyExportText
    );

    dataExportResultCloseButton.addEventListener(
        "click",
        closeDataExportResultModal
    );

    dataImportButton.addEventListener(
        "click",
        openDataImportModal
    );

    dataImportCancelButton.addEventListener(
        "click",
        closeDataImportModal
    );

    dataImportNextButton.addEventListener(
        "click",
        proceedDataImport
    );

    dataImportFileCancelButton.addEventListener(
        "click",
        closeDataImportFileModal
    );

    dataImportFileExecuteButton.addEventListener(
        "click",
        executeDataImportFile
    );

    dataImportTextCancelButton.addEventListener(
        "click",
        closeDataImportTextModal
    );

    dataImportTextExecuteButton.addEventListener(
        "click",
        executeDataImportText
    );

    dataImportCheckCancelButton.addEventListener(
        "click",
        function () {
            dataImportCheckModal.classList.remove("is-open");
        }
    );

    dataImportCheckNextButton.addEventListener(
        "click",
        function () {
            dataImportCheckModal.classList.remove("is-open");
            dataImportConfirmModal.classList.add("is-open");
            dataImportConfirmExecuteButton.focus();
        }
    );

    dataImportConfirmCancelButton.addEventListener(
        "click",
        function () {
            dataImportConfirmModal.classList.remove("is-open");
        }
    );

    dataImportConfirmExecuteButton.addEventListener(
        "click",
        executeDataImport
    );

    dataClearButton.addEventListener(
        "click",
        openDataClearModal
    );

    document.querySelectorAll('input[name="clear-target"]').forEach(function (radio) {
        radio.addEventListener(
            "change",
            updateDataClearModeVisibility
        );
    });

    dataClearCancelButton.addEventListener(
        "click",
        closeDataClearModal
    );

    dataClearNextButton.addEventListener(
        "click",
        openDataClearConfirmModal
    );

    dataClearConfirmCancelButton.addEventListener(
        "click",
        closeDataClearConfirmModal
    );

    dataClearConfirmExecuteButton.addEventListener(
        "click",
        executeDataClear
    );

    setupModalFocusTrap(dataManagementModal, closeDataManagementModal);

    setupModalFocusTrap(dataExportModal, closeDataExportModal);

    setupModalFocusTrap(dataExportResultModal, closeDataExportResultModal);

    setupModalFocusTrap(dataImportModal, closeDataImportModal);

    setupModalFocusTrap(dataImportFileModal, closeDataImportFileModal);

    setupModalFocusTrap(dataImportTextModal, closeDataImportTextModal);

    setupModalFocusTrap(
        dataImportCheckModal,
        function () {
            dataImportCheckModal.classList.remove("is-open");
        }
    );

    setupModalFocusTrap(
        dataImportConfirmModal,
        function () {
            dataImportConfirmModal.classList.remove("is-open");
        }
    );

    setupModalFocusTrap(dataClearModal, closeDataClearModal);

    setupModalFocusTrap(dataClearConfirmModal, closeDataClearConfirmModal);

    /* 閲覧/編集モード切替 */

    editModeButton.addEventListener("click", function () {

        syncDetailsState(viewMode, editMode);

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

        syncDetailsState(editMode, viewMode);

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

    // コンボカード表示
    document.querySelectorAll(".combo-item").forEach(comboItem => {

        setupComboTexts(comboItem, { moves: JSON.parse(comboItem.dataset.moves) });

    });

    // コンボカードイベント登録
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
        setupComboKeyboardSort(subGroup);

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

    addHeadingButton.addEventListener("click", function () {

        createNewMainGroup();

    });

    // 大見出し並び替え
    setupMainGroupSortable();
    setupMainGroupKeyboardSort();

    /* 中見出し編集 */

    // 中見出しイベント登録
    document.querySelectorAll("#edit-mode .sub-group").forEach(subGroup => {

        setupEditSubGroupEvents(subGroup);

    });

    // 中見出し並び替え
    document.querySelectorAll("#edit-mode .main-group").forEach(mainGroup => {

        setupSubGroupSortable(mainGroup);
        setupSubGroupKeyboardSort(mainGroup);

    });

}

// キーボード操作
// 編集中のEscキー操作
document.addEventListener("keydown", function (event) {

    if (event.key !== "Escape") {
        return;
    }

    // 技一覧パネル表示中
    if (document.body.classList.contains("move-selector-open")) {
        closeMoveSelectorPanel();
        return;
    }

    // コンボ編集中
    if (editingComboItem) {
        cancelComboEdit();
        return;
    }

    // 大見出し編集中
    if (editingMainGroup) {
        cancelGroupEdit();
        return;
    }

    // 中見出し編集中
    if (editingSubGroup) {
        cancelSubGroupEdit();
        return;
    }

});

/* =========================
   イベント登録
========================= */

// イベント登録
registerEvents();

// comboDataを画面へ反映
renderComboData();

// 初回のみlocalStorageへ保存
if (isFirstLoad) {

    saveComboData();

}
