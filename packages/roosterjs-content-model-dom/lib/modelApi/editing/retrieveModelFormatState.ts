import { extractBorderValues } from '../../domUtils/style/borderValues';
import { getClosestAncestorBlockGroupIndex } from './getClosestAncestorBlockGroupIndex';
import { getTableMetadata } from '../metadata/updateTableMetadata';
import { isBold } from '../../domUtils/style/isBold';
import { iterateSelections } from '../selection/iterateSelections';
import { parseValueWithUnit } from '../../formatHandlers/utils/parseValueWithUnit';
import type {
    ContentModelFormatState,
    ContentModelSegmentFormat,
    MergeFormatValueCallback,
    MergeFormatValueCallbacks,
    ReadonlyContentModelBlockGroup,
    ReadonlyContentModelBlock,
    ReadonlyContentModelImage,
    ReadonlyTableSelectionContext,
    ReadonlyContentModelParagraph,
    ReadonlyContentModelFormatContainer,
    ReadonlyContentModelListItem,
    ReadonlyContentModelDocument,
} from 'roosterjs-content-model-types';

/**
 * Retrieve format state from the given Content Model
 * @param model The Content Model to retrieve format state from
 * @param pendingFormat Existing pending format, if any
 * @param formatState Existing format state object, used for receiving the result
 * @param callbacks Callbacks to customize the behavior of merging format values
 */
export function retrieveModelFormatState(
    model: ReadonlyContentModelDocument,
    pendingFormat: ContentModelSegmentFormat | null,
    formatState: ContentModelFormatState,
    callbacks?: MergeFormatValueCallbacks
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
            retrieveStructureFormat(formatState, path, isFirst, callbacks);

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
                retrieveParagraphFormat(formatState, block, isFirst, callbacks);

                // Segment formats
                segments?.forEach(segment => {
                    if (isFirstSegment || segment.segmentType != 'SelectionMarker') {
                        const modelFormat = { ...model.format };

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
                            ),
                            callbacks
                        );

                        mergeValue(formatState, 'isCodeInline', !!segment?.code, isFirst, undefined, callbacks);
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
    mergedFormat: ContentModelSegmentFormat,
    callbacks?: MergeFormatValueCallbacks
) {
    const superOrSubscript = mergedFormat.superOrSubScriptSequence?.split(' ')?.pop();

    mergeValue(result, 'isBold', isBold(mergedFormat.fontWeight), isFirst, undefined, callbacks);
    mergeValue(result, 'isItalic', mergedFormat.italic, isFirst, undefined, callbacks);
    mergeValue(result, 'isUnderline', mergedFormat.underline, isFirst, undefined, callbacks);
    mergeValue(result, 'isStrikeThrough', mergedFormat.strikethrough, isFirst, undefined, callbacks);
    mergeValue(result, 'isSuperscript', superOrSubscript == 'super', isFirst, undefined, callbacks);
    mergeValue(result, 'isSubscript', superOrSubscript == 'sub', isFirst, undefined, callbacks);
    mergeValue(result, 'letterSpacing', mergedFormat.letterSpacing, isFirst, undefined, callbacks);

    mergeValue(result, 'fontName', mergedFormat.fontFamily, isFirst, undefined, callbacks);
    mergeValue(
        result,
        'fontSize',
        mergedFormat.fontSize,
        isFirst,
        val => parseValueWithUnit(val, undefined, 'pt') + 'pt',
        callbacks
    );
    mergeValue(result, 'backgroundColor', mergedFormat.backgroundColor, isFirst, undefined, callbacks);
    mergeValue(result, 'textColor', mergedFormat.textColor, isFirst, undefined, callbacks);
    mergeValue(result, 'fontWeight', mergedFormat.fontWeight, isFirst, undefined, callbacks);
    mergeValue(result, 'lineHeight', mergedFormat.lineHeight, isFirst, undefined, callbacks);
}

function retrieveParagraphFormat(
    result: ContentModelFormatState,
    paragraph: ReadonlyContentModelParagraph,
    isFirst: boolean,
    callbacks?: MergeFormatValueCallbacks
) {
    const headingLevel = parseInt((paragraph.decorator?.tagName || '').substring(1));
    const validHeadingLevel = headingLevel >= 1 && headingLevel <= 6 ? headingLevel : undefined;

    mergeValue(result, 'marginBottom', paragraph.format.marginBottom, isFirst, undefined, callbacks);
    mergeValue(result, 'marginTop', paragraph.format.marginTop, isFirst, undefined, callbacks);
    mergeValue(result, 'headingLevel', validHeadingLevel, isFirst, undefined, callbacks);
    mergeValue(result, 'textAlign', paragraph.format.textAlign, isFirst, undefined, callbacks);
    mergeValue(result, 'direction', paragraph.format.direction, isFirst, undefined, callbacks);
}

function retrieveStructureFormat(
    result: ContentModelFormatState,
    path: ReadonlyContentModelBlockGroup[],
    isFirst: boolean,
    callbacks?: MergeFormatValueCallbacks
) {
    const listItemIndex = getClosestAncestorBlockGroupIndex(path, ['ListItem'], []);
    const containerIndex = getClosestAncestorBlockGroupIndex(path, ['FormatContainer'], []);

    if (listItemIndex >= 0) {
        const listItem = path[listItemIndex] as ReadonlyContentModelListItem;
        const listType = listItem?.levels[listItem.levels.length - 1]?.listType;

        mergeValue(result, 'isBullet', listType == 'UL', isFirst, undefined, callbacks);
        mergeValue(result, 'isNumbering', listType == 'OL', isFirst, undefined, callbacks);
    }

    mergeValue(
        result,
        'isBlockQuote',
        containerIndex >= 0 &&
            (path[containerIndex] as ReadonlyContentModelFormatContainer)?.tagName == 'blockquote',
        isFirst,
        undefined,
        callbacks
    );
}

function retrieveTableFormat(
    tableContext: ReadonlyTableSelectionContext,
    result: ContentModelFormatState
) {
    const tableFormat = getTableMetadata(tableContext.table);

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
    parseFn: (val: ContentModelFormatState[K]) => ContentModelFormatState[K] = val => val,
    callbacks?: MergeFormatValueCallbacks
) {
    if (isFirst) {
        if (newValue !== undefined) {
            format[key] = newValue;
        }
    } else if (parseFn(newValue) !== parseFn(format[key])) {
        const callback = callbacks?.[key] as MergeFormatValueCallback | undefined;
        if (callback) {
            callback(format, newValue);
        } else {
            delete format[key];
        }
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
