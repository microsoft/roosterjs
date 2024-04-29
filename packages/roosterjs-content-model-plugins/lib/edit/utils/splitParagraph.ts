import {
    createBr,
    createParagraph,
    normalizeParagraph,
    setParagraphNotImplicit,
} from 'roosterjs-content-model-dom';
import type { InsertPoint } from 'roosterjs-content-model-types';

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

    if (paragraph.segments.every(x => x.segmentType == 'SelectionMarker')) {
        paragraph.segments.push(createBr(marker.format));
    }

    normalizeParagraph(newParagraph);

    return newParagraph;
}
