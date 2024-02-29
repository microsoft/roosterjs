import { getOperationalBlocks, isBlockGroupOfType } from 'roosterjs-content-model-core';
import { handleTabOnList } from './tabUtils/handleTabOnList';
import { handleTabOnParagraph } from './tabUtils/handleTabOnParagraph';
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
        editor.formatContentModel(
            model => {
                return handleTab(model, rawEvent);
            },
            {
                apiName: 'handleTabKey',
            }
        );

        return true;
    }
}

/**
 * If multiple blocks are selected, indent or outdent the selected blocks with setModelIndentation.
 * If only one block is selected, call handleTabOnParagraph or handleTabOnList to handle the tab key.
 */
function handleTab(model: ContentModelDocument, rawEvent: KeyboardEvent) {
    const blocks = getOperationalBlocks<ContentModelListItem>(model, ['ListItem'], ['TableCell']);
    const block = blocks.length > 0 ? blocks[0].block : undefined;
    if (blocks.length > 1) {
        setModelIndentation(model, rawEvent.shiftKey ? 'outdent' : 'indent');
        rawEvent.preventDefault();
        return true;
    } else if (block?.blockType === 'Paragraph') {
        return handleTabOnParagraph(model, block, rawEvent);
    } else if (isBlockGroupOfType<ContentModelListItem>(block, 'ListItem')) {
        return handleTabOnList(model, block, rawEvent);
    }
    return false;
}
