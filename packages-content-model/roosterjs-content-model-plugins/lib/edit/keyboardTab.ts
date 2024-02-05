import { getOperationalBlocks, isBlockGroupOfType } from 'roosterjs-content-model-core';
import { setIndentation } from 'roosterjs-content-model-api';

import type {
    ContentModelDocument,
    ContentModelListItem,
    DOMSelection,
    IStandaloneEditor,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function keyboardTab(editor: IStandaloneEditor, rawEvent: KeyboardEvent) {
    const selection = editor.getDOMSelection();

    if (shouldHandleTab(rawEvent, selection)) {
        editor.takeSnapshot();

        editor.formatContentModel(
            (model, _context) => {
                return handleTabOnList(editor, model, rawEvent);
            },
            {
                rawEvent,
            }
        );

        return true;
    }
}

function shouldHandleTab(rawEvent: KeyboardEvent, selection: DOMSelection | null) {
    return rawEvent.key == 'Tab' && selection && selection?.type == 'range';
}

function isMarkerAtStartOfBlock(listItem: ContentModelListItem) {
    return (
        listItem.blocks[0].blockType == 'Paragraph' &&
        listItem.blocks[0].segments[0].segmentType == 'SelectionMarker'
    );
}

function handleTabOnList(
    editor: IStandaloneEditor,
    model: ContentModelDocument,
    rawEvent: KeyboardEvent
) {
    const blocks = getOperationalBlocks<ContentModelListItem>(model, ['ListItem'], ['TableCell']);
    const listItem = blocks[0].block;

    if (
        isBlockGroupOfType<ContentModelListItem>(listItem, 'ListItem') &&
        isMarkerAtStartOfBlock(listItem)
    ) {
        setIndentation(editor, rawEvent.shiftKey ? 'outdent' : 'indent');
        rawEvent.preventDefault();
        return true;
    }
    return false;
}
