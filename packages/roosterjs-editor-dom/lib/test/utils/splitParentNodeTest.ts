import splitParentNode, { splitBalancedNodeRange } from '../../utils/splitParentNode';
import { NodeType } from 'roosterjs-editor-types';

describe('splitParentNode()', () => {
    function runTest(
        caseIndex: string,
        input: string,
        nodeId: string,
        splitBefore: boolean,
        removeEmptyNewNode: boolean,
        newNodeValue: string,
        expectHtml: string
    ) {
        let index = `case index: ${caseIndex}`;
        let div = document.createElement('div');
        document.body.appendChild(div);
        div.innerHTML = input;
        let node = document.getElementById(nodeId);
        let newNode = splitParentNode(node, splitBefore, removeEmptyNewNode);
        if (newNodeValue === null) {
            expect(newNode).toBeNull(index + ' - NodeValue');
        } else {
            expect(newNode).not.toBeNull(index + ' - NodeValue');
            let value = newNode.nodeType == NodeType.Text ? newNode.nodeValue : newNode.textContent;
            expect(value).toBe(newNodeValue, index + ' - NodeValue');
        }
        expect(div.innerHTML).toBe(expectHtml, index + ' - HTML');
        document.body.removeChild(div);
    }

    function runTestSplibBefore(
        caseIndex: number,
        input: string,
        nodeId: string,
        newNodeValue: string,
        expectHtml: string,
        newNodeValueWhenRemoveEmptyNode?: string,
        expectHtmlWhenRemoveEmptyNode?: string
    ) {
        runTest(caseIndex + ' - KeepEmpty', input, nodeId, true, false, newNodeValue, expectHtml);
        runTest(
            caseIndex + ' - RemoveEmpty',
            input,
            nodeId,
            true,
            true,
            newNodeValueWhenRemoveEmptyNode === undefined
                ? newNodeValue
                : newNodeValueWhenRemoveEmptyNode,
            expectHtmlWhenRemoveEmptyNode === undefined ? expectHtml : expectHtmlWhenRemoveEmptyNode
        );
    }

    function runTestSplibAfter(
        caseIndex: number,
        input: string,
        nodeId: string,
        newNodeValue: string,
        expectHtml: string,
        newNodeValueWhenRemoveEmptyNode?: string,
        expectHtmlWhenRemoveEmptyNode?: string
    ) {
        runTest(caseIndex + ' - KeepEmpty', input, nodeId, false, false, newNodeValue, expectHtml);
        runTest(
            caseIndex + ' - RemoveEmpty',
            input,
            nodeId,
            false,
            true,
            newNodeValueWhenRemoveEmptyNode === undefined
                ? newNodeValue
                : newNodeValueWhenRemoveEmptyNode,
            expectHtmlWhenRemoveEmptyNode === undefined ? expectHtml : expectHtmlWhenRemoveEmptyNode
        );
    }

    it('split before', () => {
        runTestSplibBefore(0, '', 'id0', null, '');
        runTestSplibBefore(1, '<div id=id1></div>', 'id1', null, '<div id="id1"></div>');
        runTestSplibBefore(
            2,
            '<div id=id1><div id=id2></div></div>',
            'id2',
            null,
            '<div id="id1"><div id="id2"></div></div>'
        );
        runTestSplibBefore(
            3,
            '<div id=id1>test1<div id=id2>test2</div>test3</div>',
            'id2',
            'test1',
            '<div>test1</div><div id="id1"><div id="id2">test2</div>test3</div>'
        );
        runTestSplibBefore(
            4,
            '<div id=id1><div id=id2>test2</div>test3</div>',
            'id2',
            null,
            '<div id="id1"><div id="id2">test2</div>test3</div>'
        );
        runTestSplibBefore(
            5,
            '<div id=id1>test1<div id=id2>test2</div></div>',
            'id2',
            'test1',
            '<div>test1</div><div id="id1"><div id="id2">test2</div></div>'
        );
        runTestSplibBefore(
            6,
            '<div id=id1>&#8203;<div id=id2>test2</div></div>',
            'id2',
            '\u200b',
            '<div>​</div><div id="id1"><div id="id2">test2</div></div>',
            null,
            '<div id="id1"><div id="id2">test2</div></div>'
        );
        runTestSplibBefore(
            7,
            '<div id=id1><div id=id2>test2</div>&#8203;</div>',
            'id2',
            null,
            '<div id="id1"><div id="id2">test2</div>​</div>'
        );
        runTestSplibBefore(
            8,
            '<div id=id1><div>test1</div><div id=id2>test2</div><div>test3</div></div>',
            'id2',
            'test1',
            '<div><div>test1</div></div><div id="id1"><div id="id2">test2</div><div>test3</div></div>'
        );
        runTestSplibBefore(
            9,
            '<div id=id1><img><div id=id2></div><img></div>',
            'id2',
            '',
            '<div><img></div><div id="id1"><div id="id2"></div><img></div>'
        );
    });

    it('split after', () => {
        runTestSplibAfter(0, '', 'id0', null, '');
        runTestSplibAfter(1, '<div id=id1></div>', 'id1', null, '<div id="id1"></div>');
        runTestSplibAfter(
            2,
            '<div id=id1><div id=id2></div></div>',
            'id2',
            null,
            '<div id="id1"><div id="id2"></div></div>'
        );
        runTestSplibAfter(
            3,
            '<div id=id1>test1<div id=id2>test2</div>test3</div>',
            'id2',
            'test3',
            '<div id="id1">test1<div id="id2">test2</div></div><div>test3</div>'
        );
        runTestSplibAfter(
            4,
            '<div id=id1><div id=id2>test2</div>test3</div>',
            'id2',
            'test3',
            '<div id="id1"><div id="id2">test2</div></div><div>test3</div>'
        );
        runTestSplibAfter(
            5,
            '<div id=id1>test1<div id=id2>test2</div></div>',
            'id2',
            null,
            '<div id="id1">test1<div id="id2">test2</div></div>'
        );
        runTestSplibAfter(
            6,
            '<div id=id1>&#8203;<div id=id2>test2</div></div>',
            'id2',
            null,
            '<div id="id1">​<div id="id2">test2</div></div>'
        );
        runTestSplibAfter(
            7,
            '<div id=id1><div id=id2>test2</div>&#8203;</div>',
            'id2',
            '\u200b',
            '<div id="id1"><div id="id2">test2</div></div><div>​</div>',
            null,
            '<div id="id1"><div id="id2">test2</div></div>'
        );
        runTestSplibAfter(
            8,
            '<div id=id1><div>test1</div><div id=id2>test2</div><div>test3</div></div>',
            'id2',
            'test3',
            '<div id="id1"><div>test1</div><div id="id2">test2</div></div><div><div>test3</div></div>'
        );
        runTestSplibAfter(
            9,
            '<div id=id1><img><div id=id2></div><img></div>',
            'id2',
            '',
            '<div id="id1"><img><div id="id2"></div></div><div><img></div>'
        );
    });
});

