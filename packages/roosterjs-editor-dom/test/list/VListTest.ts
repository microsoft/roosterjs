import * as DomTestHelper from '../DomTestHelper';
import fromHtml from '../../lib/utils/fromHtml';
import Position from '../../lib/selection/Position';
import VList from '../../lib/list/VList';
import VListItem from '../../lib/list/VListItem';
import { Indentation, ListType, PositionType } from 'roosterjs-editor-types';

describe('VList.ctor', () => {
    const testId = 'VList_ctor';
    const ListRoot = 'listRoot';

    afterEach(() => {
        DomTestHelper.removeElement(testId);
    });

    it('null input', () => {
        expect(() => new VList(null)).toThrow();
    });

    function runTest(sourceHtml: string, expected: { listTypes: ListType[]; outerHTML: string }[]) {
        DomTestHelper.createElementFromContent(testId, sourceHtml);
        const listRoot = document.getElementById(ListRoot) as HTMLOListElement | HTMLUListElement;
        const vList = new VList(listRoot);
        const items = (<any>vList).items as VListItem[];
        const itemsMap = items.map(item => ({
            listTypes: (<any>item).listTypes as ListType[],
            outerHTML: (<HTMLElement>item.getNode()).outerHTML,
        }));
        expect(itemsMap).toEqual(expected);
    }

    it('single item OL', () => {
        runTest(`<ol id="${ListRoot}"><li>test</li></ol>`, [
            { listTypes: [ListType.None, ListType.Ordered], outerHTML: '<li>test</li>' },
        ]);
    });

    it('OL including empty text node', () => {
        runTest(`<ol id="${ListRoot}">\n \n<li>line1</li> \n <li>line2</li>  </ol>`, [
            { listTypes: [ListType.None, ListType.Ordered], outerHTML: '<li>line1</li>' },
            {
                listTypes: [ListType.None, ListType.Ordered],
                outerHTML: '<li>line2</li>',
            },
        ]);
    });

    it('nested UL in OL', () => {
        runTest(`<ol id="${ListRoot}"><li>line1</li><ul><li>line2</li></ul></ol>`, [
            {
                listTypes: [ListType.None, ListType.Ordered],
                outerHTML: '<li>line1</li>',
            },
            {
                listTypes: [ListType.None, ListType.Ordered, ListType.Unordered],
                outerHTML: '<li>line2</li>',
            },
        ]);
    });

    it('orphan item that will be merged', () => {
        runTest(`<ol id="${ListRoot}"><li>line1</li><div>line2</div></ol>`, [
            {
                listTypes: [ListType.None, ListType.Ordered],
                outerHTML: '<li>line1<div>line2</div></li>',
            },
        ]);
    });

    it('multiple orphan items that will be merged', () => {
        runTest(`<ol id="${ListRoot}"><li>line1</li><div>line2</div><div>line3</div></ol>`, [
            {
                listTypes: [ListType.None, ListType.Ordered],
                outerHTML: '<li>line1<div>line2</div><div>line3</div></li>',
            },
        ]);
    });

    it('inline orphan item that will be merged', () => {
        runTest(`<ol id="${ListRoot}"><li>line1</li><span>line2</span></ol>`, [
            {
                listTypes: [ListType.None, ListType.Ordered],
                outerHTML: '<li>line1<div><span>line2</span></div></li>',
            },
        ]);
    });

    it('orphan items is in front of list', () => {
        runTest(`<ol id="${ListRoot}"><div>line1</div><li>line2</li><div>line3</div></ol>`, [
            {
                listTypes: [ListType.None, ListType.Ordered],
                outerHTML: '<li style="display:block"><div>line1</div></li>',
            },
            {
                listTypes: [ListType.None, ListType.Ordered],
                outerHTML: '<li>line2<div>line3</div></li>',
            },
        ]);
    });

    it('nested list contains orphan items', () => {
        runTest(
            `<ol id="${ListRoot}">` +
                '<li>line0</li>' +
                '<ul>' +
                '<div>line1</div>' +
                '<li>line2</li>' +
                '<div>line3</div>' +
                '<li>line4</li>' +
                '</ul></ol>',
            [
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: '<li>line0</li>',
                },
                {
                    listTypes: [ListType.None, ListType.Ordered, ListType.Unordered],
                    outerHTML: '<li style="display:block"><div>line1</div></li>',
                },
                {
                    listTypes: [ListType.None, ListType.Ordered, ListType.Unordered],
                    outerHTML: '<li>line2<div>line3</div></li>',
                },
                {
                    listTypes: [ListType.None, ListType.Ordered, ListType.Unordered],
                    outerHTML: '<li>line4</li>',
                },
            ]
        );
    });

    it('move nested li out', () => {
        runTest(`<ol id="${ListRoot}">` + '<li>line1<li>line2</li>line3</li>' + '</ol>', [
            {
                listTypes: [ListType.None, ListType.Ordered],
                outerHTML: '<li>line1</li>',
            },
            {
                listTypes: [ListType.None, ListType.Ordered],
                outerHTML: '<li>line2<div>line3</div></li>',
            },
        ]);
    });

    it('move nested li in orphan item out', () => {
        runTest(
            `<ol id="${ListRoot}">` +
                '<li>line1</li>' +
                '<div>line2<li>line3</li>line4</div>' +
                '</ol>',
            [
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: '<li>line1<div>line2</div></li>',
                },
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: '<li>line3<div>line4</div></li>',
                },
            ]
        );
    });

    it('move deeper nested li in orphan item out', () => {
        runTest(
            `<ol id="${ListRoot}">` +
                '<li>line1</li>' +
                '<div>line2<div>line3<li>line4<div>line5' +
                '<li>line6</li>' +
                'line7</div>line8</li>line9</div>line10</div>' +
                '</ol>',
            [
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: '<li>line1<div>line2<div>line3</div></div></li>',
                },
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: '<li>line4<div>line5</div></li>',
                },
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML:
                        '<li>line6<div>line7<div>line8line9</div><div>line10</div></div></li>',
                },
            ]
        );
    });

    it('disconnected nested list', () => {
        runTest(
            `<ol id="${ListRoot}">` +
                '<li>line1<div><ul><li>line2</li><li>line3</li></ul></div>line4</li>' +
                '<li>line5</li>' +
                '</ol>',
            [
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML:
                        '<li>line1<div><ul><li>line2</li><li>line3</li></ul></div>line4</li>',
                },
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: '<li>line5</li>',
                },
            ]
        );
    });
});

