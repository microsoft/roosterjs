# Shadow DOM Support for RoosterJS

## Problem

When the editor is mounted inside a Shadow DOM, `element.ownerDocument` returns the outer `Document` instead of being scoped to the shadow root. This breaks:

1. **Selection** — `document.getSelection()` doesn't see shadow DOM content (Chrome/Safari); `selection.focusNode`/`anchorNode` return null in Safari shadow DOM
2. **Focus detection** — `document.activeElement` stops at the shadow host
3. **ID uniqueness** — `document.querySelectorAll()` can't find elements inside shadow DOM
4. **Announcer** — aria-live element appended to `document.body` is outside shadow DOM scope
5. **`selectionchange` event** — fires on `ShadowRoot` not `document` in Chrome/Safari
6. **`doc.contains()` in setDOMSelection** — `Document.contains()` won't find elements inside shadow DOM

> **Note:** `setEditorStyle` appends `<style>` elements to `document.head`, which doesn't apply inside a shadow root. The library must append these styles into the shadow root instead when the editor is inside one. This is handled via `domHelper.appendStyle()`.

## Approach

Extend the existing `DOMHelper` interface with shadow-DOM-aware methods. The implementation (`DOMHelperImpl`) auto-detects the shadow root via `contentDiv.getRootNode()` at creation time. This follows the established pattern of `DOMHelper` as the single DOM abstraction layer.

For simple cases like `ensureUniqueId`, use `element.getRootNode()` directly (both `Document` and `ShadowRoot` implement `querySelectorAll` via the `ParentNode` mixin) — no signature changes needed.

### Browser Selection API — Adapter Strategy

Browsers differ in how they expose selection inside a shadow DOM. Instead of scattering feature checks throughout the code, we resolve the correct API **once** at construction time via a `ShadowSelectionAdapter` and DOMHelperImpl delegates all selection calls to it.

| Browser                             | API                                                   | Priority                  |
| ----------------------------------- | ----------------------------------------------------- | ------------------------- |
| Chrome/Edge/Firefox/Safari (modern) | `selection.getComposedRanges({ shadowRoots: [...] })` | 1 (standard)              |
| Older Chromium                      | `shadowRoot.getSelection()`                           | 2 (deprecated fallback)   |
| Older Firefox                       | `document.getSelection()` (pierces shadow DOM)        | 3 (non-standard fallback) |

**Adapter pattern:** At DOMHelperImpl construction, detect which API is available and create the appropriate adapter. All subsequent selection operations go through the adapter — no runtime feature checks.

```ts
interface ShadowSelectionAdapter {
    getRange(): Range | null;
    getSelection(): Selection | null;
    isReverted(): boolean;
    setRange(range: Range, isReverted: boolean): void;
}
```

Three implementations:

1. **`ComposedRangesAdapter`** — uses `getComposedRanges({ shadowRoots })` (standard)
2. **`ShadowRootSelectionAdapter`** — uses `shadowRoot.getSelection()` (deprecated Chromium)
3. **`DocumentSelectionAdapter`** — uses `document.getSelection()` (Firefox piercing / no shadow DOM)

**Strategy:** Use `getComposedRanges({ shadowRoots: [shadowRoot] })` when in shadow DOM and supported, fall back to `shadowRoot.getSelection()` for older Chromium, then `document.getSelection()` for older Firefox or non-shadow DOM.

### Shadow DOM Selection Pitfalls

In Safari shadow DOM, `document.getSelection()` cannot see inside the shadow root:

-   **`selection.focusNode` / `anchorNode`** → return `null` (or shadow host)
-   **`selection.focusOffset` / `anchorOffset`** → return `0`
-   **`selection.rangeCount`** → returns `0` (even when caret is inside shadow root)
-   **`selection.getRangeAt(0)`** → throws or returns incorrect range
-   **`selection.addRange()`** → may silently fail for ranges inside shadow root

