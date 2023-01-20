import { DefaultStyleMap } from '../../publicTypes/context/DomToModelSettings';
import { DomToModelContext } from '../../publicTypes/context/DomToModelContext';

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

    if (tag == 'a' && !element.hasAttribute('href')) {
        // For A tag without Href, treat it as SPAN since it will not be rendered as a link
        tag = 'span';
    }

    return context.defaultStyles[tag] || {};
}
