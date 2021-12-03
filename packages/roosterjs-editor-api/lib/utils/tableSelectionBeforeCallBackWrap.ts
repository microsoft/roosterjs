import { IEditor } from 'roosterjs-editor-types';
import { queryElements, VTable } from 'roosterjs-editor-dom';

/**
 * @internal
 * Handle the Before Callback for the block wrap on format APIs like CodeBlock and Blockquote,
 * @param editor The editor instance
 * @param elementTag Tag of the element that is going to be affected
 * @param beforeRunCallback The callback to be used if there is no vTableSelection
 * @param forEachCallback the call back that is going to be used in each of the element in the vTableSelection
 */
export default function tableSelectionBeforeCallBackWrap(
    editor: IEditor,
    elementTag: string,
    beforeRunCallback: () => boolean,
    forEachCallback: (node: HTMLElement) => any
) {
    const tableSelection = editor.getTableSelection();
    if (!tableSelection?.vSelection) {
        return beforeRunCallback();
    }

    let modifiedCells: number = 0;
    const table = editor.getElementAtCursor('table') as HTMLTableElement;
    if (table) {
        const vTable = new VTable(table);
        vTable.startRange = tableSelection.startRange;
        vTable.endRange = tableSelection.endRange;

        vTable.forEachSelectedCell(cell => {
            if (cell.td) {
                modifiedCells += queryElements(cell.td, elementTag, forEachCallback).length;
            }
        });
    }

    return modifiedCells == 0;
}
