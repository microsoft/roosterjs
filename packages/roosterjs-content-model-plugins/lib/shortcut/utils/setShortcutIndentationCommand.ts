import { getFirstSelectedListItem } from 'roosterjs-content-model-core';
import { setModelIndentation } from 'roosterjs-content-model-api';
import type { IEditor } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function setShortcutIndentationCommand(editor: IEditor, operation: 'indent' | 'outdent') {
    editor.formatContentModel(model => {
        const listItem = getFirstSelectedListItem(model);
        console.log('listItem:', listItem);
        if (
            listItem &&
            listItem.blocks[0].blockType == 'Paragraph' &&
            listItem.blocks[0].segments[0].segmentType == 'SelectionMarker'
        ) {
            setModelIndentation(model, operation);
            return true;
        }
        return false;
    });
}
