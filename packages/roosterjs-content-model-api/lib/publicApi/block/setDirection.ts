import { setModelDirection } from '../../modelApi/block/setModelDirection';
import type { IEditor } from 'roosterjs-content-model-types';

/**
 * Set text direction of selected paragraphs (Left to right or Right to left)
 * @param editor The editor to set alignment
 * @param direction Direction value: ltr (Left to right) or rtl (Right to left)
 */
export function setDirection(editor: IEditor, direction: 'ltr' | 'rtl') {
    editor.focus();

    editor.formatContentModel(model => setModelDirection(model, direction), {
        apiName: 'setDirection',
    });
}
