import { getOperationalBlocks, isBlockGroupOfType } from 'roosterjs-content-model-core';
import { handleIndentationOnList } from './keyboardIndentationUtils/handleIndentationOnList';
import { handleIndentationOnParagraph } from './keyboardIndentationUtils/handleIndentationOnParagraph';
import { setModelIndentation } from 'roosterjs-content-model-api';
import type {
    ContentModelDocument,
    ContentModelListItem,
    IEditor,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function keyboardIndentation(editor: IEditor, rawEvent: KeyboardEvent) {
    const selection = editor.getDOMSelection();

    if (selection?.type == 'range') {
        editor.formatContentModel(
            model => {
                return shouldHandleIndentation(rawEvent)
                    ? handleIndentation(model, rawEvent)
                    : false;
            },
            {
                apiName: 'handleTabKey',
            }
        );

        return true;
    }
}

function shouldHandleIndentation(rawEvent: KeyboardEvent) {
    return (
        rawEvent.key === 'Tab' ||
        ((rawEvent.key === 'ArrowRight' || rawEvent.key == 'ArrowLeft') &&
            rawEvent.shiftKey &&
            rawEvent.altKey)
    );
}

/**
 * If multiple blocks are selected, indent or outdent the selected blocks with setModelIndentation.
 * If only one block is selected, call handleTabOnParagraph or handleTabOnList to handle the tab key.
 */
function handleIndentation(model: ContentModelDocument, rawEvent: KeyboardEvent) {
    const blocks = getOperationalBlocks<ContentModelListItem>(model, ['ListItem'], ['TableCell']);
    const block = blocks.length > 0 ? blocks[0].block : undefined;
    if (blocks.length > 1 && rawEvent.key === 'Tab') {
        setModelIndentation(model, rawEvent.shiftKey ? 'outdent' : 'indent');
        rawEvent.preventDefault();
        return true;
    } else if (block?.blockType === 'Paragraph' && rawEvent.key === 'Tab') {
        return handleIndentationOnParagraph(model, block, rawEvent);
    } else if (isBlockGroupOfType<ContentModelListItem>(block, 'ListItem')) {
        return handleIndentationOnList(model, block, rawEvent);
    }
    return false;
}
