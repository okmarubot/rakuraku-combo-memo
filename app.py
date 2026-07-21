from flask import Flask, render_template, request
import json
from pathlib import Path

# Flaskアプリを作成
app = Flask(__name__)


# ==========================
# ホーム画面
# ==========================
@app.route("/")
def home():
    character_path = Path("data/sf6/characters")

    characters = []

    for file in character_path.glob("*.json"):
        with open(file, encoding="utf-8") as f:
            characters.append(json.load(f))

    return render_template(
        "home.html",
        characters=characters
    )


# ==========================
# 共通関数
# ==========================
def build_command_text(moves, common_moves, character_moves):

    command_list = []

    # 技データをまとめる
    all_moves = common_moves + character_moves

    for move_id in moves:

        for move in all_moves:

            if move["id"] == move_id:

                command_list.append(move["command"])

                break

    return " ⏵ ".join(command_list)


def build_name_text(moves, common_moves, character_moves):

    name_list = []

    # 技データをまとめる
    all_moves = common_moves + character_moves

    for move_id in moves:

        for move in all_moves:

            if move["id"] == move_id:

                name_list.append(move["name"])

                break

    return " ⏵ ".join(name_list)


# ==========================
# キャラクター画面
# ==========================
@app.route(
        "/character/<character_id>",
        methods=["GET","POST"]
)

def character(character_id):

    # ==========================
    # POST
    # ==========================
    # POST処理
    if request.method == "POST":

        print("POSTを受信しました")

    # ==========================
    # データ読み込み
    # ==========================
    # キャラクター
    character_path = Path(f"data/sf6/characters/{character_id}.json")

    with open(character_path, "r", encoding="utf-8") as file:
        character = json.load(file)

    # 共通技
    common_moves_path = Path("data/sf6/moves/common.json")

    with open(common_moves_path, "r", encoding="utf-8") as file:
        common_moves = json.load(file)

    # キャラクター固有技
    character_moves_path = Path(f"data/sf6/moves/{character_id}.json")

    with open(character_moves_path, "r", encoding="utf-8") as file:
        character_moves = json.load(file)

    # コンボ
    combos_path = Path(f"data/sf6/combos/{character_id}.json")

    with open(combos_path, "r", encoding="utf-8") as file:
        combos = json.load(file)

    # ==========================
    # コンボ表示文字列作成
    # ==========================    
    for group in combos["groups"]:

        for subgroup in group["subgroups"]:

            for combo in subgroup["combos"]:

                combo["command"] = build_command_text(
                    combo["moves"],
                    common_moves,
                    character_moves
                )

                combo["name"] = build_name_text(
                    combo["moves"],
                    common_moves,
                    character_moves
                )

    # ==========================
    # 画面表示
    # ==========================
    return render_template(
        "character.html",
        character=character,
        combos=combos
    )


# ==========================
# 開発中のみ実行
# ==========================
if __name__ == "__main__":
    app.run(debug=True)