import getBlockElementAtNode from '../../lib/blockElements/getBlockElementAtNode';
import VListChain from '../../lib/list/VListChain';
import VListItem from '../../lib/list/VListItem';
import { ListType, PositionType } from 'roosterjs-editor-types';
import { Position } from 'roosterjs-editor-dom';

const CurrentNode = 'CurrentNode';

describe('createListChains', () => {
    let startIndex: number;
    const CHAIN_NAME_PREFIX = 'TestChain';

    beforeEach(() => {
        startIndex = 0;
    });

    function nameGenerator() {
        return CHAIN_NAME_PREFIX + startIndex++;
    }

    it('null input', () => {
        const chains = VListChain.createListChains(null);
        expect(chains).toEqual([]);
    });

    function runTest(html: string, expectedHtml: string) {
        const div = document.createElement('div');
        document.body.appendChild(div);
        div.innerHTML = html;

        const currentNode = document.getElementById(CurrentNode);
        VListChain.createListChains(
            {
                rootNode: div,
                skipTags: [],
            },
            currentNode,
            nameGenerator
        );

        expect(div.innerHTML).toBe(expectedHtml);
        document.body.removeChild(div);
    }

    it('No list', () => {
        runTest('<div>test</div>', '<div>test</div>');
    });

    it('One list', () => {
        runTest(
            '<div>test</div><ol><li>item1</li></ol>',
            `<div>test</div><ol data-listchain="${CHAIN_NAME_PREFIX}0"><li>item1</li></ol>`
        );
    });

    it('One nested list', () => {
        runTest(
            '<div>test</div><ol><li>item1</li><ol><li>item1.1</li</ol></ol>',
            `<div>test</div><ol data-listchain="${CHAIN_NAME_PREFIX}0"><li>item1</li><ol><li>item1.1</li></ol></ol>`
        );
    });

    it('Two separated lists', () => {
        runTest(
            '<ol><li>item1</li></ol><div>test</div><ol><li>item2</li>',
            `<ol data-listchain="${CHAIN_NAME_PREFIX}0"><li>item1</li></ol><div>test</div><ol data-listchain="${CHAIN_NAME_PREFIX}1"><li>item2</li></ol>`
        );
    });

    it('Two continuously lists', () => {
        runTest(
            '<ol><li>item1</li><li>item2</li></ol><div>test</div><ol start="3"><li>item3</li></ol>',
            `<ol data-listchain="${CHAIN_NAME_PREFIX}0"><li>item1</li><li>item2</li></ol><div>test</div><ol data-listchain="${CHAIN_NAME_PREFIX}0" start="3"><li>item3</li></ol>`
        );
    });

    it('Two list chains', () => {
        runTest(
            '<ol><li>item1</li><li>item2</li><li>item3</li></ol><div>test</div><ol><li>itemA</li><li>itemB</li></ol><ol start="4"><li>item4</li></ol><div>test</div><ol start="3"><li>itemC</li></ol>',
            `<ol data-listchain="${CHAIN_NAME_PREFIX}0"><li>item1</li><li>item2</li><li>item3</li></ol><div>test</div><ol data-listchain="${CHAIN_NAME_PREFIX}1"><li>itemA</li><li>itemB</li></ol><ol data-listchain="${CHAIN_NAME_PREFIX}0" start="4"><li>item4</li></ol><div>test</div><ol data-listchain="${CHAIN_NAME_PREFIX}1" start="3"><li>itemC</li></ol>`
        );
    });

    it('Unordered list in a chain', () => {
        runTest(
            '<ol><li>item1</li><li>item2</li></ol><div>test</div><ul><li>test</li></ul><div>test</div><ol start="3"><li>item3</li></ol>',
            `<ol data-listchain="${CHAIN_NAME_PREFIX}0"><li>item1</li><li>item2</li></ol><div>test</div><ul><li>test</li></ul><div>test</div><ol data-listchain="${CHAIN_NAME_PREFIX}0" start="3"><li>item3</li></ol>`
        );
    });

    it('Nested list', () => {
        runTest(
            '<ol><li>item1</li><ol><li>item1.1</li><li>item1.2</li></ol></ol><div>test</div><ol start="2"><li>item2</li></ol>',
            `<ol data-listchain="${CHAIN_NAME_PREFIX}0"><li>item1</li><ol><li>item1.1</li><li>item1.2</li></ol></ol><div>test</div><ol data-listchain="${CHAIN_NAME_PREFIX}0" start="2"><li>item2</li></ol>`
        );
    });

    it('Nested list for separated lists', () => {
        runTest(
            '<ol><li>item1</li><ol><li>item1.1</li><li>item1.2</li></ol></ol><div>test</div><ol start="3"><li>item2</li></ol>',
            `<ol data-listchain="${CHAIN_NAME_PREFIX}0"><li>item1</li><ol><li>item1.1</li><li>item1.2</li></ol></ol><div>test</div><ol data-listchain="${CHAIN_NAME_PREFIX}1" start="3"><li>item2</li></ol>`
        );
    });

    it('Current node', () => {
        runTest(
            `<ol><li>item1</li><ol><li>item1.1</li><li>item1.2</li></ol></ol><div id="${CurrentNode}">test</div><ol start="2"><li>item2</li></ol>`,
            `<ol data-listchain="${CHAIN_NAME_PREFIX}0"><li>item1</li><ol><li>item1.1</li><li>item1.2</li></ol></ol><div id="${CurrentNode}">test</div><ol data-listchain="${CHAIN_NAME_PREFIX}0" data-listchainafter="true" start="2"><li>item2</li></ol>`
        );
    });
});

