import { findListItemsInSameThread } from '../../modelApi/list/findListItemsInSameThread';
import { getFirstSelectedListItem, updateListMetadata } from 'roosterjs-content-model-core';
import type { IStandaloneEditor, ListMetadataFormat } from 'roosterjs-content-model-types';

/**
 * Set style of list items with in same thread of current item
 * @param editor The editor to operate on
 * @param style The target list item style to set
 */
export default function setListStyle(editor: IStandaloneEditor, style: ListMetadataFormat) {
    editor.focus();

    editor.formatContentModel(
        model => {
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

                return true;
            } else {
                return false;
            }
        },
        {
            apiName: 'setListStyle',
        }
    );
}
