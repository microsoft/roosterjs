import { extractBorderValues } from '../../domUtils/style/borderValues';
import { getClosestAncestorBlockGroupIndex } from './getClosestAncestorBlockGroupIndex';
import { getTableMetadata } from '../metadata/updateTableMetadata';
import { isBold } from '../../domUtils/style/isBold';
import { iterateSelections } from '../selection/iterateSelections';
import { parseValueWithUnit } from '../../formatHandlers/utils/parseValueWithUnit';
import type {
    ConflictFormatSolution,
    ContentModelFormatState,
    ContentModelSegmentFormat,
    ReadonlyContentModelBlockGroup,
    ReadonlyContentModelBlock,
    ReadonlyContentModelImage,
    ReadonlyTableSelectionContext,
    ReadonlyContentModelParagraph,
    ReadonlyContentModelFormatContainer,
    ReadonlyContentModelListItem,
    ReadonlyContentModelDocument,
    DOMHelper,
} from 'roosterjs-content-model-types';

/**
 * Retrieve format state from the given Content Model
 * @param model The Content Model to retrieve format state from
 * @param pendingFormat Existing pending format, if any
 * @param formatState Existing format state object, used for receiving the result
 * @param conflictSolution The strategy for handling format conflicts
 */
export function retrieveModelFormatState(
    model: ReadonlyContentModelDocument,
    pendingFormat: ContentModelSegmentFormat | null,
    formatState: ContentModelFormatState,
    conflictSolution: ConflictFormatSolution = 'remove',
    domHelper?: DOMHelper
) {
    let firstTableContext: ReadonlyTableSelectionContext | undefined;
    let firstBlock: ReadonlyContentModelBlock | undefined;
    let isFirst = true;
    let isFirstImage = true;
    let isFirstSegment = true;
    let containerFormat: ContentModelSegmentFormat | undefined = undefined;

    const modelFormat = { ...model.format };

    delete modelFormat.italic;
    delete modelFormat.underline;
    delete modelFormat.fontWeight;

    iterateSelections(
        model,
        (path, tableContext, block, segments) => {
            // Structure formats
            retrieveStructureFormat(formatState, path, isFirst, conflictSolution);

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
                retrieveParagraphFormat(formatState, block, isFirst, conflictSolution);

                // Segment formats
                segments?.forEach(segment => {
                    if (isFirstSegment || segment.segmentType != 'SelectionMarker') {
                        let currentFormat = Object.assign(
                            {},
                            block.format,
                            block.decorator?.format,
                            segment.format,
                            segment.code?.format,
                            segment.link?.format,
                            pendingFormat
                        );

                        // Sometimes the content may not specify all required format but just leverage the container format to do so.
                        // In this case, we need to merge the container format into the current format
                        // to make sure the current format contains all required format.
                        if (!hasAllRequiredFormat(currentFormat)) {
                            if (!containerFormat) {
                                containerFormat = domHelper?.getContainerFormat() ?? modelFormat;
                            }

                            currentFormat = Object.assign({}, containerFormat, currentFormat);
                        }

                        retrieveSegmentFormat(
                            formatState,
                            isFirst,
                            currentFormat,
                            conflictSolution
                        );

                        mergeValue(
                            formatState,
                            'isCodeInline',
                            !!segment?.code,
                            isFirst,
                            conflictSolution
                        );
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
    conflictSolution: ConflictFormatSolution = 'remove'
) {
    const superOrSubscript = mergedFormat.superOrSubScriptSequence?.split(' ')?.pop();

    mergeValue(result, 'isBold', isBold(mergedFormat.fontWeight), isFirst, conflictSolution);
    mergeValue(result, 'isItalic', mergedFormat.italic, isFirst, conflictSolution);
    mergeValue(result, 'isUnderline', mergedFormat.underline, isFirst, conflictSolution);
    mergeValue(result, 'isStrikeThrough', mergedFormat.strikethrough, isFirst, conflictSolution);
    mergeValue(result, 'isSuperscript', superOrSubscript == 'super', isFirst, conflictSolution);
    mergeValue(result, 'isSubscript', superOrSubscript == 'sub', isFirst, conflictSolution);
    mergeValue(result, 'letterSpacing', mergedFormat.letterSpacing, isFirst, conflictSolution);

    mergeValue(result, 'fontName', mergedFormat.fontFamily, isFirst, conflictSolution);
    mergeValue(
        result,
        'fontSize',
        mergedFormat.fontSize,
        isFirst,
        conflictSolution,
        val => parseValueWithUnit(val, undefined, 'pt') + 'pt'
    );
    mergeValue(result, 'backgroundColor', mergedFormat.backgroundColor, isFirst, conflictSolution);
    mergeValue(result, 'textColor', mergedFormat.textColor, isFirst, conflictSolution);
    mergeValue(result, 'fontWeight', mergedFormat.fontWeight, isFirst, conflictSolution);
    mergeValue(result, 'lineHeight', mergedFormat.lineHeight, isFirst, conflictSolution);
}

function retrieveParagraphFormat(
    result: ContentModelFormatState,
    paragraph: ReadonlyContentModelParagraph,
    isFirst: boolean,
    conflictSolution: ConflictFormatSolution = 'remove'
) {
    const headingLevel = parseInt((paragraph.decorator?.tagName || '').substring(1));
    const validHeadingLevel = headingLevel >= 1 && headingLevel <= 6 ? headingLevel : undefined;

    mergeValue(result, 'marginBottom', paragraph.format.marginBottom, isFirst, conflictSolution);
    mergeValue(result, 'marginTop', paragraph.format.marginTop, isFirst, conflictSolution);
    mergeValue(result, 'headingLevel', validHeadingLevel, isFirst, conflictSolution);
    mergeValue(result, 'textAlign', paragraph.format.textAlign, isFirst, conflictSolution);
    mergeValue(result, 'direction', paragraph.format.direction, isFirst, conflictSolution);
}

function retrieveStructureFormat(
    result: ContentModelFormatState,
    path: ReadonlyContentModelBlockGroup[],
    isFirst: boolean,
    conflictSolution: ConflictFormatSolution = 'remove'
) {
    const listItemIndex = getClosestAncestorBlockGroupIndex(path, ['ListItem'], []);
    const containerIndex = getClosestAncestorBlockGroupIndex(path, ['FormatContainer'], []);

    if (listItemIndex >= 0) {
        const listItem = path[listItemIndex] as ReadonlyContentModelListItem;
        const listType = listItem?.levels[listItem.levels.length - 1]?.listType;

        mergeValue(result, 'isBullet', listType == 'UL', isFirst, conflictSolution);
        mergeValue(result, 'isNumbering', listType == 'OL', isFirst, conflictSolution);
    }

    mergeValue(
        result,
        'isBlockQuote',
        containerIndex >= 0 &&
            (path[containerIndex] as ReadonlyContentModelFormatContainer)?.tagName == 'blockquote',
        isFirst,
        conflictSolution
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
    conflictSolution: ConflictFormatSolution = 'remove',
    parseFn: (val: ContentModelFormatState[K]) => ContentModelFormatState[K] = val => val
) {
    if (isFirst) {
        if (newValue !== undefined) {
            format[key] = newValue;
        }
    } else if (parseFn(newValue) !== parseFn(format[key])) {
        switch (conflictSolution) {
            case 'remove':
                delete format[key];
                break;
            case 'keepFirst':
                break;
            case 'returnMultiple':
                if (typeof format[key] === 'string') {
                    (format[key] as string) = 'Multiple';
                } else {
                    delete format[key];
                }
                break;
        }
    }
}

function px2Pt(px: string) {
    if (px) {
        const index = px.indexOf('px');
        if (index !== -1 && index === px.length - 2) {
            // Edge may not handle the floating computing well which causes the calculated value to be a little less than the actual value
            // So add 0.05 to fix it
            return Math.round(parseFloat(px) * 75 + 0.05) / 100 + 'pt';
        }
    }
    return px;
}

function hasAllRequiredFormat(format: ContentModelSegmentFormat) {
    return !!format.fontFamily && !!format.fontSize && !!format.textColor;
}
