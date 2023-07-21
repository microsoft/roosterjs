import { findListItemsInSameThread } from '../../modelApi/list/findListItemsInSameThread';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { getFirstSelectedListItem } from '../../modelApi/selection/collectSelections';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { ListMetadataFormat } from 'roosterjs-content-model-types';
import { updateListMetadata } from 'roosterjs-content-model-dom';

/**
 * Set style of list items with in same thread of current item
 * @param editor The editor to operate on
 * @param style The target list item style to set
 */
export default function setListStyle(editor: IContentModelEditor, style: ListMetadataFormat) {
    formatWithContentModel(editor, 'setListStyle', model => {
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
    });
}
