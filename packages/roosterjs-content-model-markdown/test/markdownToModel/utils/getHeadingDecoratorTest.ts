import { ContentModelParagraphDecorator } from 'roosterjs-content-model-types';
import { getHeadingDecorator } from '../../../lib/markdownToModel/utils/getHeadingDecorator';

describe('getHeadingDecorator', () => {
    function runTest(
        text: string,
        expectedHeadingType: ContentModelParagraphDecorator | undefined
    ) {
        // Act
        const result = getHeadingDecorator(text);

        // Assert
        expect(result).toEqual(expectedHeadingType);
    }

    it('should return undefined for empty text', () => {
        runTest('', undefined);
    });

    it('should return undefined for text without heading', () => {
        runTest('text without heading', undefined);
    });

    it('should return Heading1 for text with heading1', () => {
        runTest('# heading1', {
            tagName: 'h1',
            format: {
                fontWeight: 'bold',
                fontSize: '2em',
            },
        });
    });

    it('should return Heading2 for text with heading2', () => {
        runTest('## heading2', {
            tagName: 'h2',
            format: {
                fontWeight: 'bold',
                fontSize: '1.5em',
            },
        });
    });

    it('should return Heading3 for text with heading3', () => {
        runTest('### heading3', {
            tagName: 'h3',
            format: {
                fontWeight: 'bold',
                fontSize: '1.17em',
            },
        });
    });

    it('should return Heading4 for text with heading4', () => {
        runTest('#### heading4', {
            tagName: 'h4',
            format: {
                fontWeight: 'bold',
                fontSize: '1em',
            },
        });
    });

    it('should return Heading5 for text with heading5', () => {
        runTest('##### heading5', {
            tagName: 'h5',
            format: {
                fontWeight: 'bold',
                fontSize: '0.83em',
            },
        });
    });

    it('should return Heading6 for text with heading6', () => {
        runTest('###### heading6', {
            tagName: 'h6',
            format: {
                fontWeight: 'bold',
                fontSize: '0.67em',
            },
        });
    });

    it('should return Heading1 for text with heading1 and extra space', () => {
        runTest('# heading1 ', {
            tagName: 'h1',
            format: {
                fontWeight: 'bold',
                fontSize: '2em',
            },
        });
    });
});
