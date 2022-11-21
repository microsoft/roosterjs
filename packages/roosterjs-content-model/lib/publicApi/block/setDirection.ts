import { formatParagraphWithContentModel } from '../utils/formatParagraphWithContentModel';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';

/**
 * Set text direction of selected paragraphs (Left to right or Right to left)
 * @param editor The editor to set alignment
 * @param direction Direction value: ltr (Left to right) or rtl (Right to left)
 */
export default function setDirection(
    editor: IExperimentalContentModelEditor,
    direction: 'ltr' | 'rtl'
) {
    formatParagraphWithContentModel(editor, 'setDirection', para => {
        para.format.direction = direction;
    });
}
