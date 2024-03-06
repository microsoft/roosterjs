import { setModelAlignment } from '../../modelApi/block/setModelAlignment';
import type { IEditor } from 'roosterjs-content-model-types';

/**
 * Set text alignment of selected paragraphs
 * @param editor The editor to set alignment
 * @param alignment Alignment value: left, center or right
 */
export function setAlignment(editor: IEditor, alignment: 'left' | 'center' | 'right' | 'justify') {
    editor.focus();

    editor.formatContentModel(model => setModelAlignment(model, alignment), {
        apiName: 'setAlignment',
    });
}
