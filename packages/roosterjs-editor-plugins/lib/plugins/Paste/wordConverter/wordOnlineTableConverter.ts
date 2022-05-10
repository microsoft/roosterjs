import { IEditor } from 'roosterjs-editor-types';
import { VTable } from 'roosterjs-editor-dom';

/**
 * @internal
 * Fix styles of table copied from word online
 * @param editor
 * @param table copied from word online
 */
export default function wordOnlineTableConverter(editor: IEditor, table: HTMLTableElement) {
    const vTable = new VTable(table as HTMLTableElement);
    vTable.cells.forEach(row =>
        row.forEach(cell => {
            if (cell.td) {
                const styledElement = cell.td.querySelector('p');
                if (editor.isDarkMode()) {
                    if (styledElement.style.color === 'windowtext') {
                        styledElement.style.removeProperty('color');
                    }
                }
            }
        })
    );
}
