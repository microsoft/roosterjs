# Development Memo — Math (LaTeX) Support in RoosterJS

## Overview

This work adds **read-only math (LaTeX) support** to RoosterJS, end to end:

1. A **`MathPlugin`** that stores LaTeX in a read-only Content Model entity and renders it via a pluggable renderer.
2. **Demo integration** — toggle the plugin on/off, render with KaTeX, and insert math via side-pane presets.
3. **Markdown → Content Model recognition** — embedded math (including messy ChatGPT-style output) is converted into "dehydrated" `Math` entities (`data-latex` only, no rendering).
4. **New-entity tracking** — `convertMarkdownToContentModel` can report the entities it created.
5. **LaTeX normalization** — runs of `=` are collapsed before rendering.

Math is stored as a **`ContentModelEntity`** whose wrapper element holds the raw LaTeX in a `data-latex` attribute. Convention: **block** math uses a `<div>` wrapper, **inline** math uses a `<span>`. Entity type string is `'Math'`.

Validation for all changes: `yarn test:fast` (315 math/markdown tests pass), `yarn eslint`, `yarn build` (clean + checkdep + normalize + eslint + commonjs + dts + packprod + builddemo).

---

## 1. MathPlugin (`roosterjs-content-model-plugins`)

Read-only math entity plugin. LaTeX is kept in `data-latex`; the plugin renders it whenever a math entity appears (insert, paste, or load of saved content) using a pluggable renderer, so the displayed HTML always stays consistent with the source.

**New files**

-   `lib/math/MathOptions.ts` — `MathRenderer` type `(latex, isBlock, doc) => Node` and `MathOptions` interface.
-   `lib/math/MathPlugin.ts`
    -   `MathEntityType: string = 'Math'`, `data-latex` attribute constant.
    -   `insertMath(latex, isBlock)` — inserts a math entity at the selection via `insertEntity`.
    -   `onPluginEvent` — on `entityOperation` / `newEntity` for a `Math` entity, re-renders from `data-latex`.
    -   `renderMath(wrapper)` — reads `data-latex`, detects block via `wrapper.tagName == 'DIV'`, calls the renderer, replaces wrapper content.
    -   **`normalizeLatex(latex)`** — collapses any run of two-or-more `=` into a single `=` **before** rendering (see §5).
-   `test/math/MathPluginTest.ts` — unit tests (default/custom renderer, isBlock detection, newEntity rendering, non-Math ignored, missing `data-latex`, and the `=`-collapse case). Spies on the deep path `roosterjs-content-model-api/lib/publicApi/entity/insertEntity`.

**Modified**

-   `lib/index.ts` — exports `MathPlugin`, `MathEntityType`, `MathOptions`, `MathRenderer`.

---

## 2. Demo integration (`demo/`)

**KaTeX via CDN** (npm install was blocked in this environment; follows the existing React/FluentUI CDN pattern):

-   `index.html` and `demo/index.html` — KaTeX CSS `<link>` + JS `<script>` from cdnjs.

**Plugin toggle + instantiation**

-   `demo/scripts/controlsV2/plugins/mathRenderer.ts` — new `katexMathRenderer` using the global `katex` (raw-LaTeX fallback if KaTeX is unavailable). By default KaTeX emits **both** a `.katex-html` (visual) and a `.katex-mathml` (accessibility) copy; to keep only one, the renderer passes KaTeX's `output` option. Exposes a `createKatexMathRenderer(output: 'html' | 'mathml' = 'html')` factory (switch parameter) and the default `katexMathRenderer` (keeps only `.katex-html`).
-   `demo/scripts/controlsV2/mainPane/MainPane.tsx` — imports `MathPlugin` + `katexMathRenderer`; adds `pluginList.math && new MathPlugin({ renderer: katexMathRenderer })`.
-   `sidePane/editorOptions/OptionState.ts` — `math: boolean` in `pluginList`.
-   `sidePane/editorOptions/EditorOptionsPlugin.ts` — default `math: true`; markdown-paste option default `math: true`.
-   `sidePane/editorOptions/Plugins.tsx` — "Math" plugin checkbox; "Recognize math (LaTeX)" checkbox under MarkdownPaste.
-   `sidePane/editorOptions/codes/MarkdownPasteCode.ts` — generated-code snippet now emits `math: <bool>`.

