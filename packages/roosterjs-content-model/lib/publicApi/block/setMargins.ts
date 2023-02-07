import { getObjectKeys } from 'roosterjs-editor-dom';
import { MarginFormat } from '../../publicTypes/format/formatParts/MarginFormat';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { formatParagraphWithContentModel } from '../utils/formatParagraphWithContentModel';

/**
 * Channges the current block(s) margin properties.
 * @param editor The editor to operate on
 * @param marginFormat Object containing margin props to be changed.
 * If a margin property is not in this object, it won't be changed.
 */
export default function setMargins(editor: IContentModelEditor, marginFormat: MarginFormat) {
    formatParagraphWithContentModel(editor, 'setMargins', para => {
        getObjectKeys(marginFormat).forEach(key => {
            if (marginFormat[key]) {
                para.format[key] = marginFormat[key];
            } else {
                delete para.format[key];
            }
        });
    });
}