describe('VListChain.canAppendAtCursor', () => {
    function runTest(html: string, num: number, expectedResult: boolean) {
        const div = document.createElement('div');
        document.body.appendChild(div);
        div.innerHTML = html;

        const currentNode = document.getElementById(CurrentNode);
        const chains = VListChain.createListChains(
            {
                rootNode: div,
                skipTags: [],
            },
            currentNode
        );
        const result = chains[0].canAppendAtCursor(num);

        expect(result).toBe(expectedResult);
        document.body.removeChild(div);
    }

    it('No current node', () => {
        runTest('<ol><li>item1</li></ol>', 1, false);
        runTest('<ol><li>item1</li></ol>', 2, true);
        runTest('<ol><li>item1</li></ol>', 3, false);
    });

    it('Current node is before list', () => {
        runTest(`<div id="${CurrentNode}">test</div><ol><li>item1</li></ol>`, 1, true);
        runTest(`<div id="${CurrentNode}">test</div><ol><li>item1</li></ol>`, 2, false);
        runTest(`<div id="${CurrentNode}">test</div><ol><li>item1</li></ol>`, 3, false);
    });

    it('Current node is list', () => {
        runTest(`<ol id="${CurrentNode}"><li>item1</li></ol>`, 1, false);
        runTest(`<ol id="${CurrentNode}"><li>item1</li></ol>`, 2, true);
        runTest(`<ol id="${CurrentNode}"><li>item1</li></ol>`, 3, false);
    });

    it('Current node is after list', () => {
        runTest(`<ol><li>item1</li></ol><div id="${CurrentNode}">test</div>`, 1, false);
        runTest(`<ol><li>item1</li></ol><div id="${CurrentNode}">test</div>`, 2, true);
        runTest(`<ol><li>item1</li></ol><div id="${CurrentNode}">test</div>`, 3, false);
    });

    it('Current node is between lists', () => {
        runTest(
            `<ol><li>item1</li></ol><div id="${CurrentNode}">test</div><ol start="2"><li>item2</li></ol>`,
            1,
            false
        );
        runTest(
            `<ol><li>item1</li></ol><div id="${CurrentNode}">test</div><ol start="2"><li>item2</li></ol>`,
            2,
            true
        );
        runTest(
            `<ol><li>item1</li></ol><div id="${CurrentNode}">test</div><ol start="2"><li>item2</li></ol>`,
            3,
            false
        );
    });

    it('Current node is between multiple item lists', () => {
        runTest(
            `<ol><li>item1</li><li>item2</li><ol><li>item2.1</li></ol></ol><div id="${CurrentNode}">test</div><ol start="3"><li>item3</li></ol>`,
            1,
            false
        );
        runTest(
            `<ol><li>item1</li><li>item2</li><ol><li>item2.1</li></ol></ol><div id="${CurrentNode}">test</div><ol start="3"><li>item3</li></ol>`,
            2,
            false
        );
        runTest(
            `<ol><li>item1</li><li>item2</li><ol><li>item2.1</li></ol></ol><div id="${CurrentNode}">test</div><ol start="3"><li>item3</li></ol>`,
            3,
            true
        );
    });
});

