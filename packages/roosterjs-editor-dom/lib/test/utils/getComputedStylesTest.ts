import * as DomTestHelper from '../DomTestHelper';
import getComputedStyles, { getComputedStyle } from '../../utils/getComputedStyles';

describe('getComputedStyle()', () => {
    let testID = 'getComputedStyle';

    it('input = ["", "font-size"]', () => {
        runTest(['', 'font-size'], '');
    });

    it('input = ["test", "font-size"]', () => {
        runTest(['test', 'font-size'], '12pt');
    });

    it('input = [<div style="font-size:16px">Test</div>, "font-size"]', () => {
        runTest(['<div style="font-size:16px">Test</div>', 'font-size'], '12pt');
    });

    function runTest(input: [string, string], output: string) {
        // Arrange
        let testDiv = DomTestHelper.createElementFromContent(testID, input[0]);

        // Act
        DomTestHelper.runTestMethod2([testDiv.firstChild, input[1]], output, getComputedStyle);

        // Remove the element
        DomTestHelper.removeElement(testID);
    }
});

describe('getComputedStyles()', () => {
    let defaultResult = ['"times new roman"', '12pt', 'rgb(0, 0, 0)', 'rgba(0, 0, 0, 0)'];

    let result2 = ['"times new roman"', '16pt', 'rgb(0, 0, 0)', 'rgba(0, 0, 0, 0)'];

    it('getComputedStyles() case 0', () => {
        runTest(0, '', 'id0', undefined, []);
        runTest(0, '', 'id0', null, []);
    });
    it('getComputedStyles() case 1', () => {
        runTest(1, '<div id=id1></div>', 'id1', undefined, defaultResult);
    });
    it('getComputedStyles() case 2', () => {
        runTest(2, '<div id=id1 style="font-size: 16pt"></div>', 'id1', undefined, result2);
    });
    it('getComputedStyles() case 3', () => {
        runTest(
            3,
            '<div id=id1 style="font-size: 16pt"><div id=div2></div></div>',
            'id1',
            undefined,
            result2
        );
    });
    it('getComputedStyles() case 4', () => {
        runTest(4, '<div id=id1><div id=id2></div></div>', 'id2', ['margin-top'], ['0px']);
    });
    it('getComputedStyles() case 5', () => {
        runTest(
            5,
            '<div id=id1><div id=id2 style="margin: 2px"></div></div>',
            'id2',
            ['margin-top'],
            ['2px']
        );
    });
    it('getComputedStyles() case 6', () => {
        runTest(
            6,
            '<div id=id1 style="margin: 2px"><div id=id2></div></div>',
            'id2',
            ['margin-top', 'margin-bottom'],
            ['0px', '0px']
        );
    });
    it('getComputedStyles() case 7', () => {
        runTest(7, '<p id=id1></p>', 'id1', ['margin-top'], ['16px']);
    });
    it('getComputedStyles() case 8', () => {
        runTest(
            8,
            '<div id=id1 style="color: red"><div id=id2></div></div>',
            'id2',
            ['color', 'background-color'],
            ['rgb(255, 0, 0)', 'rgba(0, 0, 0, 0)']
        );
    });
    it('getComputedStyles() case 9', () => {
        runTest(
            9,
            '<div id=id1 style="font-size: 12px"></div></div>',
            'id1',
            ['font-size'],
            ['9pt']
        );
    });
    it('getComputedStyles() case 10', () => {
        runTest(
            10,
            '<div id=id1 style="font-size: 12pt"></div></div>',
            'id1',
            ['font-size'],
            ['12pt']
        );
    });

    function runTest(
        caseIndex: number,
        input: string,
        id: string,
        styles: string[],
        expectResult: string[]
    ) {
        let div = document.createElement('div');
        div.style.fontFamily = 'times new roman';
        document.body.appendChild(div);
        div.innerHTML = input;
        let element = document.getElementById(id);
        let result = getComputedStyles(element, styles);
        expect(result).toEqual(expectResult, `case index: ${caseIndex}`);
        document.body.removeChild(div);
    }
});
