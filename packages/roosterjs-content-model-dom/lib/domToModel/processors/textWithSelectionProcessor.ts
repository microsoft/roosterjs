import { addSelectionMarker } from '../utils/addSelectionMarker';
import { addTextSegment } from '../../modelApi/common/addTextSegment';
import { getRegularSelectionOffsets } from '../utils/getRegularSelectionOffsets';
import type { ElementProcessor } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const textWithSelectionProcessor: ElementProcessor<Text> = (group, textNode, context) => {
    let txt = textNode.nodeValue || '';
    const offsets = getRegularSelectionOffsets(context, textNode);
    const txtStartOffset = offsets[0];
    let txtEndOffset = offsets[1];

    if (txtStartOffset >= 0) {
        const subText = txt.substring(0, txtStartOffset);
        addTextSegment(group, subText, context);
        context.isInSelection = true;

        addSelectionMarker(group, context, textNode, txtStartOffset);

        txt = txt.substring(txtStartOffset);
        txtEndOffset -= txtStartOffset;
    }

    if (txtEndOffset >= 0) {
        const subText = txt.substring(0, txtEndOffset);
        addTextSegment(group, subText, context);

        if (
            context.selection &&
            (context.selection.type != 'range' || !context.selection.range.collapsed)
        ) {
            addSelectionMarker(group, context, textNode, offsets[1]); // Must use offsets[1] here as the unchanged offset value, cannot use txtEndOffset since it has been modified
        }

        context.isInSelection = false;
        txt = txt.substring(txtEndOffset);
    }

    addTextSegment(group, txt, context);
};
