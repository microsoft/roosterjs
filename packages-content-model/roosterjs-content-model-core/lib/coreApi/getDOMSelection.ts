import type { EditorCore } from '../publicTypes/editor/EditorCore';
import type { GetDOMSelection } from '../publicTypes/coreApi/GetDOMSelection';
import type { RangeSelection } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const getDOMSelection: GetDOMSelection = (core, forceGetNewSelection) => {
    return (forceGetNewSelection ? null : core.selection.lastSelection) ?? getNewSelection(core);
};

function getNewSelection(core: EditorCore): RangeSelection | null {
    const selection = core.contentDiv.ownerDocument.defaultView?.getSelection();
    let result: RangeSelection | null = null;

    if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);

        if (core.contentDiv.contains(range.commonAncestorContainer)) {
            result = {
                range,
                type: 'range',
            };
        }
    }

    return result;
}
