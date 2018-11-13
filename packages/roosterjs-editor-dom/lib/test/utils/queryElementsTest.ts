import createRange from '../../selection/createRange';
import Position from '../../selection/Position';
import queryElements from '../../utils/queryElements';
import { QueryScope } from 'roosterjs-editor-types';

function runTest(
    caseIndex: number,
    input: string,
    containerId: string,
    selector: string,
    scope: QueryScope,
    range: (root: HTMLElement) => Range,
    expectIds: string[]
) {
    let div = document.createElement('div');
    document.body.appendChild(div);
    div.innerHTML = input;
    let container = document.getElementById(containerId);
    let results = queryElements(container, selector, null, scope, range && range(div));
    let resultIds = results.map(result => result.id);
    expect(resultIds).toEqual(expectIds, `case index: ${caseIndex}`);
    document.body.removeChild(div);
}

describe('queryElements() QueryScope.Body', () => {
    function runTestForBody(
        caseIndex: number,
        input: string,
        containerId: string,
        selector: string,
        expectIds: string[]
    ) {
        runTest(caseIndex, input, containerId, selector, QueryScope.Body, null, expectIds);
    }

    it('case 0', () => {
        runTestForBody(0, '', 'id0', '', []);
    });

    it('case 1', () => {
        runTestForBody(1, '<div id=id1></div>', 'id1', '', []);
    });

    it('case 2', () => {
        runTestForBody(1, '<div id=id1></div>', 'id1', '*', []);
    });

    it('case 3', () => {
        runTestForBody(
            1,
            '<div id=id1><div id=id2><div id=id3>test1</div></div><div id=id4>test2</div></div>',
            'id1',
            '*',
            ['id2', 'id3', 'id4']
        );
    });

    it('case 4', () => {
        runTestForBody(
            1,
            '<div id=id1><div id=id2><span id=id3>test1</span></div><span id=id4>test2</span></div>',
            'id1',
            'span',
            ['id3', 'id4']
        );
    });

    it('case 5', () => {
        runTestForBody(
            1,
            '<div id=id1><div id=id2><span id=id3>test1</span></div><span id=id4>test2</span></div>',
            'id2',
            'span',
            ['id3']
        );
    });
});

describe('queryElements() QueryScope.OnSelection', () => {
    function runTestOnSelection(
        caseIndex: number,
        input: string,
        containerId: string,
        selector: string,
        range: (root: HTMLElement) => Range,
        expectIds: string[]
    ) {
        runTest(caseIndex, input, containerId, selector, QueryScope.OnSelection, range, expectIds);
    }

    it('case 0', () => {
        runTestOnSelection(0, '', 'id0', '', () => document.createRange(), []);
    });

    it('case 1', () => {
        runTestOnSelection(1, '<div id=id1></div>', 'id1', '', () => document.createRange(), []);
    });

    it('case 2', () => {
        runTestOnSelection(1, '<div id=id1></div>', 'id1', '*', () => document.createRange(), []);
    });

    it('case 3', () => {
        runTestOnSelection(
            1,
            '<div id=id1><div id=id2><div id=id3>test1</div></div><div id=id4>test2</div></div>',
            'id1',
            '*',
            root => createRange(root.firstChild.firstChild),
            ['id2', 'id3', 'id4']
        );
    });

    it('case 4', () => {
        runTestOnSelection(
            1,
            '<div id=id1><div id=id2><div id=id3>test1</div></div><div id=id4>test2</div></div>',
            'id1',
            '*',
            root => createRange(root.firstChild.firstChild.firstChild),
            ['id2', 'id3']
        );
    });

    it('case 5', () => {
        runTestOnSelection(
            1,
            '<div id=id1><div id=id2><span id=id3>test1</span></div><span id=id4>test2</span></div>',
            'id1',
            'span',
            root => createRange(root.firstChild.firstChild),
            ['id3', 'id4']
        );
    });

    it('case 6', () => {
        runTestOnSelection(
            1,
            '<span id=id1><span id=id2><span id=id3>test1</span></span><span id=id4>test2</span></span>',
            'id1',
            'span',
            root => createRange(root.firstChild.firstChild.firstChild.firstChild),
            ['id2', 'id3']
        );
    });
});

describe('queryElements() QueryScope.InSelection', () => {
    function runTestInSelection(
        caseIndex: number,
        input: string,
        containerId: string,
        selector: string,
        range: (root: HTMLElement) => Range,
        expectIds: string[]
    ) {
        runTest(caseIndex, input, containerId, selector, QueryScope.InSelection, range, expectIds);
    }

    it('case 0', () => {
        runTestInSelection(0, '', 'id0', '', () => document.createRange(), []);
    });

    it('case 1', () => {
        runTestInSelection(1, '<div id=id1></div>', 'id1', '', () => document.createRange(), []);
    });

    it('case 2', () => {
        runTestInSelection(1, '<div id=id1></div>', 'id1', '*', () => document.createRange(), []);
    });

    it('case 3', () => {
        runTestInSelection(
            1,
            '<div id=id1><div id=id2><div id=id3>test1</div></div><div id=id4>test2</div></div>',
            'id1',
            '*',
            root => createRange(root.firstChild.firstChild),
            ['id2', 'id3', 'id4']
        );
    });

    it('case 4', () => {
        runTestInSelection(
            1,
            '<div id=id1><div id=id2><div id=id3>test1</div></div><div id=id4>test2</div></div>',
            'id1',
            '*',
            root => createRange(root.firstChild.firstChild.firstChild),
            ['id2', 'id3']
        );
    });

    it('case 5', () => {
        runTestInSelection(
            1,
            '<div id=id1><div id=id2><span id=id3>test1</span></div><span id=id4>test2</span></div>',
            'id1',
            'span',
            root => createRange(root.firstChild.firstChild),
            ['id3', 'id4']
        );
    });

    it('case 6', () => {
        runTestInSelection(
            1,
            '<span id=id1><span id=id2><span id=id3>test1</span></span><span id=id4>test2</span></span>',
            'id1',
            'span',
            root =>
                createRange(
                    new Position(root.firstChild.firstChild.firstChild.firstChild, 1),
                    new Position(root.firstChild.firstChild.firstChild.firstChild, 2)
                ),
            []
        );
    });
});
