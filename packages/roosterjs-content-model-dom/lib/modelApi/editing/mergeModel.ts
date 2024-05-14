import { addSegment } from '../common/addSegment';
import { applyTableFormat } from './applyTableFormat';
import { createListItem } from '../creators/createListItem';
import { createParagraph } from '../creators/createParagraph';
import { createSelectionMarker } from '../creators/createSelectionMarker';
import { createTableCell } from '../creators/createTableCell';
import { deleteSelection } from './deleteSelection';
import { getClosestAncestorBlockGroupIndex } from './getClosestAncestorBlockGroupIndex';
import { getObjectKeys } from '../..//domUtils/getObjectKeys';
import { mutateBlock } from '../common/mutate';
import { normalizeContentModel } from '../common/normalizeContentModel';
import { normalizeTable } from './normalizeTable';
import type {
    ContentModelBlock,
    ContentModelBlockFormat,
    ContentModelDocument,
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
} from 'roosterjs-content-model-types';

const HeadingTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

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

    if (insertPosition) {
        if (options?.mergeFormat && options.mergeFormat != 'none') {
            const newFormat: ContentModelSegmentFormat = {
                ...(target.format || {}),
                ...insertPosition.marker.format,
            };

            applyDefaultFormat(source, newFormat, options?.mergeFormat);
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
                    if (source.blocks.length == 1 && options?.mergeTable) {
                        mergeTable(insertPosition, block, source);
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
    const readonlyParagraph = mergeToCurrentParagraph
        ? paragraph
        : splitParagraph(markerPosition, newPara.format);
    const segmentIndex = readonlyParagraph.segments.indexOf(marker);
    const newParagraph = mutateBlock(readonlyParagraph);

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

function mergeTable(
    markerPosition: InsertPoint,
    newTable: ContentModelTable,
    source: ContentModelDocument
) {
    const { tableContext, marker } = markerPosition;

    if (tableContext && source.blocks.length == 1 && source.blocks[0] == newTable) {
        const { table, colIndex, rowIndex } = tableContext;
        const mutableTable = mutateBlock(table);

        for (let i = 0; i < newTable.rows.length; i++) {
            for (let j = 0; j < newTable.rows[i].cells.length; j++) {
                const newCell = newTable.rows[i].cells[j];

                if (i == 0 && colIndex + j >= mutableTable.rows[0].cells.length) {
                    for (let k = 0; k < mutableTable.rows.length; k++) {
                        const leftCell = mutableTable.rows[k]?.cells[colIndex + j - 1];
                        mutableTable.rows[k].cells[colIndex + j] = createTableCell(
                            false /*spanLeft*/,
                            false /*spanAbove*/,
                            leftCell?.isHeader,
                            leftCell?.format
                        );
                    }
                }

                if (j == 0 && rowIndex + i >= mutableTable.rows.length) {
                    if (!mutableTable.rows[rowIndex + i]) {
                        mutableTable.rows[rowIndex + i] = {
                            cells: [],
                            format: {},
                            height: 0,
                        };
                    }

                    for (let k = 0; k < mutableTable.rows[rowIndex].cells.length; k++) {
                        const aboveCell = mutableTable.rows[rowIndex + i - 1]?.cells[k];
                        mutableTable.rows[rowIndex + i].cells[k] = createTableCell(
                            false /*spanLeft*/,
                            false /*spanAbove*/,
                            false /*isHeader*/,
                            aboveCell?.format
                        );
                    }
                }

                const oldCell = mutableTable.rows[rowIndex + i].cells[colIndex + j];
                mutableTable.rows[rowIndex + i].cells[colIndex + j] = newCell;

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

        normalizeTable(mutableTable, markerPosition.marker.format);
        applyTableFormat(mutableTable, undefined /*newFormat*/, true /*keepCellShade*/);
    } else {
        insertBlock(markerPosition, newTable);
    }
}

function mergeList(markerPosition: InsertPoint, newList: ContentModelListItem) {
    splitParagraph(markerPosition, newList.format);

    const { path, paragraph } = markerPosition;

    const listItemIndex = getClosestAncestorBlockGroupIndex(path, ['ListItem']);
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
    const newParagraph = createParagraph(
        false /*isImplicit*/,
        { ...paragraph.format, ...newParaFormat },
        paragraph.segmentFormat
    );

    if (segmentIndex >= 0) {
        newParagraph.segments = mutateBlock(paragraph).segments.splice(segmentIndex);
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
    applyDefaultFormatOption: 'mergeAll' | 'keepSourceEmphasisFormat'
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

function mergeSegmentFormat(
    applyDefaultFormatOption: 'mergeAll' | 'keepSourceEmphasisFormat',
    targetformat: ContentModelSegmentFormat,
    sourceFormat: ContentModelSegmentFormat
): ContentModelSegmentFormat {
    return applyDefaultFormatOption == 'mergeAll'
        ? { ...targetformat, ...sourceFormat }
        : {
              ...targetformat,
              ...getSemanticFormat(sourceFormat),
          };
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
