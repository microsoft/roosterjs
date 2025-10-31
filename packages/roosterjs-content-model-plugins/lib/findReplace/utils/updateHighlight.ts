import { getRangesByText } from 'roosterjs-content-model-dom';
import { setMarkedIndex } from './setMarkedIndex';
import { sortRanges } from './sortRanges';
import type { IEditor } from 'roosterjs-content-model-types';
import type { FindReplaceContext } from '../types/FindReplaceContext';

/**
 * @internal
 */
export function updateHighlight(
    editor: IEditor,
    context: FindReplaceContext,
    addedBlockElements: HTMLElement[] | null = null,
    removedBlockElements: HTMLElement[] | null = null
) {
    context.findHighlight.clear();

    if (context.text) {
        const { text, matchCase, wholeWord } = context;
        const domHelper = editor.getDOMHelper();

        if (removedBlockElements) {
            context.ranges = context.ranges.filter(
                r =>
                    !removedBlockElements.some(x => x.contains(r.startContainer)) &&
                    domHelper.isNodeInEditor(r.startContainer, true /*excludeRoot*/)
            );
        } else {
            context.ranges = [];
        }

        if (addedBlockElements) {
            const newRanges = addedBlockElements.map(b =>
                getRangesByText(b, text, matchCase, wholeWord, true /*editableOnly*/)
            );
            context.ranges = context.ranges.concat(...newRanges);
        } else {
            context.ranges = domHelper.getRangesByText(text, matchCase, wholeWord);
        }

        sortRanges(context.ranges);
    } else {
        context.ranges = [];
    }

    if (context.ranges.length > 0) {
        context.findHighlight.addRanges(context.ranges);
    }

    setMarkedIndex(editor, context, -1);
}
