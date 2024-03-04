import { defaultHTMLStyleMap } from '../../config/defaultHTMLStyleMap';
import type { DefaultStyleMap } from 'roosterjs-content-model-types';

/**
 * @internal
 * Get default CSS style of given element
 * @param element The element to get default style from
 * @returns A valid CSS style object
 */
export function getDefaultStyle(element: HTMLElement): Partial<CSSStyleDeclaration> {
    const tag = element.tagName.toLowerCase() as keyof DefaultStyleMap;

    return defaultHTMLStyleMap[tag] || {};
}
