import { ContentModelFormatContainer } from 'roosterjs-content-model-types';
import { createBlockQuoteFromMarkdown } from '../../../lib/markdownToModel/creators/createBlockQuoteFromMarkdown';
import { createFormatContainer, createParagraph, createText } from 'roosterjs-content-model-dom';
import { MarkdownToModelOptions } from '../../../lib/markdownToModel/types/MarkdownToModelOptions';

const DEFAULT_BLOCKQUOTE = {
    borderLeft: '3px solid rgb(200, 200, 200)',
    textColor: 'rgb(102, 102, 102)',
    marginTop: '1em',
    marginBottom: '1em',
    marginLeft: '40px',
    marginRight: '40px',
    paddingLeft: '10px',
};

describe('createBlockQuoteFromMarkdown', () => {
    function runTest(
        text: string,
        blockquote: ContentModelFormatContainer | undefined,
        expectedBlockquote: ContentModelFormatContainer,
        isRTL?: boolean
    ) {
        const options: MarkdownToModelOptions = isRTL
            ? {
                  direction: 'rtl',
              }
            : {};
        // Act
        const result = createBlockQuoteFromMarkdown(text, options, blockquote);
        expect(result).toEqual(expectedBlockquote);
    }

    it('should return blockquote with text', () => {
        const blockquote = createFormatContainer('blockquote', DEFAULT_BLOCKQUOTE);
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);
        blockquote.blocks.push(paragraph);
        runTest('>text', undefined, blockquote);
    });

    it('should append  blockquote with text ', () => {
        const blockquote = createFormatContainer('blockquote', DEFAULT_BLOCKQUOTE);
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.segments.push(text);
        blockquote.blocks.push(paragraph);

        const secondBlockquote = blockquote;
        const secondParagraph = createParagraph();
        const secondText = createText('text');
        secondParagraph.segments.push(secondText);

        secondBlockquote.blocks.push(secondParagraph);

        runTest('>text', secondBlockquote, blockquote);
    });

    it('should return blockquote with heading', () => {
        const blockquote = createFormatContainer('blockquote', DEFAULT_BLOCKQUOTE);
        const paragraph = createParagraph();
        const text = createText('text');
        paragraph.decorator = {
            tagName: 'h1',
            format: {
                fontSize: '2em',
                fontWeight: 'bold',
            },
        };
        paragraph.segments.push(text);
        blockquote.blocks.push(paragraph);
        runTest('># text', undefined, blockquote);
    });

    it('should return blockquote with heading - RTL', () => {
        const blockquote = createFormatContainer('blockquote', DEFAULT_BLOCKQUOTE);
        const paragraph = createParagraph();
        paragraph.format.direction = 'rtl';
        blockquote.format.direction = 'rtl';

        const text = createText('text');
        paragraph.decorator = {
            tagName: 'h1',
            format: {
                fontSize: '2em',
                fontWeight: 'bold',
            },
        };
        paragraph.segments.push(text);
        blockquote.blocks.push(paragraph);
        runTest('># text', undefined, blockquote, true /* isRTL */);
    });
});
