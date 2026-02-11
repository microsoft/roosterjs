import { addBlock } from '../common/addBlock';
import { addSegment } from '../common/addSegment';
import { applyTableFormat } from './applyTableFormat';
import { createListItem } from '../creators/createListItem';
import { createParagraph } from '../creators/createParagraph';
import { createSelectionMarker } from '../creators/createSelectionMarker';
import { createTableCell } from '../creators/createTableCell';
import { deleteSelection } from './deleteSelection';
import { EmptySegmentFormat } from '../../constants/EmptySegmentFormat';
import { getClosestAncestorBlockGroupIndex } from './getClosestAncestorBlockGroupIndex';
import { getObjectKeys } from '../..//domUtils/getObjectKeys';
import { mutateBlock } from '../common/mutate';
import { normalizeContentModel } from '../common/normalizeContentModel';
import { normalizeTable } from './normalizeTable';
import type {
    ContentModelBlock,
    ContentModelBlockFormat,
    ContentModelDocument,
    ContentModelHyperLinkFormat,
    ContentModelListItem,
    ContentModelParagraph,
    ContentModelSegmentFormat,
    ContentModelTable,
    FormatContentModelContext,
    InsertPoint,
    MergeModelOption,
    ReadonlyContentModelBlock,
    ReadonlyContentModelBlockGroup,
    ReadonlyContentModelDocument,
    ReadonlyContentModelTable,
    ShallowMutableContentModelParagraph,
} from 'roosterjs-content-model-types';

const HeadingTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
const KeysOfSegmentFormat = getObjectKeys(EmptySegmentFormat);

type MergeFormatTypes = 'mergeAll' | 'keepSourceEmphasisFormat' | 'preferSource' | 'preferTarget';

/**
 * Merge source model into target mode
 * @param target Target Content Model that will merge content into
 * @param source Source Content Model will be merged to target model
 * @param context Format context. When call this function inside formatContentModel, provide this context so that formatContentModel will do extra handling to the result
 * @param options More options, see MergeModelOption
 * @returns Insert point after merge, or null if there is no insert point
 */
export function mergeModel(
    target: ReadonlyContentModelDocument,
    source: ContentModelDocument,
    context?: FormatContentModelContext,
    options?: MergeModelOption
): InsertPoint | null {
    const insertPosition =
        options?.insertPosition ?? deleteSelection(target, [], context).insertPoint;

    const { addParagraphAfterMergedContent, mergeFormat, mergeTable } = options || {};

    if (addParagraphAfterMergedContent && !mergeTable) {
        const { paragraph, marker } = insertPosition || {};
        const newPara = createParagraph(false /* isImplicit */, paragraph?.format, marker?.format);
        addBlock(source, newPara);
    }

    if (insertPosition) {
        if (mergeFormat && mergeFormat != 'none') {
            const newFormat: ContentModelSegmentFormat = {
                ...(target.format || {}),
                ...insertPosition.marker.format,
            };

            applyDefaultFormat(source, newFormat, mergeFormat);
        }

        for (let i = 0; i < source.blocks.length; i++) {
            const block = source.blocks[i];

            switch (block.blockType) {
                case 'Paragraph':
                    mergeParagraph(insertPosition, block, i == 0, context, options);
                    break;

                case 'Divider':
                    insertBlock(insertPosition, block);
                    break;

                case 'Entity':
                    insertBlock(insertPosition, block);
                    context?.newEntities.push(block);
                    break;

                case 'Table':
                    if (source.blocks.length == 1 && mergeTable) {
                        mergeTables(insertPosition, block, source);
                    } else {
                        insertBlock(insertPosition, block);
                    }
                    break;

                case 'BlockGroup':
                    switch (block.blockGroupType) {
                        case 'General':
                        case 'FormatContainer':
                            insertBlock(insertPosition, block);
                            break;
                        case 'ListItem':
                            mergeList(insertPosition, block);
                            break;
                    }
                    break;
            }
        }
    }

    normalizeContentModel(target);

    return insertPosition;
}

