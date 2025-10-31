import { scrollRectIntoView } from 'roosterjs-content-model-dom';
import type { IEditor, Rect } from 'roosterjs-content-model-types';
import type { FindReplaceContext } from '../types/FindReplaceContext';

/**
 * @internal
 */
export function setMarkedIndex(
    editor: IEditor,
    context: FindReplaceContext,
    index: number,
    alternativeRange?: Range | null
): void {
    context.replaceHighlight.clear();
    context.markedIndex = index;

    const range = context.ranges[context.markedIndex];

    if (range) {
        context.replaceHighlight.addRanges([range]);
        let rect: Rect | null;

        if (context.scrollMargin >= 0 && (rect = editor.getVisibleViewport())) {
            scrollRectIntoView(
                editor.getScrollContainer(),
                rect,
                editor.getDOMHelper(),
                range.getBoundingClientRect(),
                context.scrollMargin,
                true /*preferTop*/
            );
        }
    } else {
        context.markedIndex = -1;
    }

    editor.triggerEvent('findResultChanged', {
        markedIndex: context.markedIndex,
        ranges: context.ranges,
        alternativeRange,
    });
}
