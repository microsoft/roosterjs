import { getFirstSelectedListItem } from 'roosterjs-content-model-dom';
import { setModelIndentation } from 'roosterjs-content-model-api';
import type { IEditor } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function setShortcutIndentationCommand(editor: IEditor, operation: 'indent' | 'outdent') {
    editor.formatContentModel((model, context) => {
        const listItem = getFirstSelectedListItem(model);

        if (
            listItem &&
            listItem.blocks[0].blockType == 'Paragraph' &&
            listItem.blocks[0].segments[0].segmentType == 'SelectionMarker'
        ) {
            setModelIndentation(model, operation, undefined /*length*/, context);
            return true;
        }
        return false;
    });
}
