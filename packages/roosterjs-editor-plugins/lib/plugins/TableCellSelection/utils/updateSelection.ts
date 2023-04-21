import { IEditor } from 'roosterjs-editor-types';

/**
 * @internal
 * Use SetBaseAndExtend to update the selection without losing the order that was used in the selection.
 * Using editor.select may lose the order of the selection if the start of the selection is After
 * the end container of the selection.
 */
export function updateSelection(
    editor: IEditor,
    start: Node,
    offset: number,
    end?: Node,
    endOffset?: number
) {
    const selection = editor.getDocument().defaultView?.getSelection();
    if (selection) {
        end = end || start;
        endOffset = endOffset || offset;
        selection.setBaseAndExtent(start, offset, end, endOffset);
    }
}
