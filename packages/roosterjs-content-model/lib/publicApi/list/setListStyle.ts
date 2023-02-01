import { findListItemsInSameThread } from '../../modelApi/list/findListItemsInSameThread';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { getFirstSelectedListItem } from '../../modelApi/selection/collectSelections';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { ListMetadataFormat } from '../../publicTypes/format/formatParts/ListMetadataFormat';

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
                if (style.orderedStyleType !== undefined) {
                    listItem.levels[levelIndex].orderedStyleType = style.orderedStyleType;
                }

                if (style.unorderedStyleType !== undefined) {
                    listItem.levels[levelIndex].unorderedStyleType = style.unorderedStyleType;
                }
            });

            return true;
        } else {
            return false;
        }
    });
}
