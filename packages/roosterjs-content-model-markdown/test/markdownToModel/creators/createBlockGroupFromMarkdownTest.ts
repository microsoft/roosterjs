import { ContentModelFormatContainer, ContentModelListItem } from 'roosterjs-content-model-types';
import { createBlockGroupFromMarkdown } from '../../../lib/markdownToModel/creators/createBlockGroupFromMarkdown';
import {
    createFormatContainer,
    createListItem,
    createListLevel,
    createParagraph,
    createText,
} from 'roosterjs-content-model-dom';

const DEFAULT_BLOCKQUOTE = {
    borderLeft: '3px solid rgb(200, 200, 200)',
    textColor: 'rgb(102, 102, 102)',
    marginTop: '1em',
    marginBottom: '1em',
    marginLeft: '40px',
    marginRight: '40px',
    paddingLeft: '10px',
};

describe('createBlockGroupFromMarkdown', () => {
    function runTest(
        text: string,
        patternName: string,
        group: ContentModelFormatContainer | undefined,
        expectedBlockGroup: ContentModelFormatContainer | ContentModelListItem
    ) {
        // Act
        const result = createBlockGroupFromMarkdown(text, patternName, group);

        // Assert
        expect(result).toEqual(expectedBlockGroup);
    }

    it('should return list item for unordered_list | *', () => {
        const listItem = createListItem([createListLevel('UL')]);
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);

        listItem.blocks.push(paragraph);
        runTest('* text', 'unordered_list', undefined, listItem);
    });

    it('should return list item for unordered_list | -', () => {
        const listItem = createListItem([createListLevel('UL')]);
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);

        listItem.blocks.push(paragraph);
        runTest('- text', 'unordered_list', undefined, listItem);
    });

    it('should return list item for unordered_list | +', () => {
        const listItem = createListItem([createListLevel('UL')]);
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);

        listItem.blocks.push(paragraph);
        runTest('+ text', 'unordered_list', undefined, listItem);
    });

    it('should return list item for ordered_list', () => {
        const listItem = createListItem([createListLevel('OL')]);
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);

        listItem.blocks.push(paragraph);
        runTest('1. text', 'ordered_list', undefined, listItem);
    });

    it('should return a second level list item for ordered_list', () => {
        const listItem = createListItem([createListLevel('OL'), createListLevel('OL')]);
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);

        listItem.blocks.push(paragraph);
        runTest('    1. text', 'ordered_list', undefined, listItem);
    });

    it('should return a second level list item for unordered_list | *', () => {
        const listItem = createListItem([createListLevel('UL'), createListLevel('UL')]);
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);

        listItem.blocks.push(paragraph);
        runTest('   * text', 'unordered_list', undefined, listItem);
    });

    it('should return a second level list item for unordered_list | -', () => {
        const listItem = createListItem([createListLevel('UL'), createListLevel('UL')]);
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);

        listItem.blocks.push(paragraph);
        runTest('   - text', 'unordered_list', undefined, listItem);
    });

    it('should return a second level list item for unordered_list | +', () => {
        const listItem = createListItem([createListLevel('UL'), createListLevel('UL')]);
        listItem.levels.push;
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);

        listItem.blocks.push(paragraph);
        runTest('   + text', 'unordered_list', undefined, listItem);
    });

    it('should return blockquote', () => {
        const blockquote = createFormatContainer('blockquote', {
            borderLeft: '3px solid rgb(200, 200, 200)',
            textColor: 'rgb(102, 102, 102)',
            marginTop: '1em',
            marginBottom: '1em',
            marginLeft: '40px',
            marginRight: '40px',
            paddingLeft: '10px',
        });
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);

        blockquote.blocks.push(paragraph);
        runTest('>text', 'blockquote', undefined, blockquote);
    });

    it('should return blockquote', () => {
        const blockquote = createFormatContainer('blockquote', DEFAULT_BLOCKQUOTE);
        const paragraph = createParagraph();
        const text = createText('First Blockquote');
        paragraph.segments.push(text);

        blockquote.blocks.push(paragraph);

        const secondBlockquote = createFormatContainer('blockquote', DEFAULT_BLOCKQUOTE);
        const secondParagraph = createParagraph();
        const secondText = createText('Second Blockquote');
        secondParagraph.segments.push(secondText);

        secondBlockquote.blocks.push(paragraph);
        secondBlockquote.blocks.push(secondParagraph);
        runTest('>Second Blockquote', 'blockquote', blockquote, secondBlockquote);
    });
});
