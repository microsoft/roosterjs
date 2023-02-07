import { getObjectKeys } from 'roosterjs-editor-dom';
import { MarginFormat } from '../../publicTypes/format/formatParts/MarginFormat';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { formatParagraphWithContentModel } from '../utils/formatParagraphWithContentModel';

/**
 * Toggles the current block(s) margin properties.
 * @param editor The editor to operate on
 * @param marginFormat Object containing margin props to be changed.
 * If a margin property is not in this object, it won't be changed.
 */
export default function toggleMargins(editor: IContentModelEditor, marginFormat: MarginFormat) {
    formatParagraphWithContentModel(editor, 'toggleMargins', para => {
        getObjectKeys(marginFormat).forEach(key => {
            if (para.format[key] === marginFormat[key]) {
                delete para.format[key];
            } else {
                para.format[key] = marginFormat[key];
            }
        });
    });
}
