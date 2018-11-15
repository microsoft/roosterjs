import collapseNodes from '../../utils/collapseNodes';
import { NodeType } from 'roosterjs-editor-types';

describe('collapseNodes()', () => {
    function runTest(
        caseIndex: number,
        input: string,
        startId: string,
        endId: string,
        allowSplictParent: boolean,
        resultHtmls: string[],
        resultFullHtml: string
    ) {
        let index = `case index: ${caseIndex}`;
        let div = document.createElement('div');
        div.innerHTML = input;
        document.body.appendChild(div);
        let nodes = collapseNodes(
            div,
            document.getElementById(startId),
            document.getElementById(endId),
            allowSplictParent
        );
        let results = nodes.map(
            node =>
                node.nodeType == NodeType.Element ? (<HTMLElement>node).outerHTML : node.nodeValue
        );
        expect(results).toEqual(resultHtmls, index);
        expect(div.innerHTML).toBe(resultFullHtml, index);
        document.body.removeChild(div);
    }

    function runTest1(
        caseIndex: number,
        input: string,
        startId: string,
        endId: string,
        resultHtmls: string[],
        resultFullHtml: string
    ) {
        runTest(caseIndex, input, startId, endId, true, resultHtmls, resultFullHtml);
    }

    function runTest2(
        caseIndex: number,
        input: string,
        startId: string,
        endId: string,
        resultHtmls: string[],
        resultFullHtml: string
    ) {
        runTest(caseIndex, input, startId, endId, false, resultHtmls, resultFullHtml);
    }

    it('collapseNodes() allowSplitParent', () => {
        runTest1(0, '', 'id1', 'id2', [], '');
        runTest1(
            1,
            '<div id=id1></div><div id=id2></div>',
            'id1',
            'id2',
            ['<div id="id1"></div>', '<div id="id2"></div>'],
            '<div id="id1"></div><div id="id2"></div>'
        );
        runTest1(
            2,
            '<div id=id1><div id=id2></div></div>',
            'id1',
            'id2',
            ['<div id="id1"><div id="id2"></div></div>'],
            '<div id="id1"><div id="id2"></div></div>'
        );
        runTest1(
            3,
            '<div id=id2></div><div id=id1></div>',
            'id1',
            'id2',
            [],
            '<div id="id2"></div><div id="id1"></div>'
        );
        runTest1(
            4,
            '<div><div id=id1></div>test1</div><div>test2<div id=id2></div>test3</div>',
            'id1',
            'id2',
            ['<div><div id="id1"></div>test1</div>', '<div>test2<div id="id2"></div></div>'],
            '<div><div id="id1"></div>test1</div><div>test2<div id="id2"></div></div><div>test3</div>'
        );
        runTest1(
            5,
            '<div>test1<div>test2<div id=id1>test3</div>test4</div>test5</div><div>test6<div id=id2>test7</div>test8</div>',
            'id1',
            'id2',
            [
                '<div><div><div id="id1">test3</div>test4</div>test5</div>',
                '<div>test6<div id="id2">test7</div></div>',
            ],
            '<div>test1<div>test2</div></div><div><div><div id="id1">test3</div>test4</div>test5</div><div>test6<div id="id2">test7</div></div><div>test8</div>'
        );
        runTest1(
            6,
            '<div>test1<div id=id1>test2</div>test3<div>test4<div id=id2>test5</div>test6</div>test7</div>',
            'id1',
            'id2',
            ['<div id="id1">test2</div>', 'test3', '<div>test4<div id="id2">test5</div></div>'],
            '<div>test1<div id="id1">test2</div>test3<div>test4<div id="id2">test5</div></div><div>test6</div>test7</div>'
        );
    });

    it('collapseNodes() not allowSplictParent', () => {
        runTest2(0, '', 'id1', 'id2', [], '');
        runTest2(
            1,
            '<div id=id1></div><div id=id2></div>',
            'id1',
            'id2',
            ['<div id="id1"></div>', '<div id="id2"></div>'],
            '<div id="id1"></div><div id="id2"></div>'
        );
        runTest2(
            2,
            '<div id=id1><div id=id2></div></div>',
            'id1',
            'id2',
            ['<div id="id1"><div id="id2"></div></div>'],
            '<div id="id1"><div id="id2"></div></div>'
        );
        runTest2(
            3,
            '<div id=id2></div><div id=id1></div>',
            'id1',
            'id2',
            [],
            '<div id="id2"></div><div id="id1"></div>'
        );
        runTest2(
            4,
            '<div><div id=id1></div>test1</div><div>test2<div id=id2></div>test3</div>',
            'id1',
            'id2',
            ['<div><div id="id1"></div>test1</div>', '<div id="id2"></div>'],
            '<div><div id="id1"></div>test1</div><div>test2<div id="id2"></div>test3</div>'
        );
        runTest2(
            5,
            '<div>test1<div>test2<div id=id1>test3</div>test4</div>test5</div><div>test6<div id=id2>test7</div>test8</div>',
            'id1',
            'id2',
            ['<div id="id1">test3</div>', '<div id="id2">test7</div>'],
            '<div>test1<div>test2<div id="id1">test3</div>test4</div>test5</div><div>test6<div id="id2">test7</div>test8</div>'
        );
        runTest2(
            6,
            '<div>test1<div id=id1>test2</div>test3<div>test4<div id=id2>test5</div>test6</div>test7</div>',
            'id1',
            'id2',
            ['<div id="id1">test2</div>', '<div id="id2">test5</div>'],
            '<div>test1<div id="id1">test2</div>test3<div>test4<div id="id2">test5</div>test6</div>test7</div>'
        );
    });
});
