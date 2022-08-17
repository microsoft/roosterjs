import createRange from '../../lib/selection/createRange';
import deleteSelectedContent from '../../lib/edit/deleteSelectedContent';
import getHtmlWithSelectionPath from '../../lib/selection/getHtmlWithSelectionPath';
import setHtmlWithSelectionPath from '../../lib/selection/setHtmlWithSelectionPath';

describe('deleteSelectedContent', () => {
    let div: HTMLDivElement;
    beforeEach(() => {
        div = document.createElement('div');
        div.contentEditable = 'true';
        document.body.appendChild(div);
    });

    afterEach(() => {
        document.body.removeChild(div);
        div = null;
    });

    function runTest(html: string, expected: string) {
        const range = setHtmlWithSelectionPath(div, html);
        const position = deleteSelectedContent(div, range);
        const result = getHtmlWithSelectionPath(div, createRange(position));

        expect(result).toBe(expected);
    }

    it('Empty input', () => {
        runTest('<!--{"start":[0],"end":[0]}-->', '');
    });

    it('Text input', () => {
        runTest('test<!--{"start":[0,1],"end":[0,3]}-->', 'tt<!--{"start":[0,1],"end":[0,1]}-->');
    });

    it('Two text node', () => {
        runTest(
            'test1<br>test2<!--{"start":[0,2],"end":[2,2]}-->',
            'test2<!--{"start":[0,2],"end":[0,2]}-->'
        );
    });

    it('Two DIV node', () => {
        runTest(
            '<div>test1</div><div>test2</div><!--{"start":[0,0,2],"end":[1,0,2]}-->',
            '<div>test2</div><!--{"start":[0,0,2],"end":[0,0,2]}-->'
        );
    });

    it('Two DIV node, select to next line', () => {
        runTest(
            '<div>test1</div><div>test2</div><!--{"start":[0,0,2],"end":[1,0]}-->',
            '<div>tetest2</div><!--{"start":[0,0,2],"end":[0,0,2]}-->'
        );
    });

    it('Simple list', () => {
        runTest(
            '<ol><li>line1</li><li>line2</li><li>line3</li></ol><!--{"start":[0,0,0,2],"end":[0,1,0,2]}-->',
            '<ol><li>line2</li><li>line3</li></ol><!--{"start":[0,0,0,2],"end":[0,0,0,2]}-->'
        );
    });

    it('Nested list', () => {
        runTest(
            '<ol><li>line1</li><ol><li>line2</li><li>line3</li></ol><li>line4</li></ol><!--{"start":[0,0,0,2],"end":[0,1,0,0,2]}-->',
            '<ol><li>line2</li><ol><li>line3</li></ol><li>line4</li></ol><!--{"start":[0,0,0,2],"end":[0,0,0,2]}-->'
        );
    });

    it('Nested list and text', () => {
        runTest(
            '<ol><li>line1</li><ol><li>line2</li><li>line3</li></ol><li>line4</li></ol>line5<br>line6<!--{"start":[0,1,1,0,2],"end":[1,2]}-->',
            '<ol><li>line1</li><ol><li>line2</li><li>li<span>ne5<br></span></li></ol></ol>line6<!--{"start":[0,1,1,0,2],"end":[0,1,1,0,2]}-->'
        );
    });

    it('Nested list and text and nested list', () => {
        runTest(
            '<ol><li>line1</li><ol><li>line2</li><li>line3</li></ol><li>line4</li></ol>line5<br>line6<ol><li>line7</li><ol><li>line8</li><li>line9</li></ol><li>line10</li></ol><!--{"start":[0,1,1,0,2],"end":[4,1,0,0,2]}-->',
            '<ol><li>line1</li><ol><li>line2</li><li>line8</li></ol></ol><ol><ol><li>line9</li></ol><li>line10</li></ol><!--{"start":[0,1,1,0,2],"end":[0,1,1,0,2]}-->'
        );
    });

    it('Whole table 1', () => {
        runTest(
            'aa<table><tbody><tr><td>line1</td><td>line2</td></tr><tr><td>line3</td><td>line4</td></tr></tbody></table>bb<!--{"start":[0,2],"end":[2,0]}-->',
            'aabb<!--{"start":[0,2],"end":[0,2]}-->'
        );
    });

    it('Whole table 2', () => {
        // TODO: the result contains separated continuous text object at root
        // Selection path gives wrong result. Need to revisit here
        runTest(
            'aa<table><tbody><tr><td>line1</td><td>line2</td></tr><tr><td>line3</td><td>line4</td></tr></tbody></table>bb<!--{"start":[1],"end":[2]}-->',
            'aabb<!--{"start":[],"end":[]}-->'
        );
    });

    it('Whole table 3', () => {
        runTest(
            'aa<table><tbody><tr><td>line1</td><td>line2</td></tr><tr><td>line3</td><td>line4</td></tr></tbody></table>bb<!--{"start":[0,1],"end":[2,1]}-->',
            'ab<!--{"start":[0,1],"end":[0,1]}-->'
        );
    });

    it('One table', () => {
        runTest(
            '<table><tbody><tr><td>line1</td><td>line2</td></tr><tr><td>line3</td><td>line4</td></tr></tbody></table><!--{"start":[0,0,0,1,0,2],"end":[0,0,1,0,0,2]}-->',
            '<table><tbody><tr><td>line1</td><td>li</td></tr><tr><td>ne3</td><td>line4</td></tr></tbody></table><!--{"start":[0,0,0,1,0,2],"end":[0,0,0,1,0,2]}-->'
        );
    });

    it('Two tables', () => {
        runTest(
            'aa<table><tbody><tr><td>line1</td><td>line2</td></tr><tr><td>line3</td><td>line4</td></tr></tbody></table>bb<table><tbody><tr><td>line5</td><td>line6</td></tr><tr><td>line7</td><td>line8</td></tr></tbody></table>cc<!--{"start":[1,0,0,1,0,2],"end":[3,0,1,0,0,2]}-->',
            'aa<table><tbody><tr><td>line1</td><td>li</td></tr></tbody></table><table><tbody><tr><td>ne7</td><td>line8</td></tr></tbody></table>cc<!--{"start":[1,0,0,1,0,2],"end":[1,0,0,1,0,2]}-->'
        );
    });

    it('Nested tables', () => {
        runTest(
            'aa<table><tbody><tr><td>line1</td><td>line2</td></tr><tr><td><table><tbody><tr><td>line5</td><td>line6</td></tr><tr><td>line7</td><td>line8</td></tr></tbody></table></td><td>line4</td></tr></tbody></table>bb<!--{"start":[1,0,0,1,0,2],"end":[1,0,1,0,0,0,0,1,0,2]}-->',
            'aa<table><tbody><tr><td>line1</td><td>li</td></tr><tr><td><table><tbody><tr><td></td><td>ne6</td></tr><tr><td>line7</td><td>line8</td></tr></tbody></table></td><td>line4</td></tr></tbody></table>bb<!--{"start":[1,0,0,1,0,2],"end":[1,0,0,1,0,2]}-->'
        );
    });

    it('Embedded block and styles', () => {
        runTest(
            '<div>abcd<br>efgh</div><div style="color:red"><b><div style="font-size: 20px">1234<br>5678</div>9012</b>3456</div><!--{"start":[0,2,2],"end":[1,0,0,0,2]}-->',
            '<div>abcd<br>ef<span style="color:red;font-weight:bold;font-size:20px">34<br></span></div><div style="color:red"><b><div style="font-size: 20px">5678</div>9012</b>3456</div><!--{"start":[0,2,2],"end":[0,2,2]}-->'
        );
    });

    it('Conflict embeded styles', () => {
        runTest(
            '<b><div style="color:red">line1</div><div style="color:green; font-size: 20px">line2<div style="color:blue"><i>line3</i></div>line4</div></b><!--{"start":[0,0,0,2],"end":[0,1,1,0,0,2]}-->',
            '<b><div style="color:red">li<span style="color:blue;font-size:20px"><i>ne3</i></span></div><div style="color:green; font-size: 20px">line4</div></b><!--{"start":[0,0,0,2],"end":[0,0,0,2]}-->'
        );
    });

    it('Readonly entities', () => {
        runTest(
            '<div contenteditable="false">hello there</div><!--{"start":[0,0,2],"end":[0,0,4]}-->',
            '<div contenteditable="false">hello there</div><!--{"start":[0,0,2],"end":[0,0,2]}-->'
        );
    });
});
