import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { expectHtml } from '../../testUtils';
import { handleSegmentDecorator } from '../../../lib/modelToDom/handlers/handleSegmentDecorator';
import {
    ContentModelCode,
    ContentModelLink,
    ContentModelSegment,
    ContentModelText,
    ModelToDomContext,
} from 'roosterjs-content-model-types';

describe('handleSegmentDecorator', () => {
    let parent: HTMLElement;
    let context: ModelToDomContext;

    beforeEach(() => {
        context = createModelToDomContext();
    });

    function runTest(
        link: ContentModelLink | undefined,
        code: ContentModelCode | undefined,
        expectedInnerHTML: string,
        expectedSegmentNodesHTML: (string | string[])[]
    ) {
        parent = document.createElement('span');
        parent.textContent = 'test';

        const segment: ContentModelSegment = {
            segmentType: 'Br',
            format: {},
            link: link,
            code: code,
        };
        const segmentNodes: Node[] = [];

        handleSegmentDecorator(document, parent, segment, context, segmentNodes);

        expect(parent.innerHTML).toBe(expectedInnerHTML);
        expect(segmentNodes.length).toBe(expectedSegmentNodesHTML.length);
        expectedSegmentNodesHTML.forEach((expectedHTML, i) => {
            expectHtml((segmentNodes[i] as HTMLElement).outerHTML, expectedHTML);
        });
    }

    it('simple link', () => {
        const link: ContentModelLink = {
            format: {
                href: 'http://test.com/test',
                underline: true,
            },
            dataset: {},
        };

        runTest(link, undefined, '<a href="http://test.com/test">test</a>', [
            '<a href="http://test.com/test">test</a>',
        ]);
    });

    it('link with color', () => {
        const link: ContentModelLink = {
            format: {
                href: 'http://test.com/test',
                textColor: 'red',
                underline: true,
            },
            dataset: {},
        };

        runTest(link, undefined, '<a href="http://test.com/test" style="color: red;">test</a>', [
            '<a href="http://test.com/test" style="color: red;">test</a>',
        ]);
    });

    it('link without underline', () => {
        const link: ContentModelLink = {
            format: {
                href: 'http://test.com/test',
                underline: false,
            },
            dataset: {},
        };

        runTest(
            link,
            undefined,
            '<a href="http://test.com/test" style="text-decoration: none;">test</a>',
            ['<a href="http://test.com/test" style="text-decoration: none;">test</a>']
        );
    });

    it('link with dataset', () => {
        const link: ContentModelLink = {
            format: {
                href: 'http://test.com/test',
                underline: true,
            },
            dataset: {
                a: 'b',
                c: 'd',
            },
        };

        runTest(link, undefined, '<a href="http://test.com/test" data-a="b" data-c="d">test</a>', [
            '<a href="http://test.com/test" data-a="b" data-c="d">test</a>',
        ]);
    });

    it('simple code', () => {
        const code: ContentModelCode = {
            format: {
                fontFamily: 'monospace',
            },
        };

        runTest(undefined, code, '<code>test</code>', ['<code>test</code>']);
    });

    it('code with font', () => {
        const code: ContentModelCode = {
            format: {
                fontFamily: 'Arial',
            },
        };

        runTest(undefined, code, '<code style="font-family: Arial;">test</code>', [
            '<code style="font-family: Arial;">test</code>',
        ]);
    });

    it('link and code', () => {
        const link: ContentModelLink = {
            format: {
                href: 'http://test.com/test',
                underline: true,
            },
            dataset: {},
        };
        const code: ContentModelCode = {
            format: {
                fontFamily: 'monospace',
            },
        };

        runTest(link, code, '<code><a href="http://test.com/test">test</a></code>', [
            '<a href="http://test.com/test">test</a>',
            '<code><a href="http://test.com/test">test</a></code>',
        ]);
    });

    it('Link with onNodeCreated', () => {
        const parent = document.createElement('div');
        const span = document.createElement('span');
        const segment: ContentModelText = {
            segmentType: 'Text',
            format: {},
            text: 'test',
            link: {
                format: {
                    href: 'https://www.test.com',
                },
                dataset: {},
            },
            code: {
                format: {},
            },
        };

        parent.appendChild(span);

        const onNodeCreated = jasmine.createSpy('onNodeCreated');

        context.onNodeCreated = onNodeCreated;

        handleSegmentDecorator(document, span, segment, context, []);

        expect(parent.innerHTML).toBe(
            '<span><code><a href="https://www.test.com"></a></code></span>'
        );
        expect(onNodeCreated).toHaveBeenCalledTimes(2);
        expect(onNodeCreated.calls.argsFor(0)[0]).toBe(segment.link);
        expect(onNodeCreated.calls.argsFor(0)[1]).toBe(parent.querySelector('a'));
        expect(onNodeCreated.calls.argsFor(1)[0]).toBe(segment.code);
        expect(onNodeCreated.calls.argsFor(1)[1]).toBe(parent.querySelector('code'));
    });

    it('link with display: block', () => {
        const link: ContentModelLink = {
            format: {
                href: 'http://test.com/test',
                underline: true,
                display: 'block',
            },
            dataset: {},
        };

        runTest(
            link,
            undefined,
            '<a href="http://test.com/test" style="display: block;">test</a>',
            ['<a href="http://test.com/test" style="display: block;">test</a>']
        );
    });

    it('code with display: block', () => {
        const code: ContentModelCode = {
            format: {
                fontFamily: 'monospace',
                display: 'block',
            },
        };

        runTest(undefined, code, '<code style="display: block;">test</code>', [
            '<code style="display: block;">test</code>',
        ]);
    });

    it('link with background color', () => {
        const link: ContentModelLink = {
            format: {
                href: 'http://test.com/test',
                underline: true,
                backgroundColor: 'red',
            },
            dataset: {},
        };

        runTest(
            link,
            undefined,
            '<a href="http://test.com/test" style="background-color: red;">test</a>',
            ['<a href="http://test.com/test" style="background-color: red;">test</a>']
        );
    });
});
