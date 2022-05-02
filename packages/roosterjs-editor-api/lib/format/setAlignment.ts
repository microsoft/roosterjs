import execCommand from '../utils/execCommand';
import { getTagOfNode, isWholeTableSelected, VTable, wrap } from 'roosterjs-editor-dom';
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
    const selection = editor.getSelectionRangeEx();
    const isATable = selection && selection.type === SelectionRangeTypes.TableSelection;
    const elementAtCursor = editor.getElementAtCursor();

    editor.addUndoSnapshot(() => {
        if (
            editor.isFeatureEnabled(ExperimentalFeatures.TableAlignment) &&
            isATable &&
            isWholeTableSelected(new VTable(selection.table), selection.coordinates)
        ) {
            alignTable(selection, alignment);
        } else if (isList(elementAtCursor)) {
            alignList(editor, elementAtCursor, alignment);
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
function alignTable(selection: TableSelectionRange, alignment: Alignment) {
    const table = selection.table;
    if (alignment == Alignment.Center) {
        table.style.marginLeft = 'auto';
        table.style.marginRight = 'auto';
    } else if (alignment == Alignment.Right) {
        table.style.marginLeft = 'auto';
        table.style.marginRight = '';
    } else {
        table.style.marginLeft = '';
        table.style.marginRight = 'auto';
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

function isList(element: HTMLElement) {
    return ['LI', 'UL', 'OL'].indexOf(getTagOfNode(element)) > -1;
}

function alignList(editor: IEditor, element: HTMLElement, alignment: Alignment) {
    const list = getTagOfNode(element) === 'LI' ? element.parentElement : element;
    list.style.display = 'inline-table';
    let align = 'left';
    if (alignment == Alignment.Center) {
        align = 'center';
    } else if (alignment == Alignment.Right) {
        align = 'right';
    }
    if (list.parentElement.style.textAlign) {
        list.parentElement.style.textAlign = align;
    } else {
        const wrapper = editor.getDocument().createElement('div');
        wrapper.style.textAlign = align;
        wrap(list, wrapper);
    }
}
