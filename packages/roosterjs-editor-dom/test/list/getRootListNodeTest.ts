import getRootListNode, { SelectorToTypeMap } from '../../lib/list/getRootListNode';

describe('getRootListNode', () => {
    it('null input', () => {
        expect(getRootListNode(null, 'ol', null)).toBeNull();
        expect(getRootListNode(null, 'ol', document.createElement('div'))).toBeNull();
        expect(
            getRootListNode(
                {
                    rootNode: document.createElement('div'),
                    skipTags: [],
                },
                'ol',
                null
            )
        ).toBeNull();
    });

    const StartNode = 'StartNode';

    function runTest(html: string, selector: keyof SelectorToTypeMap, expectedOuterHTML: string) {
        const div = document.createElement('div');
        document.body.appendChild(div);
        div.innerHTML = html;

        const startNode = document.getElementById(StartNode);
        if (!startNode) {
            throw new Error('StartNode not found');
        }

        const result = getRootListNode(
            {
                rootNode: div,
                skipTags: [],
            },
            selector,
            startNode
        );

        if (expectedOuterHTML === null) {
            expect(result).toBeNull();
        } else {
            expect(result.outerHTML).toBe(expectedOuterHTML);
        }

        document.body.removeChild(div);
    }

    it('No list node', () => {
        runTest(`<div id="${StartNode}"></div>`, 'ol', null);
    });

    it('List node does not contain start node', () => {
        runTest(`<ol><li>test</li></ol><div id="${StartNode}"></div>`, 'ol', null);
    });

    it('List node is start node', () => {
        runTest(
            `<ol id="${StartNode}"><li>test</li></ol><div></div>`,
            'ol',
            `<ol id="${StartNode}"><li>test</li></ol>`
        );
    });

    it('List node contains start node', () => {
        runTest(
            `<ol><li>test<div id="${StartNode}"></div></li></ol>`,
            'ol',
            `<ol><li>test<div id="${StartNode}"></div></li></ol>`
        );
    });

    it('List node contains list node', () => {
        runTest(
            `<ol><li>test</li><ol id="${StartNode}"></ol></ol>`,
            'ol',
            `<ol><li>test</li><ol id="${StartNode}"></ol></ol>`
        );
    });

    it('List node is of different tag name', () => {
        runTest(`<ul><li>test</li><ul id="${StartNode}"></ul></ul>`, 'ol', null);
    });

    it('Outer list node is of different tag name', () => {
        runTest(
            `<ul><li>test</li><ol id="${StartNode}"></ol></ul>`,
            'ol',
            `<ol id="${StartNode}"></ol>`
        );
    });

    it('Multiple levels of list node', () => {
        runTest(
            `<ol><li>test</li><ol><li><div id="${StartNode}"></div></li></ol></ol>`,
            'ol',
            `<ol><li>test</li><ol><li><div id="${StartNode}"></div></li></ol></ol>`
        );
    });

    it('Multiple levels of list node with different tag names', () => {
        runTest(
            `<ol><li>test</li><ul><li><div id="${StartNode}"></div></li></ul></ol>`,
            'ol',
            `<ol><li>test</li><ul><li><div id="${StartNode}"></div></li></ul></ol>`
        );
    });

    it('Multiple levels of list node with different tag names and selector for both', () => {
        runTest(
            `<ol><li>test</li><ul><li><div id="${StartNode}"></div></li></ul></ol>`,
            'ol,ul',
            `<ol><li>test</li><ul><li><div id="${StartNode}"></div></li></ul></ol>`
        );
    });
});
