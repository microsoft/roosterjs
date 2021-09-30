import * as DomTestHelper from '../DomTestHelper';
import createRange from '../../lib/selection/createRange';
import createVListFromRegion from '../../lib/list/createVListFromRegion';
import getRegionsFromRange from '../../lib/region/getRegionsFromRange';
import VListItem from '../../lib/list/VListItem';
import { ListType, RegionType } from 'roosterjs-editor-types';

describe('createVListFromRegion from selection, no sibling list', () => {
    it('null inputs', () => {
        expect(createVListFromRegion(null)).toBeNull();
    });

    const testId = 'createVListFromRegion';
    const FocusNode = 'focus';
    const FocusNode1 = 'focus1';
    const FocusNode2 = 'focus2';

    afterEach(() => {
        DomTestHelper.removeElement(testId);
    });

    function runTest(sourceHtml: string, expected: { listTypes: ListType[]; outerHTML: string }[]) {
        // Arrange
        const root = DomTestHelper.createElementFromContent(testId, sourceHtml);
        const focusNode = document.getElementById(FocusNode);
        const focusNode1 = document.getElementById(FocusNode1);
        const focusNode2 = document.getElementById(FocusNode2);

        if (!focusNode && (!focusNode1 || !focusNode2)) {
            throw new Error('must specify focus node');
        }

        const regions = getRegionsFromRange(
            root,
            createRange(focusNode || focusNode1, focusNode || focusNode2),
            RegionType.Table
        );

        // Act
        const vList = createVListFromRegion(regions[0]);

        // Assert
        if (expected === null) {
            expect(vList).toBeNull();
        } else {
            const items = (<any>vList).items as VListItem[];
            const itemsMap = items.map(item => ({
                listTypes: (<any>item).listTypes as ListType[],
                outerHTML: (<HTMLElement>item.getNode()).outerHTML,
            }));

            expect(itemsMap).toEqual(expected);
        }
    }

    it('empty DIV', () => {
        runTest(`<div id="${FocusNode}"></div>`, [
            {
                listTypes: [ListType.None],
                outerHTML: '<li><br></li>',
            },
        ]);
    });

    it('non-list', () => {
        runTest(`<div id="${FocusNode}"><br></div>`, [
            {
                listTypes: [ListType.None],
                outerHTML: '<li><br></li>',
            },
        ]);
    });

    it('Single list, no item', () => {
        runTest(`<ol id="${FocusNode}"></ol>`, []);
    });

    it('Single list with items', () => {
        runTest(`<ol id="${FocusNode}"><li>line1</li></ol>`, [
            {
                listTypes: [ListType.None, ListType.Ordered],
                outerHTML: '<li>line1</li>',
            },
        ]);
    });

    it('Single list with items, select inside', () => {
        runTest(`<ol><li><div id="${FocusNode}">line1</div></li></ol>`, [
            {
                listTypes: [ListType.None, ListType.Ordered],
                outerHTML: `<li><div id="${FocusNode}">line1</div></li>`,
            },
        ]);
    });

    it('list and non-list co-exist, select inside, list first', () => {
        runTest(
            `<div>line1</div><ol><li><div id="${FocusNode1}">line2</div></li></ol>` +
                `<div id="${FocusNode2}">line3</div><div>line4</div>`,
            [
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: `<li><div id="${FocusNode1}">line2</div></li>`,
                },
                {
                    listTypes: [ListType.None],
                    outerHTML: `<li id="${FocusNode2}">line3</li>`,
                },
            ]
        );
    });

    it('list and non-list co-exist, select inside, non-list first', () => {
        runTest(
            `<div>line1</div><div id="${FocusNode1}">line2</div>` +
                `<ol><li><div id="${FocusNode2}">line3</div></li></ol><div>line4</div>`,
            [
                {
                    listTypes: [ListType.None],
                    outerHTML: '<li>line2</li>',
                },
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: `<li><div id="${FocusNode2}">line3</div></li>`,
                },
            ]
        );
    });

    it('list and non-list co-exist, select inside, list|non-list|list', () => {
        runTest(
            `<div>line1</div><ol><li><div id="${FocusNode1}">line2</div></li></ol>` +
                '<div>line3</div>' +
                `<ol><li><div id="${FocusNode2}">line4</div></li></ol><div>line5</div>`,
            [
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: `<li><div id="${FocusNode1}">line2</div></li>`,
                },
                {
                    listTypes: [ListType.None],
                    outerHTML: '<li>line3</li>',
                },
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: `<li><div id="${FocusNode2}">line4</div></li>`,
                },
            ]
        );
    });

    it('non-list contains "StartEndBlockElement"', () => {
        runTest(
            `<div>line1</div><div id="${FocusNode1}">line2<br><span>line3<br><span id="${FocusNode2}">line4</span></span></div>`,
            [
                {
                    listTypes: [ListType.None],
                    outerHTML: '<li><span>line2<br></span></li>',
                },
                {
                    listTypes: [ListType.None],
                    outerHTML: '<li><span>line3<br></span></li>',
                },
                {
                    listTypes: [ListType.None],
                    outerHTML: `<li><span><span id="${FocusNode2}">line4</span></span></li>`,
                },
            ]
        );
    });

    it('non-list contains empty nodes', () => {
        runTest(
            `<div>line1</div>\n\n<div id="${FocusNode1}">line2<br>  \n  <span>line3<br><div></div>\n<span id="${FocusNode2}">line4</span></span></div>`,
            [
                {
                    listTypes: [ListType.None],
                    outerHTML: '<li><span>line2<br></span></li>',
                },
                {
                    listTypes: [ListType.None],
                    outerHTML: '<li>  \n  <span>line3<br></span></li>',
                },
                {
                    listTypes: [ListType.None],
                    outerHTML: `<li><span>\n<span id="${FocusNode2}">line4</span></span></li>`,
                },
            ]
        );
    });

    it('selection is in middle of list', () => {
        runTest(`<ol><li>line1</li><ul><li id="${FocusNode}">line2</li></ul><li>line3</li></ol>`, [
            {
                listTypes: [ListType.None, ListType.Ordered],
                outerHTML: '<li>line1</li>',
            },
            {
                listTypes: [ListType.None, ListType.Ordered, ListType.Unordered],
                outerHTML: `<li id="${FocusNode}">line2</li>`,
            },
            {
                listTypes: [ListType.None, ListType.Ordered],
                outerHTML: '<li>line3</li>',
            },
        ]);
    });

    it('selection is in a disconnected nest list', () => {
        runTest(
            `<ol><li>line1</li><li><ul><li id="${FocusNode}">line2</li></ul></li><li>line3</li></ol>`,
            [
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: '<li>line1</li>',
                },
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: `<li><ul><li id="${FocusNode}">line2</li></ul></li>`,
                },
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: '<li>line3</li>',
                },
            ]
        );
    });
});

