import * as stackFormat from '../../../lib/modelToDom/utils/stackFormat';
import { ContentModelBlock } from '../../../lib/publicTypes/block/ContentModelBlock';
import { ContentModelBlockHandler } from '../../../lib/publicTypes/context/ContentModelHandler';
import { ContentModelImage } from '../../../lib/publicTypes/segment/ContentModelImage';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { handleImage } from '../../../lib/modelToDom/handlers/handleImage';
import { itChromeOnly } from 'roosterjs-editor-dom/test/DomTestHelper';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';

describe('handleSegment', () => {
    let parent: HTMLElement;
    let context: ModelToDomContext;
    let handleBlock: jasmine.Spy<ContentModelBlockHandler<ContentModelBlock>>;

    beforeEach(() => {
        handleBlock = jasmine.createSpy('handleBlock');
        context = createModelToDomContext(undefined, {
            modelHandlerOverride: {
                block: handleBlock,
            },
        });
    });

    function runTest(
        segment: ContentModelImage,
        expectedInnerHTML: string,
        expectedCreateBlockFromContentModelCalledTimes: number
    ) {
        parent = document.createElement('div');

        handleImage(document, parent, segment, context);

        expect(parent.innerHTML).toBe(expectedInnerHTML);
        expect(handleBlock).toHaveBeenCalledTimes(expectedCreateBlockFromContentModelCalledTimes);
    }

    it('image segment', () => {
        const segment: ContentModelImage = {
            segmentType: 'Image',
            src: 'http://test.com/test',
            format: {},
            dataset: {},
        };

        runTest(segment, '<span><img src="http://test.com/test"></span>', 0);

        expect(context.imageSelection).toBeUndefined();
    });

    it('image segment with image selection', () => {
        const segment: ContentModelImage = {
            segmentType: 'Image',
            src: 'http://test.com/test',
            format: {},
            isSelectedAsImageSelection: true,
            dataset: {},
        };

        runTest(segment, '<span><img src="http://test.com/test"></span>', 0);

        expect(context.imageSelection!.image.src).toBe('http://test.com/test');
    });

    it('image segment with alt and title', () => {
        const segment: ContentModelImage = {
            segmentType: 'Image',
            src: 'http://test.com/test',
            format: {},
            alt: 'a',
            title: 'b',
            dataset: {},
        };

        runTest(segment, '<span><img src="http://test.com/test" alt="a" title="b"></span>', 0);
    });

    it('image segment with link', () => {
        const segment: ContentModelImage = {
            segmentType: 'Image',
            src: 'http://test.com/test',
            format: {},
            link: { format: { href: '/test', underline: true }, dataset: {} },
            dataset: {},
        };

        runTest(segment, '<span><a href="/test"><img src="http://test.com/test"></a></span>', 0);
    });

    itChromeOnly('image segment with size', () => {
        const segment: ContentModelImage = {
            segmentType: 'Image',
            src: 'http://test.com/test',
            format: { width: '100px', height: '200px' },
            link: { format: { href: '/test', underline: true }, dataset: {} },
            dataset: {},
        };

        runTest(
            segment,
            '<span><a href="/test"><img src="http://test.com/test" width="100" height="200" style="width: 100px; height: 200px;"></a></span>',
            0
        );
    });

    it('image segment with dataset', () => {
        const segment: ContentModelImage = {
            segmentType: 'Image',
            src: 'http://test.com/test',
            format: {},
            link: { format: { href: '/test', underline: true }, dataset: {} },
            dataset: {
                a: 'b',
            },
        };

        runTest(
            segment,
            '<span><a href="/test"><img src="http://test.com/test" data-a="b"></a></span>',
            0
        );
    });

    it('call stackFormat', () => {
        const segment: ContentModelImage = {
            segmentType: 'Image',
            src: 'http://test.com/test',
            format: {},
            link: { format: { href: '/test', underline: true }, dataset: {} },
            dataset: {},
        };

        spyOn(stackFormat, 'stackFormat').and.callThrough();

        runTest(segment, '<span><a href="/test"><img src="http://test.com/test"></a></span>', 0);

        expect(stackFormat.stackFormat).toHaveBeenCalledTimes(1);
        expect((<jasmine.Spy>stackFormat.stackFormat).calls.argsFor(0)[1]).toBe('a');
    });

    it('With onNodeCreated', () => {
        const segment: ContentModelImage = {
            segmentType: 'Image',
            src: 'http://test.com/test',
            format: {},
            dataset: {},
        };
        const parent = document.createElement('div');

        const onNodeCreated = jasmine.createSpy('onNodeCreated');

        context.onNodeCreated = onNodeCreated;

        handleImage(document, parent, segment, context);

        expect(parent.innerHTML).toBe('<span><img src="http://test.com/test"></span>');
        expect(onNodeCreated).toHaveBeenCalledTimes(1);
        expect(onNodeCreated.calls.argsFor(0)[0]).toBe(segment);
        expect(onNodeCreated.calls.argsFor(0)[1]).toBe(parent.querySelector('img'));
    });

    it('With display: block', () => {
        const segment: ContentModelImage = {
            segmentType: 'Image',
            src: 'http://test.com/test',
            format: { display: 'block' },
            dataset: {},
        };
        const parent = document.createElement('div');

        handleImage(document, parent, segment, context);

        expect(parent.innerHTML).toBe(
            '<span><img src="http://test.com/test" style="display: block;"></span>'
        );
    });
});
