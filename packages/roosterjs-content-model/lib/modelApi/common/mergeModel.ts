import { addSegment } from './addSegment';
import { applyTableFormat } from '../table/applyTableFormat';
import { ContentModelBlock } from '../../publicTypes/block/ContentModelBlock';
import { ContentModelBlockFormat } from '../../publicTypes/format/ContentModelBlockFormat';
import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { ContentModelListItem } from '../../publicTypes/group/ContentModelListItem';
import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { createListItem } from '../creators/createListItem';
import { createParagraph } from '../creators/createParagraph';
import { createSelectionMarker } from '../creators/createSelectionMarker';
import { createTableCell } from '../creators/createTableCell';
import { deleteSelection } from '../edit/deleteSelection';
import { getClosestAncestorBlockGroupIndex } from './getClosestAncestorBlockGroupIndex';
import { InsertPoint } from '../../publicTypes/selection/InsertPoint';
import { normalizeContentModel } from './normalizeContentModel';
import { normalizeTable } from '../table/normalizeTable';
import { OnDeleteEntity } from '../edit/utils/DeleteSelectionStep';

/**
 * @internal
 * Options to specify how to merge models
 */
export interface MergeModelOption {
    /**
     * When there is only a table to merge, whether merge this table into current table (if any), or just directly insert (nested table).
     * This is usually used when paste table inside a table
     * @default false
     */
    mergeTable?: boolean;

    /**
     * Use this insert position to merge instead of querying selection from target model
     * @default undefined
     */
    insertPosition?: InsertPoint;

    /**
     * Use this to decide whether to change the source model format when doing the merge.
     * 'mergeAll': segment format of the insert position will be merged into the content that is merged into current model.
     * If the source model already has some format, it will not be overwritten.
     * 'keepSourceEmphasisFormat': format of the insert position will be set into the content that is merged into current model.
     * If the source model already has emphasis format, such as, fontWeight, Italic or underline different than the default style, it will not be overwritten.
     * 'none' the source segment format will not be modified.
     * @default undefined
     */
    mergeFormat?: 'mergeAll' | 'keepSourceEmphasisFormat' | 'none';
}

/**
 * @internal
 */
export function mergeModel(
    target: ContentModelDocument,
    source: ContentModelDocument,
    onDeleteEntity: OnDeleteEntity,
    options?: MergeModelOption
) {
    const insertPosition =
        options?.insertPosition ?? deleteSelection(target, onDeleteEntity).insertPoint;

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
                    mergeParagraph(insertPosition, block, i == 0);
                    break;

                case 'Divider':
                case 'Entity':
                    insertBlock(insertPosition, block);
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
}

function mergeParagraph(
    markerPosition: InsertPoint,
    newPara: ContentModelParagraph,
    mergeToCurrentParagraph: boolean
) {
    const { paragraph, marker } = markerPosition;
    const newParagraph = mergeToCurrentParagraph
        ? paragraph
        : splitParagraph(markerPosition, newPara.format);
    const segmentIndex = newParagraph.segments.indexOf(marker);

    if (segmentIndex >= 0) {
        newParagraph.segments.splice(segmentIndex, 0, ...newPara.segments);
    }
}

function mergeTable(
    markerPosition: InsertPoint,
    newTable: ContentModelTable,
    source: ContentModelDocument
) {
    const { tableContext } = markerPosition;

    if (tableContext && source.blocks.length == 1 && source.blocks[0] == newTable) {
        const { table, colIndex, rowIndex } = tableContext;
        for (let i = 0; i < newTable.rows.length; i++) {
            for (let j = 0; j < newTable.rows[i].cells.length; j++) {
                const newCell = newTable.rows[i].cells[j];

                if (i == 0 && colIndex + j >= table.rows[0].cells.length) {
                    for (let k = 0; k < table.rows.length; k++) {
                        const leftCell = table.rows[k]?.cells[colIndex + j - 1];
                        table.rows[k].cells[colIndex + j] = createTableCell(
                            false /*spanLeft*/,
                            false /*spanAbove*/,
                            leftCell?.isHeader,
                            leftCell?.format
                        );
                    }
                }

                if (j == 0 && rowIndex + i >= table.rows.length) {
                    if (!table.rows[rowIndex + i]) {
                        table.rows[rowIndex + i] = {
                            cells: [],
                            format: {},
                            height: 0,
                        };
                    }

                    for (let k = 0; k < table.rows[rowIndex].cells.length; k++) {
                        const aboveCell = table.rows[rowIndex + i - 1]?.cells[k];
                        table.rows[rowIndex + i].cells[k] = createTableCell(
                            false /*spanLeft*/,
                            false /*spanAbove*/,
                            false /*isHeader*/,
                            aboveCell?.format
                        );
                    }
                }

                table.rows[rowIndex + i].cells[colIndex + j] = newCell;

                if (i == 0 && j == 0) {
                    addSegment(newCell, createSelectionMarker());
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

    const listItemIndex = getClosestAncestorBlockGroupIndex(path, ['ListItem']);
    const listItem = path[listItemIndex] as ContentModelListItem;
    const listParent = path[listItemIndex + 1]; // It is ok here when index is -1, that means there is no list and we just insert a new paragraph and use path[0] as its parent
    const blockIndex = listParent.blocks.indexOf(listItem || paragraph);

    if (blockIndex >= 0) {
        listParent.blocks.splice(blockIndex, 0, newList);
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
        newParagraph.segments = paragraph.segments.splice(segmentIndex);
    }

    if (paraIndex >= 0) {
        path[0].blocks.splice(paraIndex + 1, 0, newParagraph);
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
                listParent.blocks.splice(blockIndex + 1, 0, newListItem);
            }

            path[listItemIndex] = newListItem;
        }
    }

    markerPosition.paragraph = newParagraph;

    return newParagraph;
}

function insertBlock(markerPosition: InsertPoint, block: ContentModelBlock) {
    const { path } = markerPosition;
    const newPara = splitParagraph(markerPosition, block.format);
    const blockIndex = path[0].blocks.indexOf(newPara);

    if (blockIndex >= 0) {
        path[0].blocks.splice(blockIndex, 0, block);
    }
}

function applyDefaultFormat(
    group: ContentModelBlockGroup,
    format: ContentModelSegmentFormat,
    applyDefaultFormatOption: 'mergeAll' | 'keepSourceEmphasisFormat'
) {
    group.blocks.forEach(block => {
        switch (block.blockType) {
            case 'BlockGroup':
                if (block.blockGroupType == 'ListItem') {
                    block.formatHolder.format = mergeSegmentFormat(
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
                block.segments.forEach(segment => {
                    if (segment.segmentType == 'General') {
                        applyDefaultFormat(segment, format, applyDefaultFormatOption);
                    }

                    segment.format = mergeSegmentFormat(
                        applyDefaultFormatOption,
                        format,
                        segment.format
                    );
                });
                break;
        }
    });
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
