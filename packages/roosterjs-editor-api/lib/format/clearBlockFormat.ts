import clearFormat from './clearFormat';
import { ClearFormatMode } from 'roosterjs-editor-types';
import type { IEditor } from 'roosterjs-editor-types';

/**
 * @deprecated Use clearFormat instead and pass the ClearFormatMode.Block as parameter
 * @param editor The editor instance
 */
export default function clearBlockFormat(editor: IEditor) {
    clearFormat(editor, ClearFormatMode.Block);
}
