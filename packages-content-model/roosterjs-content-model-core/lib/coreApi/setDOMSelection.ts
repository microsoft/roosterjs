import { addRangeToSelection } from '../modelApi/selection/addRangeToSelection';
import { areSameSelection } from '../modelApi/selection/areSameSelection';
import type { SetDOMSelection } from '../publicTypes/coreApi/SetDOMSelection';

/**
 * @internal
 */
export const setDOMSelection: SetDOMSelection = (core, newSelection) => {
    const oldSelection = core.selection.lastSelection;

    switch (newSelection.type) {
        case 'range':
            addRangeToSelection(core.contentDiv.ownerDocument, newSelection.range);
            break;

        case 'image':
            break;

        case 'table':
            break;
    }

    core.selection.lastSelection = newSelection;

    if (!oldSelection || areSameSelection(oldSelection, newSelection)) {
        core.api.triggerEvent(
            core,
            {
                eventType: 'selectionChanged',
                oldSelection,
                newSelection,
            },
            false /*broadcast*/
        );
    }
};
