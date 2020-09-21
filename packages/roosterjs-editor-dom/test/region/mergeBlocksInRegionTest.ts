import mergeBlocksInRegion from '../../lib/region/mergeBlocksInRegion';
import Position from '../../lib/selection/Position';
import setHtmlWithSelectionPath from '../../lib/selection/setHtmlWithSelectionPath';

describe('mergeBlocksInRegion', () => {
    it('null region input', () => {
        mergeBlocksInRegion(null, null, null);
        expect();
    });

    let div: HTMLElement;

    beforeEach(() => {
        div = document.createElement('div');
        document.body.appendChild(div);
    });

    afterEach(() => {
        document.body.removeChild(div);
        div = null;
    });

    function runTest(html: string, expected: string) {
        const range = setHtmlWithSelectionPath(div, html);
        const refNode = Position.getStart(range).node;
        const targetNode = Position.getEnd(range).node;
        mergeBlocksInRegion(
            {
                rootNode: div,
            },
            refNode,
            targetNode
        );

        expect(div.innerHTML).toBe(expected);
    }

    it('null nodes input', () => {
        div.innerHTML = 'test';
        mergeBlocksInRegion(
            {
                rootNode: div,
            },
            null,
            null
        );

        expect(div.innerHTML).toBe('test');
    });

    it('refNode is out of region', () => {
        div.innerHTML = 'test';
        const refNode = document.createTextNode('test1');
        const targetNode = document.createTextNode('test2');
        document.body.appendChild(refNode);
        document.body.appendChild(targetNode);

        mergeBlocksInRegion(
            {
                rootNode: div,
            },
            refNode,
            targetNode
        );

        expect(div.innerHTML).toBe('test');
        document.body.removeChild(refNode);
        document.body.removeChild(targetNode);
    });

    it('Same text node', () => {
        runTest('test<!--{"start":[0,1],"end":[0,3]}-->', 'test');
    });

    it('Two text node in same block', () => {
        runTest('test1<img>test2<!--{"start":[0,2],"end":[2,3]}-->', 'test1<img>test2');
    });

    it('Two continuous blocks', () => {
        runTest('test1<br>test2<!--{"start":[0,2],"end":[2,3]}-->', 'test1test2<br>');
    });

    it('Three blocks', () => {
        runTest(
            'test1<br>test2<br>test3<!--{"start":[0,2],"end":[4,2]}-->',
            'test1test3<br>test2<br>'
        );
    });

    it('Complex blocks 1', () => {
        runTest(
            '<div style="color:red">line1<div style="color:orange">line2<br>line3</div>line4</div>line5<div style="color:yellow">line6<div style="color:green">line7<br>line8</div>line9</div><!--{"start":[0,1,2,3],"end":[1,3]}-->',
            '<div style="color:red">line1<div style="color:orange">line2<br>line3line5</div>line4</div><div style="color:yellow">line6<div style="color:green">line7<br>line8</div>line9</div>'
        );
    });

    it('Complex blocks 2', () => {
        runTest(
            '<div style="color:red">line1<div style="color:orange">line2<br>line3</div>line4</div>line5<div style="color:yellow">line6<div style="color:green">line7<br>line8</div>line9</div><!--{"start":[0,1,2,3],"end":[2,0,3]}-->',
            '<div style="color:red">line1<div style="color:orange">line2<br>line3<span style="color:yellow">line6</span></div>line4</div>line5<div style="color:yellow"><div style="color:green">line7<br>line8</div>line9</div>'
        );
    });

    it('Complex blocks 3', () => {
        runTest(
            '<div style="color:red">line1<div style="color:orange">line2<br>line3</div>line4</div>line5<div style="color:yellow">line6<div style="color:green">line7<br>line8</div>line9</div><!--{"start":[0,1,2,3],"end":[2,1,0,3]}-->',
            '<div style="color:red">line1<div style="color:orange">line2<br>line3<span style="color:green">line7<br></span></div>line4</div>line5<div style="color:yellow">line6</div><div style="color:yellow"><div style="color:green">line8</div>line9</div>'
        );
    });

    it('Complex blocks 4', () => {
        runTest(
            '<div style="color:red">line1<div style="color:orange">line2<br>line3</div>line4</div>line5<div style="color:yellow">line6<div style="color:green">line7<br>line8</div>line9</div><!--{"start":[0,1,2,3],"end":[2,1,2,3]}-->',
            '<div style="color:red">line1<div style="color:orange">line2<br>line3<span style="color:green">line8</span></div>line4</div>line5<div style="color:yellow">line6<div style="color:green">line7<br></div></div><div style="color:yellow">line9</div>'
        );
    });

    it('With nested styles', () => {
        runTest(
            '<div><span style="color:red">line1</span></div><div style="color:blue"><i>line2<span style="font-size:20px"><br>line3<br>line4</span></i></div><!--{"start":[0,0,0,3],"end":[1,0,1,1,3]}-->',
            '<div><span style="color:red">line1<span style="color:blue"><i><span style="font-size:20px">line3<br></span></i></span></span></div><div style="color:blue"><i>line2<span style="font-size:20px"><br></span></i></div><div style="color:blue"><i><span style="font-size:20px">line4</span></i></div>'
        );
    });

    it('With lists', () => {
        runTest(
            'line1<ol><li>line2</li><ol><li>line3</li></ol></ol><ul><li style="color:red">line4</li><li>line5</li></ul><!--{"start":[1,1,0,0,3],"end":[2,0,0,3]}-->',
            'line1<ol><li>line2</li><ol><li>line3<span style="color:red">line4</span></li></ol></ol><ul><li>line5</li></ul>'
        );
    });
});
