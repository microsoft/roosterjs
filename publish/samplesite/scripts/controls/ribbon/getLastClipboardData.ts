import { ClipboardData, IEditor } from 'roosterjs-editor-types';

export interface ClipboardDataWrapper {
    data: ClipboardData;
}

export default function getLastClipboardData(editor: IEditor): ClipboardDataWrapper {
    return editor.getCustomData('LAST_CLIPBOARD_DATA', () => ({
        data: null,
    }));
}
