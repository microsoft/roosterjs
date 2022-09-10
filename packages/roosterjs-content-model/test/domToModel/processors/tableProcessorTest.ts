import * as containerProcessor from '../../../lib/domToModel/processors/containerProcessor';
import * as parseFormat from '../../../lib/domToModel/utils/parseFormat';
import * as stackFormat from '../../../lib/domToModel/utils/stackFormat';
import { ContentModelBlock } from '../../../lib/publicTypes/block/ContentModelBlock';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createTableCell } from '../../../lib/modelApi/creators/createTableCell';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { SegmentFormatHandlers } from '../../../lib/formatHandlers/SegmentFormatHandlers';
import { TableCellFormatHandlers } from '../../../lib/formatHandlers/TableCellFormatHandler';
import { TableFormatHandlers } from '../../../lib/formatHandlers/TableFormatHandlers';
import { tableProcessor } from '../../../lib/domToModel/processors/tableProcessor';

describe('tableProcessor', () => {
    let context: DomToModelContext;

    beforeEach(() => {
        context = createDomToModelContext();
        spyOn(containerProcessor, 'containerProcessor');
    });

    function runTest(tableHTML: string, expectedModel: ContentModelBlock) {
        const doc = createContentModelDocument(document);

        const div = document.createElement('div');
        div.innerHTML = tableHTML;

        tableProcessor(doc, div.firstChild as HTMLTableElement, context);

        expect(doc.blocks[0]).toEqual(expectedModel);
    }

    it('Process a regular 1*1 table', () => {
        runTest('<table><tr><td></td></tr></table>', {
            blockType: 'Table',
            cells: [
                [
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'TableCell',
                        spanAbove: false,
                        spanLeft: false,
                        isHeader: false,
                        blocks: [],
                        format: {},
                    },
                ],
            ],
            format: {},
            widths: [0],
            heights: [0],
        });
    });

    it('Process a regular 2*2 table', () => {
        const tdHTML = '<td></td>';
        const trHTML = `<tr>${tdHTML}${tdHTML}</tr>`;
        const tableHTML = `<table>${trHTML}${trHTML}</table>`;
        const tdModel = createTableCell(1, 1, false);

        runTest(tableHTML, {
            blockType: 'Table',
            cells: [
                [tdModel, tdModel],
                [tdModel, tdModel],
            ],
            format: {},
            widths: [0, 0],
            heights: [0, 0],
        });
    });

    it('Process a 2*2 table with merged cell', () => {
        const tableHTML =
            '<table><tr><td></td><td></td></tr><tr><td colspan="2"></td></tr></table>';
        const tdModel = createTableCell(1, 1, false);

        runTest(tableHTML, {
            blockType: 'Table',
            cells: [
                [tdModel, tdModel],
                [tdModel, createTableCell(2, 1, false)],
            ],
            format: {},
            widths: [0, 0],
            heights: [0, 0],
        });
    });

    it('Process a 2*2 table with all cells merged', () => {
        const tableHTML = '<table><tr><td colspan="2" rowspan="2"></td></tr><tr></tr></table>';

        runTest(tableHTML, {
            blockType: 'Table',
            cells: [
                [createTableCell(1, 1, false), createTableCell(2, 1, false)],
                [createTableCell(1, 2, false), createTableCell(2, 2, false)],
            ],
            format: {},
            widths: [0, 0],
            heights: [0, 0],
        });
    });

    it('Process a 1*1 table with text content', () => {
        const tableHTML = '<table><tr><td>test</td></tr></table>';
        const tdModel = createTableCell(1, 1, false);

        runTest(tableHTML, {
            blockType: 'Table',
            cells: [[tdModel]],
            format: {},
            widths: [0],
            heights: [0],
        });

        expect(containerProcessor.containerProcessor).toHaveBeenCalledTimes(1);
    });

    it('Process a 1*2 table with element content', () => {
        const tableHTML =
            '<table><tr><td><span>test</span></td><td><span>test</span></td></tr></table>';
        const tdModel = createTableCell(1, 1, false);

        runTest(tableHTML, {
            blockType: 'Table',
            cells: [[tdModel, tdModel]],
            format: {},
            widths: [0, 0],
            heights: [0],
        });

        expect(containerProcessor.containerProcessor).toHaveBeenCalledTimes(2);
    });

    it('Process a 1*2 table with element content in merged cell', () => {
        const tableHTML = '<table><tr><td colspan="2"><span>test</span></td></tr></table>';
        const tdModel = createTableCell(1, 1, false);

        runTest(tableHTML, {
            blockType: 'Table',
            cells: [[tdModel, createTableCell(2, 1, false)]],
            format: {},
            widths: [0, 0],
            heights: [0],
        });

        expect(containerProcessor.containerProcessor).toHaveBeenCalledTimes(1);
    });

    it('Process table with selection', () => {
        const tableHTML = '<table><tr><td></td><td></td></tr><tr><td></td><td></td></tr></table>';
        const tdModel = createTableCell(1, 1, false);
        const doc = createContentModelDocument(document);
        const div = document.createElement('div');

        div.innerHTML = tableHTML;
        context.tableSelection = {
            table: div.firstChild as HTMLTableElement,
            firstCell: {
                x: 1,
                y: 0,
            },
            lastCell: {
                x: 1,
                y: 1,
            },
        };

        tableProcessor(doc, div.firstChild as HTMLTableElement, context);

        expect(doc.blocks[0]).toEqual({
            blockType: 'Table',
            cells: [
                [tdModel, { ...tdModel, isSelected: true }],
                [tdModel, { ...tdModel, isSelected: true }],
            ],
            format: {},
            widths: [0, 0],
            heights: [0, 0],
        });

        expect(containerProcessor.containerProcessor).toHaveBeenCalledTimes(4);
    });
});

