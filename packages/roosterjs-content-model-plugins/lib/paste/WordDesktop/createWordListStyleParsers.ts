import { WORD_LIST_PARAGRAPH_SELECTORS } from './removeListParagraphMargins';
import type {
    ContentModelListItemFormat,
    ContentModelListItemLevelFormat,
    CssRule,
    FormatParser,
    MarginFormat,
    ValueSanitizer,
} from 'roosterjs-content-model-types';

/**
 * @internal
 * Recover stylesheet indentation on the item, not on a shared list wrapper.
 */
export function createWordListStyleParsers(
    cssRules: CssRule[],
    sanitizers: Readonly<Record<string, ValueSanitizer>>
): {
    listLevel: FormatParser<ContentModelListItemLevelFormat>;
    listItemElement: FormatParser<ContentModelListItemFormat>;
} {
    const rules = cssRules
        .map(rule => ({
            selectors: rule.selectors.filter(selector =>
                WORD_LIST_PARAGRAPH_SELECTORS.has(selector)
            ),
            text: rule.text,
        }))
        .filter(rule => rule.selectors.length > 0);
    const cache = new WeakMap<HTMLElement, MarginFormat>();

    function sanitize(value: string, property: string, element: HTMLElement) {
        const sanitizer = sanitizers[property];
        return typeof sanitizer == 'function'
            ? sanitizer(value, element.tagName)
            : sanitizer === false
            ? null
            : value;
    }

    function getMargins(element: HTMLElement): MarginFormat {
        const cached = cache.get(element);
        if (cached) {
            return cached;
        }
        const style = element.ownerDocument.createElement('span').style;
        rules.forEach(rule => {
            if (rule.selectors.some(selector => element.matches(selector))) {
                style.cssText += rule.text;
            }
        });
        const margins: MarginFormat = {};
        (['Left', 'Right'] as const).forEach(side => {
            const key = `margin${side}` as 'marginLeft' | 'marginRight';
            const logicalKey =
                (side == 'Left') == (element.style.direction != 'rtl')
                    ? 'marginInlineStart'
                    : 'marginInlineEnd';
            if (!element.style[key] && !element.style[logicalKey] && style[key]) {
                const value = sanitize(style[key], `margin-${side.toLowerCase()}`, element);
                if (value) {
                    margins[key] = value;
                }
            }
        });
        cache.set(element, margins);
        return margins;
    }

    return {
        listLevel: (format, element) => {
            const margins = getMargins(element);
            (['Left', 'Right'] as const).forEach(side => {
                const marginKey = `margin${side}` as 'marginLeft' | 'marginRight';
                if (margins[marginKey] !== undefined) {
                    const padding = sanitize('0px', `padding-${side.toLowerCase()}`, element);
                    if (padding) {
                        format[`padding${side}` as 'paddingLeft' | 'paddingRight'] = padding;
                    }
                }
            });
        },
        listItemElement: (format, element) => {
            Object.assign(format, getMargins(element));
        },
    };
}
