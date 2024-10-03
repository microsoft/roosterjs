import { mutateBlock } from 'roosterjs-content-model-dom';
import { splitParagraph } from '../utils/splitParagraph';
import type {
    DeleteSelectionStep,
    ShallowMutableContentModelParagraph,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const handleEnterOnParagraph: DeleteSelectionStep = context => {
    const { paragraph, path } = context.insertPoint;
    const paraIndex = path[0]?.blocks.indexOf(paragraph) ?? -1;

    if (context.deleteResult == 'notDeleted' && paraIndex >= 0) {
        const newPara = splitParagraph(context.insertPoint);

        cleanUpStylesForNewParagraph(newPara);

        mutateBlock(path[0]).blocks.splice(paraIndex + 1, 0, newPara);

        context.deleteResult = 'range';
        context.lastParagraph = newPara;
        context.insertPoint.paragraph = newPara;
    }
};

function cleanUpStylesForNewParagraph(paragraph: ShallowMutableContentModelParagraph) {
    // New paragraph should not have white-space style
    if (
        paragraph.segments.every(
            seg => seg.segmentType == 'Br' || seg.segmentType == 'SelectionMarker'
        )
    ) {
        delete paragraph.format.whiteSpace;
    }
}
