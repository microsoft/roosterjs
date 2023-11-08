import { setModelDirection } from '../../modelApi/block/setModelDirection';
import type { IContentModelEditor } from '../../publicTypes/IContentModelEditor';

/**
 * Set text direction of selected paragraphs (Left to right or Right to left)
 * @param editor The editor to set alignment
 * @param direction Direction value: ltr (Left to right) or rtl (Right to left)
 */
export default function setDirection(editor: IContentModelEditor, direction: 'ltr' | 'rtl') {
    editor.focus();

    editor.formatContentModel(model => setModelDirection(model, direction), {
        apiName: 'setDirection',
    });
}
