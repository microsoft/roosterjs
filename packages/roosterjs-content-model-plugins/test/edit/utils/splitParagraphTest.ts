import { ContentModelParagraph, InsertPoint } from 'roosterjs-content-model-types';
import { splitParagraph } from '../../../lib/edit/utils/splitParagraph';
import {
    createBr,
    createContentModelDocument,
    createParagraph,
    createSelectionMarker,
    createText,
} from 'roosterjs-content-model-dom';

describe('splitParagraph', () => {
    it('empty paragraph with selection marker and BR', () => {
        const doc = createContentModelDocument();
        const marker = createSelectionMarker({ fontFamily: 'Arial' });
        const br = createBr();
        const para = createParagraph(false, { direction: 'ltr' }, { fontSize: '10pt' });
        const ip: InsertPoint = {
            marker: marker,
            paragraph: para,
            path: [doc],
        };

        para.segments.push(marker, br);
        doc.blocks.push(para);

        const result = splitParagraph(ip);

        const expectedResult: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [marker, br],
            format: { direction: 'ltr' },
            segmentFormat: { fontSize: '10pt' },
        };

        expect(result).toEqual(expectedResult);
        expect(ip).toEqual({
            marker: marker,
            paragraph: expectedResult,
            path: [doc],
        });
        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Br',
                            format: { fontFamily: 'Arial' },
                        },
                    ],
                    format: { direction: 'ltr' },
                    segmentFormat: { fontSize: '10pt', fontFamily: 'Arial' },
                },
            ],
        });
    });

    it('Paragraph with more segments', () => {
        const doc = createContentModelDocument();
        const marker = createSelectionMarker();
        const text1 = createText('test1');
        const text2 = createText('test2');
        const para = createParagraph(false);
        const ip: InsertPoint = {
            marker: marker,
            paragraph: para,
            path: [doc],
        };

        para.segments.push(text1, marker, text2);
        doc.blocks.push(para);

        const result = splitParagraph(ip);

        const expectedResult: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [marker, text2],
            format: {},
        };

        expect(result).toEqual(expectedResult);
        expect(ip).toEqual({
            marker: marker,
            paragraph: expectedResult,
            path: [doc],
        });
        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [text1],
                    format: {},
                },
            ],
        });
    });
});
