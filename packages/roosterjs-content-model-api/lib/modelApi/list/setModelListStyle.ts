import { findListItemsInSameThread } from './findListItemsInSameThread';
import {
    getFirstSelectedListItem,
    mutateBlock,
    updateListMetadata,
} from 'roosterjs-content-model-dom';
import type {
    ListMetadataFormat,
    ReadonlyContentModelDocument,
} from 'roosterjs-content-model-types';

/**
 * Set style of list items with in same thread of current item
 * @param model The model document
 * @param style The style to set
 */
export function setModelListStyle(model: ReadonlyContentModelDocument, style: ListMetadataFormat) {
    const listItem = getFirstSelectedListItem(model);

    if (listItem) {
        const listItems = findListItemsInSameThread(model, listItem);
        const levelIndex = listItem.levels.length - 1;

        listItems.forEach(listItem => {
            const level = mutateBlock(listItem).levels[levelIndex];

            if (level) {
                updateListMetadata(level, metadata => Object.assign({}, metadata, style));
            }
        });
    }
    return !!listItem;
}
