import { formatTextSegmentBeforeSelectionMarker } from 'roosterjs-content-model-api';
import { getQueryString } from './getQueryString';
import { mergeModel } from 'roosterjs-content-model-dom';
import type {
    ContentModelDocument,
    ContentModelText,
    FormatContentModelOptions,
    IEditor,
} from 'roosterjs-content-model-types';
import type { PickerDirection, PickerHandler } from './PickerHandler';
import type { PickerHelper } from './PickerHelper';

/**
 * @internal
 */
export class PickerHelperImpl implements PickerHelper {
    public direction: PickerDirection | null = null;

    constructor(
        public readonly editor: IEditor,
        public readonly handler: PickerHandler,
        private triggerCharacter: string
    ) {}

    /**
     * Replace the query string with a given Content Model.
     * This is used for commit a change from picker and insert the committed content into editor.
     * @param model The Content Model to insert
     * @param options Options for formatting content model
     * @param canUndoByBackspace Whether this change can be undone using Backspace key
     */
    replaceQueryString(
        model: ContentModelDocument,
        options?: FormatContentModelOptions,
        canUndoByBackspace?: boolean
    ): void {
        this.editor.focus();

        formatTextSegmentBeforeSelectionMarker(
            this.editor,
            (target, previousSegment, paragraph, _, context) => {
                const potentialSegments: ContentModelText[] = [];
                const queryString = getQueryString(
                    this.triggerCharacter,
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

    /**
     * Notify Picker Plugin that picker is closed from the handler code, so picker plugin can quit the suggesting state
     */
    closePicker() {
        if (this.direction) {
            this.direction = null;
            this.handler.onClosePicker?.();
        }
    }
}
