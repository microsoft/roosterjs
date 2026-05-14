import {
    getColor,
    getRangesByText,
    isBlockElement,
    isNodeOfType,
    parseValueWithUnit,
    toArray,
} from 'roosterjs-content-model-dom';
import { areSameRanges } from '../../corePlugin/cache/areSameSelections';
import type {
    ContentModelSegmentFormat,
    DarkColorHandler,
    DOMHelper,
} from 'roosterjs-content-model-types';

let safariShadowPolyfillApplied = false;

function isSafariBrowser(): boolean {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    return ua.indexOf('AppleWebKit') >= 0 && ua.indexOf('Chrome') < 0 && ua.indexOf('Android') < 0;
}

/**
 * Polyfill for ShadowRoot.prototype.getSelection on Safari.
 * Uses the execCommand('indent') + beforeinput.getTargetRanges() trick to capture
 * selection ranges inside a shadow DOM, since Safari does not natively support
 * shadowRoot.getSelection().
 */
function applySafariShadowSelectionPolyfill(doc: Document): void {
    if (safariShadowPolyfillApplied) {
        return;
    }
    safariShadowPolyfillApplied = true;

    const supportsShadowSelection =
        typeof (ShadowRoot.prototype as any).getSelection === 'function';
    const supportsBeforeInput = typeof InputEvent.prototype.getTargetRanges === 'function';

    if (supportsShadowSelection || !supportsBeforeInput) {
        return;
    }

    let processing = false;

    class ShadowSelection {
        _ranges: Range[] = [];

        get rangeCount(): number {
            return this._ranges.length;
        }

        get type(): string {
            return this._ranges.length > 0 ? 'Range' : 'None';
        }

        get anchorNode(): Node | null {
            return this._ranges[0]?.startContainer ?? null;
        }

        get anchorOffset(): number {
            return this._ranges[0]?.startOffset ?? 0;
        }

        get focusNode(): Node | null {
            return this._ranges[0]?.endContainer ?? null;
        }

        get focusOffset(): number {
            return this._ranges[0]?.endOffset ?? 0;
        }

        getRangeAt(index: number): Range {
            return this._ranges[index];
        }

        addRange(range: Range): void {
            this._ranges.push(range);
            const sel = doc.getSelection();
            if (sel) {
                sel.removeAllRanges();
                sel.setBaseAndExtent(
                    range.startContainer,
                    range.startOffset,
                    range.endContainer,
                    range.endOffset
                );
            }
        }

        removeAllRanges(): void {
            this._ranges = [];
            doc.getSelection()?.removeAllRanges();
        }

        setBaseAndExtent(
            anchorNode: Node,
            anchorOffset: number,
            focusNode: Node,
            focusOffset: number
        ): void {
            const range = doc.createRange();
            range.setStart(anchorNode, anchorOffset);
            range.setEnd(focusNode, focusOffset);
            this._ranges = [range];
            doc.getSelection()?.setBaseAndExtent(anchorNode, anchorOffset, focusNode, focusOffset);
        }
    }

    const selection = new ShadowSelection();

    (ShadowRoot.prototype as any).getSelection = function () {
        return selection;
    };

    function getDeepActiveElement(): Element | null {
        let active: Element | null = doc.activeElement;
        while (active?.shadowRoot?.activeElement) {
            active = active.shadowRoot.activeElement;
        }
        return active;
    }

    const win = doc.defaultView!;

    win.addEventListener(
        'selectionchange',
        () => {
            if (!processing) {
                processing = true;
                const active = getDeepActiveElement();
                if (active && active.getAttribute('contenteditable') === 'true') {
                    doc.execCommand('indent');
                } else {
                    selection.removeAllRanges();
                }
                processing = false;
            }
        },
        true
    );

    win.addEventListener(
        'beforeinput',
        (event: InputEvent) => {
            if (processing) {
                const ranges = event.getTargetRanges();
                const range = ranges[0];
                if (range) {
                    const newRange = doc.createRange();
                    newRange.setStart(range.startContainer, range.startOffset);
                    newRange.setEnd(range.endContainer, range.endOffset);
                    selection.removeAllRanges();
                    selection._ranges.push(newRange);
                }
                event.preventDefault();
                event.stopImmediatePropagation();
            }
        },
        true
    );

    win.addEventListener(
        'selectstart',
        () => {
            selection.removeAllRanges();
        },
        true
    );
}

/**
 * @internal
 */
export interface DOMHelperImplOption {
    /**
     * @deprecated This is always treated as true now
     */
    cloneIndependentRoot?: boolean;
}

/**
 * @internal
 * Adapter interface for shadow DOM selection operations.
 * Resolved once at construction time to avoid repeated feature detection.
 */