**Presets** (side-pane "Preset" section)

-   `sidePane/presets/allPresets/mathPresets.ts` — `createMathEntity`/`createMathPreset` helpers + 6 **block** math presets (quadratic, Euler, integral, summation, matrix, showcase). Block entities are used because the preset pane pushes block-level entities into `newEntities`, which triggers `MathPlugin` rendering.
-   `sidePane/presets/allPresets/allPresets.ts` — registers the 6 presets.

---

## 3. Markdown → Content Model math recognition (`roosterjs-content-model-markdown`)

Opt-in via the `math` option. When enabled, embedded LaTeX becomes **dehydrated read-only `Math` entities** (only `data-latex` is set; not rendered here). Handles messy ChatGPT output such as bare `[` / `]` delimiter lines wrapping multi-line LaTeX with blank lines and setext `===` underlines.

**Supported delimiters**

-   Block (own lines): `[` … `]`, `\[` … `\]`, `$$` … `$$`
-   Single-line block: `$$…$$`, `\[…\]`
-   Inline: `$…$` (strict — does **not** match currency like `$5 and $10`), `$$…$$`, `\(…\)`, `\[…\]`

**New files**

-   `lib/markdownToModel/creators/createMathEntity.ts` — creates the dehydrated `Math` entity. Takes `(latex, isBlock, doc, entities?)`; uses the passed `Document` (never the global — banned by lint) and appends the entity to `entities` when provided.
-   `lib/markdownToModel/utils/mathUtils.ts`
    -   `parseBlockMathOpen(line)` — detects a block-math opener / single-line block math.
    -   `isBlockMathClose(line, closeDelimiter)` — whole-line (trimmed) delimiter match.
    -   `matchInlineMath(text)` — anchored inline-math matcher (`$$`, `\[\]`, `\(\)`, strict `$…$`).
-   `test/markdownToModel/processor/mathTest.ts` — covers single/multi-line block math, the exact ChatGPT bare-bracket example, unterminated flush, inline math, currency non-match, entities collection, and the public-API out-param.

**Modified**

-   `processor/markdownProcessor.ts`
    -   Block-math state machine (`handleBlockMathLine`) tracks an open delimiter and accumulates lines verbatim; flushes an unterminated block at the end of input.
    -   New `case 'Entity'` in `addMarkdownBlockToModel` pushes `createMathEntity(latex, true, options.document, options.entities)`.
    -   At entry, when `math` is on and no `document` was supplied, a detached document is created via `new DOMParser()` (avoids the restricted global `document`).
