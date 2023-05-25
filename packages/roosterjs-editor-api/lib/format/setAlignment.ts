import blockFormat from '../utils/blockFormat';
import execCommand from '../utils/execCommand';
import formatUndoSnapshot from '../utils/formatUndoSnapshot';
import normalizeBlockquote from '../utils/normalizeBlockquote';
import {
    createVListFromRegion,
    findClosestElementAncestor,
    getSelectedBlockElementsInRegion,
    isWholeTableSelected,
    VTable,
} from 'roosterjs-editor-dom';
import {
    Alignment,
    DocumentCommand,
    IEditor,
    QueryScope,
    SelectionRangeTypes,
    TableSelectionRange,
} from 'roosterjs-editor-types';
import type { CompatibleAlignment } from 'roosterjs-editor-types/lib/compatibleTypes';

/**
 * Set content alignment
 * @param editor The editor instance
 * @param alignment The alignment option:
 * Alignment.Center, Alignment.Left, Alignment.Right
 */
export default function setAlignment(editor: IEditor, alignment: Alignment | CompatibleAlignment) {
    formatUndoSnapshot(
        editor,
        () => {
            const selection = editor.getSelectionRangeEx();
            const isATable = selection && selection.type === SelectionRangeTypes.TableSelection;
            const elementAtCursor = editor.getElementAtCursor();

            if (
                isATable &&
                selection.coordinates &&
                isWholeTableSelected(new VTable(selection.table), selection.coordinates)
            ) {
                alignTable(selection, alignment);
            } else if (elementAtCursor && isList(elementAtCursor)) {
                alignList(editor, alignment);
            } else {
                alignText(editor, alignment);
            }
        },
        'setAlignment'
    );
}

/**
 * Align text using the margins
 * @param editor
 * @param element
 * @param alignment
 * @param addUndoSnapshot
 * @returns
 */
function alignTable(selection: TableSelectionRange, alignment: Alignment | CompatibleAlignment) {
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
function alignText(editor: IEditor, alignment: Alignment | CompatibleAlignment) {
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
    const elements = editor.queryElements('[align]', QueryScope.OnSelection, node => {
        node.style.textAlign = align;
        normalizeBlockquote(node);
    });

    if (elements.length == 0) {
        const node = editor.getElementAtCursor();
        if (node) {
            normalizeBlockquote(node);
        }
    }
}

function isList(element: HTMLElement) {
    return findClosestElementAncestor(element, undefined /** root */, 'LI');
}

function alignList(editor: IEditor, alignment: Alignment | CompatibleAlignment) {
    blockFormat(
        editor,
        (region, start, end) => {
            const blocks = getSelectedBlockElementsInRegion(region);
            const startNode = blocks[0].getStartNode();
            const vList = createVListFromRegion(region, true /*includeSiblingLists*/, startNode);
            if (start && end) {
                vList?.setAlignment(start, end, alignment);
            }
        },
        undefined /* beforeRunCallback */,
        'alignList'
    );
}