The only correct API is `selection.getComposedRanges(shadowRoot)` which returns `StaticRange[]`.

### What does NOT need to change

These `ownerDocument` usages work correctly even in shadow DOM:

-   `ownerDocument.defaultView?.getComputedStyle()` — works on any element
-   `ownerDocument.createRange()` — ranges work across shadow DOM
-   `ownerDocument.createDocumentFragment()` — fine
-   `ownerDocument.createElement()` — fine
-   `ownerDocument.implementation.createHTMLDocument()` — fine for cloning

### What is confirmed safe (no changes needed)

-   **Paste/copy/cut** — attached via `attachDomEvent` on `logicalRoot`, `ClipboardEvent` unaffected
-   **IME/composition** — `compositionstart`/`compositionend` attached on `logicalRoot`, not retargeted
-   **Context menus** — attached via `attachDomEvent`, fires on direct target
-   **Drag and drop** — `DragAndDropHelper` uses document-level capture listeners, which pierce shadow boundaries
-   **DOMEventPlugin scroll/resize** — already uses `editor.getDocument()`, not bare `document`
-   **Style cleanup** — `LifecyclePlugin.dispose()` uses `element.parentElement?.removeChild(element)`, which is parent-relative and works in both shadow DOM and document head
-   **Style cleanup** in `setEditorStyle` — `LifecyclePlugin.dispose()` removes styles via `element.parentElement?.removeChild(element)`, which is parent-relative and works whether the style is in `document.head` or a shadow root

### Constraints

-   The editor content must be **directly inside** the shadow root, not slotted via `<slot>`. Slotted content has additional `:host`/`::slotted` scoping that this plan does not address.
-   Firefox's behavior of `document.getSelection()` piercing shadow DOM is non-standard and may change in the future.

## Design

### Extend DOMHelper Interface

Add these methods to the existing `DOMHelper` interface (`packages/roosterjs-content-model-types/lib/parameter/DOMHelper.ts`):

```ts
/**
 * Whether the editor is inside a shadow DOM
 */
isInShadowDOM(): boolean;

/**
 * Get the current selection. In shadow DOM, delegates to the resolved
 * ShadowSelectionAdapter (getComposedRanges → shadowRoot.getSelection → document.getSelection).
 */
getSelection(): Selection | null;

/**
 * Get the current selection range, handling Safari's StaticRange conversion.
 * Returns a live Range in all browsers.
 * IMPORTANT: Checks getComposedRanges BEFORE rangeCount, because in Safari
 * shadow DOM, rangeCount is 0 even when a selection exists.
 */
getSelectionRange(): Range | null;

/**
 * Set the selection to the given range, handling browser differences.
 * In Safari shadow DOM, selection.addRange() may not work for ranges
 * inside the shadow root, so this method uses the appropriate API.
 */
setSelectionRange(range: Range, isReverted?: boolean): void;

/**
 * Detect if the current selection is reverted (focus before anchor).
 * Handles Safari shadow DOM where selection.focusNode is null.
 */
isSelectionReverted(): boolean;

/**
 * Append a <style> element to the correct root (shadow root or document.head)
 */
appendStyle(style: HTMLStyleElement): void;

/**
 * Append an element to the correct root container (shadow root or document.body)
 */
appendToRoot(element: HTMLElement): void;

/**
 * Get the root node for event listener registration (shadow root or document).
 * Used for events like `selectionchange` that fire on the shadow root.
 */
getEventRoot(): Document | ShadowRoot;
```

### DOMHelperImpl Changes

