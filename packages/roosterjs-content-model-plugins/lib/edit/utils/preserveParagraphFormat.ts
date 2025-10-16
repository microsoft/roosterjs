import type { ShallowMutableContentModelParagraph } from 'roosterjs-content-model-types/lib';

export function preserveParagraphFormat(
    formatToKeep: string[] | undefined,
    paragraph: ShallowMutableContentModelParagraph,
    newParagraph: ShallowMutableContentModelParagraph
) {
    if (formatToKeep && formatToKeep.length) {
        const format = paragraph.format as { [key: string]: string };
        const newFormat = newParagraph.format as { [key: string]: string };
        formatToKeep.forEach(key => {
            const formatValue = format[key];

            if (formatValue !== undefined) {
                newFormat[key] = formatValue;
            }
        });
    }
}