describe('VList.contains', () => {
    const testId = 'VList_contains';
    const ListRoot = 'listRoot';
    const TestNode = 'testNode';

    afterEach(() => {
        DomTestHelper.removeElement(testId);
    });

    function runTest(sourceHtml: string, expected: boolean) {
        DomTestHelper.createElementFromContent(testId, sourceHtml);
        const listRoot = document.getElementById(ListRoot) as HTMLOListElement | HTMLUListElement;
        const vList = new VList(listRoot);
        const node = document.getElementById(TestNode);
        const result = vList.contains(node);
        expect(result).toBe(expected);
    }

    it('null node', () => {
        runTest(`<ol id="${ListRoot}"></ol>`, false);
    });

    it('contains child node', () => {
        runTest(
            `<ol id="${ListRoot}"><li>line1</li><li><div id="${TestNode}">line2</div></li></ol>`,
            true
        );
    });

    it('contains li node', () => {
        runTest(`<ol id="${ListRoot}"><li>line1</li><li id="${TestNode}">line2</li></ol>`, true);
    });

    it('contains orphan node', () => {
        runTest(`<ol id="${ListRoot}"><div id="${TestNode}">line1</div><li>line2</li></ol>`, true);
    });

    it('Not contain a node ', () => {
        runTest(`<ol id="${ListRoot}"><li>line1</li></ol><div id="${TestNode}">line2</div>`, false);
    });
});

