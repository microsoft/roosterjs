import * as getBoundingClientRect from '../../../lib/domToModel/utils/getBoundingClientRect';
import * as parseFormat from '../../../lib/domToModel/utils/parseFormat';
import * as stackFormat from '../../../lib/domToModel/utils/stackFormat';
import { ContentModelBlock } from '../../../lib/publicTypes/block/ContentModelBlock';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createTableCell } from '../../../lib/modelApi/creators/createTableCell';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { ElementProcessor } from '../../../lib/publicTypes/context/ElementProcessor';
import { tableProcessor } from '../../../lib/domToModel/processors/tableProcessor';

describe('tableProcessor', () => {
    let context: DomToModelContext;
    let childProcessor: jasmine.Spy<ElementProcessor<HTMLElement>>;

    beforeEach(() => {
        childProcessor = jasmine.createSpy();
        context = createDomToModelContext(undefined, {
            processorOverride: {
                child: childProcessor,
            },
            allowCacheElement: true,
        });

        spyOn(getBoundingClientRect, 'getBoundingClientRect').and.returnValue(({
            width: 100,
            height: 200,
        } as any) as DOMRect);
    });

    function runTest(tableHTML: string, getExpectedModel: (div: HTMLElement) => ContentModelBlock) {
        const doc = createContentModelDocument();

        const div = document.createElement('div');
        div.innerHTML = tableHTML;

        const expectedModel = getExpectedModel(div);

        tableProcessor(doc, div.firstChild as HTMLTableElement, context);

        expect(doc.blocks[0]).toEqual(expectedModel);
    }

    it('Process a regular 1*1 table', () => {
        runTest('<table class="tb1"><tr><td id="td1"></td></tr></table>', div => {
            return {
                blockType: 'Table',
                cells: [
                    [
                        {
                            blockGroupType: 'TableCell',
                            spanAbove: false,
                            spanLeft: false,
                            isHeader: false,
                            blocks: [],
                            format: {},
                            dataset: {},
                            cachedElement: div.querySelector('#td1') as HTMLTableCellElement,
                        },
                    ],
                ],
                format: {},
                widths: [100],
                heights: [200],
                dataset: {},
                cachedElement: div.querySelector('.tb1') as HTMLTableElement,
            };
        });
    });

    it('Process a regular 2*2 table', () => {
        const tableHTML =
            '<table class="tb1"><tr><td id="td1"></td><td id="td2"></td></tr><tr><td id="td3"></td><td id="td4"></td></tr></table>';
        const tdModel1 = createTableCell(1, 1, false);
        const tdModel2 = createTableCell(1, 1, false);
        const tdModel3 = createTableCell(1, 1, false);
        const tdModel4 = createTableCell(1, 1, false);

        runTest(tableHTML, div => {
            tdModel1.cachedElement = div.querySelector('#td1') as HTMLTableCellElement;
            tdModel2.cachedElement = div.querySelector('#td2') as HTMLTableCellElement;
            tdModel3.cachedElement = div.querySelector('#td3') as HTMLTableCellElement;
            tdModel4.cachedElement = div.querySelector('#td4') as HTMLTableCellElement;

            return {
                blockType: 'Table',
                cells: [
                    [tdModel1, tdModel2],
                    [tdModel3, tdModel4],
                ],
                format: {},
                widths: [100, 100],
                heights: [200, 200],
                dataset: {},
                cachedElement: div.querySelector('.tb1') as HTMLTableElement,
            };
        });
    });

    it('Process a 2*2 table with merged cell', () => {
        const tableHTML =
            '<table class="tb1"><tr><td id="td1"></td><td id="td2"></td></tr><tr><td colspan="2" id="td3"></td></tr></table>';
        const tdModel1 = createTableCell(1, 1, false);
        const tdModel2 = createTableCell(1, 1, false);
        const tdModel3 = createTableCell(1, 1, false);
        const tdModel4 = createTableCell(2, 1, false);

        runTest(tableHTML, div => {
            tdModel1.cachedElement = div.querySelector('#td1') as HTMLTableCellElement;
            tdModel2.cachedElement = div.querySelector('#td2') as HTMLTableCellElement;
            tdModel3.cachedElement = div.querySelector('#td3') as HTMLTableCellElement;

            return {
                blockType: 'Table',
                cells: [
                    [tdModel1, tdModel2],
                    [tdModel3, tdModel4],
                ],
                format: {},
                widths: [100, 100],
                heights: [200, 200],
                dataset: {},
                cachedElement: div.querySelector('.tb1') as HTMLTableElement,
            };
        });
    });

    it('Process a 2*2 table with all cells merged', () => {
        const tableHTML =
            '<table class="tb1"><tr><td colspan="2" rowspan="2" id="td1"></td></tr><tr></tr></table>';

        runTest(tableHTML, div => {
            const tdModel1 = createTableCell(1, 1, false);
            tdModel1.cachedElement = div.querySelector('#td1') as HTMLTableCellElement;

            return {
                blockType: 'Table',
                cells: [
                    [tdModel1, createTableCell(2, 1, false)],
                    [createTableCell(1, 2, false), createTableCell(2, 2, false)],
                ],
                format: {},
                widths: [100, 0],
                heights: [200, 0],
                dataset: {},
                cachedElement: div.querySelector('.tb1') as HTMLTableElement,
            };
        });
    });

    it('Process a 1*1 table with text content', () => {
        const tableHTML = '<table class="tb1"><tr><td id="td1">test</td></tr></table>';
        const tdModel = createTableCell(1, 1, false);

        runTest(tableHTML, div => {
            tdModel.cachedElement = div.querySelector('#td1') as HTMLTableCellElement;

            return {
                blockType: 'Table',
                cells: [[tdModel]],
                format: {},
                widths: [100],
                heights: [200],
                dataset: {},
                cachedElement: div.querySelector('.tb1') as HTMLTableElement,
            };
        });

        expect(childProcessor).toHaveBeenCalledTimes(1);
    });

    it('Process a 1*2 table with element content', () => {
        const tableHTML =
            '<table class="tb1"><tr><td id="td1"><span>test</span></td><td id="td2"><span>test</span></td></tr></table>';
        const tdModel1 = createTableCell(1, 1, false);
        const tdModel2 = createTableCell(1, 1, false);

        runTest(tableHTML, div => {
            tdModel1.cachedElement = div.querySelector('#td1') as HTMLTableCellElement;
            tdModel2.cachedElement = div.querySelector('#td2') as HTMLTableCellElement;

            return {
                blockType: 'Table',
                cells: [[tdModel1, tdModel2]],
                format: {},
                widths: [100, 100],
                heights: [200],
                dataset: {},
                cachedElement: div.querySelector('.tb1') as HTMLTableElement,
            };
        });

        expect(childProcessor).toHaveBeenCalledTimes(2);
    });

    it('Process a 1*2 table with element content in merged cell', () => {
        const tableHTML =
            '<table class="tb1"><tr><td colspan="2" id="td1"><span>test</span></td></tr></table>';
        const tdModel1 = createTableCell(1, 1, false);
        const tdModel2 = createTableCell(2, 1, false);

        runTest(tableHTML, div => {
            tdModel1.cachedElement = div.querySelector('#td1') as HTMLTableCellElement;

            return {
                blockType: 'Table',
                cells: [[tdModel1, tdModel2]],
                format: {},
                widths: [100, 0],
                heights: [200],
                dataset: {},
                cachedElement: div.querySelector('.tb1') as HTMLTableElement,
            };
        });

        expect(childProcessor).toHaveBeenCalledTimes(1);
    });

    it('Process table with selection', () => {
        const tableHTML =
            '<table class="tb1"><tr><td id="td1"></td><td id="td2"></td></tr><tr><td id="td3"></td><td id="td4"></td></tr></table>';
        const tdModel1 = createTableCell(1, 1, false);
        const tdModel2 = createTableCell(1, 1, false);
        const tdModel3 = createTableCell(1, 1, false);
        const tdModel4 = createTableCell(1, 1, false);
        const doc = createContentModelDocument();
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

        tdModel2.isSelected = true;
        tdModel4.isSelected = true;
        tdModel1.cachedElement = div.querySelector('#td1') as HTMLTableCellElement;
        tdModel2.cachedElement = div.querySelector('#td2') as HTMLTableCellElement;
        tdModel3.cachedElement = div.querySelector('#td3') as HTMLTableCellElement;
        tdModel4.cachedElement = div.querySelector('#td4') as HTMLTableCellElement;

        tableProcessor(doc, div.firstChild as HTMLTableElement, context);

        expect(doc.blocks[0]).toEqual({
            blockType: 'Table',
            cells: [
                [tdModel1, tdModel2],
                [tdModel3, tdModel4],
            ],
            format: {},
            widths: [100, 100],
            heights: [200, 200],
            dataset: {},
            cachedElement: div.querySelector('.tb1') as HTMLTableElement,
        });

        expect(childProcessor).toHaveBeenCalledTimes(4);
    });
});

