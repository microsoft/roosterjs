import * as DomTestHelper from '../DomTestHelper';
import createRange from '../../selection/createRange';
import getRegionsFromRange from '../../region/getRegionsFromRange';
import { Region, RegionType } from 'roosterjs-editor-types';

const testID = 'getRegionsFromRange';

const FocusNode = 'focus';
const FocusNode1 = 'focusStart';
const FocusNode2 = 'focusEnd';

type MockRegion = Pick<
    Region,
    Exclude<keyof Region, 'skipTags' | 'fullSelectionStart' | 'fullSelectionEnd'>
>;

function stripRegion(region: Region): MockRegion {
    const mockRegion = { ...region };
    delete mockRegion.fullSelectionEnd;
    delete mockRegion.fullSelectionStart;
    delete mockRegion.skipTags;
    return mockRegion;
}

describe('getRegionsFromRange', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(
        input: string,
        expectation: (root: HTMLElement) => MockRegion[],
        rootNode: (root: HTMLElement) => Node = root => root
    ) {
        const div = DomTestHelper.createElementFromContent(testID, input);
        const focusNode = document.getElementById(FocusNode);
        const focusNode1 = document.getElementById(FocusNode1);
        const focusNode2 = document.getElementById(FocusNode2);

        if (!focusNode && (!focusNode1 || !focusNode2)) {
            throw new Error('focus node not found');
        }

        const range = focusNode ? createRange(focusNode) : createRange(focusNode1, focusNode2);
        const regions = getRegionsFromRange(rootNode(div) as HTMLElement, range, RegionType.Table);
        const strippedRegions = regions.map(stripRegion);

        expect(strippedRegions).toEqual(expectation(div));
    }

    it('Null input', () => {
        const rootNullRegions = getRegionsFromRange(null, document.createRange(), RegionType.Table);
        const rangeNullRegions = getRegionsFromRange(
            document.createElement('div'),
            null,
            RegionType.Table
        );
        const bothNullRegions = getRegionsFromRange(null, null, RegionType.Table);

        expect(rootNullRegions).toEqual([], 'root is null');
        expect(rangeNullRegions).toEqual([], 'range is null');
        expect(bothNullRegions).toEqual([], 'root and range are null');
    });

    it('Simple node contains range', () => {
        runTest(`<div>line 1</div><div id="${FocusNode}">line 2</div><div>line 3</div>`, div => [
            {
                rootNode: div,
                nodeBefore: undefined,
                nodeAfter: undefined,
            },
        ]);
    });

    it('Simple node not contain range', () => {
        runTest(
            `<div>line 1</div><div id="${FocusNode}">line 2</div>`,
            div => [
                {
                    rootNode: div.firstChild as HTMLElement,
                    nodeBefore: undefined,
                    nodeAfter: undefined,
                },
            ],
            div => div.firstChild
        );
    });

    it('Node contains a table, selection is the table', () => {
        runTest(
            `<div>line 1</div><table id="${FocusNode}">` +
                '<tr><td>td1</td><td>td2</td></tr>' +
                '<tr><td>td3</td><td>td4</td></tr>' +
                '</table><div>line 3</div>',
            div => [
                {
                    rootNode: div,
                    nodeBefore: undefined,
                    nodeAfter: undefined,
                },
            ]
        );
    });

    it('Node contains a table, selection covers the table', () => {
        runTest(
            `<div id="${FocusNode1}">line 1</div><table>` +
                '<tr><td>td1</td><td>td2</td></tr>' +
                '<tr><td>td3</td><td>td4</td></tr>' +
                `</table><div id="${FocusNode2}">line 3</div>`,
            div => [
                {
                    rootNode: div,
                    nodeBefore: undefined,
                    nodeAfter: undefined,
                },
            ]
        );
    });

    it('Node contains a table, selection is out of table', () => {
        runTest(
            `<div id="${FocusNode}">line 1</div><table>` +
                '<tr><td>td1</td><td>td2</td></tr>' +
                '<tr><td>td3</td><td>td4</td></tr>' +
                '</table><div>line 3</div>',
            div => [
                {
                    rootNode: div,
                    nodeBefore: undefined,
                    nodeAfter: undefined,
                },
            ]
        );
    });

    it('Node contains a table, selection is within one TD', () => {
        runTest(
            '<div>line 1</div><table>' +
                '<tr><td id="resultTd">' +
                `line 2<div id="${FocusNode}">line 3</div>line 4` +
                '</td><td>td2</td></tr>' +
                '<tr><td>td3</td><td>td4</td></tr>' +
                '</table><div>line 5</div>',
            () => [
                {
                    rootNode: document.getElementById('resultTd'),
                    nodeBefore: undefined,
                    nodeAfter: undefined,
                },
            ]
        );
    });

    it('Node contains a table, selection covers two TDs', () => {
        runTest(
            '<div>line 1</div><table>' +
                `<tr><td id="td1"><div id="${FocusNode1}">td1</div></td><td id="td2"><div id="${FocusNode2}">td2</div></td></tr>` +
                '<tr><td>td3</td><td>td4</td></tr>' +
                '</table><div>line 3</div>',
            () => [
                {
                    rootNode: document.getElementById('td1'),
                    nodeBefore: undefined,
                    nodeAfter: undefined,
                },
                {
                    rootNode: document.getElementById('td2'),
                    nodeBefore: undefined,
                    nodeAfter: undefined,
                },
            ]
        );
    });

    it('Node contains a table, selection starts before table, end in the first TD', () => {
        runTest(
            `<div id="${FocusNode1}">line 1</div>` +
                `<table id="table"><tr><td id="resultTd">line 2<div id="${FocusNode2}">td1</div></td><td>td2</td></tr>` +
                '<tr><td>td3</td><td>td4</td></tr>' +
                '</table><div>line 3</div>',
            div => [
                {
                    rootNode: div,
                    nodeBefore: undefined,
                    nodeAfter: document.getElementById('table'),
                },
                {
                    rootNode: document.getElementById('resultTd'),
                    nodeBefore: undefined,
                    nodeAfter: undefined,
                },
            ]
        );
    });

    it('Node contains a table, selection starts before table, end in the second TD', () => {
        runTest(
            `<div id="${FocusNode1}">line 1</div>` +
                `<table id="table"><tr><td id="resultTd1">td1</td><td id="resultTd2"><div id="${FocusNode2}">td2</div></td></tr>` +
                '<tr><td>td3</td><td>td4</td></tr>' +
                '</table><div>line 3</div>',
            div => [
                {
                    rootNode: div,
                    nodeBefore: undefined,
                    nodeAfter: document.getElementById('table'),
                },
                {
                    rootNode: document.getElementById('resultTd1'),
                    nodeBefore: undefined,
                    nodeAfter: undefined,
                },
                {
                    rootNode: document.getElementById('resultTd2'),
                    nodeBefore: undefined,
                    nodeAfter: undefined,
                },
            ]
        );
    });

    it('Node contains a table, selection starts in last TD, end outside', () => {
        runTest(
            '<div>line 1</div>' +
                '<table id="table"><tr><td>td1</td><td>td2</td></tr>' +
                `<tr><td>td3</td><td id="resultTd"><div id="${FocusNode1}">td4</div></td></tr>` +
                `</table><div id="${FocusNode2}">line 3</div>`,
            div => [
                {
                    rootNode: document.getElementById('resultTd'),
                    nodeBefore: undefined,
                    nodeAfter: undefined,
                },
                {
                    rootNode: div,
                    nodeBefore: document.getElementById('table'),
                    nodeAfter: undefined,
                },
            ]
        );
    });

    it('Node contains a table, selection starts in the second last TD, end outside', () => {
        runTest(
            '<div>line 1</div>' +
                '<table id="table"><tr><td>td1</td><td>td2</td></tr>' +
                `<tr><td id="resultTd1"><div id="${FocusNode1}">td3</div></td><td id="resultTd2">td4</td></tr>` +
                `</table><div id="${FocusNode2}">line 3</div>`,
            div => [
                {
                    rootNode: document.getElementById('resultTd1'),
                    nodeBefore: undefined,
                    nodeAfter: undefined,
                },
                {
                    rootNode: document.getElementById('resultTd2'),
                    nodeBefore: undefined,
                    nodeAfter: undefined,
                },
                {
                    rootNode: div,
                    nodeBefore: document.getElementById('table'),
                    nodeAfter: undefined,
                },
            ]
        );
    });

    it('Table contains another table, selection starts from inner table to outside', () => {
        runTest(
            '<table id="table1"><tr><td id="resultTd1">' +
                '<div>line1</div>' +
                `<table id="table2"><tr><td id="resultTd2"><div id="${FocusNode1}">line2</div></td></tr></table>` +
                '<div>line3</div>' +
                '</td></tr></table>' +
                `<div id="${FocusNode2}">line 4</div>`,
            div => [
                {
                    rootNode: document.getElementById('resultTd2'),
                    nodeBefore: undefined,
                    nodeAfter: undefined,
                },
                {
                    rootNode: document.getElementById('resultTd1'),
                    nodeBefore: document.getElementById('table2'),
                    nodeAfter: undefined,
                },
                {
                    rootNode: div,
                    nodeBefore: document.getElementById('table1'),
                    nodeAfter: undefined,
                },
            ]
        );
    });

    it('Selection starts from a table, ends in another table, no elements between two tables', () => {
        runTest(
            '<table id="table1"><tr><td id="resultTd1">' +
                `<div id="${FocusNode1}">line1</div>` +
                '</td></tr></table><table id="table2"><tr><td id="resultTd2">' +
                `<div id="${FocusNode2}">line2</div>` +
                '</td></tr></table>',
            div => [
                {
                    rootNode: document.getElementById('resultTd1'),
                    nodeBefore: undefined,
                    nodeAfter: undefined,
                },
                {
                    rootNode: document.getElementById('resultTd2'),
                    nodeBefore: undefined,
                    nodeAfter: undefined,
                },
            ]
        );
    });

    it('Selection starts from a table, ends in another table, DIVs are between two tables', () => {
        runTest(
            '<table id="table1"><tr><td id="resultTd1">' +
                `<div id="${FocusNode1}">line1</div>` +
                '</td></tr></table><div>line 2</div><div>line 3</div><table id="table2"><tr><td id="resultTd2">' +
                `<div id="${FocusNode2}">line4</div>` +
                '</td></tr></table>',
            div => [
                {
                    rootNode: document.getElementById('resultTd1'),
                    nodeBefore: undefined,
                    nodeAfter: undefined,
                },
                {
                    rootNode: div,
                    nodeBefore: document.getElementById('table1'),
                    nodeAfter: document.getElementById('table2'),
                },
                {
                    rootNode: document.getElementById('resultTd2'),
                    nodeBefore: undefined,
                    nodeAfter: undefined,
                },
            ]
        );
    });

    it('Selection starts and ends in two asymmetric tables (not direct children of the same container)', () => {
        runTest(
            '<table id="table1"><tr><td id="resultTd1">' +
                `<div id="${FocusNode1}">line1</div>` +
                '</td></tr></table><div><div>line 2</div><div>line 3</div><table id="table2"><tr><td id="resultTd2">' +
                `<div id="${FocusNode2}">line4</div>` +
                '</td></tr></table></div>',
            div => [
                {
                    rootNode: document.getElementById('resultTd1'),
                    nodeBefore: undefined,
                    nodeAfter: undefined,
                },
                {
                    rootNode: div,
                    nodeBefore: document.getElementById('table1'),
                    nodeAfter: document.getElementById('table2'),
                },
                {
                    rootNode: document.getElementById('resultTd2'),
                    nodeBefore: undefined,
                    nodeAfter: undefined,
                },
            ]
        );
    });

    it('Selection starts and ends both in nested tables)', () => {
        runTest(
            '<table id="table1"><tr><td id="resultTd1">' +
                '<div>line1</div>' +
                '<table id="table2"><tr>' +
                `<td id="resultTd2"><div id="${FocusNode1}">line2</div></td>` +
                '<td id="resultTd3">line3</td>' +
                '</tr></table>' +
                '<div>line4</div>' +
                '</td></tr></table>' +
                '<div>line5</div>' +
                '<table id="table3"><tr><td id="resultTd4">' +
                '<div>line6</div>' +
                '<table id="table4"><tr>' +
                '<td id="resultTd5">line7</td>' +
                `<td id="resultTd6"><div id="${FocusNode2}">line8</div></td>` +
                '</tr></table>' +
                '<div>line10</div>' +
                '</td></tr></table>',
            div => [
                {
                    rootNode: document.getElementById('resultTd2'),
                    nodeBefore: undefined,
                    nodeAfter: undefined,
                },
                {
                    rootNode: document.getElementById('resultTd3'),
                    nodeBefore: undefined,
                    nodeAfter: undefined,
                },
                {
                    rootNode: document.getElementById('resultTd1'),
                    nodeBefore: document.getElementById('table2'),
                    nodeAfter: undefined,
                },
                {
                    rootNode: div,
                    nodeBefore: document.getElementById('table1'),
                    nodeAfter: document.getElementById('table3'),
                },

                {
                    rootNode: document.getElementById('resultTd4'),
                    nodeBefore: undefined,
                    nodeAfter: document.getElementById('table4'),
                },
                {
                    rootNode: document.getElementById('resultTd5'),
                    nodeBefore: undefined,
                    nodeAfter: undefined,
                },
                {
                    rootNode: document.getElementById('resultTd6'),
                    nodeBefore: undefined,
                    nodeAfter: undefined,
                },
            ]
        );
    });

    it('Selection starts and ends both in nested tables, and there are other tables inside regions)', () => {
        runTest(
            '<table id="table1"><tr><td id="resultTd1">' +
                '<div>line1</div>' +
                '<table id="table2"><tr>' +
                `<td id="resultTd2"><div id="${FocusNode1}">line2</div></td>` +
                '<td id="resultTd3"><table><tr><td>line3</td></tr></table></td>' +
                '</tr></table>' +
                '<div><table><tr><td>line4</td></tr></table></div>' +
                '</td></tr></table>' +
                '<table><tr><td>line5</td></tr></table>' +
                '<table id="table3"><tr><td id="resultTd4">' +
                '<div><table><tr><td>line6</td></tr></table></div>' +
                '<table id="table4"><tr>' +
                '<td id="resultTd5"><table><tr><td>line7</td></tr></table></td>' +
                `<td id="resultTd6"><div id="${FocusNode2}">line8</div></td>` +
                '</tr></table>' +
                '<div>line10</div>' +
                '</td></tr></table>',
            div => [
                {
                    rootNode: document.getElementById('resultTd2'),
                    nodeBefore: undefined,
                    nodeAfter: undefined,
                },
                {
                    rootNode: document.getElementById('resultTd3'),
                    nodeBefore: undefined,
                    nodeAfter: undefined,
                },
                {
                    rootNode: document.getElementById('resultTd1'),
                    nodeBefore: document.getElementById('table2'),
                    nodeAfter: undefined,
                },
                {
                    rootNode: div,
                    nodeBefore: document.getElementById('table1'),
                    nodeAfter: document.getElementById('table3'),
                },

                {
                    rootNode: document.getElementById('resultTd4'),
                    nodeBefore: undefined,
                    nodeAfter: document.getElementById('table4'),
                },
                {
                    rootNode: document.getElementById('resultTd5'),
                    nodeBefore: undefined,
                    nodeAfter: undefined,
                },
                {
                    rootNode: document.getElementById('resultTd6'),
                    nodeBefore: undefined,
                    nodeAfter: undefined,
                },
            ]
        );
    });
});
