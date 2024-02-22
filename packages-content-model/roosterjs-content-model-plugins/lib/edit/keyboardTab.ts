import { getOperationalBlocks, isBlockGroupOfType } from 'roosterjs-content-model-core';
import { handleTabOnList } from './tabUtils/handleTabOnList';
import { handleTabOnParagraph } from './tabUtils/handleTabOnParagraph';
import type {
    ContentModelDocument,
    ContentModelListItem,
    IEditor,
    RangeSelection,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function keyboardTab(editor: IEditor, rawEvent: KeyboardEvent) {
    const selection = editor.getDOMSelection();

    if (selection?.type == 'range') {
        editor.takeSnapshot();

        editor.formatContentModel(
            (model, _context) => {
                return handleTab(model, rawEvent, selection);
            },
            {
                apiName: 'handleTabKey',
            }
        );

        return true;
    }
}

function handleTab(
    model: ContentModelDocument,
    rawEvent: KeyboardEvent,
    selection: RangeSelection
) {
    const blocks = getOperationalBlocks<ContentModelListItem>(model, ['ListItem'], ['TableCell']);
    const block = blocks[0].block;
    if (block.blockType === 'Paragraph') {
        return handleTabOnParagraph(model, block, rawEvent, selection);
    } else if (isBlockGroupOfType<ContentModelListItem>(block, 'ListItem')) {
        return handleTabOnList(model, block, rawEvent);
    }
    return false;
}
