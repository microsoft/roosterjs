import type {
    ContentModelBlockFormat,
    ContentModelFormatBase,
} from 'roosterjs-content-model-types';

/**
 * When copy format between list and paragraph, these are the formats that we can copy and remove from the source
 */
export const ListFormatsToMove: (keyof ContentModelBlockFormat)[] = [
    'marginRight',
    'marginLeft',
    'paddingRight',
    'paddingLeft',
];

/**
 * When copy format between list and paragraph, these are the formats that we can copy and keep in the source
 */
export const ListFormatsToKeep: (keyof ContentModelBlockFormat)[] = [
    'direction',
    'textAlign',
    'htmlAlign',
];

/**
 * When copy format from one block to another, these are all the formats that we can copy
 */
export const ListFormats: (keyof ContentModelBlockFormat)[] = ListFormatsToMove.concat(
    ListFormatsToKeep
);

/**
 * When copy format between paragraphs, these are the formats that we can copy
 */
export const ParagraphFormats: (keyof ContentModelBlockFormat)[] = [
    'backgroundColor',
    'direction',
    'textAlign',
    'htmlAlign',
    'lineHeight',
    'textIndent',
    'marginTop',
    'marginRight',
    'marginBottom',
    'marginLeft',
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
];

/**
 * Copy formats from source to target with only specified keys
 * @param targetFormat The format object to copy format to
 * @param sourceFormat The format object to copy format from
 * @param formatKeys The format keys to copy
 * @param deleteOriginalFormat True to delete the original format from sourceFormat, false to keep it. @default false
 */
export function copyFormat<T extends ContentModelFormatBase>(
    targetFormat: T,
    sourceFormat: T,
    formatKeys: (keyof T)[],
    deleteOriginalFormat?: boolean
) {
    for (const key of formatKeys) {
        if (sourceFormat[key]) {
            Object.assign(targetFormat, {
                [key]: sourceFormat[key],
            });

            if (deleteOriginalFormat) {
                delete sourceFormat[key];
            }
        }
    }
}
