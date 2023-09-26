import { ContentModelEditorCore, GetDOMSelection } from '../../publicTypes/ContentModelEditorCore';
import { DOMSelection } from 'roosterjs-content-model-types';
import { SelectionRangeTypes } from 'roosterjs-editor-types';

/**
 * @internal
 */
export const getDOMSelection: GetDOMSelection = core => {
    return core.cache.cachedSelection ?? getNewSelection(core);
};

function getNewSelection(core: ContentModelEditorCore): DOMSelection | null {
    // TODO: Get rid of getSelectionRangeEx when we have standalone editor
    const rangeEx = core.api.getSelectionRangeEx(core);

    if (rangeEx.type == SelectionRangeTypes.Normal && rangeEx.ranges[0]) {
        return {
            type: 'range',
            range: rangeEx.ranges[0],
        };
    } else if (rangeEx.type == SelectionRangeTypes.TableSelection && rangeEx.coordinates) {
        return {
            type: 'table',
            table: rangeEx.table,
            firstColumn: rangeEx.coordinates.firstCell.x,
            lastColumn: rangeEx.coordinates.lastCell.x,
            firstRow: rangeEx.coordinates.firstCell.y,
            lastRow: rangeEx.coordinates.lastCell.y,
        };
    } else if (rangeEx.type == SelectionRangeTypes.ImageSelection) {
        return {
            type: 'image',
            image: rangeEx.image,
        };
    } else {
        return null;
    }
}