describe('VList.writeBack', () => {
    const testId = 'VList_writeBack';

    afterEach(() => {
        DomTestHelper.removeElement(testId);
    });

    function runTest(
        newItems: { html: string; listTypes: (ListType.Ordered | ListType.Unordered)[] }[],
        expectedHtml: string,
        originalRoot?: HTMLOListElement
    ) {
        const div = DomTestHelper.createElementFromContent(testId, '');
        div.appendChild(originalRoot || document.createElement('ol'));

        const list = originalRoot || (div.firstChild as HTMLOListElement);
        const vList = new VList(list);
        const items = (<any>vList).items as VListItem[];

        newItems.forEach(newItem =>
            items.push(new VListItem(fromHtml(newItem.html, document)[0], ...newItem.listTypes))
        );

        vList.writeBack();
        expect(div.innerHTML).toBe(expectedHtml);

        // Write again on the same VList should throw
        expect(() => vList.writeBack()).toThrow();
    }

    it('simple list, write back directly', () => {
        runTest(
            [
                {
                    html: '<li>test</li>',
                    listTypes: [ListType.Ordered],
                },
            ],
            '<ol><li>test</li></ol>'
        );
    });

    it('Write back with multiple items', () => {
        runTest(
            [
                {
                    html: '<li>item1</li>',
                    listTypes: [ListType.Ordered],
                },
                {
                    html: '<li>item2</li>',
                    listTypes: [ListType.Ordered],
                },
            ],
            '<ol><li>item1</li><li>item2</li></ol>'
        );
    });

    it('Write back with mixed types of items', () => {
        runTest(
            [
                {
                    html: '<li>item1</li>',
                    listTypes: [ListType.Ordered],
                },
                {
                    html: '<li>bullet</li>',
                    listTypes: [ListType.Unordered],
                },
                {
                    html: '<li>item2</li>',
                    listTypes: [ListType.Ordered],
                },
            ],
            '<ol><li>item1</li></ol><ul><li>bullet</li></ul><ol start="2"><li>item2</li></ol>'
        );
    });

    it('Write back with multiple items with different types', () => {
        runTest(
            [
                {
                    html: '<li>item1</li>',
                    listTypes: [ListType.Unordered],
                },
                {
                    html: '<li>item2</li>',
                    listTypes: [ListType.Ordered],
                },
            ],
            '<ul><li>item1</li></ul><ol><li>item2</li></ol>'
        );
    });

    it('Write back with multiple items with different depth', () => {
        runTest(
            [
                {
                    html: '<li>item1</li>',
                    listTypes: [ListType.Unordered, ListType.Ordered],
                },
                {
                    html: '<li>item2</li>',
                    listTypes: [ListType.Unordered],
                },
                {
                    html: '<li>item3</li>',
                    listTypes: [ListType.Ordered],
                },
            ],
            '<ul><ol style="list-style-type: lower-alpha;"><li>item1</li></ol><li>item2</li></ul><ol><li>item3</li></ol>'
        );
    });

    it('Write back with multiple items with orphan item', () => {
        runTest(
            [
                {
                    html: '<div>item1</div>',
                    listTypes: [ListType.Unordered],
                },
                {
                    html: '<li>item2</li>',
                    listTypes: [ListType.Unordered],
                },
                {
                    html: '<li>item3</li>',
                    listTypes: [ListType.Ordered],
                },
            ],
            '<ul><li style="display:block"><div>item1</div></li><li>item2</li></ul><ol><li>item3</li></ol>'
        );
    });

    it('Write back with multiple items with orphan item', () => {
        runTest(
            [
                {
                    html: '<div>item1</div>',
                    listTypes: [ListType.Unordered],
                },
                {
                    html: '<li>item2</li>',
                    listTypes: [ListType.Unordered],
                },
                {
                    html: '<li>item3</li>',
                    listTypes: [ListType.Ordered],
                },
            ],
            '<ul><li style="display:block"><div>item1</div></li><li>item2</li></ul><ol><li>item3</li></ol>'
        );
    });

    it('Write back with non-list item', () => {
        runTest(
            [
                {
                    html: '<li>item1</li>',
                    listTypes: [ListType.Unordered],
                },
                {
                    html: '<li>item2</li>',
                    listTypes: [],
                },
                {
                    html: '<li>item3</li>',
                    listTypes: [ListType.Ordered],
                },
            ],
            '<ul><li>item1</li></ul><div>item2</div><ol><li>item3</li></ol>'
        );
    });

    it('Write back with original list', () => {
        const ol = document.createElement('ol');
        ol.dataset.test = 'test';
        runTest(
            [
                {
                    html: '<li>item1</li>',
                    listTypes: [ListType.Ordered],
                },
            ],
            '<ol data-test="test"><li>item1</li></ol>',
            ol
        );
    });

    it('Write back with original list and start number', () => {
        const ol = document.createElement('ol');
        ol.start = 3;
        runTest(
            [
                {
                    html: '<li>item3</li>',
                    listTypes: [ListType.Ordered],
                },
                {
                    html: '<li>item3.1</li>',
                    listTypes: [ListType.Ordered, ListType.Ordered],
                },
                {
                    html: '<li>bullet</li>',
                    listTypes: [ListType.Unordered],
                },
                {
                    html: '<li>item4</li>',
                    listTypes: [ListType.Ordered],
                },
            ],
            '<ol start="3"><li>item3</li><ol style="list-style-type: lower-alpha;"><li>item3.1</li></ol></ol><ul><li>bullet</li></ul><ol start="4"><li>item4</li></ol>',
            ol
        );
    });

    it('Write back with original list and start number, start with non-list', () => {
        const ol = document.createElement('ol');
        ol.start = 3;
        runTest(
            [
                {
                    html: '<li>text</li>',
                    listTypes: [],
                },
                {
                    html: '<li>item3</li>',
                    listTypes: [ListType.Ordered],
                },
                {
                    html: '<li>item4</li>',
                    listTypes: [ListType.Ordered],
                },
                {
                    html: '<li>text</li>',
                    listTypes: [],
                },
                {
                    html: '<li>item5</li>',
                    listTypes: [ListType.Ordered],
                },
            ],
            '<div>text</div><ol start="3"><li>item3</li><li>item4</li></ol><div>text</div><ol start="5"><li>item5</li></ol>',
            ol
        );
    });
});