function mergeParagraph(
    markerPosition: InsertPoint,
    newPara: ContentModelParagraph,
    mergeToCurrentParagraph: boolean,
    context?: FormatContentModelContext,
    option?: MergeModelOption
) {
    const { paragraph, marker } = markerPosition;
    const newParagraph = mergeToCurrentParagraph
        ? paragraph
        : splitParagraph(markerPosition, newPara.format);
    const segmentIndex = newParagraph.segments.indexOf(marker);

    if (option?.mergeFormat == 'none' && mergeToCurrentParagraph) {
        newParagraph.segments.forEach(segment => {
            segment.format = { ...(newParagraph.segmentFormat || {}), ...segment.format };
        });
        delete newParagraph.segmentFormat;
    }
    if (segmentIndex >= 0) {
        for (let i = 0; i < newPara.segments.length; i++) {
            const segment = newPara.segments[i];

            newParagraph.segments.splice(segmentIndex + i, 0, segment);

            if (context) {
                if (segment.segmentType == 'Entity') {
                    context.newEntities.push(segment);
                }

                if (segment.segmentType == 'Image') {
                    context.newImages.push(segment);
                }
            }
        }
    }

    if (newPara.decorator) {
        newParagraph.decorator = { ...newPara.decorator };
        if (HeadingTags.indexOf(newParagraph.decorator.tagName) > -1) {
            const sourceKeys: (keyof ContentModelSegmentFormat)[] = getObjectKeys(
                newParagraph.decorator.format
            );
            const segmentDecoratorKeys: (keyof ContentModelSegmentFormat)[] = getObjectKeys(
                newParagraph.segmentFormat || {}
            );

            sourceKeys.forEach(key => {
                if (segmentDecoratorKeys.indexOf(key) > -1) {
                    delete newParagraph.segmentFormat?.[key];
                }
            });
        }
    }

    if (!mergeToCurrentParagraph) {
        newParagraph.format = newPara.format;
    } else {
        newParagraph.format = {
            ...newParagraph.format,
            ...newPara.format,
        };
    }
}

function mergeTables(
    markerPosition: InsertPoint,
    newTable: ContentModelTable,
    source: ContentModelDocument
) {
    const { tableContext, marker } = markerPosition;

    if (tableContext && source.blocks.length == 1 && source.blocks[0] == newTable) {
        const { table: readonlyTable, colIndex, rowIndex } = tableContext;
        const table = mutateBlock(readonlyTable);

        const newTableColCount = newTable.rows[0]?.cells.length || 0;
        const newTableRowCount = newTable.rows.length;

        const lastTargetColIndex = getTargetColIndex(table, rowIndex, colIndex, newTableColCount);
        const extraColsNeeded = lastTargetColIndex - table.rows[0].cells.length;

        if (extraColsNeeded > 0) {
            const currentColCount = table.rows[0].cells.length;
            for (let col = 0; col < extraColsNeeded; col++) {
                const newColIndex = currentColCount + col;
                for (let k = 0; k < table.rows.length; k++) {
                    const leftCell = table.rows[k]?.cells[newColIndex - 1];
                    table.rows[k].cells[newColIndex] = createTableCell(
                        false /*spanLeft*/,
                        false /*spanAbove*/,
                        leftCell?.isHeader,
                        leftCell?.format
                    );
                }
            }
        }

        const lastTargetRowIndex = getTargetRowIndex(table, rowIndex, newTableRowCount, colIndex);
        const extraRowsNeeded = lastTargetRowIndex - table.rows.length;

        if (extraRowsNeeded > 0) {
            const currentRowCount = table.rows.length;
            const colCount = table.rows[0]?.cells.length || 0;
            for (let row = 0; row < extraRowsNeeded; row++) {
                const newRowIndex = currentRowCount + row;
                table.rows[newRowIndex] = {
                    cells: [],
                    format: {},
                    height: 0,
                };
                for (let k = 0; k < colCount; k++) {
                    const aboveCell = table.rows[newRowIndex - 1]?.cells[k];
                    table.rows[newRowIndex].cells[k] = createTableCell(
                        false /*spanLeft*/,
                        false /*spanAbove*/,
                        false /*isHeader*/,
                        aboveCell?.format
                    );
                }
            }
        }

        for (let i = 0; i < newTable.rows.length; i++) {
            const targetRowIndex = getTargetRowIndex(table, rowIndex, i, colIndex);

            for (let j = 0; j < newTable.rows[i].cells.length; j++) {
                const newCell = newTable.rows[i].cells[j];

                const targetColIndex = getTargetColIndex(table, targetRowIndex, colIndex, j);

                const oldCell = table.rows[targetRowIndex]?.cells[targetColIndex];

                table.rows[targetRowIndex].cells[targetColIndex] = newCell;

                if (i == 0 && j == 0) {
                    const newMarker = createSelectionMarker(marker.format);
                    const newPara = addSegment(newCell, newMarker);

                    if (markerPosition.path[0] == oldCell) {
                        // Update insert point to match the change result
                        markerPosition.path[0] = newCell;
                        markerPosition.marker = newMarker;
                        markerPosition.paragraph = newPara;
                    }
                }
            }
        }

        normalizeTable(table, markerPosition.marker.format);
        applyTableFormat(table, undefined /*newFormat*/, true /*keepCellShade*/);
    } else {
        insertBlock(markerPosition, newTable);
    }
}

