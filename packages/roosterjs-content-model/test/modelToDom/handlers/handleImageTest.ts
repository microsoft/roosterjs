import { ContentModelBlock } from '../../../lib/publicTypes/block/ContentModelBlock';
import { ContentModelHandler } from '../../../lib/publicTypes/context/ContentModelHandler';
import { ContentModelImage } from '../../../lib/publicTypes/segment/ContentModelImage';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { handleImage } from '../../../lib/modelToDom/handlers/handleImage';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';

describe('handleSegment', () => {
    let parent: HTMLElement;
    let context: ModelToDomContext;
    let handleBlock: jasmine.Spy<ContentModelHandler<ContentModelBlock>>;

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
        };

        runTest(segment, '<img src="http://test.com/test">', 0);

        expect(context.imageSelection).toBeUndefined();
    });

    it('image segment with image selection', () => {
        const segment: ContentModelImage = {
            segmentType: 'Image',
            src: 'http://test.com/test',
            format: {},
            isSelectedAsImageSelection: true,
        };

        runTest(segment, '<img src="http://test.com/test">', 0);

        expect(context.imageSelection!.image.src).toBe('http://test.com/test');
    });

    it('image segment with alt and title', () => {
        const segment: ContentModelImage = {
            segmentType: 'Image',
            src: 'http://test.com/test',
            format: {},
            alt: 'a',
            title: 'b',
        };

        runTest(segment, '<img src="http://test.com/test" alt="a" title="b">', 0);
    });

    it('image segment with link', () => {
        const segment: ContentModelImage = {
            segmentType: 'Image',
            src: 'http://test.com/test',
            format: { underline: true },
            link: { href: '/test' },
        };

        runTest(segment, '<a href="/test"><img src="http://test.com/test"></a>', 0);
    });
});
