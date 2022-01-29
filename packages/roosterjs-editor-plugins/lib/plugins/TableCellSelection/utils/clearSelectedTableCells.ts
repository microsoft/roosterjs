import { deselectTable } from './deselectTable';
import { IEditor } from 'roosterjs-editor-types';
import { TABLE_SELECTED } from '../TableCellSelection';

/**
 * @internal
 * Clear all the tables inside of the editor
 * @param input Editor Instance
 */
export function clearSelectedTableCells(input: IEditor) {
    input.queryElements('table.' + TABLE_SELECTED, deselectTable);
}
