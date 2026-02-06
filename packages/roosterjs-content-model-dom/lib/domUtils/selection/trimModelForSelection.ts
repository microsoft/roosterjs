import { iterateSelections } from '../../modelApi/selection/iterateSelections';
import { preprocessTable } from './preprocessTable';
import { pruneUnselectedModel } from './pruneUnselectedModel';
import type { ContentModelDocument, DOMSelection } from 'roosterjs-content-model-types';

/**
 * Remove the unselected content from the model
 * @param model the model document
 * @param selection The editor selection
 * */
export function trimModelForSelection(model: ContentModelDocument, selection: DOMSelection) {
    pruneUnselectedModel(model);

    if (selection.type === 'table') {
        iterateSelections(model, (_, tableContext) => {
            if (tableContext?.table) {
                preprocessTable(tableContext.table);

                return true;
            }
            return false;
        });
    }
}
