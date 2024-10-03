import { handleEnterOnParagraph } from '../../../lib/edit/inputSteps/handleEnterOnParagraph';
import { ValidDeleteSelectionContext } from 'roosterjs-content-model-types';
import {
    createContentModelDocument,
    createParagraph,
    createSelectionMarker,
    createText,
} from 'roosterjs-content-model-dom';

describe('handleEnterOnParagraph', () => {
    it('Already deleted', () => {
        const doc = createContentModelDocument();
        const para = createParagraph();
        const marker = createSelectionMarker();
        const mockedCache = {} as any;

        para.segments.push(marker);
        doc.blocks.push(para);
        doc.cachedElement = mockedCache;

        const context: ValidDeleteSelectionContext = {
            deleteResult: 'range',
            insertPoint: {
                paragraph: para,
                marker: marker,
                path: [doc],
            },
        };

        handleEnterOnParagraph(context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [para],
            cachedElement: mockedCache,
        });
    });

    it('Not deleted, split current paragraph', () => {
        const doc = createContentModelDocument();
        const para = createParagraph();
        const marker = createSelectionMarker();
        const mockedCache = {} as any;
        const text1 = createText('test1');
        const text2 = createText('test1');

        para.segments.push(text1, marker, text2);
        doc.blocks.push(para);
        doc.cachedElement = mockedCache;

        const context: ValidDeleteSelectionContext = {
            deleteResult: 'notDeleted',
            insertPoint: {
                paragraph: para,
                marker: marker,
                path: [doc],
            },
        };

        handleEnterOnParagraph(context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [text1],
                    format: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                        text2,
                    ],
                    format: {},
                },
            ],
        });

        expect(context.insertPoint).toEqual({
            paragraph: {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'SelectionMarker',
                        format: {},
                        isSelected: true,
                    },
                    text2,
                ],
                format: {},
            },
            marker: marker,
            path: [doc],
        });
    });
});
