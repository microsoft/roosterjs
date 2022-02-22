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

const TABLE = 'TABLE';
const TEXT = 'TEXT';

/**
 * Set content alignment
 * @param editor The editor instance
 * @param alignment The alignment option:
 * Alignment.Center, Alignment.Left, Alignment.Right
 */
export default function setAlignment(editor: IEditor, alignment: Alignment) {
    const element = editor.getElementAtCursor();
    const elementType = isATableOrText(element, editor);

    editor.addUndoSnapshot(() => {
        alignElement(editor, element, elementType, alignment);
        editor.queryElements('[align]', QueryScope.OnSelection, node =>
            alignElement(editor, node, elementType, alignment, true /** addUndoSnapshot */)
        );
    }, ChangeSource.Format);
}

/**
 * Check if the element at the cursor is a table or text element
 * @param element
 * @returns
 */
function isATableOrText(element: HTMLElement, editor: IEditor) {
    if (!element) {
        return;
    }
    const selection = editor.getSelectionRangeEx();
    const selectionType = selection.type;
    if (selection && selectionType === SelectionRangeTypes.Normal) {
        return TEXT;
    } else if (
        editor.isFeatureEnabled(ExperimentalFeatures.TableAlignment) &&
        selection &&
        selectionType === SelectionRangeTypes.TableSelection &&
        isWholeTableSelected(selection)
    ) {
        return TABLE;
    }
}

/**
 * Align the element left, center and right
 * @param editor
 * @param element the element being aligned
 * @param elementType type text or table
 * @param alignment the alignment type
 * @param addUndoSnapshot check if this function is being called by addUndoSnapshot
 */
function alignElement(
    editor: IEditor,
    element: HTMLElement,
    elementType: string,
    alignment: Alignment,
    addUndoSnapshot?: boolean
) {
    if (elementType === TABLE) {
        alignTable(editor, element, alignment);
    } else {
        alignText(editor, element, alignment, addUndoSnapshot);
    }
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
 * @param element
 * @param alignment
 * @param addUndoSnapshot
 * @returns
 */
function alignText(
    editor: IEditor,
    element: HTMLElement,
    alignment: Alignment,
    addUndoSnapshot?: boolean
) {
    let align = 'left';
    let command = DocumentCommand.JustifyLeft;
    if (alignment == Alignment.Center) {
        command = DocumentCommand.JustifyCenter;
        align = 'center';
    } else if (alignment == Alignment.Right) {
        command = DocumentCommand.JustifyRight;
        align = 'right';
    }
    if (addUndoSnapshot) {
        element.style.textAlign = align;
    } else {
        execCommand(editor, command);
    }
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
