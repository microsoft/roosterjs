import { applySegmentFormatting } from '../../../lib/markdownToModel/appliers/applySegmentFormatting';
import { createImage, createParagraph, createText } from 'roosterjs-content-model-dom';
import {
    ContentModelParagraph,
    ContentModelParagraphDecorator,
} from 'roosterjs-content-model-types';

describe('applySegmentFormatting', () => {
    function runTest(
        text: string,
        expectedParagraph: ContentModelParagraph,
        decorator?: ContentModelParagraphDecorator
    ) {
        // Arrange
        const paragraph = createParagraph(undefined, undefined, undefined, decorator);

        // Act
        const result = applySegmentFormatting(text, paragraph, decorator);

        // Assert
        expect(result).toEqual(expectedParagraph);
    }

    it('No formatting ', () => {
        const paragraph = createParagraph();
        const segment = createText('No formatting ');
        paragraph.segments.push(segment);
        runTest('No formatting ', paragraph);
    });

    it('Bold', () => {
        const paragraph = createParagraph();
        const segment = createText('text in ');
        const bold = createText('bold ', { fontWeight: 'bold' });
        paragraph.segments.push(segment);
        paragraph.segments.push(bold);
        runTest('text in **bold**', paragraph);
    });

    it('Italic', () => {
        const paragraph = createParagraph();
        const segment = createText('text in ');
        const italic = createText('italic ', { italic: true });
        paragraph.segments.push(segment);
        paragraph.segments.push(italic);
        runTest('text in *italic*', paragraph);
    });

    it('Bold and Italic', () => {
        const paragraph = createParagraph();
        const segment = createText('text in ');
        const boldItalic = createText('bold and italic ', { fontWeight: 'bold', italic: true });
        paragraph.segments.push(segment);
        paragraph.segments.push(boldItalic);
        runTest('text in ***bold and italic***', paragraph);
    });

    it('Links', () => {
        const paragraph = createParagraph();
        const segment = createText('text with ');
        const link = createText('link');
        link.link = {
            dataset: {},
            format: {
                href: 'http://link.com',
                underline: true,
            },
        };
        paragraph.segments.push(segment);
        paragraph.segments.push(link);
        runTest('text with [link](http://link.com)', paragraph);
    });

    it('Multiple Bold and Italic', () => {
        const paragraph = createParagraph();
        const segment1 = createText('text in ');
        const boldItalic = createText('bold and italic ', { fontWeight: 'bold', italic: true });
        const segment2 = createText(' and ');
        const bold = createText('bold ', { fontWeight: 'bold' });
        const segment3 = createText(' and ');
        const italic = createText('italic ', { italic: true });
        paragraph.segments.push(segment1);
        paragraph.segments.push(boldItalic);
        paragraph.segments.push(segment2);
        paragraph.segments.push(bold);
        paragraph.segments.push(segment3);
        paragraph.segments.push(italic);
        runTest('text in ***bold and italic*** and **bold** and *italic*', paragraph);
    });

    it('Image', () => {
        const paragraph = createParagraph();
        const segment = createText('text with ');
        const image = createImage('http://image.com');
        image.alt = 'image';
        paragraph.segments.push(segment);
        paragraph.segments.push(image);
        runTest('text with ![image](http://image.com)', paragraph);
    });

    it('Complex paragraph with Image, Links, bold and italic', () => {
        const paragraph = createParagraph();
        const segment1 = createText('text with ');
        const image = createImage('http://image.com');
        image.alt = 'image';
        const segment2 = createText(' and ');
        const link = createText('link');
        link.link = {
            dataset: {},
            format: {
                href: 'http://link.com',
                underline: true,
            },
        };
        const segment3 = createText(' and ');
        const boldItalic = createText('bold and italic ', { fontWeight: 'bold', italic: true });
        const segment4 = createText(' and ');
        const bold = createText('bold ', { fontWeight: 'bold' });
        const segment5 = createText(' and ');
        const italic = createText('italic ', { italic: true });
        paragraph.segments.push(segment1);
        paragraph.segments.push(image);
        paragraph.segments.push(segment2);
        paragraph.segments.push(link);
        paragraph.segments.push(segment3);
        paragraph.segments.push(boldItalic);
        paragraph.segments.push(segment4);
        paragraph.segments.push(bold);
        paragraph.segments.push(segment5);
        paragraph.segments.push(italic);
        runTest(
            'text with ![image](http://image.com) and [link](http://link.com) and ***bold and italic*** and **bold** and *italic*',
            paragraph
        );
    });
});
