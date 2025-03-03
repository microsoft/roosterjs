import { ContentModelParagraph } from 'roosterjs-content-model-types';
import { createImage, createParagraph, createText } from 'roosterjs-content-model-dom';
import { createParagraphFromMarkdown } from '../../../lib/markdownToModel/creators/createParagraphFromMarkdown';

describe('createParagraphFromMarkdown', () => {
    function runTest(text: string, expectedContentModel: ContentModelParagraph) {
        // Act
        const result = createParagraphFromMarkdown(text);

        // Assert
        expect(result).toEqual(expectedContentModel);
    }

    it('should return paragraph with text', () => {
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);
        runTest('text', paragraph);
    });

    it('should return paragraph with text and image', () => {
        const paragraph = createParagraph();
        const text = createText('text and image ');
        const image = createImage('https://www.example.com/image');
        image.alt = 'image of a dog';
        paragraph.segments.push(text);
        paragraph.segments.push(image);
        runTest('text and image ![image of a dog](https://www.example.com/image) ', paragraph);
    });

    it('should return paragraph with text and link', () => {
        const paragraph = createParagraph();
        const text = createText('text ');
        const link = createText('link');
        link.link = {
            dataset: {},
            format: {
                href: 'https://www.example.com',
                underline: true,
            },
        };
        paragraph.segments.push(text);
        paragraph.segments.push(link);
        runTest('text [link](https://www.example.com) ', paragraph);
    });

    it('should return paragraph with text and bold', () => {
        const paragraph = createParagraph();
        const text = createText('text ');
        const bold = createText('bold ');
        bold.format = {
            fontWeight: 'bold',
        };
        paragraph.segments.push(text);
        paragraph.segments.push(bold);
        runTest('text **bold** ', paragraph);
    });

    it('should return paragraph with text and italic', () => {
        const paragraph = createParagraph();
        const text = createText('text ');
        const italic = createText('italic ');
        italic.format = {
            italic: true,
        };
        paragraph.segments.push(text);
        paragraph.segments.push(italic);
        runTest('text *italic* ', paragraph);
    });

    it('should return paragraph with text, link and image', () => {
        const paragraph = createParagraph();
        const text = createText('text ');
        const link = createText('link');
        link.link = {
            dataset: {},
            format: {
                href: 'https://www.example.com',
                underline: true,
            },
        };
        const image = createImage('https://www.example.com/image');
        image.alt = 'image of a dog';
        paragraph.segments.push(text);
        paragraph.segments.push(link);
        paragraph.segments.push(image);
        runTest(
            'text [link](https://www.example.com) ![image of a dog](https://www.example.com/image) ',
            paragraph
        );
    });

    it('should return paragraph with text, link, image, bold and italic', () => {
        const paragraph = createParagraph();
        const text = createText('text ');
        const link = createText('link');
        link.link = {
            dataset: {},
            format: {
                href: 'https://www.example.com',
                underline: true,
            },
        };
        const image = createImage('https://www.example.com/image');
        image.alt = 'image of a dog';
        const bold = createText('bold ');
        bold.format = {
            fontWeight: 'bold',
        };
        const italic = createText('italic ');
        italic.format = {
            italic: true,
        };
        paragraph.segments.push(text);
        paragraph.segments.push(link);
        paragraph.segments.push(image);
        paragraph.segments.push(bold);
        paragraph.segments.push(italic);
        runTest(
            'text [link](https://www.example.com) ![image of a dog](https://www.example.com/image) **bold** *italic* ',
            paragraph
        );
    });

    it('should have heading 1', () => {
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);
        paragraph.decorator = {
            tagName: 'h1',
            format: {
                fontSize: '2em',
                fontWeight: 'bold',
            },
        };
        runTest('# text', paragraph);
    });

    it('should have heading 2', () => {
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);
        paragraph.decorator = {
            tagName: 'h2',
            format: {
                fontSize: '1.5em',
                fontWeight: 'bold',
            },
        };
        runTest('## text', paragraph);
    });

    it('should have heading 3', () => {
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);
        paragraph.decorator = {
            tagName: 'h3',
            format: {
                fontSize: '1.17em',
                fontWeight: 'bold',
            },
        };
        runTest('### text', paragraph);
    });

    it('should have heading 4', () => {
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);
        paragraph.decorator = {
            tagName: 'h4',
            format: {
                fontSize: '1em',
                fontWeight: 'bold',
            },
        };
        runTest('#### text', paragraph);
    });

    it('should have heading 5', () => {
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);
        paragraph.decorator = {
            tagName: 'h5',
            format: {
                fontSize: '0.83em',
                fontWeight: 'bold',
            },
        };
        runTest('##### text', paragraph);
    });

    it('should have heading 6', () => {
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);
        paragraph.decorator = {
            tagName: 'h6',
            format: {
                fontSize: '0.67em',
                fontWeight: 'bold',
            },
        };
        runTest('###### text', paragraph);
    });

    it('should have heading 1 with link', () => {
        const paragraph = createParagraph();
        const link = createText('link');
        link.link = {
            dataset: {},
            format: {
                href: 'https://www.example.com',
                underline: true,
            },
        };
        paragraph.segments.push(link);
        paragraph.decorator = {
            tagName: 'h1',
            format: {
                fontSize: '2em',
                fontWeight: 'bold',
            },
        };
        runTest('# [link](https://www.example.com)', paragraph);
    });
});
