import { ContentModelParagraph } from 'roosterjs-content-model-types';
import { createBr, createImage, createParagraph, createText } from 'roosterjs-content-model-dom';
import {
    createMarkdownParagraph,
    ParagraphContext,
} from '../../../lib/modelToMarkdown/creators/createMarkdownParagraph';

describe('createMarkdownParagraph', () => {
    function runTest(
        paragraph: ContentModelParagraph,
        expectedMarkdown: string,
        context?: ParagraphContext
    ) {
        // Act
        const result = createMarkdownParagraph(paragraph, context);

        // Assert
        expect(result).toEqual(expectedMarkdown);
    }

    it('should return paragraph with text', () => {
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);
        runTest(paragraph, 'text');
    });

    it('should return paragraph with text and image', () => {
        const paragraph = createParagraph();
        const text = createText('text ');
        const image = createImage('https://www.example.com/image');
        image.alt = 'image of a dog';
        paragraph.segments.push(text);
        paragraph.segments.push(image);
        runTest(paragraph, 'text ![image of a dog](https://www.example.com/image)');
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
        runTest(paragraph, 'text [link](https://www.example.com)');
    });

    it('should return paragraph with text and bold', () => {
        const paragraph = createParagraph();
        const text = createText('text ');
        const bold = createText('bold');
        bold.format = {
            fontWeight: 'bold',
        };
        paragraph.segments.push(text);
        paragraph.segments.push(bold);
        runTest(paragraph, 'text **bold**');
    });

    it('should return paragraph with text and italic', () => {
        const paragraph = createParagraph();
        const text = createText('text ');
        const italic = createText('italic');
        italic.format = {
            italic: true,
        };
        paragraph.segments.push(text);
        paragraph.segments.push(italic);
        runTest(paragraph, 'text *italic*');
    });

    it('should return paragraph with text, link and image', () => {
        const paragraph = createParagraph();
        const text = createText('text ');
        const link = createText('link ');
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
            paragraph,
            'text [link ](https://www.example.com)![image of a dog](https://www.example.com/image)'
        );
    });

    it('should return paragraph with header - H1', () => {
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);
        paragraph.decorator = {
            tagName: 'h1',
            format: {},
        };
        runTest(paragraph, '# text');
    });

    it('should return paragraph with header - H2', () => {
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);
        paragraph.decorator = {
            tagName: 'h2',
            format: {},
        };
        runTest(paragraph, '## text');
    });

    it('should return paragraph with header - H3', () => {
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);
        paragraph.decorator = {
            tagName: 'h3',
            format: {},
        };
        runTest(paragraph, '### text');
    });

    it('should return paragraph with header - H4', () => {
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);
        paragraph.decorator = {
            tagName: 'h4',
            format: {},
        };
        runTest(paragraph, '#### text');
    });

    it('should return paragraph with header - H5', () => {
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);
        paragraph.decorator = {
            tagName: 'h5',
            format: {},
        };
        runTest(paragraph, '##### text');
    });

    it('should return paragraph with header - H6', () => {
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);
        paragraph.decorator = {
            tagName: 'h6',
            format: {},
        };
        runTest(paragraph, '###### text');
    });

    it('should not ignore the BR', () => {
        const paragraph = createParagraph();
        const text = createText('text');
        const br = createBr();
        paragraph.segments.push(text);
        paragraph.segments.push(br);
        runTest(paragraph, 'text\n', { ignoreLineBreaks: false });
    });

    it('should ignore the BR', () => {
        const paragraph = createParagraph();
        const text = createText('text');
        const br = createBr();
        paragraph.segments.push(text);
        paragraph.segments.push(br);
        runTest(paragraph, 'text', { ignoreLineBreaks: true });
    });
});