describe('createVListFromRegion from selection, with sibling list', () => {
    const testId = 'createVListFromRegion';
    const FocusNode = 'focus';
    const FocusNode1 = 'focus1';
    const FocusNode2 = 'focus2';

    afterEach(() => {
        DomTestHelper.removeElement(testId);
    });

    function runTest(
        sourceHtml: string,
        expected: { listTypes: ListType[]; outerHTML: string }[],
        regionIndex: number = 0
    ) {
        // Arrange
        const root = DomTestHelper.createElementFromContent(testId, sourceHtml);
        const focusNode = document.getElementById(FocusNode);
        const focusNode1 = document.getElementById(FocusNode1);
        const focusNode2 = document.getElementById(FocusNode2);

        if (!focusNode && (!focusNode1 || !focusNode2)) {
            throw new Error('must specify focus node');
        }

        const regions = getRegionsFromRange(
            root,
            createRange(focusNode || focusNode1, focusNode || focusNode2),
            RegionType.Table
        );

        // Act
        const vList = createVListFromRegion(regions[regionIndex], true /*includingSiblingLists*/);

        // Assert
        if (expected === null) {
            expect(vList).toBeNull();
        } else {
            const items = (<any>vList).items as VListItem[];
            const itemsMap = items.map(item => ({
                listTypes: (<any>item).listTypes as ListType[],
                outerHTML: (<HTMLElement>item.getNode()).outerHTML,
            }));

            expect(itemsMap).toEqual(expected);
        }
    }

    it('no sibling nodes', () => {
        runTest(`<ol><li>line1</li><li id="${FocusNode}">line2</li><li>line3</li></ol>`, [
            {
                listTypes: [ListType.None, ListType.Ordered],
                outerHTML: '<li>line1</li>',
            },
            {
                listTypes: [ListType.None, ListType.Ordered],
                outerHTML: `<li id="${FocusNode}">line2</li>`,
            },
            {
                listTypes: [ListType.None, ListType.Ordered],
                outerHTML: '<li>line3</li>',
            },
        ]);
    });

    it('has sibling nodes, no sibling list', () => {
        runTest(
            `<div>previous sibling</div><ol><li>line1</li><li id="${FocusNode}">line2</li><li>line3</li></ol><div>next sibling</div>`,
            [
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: '<li>line1</li>',
                },
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: `<li id="${FocusNode}">line2</li>`,
                },
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: '<li>line3</li>',
                },
            ]
        );
    });

    it('has sibling nodes, has previous sibling list', () => {
        runTest(
            `<ul><li>previous sibling</li></ul><ol><li>line1</li><li id="${FocusNode}">line2</li><li>line3</li></ol><div>next sibling</div>`,
            [
                {
                    listTypes: [ListType.None, ListType.Unordered],
                    outerHTML: '<li>previous sibling</li>',
                },
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: '<li>line1</li>',
                },
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: `<li id="${FocusNode}">line2</li>`,
                },
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: '<li>line3</li>',
                },
            ]
        );
    });

    it('has sibling nodes, has previous sibling list, but current list do not start frm 1', () => {
        runTest(
            `<ul><li>previous sibling</li></ul><ol start="2"><li>line1</li><li id="${FocusNode}">line2</li><li>line3</li></ol><div>next sibling</div>`,
            [
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: '<li>line1</li>',
                },
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: `<li id="${FocusNode}">line2</li>`,
                },
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: '<li>line3</li>',
                },
            ]
        );
    });

    it('has sibling nodes, has next sibling list', () => {
        runTest(
            `<div>previous sibling</div><ol><li>line1</li><li id="${FocusNode}">line2</li><li>line3</li></ol><ul><li>next sibling</li></ul>`,
            [
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: '<li>line1</li>',
                },
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: `<li id="${FocusNode}">line2</li>`,
                },
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: '<li>line3</li>',
                },
                {
                    listTypes: [ListType.None, ListType.Unordered],
                    outerHTML: '<li>next sibling</li>',
                },
            ]
        );
    });

    it('has sibling nodes, has next sibling list, but current list do not start frm 1', () => {
        runTest(
            `<div>previous sibling</div><ol start="2"><li>line1</li><li id="${FocusNode}">line2</li><li>line3</li></ol><ul><li>next sibling</li></ul>`,
            [
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: '<li>line1</li>',
                },
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: `<li id="${FocusNode}">line2</li>`,
                },
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: '<li>line3</li>',
                },
            ]
        );
    });

    it('has sibling list, has orphan items to merge', () => {
        runTest(
            '<ol><li>previous sibling</li></ol>' +
                `<ol><div>line1</div><li id="${FocusNode}">line2</li><li>line3</li></ol>` +
                '<ol><div>next sibling</div></ol>',
            [
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: '<li>previous sibling</li>',
                },
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: '<li style="display:block"><div>line1</div></li>',
                },
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: `<li id="${FocusNode}">line2</li>`,
                },
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: '<li>line3</li>',
                },
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: '<li style="display:block"><div>next sibling</div></li>',
                },
            ]
        );
    });

    it('has sibling list, has empty div between lists', () => {
        runTest(
            '<ol><li>line1</li></ol><div></div>\n\n<div></div>' +
                `<ol><li id="${FocusNode}">line2</li><li>line3</li></ol>`,
            [
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: '<li>line1</li>',
                },
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: `<li id="${FocusNode}">line2</li>`,
                },
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: '<li>line3</li>',
                },
            ]
        );
    });

    it('selection cross multiple regions', () => {
        runTest(
            `<table><tr><td><ol><li id="${FocusNode1}">test</li></ol></td></tr></table>` +
                '<ol><li>line1</li><li>line2</li></ol>' +
                `<table><tr><td><ol><li id="${FocusNode2}">test</li></ol></td></tr></table>`,
            [
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: '<li>line1</li>',
                },
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: '<li>line2</li>',
                },
            ],
            1
        );
    });

    it('lists are in asymmetric containers', () => {
        runTest(
            '<div>' +
                '<div>line1</div>' +
                '<div>' +
                '<ul>' +
                '<li>line2</li>' +
                '</ul>' +
                '</div>' +
                '</div>' +
                '<ol>' +
                '<li>line3</li>' +
                `<li id="${FocusNode1}">line4</li>` +
                '</ol>' +
                '<div>' +
                '<div>line 5' +
                '<ol>' +
                `<li id="${FocusNode2}">line6</li>` +
                '<li>line7</li>' +
                '</ol>' +
                '</div>' +
                '</div>' +
                '<ol>' +
                '<li>line8</li>' +
                '<ul><li>line9</li></ul>' +
                '</ol>',
            [
                {
                    listTypes: [ListType.None, ListType.Unordered],
                    outerHTML: '<li>line2</li>',
                },
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: '<li>line3</li>',
                },
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: `<li id="${FocusNode1}">line4</li>`,
                },
                {
                    listTypes: [ListType.None],
                    outerHTML: '<li>line 5</li>',
                },
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: `<li id="${FocusNode2}">line6</li>`,
                },
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: '<li>line7</li>',
                },
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: '<li>line8</li>',
                },
                {
                    listTypes: [ListType.None, ListType.Ordered, ListType.Unordered],
                    outerHTML: '<li>line9</li>',
                },
            ]
        );
    });

    it('lists are in asymmetric containers, with spaces in HTML', () => {
        runTest(
            '<div>\n' +
                '    <div>line1</div>\n' +
                '    <div>\n' +
                '        <ul>\n' +
                '            <li>line2</li>\n' +
                '        </ul>\n' +
                '    </div>\n' +
                '</div>\n' +
                '<ol>\n' +
                '    <li>line3</li>\n' +
                `    <li id="${FocusNode1}">line4</li>\n` +
                '</ol>\n' +
                '<div>&nbsp;</div>\n' +
                '<div>\n' +
                '    <div>line 5\n' +
                '        <ol>\n' +
                `            <li id="${FocusNode2}">line6</li>\n` +
                '            <li>line7</li>\n' +
                '        </ol>\n' +
                '    </div>\n' +
                '</div>\n' +
                '<ol>\n' +
                '    <li>line8</li>\n' +
                '    <ul><li>line9</li></ul>\n' +
                '</ol>\n',
            [
                {
                    listTypes: [ListType.None, ListType.Unordered],
                    outerHTML: '<li>line2</li>',
                },
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: '<li>line3</li>',
                },
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: `<li id="${FocusNode1}">line4</li>`,
                },
                {
                    listTypes: [ListType.None],
                    outerHTML: '<li>&nbsp;</li>',
                },
                {
                    listTypes: [ListType.None],
                    outerHTML: '<li>line 5\n        </li>',
                },
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: `<li id="${FocusNode2}">line6</li>`,
                },
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: '<li>line7</li>',
                },
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: '<li>line8</li>',
                },
                {
                    listTypes: [ListType.None, ListType.Ordered, ListType.Unordered],
                    outerHTML: '<li>line9</li>',
                },
            ]
        );
    });
});

