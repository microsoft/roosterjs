import { ClipboardData } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';

export interface ClipboardDataWrapper {
    data: ClipboardData;
}

export default function getLastClipboardData(editor: Editor): ClipboardDataWrapper {
    return editor.getCustomData('LAST_CLIPBOARD_DATA', () => ({
        data: null,
    }));
}
