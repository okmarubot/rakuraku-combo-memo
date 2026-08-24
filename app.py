from flask import Flask, render_template, request, jsonify
import json
from pathlib import Path

DATA_DIR = Path("data/sf6")

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
# コンボ表示文字列作成
def build_command_text(moves, common_moves, character_moves):

    command_list = []

    # 技データをまとめる
    all_moves = common_moves + character_moves

    for move_id in moves:

        for move in all_moves:

            # 通常の技
            if move["id"] == move_id:

                command_list.append(move["command"])

                break

            # variants内の技
            if "variants" in move:

                for variant in move["variants"]:

                    if variant["id"] == move_id:

                        command_list.append(variant["command"])

                        break

                else:
                    continue

                break

    return " ⏵ ".join(command_list)


def build_name_text(moves, common_moves, character_moves):

    name_list = []

    # 技データをまとめる
    all_moves = common_moves + character_moves

    for move_id in moves:

        for move in all_moves:

            # 通常の技
            if move["id"] == move_id:

                name_list.append(move["name"])

                break

            # variants内の技
            if "variants" in move:

                for variant in move["variants"]:

                    if variant["id"] == move_id:

                        name_list.append(variant["name"])

                        break

                else:
                    continue

                break

    return " ⏵ ".join(name_list)

def prepare_combo_display(
    combos,
    common_moves,
    character_moves
):

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

# コンボデータ読込
def load_combos(character_id, mode="classic"):

    if mode == "modern":
        file_name = f"{character_id}_modern.json"
    else:
        file_name = f"{character_id}.json"

    combos_path = DATA_DIR / "combos" / file_name

    if not combos_path.exists():
        return []

    with open(combos_path, "r", encoding="utf-8") as f:
        return json.load(f)

# コンボデータ保存
def save_combos(character_id, combos, mode="classic"):

    if mode == "modern":
        file_name = f"{character_id}_modern.json"
    else:
        file_name = f"{character_id}.json"

    combos_path = DATA_DIR / "combos" / file_name

    with open(combos_path, "w", encoding="utf-8") as f:
        json.dump(combos, f, ensure_ascii=False, indent=4)

# その他データ読込
def load_character(character_id):

    character_path = Path(
        DATA_DIR / "characters" / f"{character_id}.json"
    )

    with open(character_path, "r", encoding="utf-8") as file:
        return json.load(file)

def load_common_moves(mode="classic"):

    if mode == "modern":
        file_name = "common_modern.json"
    else:
        file_name = "common.json"

    path = DATA_DIR / "moves" / file_name
    
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def load_character_moves(character_id, mode="classic"):

    if mode == "modern":
        file_name = f"{character_id}_modern.json"
    else:
        file_name = f"{character_id}.json"

    path = DATA_DIR / "moves" / file_name

    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

# ==========================
# キャラクター画面
# ==========================

# コンボ追加
@app.route("/character/<character_id>/new-combo", methods=["POST"])
def new_combo(character_id):

    data = request.get_json()

    group_id = data["groupId"]
    subgroup_id = data["subgroupId"]

    mode = request.args.get("mode", "classic")

    combos = load_combos(character_id, mode)

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

    # 追加先を探す
    for group in combos["groups"]:

        if group["id"] != group_id:
            continue

        for subgroup in group["subgroups"]:

            if subgroup["id"] != subgroup_id:
                continue

            subgroup["combos"].append(new_combo)

            save_combos(character_id, combos, mode)

            return jsonify(new_combo)

    return jsonify({

        "success": False,
        "message": "追加先の中見出しが見つかりません"

    }), 404

# コンボ削除
@app.route("/character/<character_id>/delete-combo", methods=["POST"])

def delete_combo(character_id):

    data = request.get_json()

    mode = request.args.get("mode", "classic")

    combos = load_combos(character_id, mode)
    
    for group in combos["groups"]:
        for subgroup in group["subgroups"]:
            
            subgroup["combos"] = [

                combo
                for combo in subgroup["combos"]
                if combo["id"] != data["id"]

            ]

    save_combos(character_id, combos, mode)

    return jsonify({

        "success": True

    })

# コンボ並び替え
@app.route("/character/<character_id>/sort-combos", methods=["POST"])

def sort_combos(character_id):

    data = request.get_json()

    mode = request.args.get("mode", "classic")

    combos = load_combos(character_id, mode)

    group_id = data["groupId"]
    subgroup_id = data["subgroupId"]
    combo_order = data["comboOrder"]

    # 対象の大見出しを探す
    for group in combos["groups"]:

        if group["id"] != group_id:
            continue

        # 対象の中見出しを探す
        for subgroup in group["subgroups"]:

            if subgroup["id"] != subgroup_id:
                continue

            combo_dict = {}

            for combo in subgroup["combos"]:
                combo_dict[combo["id"]] = combo

            new_combos = []

            # 並び替え後の順番で追加
            for combo_id in combo_order:

                if combo_id in combo_dict:

                    new_combos.append(
                        combo_dict[combo_id]
                    )

            subgroup["combos"] = new_combos

            save_combos(character_id, combos, mode)

            return jsonify({
                "success": True
            })

    return jsonify({

        "success": False,
        "message": "並び替え対象の中見出しが見つかりません"

    }), 404

# 大見出し追加
@app.route("/character/<character_id>/new-main-group", methods=["POST"])

def new_main_group(character_id):

    mode = request.args.get("mode", "classic")

    combos = load_combos(character_id, mode)

    max_number = 0

    for group in combos["groups"]:

        number = int(group["id"].replace("group-", ""))

        if number > max_number:
            max_number = number

    new_id = f"group-{max_number + 1:03d}"

    new_group = {

        "id": new_id,
        "title": "新しい大見出し",
        "subgroups": []

    }

    combos["groups"].append(new_group)

    save_combos(character_id, combos, mode)

    return jsonify(new_group)

