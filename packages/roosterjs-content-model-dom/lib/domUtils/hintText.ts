import { isElementOfType } from './isElementOfType';
import { moveChildNodes } from './moveChildNodes';
import { setHintText } from './hiddenProperties/hintText';
import type { DOMHelper } from 'roosterjs-content-model-types';

const HintTextClass = 'roosterjs-hint-text';
const ZWS = '\u200B';

/**
 * For a given SPAN element, setup the hint text node inside it with other necessary properties.
 * If the container SPAN already has child nodes, they will be removed.
 * @param containerSpan The container SPAN element
 * @param hintText The hint text to be set
 * @returns
 */
export function setupHintTextNode(containerSpan: HTMLSpanElement, hintText: string) {
    moveChildNodes(containerSpan);

    const doc = containerSpan.ownerDocument;
    const zws1 = doc.createTextNode(ZWS);
    const zws2 = doc.createTextNode(ZWS);

    const hintInnerNode = doc.createElement('span');

    setHintText(containerSpan, hintText);

    containerSpan.className = HintTextClass;
    containerSpan.appendChild(zws1);
    containerSpan.appendChild(hintInnerNode);
    containerSpan.appendChild(zws2);

    const shadowRoot = hintInnerNode.attachShadow({ mode: 'open' });
    const hintTextNode = doc.createElement('span');
    hintTextNode.textContent = hintText;
    hintTextNode.style.color = '#999';
    shadowRoot.appendChild(hintTextNode);
}

/**
 * Check if the given element is a hint text element
 * @param element The element to check
 * @returns True if the element is a hint text element, otherwise false
 */
export function hasHintTextClass(element: HTMLElement): boolean {
    return isElementOfType(element, 'span') && element.classList.contains(HintTextClass);
}

/**
 * Get the hint text element from a given DOM helper, if any. Otherwise return null.
 * @param domHelper The domHelper to get hint text element from
 * @returns Hint text element, or null if not found
 */
export function getHintTextElement(domHelper: DOMHelper): HTMLSpanElement | null {
    return domHelper.queryElements('.' + HintTextClass)[0] as HTMLElement | null;
}
