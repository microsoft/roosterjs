import { iterateSelections } from '../../modelApi/selection/iterateSelections';
import { preprocessTable } from './preprocessTable';
import { pruneUnselectedModel } from './pruneUnselectedModel';
import type { ContentModelDocument, DOMSelection } from 'roosterjs-content-model-types';

/**
 * Get the content model containing only the selection
 * @param model the model document
 * @param selection The editor selection
 * */
export function getSelectedModel(
    model: ContentModelDocument,
    selection: DOMSelection
): ContentModelDocument {
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
    return model;
}
