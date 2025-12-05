import { handleTabOnList } from './tabUtils/handleTabOnList';
import { handleTabOnParagraph } from './tabUtils/handleTabOnParagraph';
import { handleTabOnTable } from './tabUtils/handleTabOnTable';
import { handleTabOnTableCell } from './tabUtils/handleTabOnTableCell';
import { setModelIndentation } from 'roosterjs-content-model-api';
import type { HandleTabOptions } from './EditOptions';
import {
    ChangeSource,
    getOperationalBlocks,
    isBlockGroupOfType,
} from 'roosterjs-content-model-dom';
import type {
    ContentModelListItem,
    ContentModelTableCell,
    FormatContentModelContext,
    IEditor,
    ReadonlyContentModelDocument,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function keyboardTab(
    editor: IEditor,
    rawEvent: KeyboardEvent,
    options: Required<HandleTabOptions>
) {
    const selection = editor.getDOMSelection();

    switch (selection?.type) {
        case 'range':
            editor.formatContentModel(
                (model, context) => {
                    return handleTab(model, rawEvent, context, options);
                },
                {
                    apiName: 'handleTabKey',
                    rawEvent,
                    changeSource: ChangeSource.Keyboard,
                    getChangeData: () => rawEvent.which,
                }
            );
            break;

        case 'table':
            if (options.indentTable) {
                editor.formatContentModel(
                    model => {
                        return handleTabOnTable(model, rawEvent);
                    },
                    {
                        apiName: 'handleTabKey',
                        rawEvent,
                        changeSource: ChangeSource.Keyboard,
                        getChangeData: () => rawEvent.which,
                    }
                );
            }
            break;
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
    model: ReadonlyContentModelDocument,
    rawEvent: KeyboardEvent,
    context: FormatContentModelContext,
    options: Required<HandleTabOptions>
) {
    const blocks = getOperationalBlocks<ContentModelListItem | ContentModelTableCell>(
        model,
        ['ListItem', 'TableCell'],
        []
    );
    const block = blocks.length > 0 ? blocks[0].block : undefined;

    if (blocks.length > 1) {
        if (options.indentMultipleBlocks) {
            setModelIndentation(model, rawEvent.shiftKey ? 'outdent' : 'indent');
            rawEvent.preventDefault();
            return true;
        }
    } else if (isBlockGroupOfType<ContentModelTableCell>(block, 'TableCell')) {
        if (options.appendTableRow) {
            return handleTabOnTableCell(model, block, rawEvent);
        }
    } else if (block?.blockType === 'Paragraph') {
        if (options.indentParagraph) {
            return handleTabOnParagraph(model, block, rawEvent, context);
        }
    } else if (isBlockGroupOfType<ContentModelListItem>(block, 'ListItem')) {
        if (options.indentList) {
            return handleTabOnList(model, block, rawEvent, context);
        }
    }
    return false;
}
