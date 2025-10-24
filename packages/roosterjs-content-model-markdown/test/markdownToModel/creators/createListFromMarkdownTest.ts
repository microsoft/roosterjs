import { ContentModelListItem } from 'roosterjs-content-model-types';
import { createListFromMarkdown } from '../../../lib/markdownToModel/creators/createListFromMarkdown';
import { MarkdownToModelOptions } from '../../../lib/markdownToModel/types/MarkdownToModelOptions';
import {
    createListItem,
    createListLevel,
    createParagraph,
    createText,
} from 'roosterjs-content-model-dom';

describe('createListFromMarkdown', () => {
    function runTest(
        text: string,
        patternName: 'OL' | 'UL',
        expectedBlockGroup: ContentModelListItem,
        isRTL?: boolean
    ) {
        const options: MarkdownToModelOptions = isRTL
            ? {
                  direction: 'rtl',
              }
            : {};
        // Act
        const result = createListFromMarkdown(text, patternName, options);

        // Assert
        expect(result.blocks).toEqual(expectedBlockGroup.blocks);
        expect(result.levels).toEqual(expectedBlockGroup.levels);
    }

    it('should return list item for UL | *', () => {
        const listItem = createListItem([createListLevel('UL')]);
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);

        listItem.blocks.push(paragraph);
        runTest('* text', 'UL', listItem);
    });

    it('should return list item for UL | -', () => {
        const listItem = createListItem([createListLevel('UL')]);
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);

        listItem.blocks.push(paragraph);
        runTest('- text', 'UL', listItem);
    });

    it('should return list item for UL | +', () => {
        const listItem = createListItem([createListLevel('UL')]);
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);

        listItem.blocks.push(paragraph);
        runTest('+ text', 'UL', listItem);
    });

    it('should return list item for OL', () => {
        const listItem = createListItem([createListLevel('OL')]);
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);

        listItem.blocks.push(paragraph);
        runTest('1. text', 'OL', listItem);
    });

    it('should return a second level list item for OL', () => {
        const listItem = createListItem([createListLevel('OL'), createListLevel('OL')]);
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);

        listItem.blocks.push(paragraph);
        runTest('    1. text', 'OL', listItem);
    });

    it('should return a second level list item for UL | *', () => {
        const listItem = createListItem([createListLevel('UL'), createListLevel('UL')]);
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);

        listItem.blocks.push(paragraph);
        runTest('   * text', 'UL', listItem);
    });

    it('should return a second level list item for UL | -', () => {
        const listItem = createListItem([createListLevel('UL'), createListLevel('UL')]);
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);

        listItem.blocks.push(paragraph);
        runTest('   - text', 'UL', listItem);
    });

    it('should return a second level list item for UL | +', () => {
        const listItem = createListItem([createListLevel('UL'), createListLevel('UL')]);
        listItem.levels.push;
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);

        listItem.blocks.push(paragraph);
        runTest('   + text', 'UL', listItem);
    });

    it('should return list item for UL with Heading 1 | +', () => {
        const listItem = createListItem([createListLevel('UL')]);
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
        listItem.blocks.push(paragraph);
        runTest('+ # text', 'UL', listItem);
    });

    it('should return list item for OL', () => {
        const listItem = createListItem([createListLevel('OL')]);
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
        listItem.blocks.push(paragraph);
        runTest('1. # text', 'OL', listItem);
    });

    it('should return list item for OL - RTL', () => {
        const listItem = createListItem([createListLevel('OL', { direction: 'rtl' })]);
        const paragraph = createParagraph();
        paragraph.format.direction = 'rtl';
        listItem.format.direction = 'rtl';
        const text = createText('text');
        paragraph.segments.push(text);
        paragraph.decorator = {
            tagName: 'h1',
            format: {
                fontSize: '2em',
                fontWeight: 'bold',
            },
        };
        listItem.blocks.push(paragraph);
        runTest('1. # text', 'OL', listItem, true /* isRTL */);
    });
});
