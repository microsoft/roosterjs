import { ContentModelBlock } from '../../publicTypes/block/ContentModelBlock';
import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { ContentModelFormatContainer } from '../../publicTypes/group/ContentModelFormatContainer';
import { ContentModelFormatState } from '../../publicTypes/format/formatState/ContentModelFormatState';
import { ContentModelImage } from '../../publicTypes/segment/ContentModelImage';
import { ContentModelListItem } from '../../publicTypes/group/ContentModelListItem';
import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { extractBorderValues } from '../../domUtils/borderValues';
import { getClosestAncestorBlockGroupIndex } from './getClosestAncestorBlockGroupIndex';
import { isBold } from '../../publicApi/segment/toggleBold';
import { iterateSelections } from '../selection/iterateSelections';
import { TableSelectionContext } from '../../publicTypes/selection/TableSelectionContext';
import { updateTableMetadata } from '../../domUtils/metadata/updateTableMetadata';

/**
 * @internal
 */
export function retrieveModelFormatState(
    model: ContentModelDocument,
    pendingFormat: ContentModelSegmentFormat | null,
    formatState: ContentModelFormatState
) {
    let firstTableContext: TableSelectionContext | undefined;
    let firstBlock: ContentModelBlock | undefined;
    let isFirst = true;
    let isFirstImage = true;
    let isFirstSegment = true;

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
                    if (isFirstSegment || segment.segmentType != 'SelectionMarker') {
                        retrieveSegmentFormat(
                            formatState,
                            isFirst,
                            Object.assign(
                                {},
                                model.format,
                                block.format,
                                block.decorator?.format,
                                segment.format,
                                segment.code?.format,
                                segment.link?.format,
                                pendingFormat
                            )
                        );

                        mergeValue(formatState, 'isCodeInline', !!segment?.code, isFirst);
                    }

                    // We only care the format of selection marker when it is the first selected segment. This is because when selection marker
                    // is after some other selected segments, it mostly like appears at the beginning of a seconde line when the whole first line
                    // is selected (e.g. triple-click on a line) then the second selection marker doesn't contain a correct format, so we need to
                    // ignore it
                    isFirstSegment = false;

                    formatState.canUnlink = formatState.canUnlink || !!segment.link;
                    formatState.canAddImageAltText =
                        formatState.canAddImageAltText ||
                        segments.some(segment => segment.segmentType == 'Image');

                    isFirst = false;

                    if (segment.segmentType === 'Image') {
                        if (isFirstImage) {
                            retrieveImageFormat(segment, formatState);
                            isFirstImage = false;
                        } else {
                            formatState.imageFormat = undefined;
                        }
                    }
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
    result: ContentModelFormatState,
    isFirst: boolean,
    mergedFormat: ContentModelSegmentFormat
) {
    const superOrSubscript = mergedFormat.superOrSubScriptSequence?.split(' ')?.pop();

    mergeValue(result, 'isBold', isBold(mergedFormat.fontWeight), isFirst);
    mergeValue(result, 'isItalic', mergedFormat.italic, isFirst);
    mergeValue(result, 'isUnderline', mergedFormat.underline, isFirst);
    mergeValue(result, 'isStrikeThrough', mergedFormat.strikethrough, isFirst);
    mergeValue(result, 'isSuperscript', superOrSubscript == 'super', isFirst);
    mergeValue(result, 'isSubscript', superOrSubscript == 'sub', isFirst);

    mergeValue(result, 'fontName', mergedFormat.fontFamily, isFirst);
    mergeValue(result, 'fontSize', mergedFormat.fontSize, isFirst);
    mergeValue(result, 'backgroundColor', mergedFormat.backgroundColor, isFirst);
    mergeValue(result, 'textColor', mergedFormat.textColor, isFirst);

    //TODO: handle block owning segments with different line-heights
    mergeValue(result, 'lineHeight', mergedFormat.lineHeight, isFirst);
}

function retrieveParagraphFormat(
    result: ContentModelFormatState,
    paragraph: ContentModelParagraph,
    isFirst: boolean
) {
    const headerLevel = parseInt((paragraph.decorator?.tagName || '').substring(1));
    const validHeaderLevel = headerLevel >= 1 && headerLevel <= 6 ? headerLevel : undefined;

    mergeValue(result, 'marginBottom', paragraph.format.marginBottom, isFirst);
    mergeValue(result, 'marginTop', paragraph.format.marginTop, isFirst);
    mergeValue(result, 'headerLevel', validHeaderLevel, isFirst);
    mergeValue(result, 'textAlign', paragraph.format.textAlign, isFirst);
    mergeValue(result, 'direction', paragraph.format.direction, isFirst);
}

function retrieveStructureFormat(
    result: ContentModelFormatState,
    path: ContentModelBlockGroup[],
    isFirst: boolean
) {
    const listItemIndex = getClosestAncestorBlockGroupIndex(path, ['ListItem'], []);
    const containerIndex = getClosestAncestorBlockGroupIndex(path, ['FormatContainer'], []);

    if (listItemIndex >= 0) {
        const listItem = path[listItemIndex] as ContentModelListItem;
        const listType = listItem?.levels[listItem.levels.length - 1]?.listType;

        mergeValue(result, 'isBullet', listType == 'UL', isFirst);
        mergeValue(result, 'isNumbering', listType == 'OL', isFirst);
    }

    mergeValue(
        result,
        'isBlockQuote',
        containerIndex >= 0 &&
            (path[containerIndex] as ContentModelFormatContainer)?.tagName == 'blockquote',
        isFirst
    );
}

function retrieveTableFormat(tableContext: TableSelectionContext, result: ContentModelFormatState) {
    const tableFormat = updateTableMetadata(tableContext.table);

    result.isInTable = true;
    result.tableHasHeader = tableContext.table.rows.some(row =>
        row.cells.some(cell => cell.isHeader)
    );

    if (tableFormat) {
        result.tableFormat = tableFormat;
    }
}

function retrieveImageFormat(image: ContentModelImage, result: ContentModelFormatState) {
    const { format } = image;
    const borderKey = 'borderTop';
    const extractedBorder = extractBorderValues(format[borderKey]);
    const borderColor = extractedBorder.color;
    const borderWidth = extractedBorder.width;
    const borderStyle = extractedBorder.style;
    result.imageFormat = {
        borderColor,
        borderWidth,
        borderStyle,
        boxShadow: format.boxShadow,
        borderRadius: format.borderRadius,
    };
}

function mergeValue<K extends keyof ContentModelFormatState>(
    format: ContentModelFormatState,
    key: K,
    newValue: ContentModelFormatState[K] | undefined,
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
