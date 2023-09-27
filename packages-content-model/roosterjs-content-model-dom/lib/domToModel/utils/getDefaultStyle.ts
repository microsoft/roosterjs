import { defaultHTMLStyleMap } from '../../config/defaultHTMLStyleMap';
import type { DefaultStyleMap, DomToModelContext } from 'roosterjs-content-model-types';

/**
 * @internal
 * Get default CSS style of given element
 * @param element The element to get default style from
 * @param context The context of DOM to Content Model conversion
 * @returns A valid CSS style object
 */
export function getDefaultStyle(
    element: HTMLElement,
    context: DomToModelContext
): Partial<CSSStyleDeclaration> {
    let tag = element.tagName.toLowerCase() as keyof DefaultStyleMap;

    return defaultHTMLStyleMap[tag] || {};
}
