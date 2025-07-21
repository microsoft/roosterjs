import type {
    ContentModelBlockFormat,
    ReadonlyContentModelBlock,
} from 'roosterjs-content-model-types';

const MARGIN_FORMAT_KEYS = ['marginTop', 'marginLeft', 'marginBottom', 'marginRight'] as const;

type MarginFormatKey = typeof MARGIN_FORMAT_KEYS[number];

function copyBlockFormat<T extends keyof ContentModelBlockFormat>(
    block: ReadonlyContentModelBlock,
    formatKeys: readonly T[]
): Partial<Pick<ContentModelBlockFormat, T>> {
    const copiedFormat: Partial<Pick<ContentModelBlockFormat, T>> = {};

    for (const key of formatKeys) {
        if (key in block.format) {
            const format = block.format as ContentModelBlockFormat;
            const value = format[key];
            if (value !== undefined) {
                copiedFormat[key] = value;
            }
        }
    }

    return copiedFormat;
}

/**
 * @internal
 */
export function copyBlockMarginFormat(
    block: ReadonlyContentModelBlock
): Partial<Pick<ContentModelBlockFormat, MarginFormatKey>> {
    return copyBlockFormat(block, MARGIN_FORMAT_KEYS);
}
