import { adjustHeading } from '../../../lib/markdownToModel/utils/adjustHeading';
import { ContentModelParagraphDecorator } from 'roosterjs-content-model-types';
import { createText } from 'roosterjs-content-model-dom';

describe('adjustHeading', () => {
    function runTest(text: string, tagName: string, expected: string) {
        // Arrange
        const textSegment = createText(text);
        const decorator: ContentModelParagraphDecorator = {
            tagName,
            format: {},
        };

        // Act
        const result = adjustHeading(textSegment, decorator);

        // Assert
        expect(result.text).toEqual(expected);
    }

    it('removes markdown heading from text - h1', () => {
        runTest('# Heading 1', 'h1', 'Heading 1');
    });

    it('removes markdown heading from text - h2', () => {
        runTest('## Heading 2', 'h2', 'Heading 2');
    });

    it('removes markdown heading from text - h3', () => {
        runTest('### Heading 3', 'h3', 'Heading 3');
    });

    it('removes markdown heading from text - h4', () => {
        runTest('#### Heading 4', 'h4', 'Heading 4');
    });

    it('removes markdown heading from text - h5', () => {
        runTest('##### Heading 5', 'h5', 'Heading 5');
    });

    it('removes markdown heading from text - h6', () => {
        runTest('###### Heading 6', 'h6', 'Heading 6');
    });

    it('does not remove markdown heading from text', () => {
        runTest('Heading 1', 'h1', 'Heading 1');
    });

    it('does not remove markdown heading from text - wrong heading', () => {
        runTest('# Heading 2', 'h2', '# Heading 2');
    });
});
