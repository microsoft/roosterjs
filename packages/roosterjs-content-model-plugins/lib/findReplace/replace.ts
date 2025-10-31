import { ChangeSource } from 'roosterjs-content-model-dom';
import { replaceTextInRange } from './utils/replaceTextInRange';
import { setMarkedIndex } from './utils/setMarkedIndex';
import type { IEditor } from 'roosterjs-content-model-types';
import type { FindReplaceContext } from './types/FindReplaceContext';

/**
 * Replace the currently found item or all found items in the editor
 * @param editor The editor instance
 * @param context The FindReplaceContext to use
 * @param replaceText The text to replace with
 * @param replaceAll Whether to replace all found items
 */
export function replace(
    editor: IEditor,
    context: FindReplaceContext,
    replaceText: string,
    replaceAll: boolean = false
): void {
    if (context.text) {
        editor.takeSnapshot();
        let isReplaced = false;

        do {
            const range = context.ranges[context.markedIndex];

            if (!range || !editor.getDOMHelper().isNodeInEditor(range.startContainer)) {
                setMarkedIndex(editor, context, 0);
            } else {
                const resultRange = replaceTextInRange(range, replaceText, context.ranges);

                context.ranges.splice(context.markedIndex, 1);
                setMarkedIndex(
                    editor,
                    context,
                    context.markedIndex >= context.ranges.length ? 0 : context.markedIndex,
                    resultRange
                );

                isReplaced = true;
            }
        } while (replaceAll && context.ranges[context.markedIndex]);

        context.findHighlight.clear();

        if (context.ranges.length > 0) {
            context.findHighlight.addRanges(context.ranges);
        }

        if (isReplaced) {
            editor.takeSnapshot();
            editor.triggerEvent('contentChanged', {
                data: replaceText,
                source: ChangeSource.Replace,
            });
        }
    } else {
        setMarkedIndex(editor, context, -1);
    }
}
