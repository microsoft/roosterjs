import { getColor, isNodeOfType, parseValueWithUnit, toArray } from 'roosterjs-content-model-dom';
import type {
    ContentModelSegmentFormat,
    DarkColorHandler,
    DOMHelper,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export interface DOMHelperImplOption {
    cloneIndependentRoot?: boolean;
}

class DOMHelperImpl implements DOMHelper {
    constructor(private contentDiv: HTMLElement, private options: DOMHelperImplOption) {}

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

    /**
     * Get a deep cloned root element
     */
    getClonedRoot(): HTMLElement {
        if (this.options.cloneIndependentRoot) {
            const doc = this.contentDiv.ownerDocument.implementation.createHTMLDocument();
            const clone = doc.importNode(this.contentDiv, true /*deep*/);

            return clone;
        } else {
            return this.contentDiv.cloneNode(true /*deep*/) as HTMLElement;
        }
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
