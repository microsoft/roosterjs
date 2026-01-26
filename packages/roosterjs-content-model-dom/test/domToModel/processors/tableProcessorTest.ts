import * as getBoundingClientRect from '../../../lib/domToModel/utils/getBoundingClientRect';
import * as parseFormat from '../../../lib/domToModel/utils/parseFormat';
import * as stackFormat from '../../../lib/domToModel/utils/stackFormat';
import { childProcessor as originalChildProcessor } from '../../../lib/domToModel/processors/childProcessor';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createTableCell } from '../../../lib/modelApi/creators/createTableCell';
import { tableProcessor } from '../../../lib/domToModel/processors/tableProcessor';
import {
    ContentModelBlock,
    DomIndexer,
    ContentModelTable,
    DomToModelContext,
    ElementProcessor,
} from 'roosterjs-content-model-types';

describe('tableProcessor', () => {
    let context: DomToModelContext;
    let childProcessor: jasmine.Spy<ElementProcessor<Node>>;

    beforeEach(() => {
        childProcessor = jasmine.createSpy();
        context = createDomToModelContext(
            {
                recalculateTableSize: true,
            },
            {
                processorOverride: {
                    child: childProcessor,
                },
            }
        );

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
        runTest('<table class="tb1"><tr id="tr1"><td id="td1"></td></tr></table>', div => {
            return {
                blockType: 'Table',
                rows: [
                    {
                        format: {},
                        height: 200,
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                spanAbove: false,
                                spanLeft: false,
                                isHeader: false,
                                blocks: [],
                                format: {},
                                dataset: {},
                            },
                        ],
                    },
                ],
                format: {},
                widths: [100],
                dataset: {},
            };
        });
    });

    it('Process a regular 2*2 table', () => {
        const tableHTML =
            '<table class="tb1"><tr id="tr1"><td id="td1"></td><td id="td2"></td></tr><tr id="tr2"><td id="td3"></td><td id="td4"></td></tr></table>';
        const tdModel1 = createTableCell(1, 1, false);
        const tdModel2 = createTableCell(1, 1, false);
        const tdModel3 = createTableCell(1, 1, false);
        const tdModel4 = createTableCell(1, 1, false);

        runTest(tableHTML, div => {
            return {
                blockType: 'Table',
                rows: [
                    {
                        format: {},
                        height: 200,
                        cells: [tdModel1, tdModel2],
                    },
                    {
                        format: {},
                        height: 200,
                        cells: [tdModel3, tdModel4],
                    },
                ],
                format: {},
                widths: [100, 100],
                dataset: {},
            };
        });
    });

    it('Process a 2*2 table with merged cell', () => {
        const tableHTML =
            '<table class="tb1"><tr id="tr1"><td id="td1"></td><td id="td2"></td></tr><tr id="tr2"><td colspan="2" id="td3"></td></tr></table>';
        const tdModel1 = createTableCell(1, 1, false);
        const tdModel2 = createTableCell(1, 1, false);
        const tdModel3 = createTableCell(1, 1, false);
        const tdModel4 = createTableCell(2, 1, false);

        runTest(tableHTML, div => {
            return {
                blockType: 'Table',
                rows: [
                    {
                        format: {},
                        height: 200,
                        cells: [tdModel1, tdModel2],
                    },
                    {
                        format: {},
                        height: 200,
                        cells: [tdModel3, tdModel4],
                    },
                ],
                format: {},
                widths: [100, 100],
                dataset: {},
            };
        });
    });

    it('Process a 2*2 table with all cells merged', () => {
        const tableHTML =
            '<table class="tb1"><tr id="tr1"><td colspan="2" rowspan="2" id="td1"></td></tr><tr id="tr2"></tr></table>';

        runTest(tableHTML, div => {
            const tdModel1 = createTableCell(1, 1, false);

            return {
                blockType: 'Table',
                rows: [
                    {
                        format: {},
                        height: 200,
                        cells: [tdModel1, createTableCell(2, 1, false)],
                    },
                    {
                        format: {},
                        height: 0,
                        cells: [createTableCell(1, 2, false), createTableCell(2, 2, false)],
                    },
                ],
                format: {},
                widths: [100, 0],
                dataset: {},
            };
        });
    });

    it('Process a 1*1 table with text content', () => {
        const tableHTML = '<table class="tb1"><tr id="tr1"><td id="td1">test</td></tr></table>';
        const tdModel = createTableCell(1, 1, false);

        runTest(tableHTML, div => {
            return {
                blockType: 'Table',
                rows: [
                    {
                        format: {},
                        height: 200,
                        cells: [tdModel],
                    },
                ],
                format: {},
                widths: [100],
                dataset: {},
            };
        });

        expect(childProcessor).toHaveBeenCalledTimes(1);
    });

    it('Process a 1*2 table with element content', () => {
        const tableHTML =
            '<table class="tb1"><tr id="tr1"><td id="td1"><span>test</span></td><td id="td2"><span>test</span></td></tr></table>';
        const tdModel1 = createTableCell(1, 1, false);
        const tdModel2 = createTableCell(1, 1, false);

        runTest(tableHTML, div => {
            return {
                blockType: 'Table',
                rows: [
                    {
                        format: {},
                        height: 200,
                        cells: [tdModel1, tdModel2],
                    },
                ],
                format: {},
                widths: [100, 100],
                dataset: {},
            };
        });

        expect(childProcessor).toHaveBeenCalledTimes(2);
    });

    it('Process a 1*2 table with element content in merged cell', () => {
        const tableHTML =
            '<table class="tb1"><tr id="tr1"><td colspan="2" id="td1"><span>test</span></td></tr></table>';
        const tdModel1 = createTableCell(1, 1, false);
        const tdModel2 = createTableCell(2, 1, false);

        runTest(tableHTML, div => {
            return {
                blockType: 'Table',
                rows: [
                    {
                        format: {},
                        height: 200,
                        cells: [tdModel1, tdModel2],
                    },
                ],
                format: {},
                widths: [100, 0],
                dataset: {},
            };
        });

        expect(childProcessor).toHaveBeenCalledTimes(1);
    });

    it('Process table with selection', () => {
        const tableHTML =
            '<table class="tb1"><tr id="tr1"><td id="td1"></td><td id="td2"></td></tr><tr id="tr2"><td id="td3"></td><td id="td4"></td></tr></table>';
        const tdModel1 = createTableCell(1, 1, false);
        const tdModel2 = createTableCell(1, 1, false);
        const tdModel3 = createTableCell(1, 1, false);
        const tdModel4 = createTableCell(1, 1, false);
        const doc = createContentModelDocument();
        const div = document.createElement('div');

        div.innerHTML = tableHTML;
        context.selection = {
            type: 'table',
            table: div.firstChild as HTMLTableElement,
            firstRow: 0,
            lastRow: 1,
            firstColumn: 1,
            lastColumn: 1,
        } as any;

        tdModel2.isSelected = true;
        tdModel4.isSelected = true;

        tableProcessor(doc, div.firstChild as HTMLTableElement, context);

        expect(doc.blocks[0]).toEqual({
            blockType: 'Table',
            rows: [
                {
                    format: {},
                    height: 200,
                    cells: [tdModel1, tdModel2],
                },
                {
                    format: {},
                    height: 200,
                    cells: [tdModel3, tdModel4],
                },
            ],
            format: {},
            widths: [100, 100],
            dataset: {},
        });

        expect(childProcessor).toHaveBeenCalledTimes(4);
    });

    it('Table with domIndexer', () => {
        const doc = createContentModelDocument();
        const div = document.createElement('div');
        const onTableSpy = jasmine.createSpy('onTable');
        const domIndexer: DomIndexer = {
            onParagraph: null!,
            onSegment: null!,
            onTable: onTableSpy,
            reconcileSelection: null!,
            reconcileChildList: null!,
            onBlockEntity: null!,
            reconcileElementId: null!,
            onMergeText: null!,
            clearIndex: null!,
        };

        context.domIndexer = domIndexer;

        div.innerHTML = '<table class="tb1"><tr id="tr1"><td id="td1"></td></tr></table>';

        tableProcessor(doc, div.firstChild as HTMLTableElement, context);

        const tableModel: ContentModelTable = {
            blockType: 'Table',
            rows: [
                {
                    format: {},
                    height: 200,
                    cells: [
                        {
                            blockGroupType: 'TableCell',
                            spanAbove: false,
                            spanLeft: false,
                            isHeader: false,
                            blocks: [],
                            format: {},
                            dataset: {},
                        },
                    ],
                },
            ],
            format: {},
            widths: [100],
            dataset: {},
        };

        expect(doc.blocks[0]).toEqual(tableModel);

        expect(onTableSpy).toHaveBeenCalledWith(div.firstChild, tableModel);
    });
});

