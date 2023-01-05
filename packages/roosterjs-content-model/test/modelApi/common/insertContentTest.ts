import { addSegment } from '../../../lib/modelApi/common/addSegment';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createSelectionMarker } from '../../../lib/modelApi/creators/createSelectionMarker';
import { createText } from '../../../lib/modelApi/creators/createText';
import { insertContent } from '../../../lib/modelApi/common/insertContent';

describe('insertContent', () => {
    it('Empty model, empty content', () => {
        const model = createContentModelDocument();
        const fragment = document.createDocumentFragment();

        insertContent(model, fragment);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [],
        });
    });

    it('Model with selection, empty content', () => {
        const model = createContentModelDocument();
        const marker = createSelectionMarker();
        const fragment = document.createDocumentFragment();

        addSegment(model, marker);
        insertContent(model, fragment);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    isImplicit: true,
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                    ],
                },
            ],
        });
    });

    it('Model with selection, simple text node', () => {
        const model = createContentModelDocument();
        const marker = createSelectionMarker();
        const fragment = document.createDocumentFragment();
        const text = document.createTextNode('test');

        fragment.appendChild(text);

        addSegment(model, marker);
        insertContent(model, fragment);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    isImplicit: true,
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: {},
                        },
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                    ],
                },
            ],
        });
    });

    it('Model with selection, insert another model', () => {
        const model = createContentModelDocument();
        const marker = createSelectionMarker();
        const subModel = createContentModelDocument();
        const para = createParagraph();
        const text = createText('test');

        addSegment(model, marker);

        para.segments.push(text);
        subModel.blocks.push(para);

        insertContent(model, subModel);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    isImplicit: true,
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: {},
                        },
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                    ],
                },
            ],
        });
    });

    it('Model without selection, insert another model', () => {
        const model = createContentModelDocument();
        const subModel = createContentModelDocument();
        const para = createParagraph();
        const text = createText('test');

        para.segments.push(text);
        subModel.blocks.push(para);

        insertContent(model, subModel);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [],
        });
    });
});
