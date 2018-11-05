import isNodeEmpty from '../../utils/isNodeEmpty';

describe('isNodeEmpty() trim = false', () => {
    function runTest(input: string, getNode: () => Node, expectResult: boolean) {
        let div = document.createElement('div');
        document.body.appendChild(div);
        div.innerHTML = input;
        let node = getNode();
        let result = isNodeEmpty(node);
        expect(result).toEqual(expectResult, input);
        document.body.removeChild(div);
    }

    it('Null node', () => {
        runTest('', () => null, false);
    });

    it('Empty text node', () => {
        runTest(
            '<div id=id1></div>',
            () => {
                let div = $('id1');
                let text = document.createTextNode('');
                div.appendChild(text);
                return text;
            },
            true
        );
    });
    it('Text node', () => {
        runTest('<div id=id1>test</div>', () => $('id1').firstChild, false);
    });
    it('Space node', () => {
        runTest('<div id=id1>&nbsp;</div>', () => $('id1').firstChild, false);
    });
    it('ZWS node', () => {
        runTest('<div id=id1>&#8203;</div>', () => $('id1').firstChild, true);
    });
    it('Empty DIV node', () => {
        runTest('<div id=id1></div>', () => $('id1'), true);
    });
    it('DIV node', () => {
        runTest('<div id=id1>test</div>', () => $('id1'), false);
    });
    it('IMG node', () => {
        runTest('<img id=id1>', () => $('id1'), false);
    });
    it('TABLE node', () => {
        runTest('<table id=id1></table>', () => $('id1'), true);
    });
    it('LI node', () => {
        runTest('<ol><li id=id1></li></ol>', () => $('id1'), true);
    });
    it('Contains LI node', () => {
        runTest('<ol id=id1><li></li></ol>', () => $('id1'), false);
    });
    it('DIV contains IMG/TABLE/LI node', () => {
        runTest('<div id=id2><img id=id1></div>', () => $('id2'), false);
        runTest('<div id=id2><table id=id1></table></div>', () => $('id2'), false);
        runTest('<div id=id2><ol><li id=id1></li></ol></div>', () => $('id2'), false);
    });
    it('Children nodes contain ZWS only', () => {
        runTest(
            '<div id=id1><span>&#8203;</span><span>&#8203;&#8203;</span></div>',
            () => $('id1'),
            true
        );
    });
});

describe('isNodeEmpty() trim = true', () => {
    function runTest(input: string, getNode: () => Node, expectResult: boolean) {
        let div = document.createElement('div');
        document.body.appendChild(div);
        div.innerHTML = input;
        let node = getNode();
        let result = isNodeEmpty(node, true);
        expect(result).toEqual(expectResult, input);
        document.body.removeChild(div);
    }

    it('Null node', () => {
        runTest('', () => null, false);
    });

    it('Empty text node', () => {
        runTest(
            '<div id=id1></div>',
            () => {
                let div = $('id1');
                let text = document.createTextNode('');
                div.appendChild(text);
                return text;
            },
            true
        );
    });
    it('Text node', () => {
        runTest('<div id=id1>test</div>', () => $('id1').firstChild, false);
    });
    it('Space node', () => {
        runTest('<div id=id1>&nbsp;</div>', () => $('id1').firstChild, true);
    });
    it('ZWS node', () => {
        runTest('<div id=id1>&#8203;</div>', () => $('id1').firstChild, true);
    });
    it('Empty DIV node', () => {
        runTest('<div id=id1></div>', () => $('id1'), true);
    });
    it('DIV node', () => {
        runTest('<div id=id1>test</div>', () => $('id1'), false);
    });
    it('IMG node', () => {
        runTest('<img id=id1>', () => $('id1'), false);
    });
    it('TABLE node', () => {
        runTest('<table id=id1></table>', () => $('id1'), true);
    });
    it('LI node', () => {
        runTest('<ol><li id=id1></li></ol>', () => $('id1'), true);
    });
    it('Contains LI node', () => {
        runTest('<ol id=id1><li></li></ol>', () => $('id1'), false);
    });
    it('DIV contains IMG/TABLE/LI node', () => {
        runTest('<div id=id2><img id=id1></div>', () => $('id2'), false);
        runTest('<div id=id2><table id=id1></table></div>', () => $('id2'), false);
        runTest('<div id=id2><ol><li id=id1></li></ol></div>', () => $('id2'), false);
    });
    it('Children nodes contain ZWS only', () => {
        runTest(
            '<div id=id1><span>&#8203;</span><span>&#8203;&#8203;</span></div>',
            () => $('id1'),
            true
        );
    });
});

function $(id: string) {
    return document.getElementById(id);
}
