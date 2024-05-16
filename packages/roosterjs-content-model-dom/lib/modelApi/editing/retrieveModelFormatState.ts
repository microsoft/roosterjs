import { extractBorderValues } from '../../domUtils/style/borderValues';
import { getClosestAncestorBlockGroupIndex } from './getClosestAncestorBlockGroupIndex';
import { isBold } from '../../domUtils/style/isBold';
import { iterateSelections } from '../selection/iterateSelections';
import { mutateBlock } from '../common/mutate';
import { parseValueWithUnit } from '../../formatHandlers/utils/parseValueWithUnit';
import { updateTableMetadata } from '../metadata/updateTableMetadata';
import type {
    ContentModelFormatState,
    ContentModelSegmentFormat,
    ReadonlyContentModelBlockGroup,
    ReadonlyContentModelBlock,
    ReadonlyContentModelImage,
    ReadonlyTableSelectionContext,
    ReadonlyContentModelParagraph,
    ReadonlyContentModelFormatContainer,
    ReadonlyContentModelListItem,
    ShallowMutableContentModelDocument,
} from 'roosterjs-content-model-types';

/**
 * Retrieve format state from the given Content Model
 * @param model The Content Model to retrieve format state from
 * @param pendingFormat Existing pending format, if any
 * @param formatState Existing format state object, used for receiving the result
 */
export function retrieveModelFormatState(
    model: ShallowMutableContentModelDocument,
    pendingFormat: ContentModelSegmentFormat | null,
    formatState: ContentModelFormatState
) {
    let firstTableContext: ReadonlyTableSelectionContext | undefined;
    let firstBlock: ReadonlyContentModelBlock | undefined;
    let isFirst = true;
    let isFirstImage = true;
    let isFirstSegment = true;

    iterateSelections(
        model,
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
                        const modelFormat = Object.assign(
                            <ContentModelSegmentFormat>{},
                            model.format
                        );

                        delete modelFormat.italic;
                        delete modelFormat.underline;
                        delete modelFormat.fontWeight;

                        retrieveSegmentFormat(
                            formatState,
                            isFirst,
                            Object.assign(
                                {},
                                modelFormat,
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
        },
        {
            includeListFormatHolder: 'never',
        }
    );

    if (formatState.fontSize) {
        formatState.fontSize = px2Pt(formatState.fontSize);
    }
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
    mergeValue(result, 'letterSpacing', mergedFormat.letterSpacing, isFirst);

    mergeValue(result, 'fontName', mergedFormat.fontFamily, isFirst);
    mergeValue(
        result,
        'fontSize',
        mergedFormat.fontSize,
        isFirst,
        val => parseValueWithUnit(val, undefined, 'pt') + 'pt'
    );
    mergeValue(result, 'backgroundColor', mergedFormat.backgroundColor, isFirst);
    mergeValue(result, 'textColor', mergedFormat.textColor, isFirst);
    mergeValue(result, 'fontWeight', mergedFormat.fontWeight, isFirst);
    mergeValue(result, 'lineHeight', mergedFormat.lineHeight, isFirst);
}

function retrieveParagraphFormat(
    result: ContentModelFormatState,
    paragraph: ReadonlyContentModelParagraph,
    isFirst: boolean
) {
    const headingLevel = parseInt((paragraph.decorator?.tagName || '').substring(1));
    const validHeadingLevel = headingLevel >= 1 && headingLevel <= 6 ? headingLevel : undefined;

    mergeValue(result, 'marginBottom', paragraph.format.marginBottom, isFirst);
    mergeValue(result, 'marginTop', paragraph.format.marginTop, isFirst);
    mergeValue(result, 'headingLevel', validHeadingLevel, isFirst);
    mergeValue(result, 'textAlign', paragraph.format.textAlign, isFirst);
    mergeValue(result, 'direction', paragraph.format.direction, isFirst);
}

function retrieveStructureFormat(
    result: ContentModelFormatState,
    path: ReadonlyContentModelBlockGroup[],
    isFirst: boolean
) {
    const listItemIndex = getClosestAncestorBlockGroupIndex(path, ['ListItem'], []);
    const containerIndex = getClosestAncestorBlockGroupIndex(path, ['FormatContainer'], []);

    if (listItemIndex >= 0) {
        const listItem = path[listItemIndex] as ReadonlyContentModelListItem;
        const listType = listItem?.levels[listItem.levels.length - 1]?.listType;

        mergeValue(result, 'isBullet', listType == 'UL', isFirst);
        mergeValue(result, 'isNumbering', listType == 'OL', isFirst);
    }

    mergeValue(
        result,
        'isBlockQuote',
        containerIndex >= 0 &&
            (path[containerIndex] as ReadonlyContentModelFormatContainer)?.tagName == 'blockquote',
        isFirst
    );
}

function retrieveTableFormat(
    tableContext: ReadonlyTableSelectionContext,
    result: ContentModelFormatState
) {
    const tableFormat = updateTableMetadata(mutateBlock(tableContext.table));

    result.isInTable = true;
    result.tableHasHeader = tableContext.table.rows.some(row =>
        row.cells.some(cell => cell.isHeader)
    );

    if (tableFormat) {
        result.tableFormat = tableFormat;
    }
}

function retrieveImageFormat(image: ReadonlyContentModelImage, result: ContentModelFormatState) {
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
    isFirst: boolean,
    parseFn: (val: ContentModelFormatState[K]) => ContentModelFormatState[K] = val => val
) {
    if (isFirst) {
        if (newValue !== undefined) {
            format[key] = newValue;
        }
    } else if (parseFn(newValue) !== parseFn(format[key])) {
        delete format[key];
    }
}

function px2Pt(px: string) {
    if (px && px.indexOf('px') == px.length - 2) {
        // Edge may not handle the floating computing well which causes the calculated value is a little less than actual value
        // So add 0.05 to fix it
        return Math.round(parseFloat(px) * 75 + 0.05) / 100 + 'pt';
    }
    return px;
}
