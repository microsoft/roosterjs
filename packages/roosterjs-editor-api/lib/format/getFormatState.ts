import { getTableFormatInfo, getTagOfNode, toArray } from 'roosterjs-editor-dom';
import {
    ElementBasedFormatState,
    FormatState,
    IEditor,
    PluginEvent,
    QueryScope,
    SelectionRangeTypes,
} from 'roosterjs-editor-types';

/**
 * Get element based Format State at cursor
 * @param editor The editor instance
 * @param event (Optional) The plugin event, it stores the event cached data for looking up.
 * In this function the event cache is used to get list state and header level. If not passed,
 * it will query the node within selection to get the info
 * @returns An ElementBasedFormatState object
 */
export function getElementBasedFormatState(
    editor: IEditor,
    event?: PluginEvent
): ElementBasedFormatState {
    const listTag = getTagOfNode(
        editor.getElementAtCursor('OL,UL', undefined /*startFrom*/, event)
    );

    // Check if selection is multiline, spans more than one block
    const range = editor.getSelectionRange();
    let multiline = false;

    if (range && !range.collapsed) {
        let startingBlock = editor.getBlockElementAtNode(range.startContainer);
        let endingBlock = editor.getBlockElementAtNode(range.endContainer);
        multiline = endingBlock && startingBlock ? !endingBlock.equals(startingBlock) : false;
    }

    const headerTag = getTagOfNode(
        editor.getElementAtCursor('H1,H2,H3,H4,H5,H6', undefined /*startFrom*/, event)
    );

    const table = editor.queryElements('table', QueryScope.OnSelection)[0];
    const tableFormat = table ? getTableFormatInfo(table) : undefined;
    const hasHeader = table?.rows[0]
        ? toArray(table.rows[0].cells).every(cell => getTagOfNode(cell) == 'TH')
        : undefined;

    return {
        isBullet: listTag == 'UL',
        isNumbering: listTag == 'OL',
        isMultilineSelection: multiline,
        headerLevel: (headerTag && parseInt(headerTag[1])) || 0,
        canUnlink: !!editor.queryElements('a[href]', QueryScope.OnSelection)[0],
        canAddImageAltText: !!editor.queryElements('img', QueryScope.OnSelection)[0],
        isBlockQuote: !!editor.queryElements('blockquote', QueryScope.OnSelection)[0],
        isCodeInline: !!editor.queryElements('code', QueryScope.OnSelection)[0],
        isCodeBlock: !!editor.queryElements('pre>code', QueryScope.OnSelection)[0],
        isInTable: !!table,
        tableFormat: tableFormat || {},
        tableHasHeader: hasHeader,
        canMergeTableCell: canMergeTableCell(editor),
    };
}

/**
 * Get format state at cursor
 * A format state is a collection of all format related states, e.g.,
 * bold, italic, underline, font name, font size, etc.
 * @param editor The editor instance
 * @param event (Optional) The plugin event, it stores the event cached data for looking up.
 * In this function the event cache is used to get list state and header level. If not passed,
 * it will query the node within selection to get the info
 * @returns The format state at cursor
 */
export default function getFormatState(editor: IEditor, event?: PluginEvent): FormatState {
    return {
        ...editor.getPendableFormatState(false /* forceGetStateFromDom */),
        ...getElementBasedFormatState(editor, event),
        ...editor.getStyleBasedFormatState(),
        ...editor.getUndoState(),
        isDarkMode: editor.isDarkMode(),
        zoomScale: editor.getZoomScale(),
    };
}

/**
 * Checks whether the editor selection range is starting and ending at a table element.
 * @param editor Editor Instance
 * @returns
 */

const canMergeTableCell = (editor: IEditor): boolean => {
    const selection = editor.getSelectionRangeEx();
    const isATable = selection && selection.type === SelectionRangeTypes.TableSelection;
    if (isATable && selection.coordinates) {
        const { firstCell, lastCell } = selection.coordinates;
        if (firstCell.x !== lastCell.x || firstCell.y !== lastCell.y) {
            return true;
        }
        return false;
    }
    return false;
};
