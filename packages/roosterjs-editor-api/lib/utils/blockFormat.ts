import { ChangeSource, NodePosition, Region } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';

/**
 * @internal
 * Split selection into regions, and perform a block-wise formatting action for each region.
 */
export default function blockFormat(
    editor: Editor,
    callback: (region: Region, start: NodePosition, end: NodePosition) => void
) {
    editor.focus();
    editor.addUndoSnapshot((start, end) => {
        const regions = editor.getSelectedRegions();
        regions.forEach(region => callback(region, start, end));
        editor.select(start, end);
    }, ChangeSource.Format);
}
