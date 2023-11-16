import { handleKeyboardEventResult } from './handleKeyboardEventCommon';
import { setModelIndentation } from 'roosterjs-content-model-api';
import {
    createBr,
    createFormatContainer,
    createListItem,
    createParagraph,
    normalizeParagraph,
    setParagraphNotImplicit,
} from 'roosterjs-content-model-dom';
import {
    ChangeSource,
    deleteSelection,
    getClosestAncestorBlockGroupIndex,
} from 'roosterjs-content-model-core';
import type { IContentModelEditor } from 'roosterjs-content-model-editor';
import type {
    ContentModelBlock,
    ContentModelBlockGroup,
    ContentModelDocument,
    ContentModelFormatContainer,
    ContentModelListItem,
    ContentModelParagraph,
    DeleteResult,
    InsertPoint,
} from 'roosterjs-content-model-types';

/**
 * @internal
 * Do keyboard event handling for ENTER key
 * @param editor The Content Model Editor
 * @param rawEvent DOM keyboard event
 */
export function keyboardEnter(editor: IContentModelEditor, rawEvent: KeyboardEvent) {
    const selection = editor.getDOMSelection();
    const range = selection?.type == 'range' ? selection.range : null;

    if (shouldEnterWithContentModel(range, rawEvent)) {
        editor.formatContentModel(
            (model, context) => {
                const result = deleteSelection(model, [], context);
                let editResult = result.deleteResult;

                if (result.insertPoint) {
                    editResult = handleEnterKey(model, result.insertPoint, rawEvent, editResult);
                }

                return handleKeyboardEventResult(editor, model, rawEvent, editResult, context);
            },
            {
                rawEvent,
                changeSource: ChangeSource.Keyboard,
                getChangeData: () => rawEvent.which,
                apiName: rawEvent.key == 'Delete' ? 'handleDeleteKey' : 'handleBackspaceKey',
            }
        );

        return true;
    }
}

// Here we consider 3 parameters:
// 1. Shift Key: when pressed, we should always do a simple paragraph split
// 2. Whether current paragraph is considered empty. If there is already selected content got deleted, always treat it as not empty
// 3. Whether insert point is under ListItem or Quote (3 values: ListItem, Quote, Others)
// And there are 4 types of handler:
// [1] enterOnParagraph: Simply split current paragraph
// [2] enterOnQuote: Unquote current paragraph
// [3] enterOnList: Split current list item
// [4] setModelIndentation: Outdent current list level
// We use the follow decision tree:
//         +---------(T)--[Shift || !(List or Quote)]--(F)---+
//         |                                                 |
//        [1]                        +---------(List)--[List or Quote]--(Quote)----+
//                                   |                                             |
//                    +------(T)--[Empty]--(F)----+               +--------(T)--[Empty]--(F)----+
//                    |                           |               |                             |
//                   [4]                         [3]             [2]                           [1]
function handleEnterKey(
    model: ContentModelDocument,
    insertPoint: InsertPoint,
    rawEvent: KeyboardEvent,
    deleteResult: DeleteResult
): DeleteResult {
    const { path, paragraph } = insertPoint;
    const index = rawEvent.shiftKey
        ? -1
        : getClosestAncestorBlockGroupIndex(path, ['FormatContainer', 'ListItem'], ['TableCell']);
    const containerBlock = path[index];

    switch (containerBlock?.blockGroupType) {
        case 'ListItem':
            if (
                deleteResult != 'range' &&
                containerBlock.blocks.length == 1 &&
                containerBlock.blocks[0] == paragraph &&
                isParagraphEmpty(paragraph)
            ) {
                setModelIndentation(model, 'outdent');
            } else {
                enterOnList(insertPoint, containerBlock);
            }
            break;

        case 'FormatContainer':
            if (
                containerBlock.tagName == 'blockquote' &&
                deleteResult != 'range' &&
                isParagraphEmpty(paragraph)
            ) {
                enterOnQuote(insertPoint, containerBlock);
            } else {
                enterOnParagraph(insertPoint);
            }
            break;

        default:
            enterOnParagraph(insertPoint);

            break;
    }

    return 'range';
}

