import { getRegularSelectionOffsets } from '../utils/getRegularSelectionOffsets';
import { handleRegularSelection } from './childProcessor';
import type { ElementProcessor } from 'roosterjs-content-model-types';

/**
 * @internal
 * @param group
 * @param element
 * @param context
 */
export const delimiterProcessor: ElementProcessor<Node> = (group, element, context) => {
    let index = 0;
    const [nodeStartOffset, nodeEndOffset] = getRegularSelectionOffsets(context, element);

    for (let child = element.firstChild; child; child = child.nextSibling) {
        handleRegularSelection(index, context, group, nodeStartOffset, nodeEndOffset);

        delimiterProcessor(group, child, context);
        index++;
    }

    handleRegularSelection(index, context, group, nodeStartOffset, nodeEndOffset);
};
