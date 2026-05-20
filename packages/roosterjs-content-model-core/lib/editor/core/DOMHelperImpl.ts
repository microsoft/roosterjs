import {
    getColor,
    getRangesByText,
    isBlockElement,
    isNodeOfType,
    parseValueWithUnit,
    toArray,
} from 'roosterjs-content-model-dom';
import type {
    ContentModelSegmentFormat,
    DarkColorHandler,
    DOMHelper,
} from 'roosterjs-content-model-types';

function isShadowRoot(node: Node): node is ShadowRoot {
    return 'host' in node;
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

class DOMHelperImpl implements DOMHelper {
    private shadowRoot: ShadowRoot | null;
    private doc: Document;
    private useComposedRanges: boolean;

    constructor(private contentDiv: HTMLElement, options?: DOMHelperImplOption) {
        const rootNode = contentDiv.getRootNode();
        this.shadowRoot = isShadowRoot(rootNode) ? rootNode : null;
        this.doc = contentDiv.ownerDocument;

        const sel = this.doc.defaultView?.getSelection();
        this.useComposedRanges = !!(this.shadowRoot && sel && 'getComposedRanges' in sel);
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
        return this.doc.defaultView?.getSelection() ?? null;
    }

    getSelectionRange(): Range | null {
        const sel = this.getSelection();
        if (!sel) {
            return null;
        }

        if (this.useComposedRanges) {
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

        return sel.rangeCount > 0 ? sel.getRangeAt(0) : null;
    }

    setSelectionRange(range: Range, isReverted: boolean = false): void {
        const sel = this.getSelection();
        if (!sel) {
            return;
        }
        sel.removeAllRanges();

        const { startContainer, startOffset, endContainer, endOffset } = range;
        if (!isReverted) {
            sel.setBaseAndExtent(startContainer, startOffset, endContainer, endOffset);
        } else {
            sel.setBaseAndExtent(endContainer, endOffset, startContainer, startOffset);
        }
    }

    isSelectionReverted(): boolean {
        if (this.useComposedRanges) {
            return false;
        }

        const sel = this.getSelection();
        if (!sel || sel.rangeCount === 0) {
            return false;
        }
        const range = sel.getRangeAt(0);
        return sel.focusNode != range.endContainer || sel.focusOffset != range.endOffset;
    }

    appendToRoot(element: HTMLElement): void {
        if (this.shadowRoot) {
            this.shadowRoot.appendChild(element);
        } else {
            this.doc.body.appendChild(element);
        }
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
