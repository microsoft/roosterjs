import { ChangeSource, IEditor, NodePosition, Region } from 'roosterjs-editor-types';

/**
 * @internal
 * Split selection into regions, and perform a block-wise formatting action for each region.
 */
export default function blockFormat(
    editor: IEditor,
    callback: (region: Region, start: NodePosition, end: NodePosition) => void,
    beforeRunCallback?: () => boolean
) {
    editor.focus();
    editor.addUndoSnapshot((start, end) => {
        if (!beforeRunCallback || beforeRunCallback()) {
            const regions = editor.getSelectedRegions();
            regions.forEach(region => callback(region, start, end));
        }
        editor.select(start, end);
    }, ChangeSource.Format);
}
