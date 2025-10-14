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

    it('Paragraph with more segments with format', () => {
        const doc = createContentModelDocument();
        const marker = createSelectionMarker();
        const text1 = createText('test1');
        const text2 = createText('test2');
        const para = createParagraph(false);
        para.format.id = 'ID';
        para.format.borderLeft = '5px';
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
                    format: {
                        id: 'ID',
                        borderLeft: '5px',
                    },
                },
            ],
        });
    });

    it('Implicit paragraph with selection marker only', () => {
        const group = createContentModelDocument();
        const paragraph = createParagraph(true);
        const marker = createSelectionMarker();

        paragraph.segments.push(marker);
        group.blocks.push(paragraph);

        const ip: InsertPoint = {
            marker: marker,
            paragraph: paragraph,
            path: [group],
        };

        const result = splitParagraph(ip);

        expect(result).toEqual({
            blockType: 'Paragraph',
            segments: [marker],
            format: {},
        });

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [],
                    format: {},
                    isImplicit: true,
                },
            ],
        });
        expect(ip).toEqual({
            marker: marker,
            paragraph: {
                blockType: 'Paragraph',
                segments: [marker],
                format: {},
            },
            path: [group],
        });
    });

    it('Implicit paragraph with selection marker only and removeImplicitParagraph false', () => {
        const group = createContentModelDocument();
        const paragraph = createParagraph(true);
        const marker = createSelectionMarker();

        paragraph.segments.push(marker);
        group.blocks.push(paragraph);

        const ip: InsertPoint = {
            marker: marker,
            paragraph: paragraph,
            path: [group],
        };

        const result = splitParagraph(ip, false /* removeImplicitParagraph */);

        expect(result).toEqual({
            blockType: 'Paragraph',
            segments: [marker],
            format: {},
        });

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [{ segmentType: 'Br', format: {} }],
                    format: {},
                    isImplicit: true,
                },
            ],
        });
        expect(ip).toEqual({
            marker: marker,
            paragraph: {
                blockType: 'Paragraph',
                segments: [marker],
                format: {},
            },
            path: [group],
        });
    });

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
        (para.format as any).test = 'true';
        doc.blocks.push(para);

        const result = splitParagraph(ip, false, ['test']);

        const expectedResult: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [marker, br],
            format: { direction: 'ltr', test: 'true' } as any,
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
                    format: { direction: 'ltr', test: 'true' } as any,
                    segmentFormat: { fontSize: '10pt', fontFamily: 'Arial' },
                },
            ],
        });
    });
});