```ts
// --- ShadowSelectionAdapter interface and implementations ---

interface ShadowSelectionAdapter {
    getRange(): Range | null;
    getSelection(): Selection | null;
    isReverted(): boolean;
    setRange(range: Range, isReverted: boolean): void;
}

/**
 * Standard adapter: uses getComposedRanges({ shadowRoots }) (modern browsers)
 */
class ComposedRangesAdapter implements ShadowSelectionAdapter {
    constructor(private shadowRoot: ShadowRoot, private doc: Document) {}

    getSelection(): Selection | null {
        return this.doc.defaultView?.getSelection() ?? null;
    }

    getRange(): Range | null {
        const sel = this.getSelection();
        if (!sel) return null;

        const staticRanges = (sel as any).getComposedRanges({ shadowRoots: [this.shadowRoot] });
        if (staticRanges?.length > 0) {
            const sr = staticRanges[0] as StaticRange;
            const range = this.doc.createRange();
            range.setStart(sr.startContainer, sr.startOffset);
            range.setEnd(sr.endContainer, sr.endOffset);
            return range;
        }
        return null;
    }

    isReverted(): boolean {
        // getComposedRanges returns StaticRange which doesn't expose direction
        return false;
    }

    setRange(range: Range, isReverted: boolean): void {
        const sel = this.getSelection();
        if (!sel) return;
        sel.removeAllRanges();

        if (!isReverted) {
            sel.addRange(range);
        } else {
            sel.setBaseAndExtent(
                range.endContainer,
                range.endOffset,
                range.startContainer,
                range.startOffset
            );
        }
    }
}

/**
 * Deprecated Chromium adapter: uses shadowRoot.getSelection() (non-standard)
 */
class ShadowRootSelectionAdapter implements ShadowSelectionAdapter {
    constructor(private shadowRoot: ShadowRoot) {}

    getSelection(): Selection | null {
        return (this.shadowRoot as any).getSelection() ?? null;
    }

    getRange(): Range | null {
        const sel = this.getSelection();
        if (!sel || sel.rangeCount === 0) return null;
        return sel.getRangeAt(0);
    }

    isReverted(): boolean {
        const sel = this.getSelection();
        if (!sel || sel.rangeCount === 0) return false;
        const range = sel.getRangeAt(0);
        return sel.focusNode != range.endContainer || sel.focusOffset != range.endOffset;
    }

    setRange(range: Range, isReverted: boolean): void {
        const sel = this.getSelection();
        if (!sel) return;
        sel.removeAllRanges();

        if (!isReverted) {
            sel.addRange(range);
        } else {
            sel.setBaseAndExtent(
                range.endContainer,
                range.endOffset,
                range.startContainer,
                range.startOffset
            );
        }
    }
}

/**
 * Document adapter: uses document.getSelection() (Firefox piercing / no shadow DOM)
 */
class DocumentSelectionAdapter implements ShadowSelectionAdapter {
    constructor(private doc: Document) {}

    getSelection(): Selection | null {
        return this.doc.defaultView?.getSelection() ?? null;
    }

    getRange(): Range | null {
        const sel = this.getSelection();
        if (!sel || sel.rangeCount === 0) return null;
        return sel.getRangeAt(0);
    }

    isReverted(): boolean {
        const sel = this.getSelection();
        if (!sel || sel.rangeCount === 0) return false;
        const range = sel.getRangeAt(0);
        return sel.focusNode != range.endContainer || sel.focusOffset != range.endOffset;
    }

    setRange(range: Range, isReverted: boolean): void {
        const sel = this.getSelection();
        if (!sel) return;

        const currentRange = sel.rangeCount > 0 && sel.getRangeAt(0);
        if (currentRange && areSameRanges(currentRange, range)) {
            return;
        }
        sel.removeAllRanges();

        if (!isReverted) {
            sel.addRange(range);
        } else {
            sel.setBaseAndExtent(
                range.endContainer,
                range.endOffset,
                range.startContainer,
                range.startOffset
            );
        }
    }
}

// --- Adapter factory: resolved once at construction ---

function createSelectionAdapter(
    shadowRoot: ShadowRoot | null,
    doc: Document
): ShadowSelectionAdapter {
    if (!shadowRoot) {
        return new DocumentSelectionAdapter(doc);
    }

    // 1. Standard: getComposedRanges (modern Chrome/Firefox/Safari)
    const sel = doc.defaultView?.getSelection();
    if (sel && 'getComposedRanges' in sel) {
        return new ComposedRangesAdapter(shadowRoot, doc);
    }

    // 2. Deprecated: shadowRoot.getSelection() (older Chromium)
    if ('getSelection' in shadowRoot) {
        return new ShadowRootSelectionAdapter(shadowRoot);
    }

    // 3. Fallback: document.getSelection() (older Firefox — pierces shadow DOM)
    return new DocumentSelectionAdapter(doc);
}

// --- DOMHelperImpl ---

class DOMHelperImpl implements DOMHelper {
    private shadowRoot: ShadowRoot | null;
    private doc: Document;
    private selectionAdapter: ShadowSelectionAdapter;

    constructor(private contentDiv: HTMLElement) {
        const rootNode = contentDiv.getRootNode();
        this.shadowRoot = rootNode instanceof ShadowRoot ? rootNode : null;
        this.doc = contentDiv.ownerDocument;
        this.selectionAdapter = createSelectionAdapter(this.shadowRoot, this.doc);
    }

    // Fix existing method:
    hasFocus(): boolean {
        const activeElement = this.shadowRoot
            ? this.shadowRoot.activeElement
            : this.doc.activeElement;
        return !!(activeElement && this.contentDiv.contains(activeElement));
    }

    isInShadowDOM(): boolean {
        return !!this.shadowRoot;
    }

    getSelection(): Selection | null {
        return this.selectionAdapter.getSelection();
    }

    getSelectionRange(): Range | null {
        return this.selectionAdapter.getRange();
    }

    setSelectionRange(range: Range, isReverted: boolean = false): void {
        this.selectionAdapter.setRange(range, isReverted);
    }

    isSelectionReverted(): boolean {
        return this.selectionAdapter.isReverted();
    }

    appendStyle(style: HTMLStyleElement): void {
        if (this.shadowRoot) {
            this.shadowRoot.appendChild(style);
        } else {
            this.doc.head.appendChild(style);
        }
    }

    appendToRoot(element: HTMLElement): void {
        if (this.shadowRoot) {
            this.shadowRoot.appendChild(element);
        } else {
            this.doc.body.appendChild(element);
        }
    }

    getEventRoot(): Document | ShadowRoot {
        return this.shadowRoot ?? this.doc;
    }
}
```

