# RoosterJS - Guide

## What is this repo?

RoosterJS is a **framework-independent JavaScript rich-text editor** built by Microsoft. It renders inside a single HTML `<div>` element. All editing operations are handled through a middle-layer data structure called the **Content Model**, which sits between the DOM and the editor APIs.

### Core packages

| Package                           | Purpose                                     |
| --------------------------------- | ------------------------------------------- |
| `roosterjs`                       | Facade/quick-start wrapper                  |
| `roosterjs-content-model-core`    | Core editor and plugin infrastructure       |
| `roosterjs-content-model-api`     | Format and editing APIs                     |
| `roosterjs-content-model-dom`     | DOM ↔ Content Model conversion              |
| `roosterjs-content-model-plugins` | Built-in plugins (paste, table, list, etc.) |
| `roosterjs-content-model-types`   | Shared TypeScript types and interfaces      |

All packages live under `packages/`.

## Testing

**Always use this command to run tests:**

```bash
yarn test:fast
```

Do NOT use `yarn test`, `karma start`, or any other test command. `yarn test:fast` uses `karma.fast.conf.js` and is the correct command for local development.

### Test file locations

-   Unit tests live alongside source in `packages/<package-name>/test/`
-   End-to-end paste tests: `packages/roosterjs-content-model-plugins/test/paste/`

## Content Model structure

The Content Model is a tree with three node levels: **BlockGroup → Block → Segment**.

### Node hierarchy

```
ContentModelDocument  (root BlockGroup)
  └─ blocks: ContentModelBlock[]
       ├─ ContentModelParagraph        (Block)
       │    └─ segments: ContentModelSegment[]
       │         ├─ ContentModelText
       │         ├─ ContentModelImage
       │         ├─ ContentModelBr
       │         ├─ ContentModelSelectionMarker
       │         ├─ ContentModelGeneralSegment
       │         └─ ContentModelEntity  (inline)
       ├─ ContentModelTable             (Block)
       │    └─ rows → cells: ContentModelTableCell[]  (BlockGroup)
       ├─ ContentModelDivider           (Block — <hr> or <div>)
       ├─ ContentModelEntity            (Block — block-level entity)
       └─ (BlockGroup as Block)
            ├─ ContentModelListItem     (BlockGroup + Block — <li>)
            ├─ ContentModelFormatContainer  (BlockGroup — <div>, <blockquote>, etc.)
            └─ ContentModelGeneralBlock     (BlockGroup — any unknown block element)
```

### BlockGroup types

| Type              | HTML                          | Key properties                                                                  |
| ----------------- | ----------------------------- | ------------------------------------------------------------------------------- |
| `Document`        | —                             | `blocks[]`, optional `format` for document defaults                             |
| `ListItem`        | `<li>`                        | `blocks[]`, `levels: ContentModelListLevel[]`, `formatHolder` (SelectionMarker) |
| `TableCell`       | `<td>/<th>`                   | `blocks[]`, `spanLeft`, `spanAbove`, `isHeader`                                 |
| `FormatContainer` | `<div>`, `<blockquote>`, etc. | `blocks[]`, `tagName`                                                           |
| `General`         | any block element             | `blocks[]`, `element: HTMLElement`                                              |

### Block types

| Type        | Key properties                                                              |
| ----------- | --------------------------------------------------------------------------- |
| `Paragraph` | `segments[]`, `isImplicit`, `decorator` (tagName + format), `segmentFormat` |
| `Table`     | `rows[]`, `widths[]`, `format`                                              |
| `Divider`   | `tagName` (`'hr'` or `'div'`), `isSelected`                                 |
| `Entity`    | `wrapper: HTMLElement`, `entityFormat` (can also be a Segment)              |

### Segment types

| Type              | Key properties                                        |
| ----------------- | ----------------------------------------------------- |
| `Text`            | `text: string`                                        |
| `Image`           | `src`, `alt`, `title`, `isSelectedAsImageSelection`   |
| `Br`              | _(none beyond base)_                                  |
| `SelectionMarker` | `isSelected`                                          |
| `General`         | `element: HTMLElement` (also a BlockGroup)            |
| `Entity`          | `wrapper: HTMLElement`, `entityFormat` (also a Block) |

All segments carry `format: ContentModelSegmentFormat`, optional `link`, and optional `code` decorators.

### Format types

Formats are flat objects composed from small, single-purpose format parts. Each part maps to specific CSS property/properties.

