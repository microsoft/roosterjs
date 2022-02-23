import execCommand from '../utils/execCommand';
import { VTable } from 'roosterjs-editor-dom';
import {
    Alignment,
    ChangeSource,
    DocumentCommand,
    ExperimentalFeatures,
    IEditor,
    QueryScope,
    SelectionRangeTypes,
    TableSelectionRange,
} from 'roosterjs-editor-types';

/**
 * Set content alignment
 * @param editor The editor instance
 * @param alignment The alignment option:
 * Alignment.Center, Alignment.Left, Alignment.Right
 */
export default function setAlignment(editor: IEditor, alignment: Alignment) {
    const element = editor.getElementAtCursor();
    const selection = editor.getSelectionRangeEx();
    const selectionType = selection.type;
    editor.addUndoSnapshot(() => {
        if (
            editor.isFeatureEnabled(ExperimentalFeatures.TableAlignment) &&
            selection &&
            selectionType === SelectionRangeTypes.TableSelection &&
            isWholeTableSelected(selection)
        ) {
            alignTable(editor, element, alignment);
        } else {
            alignText(editor, alignment);
        }
    }, ChangeSource.Format);
}

/**
 * Align text using the margins
 * @param editor
 * @param element
 * @param alignment
 * @param addUndoSnapshot
 * @returns
 */
function alignTable(editor: IEditor, element: HTMLElement, alignment: Alignment) {
    if (alignment == Alignment.Center) {
        element.style.marginLeft = 'auto';
        element.style.marginRight = 'auto';
    } else if (alignment == Alignment.Right) {
        element.style.marginLeft = 'auto';
        element.style.marginRight = '';
    } else {
        element.style.marginLeft = '';
        element.style.marginRight = 'auto';
    }
}

/**
 * Align text using the text-align
 * @param editor
 * @param alignment
 * @returns
 */
function alignText(editor: IEditor, alignment: Alignment) {
    let align = 'left';
    let command = DocumentCommand.JustifyLeft;
    if (alignment == Alignment.Center) {
        command = DocumentCommand.JustifyCenter;
        align = 'center';
    } else if (alignment == Alignment.Right) {
        command = DocumentCommand.JustifyRight;
        align = 'right';
    }
    execCommand(editor, command);
    editor.queryElements('[align]', QueryScope.OnSelection, node => (node.style.textAlign = align));
}

/**
 * Check if the whole table is selected
 * @param selection
 * @returns
 */
function isWholeTableSelected(selection: TableSelectionRange) {
    const vTable = new VTable(selection.table);
    const { firstCell, lastCell } = selection.coordinates;
    const rowsLength = vTable.cells.length - 1;
    const colIndex = vTable.cells[rowsLength].length - 1;
    const firstX = firstCell.x;
    const firstY = firstCell.y;
    const lastX = lastCell.x;
    const lastY = lastCell.y;
    return firstX == 0 && firstY == 0 && lastX == colIndex && lastY == rowsLength;
}