describe('tableProcessor with format', () => {
    let context: DomToModelContext;

    beforeEach(() => {
        context = createDomToModelContext();

        context.allowCacheElement = true;

        spyOn(getBoundingClientRect, 'getBoundingClientRect').and.returnValue(({
            width: 100,
            height: 200,
        } as any) as DOMRect);
    });

    it('Process table and check segment format', () => {
        const doc = createContentModelDocument();
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
                if (handlers == context.formatParsers.table) {
                    (<any>format).format1 = 'table';
                } else if (handlers == context.formatParsers.segmentOnBlock) {
                    (<any>format).format2 = 'tableSegment';
                }
            } else if (element == td) {
                if (handlers == context.formatParsers.tableCell) {
                    (<any>format).format3 = 'td';
                } else if (handlers == context.formatParsers.segmentOnTableCell) {
                    (<any>format).format4 = 'tdSegment';
                }
            }
        });

        tableProcessor(doc, table, context);

        expect(stackFormat.stackFormat).toHaveBeenCalledTimes(2);
        expect(parseFormat.parseFormat).toHaveBeenCalledTimes(6);
        expect(context.segmentFormat).toEqual({ a: 'b' } as any);
        expect(doc).toEqual({
            blockGroupType: 'Document',

            blocks: [
                {
                    blockType: 'Table',
                    cells: [
                        [
                            {
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
                                        format: {},
                                    },
                                ],
                                cachedElement: td,
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                format: {
                                    format3: 'td',
                                } as any,
                                dataset: {},
                            },
                        ],
                    ],
                    widths: [100],
                    heights: [200],
                    format: {
                        format1: 'table',
                    } as any,
                    dataset: {},
                    cachedElement: table,
                },
            ],
        });
    });

    it('calculate table size with zoom scale', () => {
        const mockedTd = ({
            colSpan: 1,
            rowSpan: 1,
            tagName: 'TD',
            style: {},
            dataset: {},
            getAttribute: () => '',
        } as any) as HTMLTableCellElement;
        const mockedTable = ({
            tagName: 'table',
            rows: [
                {
                    cells: [mockedTd],
                },
            ],
            style: {},
            dataset: {},
            getAttribute: () => '',
        } as any) as HTMLTableElement;

        const doc = createContentModelDocument();
        context.zoomScaleFormat.zoomScale = 2;

        tableProcessor(doc, mockedTable, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',

            blocks: [
                {
                    blockType: 'Table',
                    widths: [50],
                    heights: [100],
                    format: {},
                    cells: [
                        [
                            {
                                blockGroupType: 'TableCell',
                                format: {},
                                blocks: [],
                                spanAbove: false,
                                spanLeft: false,
                                isHeader: false,
                                dataset: {},
                                cachedElement: mockedTd,
                            },
                        ],
                    ],
                    dataset: {},
                    cachedElement: mockedTable,
                },
            ],
        });
    });

    it('parse dataset', () => {
        const mockedTable = ({
            tagName: 'table',
            rows: [
                {
                    cells: [
                        {
                            colSpan: 1,
                            rowSpan: 1,
                            tagName: 'TD',
                            style: {},
                            dataset: {},
                            getAttribute: () => '',
                        },
                    ],
                },
            ],
            style: {},
            dataset: {},
            getAttribute: () => '',
        } as any) as HTMLTableElement;

        const doc = createContentModelDocument();
        const datasetParser = jasmine.createSpy('datasetParser');

        context.formatParsers.dataset = [datasetParser];

        tableProcessor(doc, mockedTable, context);

        expect(datasetParser).toHaveBeenCalledWith({}, mockedTable, context, {
            display: 'table',
            boxSizing: 'border-box',
        });
        expect(datasetParser).toHaveBeenCalledWith({}, mockedTable.rows[0].cells[0], context, {
            display: 'table-cell',
        });
    });

    it('parse dataset', () => {
        const mockedTable = ({
            tagName: 'table',
            rows: [
                {
                    cells: [
                        {
                            colSpan: 1,
                            rowSpan: 1,
                            tagName: 'TD',
                            style: {},
                            dataset: {},
                            getAttribute: () => '',
                        },
                    ],
                },
            ],
            style: {},
            dataset: {},
            getAttribute: () => '',
        } as any) as HTMLTableElement;

        const doc = createContentModelDocument();
        const datasetParser = jasmine.createSpy('datasetParser');

        context.formatParsers.dataset = [datasetParser];

        tableProcessor(doc, mockedTable, context);

        expect(datasetParser).toHaveBeenCalledWith({}, mockedTable.rows[0].cells[0], context, {
            display: 'table-cell',
        });
    });
});

