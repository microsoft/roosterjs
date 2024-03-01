import { createSnapshotSelection } from '../../lib/utils/createSnapshotSelection';
import { DOMSelection, EditorCore } from 'roosterjs-content-model-types';

describe('createSnapshotSelection', () => {
    let div: HTMLDivElement;
    let core: EditorCore;
    let getDOMSelectionSpy: jasmine.Spy;

    beforeEach(() => {
        div = document.createElement('div');
        getDOMSelectionSpy = jasmine.createSpy('getDOMSelection');
        core = {
            physicalRoot: div,
            logicalRoot: div,
            api: {
                getDOMSelection: getDOMSelectionSpy,
            },
        } as any;
    });

    it('Image selection', () => {
        const image = document.createElement('img');
        const selection: DOMSelection = {
            type: 'image',
            image,
        };

        image.id = 'id1';

        getDOMSelectionSpy.and.returnValue(selection);

        const result = createSnapshotSelection(core);

        expect(result).toEqual({
            type: 'image',
            imageId: 'id1',
        });
    });

    it('Table selection', () => {
        const table = document.createElement('table');
        const selection: DOMSelection = {
            type: 'table',
            table,
            firstColumn: 1,
            firstRow: 2,
            lastColumn: 3,
            lastRow: 4,
        };

        table.id = 'id1';

        getDOMSelectionSpy.and.returnValue(selection);

        const result = createSnapshotSelection(core);

        expect(result).toEqual({
            type: 'table',
            tableId: 'id1',
            firstColumn: 1,
            firstRow: 2,
            lastColumn: 3,
            lastRow: 4,
        });
    });
});

describe('createSnapshotSelection - Range selection', () => {
    let div: HTMLDivElement;
    let core: EditorCore;
    let getDOMSelectionSpy: jasmine.Spy;

    beforeEach(() => {
        div = document.createElement('div');
        getDOMSelectionSpy = jasmine.createSpy('getDOMSelection');
        core = {
            physicalRoot: div,
            logicalRoot: div,
            api: {
                getDOMSelection: getDOMSelectionSpy,
            },
        } as any;
    });

    it('Null selection', () => {
        getDOMSelectionSpy.and.returnValue(null);

        const result = createSnapshotSelection(core);

        expect(result).toEqual({
            type: 'range',
            start: [],
            end: [],
            isReverted: false,
        });
    });

    it('Direct text node', () => {
        div.innerHTML = 'test';

        const range = div.ownerDocument.createRange();
        range.setStart(div.childNodes[0], 2);
        range.setEnd(div.childNodes[0], 4);

        getDOMSelectionSpy.and.returnValue({
            type: 'range',
            range: range,
            isReverted: false,
        });

        const result = createSnapshotSelection(core);

        expect(result).toEqual({
            type: 'range',
            start: [0, 2],
            end: [0, 4],
            isReverted: false,
        });
    });

    it('Text node under element', () => {
        div.innerHTML = '<div>test</div>';

        const range = div.ownerDocument.createRange();
        range.setStart(div.childNodes[0].firstChild!, 2);
        range.setEnd(div.childNodes[0].firstChild!, 4);

        getDOMSelectionSpy.and.returnValue({
            type: 'range',
            range: range,
            isReverted: false,
        });

        const result = createSnapshotSelection(core);

        expect(result).toEqual({
            type: 'range',
            start: [0, 0, 2],
            end: [0, 0, 4],
            isReverted: false,
        });
    });

    it('Element node', () => {
        div.innerHTML = '<div><span>test</span></div><div><br></div>';

        const range = div.ownerDocument.createRange();
        range.setStart(div.childNodes[0].childNodes[0], 1);
        range.setEnd(div.childNodes[1].childNodes[0], 0);

        getDOMSelectionSpy.and.returnValue({
            type: 'range',
            range: range,
            isReverted: false,
        });

        const result = createSnapshotSelection(core);

        expect(result).toEqual({
            type: 'range',
            start: [0, 0, 1],
            end: [1, 0, 0],
            isReverted: false,
        });
    });

    it('Splitted text node', () => {
        div.appendChild(document.createTextNode('test1'));
        div.appendChild(document.createTextNode('test2'));
        div.appendChild(document.createTextNode('test3'));

        const range = div.ownerDocument.createRange();

        range.setStart(div.childNodes[1], 2);
        range.setEnd(div.childNodes[2], 2);

        getDOMSelectionSpy.and.returnValue({
            type: 'range',
            range: range,
            isReverted: false,
        });

        const result = createSnapshotSelection(core);

        expect(result).toEqual({
            type: 'range',
            start: [0, 7],
            end: [0, 12],
            isReverted: false,
        });
    });

    it('Splitted text node in deeper element', () => {
        const span = document.createElement('span');

        div.appendChild(document.createTextNode('test1'));
        div.appendChild(document.createTextNode('test2'));
        div.appendChild(span);

        span.appendChild(document.createTextNode('test3'));
        span.appendChild(document.createTextNode('test4'));

        div.appendChild(document.createTextNode('test5'));
        div.appendChild(document.createTextNode('test6'));

        const range = div.ownerDocument.createRange();

        range.setStart(div.childNodes[2].childNodes[1], 2);
        range.setEnd(div.childNodes[4], 2);

        getDOMSelectionSpy.and.returnValue({
            type: 'range',
            range: range,
            isReverted: false,
        });

        const result = createSnapshotSelection(core);

        expect(result).toEqual({
            type: 'range',
            start: [1, 0, 7],
            end: [2, 7],
            isReverted: false,
        });
    });
});

