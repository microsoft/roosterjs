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

    it('Strikethrough', () => {
        runTest('text in ~~strikethrough~~', [
            createText('text in '),
            createText('strikethrough', { strikethrough: true }),
        ]);
    });

    it('Bold and Italic', () => {
        runTest('text in ***bold and italic***', [
            createText('text in '),
            createText('bold and italic ', { fontWeight: 'bold', italic: true }),
        ]);
    });

    it('Multiple Bold and Italic and Strikethrough', () => {
        runTest('text in ***bold and italic*** and **bold** and *italic*', [
            createText('text in '),
            createText('bold and italic ', { fontWeight: 'bold', italic: true }),
            createText(' and '),
            createText('bold ', { fontWeight: 'bold' }),
            createText(' and '),
            createText('italic ', { italic: true }),
        ]);
    });

    // Corner case tests
    it('Nested formatting - italic inside bold', () => {
        runTest('**bold *italic* bold**', [
            createText('bold ', { fontWeight: 'bold' }),
            createText('italic', { fontWeight: 'bold', italic: true }),
            createText(' bold', { fontWeight: 'bold' }),
        ]);
    });

    it('Nested formatting - bold inside italic', () => {
        runTest('*italic **bold** italic*', [
            createText('italic ', { italic: true }),
            createText('bold', { italic: true, fontWeight: 'bold' }),
            createText(' italic', { italic: true }),
        ]);
    });

    it('Complex nested formatting', () => {
        runTest('***a*bcd*e*fgh**', [
            createText('a', { fontWeight: 'bold', italic: true }),
            createText('bcd', { fontWeight: 'bold' }),
            createText('e', { fontWeight: 'bold', italic: true }),
            createText('fgh', { fontWeight: 'bold' }),
        ]);
    });

    it('Strikethrough with nested formatting', () => {
        runTest('~~strike **bold** strike~~', [
            createText('strike ', { strikethrough: true }),
            createText('bold', { strikethrough: true, fontWeight: 'bold' }),
            createText(' strike', { strikethrough: true }),
        ]);
    });

    it('All three formats nested', () => {
        runTest('***bold italic ~~strike~~***', [
            createText('bold italic ', { fontWeight: 'bold', italic: true }),
            createText('strike', { fontWeight: 'bold', italic: true, strikethrough: true }),
        ]);
    });

    it('Overlapping formats', () => {
        runTest('**bold ~~strike** end~~', [
            createText('bold ', { fontWeight: 'bold' }),
            createText('strike', { strikethrough: true }),
            createText(' end', { strikethrough: true }),
        ]);
    });

    it('Multiple consecutive markers', () => {
        runTest('****bold****', [createText('bold', { fontWeight: 'bold' })]);
    });

    it('Unmatched opening markers', () => {
        runTest('**bold without close', [createText('bold without close', { fontWeight: 'bold' })]);
    });

    it('Unmatched closing markers', () => {
        runTest('close without open**', [createText('close without open', { fontWeight: 'bold' })]);
    });

    it('Empty formatting', () => {
        runTest('****', []);
    });

    it('Single asterisk', () => {
        runTest('*', []);
    });

    it('Adjacent different formats', () => {
        runTest('**bold***italic*~~strike~~', [
            createText('bold', { fontWeight: 'bold' }),
            createText('italic', { italic: true }),
            createText('strike', { strikethrough: true }),
        ]);
    });

    it('Interleaved formats', () => {
        runTest('**bold ~~strike** more~~ end', [
            createText('bold ', { fontWeight: 'bold' }),
            createText('strike', { strikethrough: true }),
            createText(' more', { strikethrough: true }),
            createText(' end'),
        ]);
    });

    it('Triple nested formats', () => {
        runTest('***bold italic ~~all three~~ italic bold***', [
            createText('bold italic ', { fontWeight: 'bold', italic: true }),
            createText('all three', { fontWeight: 'bold', italic: true, strikethrough: true }),
            createText(' italic bold', { fontWeight: 'bold', italic: true }),
        ]);
    });

    it('Format at start and end', () => {
        runTest('**start** middle ~~end~~', [
            createText('start', { fontWeight: 'bold' }),
            createText(' middle '),
            createText('end', { strikethrough: true }),
        ]);
    });

    it('Only formatting markers', () => {
        runTest('******~~~~~~', []);
    });

    it('Mixed markers without content', () => {
        runTest('***~~***~~', []);
    });

    it('Content between same markers', () => {
        runTest('**bold** **more bold**', [
            createText('bold', { fontWeight: 'bold' }),
            createText(' '),
            createText('more bold', { fontWeight: 'bold' }),
        ]);
    });

    it('Partial markers', () => {
        runTest('text with * single asterisk and ~ single tilde', [
            createText('text with * single asterisk and ~ single tilde'),
        ]);
    });

    it('Escaped-like patterns (not actually escaped)', () => {
        runTest('\\**not bold\\**', [
            createText('\\'),
            createText('not bold\\', { fontWeight: 'bold' }),
        ]);
    });

    it('Complex realistic example', () => {
        runTest('This is **bold** and *italic* and ~~strikethrough~~ and ***all bold italic***', [
            createText('This is '),
            createText('bold', { fontWeight: 'bold' }),
            createText(' and '),
            createText('italic', { italic: true }),
            createText(' and '),
            createText('strikethrough', { strikethrough: true }),
            createText(' and '),
            createText('all bold italic', { fontWeight: 'bold', italic: true }),
        ]);
    });
});