describe('tableProcessor with format', () => {
    let context: DomToModelContext;

    beforeEach(() => {
        context = createDomToModelContext({
            recalculateTableSize: true,
        });

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

        expect(stackFormat.stackFormat).toHaveBeenCalledTimes(3);
        expect(parseFormat.parseFormat).toHaveBeenCalledTimes(13);
        expect(context.segmentFormat).toEqual({ a: 'b' } as any);
        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    rows: [
                        {
                            format: {},
                            height: 200,
                            cells: [
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
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    format: {
                                        format3: 'td',
                                    } as any,
                                    dataset: {},
                                },
                            ],
                        },
                    ],
                    widths: [100],
                    format: {
                        format1: 'table',
                    } as any,
                    dataset: {},
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
        const mockedTr = {
            tagName: 'tr',
            style: {},
            getAttribute: () => '',
            cells: [mockedTd],
        };
        const mockedTable = ({
            tagName: 'table',
            rows: [mockedTr],
            style: {},
            dataset: {},
            getAttribute: () => '',
        } as any) as HTMLTableElement;

        const doc = createContentModelDocument();
        context.zoomScale = 2;

        tableProcessor(doc, mockedTable, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    widths: [50],
                    format: {},
                    rows: [
                        {
                            format: {},
                            height: 100,
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    format: {},
                                    blocks: [],
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                            ],
                        },
                    ],
                    dataset: {},
                },
            ],
        });
    });

    it('parse dataset', () => {
        const mockedTable = ({
            tagName: 'table',
            rows: [
                {
                    tagName: 'tr',
                    style: {},
                    getAttribute: () => '',
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

        context = createDomToModelContext(undefined, {
            formatParserOverride: { dataset: datasetParser },
        });

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
                    tagName: 'tr',
                    style: {},
                    getAttribute: () => '',
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

        context = createDomToModelContext(undefined, {
            formatParserOverride: { dataset: datasetParser },
        });

        tableProcessor(doc, mockedTable, context);

        expect(datasetParser).toHaveBeenCalledWith({}, mockedTable.rows[0].cells[0], context, {
            display: 'table-cell',
        });
    });
});

describe('tableProcessor', () => {
    let context: DomToModelContext;
    let childProcessor: jasmine.Spy<ElementProcessor<ParentNode>>;

    beforeEach(() => {
        childProcessor = jasmine.createSpy();
        context = createDomToModelContext(
            {
                recalculateTableSize: true,
            },
            {
                processorOverride: { child: childProcessor },
            }
        );

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
                    tagName: 'tr',
                    style: {},
                    getAttribute: () => '',
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
        const mockedTr = ({
            tagName: 'tr',
            style: {},
            getAttribute: () => '',
            cells: [mockedTd],
        } as any) as HTMLTableRowElement;
        const mockedTable = ({
            tagName: 'table',
            rows: [mockedTr],
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
                    rows: [
                        {
                            format: {},
                            height: 200,
                            cells: [
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
                                },
                            ],
                        },
                    ],
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
                        lineHeight: '2',
                        whiteSpace: 'pre',
                        direction: 'rtl',
                    },
                    dataset: {},
                    widths: [],
                    rows: [],
                },
            ],
        });
    });

    it('Style on TR node should be respected', () => {
        const group = createContentModelDocument();
        const text = document.createTextNode('test');
        const td = document.createElement('td');
        const tr = document.createElement('tr');
        const table = document.createElement('table');

        childProcessor.and.callFake(originalChildProcessor);
        td.appendChild(text);
        tr.appendChild(td);
        table.appendChild(tr);

        tr.style.fontSize = '20px';
        tr.style.lineHeight = '2';

        tableProcessor(group, table, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    rows: [
                        {
                            format: {},
                            height: 200,
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    format: {
                                        lineHeight: '2',
                                    },
                                    dataset: {},
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            isImplicit: true,
                                            format: { lineHeight: '2' },
                                            segments: [
                                                {
                                                    segmentType: 'Text',
                                                    format: { fontSize: '20px' },
                                                    text: 'test',
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                    format: {},
                    dataset: {},
                    widths: [100],
                },
            ],
        });
    });

    it('border styles from table is respected', () => {
        const group = createContentModelDocument();
        const table = document.createElement('table');

        table.style.boxSizing = 'border-box';
        table.style.borderCollapse = 'collapse';

        tableProcessor(group, table, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    rows: [],
                    format: {
                        useBorderBox: true,
                        borderCollapse: true,
                    },
                    dataset: {},
                    widths: [],
                },
            ],
        });
    });

    it('border styles from td is respected', () => {
        const group = createContentModelDocument();
        const td = document.createElement('td');
        const tr = document.createElement('tr');
        const table = document.createElement('table');

        tr.appendChild(td);
        table.appendChild(tr);

        td.style.boxSizing = 'border-box';

        tableProcessor(group, table, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    rows: [
                        {
                            format: {},
                            height: 200,
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    format: { useBorderBox: true },
                                    blocks: [],
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                            ],
                        },
                    ],
                    format: {},
                    dataset: {},
                    widths: [100],
                },
            ],
        });
    });

    it('block format on TD is respected', () => {
        const group = createContentModelDocument();
        const td = document.createElement('td');
        const tr = document.createElement('tr');
        const table = document.createElement('table');

        tr.appendChild(td);
        table.appendChild(tr);

        td.style.lineHeight = '2';
        td.style.whiteSpace = 'pre';
        td.style.direction = 'rtl';
        td.style.textAlign = 'right';

        tableProcessor(group, table, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    rows: [
                        {
                            format: {},
                            height: 200,
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    format: {
                                        lineHeight: '2',
                                        whiteSpace: 'pre',
                                        direction: 'rtl',
                                        textAlign: 'start',
                                    },
                                    blocks: [],
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                            ],
                        },
                    ],
                    format: {},
                    dataset: {},
                    widths: [100],
                },
            ],
        });
    });

    it('segment format on TD is respected', () => {
        const group = createContentModelDocument();
        const text = document.createTextNode('test');
        const td = document.createElement('td');
        const tr = document.createElement('tr');
        const table = document.createElement('table');

        td.appendChild(text);
        tr.appendChild(td);
        table.appendChild(tr);

        td.style.color = 'red';
        td.style.fontFamily = 'Arial';
        td.style.fontWeight = 'bold';

        childProcessor.and.callFake(originalChildProcessor);

        tableProcessor(group, table, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    rows: [
                        {
                            format: {},
                            height: 200,

                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    format: { textColor: 'red' },
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            isImplicit: true,
                                            format: {},
                                            segments: [
                                                {
                                                    segmentType: 'Text',
                                                    format: {
                                                        fontFamily: 'Arial',
                                                        fontWeight: 'bold',
                                                    },
                                                    text: 'test',
                                                },
                                            ],
                                        },
                                    ],
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                            ],
                        },
                    ],
                    format: {},
                    dataset: {},
                    widths: [100],
                },
            ],
        });
    });

    it('table has format on TBODY', () => {
        const group = createContentModelDocument();
        const table = document.createElement('table');
        const tbody = document.createElement('tbody');
        const tr = document.createElement('tr');
        const td = document.createElement('td');

        td.appendChild(document.createTextNode('test'));
        tr.appendChild(td);
        tbody.appendChild(tr);
        table.appendChild(tbody);

        tbody.style.fontSize = '12px';

        childProcessor.and.callFake(originalChildProcessor);

        tableProcessor(group, table, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    rows: [
                        {
                            format: {},
                            height: 200,
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    format: {},
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            isImplicit: true,
                                            format: {},
                                            segments: [
                                                {
                                                    segmentType: 'Text',
                                                    format: {
                                                        fontSize: '12px',
                                                    },
                                                    text: 'test',
                                                },
                                            ],
                                        },
                                    ],
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                            ],
                        },
                    ],
                    format: {},
                    dataset: {},
                    widths: [100],
                },
            ],
        });
    });

    it('Make sure block format and HTML align is parsed', () => {
        const group = createContentModelDocument();
        const table = document.createElement('table');
        const tr = document.createElement('tr');
        const td = document.createElement('td');

        table.dir = 'rtl';
        table.style.lineHeight = '2';
        table.style.textAlign = 'center';
        table.style.whiteSpace = 'pre';

        td.dir = 'ltr';
        td.style.lineHeight = '1';
        td.style.textAlign = 'left';
        td.style.whiteSpace = 'normal';

        table.appendChild(tr);
        tr.appendChild(td);

        childProcessor.and.callFake(() => {
            expect(context.blockFormat).toEqual({
                direction: 'ltr',
                textAlign: 'start',
                lineHeight: '1',
                whiteSpace: 'normal',
            });
        });

        tableProcessor(group, table, context);

        expect(childProcessor).toHaveBeenCalledTimes(1);
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    widths: [100],
                    dataset: {},

                    rows: [
                        {
                            format: {},
                            height: 200,
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {
                                        direction: 'ltr',
                                        textAlign: 'start',
                                        lineHeight: '1',
                                        whiteSpace: 'normal',
                                    },
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                            ],
                        },
                    ],
                    format: {
                        direction: 'rtl',
                        textAlign: 'center',
                        lineHeight: '2',
                        whiteSpace: 'pre',
                    },
                },
            ],
        });

        expect(context.blockFormat).toEqual({});
    });

    it('Respect html align on table', () => {
        const group = createContentModelDocument();
        const table = document.createElement('table');
        const tr = document.createElement('tr');
        const td = document.createElement('td');

        table.align = 'center';

        table.appendChild(tr);
        tr.appendChild(td);

        context.blockFormat.textAlign = 'end';

        childProcessor.and.callFake(() => {
            expect(context.blockFormat).toEqual({});
        });

        tableProcessor(group, table, context);

        expect(childProcessor).toHaveBeenCalledTimes(1);
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    widths: [100],
                    dataset: {},

                    rows: [
                        {
                            format: {},
                            height: 200,
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                            ],
                        },
                    ],
                    format: {
                        htmlAlign: 'center',
                    },
                },
            ],
        });

        expect(context.blockFormat).toEqual({
            textAlign: 'end',
        });
    });

    it('Respect html align on td', () => {
        const group = createContentModelDocument();
        const table = document.createElement('table');
        const tr = document.createElement('tr');
        const td = document.createElement('td');

        td.align = 'center';

        table.appendChild(tr);
        tr.appendChild(td);

        context.blockFormat.textAlign = 'end';

        childProcessor.and.callFake(() => {
            expect(context.blockFormat).toEqual({});
        });

        tableProcessor(group, table, context);

        expect(childProcessor).toHaveBeenCalledTimes(1);
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    widths: [100],
                    dataset: {},

                    rows: [
                        {
                            format: {},
                            height: 200,
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {
                                        htmlAlign: 'center',
                                    },
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                            ],
                        },
                    ],
                    format: {
                        textAlign: 'end',
                    },
                },
            ],
        });

        expect(context.blockFormat).toEqual({
            textAlign: 'end',
        });
    });

    it('Respect background on tr', () => {
        const group = createContentModelDocument();
        const table = document.createElement('table');
        const tr = document.createElement('tr');
        const td = document.createElement('td');

        tr.style.backgroundColor = 'red';

        table.appendChild(tr);
        tr.appendChild(td);

        childProcessor.and.callFake(() => {
            expect(context.blockFormat).toEqual({});
            expect(context.segmentFormat).toEqual({});
        });

        tableProcessor(group, table, context);

        expect(childProcessor).toHaveBeenCalledTimes(1);
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    widths: [100],
                    dataset: {},

                    rows: [
                        {
                            format: {
                                backgroundColor: 'red',
                            },
                            height: 200,
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                            ],
                        },
                    ],
                    format: {},
                },
            ],
        });
    });

    it('Respect background on tbody', () => {
        const group = createContentModelDocument();
        const table = document.createElement('table');
        const tbody = document.createElement('tbody');
        const tr = document.createElement('tr');
        const td = document.createElement('td');

        tbody.style.backgroundColor = 'red';

        table.appendChild(tbody);
        tbody.appendChild(tr);
        tr.appendChild(td);

        childProcessor.and.callFake(() => {
            expect(context.blockFormat).toEqual({});
            expect(context.segmentFormat).toEqual({});
        });

        tableProcessor(group, table, context);

        expect(childProcessor).toHaveBeenCalledTimes(1);
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    widths: [100],
                    dataset: {},

                    rows: [
                        {
                            format: {
                                backgroundColor: 'red',
                            },
                            height: 200,
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                            ],
                        },
                    ],
                    format: {},
                },
            ],
        });
    });

    it('Has colgroup', () => {
        const group = createContentModelDocument();
        const table = document.createElement('table');
        const colgroup = document.createElement('colgroup');
        const col1 = document.createElement('col');
        const col2 = document.createElement('col');
        const tbody = document.createElement('tbody');
        const tr = document.createElement('tr');
        const td = document.createElement('td');

        col1.style.width = '100px';
        col2.style.width = '50px';

        colgroup.appendChild(col1);
        colgroup.appendChild(col2);
        table.appendChild(colgroup);

        tbody.style.backgroundColor = 'red';

        table.appendChild(tbody);
        tbody.appendChild(tr);
        tr.appendChild(td);

        childProcessor.and.callFake(() => {
            expect(context.blockFormat).toEqual({});
            expect(context.segmentFormat).toEqual({});
        });

        context.allowCacheElement = true;

        tableProcessor(group, table, context);

        expect(childProcessor).toHaveBeenCalledTimes(1);
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    widths: [100, 50],
                    dataset: {},
                    cachedElement: table,
                    rows: [
                        {
                            format: {
                                backgroundColor: 'red',
                            },
                            height: 200,
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                            ],
                        },
                    ],
                    format: {},
                },
            ],
        });
    });

    it('Process a table with rows having fewer cells - extends short rows with spanLeft cells', () => {
        const group = createContentModelDocument();
        const div = document.createElement('div');
        div.innerHTML =
            '<table><tr><td id="td1"></td><td id="td2"></td><td id="td3"></td></tr><tr><td id="td4"></td></tr></table>';

        tableProcessor(group, div.firstChild as HTMLTableElement, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    rows: [
                        {
                            format: {},
                            height: 200,
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blocks: [],
                                    format: {},
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blocks: [],
                                    format: {},
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blocks: [],
                                    format: {},
                                    dataset: {},
                                },
                            ],
                        },
                        {
                            format: {},
                            height: 200,
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blocks: [],
                                    format: {},
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    spanAbove: false,
                                    spanLeft: true,
                                    isHeader: false,
                                    blocks: [],
                                    format: {},
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    spanAbove: false,
                                    spanLeft: true,
                                    isHeader: false,
                                    blocks: [],
                                    format: {},
                                    dataset: {},
                                },
                            ],
                        },
                    ],
                    format: {},
                    widths: [100, 100, 100],
                    dataset: {},
                },
            ],
        });
    });

    it('Process a table with header cell in short row - extends with spanLeft header cells', () => {
        const group = createContentModelDocument();
        const div = document.createElement('div');
        div.innerHTML =
            '<table><tr><td id="td1"></td><td id="td2"></td></tr><tr><th id="th1"></th></tr></table>';

        tableProcessor(group, div.firstChild as HTMLTableElement, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    rows: [
                        {
                            format: {},
                            height: 200,
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blocks: [],
                                    format: {},
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blocks: [],
                                    format: {},
                                    dataset: {},
                                },
                            ],
                        },
                        {
                            format: {},
                            height: 200,
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: true,
                                    blocks: [],
                                    format: {},
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    spanAbove: false,
                                    spanLeft: true,
                                    isHeader: true,
                                    blocks: [],
                                    format: {},
                                    dataset: {},
                                },
                            ],
                        },
                    ],
                    format: {},
                    widths: [100, 100],
                    dataset: {},
                },
            ],
        });
    });

    it('Process a table with colspan in first row and fewer cells in second row', () => {
        const group = createContentModelDocument();
        const div = document.createElement('div');
        div.innerHTML =
            '<table><tr><td colspan="3" id="td1"></td></tr><tr><td id="td2"></td></tr></table>';

        tableProcessor(group, div.firstChild as HTMLTableElement, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    rows: [
                        {
                            format: {},
                            height: 200,
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blocks: [],
                                    format: {},
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    spanAbove: false,
                                    spanLeft: true,
                                    isHeader: false,
                                    blocks: [],
                                    format: {},
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    spanAbove: false,
                                    spanLeft: true,
                                    isHeader: false,
                                    blocks: [],
                                    format: {},
                                    dataset: {},
                                },
                            ],
                        },
                        {
                            format: {},
                            height: 200,
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blocks: [],
                                    format: {},
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    spanAbove: false,
                                    spanLeft: true,
                                    isHeader: false,
                                    blocks: [],
                                    format: {},
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    spanAbove: false,
                                    spanLeft: true,
                                    isHeader: false,
                                    blocks: [],
                                    format: {},
                                    dataset: {},
                                },
                            ],
                        },
                    ],
                    format: {},
                    widths: [100, 0, 0],
                    dataset: {},
                },
            ],
        });
    });

    it('Process a table with colspan in short row', () => {
        const group = createContentModelDocument();
        const div = document.createElement('div');
        div.innerHTML =
            '<table><tr><td id="td1"></td><td id="td2"></td><td id="td3"></td></tr><tr><td colspan="2" id="td4"></td></tr></table>';

        tableProcessor(group, div.firstChild as HTMLTableElement, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    rows: [
                        {
                            format: {},
                            height: 200,
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blocks: [],
                                    format: {},
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blocks: [],
                                    format: {},
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blocks: [],
                                    format: {},
                                    dataset: {},
                                },
                            ],
                        },
                        {
                            format: {},
                            height: 200,
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blocks: [],
                                    format: {},
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    spanAbove: false,
                                    spanLeft: true,
                                    isHeader: false,
                                    blocks: [],
                                    format: {},
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    spanAbove: false,
                                    spanLeft: true,
                                    isHeader: false,
                                    blocks: [],
                                    format: {},
                                    dataset: {},
                                },
                            ],
                        },
                    ],
                    format: {},
                    widths: [100, 100, 100],
                    dataset: {},
                },
            ],
        });
    });
});