### `ensureUniqueId` — Simple Fix

Use `element.getRootNode()` instead of `element.ownerDocument`. No signature change needed:

```ts
export function ensureUniqueId(element: HTMLElement, idPrefix: string): string {
    idPrefix = element.id || idPrefix;
    const root = element.getRootNode() as Document | ShadowRoot;
    let i = 0;
    while (!element.id || root.querySelectorAll(getSafeIdSelector(element.id)).length > 1) {
        element.id = idPrefix + '_' + i++;
    }
    return element.id;
}
```

### `addRangeToSelection` Refactoring

**Option A (recommended):** Replace most call sites with `domHelper.setSelectionRange(range, isReverted)` directly. This eliminates the need for `addRangeToSelection` in shadow-DOM-aware code paths.

**Option B:** Refactor `addRangeToSelection` to accept `Selection | null` instead of `Document`:

```ts
export function addRangeToSelection(
    selection: Selection | null,
    range: Range,
    isReverted: boolean = false
);
```

### `setRangeSelection` Refactoring

Refactor the private `setRangeSelection` in `setDOMSelection.ts` to take `core: EditorCore`:

```ts
function setRangeSelection(core: EditorCore, element: HTMLElement | undefined, collapse: boolean) {
    if (element && core.physicalRoot.contains(element)) {
        const range = core.physicalRoot.ownerDocument.createRange();
        range.selectNode(element);
        if (collapse) {
            range.collapse();
        }
        const isReverted = collapse ? false : core.domHelper.isSelectionReverted();
        core.domHelper.setSelectionRange(range, isReverted);
    }
}
```

