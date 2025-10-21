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

    describe('formatsToPreserveOnMerge parameter', () => {
        it('should preserve specified formats when splitting paragraph', () => {
            const doc = createContentModelDocument();
            const marker = createSelectionMarker();
            const text = createText('Hello');
            const para = createParagraph(false, { direction: 'ltr' });

            // Add custom formats to the paragraph
            (para.format as any).className = 'custom-class';
            (para.format as any).fontFamily = 'Arial';
            para.format.textAlign = 'center';
            para.format.backgroundColor = 'red';

            const ip: InsertPoint = {
                marker: marker,
                paragraph: para,
                path: [doc],
            };

            para.segments.push(text, marker);
            doc.blocks.push(para);

            // Split paragraph and preserve only className and textAlign
            const result = splitParagraph(ip, true, ['className', 'textAlign']);

            expect((result.format as any).className).toBe('custom-class');
            expect(result.format.textAlign).toBe('center');

            expect((result.format as any).fontFamily).toBeUndefined();
            expect(result.format.backgroundColor).toBe('red');
            expect(result.format.direction).toBe('ltr');
        });

        it('should work with empty formatsToPreserveOnMerge array', () => {
            const doc = createContentModelDocument();
            const marker = createSelectionMarker();
            const para = createParagraph(false, { direction: 'ltr' });

            (para.format as any).className = 'custom-class';
            para.format.textAlign = 'center';

            const ip: InsertPoint = {
                marker: marker,
                paragraph: para,
                path: [doc],
            };

            para.segments.push(marker);
            doc.blocks.push(para);

            const result = splitParagraph(ip, true, []);

            // Only standard paragraph formats should be copied
            expect((result.format as any).className).toBeUndefined();
            expect(result.format.textAlign).toBe('center'); // This comes from ParagraphFormats copy
            expect(result.format.direction).toBe('ltr'); // This comes from ParagraphFormats copy
        });

        it('should work with undefined formatsToPreserveOnMerge', () => {
            const doc = createContentModelDocument();
            const marker = createSelectionMarker();
            const para = createParagraph(false, { direction: 'ltr' });

            (para.format as any).className = 'custom-class';
            para.format.textAlign = 'center';

            const ip: InsertPoint = {
                marker: marker,
                paragraph: para,
                path: [doc],
            };

            para.segments.push(marker);
            doc.blocks.push(para);

            const result = splitParagraph(ip, true, undefined);

            // Only standard paragraph formats should be copied
            expect((result.format as any).className).toBeUndefined();
            expect(result.format.textAlign).toBe('center'); // This comes from ParagraphFormats copy
            expect(result.format.direction).toBe('ltr'); // This comes from ParagraphFormats copy
        });

        it('should preserve multiple custom formats', () => {
            const doc = createContentModelDocument();
            const marker = createSelectionMarker();
            const para = createParagraph(false, { direction: 'ltr' });

            (para.format as any).className = 'highlight important';
            (para.format as any).customProp = 'value123';
            (para.format as any).anotherProp = 'test';
            para.format.textAlign = 'center';

            const ip: InsertPoint = {
                marker: marker,
                paragraph: para,
                path: [doc],
            };

            para.segments.push(marker);
            doc.blocks.push(para);

            const result = splitParagraph(ip, true, ['className', 'customProp']);

            // Check preserved formats
            expect((result.format as any).className).toBe('highlight important');
            expect((result.format as any).customProp).toBe('value123');

            // Check non-preserved custom format is not copied
            expect((result.format as any).anotherProp).toBeUndefined();

            // Check standard formats are still copied
            expect(result.format.textAlign).toBe('center');
            expect(result.format.direction).toBe('ltr');
        });
    });
});