describe('VList.setIndentation', () => {
    const testId = 'VList_setIndentation';
    const ListRoot = 'listRoot';
    const FocusNode = 'focus';
    const FocusNode1 = 'focus1';
    const FocusNode2 = 'focus2';

    afterEach(() => {
        DomTestHelper.removeElement(testId);
    });

    function runTest(
        source: string,
        increaseExpected: { listTypes: ListType[]; outerHTML: string }[],
        decreaseExpected: { listTypes: ListType[]; outerHTML: string }[],
        callTimes: number = 1
    ) {
        [Indentation.Increase, Indentation.Decrease].forEach(indentation => {
            // Arrange
            DomTestHelper.createElementFromContent(testId, source);
            const list = document.getElementById(ListRoot) as HTMLOListElement;
            const focus = document.getElementById(FocusNode);
            const focus1 = document.getElementById(FocusNode1);
            const focus2 = document.getElementById(FocusNode2);

            if (!list) {
                throw new Error('No root node');
            }
            if (!focus && (!focus1 || !focus2)) {
                throw new Error('No focus node');
            }

            const vList = new VList(list);
            const start = new Position(focus || focus1, PositionType.Begin);
            const end = new Position(focus || focus2, PositionType.End);

            // Act
            for (let i = 0; i < callTimes; i++) {
                vList.setIndentation(start, end, indentation);
            }

            // Assert
            const items = (<any>vList).items as VListItem[];
            const itemsMap = items.map(item => ({
                listTypes: (<any>item).listTypes as ListType[],
                outerHTML: (<HTMLElement>item.getNode()).outerHTML,
            }));

            expect(itemsMap).toEqual(
                indentation == Indentation.Increase ? increaseExpected : decreaseExpected,
                indentation == Indentation.Increase ? 'Indent' : 'Outdent'
            );
            DomTestHelper.removeElement(testId);
        });
    }

    it('empty list', () => {
        runTest(`<ol id="${ListRoot}"></ol><div id="${FocusNode}"></div>`, [], []);
    });

    it('single item list', () => {
        runTest(
            `<ol id="${ListRoot}"><li id="${FocusNode}">test</li></ol>`,
            [
                {
                    listTypes: [ListType.None, ListType.Ordered, ListType.Ordered],
                    outerHTML: `<li id="${FocusNode}">test</li>`,
                },
            ],
            [
                {
                    listTypes: [ListType.None],
                    outerHTML: `<li id="${FocusNode}">test</li>`,
                },
            ]
        );
    });

    it('deep list', () => {
        runTest(
            `<ol id="${ListRoot}"><li id="${FocusNode1}">line1</li><ul><li id="${FocusNode2}">line2</li></ul></ol>`,
            [
                {
                    listTypes: [ListType.None, ListType.Ordered, ListType.Ordered],
                    outerHTML: `<li id="${FocusNode1}">line1</li>`,
                },
                {
                    listTypes: [
                        ListType.None,
                        ListType.Ordered,
                        ListType.Unordered,
                        ListType.Unordered,
                    ],
                    outerHTML: `<li id="${FocusNode2}">line2</li>`,
                },
            ],
            [
                {
                    listTypes: [ListType.None],
                    outerHTML: `<li id="${FocusNode1}">line1</li>`,
                },
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: `<li id="${FocusNode2}">line2</li>`,
                },
            ]
        );
    });

    it('partially selected list', () => {
        runTest(
            `<ol id="${ListRoot}">` +
                '<li>line1</li>' +
                `<li id="${FocusNode1}">line2</li>` +
                '<ul>' +
                `<li id="${FocusNode2}">line3</li>` +
                '<li>line4</li>' +
                '</ul>' +
                '</ol>',
            [
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: '<li>line1</li>',
                },
                {
                    listTypes: [ListType.None, ListType.Ordered, ListType.Ordered],
                    outerHTML: `<li id="${FocusNode1}">line2</li>`,
                },
                {
                    listTypes: [
                        ListType.None,
                        ListType.Ordered,
                        ListType.Unordered,
                        ListType.Unordered,
                    ],
                    outerHTML: `<li id="${FocusNode2}">line3</li>`,
                },
                {
                    listTypes: [ListType.None, ListType.Ordered, ListType.Unordered],
                    outerHTML: '<li>line4</li>',
                },
            ],
            [
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: '<li>line1</li>',
                },
                {
                    listTypes: [ListType.None],
                    outerHTML: `<li id="${FocusNode1}">line2</li>`,
                },
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: `<li id="${FocusNode2}">line3</li>`,
                },
                {
                    listTypes: [ListType.None, ListType.Ordered, ListType.Unordered],
                    outerHTML: '<li>line4</li>',
                },
            ]
        );
    });

    it('partially selected list, call twice', () => {
        runTest(
            `<ol id="${ListRoot}">` +
                '<li>line1</li>' +
                `<li id="${FocusNode1}">line2</li>` +
                '<ul>' +
                `<li id="${FocusNode2}">line3</li>` +
                '<li>line4</li>' +
                '</ul>' +
                '</ol>',
            [
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: '<li>line1</li>',
                },
                {
                    listTypes: [
                        ListType.None,
                        ListType.Ordered,
                        ListType.Ordered,
                        ListType.Ordered,
                    ],
                    outerHTML: `<li id="${FocusNode1}">line2</li>`,
                },
                {
                    listTypes: [
                        ListType.None,
                        ListType.Ordered,
                        ListType.Unordered,
                        ListType.Unordered,
                        ListType.Unordered,
                    ],
                    outerHTML: `<li id="${FocusNode2}">line3</li>`,
                },
                {
                    listTypes: [ListType.None, ListType.Ordered, ListType.Unordered],
                    outerHTML: '<li>line4</li>',
                },
            ],
            [
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: '<li>line1</li>',
                },
                {
                    listTypes: [ListType.None],
                    outerHTML: `<li id="${FocusNode1}">line2</li>`,
                },
                {
                    listTypes: [ListType.None],
                    outerHTML: `<li id="${FocusNode2}">line3</li>`,
                },
                {
                    listTypes: [ListType.None, ListType.Ordered, ListType.Unordered],
                    outerHTML: '<li>line4</li>',
                },
            ],
            2
        );
    });
});