describe('createVListFromRegion from node', () => {
    const testId = 'createVListFromRegion';
    const FocusNode = 'focus';

    afterEach(() => {
        DomTestHelper.removeElement(testId);
    });

    function runTest(sourceHtml: string, expected: { listTypes: ListType[]; outerHTML: string }[]) {
        // Arrange
        const root = DomTestHelper.createElementFromContent(testId, sourceHtml);
        const focusNode = document.getElementById(FocusNode);

        if (!focusNode) {
            throw new Error('must specify focus node');
        }

        const regions = getRegionsFromRange(root, createRange(focusNode), RegionType.Table);

        // Act
        const vList = createVListFromRegion(regions[0], true /*includingSiblingLists*/);

        // Assert
        if (expected === null) {
            expect(vList).toBeNull();
        } else {
            const items = (<any>vList).items as VListItem[];
            const itemsMap = items.map(item => ({
                listTypes: (<any>item).listTypes as ListType[],
                outerHTML: (<HTMLElement>item.getNode()).outerHTML,
            }));

            expect(itemsMap).toEqual(expected);
        }
    }

    it('node in list', () => {
        runTest(`<ol><li>line1</li><li id="${FocusNode}">line2</li><li>line3</li></ol>`, [
            {
                listTypes: [ListType.None, ListType.Ordered],
                outerHTML: '<li>line1</li>',
            },
            {
                listTypes: [ListType.None, ListType.Ordered],
                outerHTML: `<li id="${FocusNode}">line2</li>`,
            },
            {
                listTypes: [ListType.None, ListType.Ordered],
                outerHTML: '<li>line3</li>',
            },
        ]);
    });

    it('node in nested list', () => {
        runTest(`<ol><li>line1</li><ul><li id="${FocusNode}">line2</li></ul><li>line3</li></ol>`, [
            {
                listTypes: [ListType.None, ListType.Ordered],
                outerHTML: '<li>line1</li>',
            },
            {
                listTypes: [ListType.None, ListType.Ordered, ListType.Unordered],
                outerHTML: `<li id="${FocusNode}">line2</li>`,
            },
            {
                listTypes: [ListType.None, ListType.Ordered],
                outerHTML: '<li>line3</li>',
            },
        ]);
    });

    it('node in disconnected nested list', () => {
        runTest(
            `<ol><li>line1</li><li><ul><li id="${FocusNode}">line2</li></ul></li><li>line3</li></ol>`,
            [
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: '<li>line1</li>',
                },
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: `<li><ul><li id="${FocusNode}">line2</li></ul></li>`,
                },
                {
                    listTypes: [ListType.None, ListType.Ordered],
                    outerHTML: '<li>line3</li>',
                },
            ]
        );
    });
});
