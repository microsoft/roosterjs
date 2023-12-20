import { adjustTrailingSpaceSelection } from '../../../lib/modelApi/selection/adjustTrailingSpaceSelection';
import { ContentModelDocument } from 'roosterjs-content-model-types';
import {
    addSegment,
    createContentModelDocument,
    createParagraph,
    createText,
} from 'roosterjs-content-model-dom';

describe('adjustTrailingSpaceSelection', () => {
    function runTest(model: ContentModelDocument, modelResult: ContentModelDocument) {
        adjustTrailingSpaceSelection(model);
        expect(model).toEqual(modelResult);
    }

    it('no trailing space', () => {
        const model = createContentModelDocument();
        const text = createText('text');
        text.isSelected = true;
        addSegment(model, text);
        runTest(model, model);
    });

    it('trailing space', () => {
        const model = createContentModelDocument();
        const text = createText('text ');
        text.isSelected = true;
        addSegment(model, text);
        runTest(model, {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'text',
                            isSelected: true,
                        },
                        {
                            segmentType: 'Text',
                            format: {},
                            text: ' ',
                            isSelected: true,
                        },
                    ],
                    isImplicit: true,
                },
            ],
        });
    });

    it('trailing space multiple blocks', () => {
        const model = createContentModelDocument();
        const paragraph = createParagraph();
        const text = createText('text    ');
        text.isSelected = true;
        paragraph.segments.push(text);
        const paragraph2 = createParagraph();
        const text2 = createText('text2  ');
        text2.isSelected = true;
        paragraph2.segments.push(text2);
        model.blocks.push(paragraph, paragraph2);

        runTest(model, {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'text',
                            isSelected: true,
                        },
                        {
                            segmentType: 'Text',
                            format: {},
                            text: '    ',
                            isSelected: true,
                        },
                    ],
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'text2',
                            isSelected: true,
                        },
                        {
                            segmentType: 'Text',
                            format: {},
                            text: '  ',
                            isSelected: true,
                        },
                    ],
                },
            ],
        });
    });
});
