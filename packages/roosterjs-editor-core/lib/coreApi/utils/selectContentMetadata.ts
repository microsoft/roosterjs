import { ContentMetadata, EditorCore, SelectionRangeTypes } from 'roosterjs-editor-types';
import { createRange, queryElements } from 'roosterjs-editor-dom';

/**
 * @internal
 */
export function selectContentMetadata(core: EditorCore, metadata: ContentMetadata | undefined) {
    if (!core.lifecycle.shadowEditSelectionPath && metadata) {
        core.domEvent.tableSelectionRange = null;
        core.domEvent.imageSelectionRange = null;
        core.domEvent.selectionRange = null;

        switch (metadata.type) {
            case SelectionRangeTypes.Normal:
                core.api.selectTable(core, null);
                core.api.selectImage(core, null);

                const range = createRange(core.contentDiv, metadata.start, metadata.end);
                core.api.selectRange(core, range);
                break;
            case SelectionRangeTypes.TableSelection:
                const table = queryElements(
                    core.contentDiv,
                    '#' + metadata.tableId
                )[0] as HTMLTableElement;

                if (table) {
                    core.domEvent.tableSelectionRange = core.api.selectTable(core, table, metadata);
                }
                break;
            case SelectionRangeTypes.ImageSelection:
                const image = queryElements(
                    core.contentDiv,
                    '#' + metadata.imageId
                )[0] as HTMLImageElement;

                if (image) {
                    core.domEvent.imageSelectionRange = core.api.selectImage(core, image);
                }
                break;
        }
    }
}