describe('VList.changeListType', () => {
    const testId = 'VList_changeListType';
    const ListRoot = 'listRoot';
    const FocusNode = 'focus';
    const FocusNode1 = 'focus1';
    const FocusNode2 = 'focus2';

    afterEach(() => {
        DomTestHelper.removeElement(testId);
    });

    function runTest(
        source: string,
        noneExpected: { listTypes: ListType[]; outerHTML: string }[],
        olExpected: { listTypes: ListType[]; outerHTML: string }[],
        ulExpected: { listTypes: ListType[]; outerHTML: string }[]
    ) {
        [ListType.None, ListType.Ordered, ListType.Unordered].forEach(listType => {
            // Arrange
            DomTestHelper.createElementFromContent(testId, source);
            const list = document.getElementById(ListRoot) as HTMLOListElement;
            const focus = document.getElementById(FocusNode);
            const focus1 = document.getElementById(FocusNode1);
            const focus2 = document.getElementById(FocusNode2);

            if (!list) {
                throw new Error('No root node');
            }
            if (!focus && (!focus1 || !focus2)) {
                throw new Error('No focus node');
            }

            const vList = new VList(list);
            const start = new Position(focus || focus1, PositionType.Begin);
            const end = new Position(focus || focus2, PositionType.End);

            // Act
            vList.changeListType(start, end, listType);

            // Assert
            const items = (<any>vList).items as VListItem[];
            const itemsMap = items.map(item => ({
                listTypes: (<any>item).listTypes as ListType[],
                outerHTML: (<HTMLElement>item.getNode()).outerHTML,
            }));
            const expected =
                listType == ListType.None
                    ? noneExpected
                    : listType == ListType.Ordered
                    ? olExpected
                    : ulExpected;

            expect(itemsMap).toEqual(expected);
            DomTestHelper.removeElement(testId);
        });
    }

    it('empty list', () => {
        runTest(`<ol id="${ListRoot}"></ol><div id="${FocusNode}"></div>`, [], [], []);
    });

    it('single item list', () => {
        runTest(
            `<ol id="${ListRoot}"><li id="${FocusNode}">test</li></ol>`,
            [
                {
                    listTypes: [ListType.None],
                    outerHTML: `<li id="${FocusNode}">test</li>`,
                },
            ],
            [
                {
                    listTypes: [ListType.None],
                    outerHTML: `<li id="${FocusNode}">test</li>`,
                },
            ],
            [
                {
                    listTypes: [ListType.None, ListType.Unordered],
                    outerHTML: `<li id="${FocusNode}">test</li>`,
                },
            ]
        );
    });

    it('deep list', () => {
        runTest(
            `<ol id="${ListRoot}"><li id="${FocusNode1}">line1</li><ul><li id="${FocusNode2}">line2</li></ul></ol>`,
            [
                {
                    listTypes: [ListType.None],
                    outerHTML: `<li id="${FocusNode1}">line1</li>`,
                },
                {
                    listTypes: [ListType.None],
                    outerHTML: `<li id="${FocusNode2}">line2</li>`,
                },
            ],
            [
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: `<li id="${FocusNode1}">line1</li>`,
                },
                {
                    listTypes: [ListType.None, ListType.Ordered, ListType.Ordered],
                    outerHTML: `<li id="${FocusNode2}">line2</li>`,
                },
            ],
            [
                {
                    listTypes: [ListType.None, ListType.Unordered],
                    outerHTML: `<li id="${FocusNode1}">line1</li>`,
                },
                {
                    listTypes: [ListType.None, ListType.Ordered, ListType.Unordered],
                    outerHTML: `<li id="${FocusNode2}">line2</li>`,
                },
            ]
        );
    });

    it('partially selected list', () => {
        runTest(
            `<ol id="${ListRoot}">` +
                '<li>line1</li>' +
                `<li id="${FocusNode1}">line2</li>` +
                '<ul>' +
                `<li id="${FocusNode2}">line3</li>` +
                '<li>line4</li>' +
                '</ul>' +
                '</ol>',
            [
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: '<li>line1</li>',
                },
                {
                    listTypes: [ListType.None],
                    outerHTML: `<li id="${FocusNode1}">line2</li>`,
                },
                {
                    listTypes: [ListType.None],
                    outerHTML: `<li id="${FocusNode2}">line3</li>`,
                },
                {
                    listTypes: [ListType.None, ListType.Ordered, ListType.Unordered],
                    outerHTML: '<li>line4</li>',
                },
            ],
            [
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: '<li>line1</li>',
                },
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: `<li id="${FocusNode1}">line2</li>`,
                },
                {
                    listTypes: [ListType.None, ListType.Ordered, ListType.Ordered],
                    outerHTML: `<li id="${FocusNode2}">line3</li>`,
                },
                {
                    listTypes: [ListType.None, ListType.Ordered, ListType.Unordered],
                    outerHTML: '<li>line4</li>',
                },
            ],
            [
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: '<li>line1</li>',
                },
                {
                    listTypes: [ListType.None, ListType.Unordered],
                    outerHTML: `<li id="${FocusNode1}">line2</li>`,
                },
                {
                    listTypes: [ListType.None, ListType.Ordered, ListType.Unordered],
                    outerHTML: `<li id="${FocusNode2}">line3</li>`,
                },
                {
                    listTypes: [ListType.None, ListType.Ordered, ListType.Unordered],
                    outerHTML: '<li>line4</li>',
                },
            ]
        );
    });

    it('nested list with same type', () => {
        runTest(
            `<ol id="${ListRoot}">` +
                `<li id="${FocusNode1}">line1</li>` +
                '<ol>' +
                '<li>line2</li>' +
                '<ol>' +
                `<li id="${FocusNode2}">line3</li>` +
                '</ol>' +
                '</ol>' +
                '</ol>',
            [
                {
                    listTypes: [ListType.None],
                    outerHTML: `<li id="${FocusNode1}">line1</li>`,
                },
                {
                    listTypes: [ListType.None],
                    outerHTML: '<li>line2</li>',
                },
                {
                    listTypes: [ListType.None],
                    outerHTML: `<li id="${FocusNode2}">line3</li>`,
                },
            ],
            [
                {
                    listTypes: [ListType.None],
                    outerHTML: `<li id="${FocusNode1}">line1</li>`,
                },
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: '<li>line2</li>',
                },
                {
                    listTypes: [ListType.None, ListType.Ordered, ListType.Ordered],
                    outerHTML: `<li id="${FocusNode2}">line3</li>`,
                },
            ],
            [
                {
                    listTypes: [ListType.None, ListType.Unordered],
                    outerHTML: `<li id="${FocusNode1}">line1</li>`,
                },
                {
                    listTypes: [ListType.None, ListType.Ordered, ListType.Unordered],
                    outerHTML: '<li>line2</li>',
                },
                {
                    listTypes: [
                        ListType.None,
                        ListType.Ordered,
                        ListType.Ordered,
                        ListType.Unordered,
                    ],
                    outerHTML: `<li id="${FocusNode2}">line3</li>`,
                },
            ]
        );
    });
});

