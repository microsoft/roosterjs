import { getObjectKeys } from 'roosterjs-editor-dom';
import { createParagraphDecorator } from '../../modelApi/creators/createParagraphDecorator';
import { MarginFormat } from '../../publicTypes/format/formatParts/MarginFormat';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { formatParagraphWithContentModel } from '../utils/formatParagraphWithContentModel';

const tagNamesSupportingMargins = 'p,h1,h2,h3,h4,h5,h6';

/**
 * Toggles the current block(s) margin properties.
 * @param editor The editor to operate on
 * @param marginFormat Object containing margin props to be changed.
 * If a margin property is not in this object, it won't be changed.
 */
export default function toggleMargins(
    editor: IContentModelEditor,
    marginFormat: Pick<MarginFormat, 'marginTop' | 'marginBottom'>
) {
    formatParagraphWithContentModel(editor, 'toggleMargins', para => {
        if (!para.decorator || tagNamesSupportingMargins.indexOf(para.decorator.tagName) < 0) {
            para.decorator = createParagraphDecorator('p');
        }
        getObjectKeys(marginFormat).forEach(key => {
            if (
                para.format[key] &&
                (para.format[key] === marginFormat[key] || parseInt(para.format[key]!) > 0)
            ) {
                delete para.format[key];
            } else {
                para.format[key] = marginFormat[key];
            }
        });
    });
}
