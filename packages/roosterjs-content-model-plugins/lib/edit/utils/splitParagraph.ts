import {
    createParagraph,
    normalizeParagraph,
    setParagraphNotImplicit,
} from 'roosterjs-content-model-dom';
import type { InsertPoint } from 'roosterjs-content-model-types';

/**
 * @internal
 * Split the given paragraph from insert point into two paragraphs,
 * and move the selection marker to the beginning of the second paragraph
 * @param insertPoint The input insert point which includes the paragraph and selection marker
 * @returns The new paragraph it created
 */
export function splitParagraph(insertPoint: InsertPoint) {
    const { paragraph, marker } = insertPoint;
    const newParagraph = createParagraph(
        false /*isImplicit*/,
        paragraph.format,
        paragraph.segmentFormat
    );

    const markerIndex = paragraph.segments.indexOf(marker);
    const segments = paragraph.segments.splice(
        markerIndex,
        paragraph.segments.length - markerIndex
    );

    newParagraph.segments.push(...segments);

    setParagraphNotImplicit(paragraph);

    insertPoint.paragraph = newParagraph;

    normalizeParagraph(paragraph);
    normalizeParagraph(newParagraph);

    return newParagraph;
}