describe('splitBalancedNodeRange()', () => {
    function runTest(
        caseIndex: number,
        input: string,
        ids: string[],
        expectNodeValue: string,
        expectHtml: string
    ) {
        let index = `case index: ${caseIndex}`;
        let div = document.createElement('div');
        document.body.appendChild(div);
        div.innerHTML = input;
        let nodes = ids.map(id => document.getElementById(id));
        let newNode = splitBalancedNodeRange(nodes);
        if (expectNodeValue === null) {
            expect(newNode).toBeNull(index + ' - NodeValue');
        } else {
            expect(newNode).not.toBeNull(index + ' - NodeValue');
            let value = newNode.nodeType == NodeType.Text ? newNode.nodeValue : newNode.textContent;
            expect(value).toBe(expectNodeValue, index + ' - NodeValue');
        }
        expect(div.innerHTML).toBe(expectHtml, index + ' - HTML');
        document.body.removeChild(div);
    }

    it('', () => {
        runTest(0, '', [], null, '');
        runTest(
            1,
            '<div>test1<div id=id1>test2</div>test3</div>',
            ['id1'],
            'test2',
            '<div>test1</div><div><div id="id1">test2</div></div><div>test3</div>'
        );
        runTest(
            2,
            '<div>test1<div id=id1>test2</div>test3<div id=id2>test4</div>test5</div>',
            ['id1', 'id2'],
            'test2test3test4',
            '<div>test1</div><div><div id="id1">test2</div>test3<div id="id2">test4</div></div><div>test5</div>'
        );
        runTest(
            3,
            '<div>test1<div id=id1>test2</div>test3<div id=id2>test4</div>test5</div>',
            ['id2', 'id1'],
            'test2test3test4',
            '<div>test1</div><div><div id="id1">test2</div>test3<div id="id2">test4</div></div><div>test5</div>'
        );
        runTest(
            4,
            '<div>test1<div id=id1>test2</div>test3<div id=id2>test4</div>test5</div><div id=div3></div>',
            ['id1', 'id2', 'id3'],
            null,
            '<div>test1<div id="id1">test2</div>test3<div id="id2">test4</div>test5</div><div id="div3"></div>'
        );
        runTest(
            5,
            '<div>test1<div id=id1>test2</div>test3<div id=id2>test4</div>test5</div><div id=div3></div>',
            ['id1', 'id3', 'id2'],
            'test2test3test4',
            '<div>test1</div><div><div id="id1">test2</div>test3<div id="id2">test4</div></div><div>test5</div><div id="div3"></div>'
        );
    });
});
