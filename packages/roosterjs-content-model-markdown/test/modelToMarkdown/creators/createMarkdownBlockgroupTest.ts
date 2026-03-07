import { ContentModelBlockGroup } from 'roosterjs-content-model-types';
import {
    createMarkdownBlockGroup,
    ListCounter,
} from '../../../lib/modelToMarkdown/creators/createMarkdownBlockGroup';
import {
    createFormatContainer,
    createListItem,
    createListLevel,
    createParagraph,
    createText,
} from 'roosterjs-content-model-dom';

describe('createMarkdownBlockGroup', () => {
    function runTest(
        blockGroup: ContentModelBlockGroup,
        expected: string,
        listItemCount: ListCounter
    ) {
        const result = createMarkdownBlockGroup(
            blockGroup,
            {
                newLine: '\n',
                lineBreak: '\n\n',
            },
            listItemCount
        );
        expect(result).toBe(expected);
    }

    it('should return unordered list', () => {
        const blockGroup = createListItem([createListLevel('UL')]);
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);
        blockGroup.blocks.push(paragraph);
        runTest(blockGroup, `- text\n`, {
            listItemCount: 0,
            subListItemCount: 0,
        });
    });

    it('should return unordered list with link', () => {
        const blockGroup = createListItem([createListLevel('UL')]);
        const paragraph = createParagraph();
        const text = createText('text ');
        const linkText = createText('link');
        linkText.link = {
            format: {
                href: 'https://example.com',
            },
            dataset: {},
        };
        paragraph.segments.push(text);
        paragraph.segments.push(linkText);
        blockGroup.blocks.push(paragraph);
        runTest(blockGroup, `- text [link](https://example.com)\n`, {
            listItemCount: 0,
            subListItemCount: 0,
        });
    });

    it('should return ordered list', () => {
        const blockGroup = createListItem([createListLevel('OL')]);
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);
        blockGroup.blocks.push(paragraph);
        runTest(blockGroup, `1. text\n`, {
            listItemCount: 0,
            subListItemCount: 0,
        });
    });

    it('should return second item of ordered list', () => {
        const blockGroup = createListItem([createListLevel('OL')]);
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);
        blockGroup.blocks.push(paragraph);
        runTest(blockGroup, `2. text\n`, {
            listItemCount: 1,
            subListItemCount: 0,
        });
    });

    it('should return ordered list with link', () => {
        const blockGroup = createListItem([createListLevel('OL')]);
        const paragraph = createParagraph();
        const text = createText('text ');
        const linkText = createText('link');
        linkText.link = {
            format: {
                href: 'https://example.com',
            },
            dataset: {},
        };
        paragraph.segments.push(text);
        paragraph.segments.push(linkText);
        blockGroup.blocks.push(paragraph);
        runTest(blockGroup, `1. text [link](https://example.com)\n`, {
            listItemCount: 0,
            subListItemCount: 0,
        });
    });

    it('should return nested list', () => {
        const blockGroup = createListItem([createListLevel('OL'), createListLevel('OL')]);
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);
        blockGroup.blocks.push(paragraph);
        runTest(blockGroup, `   1. text\n`, {
            listItemCount: 0,
            subListItemCount: 0,
        });
    });

    it('should return second item of a nested  list', () => {
        const blockGroup = createListItem([createListLevel('OL'), createListLevel('OL')]);
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);
        blockGroup.blocks.push(paragraph);
        runTest(blockGroup, `   2. text\n`, {
            listItemCount: 0,
            subListItemCount: 1,
        });
    });

    it('should return nested list with link', () => {
        const blockGroup = createListItem([createListLevel('OL'), createListLevel('OL')]);
        const paragraph = createParagraph();
        const text = createText('text ');
        const linkText = createText('link');
        linkText.link = {
            format: {
                href: 'https://example.com',
            },
            dataset: {},
        };
        paragraph.segments.push(text);
        paragraph.segments.push(linkText);
        blockGroup.blocks.push(paragraph);
        runTest(blockGroup, `   1. text [link](https://example.com)\n`, {
            listItemCount: 0,
            subListItemCount: 0,
        });
    });

    it('should return nested list with multiple levels', () => {
        const blockGroup = createListItem([
            createListLevel('OL'),
            createListLevel('OL'),
            createListLevel('OL'),
        ]);
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);
        blockGroup.blocks.push(paragraph);
        runTest(blockGroup, `   1. text\n`, {
            listItemCount: 0,
            subListItemCount: 0,
        });
    });

    it('should return a blockquote', () => {
        const blockGroup = createFormatContainer('blockquote');
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);
        blockGroup.blocks.push(paragraph);
        runTest(blockGroup, `> text\n\n`, {
            listItemCount: 0,
            subListItemCount: 0,
        });
    });

    it('should return a blockquote with italic', () => {
        const blockGroup = createFormatContainer('blockquote');
        const paragraph = createParagraph();
        const text = createText('text');
        text.format.italic = true;
        paragraph.segments.push(text);
        blockGroup.blocks.push(paragraph);
        runTest(blockGroup, `> *text*\n\n`, {
            listItemCount: 0,
            subListItemCount: 0,
        });
    });

    it('should return a blockquote with link', () => {
        const blockGroup = createFormatContainer('blockquote');
        const paragraph = createParagraph();
        const text = createText('text ');
        text.format.italic = true;
        const linkText = createText('link');
        linkText.link = {
            format: {
                href: 'https://example.com',
            },
            dataset: {},
        };
        paragraph.segments.push(text);
        paragraph.segments.push(linkText);
        blockGroup.blocks.push(paragraph);
        runTest(blockGroup, `> *text *[link](https://example.com)\n\n`, {
            listItemCount: 0,
            subListItemCount: 0,
        });
    });

    describe('FormatContainer tests', () => {
        it('should handle FormatContainer with blockquote tagName', () => {
            const blockGroup = createFormatContainer('blockquote');
            const paragraph = createParagraph();
            const text = createText('This is a blockquote');
            paragraph.segments.push(text);
            blockGroup.blocks.push(paragraph);

            runTest(blockGroup, `> This is a blockquote\n\n`, {
                listItemCount: 0,
                subListItemCount: 0,
            });
        });

        it('should handle FormatContainer with blockquote tagName and multiple paragraphs', () => {
            const blockGroup = createFormatContainer('blockquote');

            const paragraph1 = createParagraph();
            const text1 = createText('First paragraph');
            paragraph1.segments.push(text1);
            blockGroup.blocks.push(paragraph1);

            const paragraph2 = createParagraph();
            const text2 = createText('Second paragraph');
            paragraph2.segments.push(text2);
            blockGroup.blocks.push(paragraph2);

            runTest(blockGroup, `> First paragraph\n> Second paragraph\n\n`, {
                listItemCount: 0,
                subListItemCount: 0,
            });
        });

        it('should handle FormatContainer with div tagName (non-blockquote)', () => {
            const blockGroup = createFormatContainer('div');
            const paragraph = createParagraph();
            const text = createText('This is a div content');
            paragraph.segments.push(text);
            blockGroup.blocks.push(paragraph);

            runTest(blockGroup, `This is a div content\n\n`, {
                listItemCount: 0,
                subListItemCount: 0,
            });
        });

        it('should handle FormatContainer with section tagName (non-blockquote)', () => {
            const blockGroup = createFormatContainer('section');
            const paragraph = createParagraph();
            const text = createText('Section content');
            paragraph.segments.push(text);
            blockGroup.blocks.push(paragraph);

            runTest(blockGroup, `Section content\n\n`, {
                listItemCount: 0,
                subListItemCount: 0,
            });
        });

        it('should handle FormatContainer with article tagName (non-blockquote)', () => {
            const blockGroup = createFormatContainer('article');
            const paragraph = createParagraph();
            const text = createText('Article content');
            paragraph.segments.push(text);
            blockGroup.blocks.push(paragraph);

            runTest(blockGroup, `Article content\n\n`, {
                listItemCount: 0,
                subListItemCount: 0,
            });
        });

        it('should handle FormatContainer with non-blockquote tagName and multiple paragraphs', () => {
            const blockGroup = createFormatContainer('div');

            const paragraph1 = createParagraph();
            const text1 = createText('First div paragraph');
            paragraph1.segments.push(text1);
            blockGroup.blocks.push(paragraph1);

            const paragraph2 = createParagraph();
            const text2 = createText('Second div paragraph');
            paragraph2.segments.push(text2);
            blockGroup.blocks.push(paragraph2);

            runTest(blockGroup, `First div paragraph\n\nSecond div paragraph\n\n`, {
                listItemCount: 0,
                subListItemCount: 0,
            });
        });

        it('should handle FormatContainer with blockquote and formatted text', () => {
            const blockGroup = createFormatContainer('blockquote');
            const paragraph = createParagraph();

            const boldText = createText('Bold ');
            boldText.format.fontWeight = 'bold';

            const italicText = createText('italic ');
            italicText.format.italic = true;

            const normalText = createText('and normal text');

            paragraph.segments.push(boldText);
            paragraph.segments.push(italicText);
            paragraph.segments.push(normalText);
            blockGroup.blocks.push(paragraph);

            runTest(blockGroup, `> **Bold ***italic *and normal text\n\n`, {
                listItemCount: 0,
                subListItemCount: 0,
            });
        });

        it('should handle FormatContainer with non-blockquote and formatted text', () => {
            const blockGroup = createFormatContainer('div');
            const paragraph = createParagraph();

            const boldText = createText('Bold ');
            boldText.format.fontWeight = 'bold';

            const italicText = createText('italic ');
            italicText.format.italic = true;

            const normalText = createText('and normal text');

            paragraph.segments.push(boldText);
            paragraph.segments.push(italicText);
            paragraph.segments.push(normalText);
            blockGroup.blocks.push(paragraph);

            runTest(blockGroup, `**Bold ***italic *and normal text\n\n`, {
                listItemCount: 0,
                subListItemCount: 0,
            });
        });
    });
});