function isParagraphEmpty(paragraph: ContentModelParagraph) {
    const contentSegments = paragraph.segments.filter(
        x => x.segmentType != 'SelectionMarker' && (x.segmentType != 'Text' || x.text.length > 0)
    );

    return (
        contentSegments.length == 0 ||
        (contentSegments.length == 1 && contentSegments[0].segmentType == 'Br')
    );
}

function enterOnParagraph(insertPoint: InsertPoint): ContentModelParagraph {
    const { path, paragraph, marker } = insertPoint;
    const newPara = createParagraph(
        false /*isImplicit*/,
        paragraph.format,
        paragraph.segmentFormat
    );
    const markerIndex = paragraph.segments.indexOf(marker);
    const segments = paragraph.segments.splice(
        markerIndex,
        paragraph.segments.length - markerIndex
    );
    const paraIndex = path[0].blocks.indexOf(paragraph);

    setParagraphNotImplicit(paragraph);
    newPara.segments.push(...segments);

    if (paragraph.segments.every(x => x.segmentType == 'SelectionMarker')) {
        paragraph.segments.push(createBr(marker.format));
    }

    normalizeParagraph(newPara);
    path[0].blocks.splice(paraIndex + 1, 0, newPara);

    return newPara;
}

function getIndexes(
    insertPoint: InsertPoint,
    container: ContentModelBlockGroup & ContentModelBlock
): [number, number, number, ContentModelBlockGroup] {
    const { path, paragraph } = insertPoint;
    const index = path.indexOf(container);
    const containerParent = path[index + 1];
    const containerChild = path[index - 1];

    const paraIndex = path[0].blocks.indexOf(paragraph);
    const containerIndex = containerParent.blocks.indexOf(container);
    const paraInContainerIndex = container.blocks.indexOf(
        containerChild?.blockGroupType == 'FormatContainer' ||
            containerChild?.blockGroupType == 'General'
            ? containerChild
            : paragraph
    );

    return [paraIndex, containerIndex, paraInContainerIndex, containerParent];
}

function enterOnQuote(insertPoint: InsertPoint, quote: ContentModelFormatContainer) {
    const [paraIndex, quoteIndex, paraInQuoteIndex, quoteParent] = getIndexes(insertPoint, quote);

    if (paraIndex >= 0 && quoteIndex >= 0 && paraInQuoteIndex >= 0) {
        const newBlocks: ContentModelBlock[] = [];
        const blocksAfter = quote.blocks.splice(
            paraInQuoteIndex + 1,
            quote.blocks.length - paraInQuoteIndex - 1
        );

        insertPoint.path[0].blocks.splice(paraIndex, 1);

        if (quote.blocks.length > 0) {
            newBlocks.push(quote);
        }

        newBlocks.push(insertPoint.paragraph);

        if (blocksAfter.length > 0) {
            const newQuote = createFormatContainer(quote.tagName, quote.format);

            newQuote.blocks.push(...blocksAfter);
            newBlocks.push(newQuote);
        }

        quoteParent.blocks.splice(quoteIndex, 1, ...newBlocks);
    }
}

function enterOnList(insertPoint: InsertPoint, list: ContentModelListItem) {
    const [paraIndex, listIndex, _, listParent] = getIndexes(insertPoint, list);
    const newPara = enterOnParagraph(insertPoint);
    const { path } = insertPoint;

    if (path[0].blocks[paraIndex + 1] == newPara) {
        path[0].blocks.splice(paraIndex + 1, 1);

        const newList = createListItem(list.levels, list.formatHolder.format, list.format);

        newList.blocks.push(newPara);
        listParent.blocks.splice(listIndex + 1, 0, newList);
    }
}

function shouldEnterWithContentModel(range: Range | null, rawEvent: KeyboardEvent) {
    return !rawEvent.ctrlKey && !rawEvent.metaKey;
}
