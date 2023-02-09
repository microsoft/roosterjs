import { ContentModelLink } from '../../../lib/publicTypes/decorator/ContentModelLink';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { handleLink } from '../../../lib/modelToDom/handlers/handleLink';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';

describe('handleLink', () => {
    let parent: HTMLElement;
    let context: ModelToDomContext;

    beforeEach(() => {
        context = createModelToDomContext();
    });

    function runTest(link: ContentModelLink, expectedInnerHTML: string) {
        parent = document.createElement('div');
        parent.innerHTML = 'test';

        handleLink(document, parent.firstChild!, link, context);

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

        runTest(link, '<a href="http://test.com/test">test</a>');
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

        runTest(link, '<a href="http://test.com/test" style="color: red;">test</a>');
    });

    it('link without underline', () => {
        const link: ContentModelLink = {
            format: {
                href: 'http://test.com/test',
            },
            dataset: {},
        };

        runTest(link, '<a href="http://test.com/test" style="text-decoration: none;">test</a>');
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

        runTest(link, '<a href="http://test.com/test" data-a="b" data-c="d">test</a>');
    });
});
