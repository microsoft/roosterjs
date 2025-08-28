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

    // Basic functionality verification
    it('Simple bold test', () => {
        runTest('**bold**', [createText('bold', { fontWeight: 'bold' })]);
    });

    it('Simple italic test', () => {
        runTest('*italic*', [createText('italic', { italic: true })]);
    });

    it('Opening marker with space should not format', () => {
        const originalSegment = createText('** bold**');
        runTest('** bold**', [originalSegment]);
    });

    it('Closing marker with space should still format', () => {
        runTest('**bold **', [createText('bold ', { fontWeight: 'bold' })]);
    });

    it('No formatting ', () => {
        const textSegment = createText('No formatting ');
        runTest('No formatting ', [textSegment]);
    });

    it('Bold', () => {
        runTest('text in **bold**', [
            createText('text in '),
            createText('bold', { fontWeight: 'bold' }),
        ]);
    });

    it('Italic', () => {
        runTest('text in *italic*', [
            createText('text in '),
            createText('italic', { italic: true }),
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
            createText('bold and italic', { fontWeight: 'bold', italic: true }),
        ]);
    });

    it('Multiple Bold and Italic and Strikethrough', () => {
        runTest('text in ***bold and italic*** and **bold** and *italic*', [
            createText('text in '),
            createText('bold and italic', { fontWeight: 'bold', italic: true }),
            createText(' and '),
            createText('bold', { fontWeight: 'bold' }),
            createText(' and '),
            createText('italic', { italic: true }),
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
            createText('strike', { fontWeight: 'bold', strikethrough: true }),
            createText(' end', { strikethrough: true }),
        ]);
    });

    it('Multiple consecutive markers', () => {
        runTest('****bold****', [createText('bold')]);
    });

    it('Unmatched opening markers', () => {
        runTest('**bold without close', [createText('bold without close', { fontWeight: 'bold' })]);
    });

    it('Unmatched closing markers', () => {
        runTest('close without open**', [createText('close without open**')]);
    });

    it('Empty formatting', () => {
        const originalSegment = createText('****');
        runTest('****', [originalSegment]);
    });

    it('Single asterisk', () => {
        const originalSegment = createText('*');
        runTest('*', [originalSegment]);
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
            createText('strike', { fontWeight: 'bold', strikethrough: true }),
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
        const originalSegment = createText('******~~~~~~');
        runTest('******~~~~~~', [originalSegment]);
    });

    it('Mixed markers without content', () => {
        const originalSegment = createText('***~~***~~');
        runTest('***~~***~~', [originalSegment]);
    });

    it('Many consecutive markers without content', () => {
        const originalSegment = createText('**********~~~~~~~~~~');
        runTest('**********~~~~~~~~~~', [originalSegment]);
    });

    it('Alternating markers without content', () => {
        // ~ characters are text content, not formatting markers
        // This should create alternating italic formatting on the ~ characters
        runTest('*~*~*~*~', [
            createText('~', { italic: true }),
            createText('~'),
            createText('~', { italic: true }),
            createText('~'),
        ]);
    });

    it('Content between same markers', () => {
        runTest('**bold** **more bold**', [
            createText('bold', { fontWeight: 'bold' }),
            createText(' '),
            createText('more bold', { fontWeight: 'bold' }),
        ]);
    });

    it('Partial markers', () => {
        // The * is followed by a space, so it should not open formatting
        const originalSegment = createText('text with * single asterisk and ~ single tilde');
        runTest('text with * single asterisk and ~ single tilde', [originalSegment]);
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

    // Whitespace validation tests for proper Markdown compliance
    describe('Whitespace validation tests', () => {
        it('Opening marker followed by space should not format - asterisk', () => {
            const originalSegment = createText('* hello*');
            runTest('* hello*', [originalSegment]);
        });

        it('Opening marker followed by space should not format - double asterisk', () => {
            const originalSegment = createText('** hello**');
            runTest('** hello**', [originalSegment]);
        });

        it('Opening marker followed by space should not format - strikethrough', () => {
            const originalSegment = createText('~~ hello~~');
            runTest('~~ hello~~', [originalSegment]);
        });

        it('Closing marker preceded by space should still format - asterisk', () => {
            runTest('*hello *', [createText('hello ', { italic: true })]);
        });

        it('Closing marker preceded by space should still format - double asterisk', () => {
            runTest('**hello **', [createText('hello ', { fontWeight: 'bold' })]);
        });

        it('Closing marker preceded by space should still format - strikethrough', () => {
            runTest('~~hello ~~', [createText('hello ', { strikethrough: true })]);
        });

        it('Both markers surrounded by spaces - should not format due to invalid opening', () => {
            const originalSegment = createText('** hello **');
            runTest('** hello **', [originalSegment]);
        });

        it('Mixed valid and invalid markers due to spaces', () => {
            runTest('**valid** but ** invalid ** and *also valid*', [
                createText('valid', { fontWeight: 'bold' }),
                createText(' but ** invalid ** and '),
                createText('also valid', { italic: true }),
            ]);
        });

        it('Tab character should be treated as whitespace', () => {
            const originalSegment = createText('**\thello**');
            runTest('**\thello**', [originalSegment]);
        });

        it('Newline character should be treated as whitespace', () => {
            const originalSegment = createText('**\nhello**');
            runTest('**\nhello**', [originalSegment]);
        });

        it('Multiple whitespace characters - opening invalid', () => {
            const originalSegment = createText('**  hello  **');
            runTest('**  hello  **', [originalSegment]);
        });

        it('Valid formatting with no spaces', () => {
            runTest('**bold**and*italic*and~~strike~~', [
                createText('bold', { fontWeight: 'bold' }),
                createText('and'),
                createText('italic', { italic: true }),
                createText('and'),
                createText('strike', { strikethrough: true }),
            ]);
        });

        it('Valid formatting with punctuation but no spaces', () => {
            runTest('**bold!** and *italic,* and ~~strike.~~', [
                createText('bold!', { fontWeight: 'bold' }),
                createText(' and '),
                createText('italic,', { italic: true }),
                createText(' and '),
                createText('strike.', { strikethrough: true }),
            ]);
        });

        it('Partial valid formatting - opening valid, closing with space still valid', () => {
            runTest('**hello ** world', [
                createText('hello ', { fontWeight: 'bold' }),
                createText(' world'),
            ]);
        });

        it('Partial valid formatting - opening invalid, closing valid', () => {
            const originalSegment = createText('** hello** world');
            runTest('** hello** world', [originalSegment]);
        });

        it('Nested formatting with space validation', () => {
            runTest('**bold *italic* bold**', [
                createText('bold ', { fontWeight: 'bold' }),
                createText('italic', { fontWeight: 'bold', italic: true }),
                createText(' bold', { fontWeight: 'bold' }),
            ]);
        });

        it('Nested formatting with invalid inner due to opening spaces', () => {
            runTest('**bold * invalid * bold**', [
                createText('bold * invalid * bold', { fontWeight: 'bold' }),
            ]);
        });

        it('Multiple consecutive spaces around markers - opening invalid', () => {
            const originalSegment = createText('**   hello   **');
            runTest('**   hello   **', [originalSegment]);
        });

        it('Mixed whitespace types - opening invalid', () => {
            const originalSegment = createText('** \t\nhello\t \n**');
            runTest('** \t\nhello\t \n**', [originalSegment]);
        });

        it('Valid opening with space in middle but valid closing', () => {
            runTest('**hello world**', [createText('hello world', { fontWeight: 'bold' })]);
        });

        it('Complex scenario with mixed valid and invalid patterns', () => {
            runTest('Start **valid** then ** invalid ** then *good* and * bad * end', [
                createText('Start '),
                createText('valid', { fontWeight: 'bold' }),
                createText(' then ** invalid ** then '),
                createText('good', { italic: true }),
                createText(' and * bad * end'),
            ]);
        });

        it('Strikethrough with space validation edge cases', () => {
            runTest('~~valid~~ but ~~ invalid ~~ text', [
                createText('valid', { strikethrough: true }),
                createText(' but ~~ invalid ~~ text'),
            ]);
        });

        it('All three formats with space validation', () => {
            runTest('**b** ~~ i ~~ *t* and ** bad ** ~~bad ~~ * bad *', [
                createText('b', { fontWeight: 'bold' }),
                createText(' ~~ i ~~ '),
                createText('t', { italic: true }),
                createText(' and ** bad ** '),
                createText('bad ', { strikethrough: true }),
                createText(' * bad *'),
            ]);
        });

        // Additional edge cases for closing behavior
        it('Valid opening followed by space in closing should still work', () => {
            runTest('**hello **', [createText('hello ', { fontWeight: 'bold' })]);
        });

        it('Mixed scenarios with spaces affecting only opening', () => {
            // The second * is followed by a space, so it should not open formatting
            runTest('*valid* but * invalid opening but valid closing *', [
                createText('valid', { italic: true }),
                createText(' but * invalid opening but valid closing *'),
            ]);
        });

        it('Comprehensive whitespace rule test', () => {
            // Opening markers followed by space = invalid
            // Closing markers preceded by space = still valid
            runTest('** invalid** but **valid ** and * invalid* but *valid *', [
                createText('** invalid** but '),
                createText('valid ', { fontWeight: 'bold' }),
                createText(' and * invalid* but '),
                createText('valid ', { italic: true }),
            ]);
        });

        it('Only markers without content should return original', () => {
            const originalSegment = createText('**~~**~~');
            runTest('**~~**~~', [originalSegment]);
        });

        it('Markers with only spaces should return original', () => {
            const originalSegment = createText('** ** ~~ ~~');
            runTest('** ** ~~ ~~', [originalSegment]);
        });

        it('Simple marker-only case verification', () => {
            const originalSegment = createText('****');
            runTest('****', [originalSegment]);
        });

        it('Mixed marker patterns with no content', () => {
            const originalSegment = createText('*~~***~~*');
            runTest('*~~***~~*', [originalSegment]);
        });

        it('Very long marker sequence', () => {
            const originalSegment = createText('**************~~~~~~~~~~~~~~');
            runTest('**************~~~~~~~~~~~~~~', [originalSegment]);
        });
    });
});