describe('VList.appendItem', () => {
    const testId = 'VList_appendItem';
    const ListRoot = 'listRoot';

    afterEach(() => {
        DomTestHelper.removeElement(testId);
    });

    function runTest(
        newNodeHtml: string,
        newNodeType: ListType,
        expected: { listTypes: ListType[]; outerHTML: string }[]
    ) {
        // Arrange
        DomTestHelper.createElementFromContent(testId, `<ol id="${ListRoot}"></ol>`);
        const list = document.getElementById(ListRoot) as HTMLOListElement;

        if (!list) {
            throw new Error('No root node');
        }

        const vList = new VList(list);
        const node = fromHtml(newNodeHtml, document)[0];

        // Act
        vList.appendItem(node, newNodeType);

        // Assert
        const items = (<any>vList).items as VListItem[];
        const itemsMap = items.map(item => ({
            listTypes: (<any>item).listTypes as ListType[],
            outerHTML: (<HTMLElement>item.getNode()).outerHTML,
        }));

        expect(itemsMap).toEqual(expected);
    }

    it('LI node + type none', () => {
        runTest('<li>test</li>', ListType.None, [
            {
                listTypes: [ListType.None],
                outerHTML: '<li>test</li>',
            },
        ]);
    });

    it('LI node + type OL', () => {
        runTest('<li>test</li>', ListType.Ordered, [
            {
                listTypes: [ListType.None, ListType.Ordered],
                outerHTML: '<li>test</li>',
            },
        ]);
    });

    it('LI node + type UL', () => {
        runTest('<li>test</li>', ListType.Unordered, [
            {
                listTypes: [ListType.None, ListType.Unordered],
                outerHTML: '<li>test</li>',
            },
        ]);
    });

    it('DIV node + type none', () => {
        runTest('<div>test</div>', ListType.None, [
            {
                listTypes: [ListType.None],
                outerHTML: '<li>test</li>',
            },
        ]);
    });

    it('DIV node + type OL', () => {
        runTest('<div>test</div>', ListType.Ordered, [
            {
                listTypes: [ListType.None, ListType.Ordered],
                outerHTML: '<li>test</li>',
            },
        ]);
    });

    it('DIV node + type UL', () => {
        runTest('<div>test</div>', ListType.Unordered, [
            {
                listTypes: [ListType.None, ListType.Unordered],
                outerHTML: '<li>test</li>',
            },
        ]);
    });
});

