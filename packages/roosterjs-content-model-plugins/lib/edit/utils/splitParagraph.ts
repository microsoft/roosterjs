import {
    copyFormat,
    createBr,
    createParagraph,
    normalizeParagraph,
    ParagraphFormats,
    setParagraphNotImplicit,
} from 'roosterjs-content-model-dom';
import type {
    InsertPoint,
    ShallowMutableContentModelParagraph,
} from 'roosterjs-content-model-types';

/**
 * @internal
 * Split the given paragraph from insert point into two paragraphs,
 * and move the selection marker to the beginning of the second paragraph
 * @param insertPoint The input insert point which includes the paragraph and selection marker
 * @param removeImplicitParagraph Whether to remove the implicit paragraph if it becomes empty after split
 * * If set to false, the implicit paragraph will be preserved even if it becomes empty
 * * If set to true, the implicit paragraph will be removed if it becomes empty
 * @returns The new paragraph it created
 */
export function splitParagraph(
    insertPoint: InsertPoint,
    removeImplicitParagraph: boolean = true,
    formatToKeep: string[] = []
): ShallowMutableContentModelParagraph {
    const { paragraph, marker } = insertPoint;
    const newParagraph: ShallowMutableContentModelParagraph = createParagraph(
        false /*isImplicit*/,
        {},
        paragraph.segmentFormat
    );

    copyFormat(newParagraph.format, paragraph.format, ParagraphFormats);
    ``;
    if (formatToKeep.length) {
        const format = paragraph.format as { [key: string]: string };
        const newFormat = newParagraph.format as { [key: string]: string };
        formatToKeep.forEach(key => {
            const formatValue = format[key];

            if (formatValue !== undefined) {
                newFormat[key] = formatValue;
            }
        });
    }

    const markerIndex = paragraph.segments.indexOf(marker);
    const segments = paragraph.segments.splice(
        markerIndex,
        paragraph.segments.length - markerIndex
    );

    newParagraph.segments.push(...segments);

    const isEmptyParagraph = paragraph.segments.length == 0;
    const shouldPreserveImplicitParagraph = !paragraph.isImplicit || !removeImplicitParagraph;

    if (isEmptyParagraph && shouldPreserveImplicitParagraph) {
        paragraph.segments.push(createBr(marker.format));
    } else if (!isEmptyParagraph) {
        setParagraphNotImplicit(paragraph);
    }

    insertPoint.paragraph = newParagraph;

    normalizeParagraph(paragraph);

    return newParagraph;
}
