import { isNodeOfType, parseValueWithUnit, toArray } from 'roosterjs-content-model-dom';
import type { DOMHelper } from 'roosterjs-content-model-types';

class DOMHelperImpl implements DOMHelper {
    constructor(private contentDiv: HTMLElement) {}

    queryElements(selector: string): HTMLElement[] {
        return toArray(this.contentDiv.querySelectorAll(selector)) as HTMLElement[];
    }

    getTextContent(): string {
        return this.contentDiv.textContent || '';
    }

    isNodeInEditor(node: Node, excludeSelf?: boolean): boolean {
        return this.contentDiv.contains(node) && (!excludeSelf || node != this.contentDiv);
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

    hasFocus(): boolean {
        const activeElement = this.contentDiv.ownerDocument.activeElement;
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
}

/**
 * @internal Create new instance of DOMHelper
 */
export function createDOMHelper(contentDiv: HTMLElement): DOMHelper {
    return new DOMHelperImpl(contentDiv);
}
