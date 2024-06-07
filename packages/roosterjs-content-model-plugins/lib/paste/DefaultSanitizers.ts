import type { ValueSanitizer } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const DefaultSanitizers: Record<string, ValueSanitizer> = {
    width: divParagraphSanitizer,
    height: divParagraphSanitizer,
    'inline-size': divParagraphSanitizer,
    'block-size': divParagraphSanitizer,
};

/**
 * @internal
 * exported only for unit test
 */
export function divParagraphSanitizer(value: string, tagName: string): string | null {
    const tag = tagName.toLowerCase();
    if (tag == 'div' || tag == 'p') {
        return null;
    }
    return value;
}