describe('VListChain.createVListAtNode', () => {
    let startIndex: number;
    const CHAIN_NAME_PREFIX = 'TestChain';

    beforeEach(() => {
        startIndex = 0;
    });

    function nameGenerator() {
        return CHAIN_NAME_PREFIX + startIndex++;
    }

    function runTest(
        html: string,
        startNumber: number,
        expectedHtml: string,
        expectedItems: { listTypes: ListType[]; outerHTML: string }[]
    ) {
        const div = document.createElement('div');

        document.body.appendChild(div);
        div.innerHTML = html;

        const chain = VListChain.createListChains(
            {
                rootNode: div,
                skipTags: [],
            },
            null,
            nameGenerator
        )[0];
        const node = document.getElementById(CurrentNode);
        const block = node && getBlockElementAtNode(div, node);
        const vList = chain.createVListAtBlock(block?.collapseToSingleElement(), startNumber);

        if (expectedItems) {
            const items = (<any>vList).items as VListItem[];
            const itemsMap = items.map(item => ({
                listTypes: (<any>item).listTypes as ListType[],
                outerHTML: (<HTMLElement>item.getNode()).outerHTML,
            }));

            expect(itemsMap).toEqual(expectedItems);
        } else {
            expect(vList).toBeNull();
        }

        expect(div.innerHTML).toBe(expectedHtml);

        document.body.removeChild(div);
    }

    it('null input', () => {
        runTest(
            '<ol><li>item</li></ol>',
            1,
            `<ol data-listchain="${CHAIN_NAME_PREFIX}0"><li>item</li></ol>`,
            null
        );
    });

    it('Single list', () => {
        runTest(
            `<ol><li>item</li></ol><div id="${CurrentNode}">test</div>`,
            2,
            `<ol data-listchain="${CHAIN_NAME_PREFIX}0"><li>item</li></ol><ol data-listchain="${CHAIN_NAME_PREFIX}0" start="2"></ol><li id="${CurrentNode}">test</li>`,
            [
                {
                    listTypes: [ListType.None],
                    outerHTML: `<li id="${CurrentNode}">test</li>`,
                },
            ]
        );
    });
});