### `createAriaLiveElement` Refactoring

Split the utility so callers control where the element is appended:

```ts
export function createAriaLiveElement(document: Document): HTMLDivElement {
    const div = document.createElement('div');
    // ... set styles and ariaLive ...
    return div; // Don't append to document.body here
}
```

Callers use `domHelper.appendToRoot(element)` to append.

### `isSingleImageInSelection` Refactoring

This function reads `selection.anchorNode`/`focusNode` directly — broken in Safari shadow DOM where these are null. Refactor to use Range-based detection:

```ts
// Instead of checking anchorNode/focusNode from Selection,
// use the Range from domHelper.getSelectionRange() to detect single image selection
```

## Files to Update (complete list)

### Selection — getting

| File                                | Current code                                                  | Change to                                                                   |
| ----------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `getDOMSelection.ts:19-20`          | `ownerDocument.defaultView?.getSelection()` + `getRangeAt(0)` | `core.domHelper.getSelectionRange()`; use `domHelper.isSelectionReverted()` |
| `setDOMSelection.ts:150-169`        | `setRangeSelection(doc, ...)`                                 | `setRangeSelection(core, ...)` using `domHelper.setSelectionRange()`        |
| `SelectionPlugin.ts:741`            | `this.editor.getDocument().getSelection()`                    | `this.editor.getDOMHelper().getSelection()` + `getSelectionRange()`         |
| `isSingleImageInSelection.ts:25-28` | `selection.anchorNode`, `focusNode`, offsets                  | Refactor to Range-based detection                                           |
| `EditorAdapter.ts:534`              | `this.getDocument().defaultView?.getSelection()`              | `this.getDOMHelper().getSelection()` + `getSelectionRange()`                |

### Selection — setting

| File                            | Current code                    | Change to                                                                                         |
| ------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------- |
| `addRangeToSelection.ts`        | Takes `doc: Document`           | Replace call sites with `domHelper.setSelectionRange()` or refactor to accept `Selection \| null` |
| `setDOMSelection.ts:66,118,127` | `addRangeToSelection(doc, ...)` | Use `core.domHelper.setSelectionRange(range, isReverted)`                                         |

### Selection — reverted detection (3 duplicated sites → consolidated)

| File                         | Current code                                | Change to                                     |
| ---------------------------- | ------------------------------------------- | --------------------------------------------- |
| `getDOMSelection.ts:27-28`   | `selection.focusNode != range.endContainer` | `core.domHelper.isSelectionReverted()`        |
| `setDOMSelection.ts:162-164` | Same pattern                                | `core.domHelper.isSelectionReverted()`        |
| `SelectionPlugin.ts:750-751` | Same pattern                                | `editor.getDOMHelper().isSelectionReverted()` |

### Events

| File                         | Current code                                                                        | Change to                                                    |
| ---------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `SelectionPlugin.ts:103,119` | `document.addEventListener/removeEventListener('selectionchange', ...)`             | `editor.getDOMHelper().getEventRoot().addEventListener(...)` |
| `CachePlugin.ts:58,74`       | `editor.getDocument().addEventListener/removeEventListener('selectionchange', ...)` | `editor.getDOMHelper().getEventRoot().addEventListener(...)` |

### ID uniqueness

| File                  | Current code            | Change to                                         |
| --------------------- | ----------------------- | ------------------------------------------------- |
| `ensureUniqueId.ts:9` | `element.ownerDocument` | `element.getRootNode() as Document \| ShadowRoot` |

### Style injection

| File                   | Current code                         | Change to                                  |
| ---------------------- | ------------------------------------ | ------------------------------------------ |
| `setEditorStyle.ts:24` | `doc.head.appendChild(styleElement)` | `core.domHelper.appendStyle(styleElement)` |

### Focus detection

