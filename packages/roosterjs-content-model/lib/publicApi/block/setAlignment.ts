import { formatWithContentModel } from '../utils/formatWithContentModel';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { setModelAlignment } from 'roosterjs-content-model/lib/modelApi/block/setModelAlignment';

/**
 * Set text alignment of selected paragraphs
 * @param editor The editor to set alignment
 * @param alignment Alignment value: left, center or right
 */
export default function setAlignment(
    editor: IContentModelEditor,
    alignment: 'left' | 'center' | 'right'
) {
    formatWithContentModel(editor, 'setIndentation', model => setModelAlignment(model, alignment));
}