| Format type                       | Used on                                          | Key CSS properties covered                                                                                                                                 |
| --------------------------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ContentModelBlockFormat`         | Paragraph, FormatContainer, ListItem             | `margin-*`, `padding-*`, `text-align`, `direction`, `line-height`, `white-space`, `border-*`, `background-color`, `text-indent`                            |
| `ContentModelSegmentFormat`       | Segments                                         | `color`, `background-color`, `font-size`, `font-family`, `font-weight`, `font-style`, `text-decoration`, `vertical-align`, `letter-spacing`, `line-height` |
| `ContentModelListItemLevelFormat` | `ContentModelListLevel` (inside ListItem.levels) | `list-style-type`, `list-style-position`, `margin-*`, `padding-*`, `direction`, `text-align`, `startNumberOverride`                                        |
| `ContentModelTableFormat`         | Table                                            | All block format properties + `border-*`, `table-layout`, `border-collapse`, `margin-*`                                                                    |
| `ContentModelTableCellFormat`     | TableCell                                        | Block format + `vertical-align`, `word-break`, `border-*`                                                                                                  |
| `ContentModelImageFormat`         | Image                                            | Segment format + `width`, `height`, `margin-*`, `padding-*`, `border-*`, `float`, `vertical-align`                                                         |

### Key type definition files

All types live in `packages/roosterjs-content-model-types/lib/`:

```
contentModel/
  block/          – ContentModelBlock, Paragraph, Table, Divider
  blockGroup/     – ContentModelBlockGroup, Document, ListItem, TableCell, FormatContainer, GeneralBlock
  segment/        – ContentModelSegment, Text, Image, Br, SelectionMarker, GeneralSegment
  format/         – All format types
    formatParts/  – Individual CSS-mapping parts (MarginFormat, PaddingFormat, TextColorFormat, …)
  decorator/      – ContentModelLink, ContentModelCode, ContentModelListLevel
  entity/         – ContentModelEntity
  common/         – Selectable, MutableMark, ContentModelWithFormat
context/          – DomToModelContext, ModelToDomContext, ElementProcessor, FormatParser
```

## Commit & Pull Request Guidelines

-   Follow the existing history: concise, imperative subjects that mention the surface area (e.g. `[Table Improvements] Add new customization properties for table format`, `Fix outdated JSDoc comments in setTableCellsStyle.ts`); stack larger efforts as multiple commits.
-   Use the imperative mood: "Add", "Fix", "Remove", "Update" — not "Added" or "Fixes".
-   Reference GitHub issues/PRs in the subject where relevant (e.g. `Fix #3280 (#3282)`).
-   Before pushing, ensure all of the following pass:
    -   **Lint**: `yarn eslint`
    -   **Tests**: `yarn test:fast`
    -   **Build**: `yarn b`
-   PRs go against the `master` branch.

## Repo Metadata

| Field               | Value                                  |
| ------------------- | -------------------------------------- |
| **GitHub**          | https://github.com/microsoft/roosterjs |
| **License**         | MIT                                    |
| **Default branch**  | `master`                               |
| **Language**        | TypeScript                             |
| **Package manager** | Yarn                                   |
| **Test framework**  | Jasmine + Karma                        |
| **Node**            | v20+                                   |

All packages are under `packages/` and share a single monorepo build via `tools/build.js`.

## Build, Test, and Development Commands

| Command                                    | Purpose                                                                                  |
| ------------------------------------------ | ---------------------------------------------------------------------------------------- |
| `yarn test:fast`                           | **Run tests (always use this)** — uses `karma.fast.conf.js`                              |
| `yarn test:fast --testPathPattern=<regex>` | Run only test files whose path matches `<regex>` (e.g. `generatePasteOptionFromPlugins`) |
| `yarn test:fast --testNamePattern=<regex>` | Run only tests whose name matches `<regex>` (Jasmine grep)                               |
| `yarn build`                               | Build: clean + normalize + compile CommonJS                                              |
| `yarn eslint`                              | Lint all packages                                                                        |
| `yarn build:ci`                            | Full CI build (lint + compile + AMD + MJS + tests + pack + docs)                         |
| `yarn normalize`                           | Generate barrel/index files across packages                                              |
| `yarn builddemo`                           | Build the demo site                                                                      |

**Never use** `yarn test`, `karma start`, or any other test variant locally.
