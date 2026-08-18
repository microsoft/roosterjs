import { getListItemFromInsertPoint } from '../../edit/utils/getListItemFromInsertPoint';
import { mutateBlock } from 'roosterjs-content-model-dom';
import type { DeleteSelectionStep } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const reorderList: DeleteSelectionStep = context => {
    if (context.deleteResult != 'range') {
        return;
    }

    const { paragraph } = context.insertPoint;
    const listItemAndParent = getListItemFromInsertPoint(context.insertPoint);

    if (listItemAndParent) {
        const [item] = listItemAndParent;
        const mutableList = mutateBlock(item);
        mutableList.blocks.splice(mutableList.blocks.indexOf(paragraph), mutableList.blocks.length);
    }
};
