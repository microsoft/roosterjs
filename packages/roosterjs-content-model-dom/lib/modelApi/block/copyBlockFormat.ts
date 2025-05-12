import type { ContentModelBlockFormat } from 'roosterjs-content-model-types';

const DEFAULT_FORMAT_KEYS: Partial<keyof ContentModelBlockFormat>[] = [
    'direction',
    'textAlign',
    'htmlAlign',
    'textIndent',
    'marginRight',
    'marginLeft',
    'paddingRight',
    'paddingLeft',
];

export function copyBlockFormat(
    format: ContentModelBlockFormat,
    deleteOriginalFormat: boolean,
    formatKeys: Partial<keyof ContentModelBlockFormat>[] = DEFAULT_FORMAT_KEYS
): ContentModelBlockFormat {
    let newFormat: ContentModelBlockFormat = {};

    for (const key of formatKeys) {
        if (format[key]) {
            Object.assign(newFormat, {
                [key]: format[key],
            });

            if (deleteOriginalFormat) {
                delete format[key];
            }
        }
    }

    return newFormat;
}
