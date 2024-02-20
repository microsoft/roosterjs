import { getOperationalBlocks, isBlockGroupOfType } from 'roosterjs-content-model-core';
import { setModelIndentation } from 'roosterjs-content-model-api';
import type {
    ContentModelDocument,
    ContentModelListItem,
    IEditor,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function keyboardTab(editor: IEditor, rawEvent: KeyboardEvent) {
    const selection = editor.getDOMSelection();

    if (selection?.type == 'range') {
        editor.takeSnapshot();

        editor.formatContentModel((model, _context) => {
            return handleTabOnList(model, rawEvent);
        });

        return true;
    }
}

function isMarkerAtStartOfBlock(listItem: ContentModelListItem) {
    return (
        listItem.blocks[0].blockType == 'Paragraph' &&
        listItem.blocks[0].segments[0].segmentType == 'SelectionMarker'
    );
}

function handleTabOnList(model: ContentModelDocument, rawEvent: KeyboardEvent) {
    const blocks = getOperationalBlocks<ContentModelListItem>(model, ['ListItem'], ['TableCell']);
    const listItem = blocks[0].block;

    if (
        isBlockGroupOfType<ContentModelListItem>(listItem, 'ListItem') &&
        isMarkerAtStartOfBlock(listItem)
    ) {
        setModelIndentation(model, rawEvent.shiftKey ? 'outdent' : 'indent');
        rawEvent.preventDefault();
        return true;
    }
    return false;
}
