import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { getRegularSelectionOffsets } from '../utils/getRegularSelectionOffsets';
import { handleRegularSelection } from './childProcessor';

/**
 * @internal
 * @param group
 * @param element
 * @param context
 */
export const delimiterProcessor: ElementProcessor<HTMLSpanElement> = (group, element, context) => {
    let index = 0;
    const [nodeStartOffset, nodeEndOffset] = getRegularSelectionOffsets(context, element);

    for (let child = element.firstChild; child; child = child.nextSibling) {
        handleRegularSelection(index, context, group, nodeStartOffset, nodeEndOffset);
        index++;
    }

    handleRegularSelection(index, context, group, nodeStartOffset, nodeEndOffset);
};
