import { ContentModelDocument, ListMetadataFormat } from 'roosterjs-content-model-types';
import { findListItemsInSameThread } from './findListItemsInSameThread';
import { getFirstSelectedListItem, updateListMetadata } from 'roosterjs-content-model-dom';

/**
 * Set style of list items with in same thread of current item
 * @param model The model document
 * @param style The style to set
 */
export function setModelListStyle(model: ContentModelDocument, style: ListMetadataFormat) {
    const listItem = getFirstSelectedListItem(model);

    if (listItem) {
        const listItems = findListItemsInSameThread(model, listItem);
        const levelIndex = listItem.levels.length - 1;

        listItems.forEach(listItem => {
            const level = listItem.levels[levelIndex];

            if (level) {
                updateListMetadata(level, metadata => Object.assign({}, metadata, style));
            }
        });
    }
    return !!listItem;
}