| File                   | Current code                                  | Change to                                                  |
| ---------------------- | --------------------------------------------- | ---------------------------------------------------------- |
| `DOMHelperImpl.ts:100` | `this.contentDiv.ownerDocument.activeElement` | `this.shadowRoot?.activeElement ?? this.doc.activeElement` |

### Announcer

| File                       | Current code                           | Change to                                                   |
| -------------------------- | -------------------------------------- | ----------------------------------------------------------- |
| `createAriaLiveElement.ts` | Creates and appends to `document.body` | Create only; don't append                                   |
| `announce.ts:19`           | `createAriaLiveElement(doc)`           | Create element, then `core.domHelper.appendToRoot()`        |
| `LifecyclePlugin.ts:87`    | `createAriaLiveElement(doc)`           | Create element, then `editor.getDOMHelper().appendToRoot()` |

### Contains checks

| File                     | Current code            | Change to                             |
| ------------------------ | ----------------------- | ------------------------------------- |
| `setDOMSelection.ts:151` | `doc.contains(element)` | `core.physicalRoot.contains(element)` |

## Test Update Strategy

Adding methods to `DOMHelper` interface won't cause compile errors (test mocks use `as any`), but **will cause runtime failures** when production code calls new methods on partial mocks.

**38 test files** reference `domHelper` with partial mocks. Key files needing updates:

-   `setDOMSelectionTest.ts` — needs `getSelection`, `getSelectionRange`, `setSelectionRange`, `isSelectionReverted`
-   `getDOMSelectionTest.ts` — needs `getSelectionRange`, `isSelectionReverted`
-   `SelectionPluginTest.ts` — needs `getEventRoot`, `getSelection`, `getSelectionRange`
-   `CachePluginTest.ts` — needs `getEventRoot` mock

**Approach:** Create a `createMockDOMHelper()` test utility that returns a complete mock with all methods as spies, to avoid the partial mock problem going forward.

## Todos

1. **extend-domhelper-interface** — Add `isInShadowDOM`, `getSelection`, `getSelectionRange`, `setSelectionRange`, `isSelectionReverted`, `appendStyle`, `appendToRoot`, `getEventRoot` to DOMHelper interface
2. **implement-domhelper-shadow** — Update DOMHelperImpl: detect shadow root, create ShadowSelectionAdapter (ComposedRanges → ShadowRootSelection → DocumentSelection) once at construction, delegate all selection methods to it, fix hasFocus
3. **fix-get-dom-selection** — Use `domHelper.getSelectionRange()` and `domHelper.isSelectionReverted()`
4. **fix-set-dom-selection** — Refactor `setRangeSelection` to take `core`; use `domHelper.setSelectionRange()`, `physicalRoot.contains()`
5. **fix-add-range-to-selection** — Replace call sites with `domHelper.setSelectionRange()` or refactor signature
6. **fix-selection-plugin** — Fix `getSelection()` at line 741; move `selectionchange` to `getEventRoot()`; fix reverted detection
7. **fix-cache-plugin** — Move `selectionchange` to `getEventRoot()`
8. **fix-single-image-selection** — Refactor `isSingleImageInSelection` to use Range-based detection
9. **fix-set-editor-style** — Use `core.domHelper.appendStyle()` instead of `doc.head.appendChild(styleElement)`
10. **fix-ensure-unique-id** — Change `element.ownerDocument` to `element.getRootNode()`
11. **fix-announce** — Refactor `createAriaLiveElement` to separate creation from appending; use `domHelper.appendToRoot()`
12. **fix-editor-adapter** — Update `EditorAdapter.ts:534` to use `getDOMHelper().getSelection()`
13. **create-mock-domhelper** — Create `createMockDOMHelper()` test utility with all methods as spies
14. **update-tests** — Update 38+ test files to use complete DOMHelper mocks; update selectionchange assertions
15. **update-demo** — Ensure demo `index.ts` shadow DOM mode works end-to-end