describe('tableProcessor without recalculateTableSize', () => {
    let context: DomToModelContext;
    let childProcessor: jasmine.Spy<ElementProcessor<Node>>;

    beforeEach(() => {
        childProcessor = jasmine.createSpy();
        context = createDomToModelContext(undefined, {
            processorOverride: {
                child: childProcessor,
            },
        });
    });

    function runTest(
        tableHTML: string,
        getExpectedModel: (div: HTMLElement, model?: ContentModelBlock) => ContentModelBlock
    ) {
        const doc = createContentModelDocument();

        const div = document.createElement('div');
        div.innerHTML = tableHTML;

        tableProcessor(doc, div.firstChild as HTMLTableElement, context);

        const expectedModel = getExpectedModel(div, doc.blocks[0]);

        expect(doc.blocks[0]).toEqual(expectedModel);
    }

    it('Process a regular 1*1 table', () => {
        runTest('<table class="tb1"><tr id="tr1"><td id="td1"></td></tr></table>', div => {
            return {
                blockType: 'Table',
                rows: [
                    {
                        format: {},
                        height: 0,
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                spanAbove: false,
                                spanLeft: false,
                                isHeader: false,
                                blocks: [],
                                format: {},
                                dataset: {},
                            },
                        ],
                    },
                ],
                format: {},
                widths: [],
                dataset: {},
            };
        });
    });

    it('Process a regular 1*1 table with colSpan 0 and rowSpan 0', () => {
        runTest(
            '<table class="tb1"><tr id="tr1"><td id="td1" colSpan="0" rowSpan="0"></td></tr></table>',
            div => {
                return {
                    blockType: 'Table',
                    rows: [
                        {
                            format: {},
                            height: 0,
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blocks: [],
                                    format: {},
                                    dataset: {},
                                },
                            ],
                        },
                    ],
                    format: {},
                    widths: [],
                    dataset: {},
                };
            }
        );
    });

    it('Process a 3*2 table with rowSpan 0 in first row', () => {
        runTest(
            '<table class="tb1">' +
                '<tr id="tr1"><td id="td1" rowSpan="0">Cell A</td><td id="td2">Cell B</td></tr>' +
                '<tr id="tr2"><td id="td3">Cell C</td></tr>' +
                '<tr id="tr3"><td id="td4">Cell D</td></tr>' +
                '</table>',
            div => {
                return {
                    blockType: 'Table',
                    rows: [
                        {
                            format: {},
                            height: 0,
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blocks: [],
                                    format: {},
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blocks: [],
                                    format: {},
                                    dataset: {},
                                },
                            ],
                        },
                        {
                            format: {},
                            height: 0,
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    spanAbove: true,
                                    spanLeft: false,
                                    isHeader: false,
                                    blocks: [],
                                    format: {},
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blocks: [],
                                    format: {},
                                    dataset: {},
                                },
                            ],
                        },
                        {
                            format: {},
                            height: 0,
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    spanAbove: true,
                                    spanLeft: false,
                                    isHeader: false,
                                    blocks: [],
                                    format: {},
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blocks: [],
                                    format: {},
                                    dataset: {},
                                },
                            ],
                        },
                    ],
                    format: {},
                    widths: [],
                    dataset: {},
                };
            }
        );
    });

    it('Process complex table with thead, tbody and multiple rowSpan 0 cells', () => {
        runTest(
            '<table>' +
                '<thead><tr><td>Test</td><td>Test</td></tr><tr><td>Test</td><td>Test</td></tr></thead>' +
                '<tbody><tr><td rowspan=0>Test</td><td>Test</td></tr><tr><td>Test</td><td>Test</td></tr></tbody>' +
                '<tr><td rowspan=0>Test</td><td>Test</td></tr><tr><td>Test</td><td>Test</td></tr>' +
                '</table>',
            (div, __) => {
                return {
                    blockType: 'Table',
                    rows: [
                        {
                            height: 0,
                            format: {},
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: true,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                            ],
                        },
                        {
                            height: 0,
                            format: {},
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: true,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                            ],
                        },
                        {
                            height: 0,
                            format: {},
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: true,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                            ],
                        },
                        {
                            height: 0,
                            format: {},
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: true,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                            ],
                        },
                        {
                            height: 0,
                            format: {},
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: true,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                            ],
                        },
                        {
                            height: 0,
                            format: {},
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: true,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                            ],
                        },
                    ],
                    format: {},
                    widths: [],
                    dataset: {},
                };
            }
        );
    });

    it('Process large table with rowSpan 0 in middle and end columns', () => {
        runTest(
            '<table>' +
                '<thead><tr><td>H1</td><td>H2</td><td>H3</td><td>H4</td></tr></thead>' +
                '<tbody>' +
                '<tr><td>R1C1</td><td rowspan=0>R1C2-Middle</td><td>R1C3</td><td>R1C4</td></tr>' +
                '<tr><td>R2C1</td><td>R2C2</td><td>R2C3</td><td rowspan=0>R2C4-End</td></tr>' +
                '<tr><td>R3C1</td><td>R3C2</td><td>R3C3</td><td>R3C4</td></tr>' +
                '</tbody>' +
                '<tr><td rowspan=0>R4C1-Start</td><td>R4C2</td><td rowspan=0>R4C3-Middle2</td><td>R4C4</td></tr>' +
                '<tr><td>R5C1</td><td>R5C2</td><td>R5C3</td><td>R5C4</td></tr>' +
                '<tr><td>R6C1</td><td>R6C2</td><td>R6C3</td><td>R6C4</td></tr>' +
                '</table>',
            (div, __) => {
                return {
                    blockType: 'Table',
                    rows: [
                        {
                            height: 0,
                            format: {},
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: true,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: true,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                            ],
                        },
                        {
                            height: 0,
                            format: {},
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: true,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: true,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                            ],
                        },
                        {
                            height: 0,
                            format: {},
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: true,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: true,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                            ],
                        },
                        {
                            height: 0,
                            format: {},
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: true,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: true,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                            ],
                        },
                        {
                            height: 0,
                            format: {},
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: true,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: true,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                            ],
                        },
                        {
                            height: 0,
                            format: {},
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: true,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: true,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                            ],
                        },
                        {
                            height: 0,
                            format: {},
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: true,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: true,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                            ],
                        },
                    ],
                    format: {},
                    widths: [],
                    dataset: {},
                };
            }
        );
    });

    it('Process simple table with sequential rowSpan 0 cells testing column index adjustment', () => {
        runTest(
            '<table>' +
                '<tr><td rowspan=0>R1C1-Span</td><td>R1C2</td><td rowspan=0>R1C3-Span</td></tr>' +
                '<tr><td>R2C1</td><td>R2C2</td><td>R2C3</td></tr>' +
                '<tr><td>R3C1</td><td>R3C2</td><td>R3C3</td></tr>' +
                '</table>',
            div => {
                return {
                    blockType: 'Table',
                    rows: [
                        // First row with rowspan=0 cells in columns 0 and 2
                        {
                            format: {},
                            height: 0,
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blocks: [],
                                    format: {},
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blocks: [],
                                    format: {},
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blocks: [],
                                    format: {},
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    spanAbove: false,
                                    spanLeft: true,
                                    isHeader: false,
                                    blocks: [],
                                    format: {},
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    spanAbove: false,
                                    spanLeft: true,
                                    isHeader: false,
                                    blocks: [],
                                    format: {},
                                    dataset: {},
                                },
                            ],
                        },
                        // Second row - column 0 spans from above, column 3 spans from above (due to shift)
                        {
                            format: {},
                            height: 0,
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    spanAbove: true,
                                    spanLeft: false,
                                    isHeader: false,
                                    blocks: [],
                                    format: {},
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blocks: [],
                                    format: {},
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    spanAbove: true,
                                    spanLeft: false,
                                    isHeader: false,
                                    blocks: [],
                                    format: {},
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blocks: [],
                                    format: {},
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blocks: [],
                                    format: {},
                                    dataset: {},
                                },
                            ],
                        },
                        // Third row - same pattern as second row
                        {
                            format: {},
                            height: 0,
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    spanAbove: true,
                                    spanLeft: false,
                                    isHeader: false,
                                    blocks: [],
                                    format: {},
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blocks: [],
                                    format: {},
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    spanAbove: true,
                                    spanLeft: false,
                                    isHeader: false,
                                    blocks: [],
                                    format: {},
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blocks: [],
                                    format: {},
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blocks: [],
                                    format: {},
                                    dataset: {},
                                },
                            ],
                        },
                    ],
                    format: {},
                    widths: [],
                    dataset: {},
                };
            }
        );
    });
});
