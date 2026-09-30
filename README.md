# らくらくコンボメモ

Street Fighter 6 のコンボを整理・登録できるWebアプリです。

キャラクターごとにコンボを分類して管理し、必要なコンボを探しやすくすることを目的としています。

## Features

* キャラクターごとのコンボ管理
* 大見出し・中見出しによるコンボの整理
* コンボの追加・編集・削除
* コンボの並び替え
* Classic / Modern の技データに対応
* コマンド表示・技名表示の切り替え
* PC・スマートフォンで利用可能なレスポンシブUI

## Requirements

* Python 3.x
* Flask

## Setup

### 1. リポジトリを取得

GitHubからリポジトリを取得します。

### 2. 仮想環境を作成

プロジェクトフォルダで以下を実行します。

```bash
python -m venv .venv
```

### 3. 仮想環境を有効化

Windows PowerShellの場合：

```powershell
.venv\Scripts\Activate.ps1
```

### 4. 必要なパッケージをインストール

```bash
pip install -r requirements.txt
```

### 5. アプリを起動

```bash
python app.py
```

ブラウザで以下にアクセスします。

```text
http://127.0.0.1:5000
```

## Data

キャラクター・技・コンボのデータ
