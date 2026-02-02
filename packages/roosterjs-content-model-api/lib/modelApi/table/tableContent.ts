import {
    createBr,
    createDivider,
    createEntity,
    createFormatContainer,
    createGeneralBlock,
    createGeneralSegment,
    createImage,
    createListItem,
    createParagraph,
    createSelectionMarker,
    createTableCell,
    createTableRow,
    createText,
    iterateSelections,
} from 'roosterjs-content-model-dom';
import type {
    ContentModelBlock,
    ContentModelSegment,
    ContentModelTable,
    ContentModelTableCellFormat,
    ReadonlyContentModelBlock,
    ReadonlyContentModelBlockGroup,
    ReadonlyContentModelSegment,
    ReadonlyContentModelTable,
    ShallowMutableContentModelDocument,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function getSelectedContent(
    model: ShallowMutableContentModelDocument
): ContentModelBlock[][] {
    const selectedRows: ContentModelBlock[][] = [];
    let lastBlock: ReadonlyContentModelBlock | undefined = undefined;
    let currentRowIndex: number | undefined;
    let currentRowBlocks: ContentModelBlock[] = [];

    iterateSelections(model, (path, tableContext, block, segments) => {
        if (path.length == 1 && block) {
            if (currentRowBlocks.length > 0) {
                selectedRows.push(currentRowBlocks);
                currentRowBlocks = [];
                currentRowIndex = undefined;
            }

            if (block.blockType === 'Table') {
                extractTableCellsContent(block, selectedRows);
            } else {
                const contentBlock = getContentBlockFromSelection(block, segments);
                selectedRows.push([contentBlock]);
            }
        } else if (block && path[0].blockGroupType === 'TableCell' && tableContext) {
            if (currentRowIndex !== tableContext.rowIndex) {
                if (currentRowBlocks.length > 0) {
                    selectedRows.push(currentRowBlocks);
                    currentRowBlocks = [];
                }
                currentRowIndex = tableContext.rowIndex;
            }
            const contentBlock = getContentBlockFromSelection(block, segments);
            currentRowBlocks.push(contentBlock);
        } else if (
            block &&
            path[0].blockGroupType !== 'TableCell' &&
            path[0].blockGroupType !== 'Document' &&
            path[0] !== lastBlock
        ) {
            if (currentRowBlocks.length > 0) {
                selectedRows.push(currentRowBlocks);
                currentRowBlocks = [];
                currentRowIndex = undefined;
            }

            selectedRows.push([getContentBlockFromSelection(path[0])]);
            lastBlock = path[0];
        }
    });

    if (currentRowBlocks.length > 0) {
        selectedRows.push(currentRowBlocks);
    }

    return selectedRows;
}

function extractTableCellsContent(
    table: ReadonlyContentModelTable,
    selectedRows: ContentModelBlock[][]
) {
    for (const row of table.rows) {
        const rowBlocks: ContentModelBlock[] = [];
        for (const cell of row.cells) {
            if (!cell.spanLeft && !cell.spanAbove) {
                for (const block of cell.blocks) {
                    rowBlocks.push(getContentBlockFromSelection(block));
                }
            }
        }
        if (rowBlocks.length > 0) {
            selectedRows.push(rowBlocks);
        }
    }
}

/**
 * @internal
 */
export function insertTableContent(
    table: ContentModelTable,
    contentRows: ContentModelBlock[][],
    colNumber: number,
    customCellFormat?: ContentModelTableCellFormat
) {
    let rowIndex = 0;
    for (const rowBlocks of contentRows) {
        if (!table.rows[rowIndex]) {
            const row = createTableRow();
            for (let i = 0; i < colNumber; i++) {
                const cell = createTableCell(
                    undefined /*spanLeftOrColSpan */,
                    undefined /*spanAboveOrRowSpan */,
                    undefined /* isHeader */,
                    customCellFormat
                );
                row.cells.push(cell);
            }
            table.rows.push(row);
        }

        let cellIndex = 0;
        for (const block of rowBlocks) {
            if (cellIndex < table.rows[rowIndex].cells.length) {
                table.rows[rowIndex].cells[cellIndex].blocks = [block];
            }
            cellIndex++;
        }
        rowIndex++;
    }
}

function getContentBlockFromSelection(
    block: ReadonlyContentModelBlock,
    segments?: ReadonlyContentModelSegment[]
): ContentModelBlock {
    switch (block.blockType) {
        case 'Paragraph':
            const newParagraph = createParagraph(
                block.isImplicit,
                block.format,
                block.segmentFormat,
                block.decorator
            );
            if (segments && segments.length > 0) {
                newParagraph.segments = createSegments(segments);
            } else {
                newParagraph.segments = createSegments([...block.segments]);
            }
            return newParagraph;
        case 'Divider':
            return createDivider(block.tagName, block.format);
        case 'Entity':
            return createEntity(
                block.wrapper,
                block.entityFormat.isReadonly,
                block.format,
                block.entityFormat.entityType,
                block.entityFormat.id
            );
        case 'BlockGroup':
            return createBlockGroupCopy(block);
        case 'Table':
            const extractedRows: ContentModelBlock[][] = [];
            extractTableCellsContent(block, extractedRows);
            const extractedBlocks: ContentModelBlock[] = [];
            for (const row of extractedRows) {
                extractedBlocks.push(...row);
            }
            if (extractedBlocks.length === 1) {
                return extractedBlocks[0];
            }
            const container = createFormatContainer('div');
            container.blocks = extractedBlocks;
            return container;
    }
}

function createBlockGroupCopy(blockGroup: ReadonlyContentModelBlockGroup): ContentModelBlock {
    const copiedBlocks: ContentModelBlock[] = [];
    for (const block of blockGroup.blocks) {
        copiedBlocks.push(getContentBlockFromSelection(block));
    }

    switch (blockGroup.blockGroupType) {
        case 'ListItem':
            const listItem = createListItem(blockGroup.levels, blockGroup.formatHolder.format);
            listItem.blocks = copiedBlocks;
            return listItem;
        case 'FormatContainer':
            const formatContainer = createFormatContainer(blockGroup.tagName, blockGroup.format);
            formatContainer.blocks = copiedBlocks;
            return formatContainer;
        case 'General':
            const generalBlock = createGeneralBlock(cloneHtmlElement(blockGroup.element));
            generalBlock.blocks = copiedBlocks;
            return generalBlock;
        case 'TableCell':
        case 'Document':
            if (copiedBlocks.length === 1) {
                return copiedBlocks[0];
            }
            const container = createFormatContainer('div');
            container.blocks = copiedBlocks;
            return container;
    }
}

function cloneHtmlElement(element: HTMLElement): HTMLElement {
    return element.cloneNode(true) as HTMLElement;
}

function createSegments(segments: ReadonlyContentModelSegment[]): ContentModelSegment[] {
    const newSegments: ContentModelSegment[] = [];

    for (const segment of segments) {
        let newSegment: ContentModelSegment | undefined;

        switch (segment.segmentType) {
            case 'Text':
                newSegment = createText(segment.text, segment.format, segment.link, segment.code);
                break;
            case 'Br':
                newSegment = createBr(segment.format);
                break;
            case 'Image':
                const image = createImage(segment.src, segment.format);
                image.dataset = { ...segment.dataset };
                if (segment.link) {
                    image.link = {
                        format: { ...segment.link.format },
                        dataset: { ...segment.link.dataset },
                    };
                }
                newSegment = image;
                break;
            case 'SelectionMarker':
                newSegment = createSelectionMarker(segment.format);
                break;
            case 'General':
                const general = createGeneralSegment(
                    cloneHtmlElement(segment.element),
                    segment.format
                );
                if (segment.link) {
                    general.link = {
                        format: { ...segment.link.format },
                        dataset: { ...segment.link.dataset },
                    };
                }
                newSegment = general;
                break;
            case 'Entity':
                newSegment = createEntity(
                    segment.wrapper,
                    segment.entityFormat.isReadonly,
                    segment.format,
                    segment.entityFormat.entityType,
                    segment.entityFormat.id
                );
                break;
        }

        if (newSegment) {
            newSegments.push(newSegment);
        }
    }

    return newSegments;
}