interface ShadowSelectionAdapter {
    getRange(): Range | null;
    getSelection(): Selection | null;
    isReverted(): boolean;
    setRange(range: Range, isReverted: boolean): void;
}

/**
 * Standard adapter using getComposedRanges (modern Chrome/Firefox/Safari)
 */
class ComposedRangesAdapter implements ShadowSelectionAdapter {
    constructor(private shadowRoot: ShadowRoot, private doc: Document) {}

    getSelection(): Selection | null {
        return this.doc.defaultView?.getSelection() ?? null;
    }

    getRange(): Range | null {
        const sel = this.getSelection();
        if (!sel) {
            return null;
        }

        const staticRanges = (sel as any).getComposedRanges({
            shadowRoots: [this.shadowRoot],
        });

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
        if (!sel) {
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

/**
 * Deprecated Chromium adapter using shadowRoot.getSelection() (non-standard)
 */
class ShadowRootSelectionAdapter implements ShadowSelectionAdapter {
    constructor(private shadowRoot: ShadowRoot) {}

    getSelection(): Selection | null {
        return (this.shadowRoot as any).getSelection() ?? null;
    }

    getRange(): Range | null {
        const sel = this.getSelection();
        if (!sel || sel.rangeCount === 0) {
            return null;
        }
        return sel.getRangeAt(0);
    }

    isReverted(): boolean {
        const sel = this.getSelection();
        if (!sel || sel.rangeCount === 0) {
            return false;
        }
        const range = sel.getRangeAt(0);
        return sel.focusNode != range.endContainer || sel.focusOffset != range.endOffset;
    }

    setRange(range: Range, isReverted: boolean): void {
        const sel = this.getSelection();
        if (!sel) {
            return;
        }

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

/**
 * Document adapter using document.getSelection() (older Firefox piercing / no shadow DOM)
 */
class DocumentSelectionAdapter implements ShadowSelectionAdapter {
    constructor(private doc: Document) {}

    getSelection(): Selection | null {
        return this.doc.defaultView?.getSelection() ?? null;
    }

    getRange(): Range | null {
        const sel = this.getSelection();
        if (!sel || sel.rangeCount === 0) {
            return null;
        }
        return sel.getRangeAt(0);
    }

    isReverted(): boolean {
        const sel = this.getSelection();
        if (!sel || sel.rangeCount === 0) {
            return false;
        }
        const range = sel.getRangeAt(0);
        return sel.focusNode != range.endContainer || sel.focusOffset != range.endOffset;
    }

    setRange(range: Range, isReverted: boolean): void {
        const sel = this.getSelection();
        if (!sel) {
            return;
        }

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

/**
 * Resolve the correct selection adapter once at construction time
 */
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

class DOMHelperImpl implements DOMHelper {
    private shadowRoot: ShadowRoot | null;
    private doc: Document;
    private selectionAdapter: ShadowSelectionAdapter;

    constructor(private contentDiv: HTMLElement, options?: DOMHelperImplOption) {
        const rootNode = contentDiv.getRootNode();
        this.shadowRoot = rootNode instanceof ShadowRoot ? rootNode : null;
        this.doc = contentDiv.ownerDocument;

        // Apply Safari shadow DOM selection polyfill before creating the adapter,
        // so that the polyfilled getSelection is detected by createSelectionAdapter.
        if (this.shadowRoot && isSafariBrowser()) {
            applySafariShadowSelectionPolyfill(this.doc);
        }

        this.selectionAdapter = createSelectionAdapter(this.shadowRoot, this.doc);
    }

    queryElements(selector: string): HTMLElement[] {
        return toArray(this.contentDiv.querySelectorAll(selector)) as HTMLElement[];
    }

    getTextContent(): string {
        return this.contentDiv.textContent || '';
    }

    isNodeInEditor(node: Node, excludeRoot?: boolean): boolean {
        return excludeRoot && node == this.contentDiv ? false : this.contentDiv.contains(node);
    }

    calculateZoomScale(): number {
        const originalWidth = this.contentDiv.getBoundingClientRect()?.width || 0;
        const visualWidth = this.contentDiv.offsetWidth;

        return visualWidth > 0 && originalWidth > 0
            ? Math.round((originalWidth / visualWidth) * 100) / 100
            : 1;
    }

    setDomAttribute(name: string, value: string | null) {
        if (value === null) {
            this.contentDiv.removeAttribute(name);
        } else {
            this.contentDiv.setAttribute(name, value);
        }
    }

    getDomAttribute(name: string): string | null {
        return this.contentDiv.getAttribute(name);
    }

    getDomStyle<T extends keyof CSSStyleDeclaration>(style: T): CSSStyleDeclaration[T] {
        return this.contentDiv.style[style];
    }

    findClosestElementAncestor(startFrom: Node, selector?: string): HTMLElement | null {
        const startElement = isNodeOfType(startFrom, 'ELEMENT_NODE')
            ? startFrom
            : startFrom.parentElement;
        const closestElement = selector
            ? (startElement?.closest(selector) as HTMLElement | null)
            : startElement;

        return closestElement &&
            this.isNodeInEditor(closestElement) &&
            closestElement != this.contentDiv
            ? closestElement
            : null;
    }

    /**
     * Find the closest block element ancestor from the given node within current editing scope
     * @param startFrom The node to start the search from
     * @returns The closest block element ancestor
     */
    findClosestBlockElement(startFrom: Node): HTMLElement {
        let node: Node | null = startFrom;

        while (node && this.isNodeInEditor(node)) {
            if (isNodeOfType(node, 'ELEMENT_NODE') && isBlockElement(node)) {
                return node;
            }

            node = node.parentElement;
        }

        return this.contentDiv;
    }

    hasFocus(): boolean {
        const activeElement = this.shadowRoot
            ? this.shadowRoot.activeElement
            : this.doc.activeElement;
        return !!(activeElement && this.contentDiv.contains(activeElement));
    }

    /**
     * Check if the root element is in RTL mode
     */
    isRightToLeft(): boolean {
        const contentDiv = this.contentDiv;
        const style = contentDiv.ownerDocument.defaultView?.getComputedStyle(contentDiv);

        return style?.direction == 'rtl';
    }

    /**
     * Get the width of the editable area of the editor content div
     */
    getClientWidth(): number {
        const contentDiv = this.contentDiv;
        const style = contentDiv.ownerDocument.defaultView?.getComputedStyle(contentDiv);
        const paddingLeft = parseValueWithUnit(style?.paddingLeft);
        const paddingRight = parseValueWithUnit(style?.paddingRight);
        return this.contentDiv.clientWidth - (paddingLeft + paddingRight);
    }

    /**
     * Get a deep cloned root element
     */
    getClonedRoot(): HTMLElement {
        const doc = this.contentDiv.ownerDocument.implementation.createHTMLDocument();
        const clone = doc.importNode(this.contentDiv, true /*deep*/);

        return clone;
    }

    /**
     * Get format of the container element
     * @param isInDarkMode Optional flag to indicate if the environment is in dark mode
     * @param darkColorHandler Optional DarkColorHandler to retrieve dark mode colors
     */
    getContainerFormat(
        isInDarkMode?: boolean,
        darkColorHandler?: DarkColorHandler
    ): ContentModelSegmentFormat {
        const window = this.contentDiv.ownerDocument.defaultView;

        const style = window?.getComputedStyle(this.contentDiv);

        return style
            ? {
                  fontSize: style.fontSize,
                  fontFamily: style.fontFamily,
                  fontWeight: style.fontWeight,
                  textColor: getColor(
                      this.contentDiv,
                      false /*isBackgroundColor*/,
                      !!isInDarkMode,
                      darkColorHandler,
                      style.color
                  ),
                  backgroundColor: getColor(
                      this.contentDiv,
                      true /*isBackgroundColor*/,
                      !!isInDarkMode,
                      darkColorHandler,
                      style.backgroundColor
                  ),
                  italic: style.fontStyle == 'italic',
                  letterSpacing: style.letterSpacing,
                  lineHeight: style.lineHeight,
                  strikethrough: style.textDecoration?.includes('line-through'),
                  superOrSubScriptSequence: style.verticalAlign,
                  underline: style.textDecoration?.includes('underline'),
              }
            : {};
    }

    /**
     * Get text ranges by searching for a specific text, with options to match case and whole word.
     * This will only search within editable elements.
     * @param text The text to search for
     * @param matchCase Whether to match case
     * @param wholeWord Whether to match whole word
     * @returns An array of Ranges that match the search criteria
     */
    getRangesByText(text: string, matchCase: boolean, wholeWord: boolean): Range[] {
        return getRangesByText(this.contentDiv, text, matchCase, wholeWord, true /*editableOnly*/);
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

    getEventRoot(): Document {
        return this.doc;
    }

    getShadowRoot(): ShadowRoot | null {
        return this.shadowRoot;
    }
}

/**
 * @internal Create new instance of DOMHelper
 */
export function createDOMHelper(
    contentDiv: HTMLElement,
    options: DOMHelperImplOption = {}
): DOMHelper {
    return new DOMHelperImpl(contentDiv, options);
}
