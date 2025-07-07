import { setModelDirection } from '../../modelApi/block/setModelDirection';
import type { IEditor } from 'roosterjs-content-model-types';

/**
 * Set text direction of selected paragraphs (Left to right or Right to left)
 * @param editor The editor to set alignment
 * @param direction Direction value: ltr (Left to right) or rtl (Right to left), or 'auto' (Based on the first characters of the document, set the direction automatically)
 */
export function setDirection(editor: IEditor, direction: 'ltr' | 'rtl' | 'auto') {
    editor.focus();

    editor.formatContentModel(model => setModelDirection(model, direction), {
        apiName: 'setDirection',
    });
}
