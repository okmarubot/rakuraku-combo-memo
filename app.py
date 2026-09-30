from flask import Flask, abort, render_template, request
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
@app.route("/character/<character_id>")
def character(character_id):

    # データ読み込み

    # modeを取得
    mode = request.args.get("mode", "classic")

    if mode not in ("classic", "modern"):
        mode = "classic"

    character_path = DATA_DIR / "characters" / f"{character_id}.json"

    if not character_path.exists():
        abort(404)

    character = load_character(character_id)

    character = load_character(character_id)

    common_moves = load_common_moves(mode)

    character_moves = load_character_moves(character_id, mode)

    combos = load_combos(character_id, mode)

    # 画面表示
    return render_template(
        "character.html",
        character=character,
        character_id=character_id,
        combos=combos,
        common_moves=common_moves,
        character_moves=character_moves,
        mode=mode
    )

# ==========================
# 開発中のみ実行
# ==========================
if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)