# 大見出し削除
@app.route("/character/<character_id>/delete-main-group", methods=["POST"])

def delete_main_group(character_id):

    data = request.get_json()

    mode = request.args.get("mode", "classic")

    combos = load_combos(character_id, mode)

    group_id = data["id"]

    combos["groups"] = [

        group
        for group in combos["groups"]
        if group["id"] != group_id

    ]

    save_combos(character_id, combos, mode)

    return jsonify({

        "success": True

    })

# 大見出し並び替え
@app.route("/character/<character_id>/sort-main-groups", methods=["POST"])

def sort_main_groups(character_id):

    data = request.get_json()

    mode = request.args.get("mode", "classic")

    combos = load_combos(character_id, mode)

    group_order = data["groupOrder"]

    group_dict = {}

    for group in combos["groups"]:
        group_dict[group["id"]] = group

    combos["groups"] = []

    for group_id in group_order:

        if group_id in group_dict:
            combos["groups"].append(group_dict[group_id])

    save_combos(character_id, combos, mode)

    return jsonify({

        "success": True

    })

# 中見出し追加
@app.route("/character/<character_id>/new-subgroup", methods=["POST"])

def new_subgroup(character_id):

    data = request.get_json()

    group_id = data["groupId"]

    mode = request.args.get("mode", "classic")

    combos = load_combos(character_id, mode)

    # 既存の中見出しIDから最大番号を取得
    max_number = 0

    for group in combos["groups"]:

        for subgroup in group["subgroups"]:

            number = int(
                subgroup["id"].replace("subgroup-", "")
            )

            if number > max_number:
                max_number = number

    new_id = f"subgroup-{max_number + 1:03d}"

    new_subgroup = {

        "id": new_id,
        "title": "新しい中見出し",
        "combos": []

    }

    # 追加先の大見出しを探す
    for group in combos["groups"]:

        if group["id"] != group_id:
            continue

        group["subgroups"].append(new_subgroup)

        save_combos(character_id, combos, mode)

        return jsonify(new_subgroup)

    return jsonify({

        "success": False,
        "message": "追加先の大見出しが見つかりません"

    }), 404

# 中見出し削除
@app.route("/character/<character_id>/delete-sub-group", methods=["POST"])

def delete_sub_group(character_id):

    data = request.get_json()

    mode = request.args.get("mode", "classic")

    combos = load_combos(character_id, mode)

    subgroup_id = data["id"]

    for group in combos["groups"]:

        group["subgroups"] = [

            subgroup
            for subgroup in group["subgroups"]
            if subgroup["id"] != subgroup_id

        ]

    save_combos(character_id, combos, mode)

    return jsonify({

        "success": True

    })

# 中見出し並び替え
@app.route("/character/<character_id>/sort-subgroups", methods=["POST"])

def sort_subgroups(character_id):

    data = request.get_json()

    mode = request.args.get("mode", "classic")

    combos = load_combos(character_id, mode)

    group_id = data["groupId"]
    sub_group_order = data["subGroupOrder"]

    for group in combos["groups"]:

        if group["id"] != group_id:
            continue

        sub_group_dict = {}

        for subgroup in group["subgroups"]:

            sub_group_dict[subgroup["id"]] = subgroup

        group["subgroups"] = []

        for subgroup_id in sub_group_order:

            if subgroup_id in sub_group_dict:

                group["subgroups"].append(
                    sub_group_dict[subgroup_id]
                )

        break

    save_combos(character_id, combos, mode)

    return jsonify({
        "success": True
    })

# コンボ編集
@app.route("/character/<character_id>", methods=["GET","POST"])

def character(character_id):

    # POST処理
    if request.method == "POST":

        data = request.get_json()

        mode = request.args.get("mode", "classic")

        combos = load_combos(character_id, mode)

        # 大見出し編集
        if data.get("type") == "main-group":

            found_group = None

            for group in combos["groups"]:

                if group["id"] == data["id"]:

                    found_group = group
                    break

            if found_group is None:

                return jsonify({
                    "success": False,
                    "message": "大見出しが見つかりません"
                }), 404

            found_group["title"] = data["title"]

            save_combos(character_id, combos, mode)

            return jsonify({
                "success": True
            })

        # 中見出し編集
        if data.get("type") == "sub-group":

            found_subgroup = None

            for group in combos["groups"]:
                for subgroup in group["subgroups"]:

                    if subgroup["id"] == data["id"]:

                        found_subgroup = subgroup
                        break

                if found_subgroup is not None:
                    break

            if found_subgroup is None:

                return jsonify({
                    "success": False,
                    "message": "中見出しが見つかりません"
                }), 404

            found_subgroup["title"] = data["title"]

            save_combos(character_id, combos, mode)

            return jsonify({
                "success": True
            })

        # コンボ編集
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

        save_combos(character_id, combos, mode)

        return jsonify({
            "success": True
        })

    # データ読み込み

    # modeを取得
    mode = request.args.get("mode", "classic")

    if mode not in ("classic", "modern"):
        mode = "classic"

    character = load_character(character_id)

    common_moves = load_common_moves(mode)

    character_moves = load_character_moves(character_id, mode)

    combos = load_combos(character_id, mode)

    # コンボ表示文字列作成  
    prepare_combo_display(
        combos,
        common_moves,
        character_moves
    )

    # 画面表示
    return render_template(
        "character.html",
        character=character,
        combos=combos,
        common_moves=common_moves,
        character_moves=character_moves,
        mode=mode
    )

# ==========================
# 開発中のみ実行
# ==========================
if __name__ == "__main__":
    app.run(debug=True)