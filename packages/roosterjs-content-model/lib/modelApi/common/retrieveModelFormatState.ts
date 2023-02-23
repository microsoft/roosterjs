import { ContentModelBlock } from '../../publicTypes/block/ContentModelBlock';
import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { ContentModelListItem } from '../../publicTypes/group/ContentModelListItem';
import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { FormatState } from 'roosterjs-editor-types';
import { getClosestAncestorBlockGroupIndex } from './getClosestAncestorBlockGroupIndex';
import { isBold } from '../../publicApi/segment/toggleBold';
import { iterateSelections, TableSelectionContext } from '../selection/iterateSelections';
import { updateTableMetadata } from '../../domUtils/metadata/updateTableMetadata';

/**
 * @internal
 */
export function retrieveModelFormatState(
    model: ContentModelDocument,
    pendingFormat: ContentModelSegmentFormat | null,
    formatState: FormatState
) {
    let firstTableContext: TableSelectionContext | undefined;
    let firstBlock: ContentModelBlock | undefined;
    let isFirst = true;

    if (pendingFormat) {
        // Pending format
        retrieveSegmentFormat(formatState, pendingFormat, isFirst);
    }

    iterateSelections(
        [model],
        (path, tableContext, block, segments) => {
            // Structure formats
            retrieveStructureFormat(formatState, path, isFirst);

            // Multiple line format
            if (block) {
                if (firstBlock) {
                    formatState.isMultilineSelection = true;
                } else {
                    firstBlock = block;
                }
            }

            if (block?.blockType == 'Paragraph') {
                // Paragraph formats
                retrieveParagraphFormat(formatState, block, isFirst);

                // Segment formats
                segments?.forEach(segment => {
                    if (!pendingFormat) {
                        retrieveSegmentFormat(formatState, segment.format, isFirst);
                    }

                    formatState.canUnlink = formatState.canUnlink || !!segment.link;
                    formatState.canAddImageAltText =
                        formatState.canAddImageAltText ||
                        segments.some(segment => segment.segmentType == 'Image');

                    isFirst = false;
                });

                isFirst = false;
            }

            if (tableContext) {
                if (firstTableContext) {
                    const { table, colIndex, rowIndex } = firstTableContext;

                    // Merge table format
                    if (
                        tableContext.table == table &&
                        (tableContext.colIndex != colIndex || tableContext.rowIndex != rowIndex)
                    ) {
                        formatState.canMergeTableCell = true;
                        formatState.isMultilineSelection = true;
                    }
                } else {
                    // Table formats
                    retrieveTableFormat(tableContext, formatState);
                    firstTableContext = tableContext;
                }
            }

            // TODO: Support Code block in format state for Content Model
        },
        {
            includeListFormatHolder: 'never',
        }
    );
}

function retrieveSegmentFormat(
    result: FormatState,
    format: ContentModelSegmentFormat,
    isFirst: boolean
) {
    const superOrSubscript = format.superOrSubScriptSequence?.split(' ')?.pop();
    mergeValue(result, 'isBold', isBold(format.fontWeight), isFirst);
    mergeValue(result, 'isItalic', format.italic, isFirst);
    mergeValue(result, 'isUnderline', format.underline, isFirst);
    mergeValue(result, 'isStrikeThrough', format.strikethrough, isFirst);
    mergeValue(result, 'isSuperscript', superOrSubscript == 'super', isFirst);
    mergeValue(result, 'isSubscript', superOrSubscript == 'sub', isFirst);

    mergeValue(result, 'fontName', format.fontFamily, isFirst);
    mergeValue(result, 'fontSize', format.fontSize, isFirst);
    mergeValue(result, 'backgroundColor', format.backgroundColor, isFirst);
    mergeValue(result, 'textColor', format.textColor, isFirst);

    //TODO: handle block owning segments with different line-heights
    mergeValue(result, 'lineHeight', format.lineHeight, isFirst);
}

function retrieveParagraphFormat(
    result: FormatState,
    paragraph: ContentModelParagraph,
    isFirst: boolean
) {
    const headerLevel = parseInt((paragraph.decorator?.tagName || '').substring(1));
    const validHeaderLevel = headerLevel >= 1 && headerLevel <= 6 ? headerLevel : undefined;

    mergeValue(result, 'marginBottom', paragraph.format.marginBottom, isFirst);
    mergeValue(result, 'marginTop', paragraph.format.marginTop, isFirst);
    mergeValue(result, 'headerLevel', validHeaderLevel, isFirst);
}

function retrieveStructureFormat(
    result: FormatState,
    path: ContentModelBlockGroup[],
    isFirst: boolean
) {
    const listItemIndex = getClosestAncestorBlockGroupIndex(path, ['ListItem'], []);
    const quoteIndex = getClosestAncestorBlockGroupIndex(path, ['Quote'], []);

    if (listItemIndex >= 0) {
        const listItem = path[listItemIndex] as ContentModelListItem;
        const listType = listItem?.levels[listItem.levels.length - 1]?.listType;

        mergeValue(result, 'isBullet', listType == 'UL', isFirst);
        mergeValue(result, 'isNumbering', listType == 'OL', isFirst);
    }

    mergeValue(result, 'isBlockQuote', quoteIndex >= 0, isFirst);
}

function retrieveTableFormat(tableContext: TableSelectionContext, result: FormatState) {
    const tableFormat = updateTableMetadata(tableContext.table);

    result.isInTable = true;
    result.tableHasHeader = tableContext.table.cells.some(row => row.some(cell => cell.isHeader));

    if (tableFormat) {
        result.tableFormat = tableFormat;
    }
}

function mergeValue<K extends keyof FormatState>(
    format: FormatState,
    key: K,
    newValue: FormatState[K] | undefined,
    isFirst: boolean
) {
    if (isFirst) {
        if (newValue !== undefined) {
            format[key] = newValue;
        }
    } else if (newValue !== format[key]) {
        delete format[key];
    }
}
