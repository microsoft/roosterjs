import {
    createParagraph,
    getSelectedSegmentsAndParagraphs,
    mutateBlock,
} from 'roosterjs-content-model-dom';
import type {
    ReadonlyContentModelDocument,
    ReadonlyContentModelParagraph,
    ShallowMutableContentModelParagraph,
} from 'roosterjs-content-model-types';

/**
 * @internal
 * For all selected paragraphs, if it has BR in middle of other segments, split the paragraph into multiple paragraphs
 * @param model The model to process
 */
export function splitSelectedParagraphByBr(model: ReadonlyContentModelDocument) {
    const selections = getSelectedSegmentsAndParagraphs(
        model,
        false /*includingFormatHolder*/,
        false /*includingEntity*/
    );

    for (const [_, para, path] of selections) {
        if (para?.segments.some(s => s.segmentType == 'Br')) {
            let currentParagraph = shallowColonParagraph(para);
            let hasVisibleSegment = false;
            const newParagraphs: ShallowMutableContentModelParagraph[] = [];
            const parent = mutateBlock(path[0]);
            const index = parent.blocks.indexOf(para);

            if (index >= 0) {
                for (const segment of mutateBlock(para).segments) {
                    if (segment.segmentType == 'Br') {
                        if (!hasVisibleSegment) {
                            currentParagraph.segments.push(segment);
                        }

                        if (currentParagraph.segments.length > 0) {
                            newParagraphs.push(currentParagraph);
                        }

                        currentParagraph = shallowColonParagraph(para);
                        hasVisibleSegment = false;
                    } else {
                        currentParagraph.segments.push(segment);

                        if (segment.segmentType != 'SelectionMarker') {
                            hasVisibleSegment = true;
                        }
                    }
                }

                if (currentParagraph.segments.length > 0) {
                    newParagraphs.push(currentParagraph);
                }

                parent.blocks.splice(index, 1, ...newParagraphs);
            }
        }
    }
}

function shallowColonParagraph(
    para: ReadonlyContentModelParagraph
): ShallowMutableContentModelParagraph {
    return createParagraph(false /*isImplicit*/, para.format, para.segmentFormat, para.decorator);
}