describe('VListChain.commit', () => {
    function runTest(
        html: string,
        operation: (chains: VListChain[]) => void,
        expectedHtml: string
    ) {
        const div = document.createElement('div');

        document.body.appendChild(div);
        div.innerHTML = html;

        const chains = VListChain.createListChains(
            {
                rootNode: div,
                skipTags: [],
            },
            null
        );

        operation(chains);
        chains.forEach(chain => chain.commit());
        expect(div.innerHTML).toBe(expectedHtml);

        document.body.removeChild(div);
    }

    it('No op', () => {
        runTest('<ol><li>test</li></ol>', () => {}, '<ol><li>test</li></ol>');
    });

    it('Add a new list', () => {
        runTest(
            '<ol><li>test</li></ol><div id="div1">test2</div>',
            chains => {
                const div = document.getElementById('div1');
                const vList = chains[0].createVListAtBlock(div, 1); // Specify a wrong start number, it should still work
                vList.changeListType(
                    new Position(div, PositionType.Begin),
                    new Position(div, PositionType.End),
                    ListType.Ordered
                );
                vList.writeBack();
            },
            '<ol><li>test</li></ol><ol start="2"><li id="div1">test2</li></ol>'
        );
    });

    it('Add a new list between two existing lists', () => {
        runTest(
            '<ol><li>item1</li></ol><div id="div1">item2</div><ol start="2"><li>item3</li></ol>',
            chains => {
                const div = document.getElementById('div1');
                const vList = chains[0].createVListAtBlock(div, 1); // Specify a wrong start number, it should still work
                vList.changeListType(
                    new Position(div, PositionType.Begin),
                    new Position(div, PositionType.End),
                    ListType.Ordered
                );
                vList.writeBack();
            },
            '<ol><li>item1</li></ol><ol start="2"><li id="div1">item2</li></ol><ol start="3"><li>item3</li></ol>'
        );
    });

    it('Add a new list between two existing lists with two chains', () => {
        runTest(
            '<ol><li>item1</li></ol><ol><li>itemA</li><li>itemB</li><li>itemC</li></ol><div id="div1">item2</div><ol start="2"><li>item3</li></ol>',
            chains => {
                const div = document.getElementById('div1');
                const vList = chains[0].createVListAtBlock(div, 1); // Specify a wrong start number, it should still work
                vList.changeListType(
                    new Position(div, PositionType.Begin),
                    new Position(div, PositionType.End),
                    ListType.Ordered
                );
                vList.writeBack();
            },
            '<ol><li>item1</li></ol><ol><li>itemA</li><li>itemB</li><li>itemC</li></ol><ol start="2"><li id="div1">item2</li></ol><ol start="3"><li>item3</li></ol>'
        );
    });

    it('Add a new list item', () => {
        runTest(
            '<ol id="ol1"><li>item1</li></ol><ol start="2"><li>item3</li></ol>',
            chains => {
                const ol1 = document.getElementById('ol1');
                const li = document.createElement('li');
                li.innerHTML = 'item2';
                ol1.appendChild(li);
            },
            '<ol id="ol1"><li>item1</li><li>item2</li></ol><ol start="3"><li>item3</li></ol>'
        );
    });

    it('Remove a list item', () => {
        runTest(
            '<ol><li>item1</li><li id="li2">item2</li></ol><ol start="3"><li>item3</li></ol>',
            chains => {
                const li = document.getElementById('li2');
                li.parentNode.removeChild(li);
            },
            '<ol><li>item1</li></ol><ol start="2"><li>item3</li></ol>'
        );
    });

    it('Remove a list', () => {
        runTest(
            '<ol><li>item1</li><li>item2</li></ol><ol start="3" id="ol2"><li>item3</li></ol><ol start="4"><li>item4</li></ol>',
            chains => {
                const ol = document.getElementById('ol2');
                ol.parentNode.removeChild(ol);
            },
            '<ol><li>item1</li><li>item2</li></ol><ol start="3"><li>item4</li></ol>'
        );
    });

    it('Remove the first list item', () => {
        runTest(
            '<ol><li id="li1">item1</li><li>item2</li></ol><ol start="3"><li>item3</li></ol>',
            chains => {
                const li = document.getElementById('li1');
                li.parentNode.removeChild(li);
            },
            '<ol><li>item2</li></ol><ol start="2"><li>item3</li></ol>'
        );
    });

    it('Remove the first list', () => {
        runTest(
            '<ol id="ol1"><li>item1</li><li>item2</li></ol><ol start="3"><li>item3</li></ol><ol start="4"><li>item4</li></ol>',
            chains => {
                const ol = document.getElementById('ol1');
                ol.parentNode.removeChild(ol);
            },
            '<ol><li>item3</li></ol><ol start="2"><li>item4</li></ol>'
        );
    });
});
