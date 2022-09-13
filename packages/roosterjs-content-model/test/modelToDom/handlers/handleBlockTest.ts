import * as applyFormat from '../../../lib/modelToDom/utils/applyFormat';
import * as handleParagraph from '../../../lib/modelToDom/handlers/handleParagraph';
import { ContentModelBlock } from '../../../lib/publicTypes/block/ContentModelBlock';
import { ContentModelGeneralSegment } from '../../../lib/publicTypes/segment/ContentModelGeneralSegment';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { handleBlock } from '../../../lib/modelToDom/handlers/handleBlock';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';
import { SegmentFormatHandlers } from '../../../lib/formatHandlers/SegmentFormatHandlers';

describe('handleBlock', () => {
    let parent: HTMLElement;
    let context: ModelToDomContext;

    beforeEach(() => {
        context = createModelToDomContext();
        spyOn(handleParagraph, 'handleParagraph');
    });

    function runTest(block: ContentModelBlock, expectedInnerHTML: string) {
        parent = document.createElement('div');

        handleBlock(document, parent, block, context);

        expect(parent.innerHTML).toBe(expectedInnerHTML);
    }

    it('Paragraph', () => {
        const paragraph: ContentModelBlock = {
            blockType: 'Paragraph',
            segments: [],
        };

        runTest(paragraph, '');

        expect(handleParagraph.handleParagraph).toHaveBeenCalledTimes(1);
        expect(handleParagraph.handleParagraph).toHaveBeenCalledWith(
            document,
            parent,
            paragraph,
            context
        );
    });

    it('General block without child', () => {
        const element = document.createElement('span');
        const block: ContentModelBlock = {
            blockType: 'BlockGroup',
            blockGroupType: 'General',
            blocks: [],
            element: element,
        };

        runTest(block, '<span></span>');

        expect(handleParagraph.handleParagraph).toHaveBeenCalledTimes(0);
    });

    it('General block with 1 child', () => {
        const element = document.createElement('span');
        const paragraph: ContentModelBlock = {
            blockType: 'Paragraph',
            segments: [],
        };
        const block: ContentModelBlock = {
            blockType: 'BlockGroup',
            blockGroupType: 'General',
            blocks: [paragraph],
            element: element,
        };

        runTest(block, '<span></span>');

        expect(handleParagraph.handleParagraph).toHaveBeenCalledTimes(1);
        expect(handleParagraph.handleParagraph).toHaveBeenCalledWith(
            document,
            element,
            paragraph,
            context
        );
    });

    it('General block and segment', () => {
        const element = document.createElement('span');
        const block: ContentModelGeneralSegment = {
            blockType: 'BlockGroup',
            blockGroupType: 'General',
            segmentType: 'General',
            blocks: [],
            element: element,
            format: {},
        };

        parent = document.createElement('div');

        spyOn(applyFormat, 'applyFormat');
        handleBlock(document, parent, block, context);

        expect(parent.innerHTML).toBe('<span></span>');
        expect(parent.firstChild).not.toBe(element);
        expect(context.regularSelection.current.segment).toBe(parent.firstChild);
        expect(applyFormat.applyFormat).toHaveBeenCalledWith(
            parent.firstChild as HTMLElement,
            SegmentFormatHandlers,
            block.format,
            context
        );
    });
});