describe('VList.mergeVList', () => {
    const testId = 'VList_mergeVList';
    const ListRoot1 = 'listRoot1';
    const ListRoot2 = 'listRoot2';

    afterEach(() => {
        DomTestHelper.removeElement(testId);
    });

    function runTest(sourceHtml: string, expected: { listTypes: ListType[]; outerHTML: string }[]) {
        // Arrange
        DomTestHelper.createElementFromContent(testId, sourceHtml);
        const list1 = document.getElementById(ListRoot1) as HTMLOListElement;
        const list2 = document.getElementById(ListRoot2) as HTMLOListElement;

        if (!list1) {
            throw new Error('No root node');
        }

        const vList1 = new VList(list1);
        const vList2 = list2 && new VList(list2);

        // Act
        vList1.mergeVList(vList2);

        // Assert
        const items = (<any>vList1).items as VListItem[];
        const itemsMap = items.map(item => ({
            listTypes: (<any>item).listTypes as ListType[],
            outerHTML: (<HTMLElement>item.getNode()).outerHTML,
        }));

        expect(itemsMap).toEqual(expected);

        if (vList2) {
            expect((<any>vList2).items.length).toEqual(0);
        }
    }

    it('null list2', () => {
        runTest(`<ol id="${ListRoot1}"></ol>`, []);
    });

    it('Two empty lists', () => {
        runTest(`<ol id="${ListRoot1}"></ol><ol id="${ListRoot2}"></ol>`, []);
    });

    it('List 1 is empty', () => {
        runTest(`<ol id="${ListRoot1}"></ol><ol id="${ListRoot2}"><li>test</li></ol>`, [
            {
                listTypes: [ListType.None, ListType.Ordered],
                outerHTML: '<li>test</li>',
            },
        ]);
    });

    it('List 2 is empty', () => {
        runTest(`<ol id="${ListRoot1}"><li>test</li></ol><ol id="${ListRoot2}"></ol>`, [
            {
                listTypes: [ListType.None, ListType.Ordered],
                outerHTML: '<li>test</li>',
            },
        ]);
    });

    it('Both have items', () => {
        runTest(
            `<ol id="${ListRoot1}"><li>line1</li></ol><ol id="${ListRoot2}"><li>line2</li></ol>`,
            [
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: '<li>line1</li>',
                },
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: '<li>line2</li>',
                },
            ]
        );
    });

    it('List 2 has orphan item', () => {
        runTest(
            `<ol id="${ListRoot1}"><li>line1</li></ol>` +
                `<ol id="${ListRoot2}"><div>line2<li>line3</li>line4</div><li>line5</li></ol>`,
            [
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: '<li>line1</li>',
                },
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: '<li style="display:block"><div>line2</div></li>',
                },
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: '<li>line3<div>line4</div></li>',
                },
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: '<li>line5</li>',
                },
            ]
        );
    });

    it('List 2 has deep orphan item that cannot be merged', () => {
        runTest(
            `<ol id="${ListRoot1}"><li>line1</li></ol>` +
                `<ol id="${ListRoot2}"><ul><div>line2</div><li>line3</li></ul></ol>`,
            [
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: '<li>line1</li>',
                },
                {
                    listTypes: [ListType.None, ListType.Ordered, ListType.Unordered],
                    outerHTML: '<li style="display:block"><div>line2</div></li>',
                },
                {
                    listTypes: [ListType.None, ListType.Ordered, ListType.Unordered],
                    outerHTML: '<li>line3</li>',
                },
            ]
        );
    });

    it('List 2 has deep orphan item that can be merged', () => {
        runTest(
            `<ol id="${ListRoot1}"><ul><li>line1</li></ul></ol>` +
                `<ol id="${ListRoot2}"><ul><div>line2</div><li>line3</li></ul></ol>`,
            [
                {
                    listTypes: [ListType.None, ListType.Ordered, ListType.Unordered],
                    outerHTML: '<li>line1</li>',
                },
                {
                    listTypes: [ListType.None, ListType.Ordered, ListType.Unordered],
                    outerHTML: '<li style="display:block"><div>line2</div></li>',
                },
                {
                    listTypes: [ListType.None, ListType.Ordered, ListType.Unordered],
                    outerHTML: '<li>line3</li>',
                },
            ]
        );
    });
});
