import type { ShallowMutableContentModelParagraph } from 'roosterjs-content-model-types';

/**
 * @internal
 * Preserve specific paragraph format properties from source paragraph to target paragraph
 * @param formatsToPreserveOnMerge Array of format property names to preserve
 * @param paragraph Source paragraph to copy format from
 * @param newParagraph Target paragraph to copy format to
 */
export function preserveParagraphFormat(
    formatsToPreserveOnMerge: string[] | undefined,
    paragraph: ShallowMutableContentModelParagraph,
    newParagraph: ShallowMutableContentModelParagraph
) {
    if (formatsToPreserveOnMerge && formatsToPreserveOnMerge.length) {
        const format = paragraph.format as { [key: string]: string };
        const newFormat = newParagraph.format as { [key: string]: string };
        formatsToPreserveOnMerge.forEach(key => {
            const formatValue = format[key];

            if (formatValue !== undefined) {
                newFormat[key] = formatValue;
            }
        });
    }
}
