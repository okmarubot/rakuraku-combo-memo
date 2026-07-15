console.log("script.js が読み込まれました");

const viewMode = document.getElementById("view-mode");
const editMode = document.getElementById("edit-mode");

const modeButtons = document.querySelectorAll(".mode-button");

modeButtons[0].addEventListener("click", function () {

    viewMode.style.display = "none";
    editMode.style.display = "block";

});

modeButtons[1].addEventListener("click", function () {

    editMode.style.display = "none";
    viewMode.style.display = "block";

});

let commandMode = true;

const displayButtons = document.querySelectorAll(".display-button");

displayButtons.forEach(button => {
    button.addEventListener("click", function () {

        commandMode = !commandMode;

        const comboTexts = document.querySelectorAll(".combo-text");

        comboTexts.forEach(combo => {

            if (commandMode) {
                combo.textContent = combo.dataset.command;
            } else {
                combo.textContent = combo.dataset.name;
            }

        })

    })

})