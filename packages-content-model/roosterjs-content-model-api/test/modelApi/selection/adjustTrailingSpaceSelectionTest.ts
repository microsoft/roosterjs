import { addSegment, createContentModelDocument, createText } from 'roosterjs-content-model-dom';
import { adjustTrailingSpaceSelection } from '../../../lib/modelApi/selection/adjustTrailingSpaceSelection';
import { ContentModelDocument } from 'roosterjs-content-model-types';

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
});
