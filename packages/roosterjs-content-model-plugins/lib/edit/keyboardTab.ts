import { getOperationalBlocks, isBlockGroupOfType } from 'roosterjs-content-model-dom';
import { handleTabOnList } from './tabUtils/handleTabOnList';
import { handleTabOnParagraph } from './tabUtils/handleTabOnParagraph';
import { handleTabOnTable } from './tabUtils/handleTabOnTable';
import { handleTabOnTableCell } from './tabUtils/handleTabOnTableCell';
import { setModelIndentation } from 'roosterjs-content-model-api';
import type {
    ContentModelDocument,
    ContentModelListItem,
    ContentModelTableCell,
    FormatContentModelContext,
    IEditor,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function keyboardTab(editor: IEditor, rawEvent: KeyboardEvent) {
    const selection = editor.getDOMSelection();

    switch (selection?.type) {
        case 'range':
            editor.formatContentModel(
                (model, context) => {
                    return handleTab(model, rawEvent, context);
                },
                {
                    apiName: 'handleTabKey',
                }
            );

            return true;
        case 'table':
            editor.formatContentModel(
                model => {
                    return handleTabOnTable(model, rawEvent);
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
 * If only one block is selected:
 * - If it is a table cell, call handleTabOnTableCell to handle the tab key.
 * - If it is a paragraph, call handleTabOnParagraph to handle the tab key.
 * - If it is a list item, call handleTabOnList to handle the tab key.
 */
function handleTab(
    model: ContentModelDocument,
    rawEvent: KeyboardEvent,
    context: FormatContentModelContext
) {
    const blocks = getOperationalBlocks<ContentModelListItem | ContentModelTableCell>(
        model,
        ['ListItem', 'TableCell'],
        []
    );
    const block = blocks.length > 0 ? blocks[0].block : undefined;

    if (blocks.length > 1) {
        setModelIndentation(model, rawEvent.shiftKey ? 'outdent' : 'indent');
        rawEvent.preventDefault();
        return true;
    } else if (isBlockGroupOfType<ContentModelTableCell>(block, 'TableCell')) {
        return handleTabOnTableCell(model, block, rawEvent);
    } else if (block?.blockType === 'Paragraph') {
        return handleTabOnParagraph(model, block, rawEvent, context);
    } else if (isBlockGroupOfType<ContentModelListItem>(block, 'ListItem')) {
        return handleTabOnList(model, block, rawEvent, context);
    }
    return false;
}
