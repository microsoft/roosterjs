import { updateHighlight } from './utils/updateHighlight';
import type { FindReplaceContext } from './types/FindReplaceContext';
import type { IEditor } from 'roosterjs-content-model-types';

/**
 * Start a find operation in the editor
 * @param editor The editor instance
 * @param context The FindReplaceContext to use
 * @param text The text to find
 * @param matchCase Whether to match case
 * @param wholeWord Whether to match whole words only
 */
export function find(
    editor: IEditor,
    context: FindReplaceContext,
    text: string | null,
    matchCase?: boolean,
    wholeWord?: boolean
): void {
    context.text = text;
    context.matchCase = !!matchCase;
    context.wholeWord = !!wholeWord;

    updateHighlight(editor, context);
}
