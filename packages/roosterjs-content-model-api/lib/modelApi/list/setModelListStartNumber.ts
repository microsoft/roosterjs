import { getFirstSelectedListItem, mutateBlock } from 'roosterjs-content-model-dom';
import type { ReadonlyContentModelDocument } from 'roosterjs-content-model-types';

/**
 * Set start number of a list item
 * @param model The model document
 * @param value The number to set to, must be equal or greater than 1
 */
export function setModelListStartNumber(model: ReadonlyContentModelDocument, value: number) {
    const listItem = getFirstSelectedListItem(model);
    const level = listItem ? mutateBlock(listItem).levels[listItem?.levels.length - 1] : null;

    if (level) {
        level.format.startNumberOverride = value;

        return true;
    } else {
        return false;
    }
}
