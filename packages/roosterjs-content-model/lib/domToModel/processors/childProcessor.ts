import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import {
    getRegularSelectionOffsets,
    handleRegularSelection,
    processChildNode,
} from '../utils/childProcessorUtils';

/**
 * @internal
 */
export const childProcessor: ElementProcessor<ParentNode> = (group, parent, context) => {
    const [nodeStartOffset, nodeEndOffset] = getRegularSelectionOffsets(context, parent);
    let index = 0;

    for (let child = parent.firstChild; child; child = child.nextSibling) {
        handleRegularSelection(index, context, group, nodeStartOffset, nodeEndOffset);

        processChildNode(group, child, context);

        index++;
    }

    handleRegularSelection(index, context, group, nodeStartOffset, nodeEndOffset);
};
