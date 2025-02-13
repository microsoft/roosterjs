import { ContentModelListItem } from 'roosterjs-content-model-types';
import { createListFromMarkdown } from '../../../lib/markdownToModel/creators/createListFromMarkdown';
import {
    createListItem,
    createListLevel,
    createParagraph,
    createText,
} from 'roosterjs-content-model-dom';

describe('createListFromMarkdown', () => {
    function runTest(text: string, patternName: string, expectedBlockGroup: ContentModelListItem) {
        // Act
        const result = createListFromMarkdown(text, patternName);

        // Assert
        expect(result.blocks).toEqual(expectedBlockGroup.blocks);
        expect(result.levels).toEqual(expectedBlockGroup.levels);
    }

    it('should return list item for unordered_list | *', () => {
        const listItem = createListItem([createListLevel('UL')]);
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);

        listItem.blocks.push(paragraph);
        runTest('* text', 'unordered_list', listItem);
    });

    it('should return list item for unordered_list | -', () => {
        const listItem = createListItem([createListLevel('UL')]);
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);

        listItem.blocks.push(paragraph);
        runTest('- text', 'unordered_list', listItem);
    });

    it('should return list item for unordered_list | +', () => {
        const listItem = createListItem([createListLevel('UL')]);
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);

        listItem.blocks.push(paragraph);
        runTest('+ text', 'unordered_list', listItem);
    });

    it('should return list item for ordered_list', () => {
        const listItem = createListItem([createListLevel('OL')]);
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);

        listItem.blocks.push(paragraph);
        runTest('1. text', 'ordered_list', listItem);
    });

    it('should return a second level list item for ordered_list', () => {
        const listItem = createListItem([createListLevel('OL'), createListLevel('OL')]);
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);

        listItem.blocks.push(paragraph);
        runTest('    1. text', 'ordered_list', listItem);
    });

    it('should return a second level list item for unordered_list | *', () => {
        const listItem = createListItem([createListLevel('UL'), createListLevel('UL')]);
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);

        listItem.blocks.push(paragraph);
        runTest('   * text', 'unordered_list', listItem);
    });

    it('should return a second level list item for unordered_list | -', () => {
        const listItem = createListItem([createListLevel('UL'), createListLevel('UL')]);
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);

        listItem.blocks.push(paragraph);
        runTest('   - text', 'unordered_list', listItem);
    });

    it('should return a second level list item for unordered_list | +', () => {
        const listItem = createListItem([createListLevel('UL'), createListLevel('UL')]);
        listItem.levels.push;
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);

        listItem.blocks.push(paragraph);
        runTest('   + text', 'unordered_list', listItem);
    });

    it('should return list item for unordered_list with Heading 1 | +', () => {
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
        runTest('+ # text', 'unordered_list', listItem);
    });

    it('should return list item for ordered_list', () => {
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
        runTest('1. # text', 'ordered_list', listItem);
    });
});
