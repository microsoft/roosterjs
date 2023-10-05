import type {
    ContentModelEditorCore,
    GetDOMSelection,
} from '../../publicTypes/ContentModelEditorCore';
import type { RangeSelection } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const getDOMSelection: GetDOMSelection = core => {
    return (
        core.cache.cachedSelection ??
        core.selection.tableSelection ??
        core.selection.imageSelection ??
        getRangeSelection(core)
    );
};

function getRangeSelection(core: ContentModelEditorCore): RangeSelection | null {
    let selection = core.contentDiv.ownerDocument.defaultView?.getSelection();

    if (selection && selection.rangeCount > 0) {
        let range = selection.getRangeAt(0);

        if (contains(core.contentDiv, range)) {
            return {
                type: 'range',
                range,
            };
        }
    }

    return null;
}