function mergeList(markerPosition: InsertPoint, newList: ContentModelListItem) {
    splitParagraph(markerPosition, newList.format);

    const { path, paragraph } = markerPosition;

    const listItemIndex = getClosestAncestorBlockGroupIndex(path, ['ListItem'], ['TableCell']);
    const listItem = path[listItemIndex] as ContentModelListItem;
    const listParent = path[listItemIndex + 1]; // It is ok here when index is -1, that means there is no list and we just insert a new paragraph and use path[0] as its parent
    const blockIndex = listParent.blocks.indexOf(listItem || paragraph);

    if (blockIndex >= 0) {
        mutateBlock(listParent).blocks.splice(blockIndex, 0, newList);
    }

    if (listItem) {
        listItem?.levels.forEach((level, i) => {
            newList.levels[i] = { ...level };
        });
    }
}

function splitParagraph(markerPosition: InsertPoint, newParaFormat: ContentModelBlockFormat) {
    const { paragraph, marker, path } = markerPosition;
    const segmentIndex = paragraph.segments.indexOf(marker);
    const paraIndex = path[0].blocks.indexOf(paragraph);
    const newParagraph: ShallowMutableContentModelParagraph = createParagraph(
        false /*isImplicit*/,
        { ...paragraph.format, ...newParaFormat },
        paragraph.segmentFormat
    );

    if (segmentIndex >= 0) {
        newParagraph.segments = paragraph.segments.splice(segmentIndex);
    }

    if (paraIndex >= 0) {
        mutateBlock(path[0]).blocks.splice(paraIndex + 1, 0, newParagraph);
    }

    const listItemIndex = getClosestAncestorBlockGroupIndex(
        path,
        ['ListItem'],
        ['FormatContainer', 'TableCell']
    );
    const listItem = path[listItemIndex] as ContentModelListItem;

    if (listItem) {
        const listParent = listItemIndex >= 0 ? path[listItemIndex + 1] : null;
        const blockIndex = listParent ? listParent.blocks.indexOf(listItem) : -1;

        if (blockIndex >= 0 && listParent) {
            const newListItem = createListItem(listItem.levels, listItem.formatHolder.format);

            if (paraIndex >= 0) {
                newListItem.blocks = listItem.blocks.splice(paraIndex + 1);
            }

            if (blockIndex >= 0) {
                mutateBlock(listParent).blocks.splice(blockIndex + 1, 0, newListItem);
            }

            path[listItemIndex] = newListItem;
        }
    }

    markerPosition.paragraph = newParagraph;

    return newParagraph;
}

function insertBlock(markerPosition: InsertPoint, block: ContentModelBlock) {
    const { path } = markerPosition;
    const newParaFormat = block.blockType !== 'Paragraph' ? {} : block.format;
    const newPara = splitParagraph(markerPosition, newParaFormat);
    const blockIndex = path[0].blocks.indexOf(newPara);

    if (blockIndex >= 0) {
        mutateBlock(path[0]).blocks.splice(blockIndex, 0, block);
    }
}

function applyDefaultFormat(
    group: ReadonlyContentModelBlockGroup,
    format: ContentModelSegmentFormat,
    applyDefaultFormatOption: MergeFormatTypes
) {
    group.blocks.forEach(block => {
        mergeBlockFormat(applyDefaultFormatOption, block);

        switch (block.blockType) {
            case 'BlockGroup':
                if (block.blockGroupType == 'ListItem') {
                    mutateBlock(block).formatHolder.format = mergeSegmentFormat(
                        applyDefaultFormatOption,
                        format,
                        block.formatHolder.format
                    );
                }
                applyDefaultFormat(block, format, applyDefaultFormatOption);
                break;

            case 'Table':
                block.rows.forEach(row =>
                    row.cells.forEach(cell => {
                        applyDefaultFormat(cell, format, applyDefaultFormatOption);
                    })
                );
                break;

            case 'Paragraph':
                const paragraphFormat = block.decorator?.format || {};
                const paragraph = mutateBlock(block);

                paragraph.segments.forEach(segment => {
                    if (segment.segmentType == 'General') {
                        applyDefaultFormat(segment, format, applyDefaultFormatOption);
                    }

                    segment.format = mergeSegmentFormat(applyDefaultFormatOption, format, {
                        ...paragraphFormat,
                        ...segment.format,
                    });

                    if (segment.link) {
                        segment.link.format = mergeLinkFormat(
                            applyDefaultFormatOption,
                            format,
                            segment.link.format
                        );
                    }
                });

                if (applyDefaultFormatOption === 'keepSourceEmphasisFormat') {
                    delete paragraph.decorator;
                }
                break;
        }
    });
}

function mergeBlockFormat(applyDefaultFormatOption: string, block: ReadonlyContentModelBlock) {
    if (applyDefaultFormatOption == 'keepSourceEmphasisFormat' && block.format.backgroundColor) {
        delete mutateBlock(block).format.backgroundColor;
    }
}

