import { contains } from 'roosterjs-editor-dom';
import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelListItem } from '../../publicTypes/group/ContentModelListItem';
import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';
import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { DomToModelContext } from '../../publicTypes/context/DomToModelContext';
import { FormatState } from 'roosterjs-editor-types';
import { getClosestAncestorBlockGroupIndex } from '../../modelApi/common/getClosestAncestorBlockGroupIndex';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';
import { isBold } from '../segment/toggleBold';
import { iterateSelections } from '../../modelApi/selection/iterateSelections';
import { TableSelectionContext } from '../../publicTypes/selection/TableSelectionContext';
import { updateTableMetadata } from '../../modelApi/metadata/updateTableMetadata';
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
    let result: FormatState = {
        ...editor.getUndoState(),

        isDarkMode: editor.isDarkMode(),
        zoomScale: editor.getZoomScale(),
    };

    // Otherwise, create a "reduced" Content Model that only scan a sub DOM tree that contains the selection.
    const model = editor.createContentModel(undefined /*rootNode*/, {
        processorOverride: {
            child: childProcessorForFormat,
        },
    });
    const pendingFormat = editor.getPendingFormat();
    let isFirst = true;

    iterateSelections([model], (path, tableContext, block, segments) => {
        if (block?.blockType == 'Paragraph' && segments?.[0]) {
            if (isFirst) {
                getFormatStateInternal(result, path, tableContext, block, segments, pendingFormat);
                isFirst = false;
            } else {
                result.isMultilineSelection = true;

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
    paragraph: ContentModelParagraph,
    segments: ContentModelSegment[],
    pendingFormat: ContentModelSegmentFormat | null
) {
    const segment = segments[0];
    const format = pendingFormat || segment.format;
    const superOrSubscript = format.superOrSubScriptSequence?.split(' ')?.pop();
    const listItemIndex = getClosestAncestorBlockGroupIndex(path, ['ListItem'], []);
    const quoteIndex = getClosestAncestorBlockGroupIndex(path, ['Quote'], []);
    const headerLevel = parseInt((paragraph.decorator?.tagName || '').substring(1));

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
    result.canAddImageAltText = segments.some(segment => segment.segmentType == 'Image');

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
        const tableCell = tableContext.table.cells[tableContext.rowIndex][tableContext.colIndex];

        result.isInTable = true;
        result.tableHasHeader = !!tableCell?.isSelected;

        if (tableFormat) {
            result.tableFormat = tableFormat;
        }
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
