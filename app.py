from flask import Flask, render_template
import json
from pathlib import Path

# Flaskアプリを作成
app = Flask(__name__)


# ホーム画面
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

# 開発中のみ実行
if __name__ == "__main__":
    app.run(debug=True)