describe('tableProcessor', () => {
    let context: DomToModelContext;
    let childProcessor: jasmine.Spy<ElementProcessor<HTMLElement>>;

    beforeEach(() => {
        childProcessor = jasmine.createSpy();
        context = createDomToModelContext(undefined, {
            processorOverride: {
                child: childProcessor,
            },
            allowCacheElement: true,
        });

        spyOn(getBoundingClientRect, 'getBoundingClientRect').and.returnValue(({
            width: 100,
            height: 200,
        } as any) as DOMRect);
    });

    it('list context is stacked during table processing', () => {
        const listLevels = { value: 'test1' } as any;
        const listParent = { value: 'test2' } as any;
        const threadItemCounts = { value: 'test3' } as any;

        context.listFormat.levels = listLevels;
        context.listFormat.listParent = listParent;
        context.listFormat.threadItemCounts = threadItemCounts;

        childProcessor.and.callFake((group, parent, context) => {
            expect(context.listFormat.levels).toEqual([]);
            expect(context.listFormat.listParent).toBeUndefined();
            expect(context.listFormat.threadItemCounts).toBe(threadItemCounts);
        });

        const group = createContentModelDocument();
        const mockedTable = ({
            tagName: 'table',
            rows: [
                {
                    cells: [
                        {
                            colSpan: 1,
                            rowSpan: 1,
                            tagName: 'TD',
                            style: {},
                            dataset: {},
                            getAttribute: () => '',
                        },
                    ],
                },
            ],
            style: {},
            dataset: {},
            getAttribute: () => '',
        } as any) as HTMLTableElement;

        tableProcessor(group, mockedTable, context);

        expect(childProcessor).toHaveBeenCalledTimes(1);
        expect(context.listFormat.levels).toBe(listLevels);
        expect(context.listFormat.listParent).toBe(listParent);
        expect(context.listFormat.threadItemCounts).toBe(threadItemCounts);
    });

    it('Parse text color into table cell format and not impact segment format', () => {
        const group = createContentModelDocument();
        const mockedTd = ({
            colSpan: 1,
            rowSpan: 1,
            tagName: 'TD',
            style: {
                color: 'red',
            },
            dataset: {},
            getAttribute: () => '',
        } as any) as HTMLTableCellElement;
        const mockedTable = ({
            tagName: 'table',
            rows: [
                {
                    cells: [mockedTd],
                },
            ],
            style: {},
            dataset: {},
            getAttribute: () => '',
        } as any) as HTMLTableElement;

        context.segmentFormat = {
            textColor: 'green',
        };

        tableProcessor(group, mockedTable, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    format: {},
                    dataset: {},
                    widths: [100],
                    heights: [200],
                    cells: [
                        [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    textColor: 'red',
                                },
                                spanAbove: false,
                                spanLeft: false,
                                isHeader: false,
                                dataset: {},
                                cachedElement: mockedTd,
                            },
                        ],
                    ],
                    cachedElement: mockedTable,
                },
            ],
        });
    });

    it('Check inherited format from context', () => {
        const group = createContentModelDocument();
        const mockedTable = ({
            tagName: 'table',
            rows: [],
            style: {},
            dataset: {},
            getAttribute: () => '',
        } as any) as HTMLTableElement;

        context.blockFormat.backgroundColor = 'red';
        context.blockFormat.textAlign = 'center';
        context.blockFormat.isTextAlignFromAttr = true;
        context.blockFormat.lineHeight = '2';
        context.blockFormat.whiteSpace = 'pre';
        context.blockFormat.direction = 'rtl';

        tableProcessor(group, mockedTable, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    format: {
                        backgroundColor: 'red',
                        textAlign: 'center',
                        isTextAlignFromAttr: true,
                        lineHeight: '2',
                        whiteSpace: 'pre',
                        direction: 'rtl',
                    },
                    dataset: {},
                    widths: [],
                    heights: [],
                    cells: [],
                    cachedElement: mockedTable,
                },
            ],
        });
    });
});
