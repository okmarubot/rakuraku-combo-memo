from flask import Flask, render_template, request, jsonify
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

# コンボ追加
@app.route("/character/<character_id>/new-combo", methods=["POST"])

def new_combo(character_id):

    combos_path = Path(f"data/sf6/combos/{character_id}.json")

    with open(combos_path, "r", encoding="utf-8") as file:
        combos = json.load(file)

    max_number = 0

    for group in combos["groups"]:
        for subgroup in group["subgroups"]:
            for combo in subgroup["combos"]:

                number = int(combo["id"].replace("combo-", ""))

                if number > max_number:
                    max_number = number

    new_id = f"combo-{max_number + 1:03d}"

    new_combo = {

        "id": new_id,
        "moves": [],
        "memo": ""

    }

    combos["groups"][0]["subgroups"][0]["combos"].append(new_combo)

    with open(combos_path, "w", encoding="utf-8") as file:

        json.dump(
            combos,
            file,
            ensure_ascii=False,
            indent=4
        )

    return jsonify(new_combo)

# コンボ削除
@app.route(
    "/character/<character_id>/delete-combo",
    methods=["POST"]
)

def delete_combo(character_id):

    data = request.get_json()

    combos_path = Path(f"data/sf6/combos/{character_id}.json")

    with open(combos_path, "r", encoding="utf-8") as file:
        combos = json.load(file)

    for group in combos["groups"]:
        for subgroup in group["subgroups"]:
            
            subgroup["combos"] = [

                combo
                for combo in subgroup["combos"]
                if combo["id"] != data["id"]

            ]

    with open(combos_path, "w", encoding="utf-8") as file:

        json.dump(
            combos,
            file,
            ensure_ascii=False,
            indent=4
        )

    return jsonify({

        "success": True

    })

# コンボ並び替え
@app.route(
    "/character/<character_id>/sort-combos",
    methods=["POST"]
)

def sort_combos(character_id):

    data = request.get_json()

    combos_path = Path(f"data/sf6/combos/{character_id}.json")

    with open(combos_path, "r", encoding="utf-8") as file:
        combos = json.load(file)

    combo_order = data["comboOrder"]

    for group in combos["groups"]:
        for subgroup in group["subgroups"]:

            combo_dict = {}

            for combo in subgroup["combos"]:
                combo_dict[combo["id"]] = combo

            subgroup["combos"] = []

            for combo_id in combo_order:

                if combo_id in combo_dict:
                    subgroup["combos"].append(combo_dict[combo_id])

    with open(combos_path, "w", encoding="utf-8") as file:

        json.dump(
            combos,
            file,
            ensure_ascii=False,
            indent=4
        )

    return jsonify({

        "success": True

    })

# コンボ編集
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

        data = request.get_json()

        combos_path = Path(f"data/sf6/combos/{character_id}.json")

        with open(combos_path, "r", encoding="utf-8") as file:
            combos = json.load(file)

        found_combo = None

        for group in combos["groups"]:
            for subgroup in group["subgroups"]:
                for combo in subgroup["combos"]:

                    if combo["id"] == data["id"]:
                        found_combo = combo
                        break

        if found_combo is None:

            return jsonify({
                "success": False,
                "message": "コンボが見つかりません"
            }), 404

        found_combo["moves"] = data["moves"]
        found_combo["memo"] = data["memo"]

        response = {

            "success": True

        }

        with open(combos_path, "w", encoding="utf-8") as file:

            json.dump(
                combos,
                file,
                ensure_ascii=False,
                indent=4
            )

        return jsonify(response)
    
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
        combos=combos,
        common_moves=common_moves,
        character_moves=character_moves
    )

# ==========================
# 開発中のみ実行
# ==========================
if __name__ == "__main__":
    app.run(debug=True)