import type {
    DOMSelection,
    GetDOMSelection,
    StandaloneEditorCore,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const getDOMSelection: GetDOMSelection = core => {
    return core.lifecycle.shadowEditFragment
        ? null
        : core.cache.cachedSelection ?? getNewSelection(core);
};

function getNewSelection(core: StandaloneEditorCore): DOMSelection | null {
    // TODO: Reorganize the selection storage when we port selection plugin
    if (core.domEvent.tableSelectionRange?.coordinates) {
        const { table, coordinates } = core.domEvent.tableSelectionRange;

        return {
            type: 'table',
            table: table,
            firstColumn: coordinates.firstCell.x,
            lastColumn: coordinates.lastCell.x,
            firstRow: coordinates.firstCell.y,
            lastRow: coordinates.lastCell.y,
        };
    } else if (core.domEvent.imageSelectionRange) {
        const { image } = core.domEvent.imageSelectionRange;

        return {
            type: 'image',
            image: image,
        };
    } else {
        let selection: Selection | null | undefined;
        let range =
            core.api.hasFocus(core) &&
            (selection = core.contentDiv.ownerDocument.defaultView?.getSelection()) &&
            selection.rangeCount > 0
                ? selection.getRangeAt(0)
                : null;

        return range && core.contentDiv.contains(range.commonAncestorContainer)
            ? {
                  type: 'range',
                  range: range,
              }
            : null;
    }
}
