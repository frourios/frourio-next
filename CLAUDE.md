# FrourioNext プロジェクト開発ガイドライン

このドキュメントは、FrourioNext プロジェクトの開発を効率的に進めるためのルールや情報を提供します。
コメントをソースコードとテストコードに一切記述してはならない。

## 1. プロジェクト構成の概要

### `projects/` ディレクトリ

*   **役割:** このディレクトリは、FrourioNext の様々な機能や設定パターンをテストするためのサンプル Next.js プロジェクトを含んでいます。
*   **構成:**
    *   `basic/`: App Router の基本的な構成を持つプロジェクト。
    *   `src-dir/`: `src` ディレクトリを使用する構成のプロジェクト。
    *   各プロジェクト内には、`app/` (または `src/app/`) ディレクトリがあり、実際の Next.js アプリケーションのルーティング構造に従って `frourio.ts` や `route.ts` が配置されています。
*   **目的:** 新機能の実装やリファクタリング時に、これらのプロジェクトを使って FrourioNext が期待通りに動作するかを確認します。`tests/` ディレクトリ内のテストコード (例: `index.spec.ts`, `client.spec.ts`) は、これらのプロジェクトを参照して自動テストを実行します。

### `src/` ディレクトリ

*   **役割:** FrourioNext のコア機能（型定義、コード生成ロジック、CLI コマンドなど）を実装するソースコードが含まれています。
*   **`src/index.ts`:** このファイルは、`@frourio/next` パッケージとして外部に公開される主要な型定義 (`FrourioSpec`, `FrourioClientOption` など) をエクスポートします。`projects/` 内の `frourio.ts` ファイルでは、API 仕様を定義するために `import type { FrourioSpec } from '@frourio/next'` のようにしてこれらの型を参照します。

### `tests/` ディレクトリ

*   **役割:** FrourioNext のユニットテストおよび結合テストを格納します。
*   **構成:** `vitest` を使用してテストが記述されています。`projects/` ディレクトリ内のサンプルプロジェクトを利用して、コード生成、API ハンドラの動作、クライアントの挙動などを検証します。

## 2. 開発フロー: API ルートの作成とコード生成

FrourioNext を使用して API ルートを開発する際の基本的な流れは以下の通りです。

*   **作業前に確認すべきファイル:**
    *   `src/index.ts`
    *   `tests/**spec.ts`
    *   `projects/basic/app/frourio.ts`
    *   `projects/basic/app/route.ts`
    *   `projects/basic/app/frourio.server.ts`
    *   `projects/basic/app/frourio.client.ts`

*   **API 仕様定義 (`frourio.ts`):**
    *   Next.js の App Router のルーティング規則に従って、対応するディレクトリ (例: `app/api/users/[userId]/`) に `frourio.ts` ファイルを作成します。
    *   `@frourio/next` から `FrourioSpec` 型をインポートし、Zod スキーマを使ってパスパラメータ (`param`)、クエリパラメータ (`query`)、リクエストヘッダ (`headers`)、リクエストボディ (`body`)、レスポンス (`res`) の型とバリデーションルールを定義します。
    *   必要に応じてミドルウェア (`middleware`) の設定もここで行います。

*   **API 実装 (`route.ts`):**
    *   `frourio.ts` と同じディレクトリに `route.ts` ファイルを作成します。
    *   後述のコード生成ステップで自動生成される `./frourio.server` から `createRoute` ヘルパー関数をインポートします。
    *   `createRoute` を使用して、`frourio.ts` で定義した HTTP メソッド (GET, POST など) に対応するハンドラ関数を実装します。ハンドラ関数は、バリデーション済みのリクエストデータ (型安全) を引数として受け取ります。

*   **コード生成 (`npm run generate` または `npm run dev`):**
    *   `frourio.ts` と `route.ts` を作成・編集した後、ターミナルで `npm run generate` コマンドを実行します (srcの内容を変更した場合には `npm run dev` でロジックが更新され、その後ファイルが生成されます)。
    *   このコマンドは内部的に `projects/dev.ts` を実行し、`frourio-next` CLI の機能によって以下のファイルを自動生成・更新します。
        *   **`.server.ts` (例: `frourio.server.ts`):** `route.ts` で使用する `createRoute` ヘルパー関数が含まれます。このヘルパーは、対応する `frourio.ts` の定義に基づいてリクエスト/レスポンスのバリデーションを自動的に行います。
        *   **`.client.ts` (例: `frourio.client.ts`):** 型安全な API クライアント関数 (`fc`, `$fc`) が含まれます。これらのクライアントは、フロントエンドや他のサーバーサイドコードから API を呼び出す際に使用でき、コンパイル時に型チェックが行われます。ルートディレクトリ (`app/` や `src/app/`) にも、プロジェクト全体の API クライアントを集約した `.client.ts` が生成されます。
        *   **`public/openapi.json`:** `projects/dev.ts` はさらに `bin/openapi.js` を実行します。これは `src/openapi` ディレクトリ内のロジック (`src/openapi/generateOpenapi.ts` など) を利用し、各プロジェクト (`projects/*`) の `frourio.ts` ファイルを解析して、API の OpenAPI v3.1 仕様を記述した `public/openapi.json` ファイルを生成・更新します。

## 3. その他の効率化情報

*   **テストの実行:**
    *   コードを変更した際は、`npm test` を実行して既存のテストがすべてパスすることを確認してください。このコマンドは `vitest run --coverage` を実行し、テストとカバレッジレポート生成を行います。
    *   特定のテストファイルのみを実行したい場合は、`npm test -- <テストファイルのパス>` のようにコマンドライン引数でパスを指定します (例: `npm test -- tests/client.spec.ts`)。
*   **コード Lint とフォーマット:**
    *   `npm run lint`: ESLint と Prettier を使用してコードの静的解析とフォーマットチェックを実行します。
    *   `npm run lint:fix`: ESLint と Prettier を使用してコードの自動修正（フォーマット含む）を実行します。
*   **ビルド:** `npm run build` を実行すると、`tsc -p tsconfig.build.json` コマンドにより TypeScript コードが JavaScript にコンパイルされます。
*   **型チェック:** `npm run typecheck` を実行すると、`tsc --noEmit` コマンドによりコードの型チェックのみが行われます。
*   **README.md の更新:** 大きな変更や新機能を追加した場合は、`README.md` も適宜更新してください。
*   **コメント:** ソースコードやテストコードにコメントを書かない。`README.md` にはコメントを書いて良い。