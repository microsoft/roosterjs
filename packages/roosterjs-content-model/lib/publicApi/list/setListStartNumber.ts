import { formatWithContentModel } from '../utils/formatWithContentModel';
import { getFirstSelectedListItem } from '../../modelApi/selection/collectSelections';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';

/**
 * Set start number of a list item
 * @param editor The editor to operate on
 * @param value The number to set to, must be equal or greater than 1
 */
export default function setListStartNumber(editor: IExperimentalContentModelEditor, value: number) {
    formatWithContentModel(editor, 'setListStartNumber', model => {
        const listItem = getFirstSelectedListItem(model);
        const level = listItem?.levels[listItem?.levels.length - 1];

        if (level) {
            level.startNumberOverride = value;

            return true;
        } else {
            return false;
        }
    });
}
