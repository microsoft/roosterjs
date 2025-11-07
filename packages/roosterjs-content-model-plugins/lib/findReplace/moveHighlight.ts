import { setMarkedIndex } from './utils/setMarkedIndex';
import type { IEditor } from 'roosterjs-content-model-types';
import type { FindReplaceContext } from './types/FindReplaceContext';

/**
 * Move the highlight to next or previous match
 * @param editor The editor instance
 * @param context The FindReplaceContext to use
 * @param forward Whether to move forward or backward
 */
export function moveHighlight(editor: IEditor, context: FindReplaceContext, forward: boolean) {
    if (context.ranges.length > 0) {
        const newIndex =
            !forward && context.markedIndex == -1
                ? context.ranges.length - 1
                : (context.markedIndex + (forward ? 1 : -1) + context.ranges.length) %
                  context.ranges.length;

        setMarkedIndex(editor, context, newIndex);
    }
}
