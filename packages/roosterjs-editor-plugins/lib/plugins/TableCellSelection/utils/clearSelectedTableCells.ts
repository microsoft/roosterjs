import { deselectTable } from './deselectTable';
import { IEditor } from 'roosterjs-editor-types';
import { tableCellSelectionCommon } from './tableCellSelectionCommon';

/**
 * @internal
 * Clear all the tables inside of the editor
 * @param input Editor Instance
 */
export function clearSelectedTableCells(input: IEditor) {
    input.queryElements('table.' + tableCellSelectionCommon.TABLE_SELECTED, deselectTable);
}