describe('createSnapshotSelection - Normalize Table', () => {
    const TABLE_ID1 = 't1';
    const TABLE_ID2 = 't2';
    let div: HTMLDivElement;
    let core: EditorCore;
    let getDOMSelectionSpy: jasmine.Spy;
    let setDOMSelectionSpy: jasmine.Spy;

    beforeEach(() => {
        div = document.createElement('div');
        getDOMSelectionSpy = jasmine.createSpy('getDOMSelection');
        setDOMSelectionSpy = jasmine.createSpy('setDOMSelection');
        core = {
            physicalRoot: div,
            logicalRoot: div,
            api: {
                getDOMSelection: getDOMSelectionSpy,
                setDOMSelection: setDOMSelectionSpy,
            },
        } as any;
    });

    function runTest(
        input: CreateElementData,
        output: string,
        startPath: number[],
        endPath: number[],
        setDOMSelection: boolean
    ) {
        div.appendChild(createElement(input));

        const node1 = div.querySelector('#' + TABLE_ID1);
        const node2 = div.querySelector('#' + TABLE_ID2) || node1;
        const mockedRange = {
            startContainer: node1,
            startOffset: 0,
            endContainer: node2,
            endOffset: 1,
        } as any;

        getDOMSelectionSpy.and.returnValue({
            type: 'range',
            range: mockedRange,
        });

        const result = createSnapshotSelection(core);

        expect(result).toEqual({
            type: 'range',
            start: startPath,
            end: endPath,
            isReverted: false,
        });
        expect(div.innerHTML).toBe(output);

        if (setDOMSelection) {
            expect(setDOMSelectionSpy).toHaveBeenCalledTimes(1);

            const selection = setDOMSelectionSpy.calls.argsFor(0)[1];

            expect(selection.type).toBe('range');
            expect(selection.range.startContainer).toBe(node1);
            expect(selection.range.endContainer).toBe(node2);
            expect(selection.range.startOffset).toBe(0);
            expect(selection.range.endOffset).toBe(1);
        } else {
            expect(setDOMSelectionSpy).not.toHaveBeenCalled();
        }
    }

    function createTd(text: string, id?: string, tag: string = 'td'): CreateElementData {
        return {
            tag: tag,
            id: id,
            children: [text],
        };
    }

    function createTr(...tds: CreateElementData[]): CreateElementData {
        return {
            tag: 'tr',
            children: [...tds],
        };
    }

    function createTableSection(tag: string, ...trs: CreateElementData[]): CreateElementData {
        return {
            tag: tag,
            children: [...trs],
        };
    }

    function createTable(...children: CreateElementData[]): CreateElementData {
        return {
            tag: 'table',
            children: [...children],
        };
    }

    function createColGroup(): CreateElementData {
        return {
            tag: 'colgroup',
            children: [
                {
                    tag: 'col',
                },
                {
                    tag: 'col',
                },
            ],
        };
    }

    it('Table already has THEAD/TBODY/TFOOT', () => {
        const input = createTable(
            createTableSection('thead', createTr(createTd('test1'))),
            createTableSection(
                'tbody',
                createTr(createTd('test2', TABLE_ID1)),
                createTr(createTd('test3'))
            ),
            createTableSection('tfoot', createTr(createTd('test4')))
        );
        runTest(
            input,
            '<table><thead><tr><td>test1</td></tr></thead><tbody><tr><td id="t1">test2</td></tr><tr><td>test3</td></tr></tbody><tfoot><tr><td>test4</td></tr></tfoot></table>',
            [0, 1, 0, 0, 0],
            [0, 1, 0, 0, 1],
            false
        );
    });

    it('Table only has TR', () => {
        const input = createTable(
            createTr(createTd('test1')),
            createTr(createTd('test2', TABLE_ID1))
        );
        runTest(
            input,
            '<table><tbody><tr><td>test1</td></tr><tr><td id="t1">test2</td></tr></tbody></table>',
            [0, 0, 1, 0, 0],
            [0, 0, 1, 0, 1],
            true
        );
    });

    it('Table has TR and TBODY 1', () => {
        runTest(
            createTable(
                createTr(createTd('test1')),
                createTableSection('tbody', createTr(createTd('test2', TABLE_ID1)))
            ),
            '<table><tbody><tr><td>test1</td></tr><tr><td id="t1">test2</td></tr></tbody></table>',
            [0, 0, 1, 0, 0],
            [0, 0, 1, 0, 1],
            true
        );
    });

    it('Table has TR and TBODY 2', () => {
        runTest(
            createTable(
                createTableSection('tbody', createTr(createTd('test1'))),
                createTr(createTd('test2', TABLE_ID1))
            ),
            '<table><tbody><tr><td>test1</td></tr><tr><td id="t1">test2</td></tr></tbody></table>',
            [0, 0, 1, 0, 0],
            [0, 0, 1, 0, 1],
            true
        );
    });

    it('Table has TR and TBODY and TR', () => {
        runTest(
            createTable(
                createTr(createTd('test1')),
                createTableSection('tbody', createTr(createTd('test2', TABLE_ID1))),
                createTr(createTd('test3', TABLE_ID2))
            ),
            '<table><tbody><tr><td>test1</td></tr><tr><td id="t1">test2</td></tr><tr><td id="t2">test3</td></tr></tbody></table>',
            [0, 0, 1, 0, 0],
            [0, 0, 2, 0, 1],
            true
        );
    });

    it('Table has THEAD and TR and TFOOT', () => {
        runTest(
            createTable(
                createTableSection('thead', createTr(createTd('test1'))),
                createTr(createTd('test2', TABLE_ID1)),
                createTr(createTd('test3', TABLE_ID2)),
                createTableSection('tfoot', createTr(createTd('test4')))
            ),
            '<table><thead><tr><td>test1</td></tr></thead><tbody><tr><td id="t1">test2</td></tr><tr><td id="t2">test3</td></tr></tbody><tfoot><tr><td>test4</td></tr></tfoot></table>',
            [0, 1, 0, 0, 0],
            [0, 1, 1, 0, 1],
            true
        );
    });

    it('Table has THEAD and TR and TBODY and TR and TFOOT', () => {
        runTest(
            createTable(
                createTableSection('thead', createTr(createTd('test1'))),
                createTr(createTd('test2', TABLE_ID1)),
                createTableSection('tbody', createTr(createTd('test3'))),
                createTr(createTd('test4', TABLE_ID2)),
                createTableSection('tfoot', createTr(createTd('test5')))
            ),
            '<table>' +
                '<thead><tr><td>test1</td></tr></thead>' +
                '<tbody><tr><td id="t1">test2</td></tr><tr><td>test3</td></tr><tr><td id="t2">test4</td></tr></tbody>' +
                '<tfoot><tr><td>test5</td></tr></tfoot>' +
                '</table>',
            [0, 1, 0, 0, 0],
            [0, 1, 2, 0, 1],
            true
        );
    });

    it('Table has THEAD and TBODY and TR and TBODY and TFOOT', () => {
        runTest(
            createTable(
                createTableSection('thead', createTr(createTd('test1'))),
                createTableSection('tbody', createTr(createTd('test2'))),
                createTr(createTd('test3', TABLE_ID1)),
                createTableSection('tbody', createTr(createTd('test4'))),
                createTableSection('tfoot', createTr(createTd('test5')))
            ),
            '<table>' +
                '<thead><tr><td>test1</td></tr></thead>' +
                '<tbody><tr><td>test2</td></tr><tr><td id="t1">test3</td></tr><tr><td>test4</td></tr></tbody>' +
                '<tfoot><tr><td>test5</td></tr></tfoot>' +
                '</table>',
            [0, 1, 1, 0, 0],
            [0, 1, 1, 0, 1],
            true
        );
    });

    it('Normalize table with THEAD With colgroup, Tbody, Tfoot', () => {
        runTest(
            createTable(
                createTableSection('thead', createColGroup(), createTr(createTd('test1'))),
                createTableSection('tbody', createTr(createTd('test2'))),
                createTr(createTd('test3', TABLE_ID1)),
                createTableSection('tbody', createTr(createTd('test4'))),
                createTableSection('tfoot', createTr(createTd('test5')))
            ),
            '<table>' +
                '<thead><colgroup><col><col></colgroup><tr><td>test1</td></tr></thead>' +
                '<tbody><tr><td>test2</td></tr><tr><td id="t1">test3</td></tr><tr><td>test4</td></tr></tbody>' +
                '<tfoot><tr><td>test5</td></tr></tfoot>' +
                '</table>',
            [0, 1, 1, 0, 0],
            [0, 1, 1, 0, 1],
            true
        );
    });

    it('Table already has THEAD With colgroup/TBODY/TFOOT', () => {
        runTest(
            createTable(
                createTableSection('thead', createTr(createTd('test1')), createColGroup()),
                createTableSection(
                    'tbody',
                    createTr(createTd('test2')),
                    createTr(createTd('test3'))
                ),
                createTableSection('tfoot', createTr(createTd('test4', TABLE_ID1)))
            ),
            '<table>' +
                '<thead><tr><td>test1</td></tr><colgroup><col><col></colgroup></thead>' +
                '<tbody><tr><td>test2</td></tr><tr><td>test3</td></tr></tbody>' +
                '<tfoot><tr><td id="t1">test4</td></tr></tfoot></table>',
            [0, 2, 0, 0, 0],
            [0, 2, 0, 0, 1],
            false
        );
    });

    it('Table has THEAD With colgroup and TR and TFOOT', () => {
        runTest(
            createTable(
                createTableSection('thead', createTr(createTd('test1')), createColGroup()),
                createTr(createTd('test2')),
                createTr(createTd('test3', TABLE_ID1)),
                createTableSection('tfoot', createTr(createTd('test4')))
            ),
            '<table>' +
                '<thead><tr><td>test1</td></tr><colgroup><col><col></colgroup></thead>' +
                '<tbody><tr><td>test2</td></tr><tr><td id="t1">test3</td></tr></tbody>' +
                '<tfoot><tr><td>test4</td></tr></tfoot></table>',
            [0, 1, 1, 0, 0],
            [0, 1, 1, 0, 1],
            true
        );
    });

    it('Table has THEAD With colgroup and TR and TBODY and TR and TFOOT', () => {
        runTest(
            createTable(
                createTableSection('thead', createTr(createTd('test1')), createColGroup()),
                createTr(createTd('test2', TABLE_ID1)),
                createTableSection('tbody', createTr(createTd('test3'))),
                createTr(createTd('test4')),
                createTableSection('tfoot', createTr(createTd('test5')))
            ),
            '<table>' +
                '<thead><tr><td>test1</td></tr><colgroup><col><col></colgroup></thead>' +
                '<tbody><tr><td id="t1">test2</td></tr><tr><td>test3</td></tr><tr><td>test4</td></tr></tbody>' +
                '<tfoot><tr><td>test5</td></tr></tfoot>' +
                '</table>',
            [0, 1, 0, 0, 0],
            [0, 1, 0, 0, 1],
            true
        );
    });

    it('Table has THEAD With colgroup and TR and TBODY and TR and TFOOT 2', () => {
        runTest(
            createTable(
                createTableSection('thead', createTr(createTd('test1'))),
                createColGroup(),
                createTr(createTd('test2', TABLE_ID1)),
                createTableSection('tbody', createTr(createTd('test3'))),
                createTr(createTd('test4')),
                createTableSection('tfoot', createTr(createTd('test5')))
            ),
            '<table>' +
                '<thead><tr><td>test1</td></tr><colgroup><col><col></colgroup></thead>' +
                '<tbody><tr><td id="t1">test2</td></tr><tr><td>test3</td></tr><tr><td>test4</td></tr></tbody>' +
                '<tfoot><tr><td>test5</td></tr></tfoot>' +
                '</table>',
            [0, 1, 0, 0, 0],
            [0, 1, 0, 0, 1],
            true
        );
    });

    it('Table has THEAD With colgroup and TBODY and TR and TBODY and TFOOT', () => {
        runTest(
            createTable(
                createTableSection('thead', createTr(createTd('test1')), createColGroup()),
                createTableSection('tbody', createTr(createTd('test2'))),
                createTr(createTd('test3')),
                createTableSection('tbody', createTr(createTd('test4'))),
                createTableSection('tfoot', createTr(createTd('test5', TABLE_ID1)))
            ),
            '<table>' +
                '<thead><tr><td>test1</td></tr><colgroup><col><col></colgroup></thead>' +
                '<tbody><tr><td>test2</td></tr><tr><td>test3</td></tr><tr><td>test4</td></tr></tbody>' +
                '<tfoot><tr><td id="t1">test5</td></tr></tfoot>' +
                '</table>',
            [0, 2, 0, 0, 0],
            [0, 2, 0, 0, 1],
            true
        );
    });

    it('Table has TR and TBODY and a orphaned colgroup 1', () => {
        runTest(
            createTable(
                createColGroup(),
                createTr(createTd('test1', TABLE_ID1)),
                createColGroup(),
                createTableSection('tbody', createTr(createTd('test2'))),
                createColGroup()
            ),
            '<table>' +
                '<colgroup><col><col></colgroup>' +
                '<tbody><tr><td id="t1">test1</td></tr></tbody><colgroup><col><col></colgroup><tbody>' +
                '<tr><td>test2</td></tr></tbody><colgroup><col><col></colgroup></table>',
            [0, 1, 0, 0, 0],
            [0, 1, 0, 0, 1],
            true
        );
    });

    it('Table has TR and TBODY and a orphaned colgroup 2', () => {
        runTest(
            createTable(
                createTableSection('tbody', createTr(createTd('test1', TABLE_ID1))),
                createTr(createTd('test2')),
                createColGroup()
            ),
            '<table>' +
                '<tbody><tr><td id="t1">test1</td></tr><tr><td>test2</td></tr></tbody>' +
                '<colgroup><col><col></colgroup></table>',
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1],
            true
        );
    });

    it('Nested table', () => {
        runTest(
            createTable(
                createTr({
                    tag: 'td',
                    children: [createTable(createTr(createTd('test1', TABLE_ID1)))],
                })
            ),
            '<table><tbody><tr><td><table><tbody><tr><td id="t1">test1</td></tr></tbody></table></td></tr></tbody></table>',
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 1],
            true
        );
    });
});

interface CreateElementData {
    tag: string;
    id?: string;
    children?: (CreateElementData | string)[];
}

function createElement(elementData: CreateElementData): Element {
    const { tag, id, children } = elementData;
    const result = document.createElement(tag);

    if (id) {
        result.id = id;
    }

    if (children) {
        children.forEach(child => {
            result.appendChild(
                typeof child == 'string' ? document.createTextNode(child) : createElement(child)
            );
        });
    }

    return result;
}
