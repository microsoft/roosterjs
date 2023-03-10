import { ContentModelCode } from '../../../lib/publicTypes/decorator/ContentModelCode';
import { ContentModelLink } from '../../../lib/publicTypes/decorator/ContentModelLink';
import { ContentModelSegment } from '../../../lib/publicTypes/segment/ContentModelSegment';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { handleSegmentDecorator } from '../../../lib/modelToDom/handlers/handleSegmentDecorator';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';

describe('handleSegmentDecorator', () => {
    let parent: HTMLElement;
    let context: ModelToDomContext;

    beforeEach(() => {
        context = createModelToDomContext();
    });

    function runTest(
        link: ContentModelLink | undefined,
        code: ContentModelCode | undefined,
        expectedInnerHTML: string
    ) {
        parent = document.createElement('div');
        parent.innerHTML = 'test';

        const segment: ContentModelSegment = {
            segmentType: 'Br',
            format: {},
            link: link,
            code: code,
        };

        handleSegmentDecorator(document, parent.firstChild!, segment, context);

        expect(parent.innerHTML).toBe(expectedInnerHTML);
    }

    it('simple link', () => {
        const link: ContentModelLink = {
            format: {
                href: 'http://test.com/test',
                underline: true,
            },
            dataset: {},
        };

        runTest(link, undefined, '<a href="http://test.com/test">test</a>');
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

        runTest(link, undefined, '<a href="http://test.com/test" style="color: red;">test</a>');
    });

    it('link without underline', () => {
        const link: ContentModelLink = {
            format: {
                href: 'http://test.com/test',
            },
            dataset: {},
        };

        runTest(
            link,
            undefined,
            '<a href="http://test.com/test" style="text-decoration: none;">test</a>'
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

        runTest(link, undefined, '<a href="http://test.com/test" data-a="b" data-c="d">test</a>');
    });

    it('simple code', () => {
        const code: ContentModelCode = {
            format: {
                fontFamily: 'monospace',
            },
        };

        runTest(undefined, code, '<code>test</code>');
    });

    it('code with font', () => {
        const code: ContentModelCode = {
            format: {
                fontFamily: 'Arial',
            },
        };

        runTest(undefined, code, '<code style="font-family: Arial;">test</code>');
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

        runTest(link, code, '<a href="http://test.com/test"><code>test</code></a>');
    });
});
