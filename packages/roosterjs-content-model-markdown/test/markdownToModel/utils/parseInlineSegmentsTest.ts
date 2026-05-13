import { parseInlineSegments } from '../../../lib/markdownToModel/utils/parseInlineSegments';
import type { ContentModelSegment } from 'roosterjs-content-model-types';

describe('parseInlineSegments', () => {
    function runTest(text: string, expected: ContentModelSegment[]) {
        // Arrange
        const segments: ContentModelSegment[] = [];

        // Act
        parseInlineSegments(text, segments);

        // Assert
        expect(segments).toEqual(expected);
    }

    it('should return no segments for empty text', () => {
        runTest('', []);
    });

    it('should parse plain text', () => {
        runTest('hello world', [
            {
                segmentType: 'Text',
                text: 'hello world',
                format: {},
            },
        ]);
    });

    it('should parse bold text', () => {
        runTest('**bold**', [
            {
                segmentType: 'Text',
                text: 'bold',
                format: { fontWeight: 'bold' },
            },
        ]);
    });

    it('should parse italic text', () => {
        runTest('*italic*', [
            {
                segmentType: 'Text',
                text: 'italic',
                format: { italic: true },
            },
        ]);
    });

    it('should parse strikethrough text', () => {
        runTest('~~strike~~', [
            {
                segmentType: 'Text',
                text: 'strike',
                format: { strikethrough: true },
            },
        ]);
    });

    it('should parse mixed plain and bold text', () => {
        runTest('hello **world**', [
            {
                segmentType: 'Text',
                text: 'hello ',
                format: {},
            },
            {
                segmentType: 'Text',
                text: 'world',
                format: { fontWeight: 'bold' },
            },
        ]);
    });

    it('should parse nested bold and italic', () => {
        runTest('**bold *and italic***', [
            {
                segmentType: 'Text',
                text: 'bold ',
                format: { fontWeight: 'bold' },
            },
            {
                segmentType: 'Text',
                text: 'and italic',
                format: { fontWeight: 'bold', italic: true },
            },
        ]);
    });

    it('should not toggle formatting when marker is followed by whitespace', () => {
        runTest('a * b', [
            {
                segmentType: 'Text',
                text: 'a * b',
                format: {},
            },
        ]);
    });

    it('should not toggle formatting when marker is at end of text', () => {
        runTest('hello *', [
            {
                segmentType: 'Text',
                text: 'hello *',
                format: {},
            },
        ]);
    });

    it('should parse a markdown link', () => {
        runTest('[text](https://example.com)', [
            {
                segmentType: 'Text',
                text: 'text',
                format: {},
                link: {
                    dataset: {},
                    format: { href: 'https://example.com', underline: true },
                },
            },
        ]);
    });

    it('should keep outer formatting state active inside a link', () => {
        runTest('**[link](https://example.com)**', [
            {
                segmentType: 'Text',
                text: 'link',
                format: { fontWeight: 'bold' },
                link: {
                    dataset: {},
                    format: { href: 'https://example.com', underline: true },
                },
            },
        ]);
    });

    it('should parse formatting inside a link', () => {
        runTest('[**bold**](https://example.com)', [
            {
                segmentType: 'Text',
                text: 'bold',
                format: { fontWeight: 'bold' },
                link: {
                    dataset: {},
                    format: { href: 'https://example.com', underline: true },
                },
            },
        ]);
    });

    it('should ignore link with invalid url', () => {
        runTest('[text](javascript:alert(1))', [
            {
                segmentType: 'Text',
                text: '[text](javascript:alert(1))',
                format: {},
            },
        ]);
    });

    it('should accept links with relative urls', () => {
        runTest('[text](./page)', [
            {
                segmentType: 'Text',
                text: 'text',
                format: {},
                link: {
                    dataset: {},
                    format: { href: './page', underline: true },
                },
            },
        ]);
    });

    it('should parse a markdown image', () => {
        runTest('![alt](https://example.com/img.png)', [
            {
                segmentType: 'Image',
                src: 'https://example.com/img.png',
                alt: 'alt',
                format: {},
                dataset: {},
            },
        ]);
    });

    it('should accept images with data url', () => {
        runTest('![alt](data:image/png;base64,abc)', [
            {
                segmentType: 'Image',
                src: 'data:image/png;base64,abc',
                alt: 'alt',
                format: {},
                dataset: {},
            },
        ]);
    });

    it('should ignore image with invalid url', () => {
        runTest('![alt](javascript:alert(1))', [
            {
                segmentType: 'Text',
                text: '![alt](javascript:alert(1))',
                format: {},
            },
        ]);
    });

    it('should parse text mixed with image', () => {
        runTest('see ![alt](https://example.com/img.png) here', [
            {
                segmentType: 'Text',
                text: 'see ',
                format: {},
            },
            {
                segmentType: 'Image',
                src: 'https://example.com/img.png',
                alt: 'alt',
                format: {},
                dataset: {},
            },
            {
                segmentType: 'Text',
                text: ' here',
                format: {},
            },
        ]);
    });

    it('should parse bold, italic and strikethrough combined', () => {
        runTest('**bold** *italic* ~~strike~~', [
            {
                segmentType: 'Text',
                text: 'bold',
                format: { fontWeight: 'bold' },
            },
            {
                segmentType: 'Text',
                text: ' ',
                format: {},
            },
            {
                segmentType: 'Text',
                text: 'italic',
                format: { italic: true },
            },
            {
                segmentType: 'Text',
                text: ' ',
                format: {},
            },
            {
                segmentType: 'Text',
                text: 'strike',
                format: { strikethrough: true },
            },
        ]);
    });

    it('should append to existing segments array', () => {
        const segments: ContentModelSegment[] = [{ segmentType: 'Text', text: 'pre ', format: {} }];

        parseInlineSegments('**bold**', segments);

        expect(segments).toEqual([
            { segmentType: 'Text', text: 'pre ', format: {} },
            { segmentType: 'Text', text: 'bold', format: { fontWeight: 'bold' } },
        ]);
    });

    it('should respect provided initial state', () => {
        const segments: ContentModelSegment[] = [];

        parseInlineSegments('hello', segments, {
            bold: true,
            italic: false,
            strikethrough: false,
        });

        expect(segments).toEqual([
            {
                segmentType: 'Text',
                text: 'hello',
                format: { fontWeight: 'bold' },
            },
        ]);
    });

    it('should apply provided link to plain text', () => {
        const segments: ContentModelSegment[] = [];

        parseInlineSegments(
            'hello',
            segments,
            { bold: false, italic: false, strikethrough: false },
            {
                dataset: {},
                format: { href: 'https://example.com', underline: true },
            }
        );

        expect(segments).toEqual([
            {
                segmentType: 'Text',
                text: 'hello',
                format: {},
                link: {
                    dataset: {},
                    format: { href: 'https://example.com', underline: true },
                },
            },
        ]);
    });
});
