import { addRangeToSelection, areSameRangeEx } from 'roosterjs-content-model-editor';
import { SetDOMSelection } from '../publicTypes/coreApi/SetDOMSelection';

/**
 * @internal
 */
export const setDOMSelection: SetDOMSelection = (core, newSelection) => {
    const oldSelection = core.selection.currentSelection;

    switch (newSelection.type) {
        case 'range':
            addRangeToSelection(core.contentDiv.ownerDocument, newSelection.range);
            break;

        case 'image':
        case 'table':
            // TODO: Support image and table selection
            break;
    }

    core.selection.currentSelection = newSelection;

    if (!oldSelection || areSameRangeEx(oldSelection, newSelection)) {
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