describe('tableProcessor with format', () => {
    let context: DomToModelContext;

    beforeEach(() => {
        context = createDomToModelContext();
    });

    it('Process table and check segment format', () => {
        const doc = createContentModelDocument(document);
        const table = document.createElement('table');
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        const br = document.createElement('br');

        table.appendChild(tr);
        tr.appendChild(td);
        td.appendChild(br);

        context.segmentFormat = { a: 'b' } as any;

        spyOn(stackFormat, 'stackFormat').and.callThrough();
        spyOn(parseFormat, 'parseFormat').and.callFake((element, handlers, format, context) => {
            if (element == table) {
                if (handlers == TableFormatHandlers) {
                    (<any>format).format1 = 'table';
                } else if (handlers == SegmentFormatHandlers) {
                    (<any>format).format2 = 'tableSegment';
                }
            } else if (element == td) {
                if (handlers == TableCellFormatHandlers) {
                    (<any>format).format3 = 'td';
                } else if (handlers == SegmentFormatHandlers) {
                    (<any>format).format4 = 'tdSegment';
                }
            }
        });

        tableProcessor(doc, table, context);

        expect(stackFormat.stackFormat).toHaveBeenCalledTimes(2);
        expect(parseFormat.parseFormat).toHaveBeenCalledTimes(4);
        expect(context.segmentFormat).toEqual({ a: 'b' } as any);
        expect(doc).toEqual({
            blockType: 'BlockGroup',
            blockGroupType: 'Document',
            document: document,
            blocks: [
                {
                    blockType: 'Table',
                    cells: [
                        [
                            {
                                blockType: 'BlockGroup',
                                blockGroupType: 'TableCell',
                                blocks: [
                                    {
                                        blockType: 'Paragraph',
                                        isImplicit: true,
                                        segments: [
                                            {
                                                segmentType: 'Br',
                                                format: {
                                                    a: 'b',
                                                    format2: 'tableSegment',
                                                    format4: 'tdSegment',
                                                } as any,
                                            },
                                        ],
                                    },
                                ],
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                format: {
                                    format3: 'td',
                                } as any,
                            },
                        ],
                    ],
                    widths: [0],
                    heights: [0],
                    format: {
                        format1: 'table',
                    } as any,
                },
            ],
        });
    });

    it('calculate table size with zoom scale', () => {
        const mockedTable = ({
            rows: [
                {
                    cells: [
                        {
                            colSpan: 1,
                            rowSpan: 1,
                            tagName: 'TD',
                            style: {},
                            dataset: {},
                            getBoundingClientRect: () => ({
                                width: 100,
                                height: 200,
                            }),
                            getAttribute: () => '',
                        },
                    ],
                },
            ],
            style: {},
            dataset: {},
            getAttribute: () => '',
        } as any) as HTMLTableElement;

        const doc = createContentModelDocument(document);
        context.zoomScale = 2;

        tableProcessor(doc, mockedTable, context);

        expect(doc).toEqual({
            blockType: 'BlockGroup',
            blockGroupType: 'Document',
            document: document,
            blocks: [
                {
                    blockType: 'Table',
                    widths: [50],
                    heights: [100],
                    format: {},
                    cells: [
                        [
                            {
                                blockType: 'BlockGroup',
                                blockGroupType: 'TableCell',
                                format: {},
                                blocks: [],
                                spanAbove: false,
                                spanLeft: false,
                                isHeader: false,
                            },
                        ],
                    ],
                },
            ],
        });
    });
});
