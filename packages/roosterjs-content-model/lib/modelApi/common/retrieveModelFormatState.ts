import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { ContentModelListItem } from '../../publicTypes/group/ContentModelListItem';
import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';
import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { FormatState } from 'roosterjs-editor-types';
import { getClosestAncestorBlockGroupIndex } from './getClosestAncestorBlockGroupIndex';
import { isBold } from '../../publicApi/segment/toggleBold';
import { iterateSelections, TableSelectionContext } from '../selection/iterateSelections';
import { updateTableMetadata } from '../metadata/updateTableMetadata';

/**
 * @internal
 */
export function retrieveModelFormatState(
    model: ContentModelDocument,
    pendingFormat: ContentModelSegmentFormat | null,
    formatState: FormatState
) {
    let isFirst = true;
    let previousTableContext: TableSelectionContext | undefined;

    iterateSelections(
        [model],
        (path, tableContext, block, segments) => {
            if (isFirst) {
                if (block?.blockType == 'Paragraph' && segments?.[0]) {
                    retrieveFormatStateInternal(
                        formatState,
                        path,
                        tableContext,
                        block,
                        segments,
                        pendingFormat
                    );
                } else if (tableContext) {
                    retrieveTableFormat(tableContext, formatState);
                    previousTableContext = tableContext;
                }
                isFirst = false;
            } else {
                formatState.isMultilineSelection = true;

                if (tableContext && previousTableContext) {
                    const { table, colIndex, rowIndex } = previousTableContext;

                    if (
                        tableContext.table == table &&
                        (tableContext.colIndex != colIndex || tableContext.rowIndex != rowIndex)
                    ) {
                        formatState.canMergeTableCell = true;
                    }
                }

                // Return true to stop iteration since we have already got everything we need
                return true;
            }
        },
        {
            includeListFormatHolder: 'never',
        }
    );
}

function retrieveFormatStateInternal(
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
        retrieveTableFormat(tableContext, result);
    }

    // TODO: Support Code block in format state for Content Model
}

function retrieveTableFormat(tableContext: TableSelectionContext, result: FormatState) {
    const tableFormat = updateTableMetadata(tableContext.table);

    result.isInTable = true;
    result.tableHasHeader = tableContext.table.cells.some(row => row.some(cell => cell.isHeader));

    if (tableFormat) {
        result.tableFormat = tableFormat;
    }
}
