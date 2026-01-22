import type { DeleteSelectionStep } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const deleteTableRowColumn: DeleteSelectionStep = context => {
    if (context.deleteResult != 'range') {
        return;
    }
    const table = context.insertPoint.tableContext;
    console.log(table);
};
