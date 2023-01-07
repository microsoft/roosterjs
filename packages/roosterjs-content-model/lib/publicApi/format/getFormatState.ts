import { contains } from 'roosterjs-editor-dom';
import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelListItem } from '../../publicTypes/group/ContentModelListItem';
import { ContentModelParagraph } from 'roosterjs-content-model/lib/publicTypes/block/ContentModelParagraph';
import { ContentModelSegment } from 'roosterjs-content-model/lib/publicTypes/segment/ContentModelSegment';
import { DomToModelContext } from '../../publicTypes/context/DomToModelContext';
import { FormatState } from 'roosterjs-editor-types';
import { getClosestAncestorBlockGroupIndex } from '../../modelApi/common/getClosestAncestorBlockGroupIndex';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';
import { isBold } from '../segment/toggleBold';
import { updateTableMetadata } from '../../modelApi/metadata/updateTableMetadata';
import {
    iterateSelections,
    TableSelectionContext,
} from '../../modelApi/selection/iterateSelections';
import {
    getRegularSelectionOffsets,
    handleRegularSelection,
    processChildNode,
} from '../../domToModel/utils/childProcessorUtils';

/**
 * Get current format state
 * @param editor The editor to get format from
 */
export default function getFormatState(editor: IExperimentalContentModelEditor): FormatState {
    // When there is cached pending content model, get format from it.
    // Otherwise, create a "reduced" Content Model that only scan a sub DOM tree that contains the selection.
    let model =
        editor.getCurrentContentModel() ??
        editor.createContentModel(undefined /*rootNode*/, {
            processorOverride: {
                child: childProcessorForFormat,
            },
        });

    let isFirst = true;
    let result: FormatState = {
        ...editor.getUndoState(),

        isDarkMode: editor.isDarkMode(),
        zoomScale: editor.getZoomScale(),
    };

    iterateSelections([model], (path, tableContext, block, segments) => {
        if (block?.blockType == 'Paragraph' && segments?.[0]) {
            getFormatStateInternal(result, path, tableContext, block, segments, isFirst);

            if (isFirst) {
                isFirst = false;
            } else {
                // Return true to stop iteration since we have already got everything we need
                return true;
            }
        }
    });

    return result;
}

function getFormatStateInternal(
    result: FormatState,
    path: ContentModelBlockGroup[],
    tableContext: TableSelectionContext | undefined,
    block: ContentModelParagraph,
    segments: ContentModelSegment[],
    isFirstSelection: boolean
) {
    if (isFirstSelection) {
        const segment = segments[0];
        const format = segment.format;
        const superOrSubscript = format.superOrSubScriptSequence?.split(' ')?.pop();
        const listItemIndex = getClosestAncestorBlockGroupIndex(path, ['ListItem'], []);
        const quoteIndex = getClosestAncestorBlockGroupIndex(path, ['Quote'], []);
        const headerLevel = parseInt((block.decorator?.tagName || '').substring(1));

        result.fontName = format.fontFamily;
        result.fontSize = format.fontSize;
        result.backgroundColor = format.backgroundColor;
        result.textColor = format.textColor;

        result.isBold = isBold(format.fontWeight);
        result.isItalic = format.italic;
        result.isUnderline = format.underline;
        result.isStrikeThrough = format.strikethrough;
        result.isSuperscript = superOrSubscript == 'super';
        result.isSubscript = superOrSubscript == 'sub';

        result.canUnlink = !!segment.link;
        result.canAddImageAltText = segment.segmentType == 'Image';

        if (listItemIndex >= 0) {
            const listItem = path[listItemIndex] as ContentModelListItem;
            const listType = listItem?.levels[listItem.levels.length - 1]?.listType;

            result.isBullet = listType == 'UL';
            result.isNumbering = listType == 'OL';
        }

        if (quoteIndex >= 0) {
            result.isBlockQuote = true;
        }

        if (headerLevel >= 1 && headerLevel <= 6) {
            result.headerLevel = headerLevel;
        }

        if (tableContext) {
            const tableFormat = updateTableMetadata(tableContext.table);
            const tableCell =
                tableContext.table.cells[tableContext.rowIndex][tableContext.colIndex];

            result.isInTable = true;
            result.tableHasHeader = !!tableCell?.isSelected;

            if (tableFormat) {
                result.tableFormat = tableFormat;
            }
        }
    } else {
        result.isMultilineSelection = true;
    }
}

interface FormatStateContext extends DomToModelContext {
    /**
     * An optional stack of parent elements to process. When provided, the child nodes of current parent element will be ignored,
     * but use the top element in this stack instead in childProcessor.
     */
    nodeStack?: Node[];
}

function childProcessorForFormat(
    group: ContentModelBlockGroup,
    parent: ParentNode,
    context: FormatStateContext
) {
    if (context.selectionRootNode) {
        if (!context.nodeStack) {
            context.nodeStack = createNodeStack(parent, context.selectionRootNode);
        }

        const stackChild = context.nodeStack.pop();

        if (stackChild) {
            const [nodeStartOffset, nodeEndOffset] = getRegularSelectionOffsets(context, parent);

            // If selection is not on this node, skip getting node index to save some time since we don't need it here
            const index =
                nodeStartOffset >= 0 || nodeEndOffset >= 0 ? getChildIndex(parent, stackChild) : -1;

            if (index >= 0) {
                handleRegularSelection(index, context, group, nodeStartOffset, nodeEndOffset);
            }

            processChildNode(group, stackChild, context);

            if (index >= 0) {
                handleRegularSelection(index + 1, context, group, nodeStartOffset, nodeEndOffset);
            }
        } else {
            // No child node from node stack, that means we have reached the deepest node of selection.
            // Now we can use default child processor to perform full sub tree scanning for content model,
            // So that all selected node will be included.
            context.defaultElementProcessors.child(group, parent, context);
        }
    }
}

function createNodeStack(root: Node, startNode: Node): Node[] {
    const result: Node[] = [];
    let node: Node | null = startNode;

    while (node && contains(root, node)) {
        result.push(node);
        node = node.parentNode;
    }

    return result;
}

function getChildIndex(parent: ParentNode, stackChild: Node) {
    let index = 0;
    let child = parent.firstChild;

    while (child && child != stackChild) {
        index++;
        child = child.nextSibling;
    }
    return index;
}