/**
 * Hyperlink format type definition only contains backgroundColor and underline.
 * So create a minimum object with the styles supported in Hyperlink to be used in merge.
 */
function getSegmentFormatInLinkFormat(
    targetFormat: ContentModelSegmentFormat
): ContentModelSegmentFormat {
    const result: ContentModelHyperLinkFormat = {};
    if (targetFormat.backgroundColor) {
        result.backgroundColor = targetFormat.backgroundColor;
    }
    if (targetFormat.underline) {
        result.underline = targetFormat.underline;
    }

    return result;
}

function mergeLinkFormat(
    applyDefaultFormatOption: MergeFormatTypes,
    targetFormat: ContentModelSegmentFormat,
    sourceFormat: ContentModelHyperLinkFormat
) {
    switch (applyDefaultFormatOption) {
        case 'mergeAll':
        case 'preferSource':
            return { ...getSegmentFormatInLinkFormat(targetFormat), ...sourceFormat };
        case 'keepSourceEmphasisFormat':
            return {
                // Hyperlink segment format contains other attributes such as LinkFormat
                // so we have to retain them
                ...getFormatWithoutSegmentFormat(sourceFormat),
                // Link format only have Text color, background color, Underline, but only
                // text color + background color should be merged from the target
                ...getSegmentFormatInLinkFormat(targetFormat),
                // Get the semantic format of the source
                ...getSemanticFormat(sourceFormat),
                // The text color of the hyperlink should not be merged and
                // we should always retain the source text color
                ...getHyperlinkTextColor(sourceFormat),
            };
        case 'preferTarget':
            return { ...sourceFormat, ...getSegmentFormatInLinkFormat(targetFormat) };
    }
}

function mergeSegmentFormat(
    applyDefaultFormatOption: MergeFormatTypes,
    targetFormat: ContentModelSegmentFormat,
    sourceFormat: ContentModelSegmentFormat
): ContentModelSegmentFormat {
    switch (applyDefaultFormatOption) {
        case 'mergeAll':
        case 'preferSource':
            return { ...targetFormat, ...sourceFormat };
        case 'preferTarget':
            return { ...sourceFormat, ...targetFormat };
        case 'keepSourceEmphasisFormat':
            return {
                ...getFormatWithoutSegmentFormat(sourceFormat),
                ...targetFormat,
                ...getSemanticFormat(sourceFormat),
            };
    }
}

function getSemanticFormat(segmentFormat: ContentModelSegmentFormat): ContentModelSegmentFormat {
    const result: ContentModelSegmentFormat = {};

    const { fontWeight, italic, underline } = segmentFormat;

    if (fontWeight && fontWeight != 'normal') {
        result.fontWeight = fontWeight;
    }
    if (italic) {
        result.italic = italic;
    }
    if (underline) {
        result.underline = underline;
    }

    return result;
}

/**
 * Segment format can also contain other type of metadata, for example in Images/Hyperlink,
 * we want to preserve these properties when merging format
 */
function getFormatWithoutSegmentFormat(
    sourceFormat: ContentModelSegmentFormat
): ContentModelSegmentFormat {
    const resultFormat = {
        ...sourceFormat,
    };
    KeysOfSegmentFormat.forEach(key => delete resultFormat[key]);
    return resultFormat;
}

function getHyperlinkTextColor(sourceFormat: ContentModelHyperLinkFormat) {
    const result: ContentModelHyperLinkFormat = {};
    if (sourceFormat.textColor) {
        result.textColor = sourceFormat.textColor;
    }

    return result;
}

function getTargetColIndex(
    table: ReadonlyContentModelTable,
    rowIndex: number,
    startColIndex: number,
    offset: number
): number {
    const row = table.rows[rowIndex];
    if (!row) {
        return startColIndex + offset;
    }

    if (offset === 0) {
        return startColIndex;
    }

    let targetColIndex = startColIndex;
    let logicalCellsToSkip = offset;

    while (logicalCellsToSkip > 0) {
        targetColIndex++;

        if (targetColIndex >= row.cells.length) {
            logicalCellsToSkip--;
        } else if (!row.cells[targetColIndex].spanLeft) {
            logicalCellsToSkip--;
        }
    }

    return targetColIndex;
}

function getTargetRowIndex(
    table: ReadonlyContentModelTable,
    startRowIndex: number,
    offset: number,
    colIndex: number
): number {
    if (offset === 0) {
        return startRowIndex;
    }

    let targetRowIndex = startRowIndex;
    let logicalRowsToSkip = offset;

    while (logicalRowsToSkip > 0) {
        targetRowIndex++;

        if (targetRowIndex >= table.rows.length) {
            logicalRowsToSkip--;
        } else if (!table.rows[targetRowIndex]?.cells[colIndex]?.spanAbove) {
            logicalRowsToSkip--;
        }
    }

    return targetRowIndex;
}
