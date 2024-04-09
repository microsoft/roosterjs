import { formatTextSegmentBeforeSelectionMarker } from 'roosterjs-content-model-api';
import { getQueryString } from './getQueryString';
import { mergeModel } from 'roosterjs-content-model-dom';
import type {
    ContentModelDocument,
    ContentModelText,
    FormatContentModelOptions,
    IEditor,
} from 'roosterjs-content-model-types';

/**
 * Replace the query string with a given Content Model.
 * This is used for commit a change from picker and insert the committed content into editor.
 * @param model The Content Model to insert
 * @param options Options for formatting content model
 * @param canUndoByBackspace Whether this change can be undone using Backspace key
 */
export function replaceQueryString(
    editor: IEditor,
    triggerCharacter: string,
    model: ContentModelDocument,
    options?: FormatContentModelOptions,
    canUndoByBackspace?: boolean
): void {
    editor.focus();

    formatTextSegmentBeforeSelectionMarker(
        editor,
        (target, previousSegment, paragraph, _, context) => {
            const potentialSegments: ContentModelText[] = [];
            const queryString = getQueryString(
                triggerCharacter,
                paragraph,
                previousSegment,
                potentialSegments
            );

            if (queryString) {
                potentialSegments.forEach(x => (x.isSelected = true));
                mergeModel(target, model, context);
                context.canUndoByBackspace = canUndoByBackspace;
                return true;
            } else {
                return false;
            }
        },
        options
    );
}