-   `utils/parseInlineSegments.ts` — inline-math detection at the top of the scan loop (**before** the escape branch, so `\(` / `\[` aren't eaten as escapes); threads `mathDocument` + `entities` (including through the recursive link call).
-   `appliers/applySegmentFormatting.ts` — threads `mathDocument` + `entities` to `parseInlineSegments`.
-   `creators/createParagraphFromMarkdown.ts` — passes `options.math ? options.document : undefined` and `options.entities`.
-   `types/MarkdownToModelOptions.ts` — new options: `math?`, `document?`, `entities?` (see §4).
-   `plugins/MarkdownPasteOptions.ts` — new `math?` option.
-   `plugins/MarkdownPastePlugin.ts` — wires `math` + `editor.getDocument()` into both `convertMarkdownToContentModel` call sites (auto-conversion and "paste as markdown").

---

## 4. New-entity tracking on `convertMarkdownToContentModel`

`convertMarkdownToContentModel(text, options?, entities?)` gained a third parameter:

```ts
convertMarkdownToContentModel(text: string, options?: MarkdownToModelOptions, entities?: ContentModelEntity[]): ContentModelDocument
```

-   Every entity created during the conversion (block **and** inline math) is appended to `entities`, so the caller can discover exactly which entities are new after the call.
-   Implementation: the array is carried on the internal options (`MarkdownToModelOptions.entities`) and threaded to `createMathEntity`, which performs `entities?.push(entity)`. Both string-`splitLinesPattern` and options overloads accept the new parameter.

---

## 5. LaTeX normalization: collapse runs of `=`

Markdown from some sources (e.g. ChatGPT) contains a run of `=` that was originally a setext heading underline (for example `===============`). Before converting LaTeX to HTML, `MathPlugin.renderMath` now runs the source through `normalizeLatex`:

```ts
function normalizeLatex(latex: string): string {
    return latex.replace(/={2,}/g, '='); // any run of 2+ "=" -> single "="
}
```

`data-latex` keeps the original source; only the **render input** is normalized, so nothing corrupts the displayed math.

---

## Notes & gotchas (for future work)

-   **No global `document` / `window` in `lib/`** — ESLint `no-restricted-globals` forbids them. Thread a `Document` in (editor's own, or `new DOMParser()` fallback).
-   **`yarn build` `dts` step** — every exported member needs a JSDoc comment (or `@internal`), must be re-exported via the package barrel `index.ts`, and string-literal consts need an explicit type (e.g. `export const X: string = 'v'`).
-   **`checkDependency`** scans `from '...'` even inside comments/JSDoc — avoid literal import statements in doc examples.
-   **Test spying** on package re-exports: spy the deep module path (e.g. `.../lib/publicApi/entity/insertEntity`) while source imports from the package root; webpack shares the module instance.
-   **Presets** must use **block** math entities to render (only block-level entities are pushed into `newEntities` by the preset pane).
-   Run tests with **`yarn test:fast`** only (never `yarn test`); scope with `--testPathPattern=<regex>`.

## Changed / new files

**New**

-   `packages/roosterjs-content-model-plugins/lib/math/MathOptions.ts`
-   `packages/roosterjs-content-model-plugins/lib/math/MathPlugin.ts`
-   `packages/roosterjs-content-model-plugins/test/math/MathPluginTest.ts`
-   `packages/roosterjs-content-model-markdown/lib/markdownToModel/creators/createMathEntity.ts`
-   `packages/roosterjs-content-model-markdown/lib/markdownToModel/utils/mathUtils.ts`
-   `packages/roosterjs-content-model-markdown/test/markdownToModel/processor/mathTest.ts`
-   `demo/scripts/controlsV2/plugins/mathRenderer.ts`
-   `demo/scripts/controlsV2/sidePane/presets/allPresets/mathPresets.ts`

**Modified**

-   `packages/roosterjs-content-model-plugins/lib/index.ts`
-   `packages/roosterjs-content-model-markdown/lib/markdownToModel/convertMarkdownToContentModel.ts`
-   `packages/roosterjs-content-model-markdown/lib/markdownToModel/processor/markdownProcessor.ts`
-   `packages/roosterjs-content-model-markdown/lib/markdownToModel/utils/parseInlineSegments.ts`
-   `packages/roosterjs-content-model-markdown/lib/markdownToModel/appliers/applySegmentFormatting.ts`
-   `packages/roosterjs-content-model-markdown/lib/markdownToModel/creators/createParagraphFromMarkdown.ts`
-   `packages/roosterjs-content-model-markdown/lib/markdownToModel/types/MarkdownToModelOptions.ts`
-   `packages/roosterjs-content-model-markdown/lib/plugins/MarkdownPasteOptions.ts`
-   `packages/roosterjs-content-model-markdown/lib/plugins/MarkdownPastePlugin.ts`
-   `demo/index.html`, `index.html`
-   `demo/scripts/controlsV2/mainPane/MainPane.tsx`
-   `demo/scripts/controlsV2/sidePane/editorOptions/OptionState.ts`
-   `demo/scripts/controlsV2/sidePane/editorOptions/EditorOptionsPlugin.ts`
-   `demo/scripts/controlsV2/sidePane/editorOptions/Plugins.tsx`
-   `demo/scripts/controlsV2/sidePane/editorOptions/codes/MarkdownPasteCode.ts`
-   `demo/scripts/controlsV2/sidePane/presets/allPresets/allPresets.ts`
