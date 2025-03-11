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
        const result = createMarkdownBlockGroup(blockGroup, listItemCount);
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
});
