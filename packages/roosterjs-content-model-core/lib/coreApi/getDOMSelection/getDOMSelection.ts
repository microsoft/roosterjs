import type { DOMSelection, GetDOMSelection, EditorCore } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const getDOMSelection: GetDOMSelection = core => {
    if (core.lifecycle.shadowEditFragment) {
        return null;
    } else {
        const selection = core.selection.selection;

        return selection && (selection.type != 'range' || !core.domHelper.hasFocus())
            ? selection
            : getNewSelection(core);
    }
};

function getNewSelection(core: EditorCore): DOMSelection | null {
    const range = core.domHelper.getSelectionRange();

    if (!range || !core.logicalRoot.contains(range.commonAncestorContainer)) {
        return null;
    }

    const isReverted = core.domHelper.isSelectionReverted(range);

    return {
        type: 'range',
        range,
        isReverted,
    };
}
