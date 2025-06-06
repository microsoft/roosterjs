import { applyTextFormatting } from '../../../lib/markdownToModel/appliers/applyTextFormatting';
import { ContentModelText } from 'roosterjs-content-model-types';
import { createText } from 'roosterjs-content-model-dom';

describe('applyTextFormatting', () => {
    function runTest(text: string, expectedSegments: ContentModelText[]) {
        // Arrange
        const textSegment = createText(text);

        // Act
        const result = applyTextFormatting(textSegment);

        // Assert
        expect(result).toEqual(expectedSegments);
    }

    it('No formatting ', () => {
        const textSegment = createText('No formatting ');
        runTest('No formatting ', [textSegment]);
    });

    it('Bold', () => {
        runTest('text in **bold**', [
            createText('text in '),
            createText('bold ', { fontWeight: 'bold' }),
        ]);
    });

    it('Italic', () => {
        runTest('text in *italic*', [
            createText('text in '),
            createText('italic ', { italic: true }),
        ]);
    });

    it('Bold and Italic', () => {
        runTest('text in ***bold and italic***', [
            createText('text in '),
            createText('bold and italic ', { fontWeight: 'bold', italic: true }),
        ]);
    });

    it('Multiple Bold and Italic', () => {
        runTest('text in ***bold and italic*** and **bold** and *italic*', [
            createText('text in '),
            createText('bold and italic ', { fontWeight: 'bold', italic: true }),
            createText(' and '),
            createText('bold ', { fontWeight: 'bold' }),
            createText(' and '),
            createText('italic ', { italic: true }),
        ]);
    });
});
